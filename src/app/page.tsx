"use client";

import { useEffect } from "react";
import { useChatStore } from "@/store/chatStore";
import { connectSocket, getSocket } from "@/lib/socket";
import LoginForm from "@/components/LoginForm";
import ChatSidebar from "@/components/ChatSidebar";
import ChatMessages from "@/components/ChatMessages";
import ChatInput from "@/components/ChatInput";
import TypingIndicator from "@/components/TypingIndicator";
import { Message } from "@/types";

export default function Home() {
  const {
    user,
    setUser,
    currentRoom,
    addMessage,
    setMessages,
    addTypingUser,
    removeTypingUser,
  } = useChatStore();

  useEffect(() => {
    // Check for existing token
    const token = localStorage.getItem("token");
    const username = localStorage.getItem("username");
    const color = localStorage.getItem("color");

    if (token && username && color) {
      setUser({ username, color, token });
      const socket = connectSocket(token);

      // Socket event listeners
      socket.on("loadMessages", (messages: Message[]) => {
        setMessages(messages);
      });

      socket.on("chatMessage", (message: Message) => {
        addMessage(message);
      });

      socket.on("systemMessage", (text: string) => {
        addMessage({
          _id: Date.now().toString(),
          room: currentRoom,
          sender: "System",
          text,
          color: "#6B7280",
          createdAt: new Date(),
          isSystem: true,
        });
      });

      socket.on("typing", (username: string) => {
        addTypingUser(username);
      });

      socket.on("stopTyping", (username: string) => {
        removeTypingUser(username);
      });

      socket.on("deleteMessage", (messageId: string) => {
        // Handle message deletion
        console.log("Message deleted:", messageId);
      });

      // Join default room
      socket.emit("joinRoom", "general");
    }
  }, []);

  if (!user) {
    return <LoginForm />;
  }

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <ChatSidebar />
      <div className="flex-1 flex flex-col">
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <h2 className="text-xl font-semibold text-gray-800">
            # {currentRoom}
          </h2>
        </div>
        <ChatMessages />
        <TypingIndicator />
        <ChatInput />
      </div>
    </div>
  );
}
