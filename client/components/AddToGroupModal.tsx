import { useState } from "react";
import { X } from "lucide-react";

interface AddToGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
  placeName?: string;
}

export default function AddToGroupModal({
  isOpen,
  onClose,
  placeName = "Название места",
}: AddToGroupModalProps) {
  const [selectedGroups, setSelectedGroups] = useState<string[]>([
    "Все",
    "Мои",
    "Нужные",
  ]);
  const [newGroupName, setNewGroupName] = useState("");

  if (!isOpen) return null;

  const removeGroup = (group: string) => {
    setSelectedGroups(selectedGroups.filter((g) => g !== group));
  };

  const handleAddGroup = () => {
    if (newGroupName.trim() && !selectedGroups.includes(newGroupName.trim())) {
      setSelectedGroups([...selectedGroups, newGroupName.trim()]);
      setNewGroupName("");
    }
  };

  return (
    <>
      <div
        className="fixed inset-0 bg-black/50 z-40 animate-in fade-in"
        onClick={onClose}
      />
      <div className="fixed bottom-0 left-0 right-0 z-50 animate-in slide-in-from-bottom duration-300">
        <div className="bg-white/95 backdrop-blur-sm rounded-t-2xl px-8 py-2 pb-8 shadow-xl max-w-[400px] mx-auto">
          <div className="flex flex-col items-center gap-2.5 mb-8">
            <div className="w-9 h-1 rounded bg-black/15" />
          </div>

          <div className="flex flex-col gap-8">
            {/* Selected Groups with remove */}
            <div className="flex items-center gap-2.5 flex-wrap">
              {selectedGroups.map((group) => (
                <div
                  key={group}
                  className="flex items-center gap-1 px-1 py-1 rounded-full border border-[#1976D2] bg-[rgba(25,118,210,0.3)]"
                >
                  <span className="px-1.5 text-[13px] font-normal leading-[18px] tracking-[0.16px] text-[#1976D2]">
                    {group}
                  </span>
                  <button
                    onClick={() => removeGroup(group)}
                    className="w-6 h-6 flex items-center justify-center opacity-70 hover:opacity-100 transition-opacity"
                  >
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M12 2C6.47 2 2 6.47 2 12C2 17.53 6.47 22 12 22C17.53 22 22 17.53 22 12C22 6.47 17.53 2 12 2ZM17 15.59L15.59 17L12 13.41L8.41 17L7 15.59L10.59 12L7 8.41L8.41 7L12 10.59L15.59 7L17 8.41L13.41 12L17 15.59Z"
                        fill="#1976D2"
                      />
                    </svg>
                  </button>
                </div>
              ))}
            </div>

            {/* New Group Input */}
            <div className="flex items-center justify-center gap-2.5">
              <div className="flex flex-col gap-1.5 flex-1">
                <label className="text-xs font-normal leading-3 tracking-[0.15px] text-black/60">
                  Новая группа
                </label>
                <input
                  type="text"
                  value={newGroupName}
                  onChange={(e) => setNewGroupName(e.target.value)}
                  placeholder="Название новой группы"
                  className="text-base font-normal leading-6 tracking-[0.15px] text-black/87 bg-transparent border-b border-black/42 pb-1 outline-none focus:border-[#1976D2] transition-colors"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleAddGroup();
                    }
                  }}
                />
              </div>
              <button
                onClick={handleAddGroup}
                disabled={!newGroupName.trim()}
                className="mt-6 px-4 py-1.5 rounded bg-[#1976D2] text-white text-sm font-medium leading-6 tracking-[0.4px] uppercase shadow-md hover:shadow-lg transition-shadow disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Добавить
              </button>
            </div>

            {/* Place Name */}
            <div className="flex justify-center items-center">
              <span className="text-xl font-normal leading-6 tracking-[0.16px] text-black">
                {placeName}
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
