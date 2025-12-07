interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  placeName?: string;
}

export default function DeleteConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  placeName = "Название места",
}: DeleteConfirmationModalProps) {
  if (!isOpen) return null;

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

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

          <div className="flex flex-col gap-8">
            <div className="flex justify-center py-1">
              <h2 className="text-lg font-medium leading-6 tracking-[0.15px] text-[#101010] text-center">
                Удалить место "{placeName}"?
              </h2>
            </div>

            <div className="flex justify-between gap-4">
              <button
                onClick={onClose}
                className="flex-1 px-6 py-2 rounded bg-[#E0E0E0] text-black/87 text-[15px] font-medium leading-[26px] tracking-[0.46px] uppercase shadow-md hover:shadow-lg transition-shadow"
              >
                Отмена
              </button>
              <button
                onClick={handleConfirm}
                className="flex-1 px-6 py-2 rounded bg-[#1976D2] text-white text-[15px] font-medium leading-[26px] tracking-[0.46px] uppercase shadow-md hover:shadow-lg transition-shadow"
              >
                Удалить
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
