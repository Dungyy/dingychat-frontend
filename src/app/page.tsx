"use client";

import { useEffect, useState } from "react";
import { useChatStore } from "@/store/chatStore";
import { connectSocket, getSocket } from "@/lib/socket";
import LoginForm from "@/components/LoginForm";
import ChatSidebar from "@/components/ChatSidebar";
import ChatMessages from "@/components/ChatMessages";
import ChatInput from "@/components/ChatInput";
// import TypingIndicator from "@/components/TypingIndicator";
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

  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);

  useEffect(() => {
    const initializeConnection = async () => {
      // Check for existing credentials
      const token =
        typeof window !== "undefined" ? localStorage.getItem("token") : null;
      const username =
        typeof window !== "undefined" ? localStorage.getItem("username") : null;
      const color =
        typeof window !== "undefined" ? localStorage.getItem("color") : null;

      if (token && username && color) {
        setIsConnecting(true);
        setConnectionError(null);

        try {
          setUser({ username, color, token });
          const socket = connectSocket(token);

          // Connection error handler
          socket.on("connect_error", (error) => {
            console.error("Connection error:", error);
            setConnectionError("Failed to connect to chat server");
            setIsConnecting(false);
          });

          socket.on("connect", () => {
            setIsConnecting(false);
            setConnectionError(null);
          });

          // Message handlers
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

          // Typing indicators
          socket.on("typing", (username: string) => {
            addTypingUser(username);
          });

          socket.on("stopTyping", (username: string) => {
            removeTypingUser(username);
          });

          // Message deletion
          socket.on("deleteMessage", (messageId: string) => {
            console.log("Message deleted:", messageId);
          });

          // Join default room
          socket.emit("joinRoom", "general");
        } catch (error) {
          console.error("Failed to initialize socket:", error);
          setConnectionError("Failed to initialize connection");
          setIsConnecting(false);
        }
      }
    };

    initializeConnection();

    // Cleanup on unmount
    return () => {
      const socket = getSocket();
      if (socket) {
        socket.off("connect_error");
        socket.off("connect");
        socket.off("loadMessages");
        socket.off("chatMessage");
        socket.off("systemMessage");
        socket.off("typing");
        socket.off("stopTyping");
        socket.off("deleteMessage");
      }
    };
  }, []);

  // Show login form if no user
  if (!user) {
    return <LoginForm />;
  }

  // Show connecting state
  if (isConnecting) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Connecting to da chat...</p>
        </div>
      </div>
    );
  }

  // Show connection error
  if (connectionError) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center max-w-md p-6 bg-white rounded-lg shadow-lg">
          <h2 className="text-xl font-bold text-gray-800 mb-2">
            Connection Error or are you not signed up?
          </h2>
          <p className="text-gray-600 mb-4">{connectionError}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Retry Connection
          </button>
          <div className="text-gray-600 mb-4">
            <button
              onClick={() => {
                localStorage.removeItem("token");
                localStorage.removeItem("username");
                localStorage.removeItem("color");
                window.location.reload();
              }}
              className="underline"
            >
              Clear Local Storage
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-gray-100 flex overflow-hidden">
      <ChatSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        {/* Room Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4 flex-shrink-0 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
              <span className="text-gray-400">#</span>
              {currentRoom || "OMNI CHAT"}
            </h2>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-sm text-gray-600">Connected</span>
            </div>
          </div>
        </div>

        {/* Messages Area */}
        <ChatMessages />

        {/* ** FIX AS ITS BROKEN **  */}
        {/* Typing Indicator */}
        {/* <TypingIndicator /> */}

        {/* Input Area */}
        <ChatInput />
      </div>
    </div>
  );
}
