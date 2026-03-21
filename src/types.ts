export interface Game {
  id: string;
  title: string;
  description: string;
  developerId: string;
  genre: string;
  coverUrl: string;
  trailerUrl: string;
  fileUrl: string;
  price?: number;
}

export interface User {
  id: string;
  username: string;
  email: string;
  role: 'gamer' | 'developer';
  accentColor: string;
}

export type Theme = 'light' | 'dark';

export interface SupportMember {
  id: string;
  name: string;
  role: string;
  email: string;
  phone: string;
  avatarUrl?: string;
}
