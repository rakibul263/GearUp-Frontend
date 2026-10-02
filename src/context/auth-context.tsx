"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { User } from "@/types";
import { authApi, removeToken } from "@/lib/api";
import { isTokenExpired, decodeJwt } from "@/lib/jwt";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (credentials: { email: string; password: string }) => Promise<void>;
  register: (data: {
    name: string;
    email: string;
    password: string;
    phone?: string;
    role?: "CUSTOMER" | "PROVIDER";
  }) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
  isAuthenticated: boolean;
  isProvider: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = async () => {
    try {
      if (typeof window !== "undefined") {
        const token = localStorage.getItem("gearup_token");
        if (!token || isTokenExpired(token)) {
          removeToken();
          setUser(null);
          setLoading(false);
          return;
        }
      }
      const me = await authApi.getMe();
      setUser(me);
    } catch {
      setUser(null);
      removeToken();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

  const login = async (credentials: { email: string; password: string }) => {
    const res = await authApi.login(credentials);
    setUser(res.user);
  };

  const register = async (data: {
    name: string;
    email: string;
    password: string;
    phone?: string;
    role?: "CUSTOMER" | "PROVIDER";
  }) => {
    await authApi.register(data);
    // After register, automatically log in
    const res = await authApi.login({
      email: data.email,
      password: data.password,
    });
    setUser(res.user);
  };

  const logout = () => {
    authApi.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        refreshUser,
        isAuthenticated: !!user,
        isProvider: user?.role === "PROVIDER",
        isAdmin: user?.role === "ADMIN",
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
