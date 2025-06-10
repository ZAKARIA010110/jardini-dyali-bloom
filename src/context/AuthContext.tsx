
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string, userType: 'homeowner' | 'gardener') => Promise<void>;
  logout: () => void;
  loading: boolean;
  sendEmailVerification: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Check for stored user session
    const storedUser = localStorage.getItem('jardini_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Check for admin credentials
      let userType: 'homeowner' | 'gardener' | 'admin' = 'homeowner';
      if (email === 'admin@jardini.ma' && password === 'admin123') {
        userType = 'admin';
      } else if (email.includes('gardener')) {
        userType = 'gardener';
      }
      
      const userData: User = {
        id: Math.random().toString(36).substr(2, 9),
        email,
        userType,
        name: email.split('@')[0]
      };
      
      setUser(userData);
      localStorage.setItem('jardini_user', JSON.stringify(userData));
    } catch (error) {
      throw new Error('Login failed');
    } finally {
      setLoading(false);
    }
  };

  const signup = async (email: string, password: string, name: string, userType: 'homeowner' | 'gardener') => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const userData: User = {
        id: Math.random().toString(36).substr(2, 9),
        email,
        userType,
        name
      };
      
      setUser(userData);
      localStorage.setItem('jardini_user', JSON.stringify(userData));
    } catch (error) {
      throw new Error('Signup failed');
    } finally {
      setLoading(false);
    }
  };

  const sendEmailVerification = async (email: string) => {
    // Simulate sending email verification
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log('Email verification sent to:', email);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('jardini_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, loading, sendEmailVerification }}>
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
