import { Plus, Check, Clock, Copy, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface SpeedDialAction {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}

interface FloatingActionButtonProps {
  onMainClick?: () => void;
  onReservationClick?: () => void;
  onCopyClick?: () => void;
  onDeleteClick?: () => void;
  showSpeedDial?: boolean;
}

export default function FloatingActionButton({
  onMainClick,
  onReservationClick,
  onCopyClick,
  onDeleteClick,
  showSpeedDial = false,
}: FloatingActionButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  const actions: SpeedDialAction[] = [
    {
      icon: <Clock className="w-6 h-6" />,
      label: "Reservation",
      onClick: () => {
        onReservationClick?.();
        setIsOpen(false);
      },
    },
    {
      icon: <Copy className="w-6 h-6" />,
      label: "Copy",
      onClick: () => {
        onCopyClick?.();
        setIsOpen(false);
      },
    },
    {
      icon: <Trash2 className="w-6 h-6" />,
      label: "Delete",
      onClick: () => {
        onDeleteClick?.();
        setIsOpen(false);
      },
    },
  ];

  const handleMainClick = () => {
    if (showSpeedDial) {
      setIsOpen(!isOpen);
    } else if (onMainClick) {
      onMainClick();
    }
  };

  return (
    <div className="z-30 flex flex-col items-end gap-2">
      {showSpeedDial && isOpen && (
        <div className="flex flex-col items-center gap-2 animate-in fade-in slide-in-from-bottom-2 duration-200" style={{ bottom: "44px", right: "42px" }}>
          {actions.map((action, index) => (
            <button
              key={index}
              onClick={action.onClick}
              className="flex items-center gap-2 p-2 bg-white rounded-full shadow-lg hover:shadow-xl transition-all"
              title={action.label}
            >
              <div className="w-10 h-10 flex items-center justify-center text-black/60 hover:text-[#1976D2] transition-colors">
                {action.icon}
              </div>
            </button>
          ))}
        </div>
      )}
      <button
        onClick={handleMainClick}
        className={cn(
          "w-14 h-14 flex items-center justify-center rounded-full shadow-lg hover:shadow-xl transition-all flex-shrink-0",
          isOpen ? "bg-white text-[#1976D2]" : "bg-[#1976D2] text-white"
        )}
        title={showSpeedDial ? "Open actions" : "Add place"}
      >
        {isOpen ? (
          <Check className="w-6 h-6" />
        ) : (
          <Plus className="w-6 h-6" />
        )}
      </button>
    </div>
  );
}
