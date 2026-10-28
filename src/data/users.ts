// src/data/users.ts
import usersJson from './users.json';

const IMAGE_MAP: Record<string, number> = {
  'admin.png': require('@/assets/images/users/admin.png'),
  'user1.png': require('@/assets/images/users/user1.png'),
};

export interface AppUser {
  id: string;
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'user' | 'guest';
  points: number;
  image: number;
}

export const USERS: AppUser[] = (usersJson as { users: any[] }).users.map((u) => ({
  id: u.id,
  name: u.name,
  email: u.email,
  password: u.password,
  role: u.role,
  points: u.points ?? 0,
  image: IMAGE_MAP[u.image] ?? IMAGE_MAP['user1.png'],
}));

export function authenticate(email: string, password: string): AppUser | null {
  return USERS.find((u) => u.email.toLowerCase() === email.trim().toLowerCase() && u.password === password) ?? null;
}