import { Copy } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  placeName?: string;
}

export default function ShareModal({
  isOpen,
  onClose,
  placeName = "Label",
}: ShareModalProps) {
  const [visibility, setVisibility] = useState("Все");
  const [canEdit, setCanEdit] = useState("Некоторые");
  const [canBook, setCanBook] = useState("Никто");
  const shareLink = "Ссылка на место";

  if (!isOpen) return null;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareLink);
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

          <div className="flex flex-col gap-2.5">
            {/* Visibility Select */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-normal leading-3 tracking-[0.15px] text-black/60">
                Кто видит место
              </label>
              <div className="flex items-center border-b border-black/42 pb-0.5">
                <select
                  value={visibility}
                  onChange={(e) => setVisibility(e.target.value)}
                  className="flex-1 text-base font-normal leading-6 tracking-[0.15px] text-black/87 bg-transparent outline-none appearance-none cursor-pointer"
                >
                  <option value="Все">Все</option>
                  <option value="Некоторые">Некоторые</option>
                  <option value="Никто">Никто</option>
                </select>
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="pointer-events-none"
                >
                  <path
                    d="M7 9.5L12 14.5L17 9.5H7Z"
                    fill="black"
                    fillOpacity="0.56"
                  />
                </svg>
              </div>
            </div>

            {/* Can Edit Select */}
            <div className="flex flex-col gap-1 mt-2">
              <label className="text-xs font-normal leading-3 tracking-[0.15px] text-black/60">
                Может редактировать
              </label>
              <div className="flex items-center border-b border-black/42 pb-0.5">
                <select
                  value={canEdit}
                  onChange={(e) => setCanEdit(e.target.value)}
                  className="flex-1 text-base font-normal leading-6 tracking-[0.15px] text-black/87 bg-transparent outline-none appearance-none cursor-pointer"
                >
                  <option value="Все">Все</option>
                  <option value="Некоторые">Некоторые</option>
                  <option value="Никто">Никто</option>
                </select>
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="pointer-events-none"
                >
                  <path
                    d="M7 9.5L12 14.5L17 9.5H7Z"
                    fill="black"
                    fillOpacity="0.56"
                  />
                </svg>
              </div>
            </div>

            {/* Can Book Select */}
            <div className="flex flex-col gap-1 mt-2">
              <label className="text-xs font-normal leading-3 tracking-[0.15px] text-black/60">
                Может бронировать
              </label>
              <div className="flex items-center border-b border-black/42 pb-0.5">
                <select
                  value={canBook}
                  onChange={(e) => setCanBook(e.target.value)}
                  className="flex-1 text-base font-normal leading-6 tracking-[0.15px] text-black/87 bg-transparent outline-none appearance-none cursor-pointer"
                >
                  <option value="Все">Все</option>
                  <option value="Некоторые">Некоторые</option>
                  <option value="Никто">Никто</option>
                </select>
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="pointer-events-none"
                >
                  <path
                    d="M7 9.5L12 14.5L17 9.5H7Z"
                    fill="black"
                    fillOpacity="0.56"
                  />
                </svg>
              </div>
            </div>

            {/* Share Link */}
            <div className="mt-4">
              <div className="flex items-center gap-3 px-3 py-2 border border-black/23 rounded bg-transparent">
                <span className="flex-1 text-base font-normal leading-6 tracking-[0.15px] text-black/38">
                  {shareLink}
                </span>
                <button
                  onClick={handleCopyLink}
                  className="text-black/56 hover:text-black/87 transition-colors"
                >
                  <Copy className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* QR Code */}
            <div className="flex justify-center mt-4">
              <div className="w-[200px] h-[200px] bg-[#C8C8C8] flex items-center justify-center">
                <span className="text-[32px] font-normal leading-6 tracking-[0.15px] text-black">
                  QR
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
