import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import type { AuthUser, UserRole } from '../types';

// ─── Hard-coded credential store (frontend-only, no backend touched) ───────────
// Format: email → { passwordHash, role, name }
// Passwords are compared in plain-text here since this is a pure frontend auth layer.
// In production you would call an auth API; per requirements we keep the backend untouched.
const CREDENTIAL_STORE: Record<string, { id: number; password: string; role: UserRole; name: string }> = {
  'admin@retailos.com':   { id: 1, password: 'Admin@1234',  role: 'ADMIN', name: 'Admin User'  },
  'manager@retailos.com': { id: 2, password: 'Manager@99',  role: 'ADMIN', name: 'Store Manager' },
  'user@retailos.com':    { id: 3, password: 'User@1234',   role: 'USER',  name: 'Regular User' },
  'staff@retailos.com':   { id: 4, password: 'Staff@5678',  role: 'USER',  name: 'Staff Member' },
};

const SESSION_KEY = 'retail_auth_user';

// ─── Context ──────────────────────────────────────────────────────────────────
interface AuthContextValue {
  user: AuthUser | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => {
    try {
      const stored = sessionStorage.getItem(SESSION_KEY);
      if (!stored) return null;

      const parsed = JSON.parse(stored) as Partial<AuthUser> & { email?: string };
      if (typeof parsed.id !== 'number' && parsed.email) {
        const entry = CREDENTIAL_STORE[parsed.email.toLowerCase().trim()];
        if (entry) {
          return {
            id: entry.id,
            email: parsed.email.toLowerCase().trim(),
            role: entry.role,
            name: entry.name,
          };
        }
      }

      return typeof parsed.id === 'number' && typeof parsed.email === 'string' && typeof parsed.role === 'string' && typeof parsed.name === 'string'
        ? (parsed as AuthUser)
        : null;
    } catch {
      return null;
    }
  });

  const login = useCallback(async (email: string, password: string) => {
    // Simulate async network call (150 ms)
    await new Promise(r => setTimeout(r, 150));

    const entry = CREDENTIAL_STORE[email.toLowerCase().trim()];
    if (!entry || entry.password !== password) {
      throw new Error('Invalid email or password.');
    }

    const authUser: AuthUser = { id: entry.id, email: email.toLowerCase().trim(), role: entry.role, name: entry.name };
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(authUser));
    setUser(authUser);
  }, []);

  const logout = useCallback(() => {
    sessionStorage.removeItem(SESSION_KEY);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}
