import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";

interface GridCell {
  row: number;
  col: number;
  selected?: boolean;
  reserved?: boolean;
  label?: string;
}

interface GridSelectorProps {
  rows?: number;
  cols?: number;
  onSelectionChange?: (selected: GridCell[]) => void;
}

export default function GridSelector({
  rows = 20,
  cols = 10,
  onSelectionChange,
}: GridSelectorProps) {
  const [cells, setCells] = useState<GridCell[][]>(() => {
    const grid: GridCell[][] = [];
    for (let r = 0; r < rows; r++) {
      grid[r] = [];
      for (let c = 0; c < cols; c++) {
        grid[r][c] = {
          row: r,
          col: c,
          selected: false,
          reserved: false,
        };
      }
    }
    grid[2][1] = { row: 2, col: 1, selected: true };
    grid[2][2] = { row: 2, col: 2, selected: true };
    grid[2][3] = { row: 2, col: 3, selected: true };
    grid[2][4] = { row: 2, col: 4, selected: true };
    grid[2][5] = { row: 2, col: 5, selected: true };
    grid[3][1] = { row: 3, col: 1, selected: true };
    grid[3][2] = { row: 3, col: 2, selected: true };
    grid[3][3] = { row: 3, col: 3, selected: true };
    grid[3][4] = { row: 3, col: 4, selected: true };
    grid[3][5] = { row: 3, col: 5, selected: true };
    grid[4][3] = { row: 4, col: 3, label: "Название3", reserved: true };
    grid[7][2] = { row: 7, col: 2, selected: true };
    grid[7][3] = { row: 7, col: 3, label: "Название1", selected: true };
    grid[10][3] = { row: 10, col: 3, label: "Название2", reserved: true };
    return grid;
  });

  const [twaReady, setTwaReady] = useState(false);

  useEffect(() => {
    if (window.Telegram?.WebApp) {
      window.Telegram.WebApp.ready();
      setTwaReady(true);
    }
  }, []);

  const handleCellClick = (row: number, col: number) => {
    const cell = cells[row][col];
    if (cell.reserved) return;

    const newCells = [...cells];
    newCells[row][col] = {
      ...newCells[row][col],
      selected: !newCells[row][col].selected,
    };
    setCells(newCells);

    if (onSelectionChange) {
      const selected = newCells.flat().filter((c) => c.selected);
      onSelectionChange(selected);
    }

    // Haptic feedback from Telegram
    if (twaReady && window.Telegram?.WebApp?.HapticFeedback) {
      window.Telegram.WebApp.HapticFeedback.impactOccurred('light');
    }
  };

  return (
    <div className="w-full h-full bg-[#F8F8F8] overflow-auto p-4">
      <div 
        className="grid gap-1" 
        style={{ 
          gridTemplateColumns: `repeat(${cols}, minmax(40px, 1fr))`,
          maxWidth: '100%'
        }}
      >
        {cells.map((row, rowIndex) =>
          row.map((cell, colIndex) => {
            const hasLabel = !!cell.label;
            const isReserved = cell.reserved;
            const isSelected = cell.selected;

            return (
              <button
                key={`${rowIndex}-${colIndex}`}
                onClick={() => handleCellClick(rowIndex, colIndex)}
                disabled={isReserved}
                className={cn(
                  "w-10 h-10 rounded-md border-2 cursor-pointer transition-all duration-200 relative",
                  "hover:scale-105 active:scale-95",
                  "disabled:cursor-not-allowed",
                  isSelected && !isReserved
                    ? "bg-[#0088CC] border-[#0088CC] shadow-md"
                    : isReserved
                    ? "bg-[#FFF3CD] border-[#FFE69C]"
                    : "bg-white border-[#D9D9D9] hover:border-[#0088CC]"
                )}
                aria-pressed={isSelected}
                title={hasLabel ? cell.label : `Cell ${rowIndex}-${colIndex}`}
              >
                {hasLabel && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span
                      className={cn(
                        "text-[10px] font-semibold leading-tight text-center px-1 whitespace-nowrap overflow-hidden text-ellipsis",
                        isReserved ? "text-[#FF9800]" : "text-[#0088CC]"
                      )}
                    >
                      {cell.label.slice(0, 3)}
                    </span>
                  </div>
                )}
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}

declare global {
  interface Window {
    Telegram?: {
      WebApp: {
        ready: () => void;
        HapticFeedback?: {
          impactOccurred: (style: 'light' | 'medium' | 'heavy') => void;
        };
      };
    };
  }
}