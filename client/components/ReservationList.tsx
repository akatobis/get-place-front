import { Trash2 } from "lucide-react";

interface Reservation {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  userName: string;
}

interface ReservationListProps {
  reservations: Reservation[];
  onDelete: (reservationId: string) => void;
  placeName?: string;
}

export default function ReservationList({
  reservations,
  onDelete,
  placeName = "Место",
}: ReservationListProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString + "T00:00:00");
    return date.toLocaleDateString("ru-RU", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  if (reservations.length === 0) {
    return (
      <div className="bg-white rounded-lg p-6 text-center">
        <p className="text-black/60">Нет бронирований для {placeName}</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg overflow-hidden border border-gray-200">
      <div className="bg-gray-50 border-b border-gray-200 px-6 py-3">
        <h3 className="text-sm font-medium text-black/87">
          Бронирования ({reservations.length})
        </h3>
      </div>
      <div className="divide-y divide-gray-200">
        {reservations.map((reservation) => (
          <div
            key={reservation.id}
            className="px-6 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors"
          >
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm font-medium text-black/87">
                  {reservation.userName}
                </span>
              </div>
              <div className="flex items-center gap-4 text-sm text-black/60">
                <span>{formatDate(reservation.date)}</span>
                <span>
                  {reservation.startTime} - {reservation.endTime}
                </span>
              </div>
            </div>
            <button
              onClick={() => onDelete(reservation.id)}
              className="ml-4 p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
              title="Удалить бронирование"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
