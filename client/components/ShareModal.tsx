import { Copy } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { QRCodeSVG } from 'qrcode.react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  placeName?: string;
  placeShortId?: string;
}

export default function ShareModal({
  isOpen,
  onClose,
  placeName = "Label",
  placeShortId,
}: ShareModalProps) {
  const [visibility, setVisibility] = useState("Все");
  const [canEdit, setCanEdit] = useState("Некоторые");
  const [canBook, setCanBook] = useState("Никто");
  const shareLink = `https://t.me/getplacebot/app?startapp=${placeShortId}`;

  if (!isOpen) return null;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareLink);
    toast.success("Ссылка скопированна");
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

          <div className="flex flex-col gap-4">
            {/* Visibility Select */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-medium text-black/60">
                Кто видит место
              </label>
              <Select value={visibility} onValueChange={setVisibility}>
                <SelectTrigger className="w-full bg-white border-black/20 focus:ring-2 focus:ring-black/10">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Все">Все</SelectItem>
                  <SelectItem value="Некоторые">Некоторые</SelectItem>
                  <SelectItem value="Никто">Никто</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Can Edit Select */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-medium text-black/60">
                Может редактировать
              </label>
              <Select value={canEdit} onValueChange={setCanEdit}>
                <SelectTrigger className="w-full bg-white border-black/20 focus:ring-2 focus:ring-black/10">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Все">Все</SelectItem>
                  <SelectItem value="Некоторые">Некоторые</SelectItem>
                  <SelectItem value="Никто">Никто</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Can Book Select */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-medium text-black/60">
                Может бронировать
              </label>
              <Select value={canBook} onValueChange={setCanBook}>
                <SelectTrigger className="w-full bg-white border-black/20 focus:ring-2 focus:ring-black/10">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Все">Все</SelectItem>
                  <SelectItem value="Некоторые">Некоторые</SelectItem>
                  <SelectItem value="Никто">Никто</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Share Link */}
            <div className="mt-2">
              <div className="flex items-center gap-3 px-3 py-2 border border-black/23 rounded bg-transparent">
                <span className="flex-1 text-sm font-normal text-black/60 truncate">
                  {shareLink}
                </span>
                <button
                  onClick={handleCopyLink}
                  className="text-black/56 hover:text-black/87 transition-colors flex-shrink-0"
                >
                  <Copy className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* QR Code */}
            <div className="flex justify-center mt-2">
              <div className="w-[200px] h-[200px] bg-white border border-black/10 rounded-lg flex items-center justify-center p-2">
                <QRCodeSVG value={shareLink} size={184} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}