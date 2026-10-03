'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AuthResponse, Role, User } from '@/types';
import {
  fetchApi,
  getAuthToken,
  getStoredUser,
  removeAuthToken,
  removeStoredUser,
  setAuthToken,
  setStoredUser,
} from '@/lib/api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, role?: Role) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const router = useRouter();

  useEffect(() => {
    const storedToken = getAuthToken();
    const storedUser = getStoredUser();

    queueMicrotask(() => {
      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(storedUser);
      }
      setIsLoading(false);
    });
  }, []);

  const login = async (email: string, password: string) => {
    const data = await fetchApi<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    if (data.accessToken && data.user) {
      setAuthToken(data.accessToken);
      setStoredUser(data.user);
      setToken(data.accessToken);
      setUser(data.user);

      if (data.user.role === Role.ADMISSION_TEAM) {
        router.push('/admission/dashboard');
      } else {
        router.push('/dashboard');
      }
    }
  };

  const register = async (name: string, email: string, password: string, role: Role = Role.PARENT) => {
    await fetchApi('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password, role }),
    });

    // After registration, log the user in automatically
    await login(email, password);
  };

  const logout = () => {
    removeAuthToken();
    removeStoredUser();
    setToken(null);
    setUser(null);
    router.push('/login');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token && !!user,
        isLoading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
