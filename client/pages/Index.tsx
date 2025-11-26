import { useState } from "react";
import FilterChips from "@/components/FilterChips";
import PlaceCard from "@/components/PlaceCard";
import GridSelector from "@/components/GridSelector";
import ActionModal from "@/components/ActionModal";
import ShareModal from "@/components/ShareModal";
import DeleteConfirmationModal from "@/components/DeleteConfirmationModal";
import AddPlaceModal from "@/components/AddPlaceModal";
import PlaceAccessModal from "@/components/PlaceAccessModal";
import AddToGroupModal from "@/components/AddToGroupModal";
import GridEditorModal from "@/components/GridEditorModal";
import FloatingActionButton from "@/components/FloatingActionButton";
import { toast } from "sonner";

type View = "list" | "grid";

interface Place {
  id: number;
  initials: string;
  title: string;
  description: string;
}

export default function Index() {
  const [activeFilter, setActiveFilter] = useState("Все");
  const [view, setView] = useState<View>("list");
  const [isActionModalOpen, setIsActionModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isAccessModalOpen, setIsAccessModalOpen] = useState(false);
  const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);
  const [isGridEditorOpen, setIsGridEditorOpen] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [showSpeedDial, setShowSpeedDial] = useState(false);

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

  const handleDeletePlace = () => {
    if (selectedPlace) {
      setPlaces(places.filter((p) => p.id !== selectedPlace.id));
      toast.success("Место удалено");
      setSelectedPlace(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F8F8] flex flex-col max-w-[400px] mx-auto">
      <FilterChips
        filters={filters}
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
      />

      <div className="flex-1 overflow-auto">
        {view === "list" ? (
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
        ) : (
          <GridSelector />
        )}
      </div>

      <div className="fixed top-4 right-4 flex gap-2 z-20">
        <button
          onClick={() => setView("list")}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            view === "list"
              ? "bg-[#1976D2] text-white"
              : "bg-white text-gray-700"
          }`}
        >
          List
        </button>
        <button
          onClick={() => setView("grid")}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            view === "grid"
              ? "bg-[#1976D2] text-white"
              : "bg-white text-gray-700"
          }`}
        >
          Grid
        </button>
      </div>

      <FloatingActionButton
        onMainClick={() => setIsAddModalOpen(true)}
        showSpeedDial={showSpeedDial}
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
    </div>
  );
}
