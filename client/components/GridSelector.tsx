import { cn } from "@/lib/utils";
import { useState } from "react";

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

  const [selectionStart, setSelectionStart] = useState<{
    row: number;
    col: number;
  } | null>(null);

  const handleCellClick = (row: number, col: number) => {
    const newCells = [...cells];
    newCells[row][col] = {
      ...newCells[row][col],
      selected: !newCells[row][col].selected,
    };
    setCells(newCells);

    if (onSelectionChange) {
      const selected = newCells
        .flat()
        .filter((cell) => cell.selected);
      onSelectionChange(selected);
    }
  };

  return (
    <div className="w-full h-full bg-[#F8F8F8] overflow-auto p-2">
      <div className="grid gap-0" style={{ gridTemplateColumns: `repeat(${cols}, 40px)` }}>
        {cells.map((row, rowIndex) =>
          row.map((cell, colIndex) => {
            const hasLabel = !!cell.label;
            const isReserved = cell.reserved;
            const isSelected = cell.selected;

            return (
              <div
                key={`${rowIndex}-${colIndex}`}
                onClick={() => handleCellClick(rowIndex, colIndex)}
                className={cn(
                  "w-10 h-10 border-[3px] border-[#D9D9D9] cursor-pointer transition-colors relative",
                  isSelected &&
                    !isReserved &&
                    "bg-[rgba(123,187,248,0.1)] border-[#6EB9FF]",
                  isReserved && "bg-[#FFF8C7] border-[#FFDD6E]",
                  cell.row === 2 && cell.col === 4 && "rounded-tl-[10px]",
                  cell.row === 2 && cell.col === 6 && "rounded-tr-[10px]",
                  cell.row === 7 && cell.col === 2 && "rounded-bl-[10px]",
                  cell.row === 7 && cell.col === 3 && "rounded-br-[10px]"
                )}
              >
                {hasLabel && (
                  <div className="absolute -bottom-1 right-1 flex items-center gap-0.5">
                    <span
                      className={cn(
                        "px-1.5 py-0.5 rounded-full border text-[13px] font-normal leading-[18px] tracking-[0.16px] whitespace-nowrap",
                        isReserved
                          ? "border-[#EF6C00] text-[#EF6C00]"
                          : "border-[#1976D2] text-[#1976D2]"
                      )}
                    >
                      {cell.label}
                    </span>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
