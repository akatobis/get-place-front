import { useState, useRef, useEffect } from "react";
import { Plus, Trash2, Clock, Copy } from "lucide-react";
import { Slider } from "@mui/material";
import { cn } from "@/lib/utils";

interface Shape {
  id: string;
  row: number;
  col: number;
  width: number;
  height: number;
  label: string;
}

interface GridEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  placeName?: string;
}

export default function GridEditorModal({
  isOpen,
  onClose,
  placeName = "Место",
}: GridEditorModalProps) {
  const [shapes, setShapes] = useState<Shape[]>([]);
  const [selectedShape, setSelectedShape] = useState<string | null>(null);
  const [resizing, setResizing] = useState<{
    shapeId: string;
    corner: "topLeft" | "topRight" | "bottomLeft" | "bottomRight";
    startRow: number;
    startCol: number;
  } | null>(null);

  const ROWS = 100;
  const COLS = 100;

  const MIN_ZOOM = 0.3;
  const MAX_ZOOM = 3;

  const containerRef = useRef<HTMLDivElement | null>(null);
  const [cellSize, setCellSize] = useState<number>(24);
  const [dotSize, setDotSize] = useState<number>(6);

  const isPanningRef = useRef(false);
  const lastPointerRef = useRef<{ x: number; y: number } | null>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [scale, setScale] = useState(1);

  useEffect(() => {
    if (!isOpen) return;

    const computeSizes = () => {
      const viewport = containerRef.current;
      if (!viewport) return;
      const vw = Math.min(viewport.clientWidth, 400);
      const computedCell = Math.max(12, Math.floor(vw / 10));
      const computedDot = Math.max(4, Math.round(computedCell * 0.15));
      setCellSize(computedCell);
      setDotSize(computedDot);

      const fullWidth = COLS * computedCell;
      const fullHeight = ROWS * computedCell;
      setOffset({
        x: (viewport.clientWidth - fullWidth * scale) / 2,
        y: (viewport.clientHeight - fullHeight * scale) / 2,
      });
    };

    computeSizes();
    const onResize = () => computeSizes();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [isOpen]);

  if (!isOpen) return null;

  const handlePointerDown = (e: React.PointerEvent) => {
    const target = e.currentTarget;
    (target as Element).setPointerCapture?.(e.pointerId);
    isPanningRef.current = true;
    lastPointerRef.current = { x: e.clientX, y: e.clientY };
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isPanningRef.current || !lastPointerRef.current) return;
    const last = lastPointerRef.current;
    const dx = e.clientX - last.x;
    const dy = e.clientY - last.y;
    lastPointerRef.current = { x: e.clientX, y: e.clientY };

    const viewport = containerRef.current;
    if (!viewport) return;

    const canvasWidth = COLS * cellSize;
    const canvasHeight = ROWS * cellSize;
    const scaledWidth = canvasWidth * scale;
    const scaledHeight = canvasHeight * scale;

    const minX = viewport.clientWidth - scaledWidth;
    const maxX = 0;
    const minY = viewport.clientHeight - scaledHeight;
    const maxY = 0;

    setOffset((prev) => {
      const newX = Math.max(minX, Math.min(maxX, prev.x + dx));
      const newY = Math.max(minY, Math.min(maxY, prev.y + dy));
      return { x: newX, y: newY };
    });
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    try {
      (e.currentTarget as Element).releasePointerCapture?.(e.pointerId);
    } catch {}
    isPanningRef.current = false;
    lastPointerRef.current = null;
  };

  const handleZoomChange = (newZoom: number) => {
    const viewport = containerRef.current;
    if (!viewport) return;

    const canvasWidth = COLS * cellSize;
    const canvasHeight = ROWS * cellSize;

    const minZoomX = viewport.clientWidth / canvasWidth;
    const minZoomY = viewport.clientHeight / canvasHeight;
    const minZoomRequired = Math.max(minZoomX, minZoomY);

    const clampedZoom = Math.max(
      minZoomRequired,
      Math.min(MAX_ZOOM, newZoom)
    );

    setScale(clampedZoom);

    const scaledWidth = canvasWidth * clampedZoom;
    const scaledHeight = canvasHeight * clampedZoom;

    const minX = viewport.clientWidth - scaledWidth;
    const maxX = 0;
    const minY = viewport.clientHeight - scaledHeight;
    const maxY = 0;

    setOffset((prev) => ({
      x: Math.max(minX, Math.min(maxX, prev.x)),
      y: Math.max(minY, Math.min(maxY, prev.y)),
    }));
  };

  const dots: JSX.Element[] = [];
  for (let r = 0; r <= ROWS; r++) {
    for (let c = 0; c <= COLS; c++) {
      const left = c * cellSize;
      const top = r * cellSize;
      dots.push(
        <div
          key={`dot-${r}-${c}`}
          style={{
            position: "absolute",
            left: `${left}px`,
            top: `${top}px`,
            width: `${dotSize}px`,
            height: `${dotSize}px`,
            marginLeft: `${-dotSize / 2}px`,
            marginTop: `${-dotSize / 2}px`,
            borderRadius: "50%",
            background: "#9CA3AF",
            pointerEvents: "none",
          }}
        />
      );
    }
  }

  const canvasWidth = COLS * cellSize;
  const canvasHeight = ROWS * cellSize;

  const handleAddShape = (row: number, col: number) => {
    if (resizing) return;
    const overlapping = shapes.some((shape) => {
      return (
        row >= shape.row &&
        row < shape.row + shape.height &&
        col >= shape.col &&
        col < shape.col + shape.width
      );
    });
    if (!overlapping) {
      const newShape: Shape = {
        id: `shape-${Date.now()}`,
        row,
        col,
        width: 1,
        height: 1,
        label: placeName,
      };
      setShapes((s) => [...s, newShape]);
      setSelectedShape(newShape.id);
    }
  };

  const handleCanvasClick = (e: React.MouseEvent) => {
    const container = e.currentTarget as HTMLDivElement;
    const rect = container.getBoundingClientRect();
    const x = (e.clientX - rect.left - offset.x) / scale;
    const y = (e.clientY - rect.top - offset.y) / scale;
    const col = Math.floor(x / cellSize);
    const row = Math.floor(y / cellSize);
    if (row >= 0 && row < ROWS && col >= 0 && col < COLS) handleAddShape(row, col);
  };

  const handleShapeClick = (shapeId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedShape(shapeId);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!resizing) return;
    const grid = e.currentTarget as HTMLDivElement;
    const rect = grid.getBoundingClientRect();
    const x = (e.clientX - rect.left - offset.x) / scale;
    const y = (e.clientY - rect.top - offset.y) / scale;
    const col = Math.floor(x / cellSize);
    const row = Math.floor(y / cellSize);
    const shape = shapes.find((s) => s.id === resizing.shapeId);
    if (!shape) return;

    const newShapes = shapes.map((s) => {
      if (s.id !== resizing.shapeId) return s;
      let newRow = s.row;
      let newCol = s.col;
      let newWidth = s.width;
      let newHeight = s.height;

      if (resizing.corner === "bottomRight") {
        newWidth = Math.max(1, col - s.col + 1);
        newHeight = Math.max(1, row - s.row + 1);
      } else if (resizing.corner === "bottomLeft") {
        const newLeft = Math.min(col, s.col + s.width - 1);
        newWidth = s.col + s.width - newLeft;
        newCol = newLeft;
        newHeight = Math.max(1, row - s.row + 1);
      } else if (resizing.corner === "topRight") {
        const newTop = Math.min(row, s.row + s.height - 1);
        newHeight = s.row + s.height - newTop;
        newRow = newTop;
        newWidth = Math.max(1, col - s.col + 1);
      } else if (resizing.corner === "topLeft") {
        const newTop = Math.min(row, s.row + s.height - 1);
        const newLeft = Math.min(col, s.col + s.width - 1);
        newHeight = s.row + s.height - newTop;
        newWidth = s.col + s.width - newLeft;
        newRow = newTop;
        newCol = newLeft;
      }

      return { ...s, row: newRow, col: newCol, width: newWidth, height: newHeight };
    });

    setShapes(newShapes);
  };

  const handleMouseUp = () => setResizing(null);

  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col items-center">
      <div className="w-full max-w-[400px] bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            className="text-black/60 hover:text-black transition-colors"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <h2 className="text-lg font-medium">{placeName} — Grid</h2>
        </div>
      </div>

      <div className="flex-1 relative overflow-hidden w-full max-w-[400px] bg-gray-50" ref={containerRef}>
        <div
          className="absolute left-0 top-0"
          style={{
            transform: `translate(${offset.x}px, ${offset.y}px) scale(${scale})`,
            transformOrigin: "top left",
            width: `${canvasWidth}px`,
            height: `${canvasHeight}px`,
            touchAction: "none",
            cursor: isPanningRef.current ? "grabbing" : "grab",
          }}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          onClick={handleCanvasClick}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
        >
          <div
            style={{
              position: "relative",
              width: `${canvasWidth}px`,
              height: `${canvasHeight}px`,
              background: "transparent",
            }}
          >
            {dots}

            {shapes.map((shape) => (
              <div
                key={shape.id}
                onClick={(e) => handleShapeClick(shape.id, e)}
                className={cn(
                  "absolute border-2 rounded-lg transition-all",
                  selectedShape === shape.id ? "bg-[rgba(25,118,210,0.15)] border-[#1976D2]" : "bg-[rgba(123,187,248,0.08)] border-[#6EB9FF]"
                )}
                style={{
                  left: `${shape.col * cellSize}px`,
                  top: `${shape.row * cellSize}px`,
                  width: `${shape.width * cellSize}px`,
                  height: `${shape.height * cellSize}px`,
                }}
              >
                <div className="absolute bottom-1 right-1">
                  <span className="px-2 py-0.5 rounded-full border border-[#1976D2] text-[#1976D2] text-xs bg-white">
                    {shape.label}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="absolute right-4 top-1/2 -translate-y-1/2 z-10">
          <Slider
            orientation="vertical"
            min={MIN_ZOOM}
            max={MAX_ZOOM}
            step={0.1}
            size="medium"
            value={scale}
            onChange={(_, value) => handleZoomChange(Array.isArray(value) ? value[0] : value)}
            valueLabelDisplay="auto"
            valueLabelFormat={(value) => `${Math.round(value * 100)}%`}
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
      </div>
    </div>
  );
}
