import { io, Socket } from "socket.io-client";
import { SOCKET_URL } from "@/global";

let socket: Socket | null = null;

export const connectSocket = (token: string): Socket => {
  if (socket?.connected) {
    return socket;
  }

  socket = io(SOCKET_URL || "http://localhost:8069", {
    auth: { token },
    transports: ["websocket"],
  });

  if (socket) {
    socket.on("connect", () => {
      console.log("Connected to socket server");
    });

    socket.on("connect_error", (error) => {
      console.error("Socket connection error:", error.message);
    });

    socket.on("disconnect", () => {
      console.log("Disconnected from socket server");
    });
  }

  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

export const getSocket = (): Socket | null => socket;
