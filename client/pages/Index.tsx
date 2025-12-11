import { useEffect, useState } from "react";
import FilterChips from "@/components/FilterChips";
import PlaceCard from "@/components/PlaceCard";
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

interface Place {
  placeId: string;
  placeShortId: string;
  ownerId: string;
  color: string;
  name: string;
  description: string;
  isDeleted: boolean;
  visible: number;
  editable: number;
  reservable: number;
  groupIds: string[];
  userAccesses: string[];
  grids: {
    gridId: string;
    blocks: any[]; 
  }[];
  reservations: any[]; 
};

interface Reservation {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  userName: string;
  placeId: string;
}

const fetchPlaces = async (setPlaces: React.Dispatch<React.SetStateAction<Place[]>>) => {
  try {
    const res = await fetch(`/api/place/card-place-list`, {
      method: "GET", 
    });

    if (res.ok) {
      const data = await res.json();
      setPlaces(data);
    } else {
      alert("Ошибка при получении карточек на сервере.");
    }
  } catch (e) {
    alert("Сетевая ошибка при попытке получить карточки.");
  }
};

const fetchPlacesByGroupId = async (groupId: string, setPlaces: React.Dispatch<React.SetStateAction<Place[]>>) => {
  try {
    const res = await fetch(`/api/place/card-place-list?groupId=${groupId}`, {
      method: "GET", 
    });

    if (res.ok) {
      const data = await res.json();
      setPlaces(data);
    } else {
      alert("Ошибка при получении карточек по группе на сервере.");
    }
  } catch (e) {
    alert("Сетевая ошибка при попытке получить карточки по группе.");
  }
};

interface Group {
  groupId: string;
  name: string;
  order: number;
};

const fetchGroups = async (setSelectedGroups: React.Dispatch<React.SetStateAction<Group[]>>) => {
  const userID = "owner_id";
  
  try {
    const res = await fetch(`/api/group?userId=${userID}`, {
      method: "GET", 
    });

    if (res.ok) {
      const data = await res.json();
      setSelectedGroups(data);
    } else {
      alert("Ошибка при получении групп на сервере.");
    }
  } catch (e) {
    alert("Сетевая ошибка при попытке получить группы.");
  }
};

  const getGroupsByPlaceId = async (placeId: string | undefined) => {
    // TODO: Implement logic to fetch groups by place ID
  }

export default function Index() {
  const [activeFilter, setActiveFilter] = useState("Все");
  const [selectedGroups, setSelectedGroups] = useState<Group[]>([]);
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

  const [places, setPlaces] = useState<Place[]>([]);

  useEffect(() => {
    fetchPlaces(setPlaces);
  }, []);

  useEffect(() => {
    fetchGroups(setSelectedGroups);
  }, []);

  const filters = ["Все", ...selectedGroups.map(group => group.name)];

  const handleOnActiveFilerChange = (filter: string) => {
    setActiveFilter(filter);
    if (filter === "Все") {
      fetchPlaces(setPlaces);
    } else {
      fetchPlacesByGroupId(filter, setPlaces);
    }
  };

  const handleCardClick = (place: Place) => {
    setSelectedPlace(place);
    setIsActionModalOpen(true);
  };

  const handleAddPlace = async (name: string, description: string) => {
    fetchPlaces(setPlaces);
  };

  const handleSimpleAddPlace = async (name: string) => {
    fetchPlaces(setPlaces);
  };

  const handleDeletePlace = async () => {
    if (selectedPlace) {
      try {
        const res = await fetch(`/api/place/${selectedPlace.placeShortId}`, {
          method: "DELETE", 
        });

        if (res.ok) {
          fetchPlaces(setPlaces);
        } else {
          alert("Ошибка при удалении на сервере.");
        }
      } catch (e) {
        alert("Сетевая ошибка при попытке удалить карточку.");
      }
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
        placeId: selectedPlace.placeId,
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
      
    }
  };

  const selectedPlaceReservations = selectedPlace
    ? reservations.filter((r) => r.placeId === selectedPlace.placeId)
    : [];

  return (
    <div className="min-h-screen bg-[#F8F8F8] flex flex-col max-w-[400px] mx-auto">
      <FilterChips
        filters={filters}
        activeFilter={activeFilter}
        onFilterChange={handleOnActiveFilerChange}
      />

      <div className="flex-1 overflow-auto">
        <div className="flex flex-col gap-2.5 p-2.5">
            {places.length === 0 && (
              <div className="text-center text-gray-500 mt-10 text-lg px-4 leading-relaxed">
                Пока нет мест, в которые вы заходили.<br />
                Но вы можете создать новое
              </div>
            )}

            {places.map((place) => (
              <PlaceCard
                key={place.placeId}
                name={place.name}
                description={place.description}
                onClick={() => handleCardClick(place)}
              />
            ))}
          </div>
      </div>

      <FloatingActionButton
        onMainClick={() => setIsAddModalOpen(true)}
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
        placeName={selectedPlace?.name}
        placeShortId={selectedPlace?.placeShortId}
      />

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeletePlace}
        placeName={selectedPlace?.name}
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
        placeName={selectedPlace?.name}
      />

      <AddToGroupModal
        isOpen={isGroupModalOpen}
        onClose={() => setIsGroupModalOpen(false)}
        groupList={selectedGroups} //{getGroupsByPlaceId(setselectedPlace?.placeShortId)}
        onGroupChange={() => fetchGroups(setSelectedGroups)}
        placeName={selectedPlace?.name}
      />

      <GridEditorModal
        isOpen={isGridEditorOpen}
        onClose={() => setIsGridEditorOpen(false)}
        placeName={selectedPlace?.name}
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
