import React, { createContext, useContext, useState, useEffect } from 'react';
import AuthService, { UserProfile, UserCredentials, UserRegistration } from '../services/auth/AuthService';
import supabase from '../services/supabase/supabaseClient';

// Auth context types
interface AuthContextType {
  user: any;
  profile: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (credentials: UserCredentials) => Promise<boolean>;
  register: (userData: UserRegistration) => Promise<boolean>;
  logout: () => Promise<void>;
  updateProfile: (profileData: Partial<UserProfile>) => Promise<UserProfile | null>;
  requestPasswordReset: (email: string) => Promise<boolean>;
  resetPassword: (newPassword: string) => Promise<boolean>;
  clearError: () => void;
}

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Auth provider props
interface AuthProviderProps {
  children: React.ReactNode;
}

// Auth provider component
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const authService = AuthService.getInstance();

  // Initialize auth state
  useEffect(() => {
    const initAuth = async () => {
      setIsLoading(true);
      try {
        const { user, profile, error } = await authService.getCurrentUser();
        
        if (user) {
          setUser(user);
          setProfile(profile);
          setIsAuthenticated(true);
        } else {
          setUser(null);
          setProfile(null);
          setIsAuthenticated(false);
        }
        
        if (error) {
          setError(error);
        }
      } catch (err: any) {
        console.error('Auth initialization error:', err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();

    // Set up auth state change listener
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session) {
          const { user, profile } = await authService.getCurrentUser();
          setUser(user);
          setProfile(profile);
          setIsAuthenticated(true);
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          setProfile(null);
          setIsAuthenticated(false);
        }
      }
    );

    // Clean up listener
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  // Login function
  const login = async (credentials: UserCredentials): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { user: authUser, profile: userProfile, error: authError } = await authService.login(credentials);
      
      if (authError) {
        setError(authError);
        return false;
      }
      
      if (authUser) {
        setUser(authUser);
        setProfile(userProfile);
        setIsAuthenticated(true);
        return true;
      }
      
      return false;
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.message);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Register function
  const register = async (userData: UserRegistration): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { user: authUser, profile: userProfile, error: authError } = await authService.register(userData);
      
      if (authError) {
        setError(authError);
        return false;
      }
      
      if (authUser) {
        setUser(authUser);
        setProfile(userProfile);
        setIsAuthenticated(true);
        return true;
      }
      
      return false;
    } catch (err: any) {
      console.error('Registration error:', err);
      setError(err.message);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = async (): Promise<void> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const success = await authService.logout();
      
      if (success) {
        setUser(null);
        setProfile(null);
        setIsAuthenticated(false);
      } else {
        setError('Logout failed');
      }
    } catch (err: any) {
      console.error('Logout error:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Update profile function
  const updateProfile = async (profileData: Partial<UserProfile>): Promise<UserProfile | null> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const updatedProfile = await authService.updateProfile(profileData);
      
      if (updatedProfile) {
        setProfile(updatedProfile);
        return updatedProfile;
      }
      
      setError('Profile update failed');
      return null;
    } catch (err: any) {
      console.error('Profile update error:', err);
      setError(err.message);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Request password reset function
  const requestPasswordReset = async (email: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const success = await authService.requestPasswordReset(email);
      
      if (!success) {
        setError('Password reset request failed');
      }
      
      return success;
    } catch (err: any) {
      console.error('Password reset request error:', err);
      setError(err.message);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Reset password function
  const resetPassword = async (newPassword: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const success = await authService.resetPassword(newPassword);
      
      if (!success) {
        setError('Password reset failed');
      }
      
      return success;
    } catch (err: any) {
      console.error('Password reset error:', err);
      setError(err.message);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Clear error function
  const clearError = (): void => {
    setError(null);
  };

  // Context value
  const contextValue: AuthContextType = {
    user,
    profile,
    isAuthenticated,
    isLoading,
    error,
    login,
    register,
    logout,
    updateProfile,
    requestPasswordReset,
    resetPassword,
    clearError
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};

export default AuthProvider;
