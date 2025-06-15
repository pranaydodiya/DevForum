
import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  reputation: number;
  joinDate: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
  defaultCredentials: {
    email: string;
    password: string;
  };
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>({
    id: '1',
    name: 'Pranay Dodiya',
    email: 'pranaydodiya2005@gmail.com',
    avatar: 'PD',
    reputation: 2340,
    joinDate: '2025-01-15'
  });
  const [isLoading, setIsLoading] = useState(false);

  const defaultCredentials = {
    email: 'pranaydodiya2005@gmail.com',
    password: 'Pranay2005#'
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Demo credentials - existing user with stats
    if (email === defaultCredentials.email && password === defaultCredentials.password) {
      const demoUser: User = {
        id: '1',
        name: 'Pranay Dodiya',
        email: defaultCredentials.email,
        avatar: 'PD',
        reputation: 2340,
        joinDate: '2025-01-15'
      };
      setUser(demoUser);
      setIsLoading(false);
      return true;
    }
    
    setIsLoading(false);
    return false;
  };

  const signup = async (name: string, email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Simple validation - just check if password is at least 3 characters
    if (name.trim() && email.trim() && password.length >= 3) {
      const newUser: User = {
        id: Date.now().toString(),
        name: name.trim(),
        email: email.trim(),
        avatar: name.charAt(0).toUpperCase(),
        reputation: 0, // New users start with 0 reputation
        joinDate: new Date().toISOString().split('T')[0]
      };
      setUser(newUser);
      setIsLoading(false);
      return true;
    }
    
    setIsLoading(false);
    return false;
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, isLoading, defaultCredentials }}>
      {children}
    </AuthContext.Provider>
  );
};
