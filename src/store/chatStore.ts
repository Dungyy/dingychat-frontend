import { create } from "zustand";
import { Message, User } from "@/types";

interface ChatState {
  user: User | null;
  currentRoom: string;
  messages: Message[];
  typingUsers: string[];
  setUser: (user: User | null) => void;
  setCurrentRoom: (room: string) => void;
  addMessage: (message: Message) => void;
  setMessages: (messages: Message[]) => void;
  addTypingUser: (username: string) => void;
  removeTypingUser: (username: string) => void;
  clearMessages: () => void;
  addCustomRoom: (room: string) => void;
}

export const useChatStore = create<ChatState>((set) => ({
  user: null,
  currentRoom: "",
  messages: [],
  typingUsers: [],
  setUser: (user) => set({ user }),
  setCurrentRoom: (room) => set({ currentRoom: room, messages: [] }),
  addMessage: (message) =>
    set((state) => ({
      messages: [...state.messages, message],
    })),
  setMessages: (messages) => set({ messages }),
  addTypingUser: (username) =>
    set((state) => ({
      typingUsers: [...state.typingUsers, username],
    })),
  removeTypingUser: (username) =>
    set((state) => ({
      typingUsers: state.typingUsers.filter((u) => u !== username),
    })),
  clearMessages: () => set({ messages: [] }),
  addCustomRoom: (room) => set((state) => ({ currentRoom: room })), // Placeholder for future use
}));
