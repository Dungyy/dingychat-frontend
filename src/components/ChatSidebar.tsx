"use client";

import { useState } from "react";
import { Users, LogOut } from "lucide-react";
import { useChatStore } from "@/store/chatStore";
import { getSocket, disconnectSocket } from "@/lib/socket";

const DEFAULT_ROOMS = ["general", "random", "introductions"];

export default function ChatSidebar() {
  const { user, currentRoom, setCurrentRoom, setUser, clearMessages } =
    useChatStore();
  const [roomInput, setRoomInput] = useState("");
  const [customRooms, setCustomRooms] = useState<string[]>([]);

  const handleJoinRoom = (roomName: string) => {
    const socket = getSocket();
    if (socket) {
      setCurrentRoom(roomName);
      clearMessages();
      socket.emit("joinRoom", roomName);
    }
  };

  const handleCreateRoom = () => {
    if (roomInput.trim() && !customRooms.includes(roomInput.trim())) {
      const newRoom = roomInput.trim();
      setCustomRooms([...customRooms, newRoom]);
      handleJoinRoom(newRoom);
      setRoomInput("");
    }
  };

  const handleLogout = () => {
    disconnectSocket();
    localStorage.clear();
    setUser(null);
  };

  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-xl font-bold text-indigo-600">DingyChat</h2>
        <div className="flex items-center mt-2 text-sm">
          <div
            className="w-3 h-3 rounded-full mr-2"
            style={{ backgroundColor: user?.color || "#000" }}
          />
          <span className="font-medium" style={{ color: user?.color }}>
            {user?.username}
          </span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <div className="mb-4">
          <h3 className="text-xs font-semibold text-gray-500 uppercase mb-2 flex items-center">
            <Users className="w-4 h-4 mr-1" />
            Default Rooms
          </h3>
          <div className="space-y-1">
            {DEFAULT_ROOMS.map((room) => (
              <button
                key={room}
                onClick={() => handleJoinRoom(room)}
                className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                  currentRoom === room
                    ? "bg-indigo-100 text-indigo-700 font-medium"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                # {room}
              </button>
            ))}
          </div>
        </div>

        {customRooms.length > 0 && (
          <div className="mb-4">
            <h3 className="text-xs font-semibold text-gray-500 uppercase mb-2">
              Your Rooms
            </h3>
            <div className="space-y-1">
              {customRooms.map((room) => (
                <button
                  key={room}
                  onClick={() => handleJoinRoom(room)}
                  className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                    currentRoom === room
                      ? "bg-indigo-100 text-indigo-700 font-medium"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  # {room}
                </button>
              ))}
            </div>
          </div>
        )}

        <div>
          <h3 className="text-xs font-semibold text-gray-500 uppercase mb-2">
            Create Room
          </h3>
          <div className="flex gap-2">
            <input
              type="text"
              value={roomInput}
              onChange={(e) => setRoomInput(e.target.value)}
              placeholder="Room name"
              className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
              onKeyPress={(e) => e.key === "Enter" && handleCreateRoom()}
            />
          </div>
        </div>
      </div>

      <div className="p-4 border-t border-gray-200">
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>
    </div>
  );
}
