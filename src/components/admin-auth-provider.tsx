
"use client";

import { createContext, useEffect, useState, type ReactNode } from "react";

interface AdminAuthContextType {
  admin: boolean;
  loading: boolean;
  login: (user: string, pass: string) => boolean;
  logout: () => void;
}

export const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

const ADMIN_USER = 'roboxcraft';
const ADMIN_PASS = 'bikashA1@#';
const SESSION_STORAGE_KEY = 'admin-auth';

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [admin, setAdmin] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const storedAuth = sessionStorage.getItem(SESSION_STORAGE_KEY);
      if (storedAuth) {
        setAdmin(JSON.parse(storedAuth));
      }
    } catch (error) {
        console.error("Could not parse admin auth from session storage", error);
    }
    setLoading(false);
  }, []);

  const login = (user: string, pass: string) => {
    if (user === ADMIN_USER && pass === ADMIN_PASS) {
      setAdmin(true);
      sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(true));
      return true;
    }
    return false;
  };

  const logout = () => {
    setAdmin(false);
    sessionStorage.removeItem(SESSION_STORAGE_KEY);
  };

  const value = {
    admin,
    loading,
    login,
    logout,
  };

  return (
    <AdminAuthContext.Provider value={value}>
      {children}
    </AdminAuthContext.Provider>
  );
}
