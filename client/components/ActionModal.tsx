import { Play, Circle, Users, Star, Trash2 } from "lucide-react";

interface ActionItem {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}

interface ActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenClick?: () => void;
  onShareClick?: () => void;
  onAccessClick?: () => void;
  onGroupClick?: () => void;
  onDeleteClick?: () => void;
}

export default function ActionModal({
  isOpen,
  onClose,
  onOpenClick,
  onShareClick,
  onAccessClick,
  onGroupClick,
  onDeleteClick,
}: ActionModalProps) {
  if (!isOpen) return null;

  const actions: ActionItem[] = [
    {
      icon: <Play className="w-6 h-6" />,
      label: "Открыть",
      onClick: () => {
        onOpenClick?.();
        onClose();
      },
    },
    {
      icon: <Circle className="w-6 h-6" />,
      label: "Поделиться",
      onClick: () => {
        onShareClick?.();
        onClose();
      },
    },
    {
      icon: <Users className="w-6 h-6" />,
      label: "Доступ",
      onClick: () => {
        onAccessClick?.();
        onClose();
      },
    },
    {
      icon: <Star className="w-6 h-6" />,
      label: "Группа",
      onClick: () => {
        onGroupClick?.();
        onClose();
      },
    },
    {
      icon: <Trash2 className="w-6 h-6" />,
      label: "Удалить",
      onClick: () => {
        onDeleteClick?.();
        onClose();
      },
    },
  ];

  return (
    <>
      <div
        className="fixed inset-0 bg-black/50 z-40 animate-in fade-in"
        onClick={onClose}
      />
      <div className="fixed bottom-0 left-0 right-0 z-50 animate-in slide-in-from-bottom duration-300">
        <div className="bg-white/95 backdrop-blur-sm rounded-t-2xl p-8 pt-2 shadow-xl max-w-[400px] mx-auto">
          <div className="flex flex-col items-center gap-2.5 mb-8">
            <div className="w-9 h-1 rounded bg-black/15" />
          </div>
          <div className="flex flex-col gap-2.5">
            {actions.map((action, index) => (
              <button
                key={index}
                onClick={action.onClick}
                className="flex items-center gap-6 px-4 py-2 hover:bg-gray-100 rounded-lg transition-colors text-left"
              >
                <div className="w-14 flex items-center justify-center text-black/56">
                  {action.icon}
                </div>
                <span className="flex-1 text-base font-normal leading-6 tracking-[0.15px] text-[rgba(0,0,0,0.87)]">
                  {action.label}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
