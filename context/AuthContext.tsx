
'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  getStoredUser,
  storeAuthData,
  clearAuthData,
  loginUser as apiLogin,
  registerUser as apiRegister,
  AuthResponse,
} from '@/lib/auth';

interface AuthContextType {
  user: AuthResponse['user'] | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  loginWithMobile: (mobileNumber: string, password: string) => Promise<void>;
  register: (data: {
    email: string;
    password: string;
    mobileNumber: string;
    name?: string;
  }) => Promise<void>;
  logout: () => void;
  refreshUser: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthResponse['user'] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const refreshUser = () => {
    const stored = getStoredUser();
    setUser(stored);
  };

  useEffect(() => {
    refreshUser();
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    const response = await apiLogin({ email, password });
    storeAuthData(response.token, response.user);
    setUser(response.user);
    router.push(response.user.role === 'admin' ? '/admin/dashboard' : '/employee/dashboard');
  };

  const loginWithMobile = async (mobileNumber: string, password: string) => {
    const response = await apiLogin({ mobileNumber, password });
    storeAuthData(response.token, response.user);
    setUser(response.user);
    router.push(response.user.role === 'admin' ? '/admin/dashboard' : '/employee/dashboard');
  };

  const register = async (data: {
    email: string;
    password: string;
    mobileNumber: string;
    name?: string;
  }) => {
    const response = await apiRegister(data);
    storeAuthData(response.token, response.user);
    setUser(response.user);
    router.push('/employee/dashboard');
  };

  const logout = () => {
    clearAuthData();
    setUser(null);
    router.push('/login');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        loginWithMobile,
        register,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}