"use client";

import { useState, useRef } from "react";
import { Send } from "lucide-react";
import { useChatStore } from "@/store/chatStore";
import { getSocket } from "@/lib/socket";

export default function ChatInput() {
  const [input, setInput] = useState("");
  const currentRoom = useChatStore((state) => state.currentRoom);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleSend = () => {
    if (!input.trim()) return;

    const socket = getSocket();
    if (socket) {
      socket.emit("chatMessage", input, false);
      setInput("");

      // Stop typing indicator
      socket.emit("stopTyping");
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    }
  };

  const handleTyping = () => {
    const socket = getSocket();
    if (!socket) return;

    socket.emit("typing");

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      socket.emit("stopTyping");
    }, 1000);
  };

  return (
    <div className="bg-white border-t border-gray-200 p-4 text-gray-400">
      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            handleTyping();
          }}
          onKeyPress={(e) => e.key === "Enter" && handleSend()}
          placeholder={`Message #${currentRoom}`}
          className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
        />
        <button
          onClick={handleSend}
          className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors flex items-center gap-2"
        >
          <Send className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
