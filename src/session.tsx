import { createContext, type ReactNode, useContext, useMemo, useState } from 'react';
import type { DogProfile } from './types';

export type PackaUser = {
  name: string;
  email: string;
};

type SessionContextValue = {
  user: PackaUser | null;
  login: (user: PackaUser) => void;
  logout: () => void;
  userKey: (key: string) => string;
};

const CURRENT_USER_KEY = 'packa-current-user';

export const emptyDogProfile: DogProfile = {
  name: '',
  breed: '',
  birthday: '',
  age: '',
  weight: '',
  chip: '',
  tattoo: '',
  vet: '',
  contacts: ['', ''],
  notes: ''
};

const SessionContext = createContext<SessionContextValue | null>(null);

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function loadStoredUser() {
  try {
    const stored = window.localStorage.getItem(CURRENT_USER_KEY);
    if (!stored) return null;
    const parsed = JSON.parse(stored) as Partial<PackaUser>;
    if (typeof parsed.email !== 'string' || typeof parsed.name !== 'string') return null;
    return { email: normalizeEmail(parsed.email), name: parsed.name.trim() };
  } catch {
    return null;
  }
}

export function SessionProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<PackaUser | null>(() => loadStoredUser());

  const value = useMemo<SessionContextValue>(() => ({
    user,
    login(nextUser) {
      const normalizedUser = {
        name: nextUser.name.trim() || normalizeEmail(nextUser.email),
        email: normalizeEmail(nextUser.email)
      };
      window.localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(normalizedUser));
      setUser(normalizedUser);
    },
    logout() {
      window.localStorage.removeItem(CURRENT_USER_KEY);
      setUser(null);
    },
    userKey(key) {
      return user ? `packa:${user.email}:${key}` : `packa:anonymous:${key}`;
    }
  }), [user]);

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useSession() {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error('useSession must be used inside SessionProvider');
  }
  return context;
}
