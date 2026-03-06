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
  loading: boolean;      
  login: (token: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('authToken'));
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
    const initializeAuth = async () => {
      const savedToken = localStorage.getItem('authToken');
      
      if (savedToken) {
        try {
          api.defaults.headers.common['Authorization'] = `Bearer ${savedToken}`;

          const response = await api.get('/api/v1/users/me');
          setUser(response.data);
          setToken(savedToken);
        } catch (error) {
          console.error("Sessão expirada ou inválida");
          logout(); 
        }
      }
      
      setLoading(false); 
    };

    initializeAuth();
  }, []);

  const login = async (newToken: string) => {
    try {
      setToken(newToken);
      localStorage.setItem('authToken', newToken);
      api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;

      const response = await api.get('/api/v1/users/me');
      setUser(response.data);
    } catch (error) {
      logout();
      throw error; 
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('authToken');
    delete api.defaults.headers.common['Authorization'];
  };

  const value = { 
    token, 
    user, 
    loading, 
    login, 
    logout 
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};