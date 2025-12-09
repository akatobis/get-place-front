import { useState } from "react";

interface AddPlaceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (name: string, description: string) => void;
  initialName?: string;
  initialDescription?: string;
}

async function findCreatedPlaceIdByFields(
  name: string,
  description: string
): Promise<string | null> {
  try {
    const res = await fetch("/api/place/card-place-list");
    if (!res.ok) return null;
    const list = await res.json();
    if (!Array.isArray(list)) return null;

    for (const item of list) {
      const itemName =
        item.name ?? item.Name ?? item.title ?? item.Title ?? item.label ?? "";
      const itemDesc =
        item.description ?? item.Description ?? item.desc ?? "";
      if (String(itemName) === name && String(itemDesc) === description) {
        return (
          item.placeShortId ?? item.shortId ?? item.placeId ?? item.id ?? item._id ?? null
        );
      }
    }
  } catch (e) {
    console.log("Failed to find created place by fields:", e);
  }
  return null;
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

  const handleSave = async () => {
    const regex = /^[0-9A-Za-zА-Яа-яЁё\s.,!?-]*$/;
    if (!name.trim() || !description.trim()) return;
    if (name.length < 1 || name.length > 256 || description.length < 1 || description.length > 256) {
      console.log("Name and description length must be between 1 and 256 characters.");
      return;
    }
    if (!regex.test(name) || !regex.test(description)) {
      console.log("Name and description must only contain English or Russian letters, spaces, and punctuation (.,!?-).");
      return;
    }

    const userId =  "owner_id"; 

    try {
      const res = await fetch("/api/Place", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, description, ownerId: userId }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data?.placeShortId) {
          localStorage.setItem("last_created_place_id", String(data.placeShortId));
          console.log("Place created successfully:", data.placeShortId);
        }
      }
    } catch (e) {
      console.log("Failed to create place:", e);
    }

    onSave(name, description);

    onClose();
    setName("");
    setDescription("");
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
            <div className="flex flex-col gap-2.5 px-2.5">
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
