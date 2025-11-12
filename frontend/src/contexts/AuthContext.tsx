import { useQuery } from '@tanstack/react-query';
import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import api from '../services/api'; 

interface User {
  id: number;
  email: string;
  firstName: string;
}

interface AuthContextType {
  token: string | null;
  user: User | null;
  login: (token: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {

  const [token, setToken] = useState<string | null>(() => localStorage.getItem('authToken'));

  const [user, setUser] = useState<User | null>(null);

  const login = async (newToken: string) => {

    setToken(newToken);
    localStorage.setItem('authToken', newToken);

    api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;

    try {

      const response = await api.get('/api/v1/users/me');
      console.log(response)
      setUser(response.data); 
    } catch (error) {
      console.error("Falha ao buscar dados do utilizador após o login:", error);
      logout();
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('authToken');
    delete api.defaults.headers.common['Authorization'];
  };

  const value = { token, user, login, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};