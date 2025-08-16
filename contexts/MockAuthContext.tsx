"use client";

import { createContext, ReactNode, useContext, useEffect, useState } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  login: () => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  isAuthenticated: boolean;
}

const MockAuthContext = createContext<AuthContextType | undefined>(undefined);

export function MockAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  // Auto-login with demo user on component mount
  useEffect(() => {
    const demoUser = {
      id: 'demo-user-123',
      name: 'Demo User',
      email: 'demo@example.com'
    };
    setUser(demoUser);
  }, []);

  const login = async () => {
    const demoUser = {
      id: 'demo-user-123',
      name: 'Demo User',
      email: 'demo@example.com'
    };
    setUser(demoUser);
    return { success: true };
  };

  const logout = () => {
    // Don't actually log out, just keep the demo user
    return;
  };

  return (
    <MockAuthContext.Provider
      value={{
        user,
        login,
        logout,
        isAuthenticated: true
      }}
    >
      {children}
    </MockAuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(MockAuthContext);
  if (context === undefined) {
    // Return safe defaults instead of throwing an error
    return {
      user: null,
      login: async () => ({ success: false, error: 'Auth not available' }),
      logout: () => { },
      isAuthenticated: false
    };
  }
  return context;
};
