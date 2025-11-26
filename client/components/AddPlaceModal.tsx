import { useState } from "react";

interface AddPlaceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (name: string, description: string) => void;
  initialName?: string;
  initialDescription?: string;
}

export default function AddPlaceModal({
  isOpen,
  onClose,
  onSave,
  initialName = "",
  initialDescription = "",
}: AddPlaceModalProps) {
  const [name, setName] = useState(initialName);
  const [description, setDescription] = useState(initialDescription);

  if (!isOpen) return null;

  const handleSave = () => {
    if (name.trim()) {
      onSave(name, description);
      onClose();
      setName("");
      setDescription("");
    }
  };

  const handleClose = () => {
    onClose();
    setName(initialName);
    setDescription(initialDescription);
  };

  return (
    <>
      <div
        className="fixed inset-0 bg-black/50 z-40 animate-in fade-in"
        onClick={handleClose}
      />
      <div className="fixed bottom-0 left-0 right-0 z-50 animate-in slide-in-from-bottom duration-300">
        <div className="bg-white/95 backdrop-blur-sm rounded-t-2xl p-8 pt-2 shadow-xl max-w-[400px] mx-auto">
          <div className="flex flex-col items-center gap-2.5 mb-8">
            <div className="w-9 h-1 rounded bg-black/15" />
          </div>

          <div className="flex flex-col gap-8">
            {/* Form Inputs */}
            <div className="flex flex-col gap-2.5 px-2.5">
              {/* Name Input */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-normal leading-3 tracking-[0.15px] text-black/60">
                  Название
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Тут пишется название"
                  className="text-base font-normal leading-6 tracking-[0.15px] text-black/87 bg-transparent border-b border-black/42 pb-1 outline-none focus:border-[#1976D2] transition-colors"
                />
              </div>

              {/* Description Input */}
              <div className="flex flex-col gap-1.5 mt-2">
                <label className="text-xs font-normal leading-3 tracking-[0.15px] text-black/60">
                  Описание
                </label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Тут пишется описание"
                  className="text-base font-normal leading-6 tracking-[0.15px] text-black/87 bg-transparent border-b border-black/42 pb-1 outline-none focus:border-[#1976D2] transition-colors"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-between gap-4">
              <button
                onClick={handleClose}
                className="flex-1 px-6 py-2 rounded bg-[#E0E0E0] text-black/87 text-[15px] font-medium leading-[26px] tracking-[0.46px] uppercase shadow-md hover:shadow-lg transition-shadow"
              >
                Отмена
              </button>
              <button
                onClick={handleSave}
                disabled={!name.trim()}
                className="flex-1 px-6 py-2 rounded bg-[#1976D2] text-white text-[15px] font-medium leading-[26px] tracking-[0.46px] uppercase shadow-md hover:shadow-lg transition-shadow disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Добавить
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
