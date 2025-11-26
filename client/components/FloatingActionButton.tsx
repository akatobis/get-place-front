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
  speedDialActions?: SpeedDialAction[];
  showSpeedDial?: boolean;
}

export default function FloatingActionButton({
  onMainClick,
  speedDialActions,
  showSpeedDial = false,
}: FloatingActionButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  const defaultActions: SpeedDialAction[] = [
    {
      icon: <Clock className="w-6 h-6" />,
      label: "History",
      onClick: () => console.log("History"),
    },
    {
      icon: <Copy className="w-6 h-6" />,
      label: "Copy",
      onClick: () => console.log("Copy"),
    },
    {
      icon: <Trash2 className="w-6 h-6" />,
      label: "Delete",
      onClick: () => console.log("Delete"),
    },
  ];

  const actions = speedDialActions || defaultActions;

  const handleMainClick = () => {
    if (showSpeedDial) {
      setIsOpen(!isOpen);
    } else if (onMainClick) {
      onMainClick();
    }
  };

  return (
    <div className="fixed bottom-11 right-6 z-30 flex flex-col items-center gap-2">
      {showSpeedDial && isOpen && (
        <div className="flex flex-col items-center gap-2 animate-in fade-in slide-in-from-bottom-2 duration-200">
          {actions.map((action, index) => (
            <button
              key={index}
              onClick={() => {
                action.onClick();
                setIsOpen(false);
              }}
              className="flex items-center gap-2 p-2 bg-white rounded-full shadow-lg hover:shadow-xl transition-all"
              title={action.label}
            >
              <div className="w-10 h-10 flex items-center justify-center text-black/60">
                {action.icon}
              </div>
            </button>
          ))}
        </div>
      )}
      <button
        onClick={handleMainClick}
        className={cn(
          "w-14 h-14 flex items-center justify-center rounded-full shadow-lg hover:shadow-xl transition-all",
          isOpen ? "bg-white" : "bg-[#1976D2]"
        )}
      >
        {isOpen ? (
          <Check className="w-6 h-6 text-white" />
        ) : (
          <Plus className="w-6 h-6 text-white" />
        )}
      </button>
    </div>
  );
}
