"use client";

import { useState, useCallback } from "react";
import { Users, LogOut, Plus, Hash, Menu, X } from "lucide-react";
import { useChatStore } from "@/store/chatStore";
import { getSocket, disconnectSocket } from "@/lib/socket";
import { USER_ROOMS } from "@/global";

export default function ChatSidebar() {
  const { user, currentRoom, setCurrentRoom, setUser, clearMessages } =
    useChatStore();
  const [roomInput, setRoomInput] = useState("");
  const [customRooms, setCustomRooms] = useState<string[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleJoinRoom = useCallback(
    (roomName: string) => {
      const socket = getSocket();
      if (socket) {
        setCurrentRoom(roomName);
        clearMessages();
        socket.emit("joinRoom", roomName);
        // Close sidebar on mobile after selecting room
        if (window.innerWidth < 768) {
          setIsOpen(false);
        }
      }
    },
    [setCurrentRoom, clearMessages]
  );

  const handleCreateRoom = useCallback(() => {
    const trimmedRoom = roomInput.trim();

    if (!trimmedRoom) return;

    if (customRooms.includes(trimmedRoom) || USER_ROOMS.includes(trimmedRoom)) {
      // Room already exists, just join it
      handleJoinRoom(trimmedRoom);
      setRoomInput("");
      setIsCreating(false);
      return;
    }

    setCustomRooms((prev) => [...prev, trimmedRoom]);
    handleJoinRoom(trimmedRoom);
    setRoomInput("");
    setIsCreating(false);
  }, [roomInput, customRooms, handleJoinRoom]);

  const handleLogout = useCallback(() => {
    if (confirm("Are you sure you want to logout?")) {
      disconnectSocket();
      setUser(null);
      clearMessages();
    }
  }, [setUser, clearMessages]);

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden fixed top-4 left-4 z-50 bg-indigo-600 text-white p-2 rounded-lg shadow-lg hover:bg-indigo-700 transition-colors"
        aria-label="Toggle menu"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
          fixed md:relative inset-y-0 left-0 z-40
          w-64 bg-white border-r border-gray-200 flex flex-col h-screen
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
      >
        {/* Header */}
        <div className="p-4 border-b border-gray-200 flex-shrink-0">
          <h2 className="text-xl font-bold text-indigo-600 mb-2">DingyChat</h2>
          <div className="flex items-center text-sm">
            <div
              className="w-3 h-3 rounded-full mr-2 flex-shrink-0"
              style={{ backgroundColor: user?.color || "#000" }}
              aria-label="User status indicator"
            />
            <span
              className="font-medium truncate"
              style={{ color: user?.color }}
              title={user?.username}
            >
              {user?.username}
            </span>
          </div>
        </div>

        {/* Rooms List */}
        <div className="flex-1 overflow-y-auto p-4">
          {/* Default Rooms */}
          <div className="mb-6">
            <h3 className="text-xs font-semibold text-gray-500 uppercase mb-2 flex items-center">
              <Users className="w-4 h-4 mr-1" />
              Default Rooms
            </h3>
            <div className="space-y-1">
              {USER_ROOMS.map((room) => (
                <button
                  key={room}
                  onClick={() => handleJoinRoom(room)}
                  className={`w-full text-left px-3 py-2 rounded-lg transition-all duration-200 flex items-center gap-2 ${
                    currentRoom === room
                      ? "bg-indigo-100 text-indigo-700 font-medium shadow-sm"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                  aria-current={currentRoom === room ? "page" : undefined}
                >
                  <Hash className="w-4 h-4 flex-shrink-0" />
                  <span className="truncate">{room}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Custom Rooms */}
          {customRooms.length > 0 && (
            <div className="mb-6">
              <h3 className="text-xs font-semibold text-gray-500 uppercase mb-2">
                Your Rooms
              </h3>
              <div className="space-y-1">
                {customRooms.map((room) => (
                  <button
                    key={room}
                    onClick={() => handleJoinRoom(room)}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-all duration-200 flex items-center gap-2 ${
                      currentRoom === room
                        ? "bg-indigo-100 text-indigo-700 font-medium shadow-sm"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                    aria-current={currentRoom === room ? "page" : undefined}
                  >
                    <Hash className="w-4 h-4 flex-shrink-0" />
                    <span className="truncate">{room}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Create Room Section */}
          <div className="text-gray-900">
            <h3 className="text-xs font-semibold text-gray-500 uppercase mb-2">
              Create Room
            </h3>
            {!isCreating ? (
              <button
                onClick={() => setIsCreating(true)}
                className="w-full flex items-center justify-center gap-2 px-3 py-2 text-indigo-600 hover:bg-indigo-50 border border-indigo-200 rounded-lg transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span className="text-sm font-medium">New Room</span>
              </button>
            ) : (
              <div className="space-y-2">
                <input
                  type="text"
                  value={roomInput}
                  onChange={(e) => setRoomInput(e.target.value)}
                  placeholder="Room name"
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleCreateRoom();
                    } else if (e.key === "Escape") {
                      setIsCreating(false);
                      setRoomInput("");
                    }
                  }}
                  autoFocus
                  aria-label="New room name"
                />
                <div className="flex gap-2">
                  <button
                    onClick={handleCreateRoom}
                    className="flex-1 px-3 py-1.5 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                    disabled={!roomInput.trim()}
                  >
                    Create
                  </button>
                  <button
                    onClick={() => {
                      setIsCreating(false);
                      setRoomInput("");
                    }}
                    className="flex-1 px-3 py-1.5 text-sm border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Logout Button */}
        <div className="p-4 border-t border-gray-200 flex-shrink-0">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors font-medium"
            aria-label="Logout"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </div>
    </>
  );
}
