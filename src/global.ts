import { fetchApiRooms, getFreeRoom } from "./lib/api";


// important global constants
export const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8069";
export const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || "ws://localhost:8069";
export const MAX_MESSAGE_LENGTH = 500;

export const token =
  typeof window !== "undefined" && window.localStorage
    ? window.localStorage.getItem("token") ?? ""
    : "";
export const USER_ROOMS = await fetchApiRooms(token); // should be comming from api tho
export const DEFAULT_ROOM = await getFreeRoom();