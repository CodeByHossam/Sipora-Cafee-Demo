// src/hooks/useUser.tsx
import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { AppUser } from '@/data/users';

interface User {
  isLoggedIn: boolean;
  userName: string;
  points: number;
  role: 'guest' | 'user' | 'admin';
  image: number | null;
}

interface UserContextValue {
  user: User;
  login: (name: string) => void;
  loginAs: (appUser: AppUser) => void;
  logout: () => void;
  addPoints: (amount: number) => void;
  redeemPoints: (amount: number) => boolean;
}

const UserContext = createContext<UserContextValue | null>(null);

const GUEST: User = { isLoggedIn: false, userName: '', points: 0, role: 'guest', image: null };

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User>(GUEST);

  const login = useCallback((name: string) => {
    setUser({ isLoggedIn: true, userName: name.trim() || 'Member', points: 0, role: 'user', image: null });
  }, []);

  const loginAs = useCallback((appUser: AppUser) => {
    setUser({ isLoggedIn: true, userName: appUser.name, points: appUser.points, role: appUser.role, image: appUser.image });
  }, []);

  const logout = useCallback(() => setUser(GUEST), []);

  const addPoints = useCallback((amount: number) => {
    if (amount <= 0) return;
    setUser((u) => ({ ...u, points: u.points + amount }));
  }, []);

  const redeemPoints = useCallback((amount: number) => {
    let ok = false;
    setUser((u) => {
      if (u.points >= amount) { ok = true; return { ...u, points: u.points - amount }; }
      return u;
    });
    return ok;
  }, []);

  return (
    <UserContext.Provider value={{ user, login, loginAs, logout, addPoints, redeemPoints }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error('useUser must be used within UserProvider');
  return ctx;
}