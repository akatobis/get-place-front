import { useState, useRef, useEffect, useCallback } from "react";
import { Slider, Fab, Tooltip, Container, Modal, TextField, Typography, Box } from "@mui/material";
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Check as CheckIcon,
  AccessTime as ClockIcon,
  ContentCopy as ContentCopyIcon,
} from "@mui/icons-material";
import { DraggableShape } from "./DraggableShape";

interface Shape {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  title: string;
  label: string;
}

interface GridEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  placeName?: string;
}

const GRID_SIZE = 24;
const DOT_SIZE = 6;
const WORLD_COLS = 100;
const WORLD_ROWS = 100;
const WORLD_WIDTH = WORLD_COLS * GRID_SIZE;
const WORLD_HEIGHT = WORLD_ROWS * GRID_SIZE;
const MIN_SHAPE_CELLS = 2;
const MIN_ZOOM_PERCENT = 100;
const MAX_ZOOM_PERCENT = 200;

const COLORS = ["#6EB9FF", "#FFF8C7", "#A4B0FF", "#FFE0B2", "#C8E6C9"];

export default function GridEditorModal({
  isOpen,
  onClose,
  placeName = "Место",
}: GridEditorModalProps) {
  const [shapes, setShapes] = useState<Shape[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [resizingId, setResizingId] = useState<string | null>(null);
  const [resizeHandle, setResizeHandle] = useState<string | null>(null);

  const [zoom, setZoom] = useState(100); // %
  const zoomScale = zoom / 100;

  const [camera, setCamera] = useState({ x: 0, y: 0 });

  const [isPanning, setIsPanning] = useState(false);
  const panStartRef = useRef({ x: 0, y: 0, camX: 0, camY: 0 });

  const containerRef = useRef<HTMLDivElement | null>(null);
  const gridContainerRef = useRef<HTMLDivElement | null>(null);
  const dragStartRef = useRef({ x: 0, y: 0, shapeX: 0, shapeY: 0 });
  const resizeStartRef = useRef({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
    shapeX: 0,
    shapeY: 0,
  });

  const now = new Date();
  const pad = (n: number) => n.toString().padStart(2, '0');
  const [reservations, setReservations] = useState<Record<string, any[]>>({});
  const [openReservationList, setOpenReservationList] = useState(false);
  const [openReservationAdd, setOpenReservationAdd] = useState(false);
  const [reservationData, setReservationData] = useState({
    title: "",
    date: now.toISOString().slice(0, 10), // yyyy-mm-dd
    startTime: `${pad(now.getHours())}:${pad(now.getMinutes())}`, // HH:MM
    endTime: `${pad(now.getHours() + 1)}:${pad(now.getMinutes())}`, // HH:MM +1 час
  });

  useEffect(() => {
    if (openReservationAdd) {
      const now = new Date();
      const pad = (n: number) => n.toString().padStart(2, "0");

      setReservationData({
        title: "",
        date: now.toISOString().slice(0, 10),
        startTime: `${pad(now.getHours())}:${pad(now.getMinutes())}`,
        endTime: `${pad(now.getHours() + 1)}:${pad(now.getMinutes())}`,
      });
    }
  }, [openReservationAdd]);

  const deleteReservation = (id: string, index: number) => {
    setReservations(prev => ({
      ...prev,
      [id]: prev[id].filter((_, i) => i !== index),
    }));
  };

  const hasOverlap = (id: string, date: string, start: string, end: string) => {
    const slots = reservations[id] || [];

    const startM = Number(start.replace(":", ""));
    const endM = Number(end.replace(":", ""));

    return slots.some(slot => {
      if (slot.date !== date) return false;

      const s = Number(slot.start.replace(":", ""));
      const e = Number(slot.end.replace(":", ""));

      return startM < e && endM > s; 
    });
  };


  const snapToGrid = (value: number) =>
    Math.round(value / GRID_SIZE) * GRID_SIZE;

  const checkCollision = (newShape: Shape, excludeId: string): boolean =>
    shapes.some((shape) => {
      if (shape.id === excludeId) return false;
      return !(
        newShape.x + newShape.width <= shape.x ||
        newShape.x >= shape.x + shape.width ||
        newShape.y + newShape.height <= shape.y ||
        newShape.y >= shape.y + shape.height
      );
    });

  const clampShapeToWorld = (shape: Shape): Shape => {
    let { x, y, width, height } = shape;

    const minSize = MIN_SHAPE_CELLS * GRID_SIZE;
    if (width < minSize) width = minSize;
    if (height < minSize) height = minSize;

    const maxX = WORLD_WIDTH - width;
    const maxY = WORLD_HEIGHT - height;

    x = Math.max(0, Math.min(x, maxX));
    y = Math.max(0, Math.min(y, maxY));

    return { ...shape, x, y, width, height };
  };

  const addShape = useCallback(() => {
    const id = `shape-${Date.now()}`;
    const baseX = snapToGrid(100);
    const baseY = snapToGrid(100);

    const newShape: Shape = {
      id,
      x: baseX,
      y: baseY,
      width: MIN_SHAPE_CELLS * GRID_SIZE,
      height: MIN_SHAPE_CELLS * GRID_SIZE,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      title: placeName,
      label: placeName,
    };

    const clamped = clampShapeToWorld(newShape);
    if (!checkCollision(clamped, id)) {
      setShapes((prev) => [...prev, clamped]);
      setSelectedId(id);
    }
  }, [placeName, shapes]);

  const deleteShape = useCallback(() => {
    if (!selectedId) return;
    setShapes((prev) => prev.filter((s) => s.id !== selectedId));
    setSelectedId(null);
  }, [selectedId]);

  const copyShape = useCallback(() => {
    if (!selectedId) return;
    const original = shapes.find((s) => s.id === selectedId);
    if (!original) return;

    const id = `shape-${Date.now()}`;
    const offset = GRID_SIZE * 2;
    let clone: Shape = {
      ...original,
      id,
      x: snapToGrid(original.x + offset),
      y: snapToGrid(original.y + offset),
    };
    clone = clampShapeToWorld(clone);
    if (!checkCollision(clone, id)) {
      setShapes((prev) => [...prev, clone]);
      setSelectedId(id);
    }
  }, [selectedId, shapes]);

  const confirmShape = useCallback(() => {
    setSelectedId(null);
  }, []);

  const reserveShape = useCallback(() => {
    if (!selectedId) return;
    setOpenReservationList(true);
  }, [selectedId]);

  const handleReservationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setReservationData(prev => ({ ...prev, [name]: value }));
  };

  const handleReservationSubmit = () => {
    if (!selectedId) return;

    const { title, date, startTime, endTime } = reservationData;

    if (!date || !startTime || !endTime) {
      alert("Заполните дату и время.");
      return;
    }

    const finalTitle = title.trim() ? title : "Без имени";

    const now = new Date();
    now.setSeconds(0, 0); 
    const fiveMinutesLater = new Date(now.getTime() - 5 * 60 * 1000); 
    const selectedDateTimeStart = new Date(`${date}T${startTime}`);
    if (selectedDateTimeStart < fiveMinutesLater) {
      alert("Нельзя бронировать на прошедшее время (минимум 5 минут назад).");
      return;
    }

    if (endTime <= startTime) {
      alert("Время окончания должно быть больше времени начала.");
      return;
    }

    if (hasOverlap(selectedId, date, startTime, endTime)) {
      alert("Этот временной интервал пересекается с существующим бронированием на эту дату.");
      return;
    }

    setReservations(prev => {
      const updated = {
        ...prev,
        [selectedId]: [
          ...(prev[selectedId] || []),
          {
            title: finalTitle,
            date,
            start: startTime,
            end: endTime,
          },
        ],
      };

      updated[selectedId].sort((a, b) => {
        const d1 = a.date.localeCompare(b.date);
        if (d1 !== 0) return d1;

        return a.start.localeCompare(b.start);
      });

      return updated;
    });

    setReservationData({ title: "", date: "", startTime: "", endTime: "" });

    setOpenReservationAdd(false);
    setOpenReservationList(true);
  };

  const handleShapeMouseDown = (
    e: React.MouseEvent<HTMLDivElement>,
    shapeId: string,
    handle?: string
  ) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedId(shapeId);

    const shape = shapes.find((s) => s.id === shapeId);
    if (!shape) return;

    if (handle) {
      setResizingId(shapeId);
      setResizeHandle(handle);
      resizeStartRef.current = {
        x: e.clientX,
        y: e.clientY,
        width: shape.width,
        height: shape.height,
        shapeX: shape.x,
        shapeY: shape.y,
      };
    } else {
      setDraggingId(shapeId);
      dragStartRef.current = {
        x: e.clientX,
        y: e.clientY,
        shapeX: shape.x,
        shapeY: shape.y,
      };
    }
  };

  const handleZoomChange = (
    _: Event | React.SyntheticEvent,
    value: number | number[]
  ) => {
    const newZoom = Array.isArray(value) ? value[0] : value;
    const clamped = Math.max(MIN_ZOOM_PERCENT, Math.min(MAX_ZOOM_PERCENT, newZoom));
    const newScale = clamped / 100;

    if (!containerRef.current) {
      setZoom(clamped);
      return;
    }

    const viewWidth = containerRef.current.clientWidth;
    const viewHeight = containerRef.current.clientHeight;

    const maxCamX = Math.max(0, WORLD_WIDTH - viewWidth / newScale);
    const maxCamY = Math.max(0, WORLD_HEIGHT - viewHeight / newScale);

    setZoom(clamped);
    setCamera((prev) => ({
      x: Math.min(Math.max(0, prev.x), maxCamX),
      y: Math.min(Math.max(0, prev.y), maxCamY),
    }));
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const scale = zoom / 100;

      if (isPanning) {
        const deltaX = e.clientX - panStartRef.current.x;
        const deltaY = e.clientY - panStartRef.current.y;

        let newCamX = panStartRef.current.camX - deltaX / scale;
        let newCamY = panStartRef.current.camY - deltaY / scale;

        const viewWidth = containerRef.current.clientWidth;
        const viewHeight = containerRef.current.clientHeight;
        const maxCamX = Math.max(0, WORLD_WIDTH - viewWidth / scale);
        const maxCamY = Math.max(0, WORLD_HEIGHT - viewHeight / scale);

        newCamX = Math.min(Math.max(0, newCamX), maxCamX);
        newCamY = Math.min(Math.max(0, newCamY), maxCamY);

        setCamera({ x: newCamX, y: newCamY });
        return;
      }

      if (draggingId) {
        const shape = shapes.find((s) => s.id === draggingId);
        if (!shape) return;

        const deltaX = (e.clientX - dragStartRef.current.x) / scale;
        const deltaY = (e.clientY - dragStartRef.current.y) / scale;

        let newX = snapToGrid(dragStartRef.current.shapeX + deltaX);
        let newY = snapToGrid(dragStartRef.current.shapeY + deltaY);

        const maxX = WORLD_WIDTH - shape.width;
        const maxY = WORLD_HEIGHT - shape.height;

        newX = Math.max(0, Math.min(newX, maxX));
        newY = Math.max(0, Math.min(newY, maxY));

        const updated: Shape = { ...shape, x: newX, y: newY };
        if (!checkCollision(updated, draggingId)) {
          setShapes((prev) =>
            prev.map((s) => (s.id === draggingId ? updated : s))
          );
        }
      }

      if (resizingId && resizeHandle) {
        const shape = shapes.find((s) => s.id === resizingId);
        if (!shape) return;

        const deltaX = (e.clientX - resizeStartRef.current.x) / scale;
        const deltaY = (e.clientY - resizeStartRef.current.y) / scale;

        let newWidth = resizeStartRef.current.width;
        let newHeight = resizeStartRef.current.height;
        let newX = resizeStartRef.current.shapeX;
        let newY = resizeStartRef.current.shapeY;

        switch (resizeHandle) {
          case "se":
            newWidth = resizeStartRef.current.width + deltaX;
            newHeight = resizeStartRef.current.height + deltaY;
            break;
          case "sw":
            newX = resizeStartRef.current.shapeX + deltaX;
            newWidth = resizeStartRef.current.width - deltaX;
            newHeight = resizeStartRef.current.height + deltaY;
            break;
          case "ne":
            newY = resizeStartRef.current.shapeY + deltaY;
            newWidth = resizeStartRef.current.width + deltaX;
            newHeight = resizeStartRef.current.height - deltaY;
            break;
          case "nw":
            newX = resizeStartRef.current.shapeX + deltaX;
            newY = resizeStartRef.current.shapeY + deltaY;
            newWidth = resizeStartRef.current.width - deltaX;
            newHeight = resizeStartRef.current.height - deltaY;
            break;
        }

        const minSize = MIN_SHAPE_CELLS * GRID_SIZE;
        newWidth = snapToGrid(Math.max(minSize, newWidth));
        newHeight = snapToGrid(Math.max(minSize, newHeight));
        newX = snapToGrid(newX);
        newY = snapToGrid(newY);

        newX = Math.max(0, Math.min(newX, WORLD_WIDTH - newWidth));
        newY = Math.max(0, Math.min(newY, WORLD_HEIGHT - newHeight));

        const updated: Shape = { ...shape, x: newX, y: newY, width: newWidth, height: newHeight };
        if (!checkCollision(updated, resizingId)) {
          setShapes((prev) =>
            prev.map((s) => (s.id === resizingId ? updated : s))
          );
        }
      }
    };

    const handleMouseUp = () => {
      setDraggingId(null);
      setResizingId(null);
      setResizeHandle(null);
      setIsPanning(false);
    };

    if (draggingId || resizingId || isPanning) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [draggingId, resizingId, resizeHandle, isPanning, zoom, shapes]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col items-center">
      {/* Header */}
      <div className="w-full max-w-[400px] bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            className="text-black/60 hover:text-black transition-colors"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path
                d="M15 18L9 12L15 6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <h2 className="text-lg font-medium">Grid</h2>
        </div>
      </div>

      {/* Canvas */}
      <div
        className="flex-1 relative overflow-hidden w-full max-w-[400px] bg-gray-50" 
        ref={containerRef}
        onMouseDown={(e) => {
          const target = e.target as HTMLElement;
          if (target == containerRef.current || target == gridContainerRef.current) {
            setSelectedId(null);
            setIsPanning(true);
            panStartRef.current = {
              x: e.clientX,
              y: e.clientY,
              camX: camera.x,
              camY: camera.y,
            };
          }
        }}
      >
        {/* Мировое полотно c точками */}
        <div
          ref={gridContainerRef}
          style={{
            position: "absolute",
            left: -camera.x * zoomScale,
            top: -camera.y * zoomScale,
            width: WORLD_WIDTH * zoomScale,
            height: WORLD_HEIGHT * zoomScale,
            minWidth: containerRef.current?.clientWidth ?? 0,
            minHeight: containerRef.current?.clientHeight ?? 0,
            transformOrigin: "0 0",
            transform: `scale(${zoomScale})`,
            backgroundColor: "#ffffff",
            backgroundImage: `radial-gradient(circle, #9CA3AF ${DOT_SIZE / 2}px, transparent ${DOT_SIZE / 2}px)`,
            backgroundSize: `${GRID_SIZE}px ${GRID_SIZE}px`,
            backgroundPosition: "0 0",
            cursor: isPanning ? "grabbing" : selectedId ? "grab" : "default",
          }}
        >
          {shapes.map((shape) => (
            <div key={shape.id} data-shape="true">
              <DraggableShape
                shape={shape}
                isSelected={shape.id === selectedId}
                onMouseDown={handleShapeMouseDown}
              />
            </div>
          ))}
        </div>

        {/* Зум‑слайдер справа */}
        <div className="absolute right-4 top-1/2 -translate-y-1/2 z-10">
          <Slider
            orientation="vertical"
            min={MIN_ZOOM_PERCENT}
            max={MAX_ZOOM_PERCENT}
            step={10}
            size="medium"
            value={zoom}
            onChange={handleZoomChange}
            valueLabelDisplay="auto"
            valueLabelFormat={(value) => `${value}%`}
            sx={{
              height: "162px",
              width: "6px",
              "& .MuiSlider-track": {
                backgroundColor: "#0088CC",
              },
              "& .MuiSlider-rail": {
                backgroundColor: "#e5e7eb",
              },
              "& .MuiSlider-thumb": {
                backgroundColor: "#0088CC",
                boxShadow: "0 2px 4px rgba(0, 136, 204, 0.2)",
              },
              "& .MuiSlider-mark": {
                display: "none",
              },
            }}
          />
        </div>

        {/* FAB‑кнопки снизу справа */}
        <div className="absolute bottom-8 right-8 flex flex-col-reverse gap-3 items-center z-20">
          {selectedId ? (
            <>
              <Tooltip title="Подтвердить">
                <Fab color="primary" aria-label="check" onClick={confirmShape}>
                  <CheckIcon />
                </Fab>
              </Tooltip>
              <Tooltip title="Удалить выделенную фигуру">
                <Fab
                  sx={{
                    backgroundColor: "white",
                    "&:hover": { backgroundColor: "#f5f5f5" },
                  }}
                  aria-label="delete"
                  onClick={deleteShape}
                >
                  <DeleteIcon />
                </Fab>
              </Tooltip>
              <Tooltip title="Копировать выделенную фигуру">
                <Fab
                  sx={{
                    backgroundColor: "white",
                    "&:hover": { backgroundColor: "#f5f5f5" },
                  }}
                  aria-label="copy"
                  onClick={copyShape}
                >
                  <ContentCopyIcon />
                </Fab>
              </Tooltip>
              <Tooltip title="Зарезервировать выделенную фигуру">
                <Fab
                  sx={{
                    backgroundColor: "white",
                    "&:hover": { backgroundColor: "#f5f5f5" },
                  }}
                  aria-label="reserve"
                  onClick={reserveShape}
                >
                  <ClockIcon />
                </Fab>
              </Tooltip>
            </>
          ) : (
            <Tooltip title="Добавить фигуру">
              <Fab color="primary" aria-label="add" onClick={addShape}>
                <AddIcon />
              </Fab>
            </Tooltip>
          )}
        </div>

        <Modal
          open={openReservationList}
          onClose={() => setOpenReservationList(false)}
        >
          <Container
            sx={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              padding: 2,
              width: "100%",
              maxWidth: "400px",
              backgroundColor: "white",
              borderRadius: 2,
              boxShadow: 3,
            }}
          >
            <Typography variant="h6" sx={{ mb: 2 }}>
              Бронирования: {shapes.find(s => s.id === selectedId)?.title}
            </Typography>

            {reservations[selectedId || ""]?.length ? (
              reservations[selectedId || ""].map((r, i) => (
                <Box
                  key={i}
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 1.5,
                    p: 1,
                    borderRadius: 1,
                    backgroundColor: "#f8f9fa",
                  }}
                >
                  <Typography>
                    <b>{r.date.slice(5)}</b> • {r.start}–{r.end} — {r.title}
                  </Typography>
                  <DeleteIcon
                    sx={{ cursor: "pointer" }}
                    onClick={() => deleteReservation(selectedId!, i)}
                  />
                </Box>
              ))
            ) : (
              <Typography sx={{ mb: 2, opacity: 0.6 }}>
                Нет бронирований
              </Typography>
            )}

            <button
              onClick={() => {
                setOpenReservationList(false);
                setOpenReservationAdd(true);
              }}
              className="w-full px-4 py-2 rounded bg-blue-600 text-white"
            >
              Добавить бронирование
            </button>
          </Container>
        </Modal>

        {/* Reservation ADD */}
        <Modal
          open={openReservationAdd}
          onClose={() => setOpenReservationAdd(false)}
        >
          <Container
            sx={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              padding: 2,
              width: "100%",
              maxWidth: "400px",
              backgroundColor: "white",
              borderRadius: 2,
              boxShadow: 3,
            }}
          >
            <Typography variant="h6">
              Добавить бронирование
            </Typography>
            
            <TextField
              fullWidth
              label="Дата"
              type="date"
              name="date"
              value={reservationData.date}
              onChange={handleReservationChange}
              InputLabelProps={{ shrink: true }}
              inputProps={{
                min: now.toISOString().slice(0, 10), // запрещаем прошлые даты
              }}
              sx={{ mt: 2 }}
            />

            <TextField
              fullWidth
              label="Начало"
              type="time"
              name="startTime"
              value={reservationData.startTime}
              onChange={handleReservationChange}
              InputLabelProps={{ shrink: true }}
              inputProps={{
                min:
                  reservationData.date === now.toISOString().slice(0, 10)
                    ? `${pad(now.getHours())}:${pad(now.getMinutes())}` // запрещаем прошлое время сегодня
                    : undefined,
              }}
              sx={{ mt: 2 }}
            />

            <TextField
              fullWidth
              label="Окончание"
              type="time"
              name="endTime"
              value={reservationData.endTime}
              onChange={handleReservationChange}
              InputLabelProps={{ shrink: true }}
              inputProps={{
                min: reservationData.startTime, // конец не может быть раньше начала
              }}
              sx={{ mt: 2 }}
            />

            <TextField
              fullWidth
              label="Название"
              name="title"
              value={reservationData.title}
              onChange={handleReservationChange}
              InputLabelProps={{ shrink: true }}
              sx={{ mt: 2 }}
            />

            <Box sx={{ mt: 3, display: "flex", justifyContent: "flex-end" }}>
              <button
                onClick={() => setOpenReservationAdd(false)}
                className="mr-2 px-4 py-2 rounded border border-gray-300 text-sm"
              >
                Отмена
              </button>
              <button
                onClick={handleReservationSubmit}
                className="px-4 py-2 rounded bg-blue-600 text-white text-sm"
              >
                Сохранить
              </button>
            </Box>
          </Container>
        </Modal>
      </div>
    </div>
  );
}