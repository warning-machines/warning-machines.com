'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

type AuthUser = {
  name: string;
  email?: string;
  picture?: string;
  sub?: string;
};

type AuthContextValue = {
  user: AuthUser | null;
  isLoading: boolean;
  loginWithGoogleCredential: (credential: string) => void;
  loginWithCredentials: (email: string, name?: string) => void;
  logout: () => void;
};

const STORAGE_KEY = 'auth:user';

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function decodeJwt(credential: string): AuthUser | null {
  try {
    const [, payload] = credential.split('.');
    const json = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
    const data = JSON.parse(json);
    return {
      name: data.name || data.given_name || data.email?.split('@')[0],
      email: data.email,
      picture: data.picture,
      sub: data.sub,
    };
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  // Start with null to match server render, hydrate from localStorage in useEffect
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Hydrate from localStorage after mount (client-side only)
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setUser(JSON.parse(stored) as AuthUser);
      }
    } catch {
      // Ignore parse errors
    }
    setIsLoading(false);
  }, []);

  const persist = useCallback((next: AuthUser | null) => {
    setUser(next);
    if (next) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  const loginWithGoogleCredential = useCallback(
    (credential: string) => {
      const decoded = decodeJwt(credential);
      if (decoded) {
        persist(decoded);
      }
    },
    [persist]
  );

  const loginWithCredentials = useCallback(
    (email: string, name?: string) => {
      const fallbackName = name?.trim() || email.split('@')[0];
      persist({ email, name: fallbackName });
    },
    [persist]
  );

  const logout = useCallback(() => persist(null), [persist]);

  const value = useMemo(
    () => ({ user, isLoading, loginWithGoogleCredential, loginWithCredentials, logout }),
    [user, isLoading, loginWithGoogleCredential, loginWithCredentials, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
}

