import { useState, useRef } from "react";
import { Plus } from "lucide-react";
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

  const ROWS = 15;
  const COLS = 10;
  const DOT_SIZE = 8;
  const CELL_SIZE = 40;

  if (!isOpen) return null;

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
      setShapes([...shapes, newShape]);
      setSelectedShape(newShape.id);
    }
  };

  const handleShapeClick = (shapeId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedShape(shapeId);
  };

  const handleCornerMouseDown = (
    shapeId: string,
    corner: "topLeft" | "topRight" | "bottomLeft" | "bottomRight",
    e: React.MouseEvent
  ) => {
    e.stopPropagation();
    const shape = shapes.find((s) => s.id === shapeId);
    if (!shape) return;

    setResizing({
      shapeId,
      corner,
      startRow: shape.row,
      startCol: shape.col,
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!resizing) return;

    const grid = e.currentTarget;
    const rect = grid.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const col = Math.floor(x / CELL_SIZE);
    const row = Math.floor(y / CELL_SIZE);

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

  const handleMouseUp = () => {
    setResizing(null);
  };

  return (
    <>
      <div
        className="fixed inset-0 bg-black/50 z-40 animate-in fade-in"
        onClick={onClose}
      />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl max-w-[600px] w-full max-h-[90vh] overflow-auto">
          <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
            <h2 className="text-xl font-medium text-black/87">
              {placeName}
            </h2>
            <button
              onClick={onClose}
              className="text-black/60 hover:text-black transition-colors"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z"
                  fill="currentColor"
                />
              </svg>
            </button>
          </div>

          <div className="p-6">
            <div
              className="relative bg-white border-2 border-gray-200 rounded-lg p-4 overflow-auto"
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              style={{
                width: `${COLS * CELL_SIZE + 20}px`,
                height: `${ROWS * CELL_SIZE + 20}px`,
              }}
            >
              {/* Render dots */}
              {Array.from({ length: ROWS }).map((_, row) =>
                Array.from({ length: COLS }).map((_, col) => (
                  <div
                    key={`dot-${row}-${col}`}
                    className="absolute"
                    style={{
                      left: `${col * CELL_SIZE}px`,
                      top: `${row * CELL_SIZE}px`,
                      width: `${CELL_SIZE}px`,
                      height: `${CELL_SIZE}px`,
                    }}
                  >
                    {/* Dot */}
                    <div
                      className="absolute bg-gray-400 rounded-full cursor-pointer hover:bg-gray-600 transition-colors"
                      style={{
                        width: `${DOT_SIZE}px`,
                        height: `${DOT_SIZE}px`,
                        left: `${-DOT_SIZE / 2}px`,
                        top: `${-DOT_SIZE / 2}px`,
                      }}
                    />

                    {/* Plus button in cell center */}
                    <button
                      onClick={() => handleAddShape(row, col)}
                      className="absolute bg-gray-200 hover:bg-[#1976D2] hover:text-white rounded-full p-1 opacity-0 hover:opacity-100 transition-all"
                      style={{
                        left: `${CELL_SIZE / 2 - 12}px`,
                        top: `${CELL_SIZE / 2 - 12}px`,
                        width: "24px",
                        height: "24px",
                      }}
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                ))
              )}

              {/* Render shapes */}
              {shapes.map((shape) => (
                <div
                  key={shape.id}
                  className={cn(
                    "absolute border-2 rounded-lg transition-all cursor-pointer",
                    selectedShape === shape.id
                      ? "bg-[rgba(25,118,210,0.2)] border-[#1976D2]"
                      : "bg-[rgba(123,187,248,0.1)] border-[#6EB9FF]"
                  )}
                  style={{
                    left: `${shape.col * CELL_SIZE}px`,
                    top: `${shape.row * CELL_SIZE}px`,
                    width: `${shape.width * CELL_SIZE}px`,
                    height: `${shape.height * CELL_SIZE}px`,
                  }}
                  onClick={(e) => handleShapeClick(shape.id, e)}
                >
                  {/* Label */}
                  <div className="absolute bottom-1 right-1">
                    <span className="px-2 py-0.5 rounded-full border border-[#1976D2] text-[#1976D2] text-xs bg-white">
                      {shape.label}
                    </span>
                  </div>

                  {/* Corner resize handles (only when selected) */}
                  {selectedShape === shape.id && (
                    <>
                      {/* Top Left */}
                      <div
                        className="absolute bg-[#1976D2] rounded-full cursor-nw-resize"
                        style={{
                          width: `${DOT_SIZE}px`,
                          height: `${DOT_SIZE}px`,
                          left: `${-DOT_SIZE / 2}px`,
                          top: `${-DOT_SIZE / 2}px`,
                        }}
                        onMouseDown={(e) => handleCornerMouseDown(shape.id, "topLeft", e)}
                      />
                      {/* Top Right */}
                      <div
                        className="absolute bg-[#1976D2] rounded-full cursor-ne-resize"
                        style={{
                          width: `${DOT_SIZE}px`,
                          height: `${DOT_SIZE}px`,
                          right: `${-DOT_SIZE / 2}px`,
                          top: `${-DOT_SIZE / 2}px`,
                        }}
                        onMouseDown={(e) => handleCornerMouseDown(shape.id, "topRight", e)}
                      />
                      {/* Bottom Left */}
                      <div
                        className="absolute bg-[#1976D2] rounded-full cursor-sw-resize"
                        style={{
                          width: `${DOT_SIZE}px`,
                          height: `${DOT_SIZE}px`,
                          left: `${-DOT_SIZE / 2}px`,
                          bottom: `${-DOT_SIZE / 2}px`,
                        }}
                        onMouseDown={(e) => handleCornerMouseDown(shape.id, "bottomLeft", e)}
                      />
                      {/* Bottom Right */}
                      <div
                        className="absolute bg-[#1976D2] rounded-full cursor-se-resize"
                        style={{
                          width: `${DOT_SIZE}px`,
                          height: `${DOT_SIZE}px`,
                          right: `${-DOT_SIZE / 2}px`,
                          bottom: `${-DOT_SIZE / 2}px`,
                        }}
                        onMouseDown={(e) => handleCornerMouseDown(shape.id, "bottomRight", e)}
                      />
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
