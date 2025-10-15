import { API_URL } from "@/global";

export const login = async (username: string, password: string) => {
  const response = await fetch(`${API_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });

  if (!response.ok) {
    throw new Error("Login failed");
  }

  return response.json();
};

export const register = async (username: string, password: string) => {
  const response = await fetch(`${API_URL}/api/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });

  if (!response.ok) {
    throw new Error("Registration failed");
  }

  return response.json();
};

export const fetchApiRooms = async (token: string): Promise<string[]> => {
    const response = await fetch(`${API_URL}/api/auth/rooms`, {
        headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) {
        throw new Error("Failed to fetch rooms");
    }

    const res = await response.json();
    return Array.isArray(res) ? res.map((room: { name: string }) => room.name) : [];
};

export const postFreeUser = async (username: string): Promise<{ color: string }> => {
    const response = await fetch(`${API_URL}/api/user/freeuser`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username }),
    });
  
    if (!response.ok) {
        throw new Error("Failed to get free user");
    }

    return response.json();
};

export const getFreeRoom = async (): Promise<string> => {
    const response = await fetch(`${API_URL}/api/user/freerooms`);

    // if (!response.ok) {
    //     throw new Error("Failed to fetch free room");
    // }
  
    const res = await response.json();
    return Array.isArray(res) && res.length > 0
      ? res[0].name
      : "";
}