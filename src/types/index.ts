export interface User {
  username: string;
  color: string;
  token?: string; // token is optional, not required for free user
}

export interface Message {
  _id: string;
  room: string;
  sender: string;
  text: string;
  color: string;
  createdAt: Date;
  isSystem?: boolean;
}

export interface Room {
  _id: string;
  name: string;
  ephemeral: boolean;
  expiresAt?: Date;
}
