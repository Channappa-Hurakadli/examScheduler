import React, { createContext, useState, useEffect, ReactNode, useContext } from 'react';
import { apiService } from '../services/api';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  institution: string;
  avatar: string;
}

interface AuthContextType {
  user: User | null;
  login: (credentials: any) => Promise<void>;
  signup: (userInfo: any) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // In a real app, you'd verify the token with the backend and fetch user data
      // For now, we'll simulate a logged-in user if a token exists
      setUser({
        id: '1',
        name: 'Dr. Sarah Johnson',
        email: 'admin@university.edu',
        role: 'admin',
        institution: 'Metropolitan University',
        avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150'
      });
    }
    setLoading(false);
  }, []);

  const login = async (credentials: any) => {
    setLoading(true);
    try {
      const response = await apiService.login(credentials);
      localStorage.setItem('token', response.data.token);
      // In a real app, you would set the user state based on the response
      setUser({
        id: response.data._id,
        name: 'User', // You might want to return more user info from your login endpoint
        email: response.data.email,
        role: 'admin',
        institution: 'Metropolitan University',
        avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150'
      });
    } finally {
      setLoading(false);
    }
  };

  const signup = async (userInfo: any) => {
    setLoading(true);
    try {
      const response = await apiService.signup(userInfo);
      localStorage.setItem('token', response.data.token);
      setUser({
        id: response.data._id,
        name: 'New User',
        email: response.data.email,
        role: 'user',
        institution: 'Metropolitan University',
        avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150'
      });
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
      throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
