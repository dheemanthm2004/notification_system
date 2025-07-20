'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, getAuthToken, removeAuthToken, setAuthToken } from '../lib/auth';
import api from '../lib/api';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  demoLogin: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const token = getAuthToken();
      if (token) {
        try {
          const response = await api.get('/auth/me');
          setUser(response.data.user);
        } catch (error) {
          removeAuthToken();
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password });
    const { user, token } = response.data;
    setAuthToken(token);
    setUser(user);
  };

  const register = async (name: string, email: string, password: string) => {
    const response = await api.post('/auth/register', { name, email, password });
    const { user, token } = response.data;
    setAuthToken(token);
    setUser(user);
  };

  const logout = async () => {
    setLoading(true);
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    }
    removeAuthToken();
    setUser(null);
    setLoading(false);
    window.location.href = '/login';
  };

  const demoLogin = async () => {
    setLoading(true);
    try {
      // Use predefined demo credentials
      const response = await api.post('/auth/login', { 
        email: 'demo@example.com', 
        password: 'Demo@123'
      });
      const { user, token } = response.data;
      setAuthToken(token);
      setUser(user);
    } catch (error: any) {
      // If login fails (first time), register the demo user
      if (error.response?.status === 401) {
        try {
          const registerResponse = await api.post('/auth/register', {
            name: 'Demo User',
            email: 'demo@example.com',
            password: 'Demo@123'
          });
          const { user, token } = registerResponse.data;
          setAuthToken(token);
          setUser(user);
        } catch (registerError) {
          console.error('Demo registration error:', registerError);
        }
      } else {
        console.error('Demo login error:', error);
      }
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    demoLogin,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};