export interface User {
  username: string;
  color: string;
  token: string;
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
