import { useState } from "react";
import { X, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface PlaceAccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  placeName?: string;
}

interface UserPermission {
  username: string;
  permission: string;
}

export default function PlaceAccessModal({
                                           isOpen,
                                           onClose,
                                           placeName = "Название места",
                                         }: PlaceAccessModalProps) {
  const [selectedGroups, setSelectedGroups] = useState<string[]>([
    "Все",
    "Мои",
    "Нужные",
  ]);
  const [whoCanView, setWhoCanView] = useState("Все");
  const [whoCanEdit, setWhoCanEdit] = useState("Все");
  const [whoCanBook, setWhoCanBook] = useState("Все");
  const [userPermissions, setUserPermissions] = useState<UserPermission[]>([
    { username: "@username", permission: "Редактировать" },
    { username: "@username", permission: "Бронировать" },
    { username: "@username", permission: "Просматривать" },
    { username: "@username", permission: "Ничего" },
  ]);
  const [newUsername, setNewUsername] = useState("");
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const removeGroup = (group: string) => {
    setSelectedGroups(selectedGroups.filter((g) => g !== group));
  };

  const updateUserPermission = (index: number, newPermission: string) => {
    const newPermissions = [...userPermissions];
    newPermissions[index].permission = newPermission;
    setUserPermissions(newPermissions);
  };

  const validateUsername = (username: string): boolean => {
    if (username.length === 0 || username.length > 32) {
      setError("Имя должно содержать от 1 до 32 символов");
      return false;
    }

    const validPattern = /^[a-zA-Z0-9_]+$/;
    if (!validPattern.test(username)) {
      setError("Только латиница, цифры и _");
      return false;
    }

    setError("");
    return true;
  };

  const handleAddUser = () => {
    if (validateUsername(newUsername)) {
      const usernameWithAt = newUsername.startsWith("@") ? newUsername : `@${newUsername}`;

      if (userPermissions.some(u => u.username === usernameWithAt)) {
        setError("Пользователь уже добавлен");
        return;
      }

      setUserPermissions([
        ...userPermissions,
        { username: usernameWithAt, permission: "Просматривать" },
      ]);
      setNewUsername("");
      setError("");
    }
  };

  const handleUsernameChange = (value: string) => {
    const cleaned = value.replace(/^@/, "");
    setNewUsername(cleaned);
    if (value.length > 0) {
      validateUsername(cleaned);
    } else {
      setError("");
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
            {/* Add User Form */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-medium text-black/60">
                Добавить пользователя
              </label>
              <div className="flex gap-2">
                <div className="flex-1">
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-black/60">
                      @
                    </span>
                    <Input
                      value={newUsername}
                      onChange={(e) => handleUsernameChange(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          handleAddUser();
                        }
                      }}
                      placeholder="username"
                      className="pl-7 bg-white border-black/20 focus:ring-2 focus:ring-black/10"
                      maxLength={32}
                    />
                  </div>
                  {error && (
                    <p className="text-xs text-red-500 mt-1">{error}</p>
                  )}
                </div>
                <Button
                  onClick={handleAddUser}
                  disabled={!newUsername || !!error}
                  className="bg-black hover:bg-black/90 text-white px-4"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Добавить
                </Button>
              </div>
            </div>

            {/* User Permissions List */}
            <div className="flex flex-col">
              {userPermissions.map((user, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between py-2.5 gap-4"
                >
                  <span className="text-base font-normal leading-6 tracking-[0.15px] text-black">
                    {user.username}
                  </span>
                  <div className="w-[180px]">
                    <Select
                      value={user.permission}
                      onValueChange={(value) => updateUserPermission(index, value)}
                    >
                      <SelectTrigger className="w-full bg-white border-black/20 focus:ring-2 focus:ring-black/10 h-9">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Редактировать">Редактировать</SelectItem>
                        <SelectItem value="Бронировать">Бронировать</SelectItem>
                        <SelectItem value="Просматривать">Просматривать</SelectItem>
                        <SelectItem value="Ничего">Ничего</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}