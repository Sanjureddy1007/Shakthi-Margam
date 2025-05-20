import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase, auth } from '../services/supabase';

interface AuthContextType {
  session: Session | null;
  user: User | null;
  loading: boolean;
  isGuest: boolean;
  signUp: (email: string, password: string, userData?: any) => Promise<any>;
  signIn: (email: string, password: string) => Promise<any>;
  signInAsGuest: () => void;
  signOut: () => Promise<any>;
  resetPassword: (email: string) => Promise<any>;
  updatePassword: (newPassword: string) => Promise<any>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isGuest, setIsGuest] = useState(false);

  useEffect(() => {
    // Check if user is in guest mode
    const guestMode = localStorage.getItem('guestMode') === 'true';
    setIsGuest(guestMode);

    // Get initial session
    const getInitialSession = async () => {
      try {
        setLoading(true);
        const { data } = await auth.getSession();
        setSession(data.session);
        setUser(data.session?.user ?? null);
      } catch (error) {
        console.error('Error getting initial session:', error);
      } finally {
        setLoading(false);
      }
    };

    // Only check for session if not in guest mode
    if (!guestMode) {
      getInitialSession();
    } else {
      setLoading(false);
    }

    // Listen for auth changes
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        setSession(newSession);
        setUser(newSession?.user ?? null);
        setLoading(false);

        // If user signs in, exit guest mode
        if (newSession) {
          setIsGuest(false);
          localStorage.removeItem('guestMode');
        }
      }
    );

    // Cleanup subscription on unmount
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  // Function to sign in as guest
  const signInAsGuest = () => {
    setIsGuest(true);
    setUser(null);
    setSession(null);
    localStorage.setItem('guestMode', 'true');
  };

  const value = {
    session,
    user,
    loading,
    isGuest,
    signUp: auth.signUp,
    signIn: auth.signIn,
    signInAsGuest,
    signOut: async () => {
      const result = await auth.signOut();
      // If in guest mode, also clear guest mode
      if (isGuest) {
        setIsGuest(false);
        localStorage.removeItem('guestMode');
      }
      return result;
    },
    resetPassword: auth.resetPassword,
    updatePassword: auth.updatePassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
