import { useState } from "react";

interface SimpleAddPlaceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (name: string) => void;
}

export default function SimpleAddPlaceModal({
  isOpen,
  onClose,
  onSave,
}: SimpleAddPlaceModalProps) {
  const [name, setName] = useState("");

  if (!isOpen) return null;

  const handleSave = () => {
    if (name.trim()) {
      onSave(name);
      onClose();
      setName("");
    }
  };

  const handleClose = () => {
    onClose();
    setName("");
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
            <div className="flex flex-col gap-2.5 px-2.5">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-normal leading-3 tracking-[0.15px] text-black/60">
                  Название
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      handleSave();
                    }
                  }}
                  placeholder="Введите название места"
                  className="text-base font-normal leading-6 tracking-[0.15px] text-black/87 bg-transparent border-b border-black/42 pb-1 outline-none focus:border-[#1976D2] transition-colors"
                  autoFocus
                />
              </div>
            </div>

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
