import { useState } from "react";
import FilterChips from "@/components/FilterChips";
import PlaceCard from "@/components/PlaceCard";
import GridSelector from "@/components/GridSelector";
import ActionModal from "@/components/ActionModal";
import ShareModal from "@/components/ShareModal";
import DeleteConfirmationModal from "@/components/DeleteConfirmationModal";
import AddPlaceModal from "@/components/AddPlaceModal";
import SimpleAddPlaceModal from "@/components/SimpleAddPlaceModal";
import PlaceAccessModal from "@/components/PlaceAccessModal";
import AddToGroupModal from "@/components/AddToGroupModal";
import GridEditorModal from "@/components/GridEditorModal";
import ReservationModal from "@/components/ReservationModal";
import ReservationList from "@/components/ReservationList";
import FloatingActionButton from "@/components/FloatingActionButton";
import { toast } from "sonner";

type View = "list" | "grid";

interface Place {
  id: number;
  initials: string;
  title: string;
  description: string;
}

interface Reservation {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  userName: string;
  placeId: number;
}

export default function Index() {
  const [activeFilter, setActiveFilter] = useState("Все");
  const [isActionModalOpen, setIsActionModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSimpleAddModalOpen, setIsSimpleAddModalOpen] = useState(false);
  const [isAccessModalOpen, setIsAccessModalOpen] = useState(false);
  const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);
  const [isGridEditorOpen, setIsGridEditorOpen] = useState(false);
  const [isReservationModalOpen, setIsReservationModalOpen] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [reservations, setReservations] = useState<Reservation[]>([]);

  const [places, setPlaces] = useState<Place[]>([
    {
      id: 1,
      initials: "OP",
      title: "Label",
      description:
        "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.",
    },
    {
      id: 2,
      initials: "OP",
      title: "Label",
      description:
        "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.",
    },
    {
      id: 3,
      initials: "OP",
      title: "Label",
      description:
        "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.",
    },
  ]);

  const filters = ["Все", "Мои", "Нужные"];

  const handleCardClick = (place: Place) => {
    setSelectedPlace(place);
    setIsActionModalOpen(true);
  };

  const handleAddPlace = (name: string, description: string) => {
    const newPlace: Place = {
      id: places.length + 1,
      initials: name.substring(0, 2).toUpperCase(),
      title: name,
      description: description,
    };
    setPlaces([...places, newPlace]);
    toast.success("Место добавлено успешно!");
  };

  const handleSimpleAddPlace = (name: string) => {
    const newPlace: Place = {
      id: places.length + 1,
      initials: name.substring(0, 2).toUpperCase(),
      title: name,
      description: "",
    };
    setPlaces([...places, newPlace]);
    setIsSimpleAddModalOpen(false);
    toast.success("Место добавлено успешно!");
  };

  const handleDeletePlace = () => {
    if (selectedPlace) {
      setPlaces(places.filter((p) => p.id !== selectedPlace.id));
      toast.success("Место удалено");
      setSelectedPlace(null);
    }
  };

  const handleAddReservation = (reservation: {
    date: string;
    startTime: string;
    endTime: string;
  }) => {
    if (selectedPlace) {
      const newReservation: Reservation = {
        id: `reservation-${Date.now()}`,
        ...reservation,
        userName: "Текущий пользователь",
        placeId: selectedPlace.id,
      };
      setReservations([...reservations, newReservation]);
      setIsReservationModalOpen(false);
      toast.success("Бронирование создано успешно!");
    }
  };

  const handleDeleteReservation = (reservationId: string) => {
    setReservations(
      reservations.filter((r) => r.id !== reservationId)
    );
    toast.success("Бронирование удалено");
  };

  const handleCopyPlace = () => {
    if (selectedPlace) {
      const newPlace: Place = {
        ...selectedPlace,
        id: places.length + 1,
        title: `${selectedPlace.title} (копия)`,
      };
      setPlaces([...places, newPlace]);
      toast.success("Место скопировано!");
    }
  };

  const selectedPlaceReservations = selectedPlace
    ? reservations.filter((r) => r.placeId === selectedPlace.id)
    : [];

  return (
    <div className="min-h-screen bg-[#F8F8F8] flex flex-col max-w-[400px] mx-auto">
      <FilterChips
        filters={filters}
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
      />

      <div className="flex-1 overflow-auto">
        <div className="flex flex-col gap-2.5 p-2.5">
            {places.map((place) => (
              <PlaceCard
                key={place.id}
                initials={place.initials}
                title={place.title}
                description={place.description}
                onClick={() => handleCardClick(place)}
              />
            ))}
          </div>
      </div>

      <FloatingActionButton
        onMainClick={() => setIsSimpleAddModalOpen(true)}
      />

      <ActionModal
        isOpen={isActionModalOpen}
        onClose={() => setIsActionModalOpen(false)}
        onOpenClick={() => setIsGridEditorOpen(true)}
        onShareClick={() => setIsShareModalOpen(true)}
        onAccessClick={() => setIsAccessModalOpen(true)}
        onGroupClick={() => setIsGroupModalOpen(true)}
        onDeleteClick={() => setIsDeleteModalOpen(true)}
      />

      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        placeName={selectedPlace?.title}
      />

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeletePlace}
        placeName={selectedPlace?.title}
      />

      <AddPlaceModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleAddPlace}
      />

      <SimpleAddPlaceModal
        isOpen={isSimpleAddModalOpen}
        onClose={() => setIsSimpleAddModalOpen(false)}
        onSave={handleSimpleAddPlace}
      />

      <PlaceAccessModal
        isOpen={isAccessModalOpen}
        onClose={() => setIsAccessModalOpen(false)}
        placeName={selectedPlace?.title}
      />

      <AddToGroupModal
        isOpen={isGroupModalOpen}
        onClose={() => setIsGroupModalOpen(false)}
        placeName={selectedPlace?.title}
      />

      <GridEditorModal
        isOpen={isGridEditorOpen}
        onClose={() => setIsGridEditorOpen(false)}
        placeName={selectedPlace?.title}
      />

      <ReservationModal
        isOpen={isReservationModalOpen}
        onClose={() => setIsReservationModalOpen(false)}
        onSave={handleAddReservation}
      />

      {selectedPlaceReservations.length > 0 && (
        <ReservationList
          reservations={selectedPlaceReservations}
          onDeleteReservation={handleDeleteReservation}
        />
      )}
    </div>
  );
}
