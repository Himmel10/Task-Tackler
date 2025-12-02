'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthContextType } from '@/types/auth';
import { 
  saveAuthUser, 
  loadAuthUser,
  initializeDemoAdmin 
} from '@/lib/authUtils';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUserState] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      // Initialize demo admin
      await initializeDemoAdmin();
      
      // Load user from storage
      const storedUser = loadAuthUser();
      setUserState(storedUser);
      setIsLoading(false);
    };
    
    init();
  }, []);

  const signUp = async (email: string, username: string, password: string) => {
    try {
      // Check if user exists in DB
      const checkRes = await fetch(`/api/users?email=${encodeURIComponent(email)}`);
      if (checkRes.ok) {
        throw new Error('Email already registered');
      }

      if (password.length < 6) {
        throw new Error('Password must be at least 6 characters');
      }

      // Create user in database
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.toLowerCase(),
          username,
          password,
          role: 'USER',
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to create user');
      }

      const newUser = await res.json();
      const userToStore: User = {
        id: newUser.id,
        email: newUser.email,
        username: newUser.username,
        password: newUser.password,
        role: newUser.role?.toLowerCase() || 'user',
        createdAt: newUser.createdAt,
      };

      saveAuthUser(userToStore);
      setUserState(userToStore);
    } catch (error) {
      throw error;
    }
  };

  const signIn = async (email: string, _password: string) => {
    try {
      // Try to authenticate with database
      const res = await fetch('/api/users?email=' + encodeURIComponent(email));
      
      if (!res.ok) {
        throw new Error('User not found');
      }

      const dbUser = await res.json();
      
      // In production, verify password with bcrypt on server
      // For now, we store the user to localStorage
      const userToStore: User = {
        id: dbUser.id, // Use database ID
        email: dbUser.email,
        username: dbUser.username,
        password: dbUser.password,
        role: dbUser.role?.toLowerCase() === 'admin' ? 'admin' : 'user',
        createdAt: dbUser.createdAt,
        lastLogin: new Date().toISOString(),
      };
      
      saveAuthUser(userToStore);
      setUserState(userToStore);
    } catch (error) {
      throw error;
    }
  };

  const signOut = () => {
    saveAuthUser(null);
    setUserState(null);
  };

  const setUser = (newUser: User | null) => {
    if (newUser) {
      saveAuthUser(newUser);
    } else {
      saveAuthUser(null);
    }
    setUserState(newUser);
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: user !== null,
    isLoading,
    signUp,
    signIn,
    signOut,
    setUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
