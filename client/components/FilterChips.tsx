import { cn } from "@/lib/utils";

interface FilterChipsProps {
  filters: string[];
  activeFilter: string;
  onFilterChange: (filter: string) => void;
}

export default function FilterChips({
  filters,
  activeFilter,
  onFilterChange,
}: FilterChipsProps) {
  return (
    <div className="flex items-center gap-2.5 px-5 py-3 bg-white border-b">
      {filters.map((filter) => (
        <button
          key={filter}
          onClick={() => onFilterChange(filter)}
          className={cn(
            "px-2.5 py-1 rounded-full border text-sm font-normal leading-[18px] tracking-[0.16px] transition-colors",
            activeFilter === filter
              ? "border-[#1976D2] bg-[#1976D2]/30 text-[#1976D2]"
              : "border-[#1976D2] bg-transparent text-[#1976D2] hover:bg-[#1976D2]/10"
          )}
        >
          {filter}
        </button>
      ))}
    </div>
  );
}
