import { useState } from "react";
import { Button } from "@/components/ui/button";

interface ReservationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (reservation: { date: string; startTime: string; endTime: string }) => void;
  placeName?: string;
}

export default function ReservationModal({
  isOpen,
  onClose,
  onSave,
  placeName = "Место",
}: ReservationModalProps) {
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  if (!isOpen) return null;

  const handleSave = () => {
    if (date && startTime && endTime) {
      onSave({
        date,
        startTime,
        endTime,
      });
      setDate("");
      setStartTime("");
      setEndTime("");
    }
  };

  const handleClose = () => {
    setDate("");
    setStartTime("");
    setEndTime("");
    onClose();
  };

  return (
    <>
      <div
        className="fixed inset-0 bg-black/50 z-40 animate-in fade-in"
        onClick={handleClose}
      />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl max-w-md w-full">
          <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
            <h2 className="text-xl font-medium text-black/87">
              Бронирование: {placeName}
            </h2>
            <button
              onClick={handleClose}
              className="text-black/60 hover:text-black transition-colors"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z"
                  fill="currentColor"
                />
              </svg>
            </button>
          </div>

          <div className="p-6 space-y-6">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-black/87">
                Дата
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="px-3 py-2 rounded-lg border border-gray-300 text-black/87 focus:outline-none focus:ring-2 focus:ring-[#1976D2] focus:border-transparent"
              />
            </div>

            <div className="flex gap-4">
              <div className="flex-1 flex flex-col gap-2">
                <label className="text-sm font-medium text-black/87">
                  Время начала
                </label>
                <input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  placeholder="hh:mm"
                  className="px-3 py-2 rounded-lg border border-gray-300 text-black/87 focus:outline-none focus:ring-2 focus:ring-[#1976D2] focus:border-transparent"
                />
              </div>
              <div className="flex-1 flex flex-col gap-2">
                <label className="text-sm font-medium text-black/87">
                  Время окончания
                </label>
                <input
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  placeholder="hh:mm"
                  className="px-3 py-2 rounded-lg border border-gray-300 text-black/87 focus:outline-none focus:ring-2 focus:ring-[#1976D2] focus:border-transparent"
                />
              </div>
            </div>
          </div>

          <div className="bg-gray-50 border-t border-gray-200 px-6 py-4 flex gap-3 justify-end">
            <button
              onClick={handleClose}
              className="px-4 py-2 rounded-lg bg-white border border-gray-300 text-black/87 hover:bg-gray-50 transition-colors"
            >
              Отмена
            </button>
            <button
              onClick={handleSave}
              disabled={!date || !startTime || !endTime}
              className="px-4 py-2 rounded-lg bg-[#1976D2] text-white hover:bg-[#1565C0] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Забронировать
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
