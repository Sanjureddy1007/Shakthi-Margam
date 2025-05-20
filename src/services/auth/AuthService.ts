import supabase from '../supabase/supabaseClient';

// User types
export interface UserCredentials {
  email: string;
  password: string;
}

export interface UserRegistration extends UserCredentials {
  name: string;
  phoneNumber?: string;
  district?: string;
  city?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone_number?: string;
  district?: string;
  city?: string;
  created_at?: string;
  updated_at?: string;
}

export interface AuthResponse {
  user: any;
  profile: UserProfile | null;
  session: any;
  error?: string;
}

/**
 * Authentication service for Shakti Margam
 * Handles user authentication using Supabase
 */
class AuthService {
  private static instance: AuthService;

  private constructor() {}

  /**
   * Get singleton instance
   */
  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  /**
   * Register a new user
   */
  public async register(userData: UserRegistration): Promise<AuthResponse> {
    try {
      // Register user with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
        options: {
          data: {
            name: userData.name,
            phone_number: userData.phoneNumber,
            district: userData.district,
            city: userData.city
          }
        }
      });

      if (authError) throw new Error(authError.message);
      if (!authData.user) throw new Error('User registration failed');

      // Create profile in profiles table
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: authData.user.id,
          name: userData.name,
          email: userData.email,
          phone_number: userData.phoneNumber,
          district: userData.district,
          city: userData.city
        })
        .select()
        .single();

      if (profileError) {
        console.error('Error creating profile:', profileError);
      }

      return {
        user: authData.user,
        profile: profileData || null,
        session: authData.session
      };
    } catch (error: any) {
      console.error('Registration error:', error);
      return {
        user: null,
        profile: null,
        session: null,
        error: error.message
      };
    }
  }

  /**
   * Login user
   */
  public async login(credentials: UserCredentials): Promise<AuthResponse> {
    try {
      // Check if we're in development mode with placeholder env vars
      const isDevelopment = import.meta.env.DEV &&
        (import.meta.env.VITE_SUPABASE_URL?.includes('your_supabase_url_here') ||
         !import.meta.env.VITE_SUPABASE_URL);

      if (isDevelopment) {
        console.log('Using mock login in development mode');
        // Return mock user data for development
        return {
          user: {
            id: 'mock-user-id',
            email: credentials.email,
            user_metadata: {
              name: 'Mock User',
              phone_number: '1234567890',
              district: 'Hyderabad',
              city: 'Hyderabad'
            }
          },
          profile: {
            id: 'mock-profile-id',
            name: 'Mock User',
            email: credentials.email,
            phone_number: '1234567890',
            district: 'Hyderabad',
            city: 'Hyderabad',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          },
          session: { access_token: 'mock-token', refresh_token: 'mock-refresh-token' }
        };
      }

      // Login with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password
      });

      if (authError) throw new Error(authError.message);
      if (!authData.user) throw new Error('Login failed');

      // Get user profile
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authData.user.id)
        .single();

      if (profileError) {
        console.error('Error getting profile:', profileError);
      }

      return {
        user: authData.user,
        profile: profileData || null,
        session: authData.session
      };
    } catch (error: any) {
      console.error('Login error:', error);
      return {
        user: null,
        profile: null,
        session: null,
        error: error.message
      };
    }
  }

  /**
   * Logout user
   */
  public async logout(): Promise<boolean> {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw new Error(error.message);
      return true;
    } catch (error: any) {
      console.error('Logout error:', error);
      return false;
    }
  }

  /**
   * Get current user
   */
  public async getCurrentUser(): Promise<AuthResponse> {
    try {
      // Check if we're in development mode with placeholder env vars
      const isDevelopment = import.meta.env.DEV &&
        (import.meta.env.VITE_SUPABASE_URL?.includes('your_supabase_url_here') ||
         !import.meta.env.VITE_SUPABASE_URL);

      if (isDevelopment) {
        console.log('Using mock user data in development mode');
        // Return mock user data for development
        return {
          user: {
            id: 'mock-user-id',
            email: 'mock@example.com',
            user_metadata: {
              name: 'Mock User',
              phone_number: '1234567890',
              district: 'Hyderabad',
              city: 'Hyderabad'
            }
          },
          profile: {
            id: 'mock-profile-id',
            name: 'Mock User',
            email: 'mock@example.com',
            phone_number: '1234567890',
            district: 'Hyderabad',
            city: 'Hyderabad',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          },
          session: { access_token: 'mock-token', refresh_token: 'mock-refresh-token' }
        };
      }

      const { data: { user }, error } = await supabase.auth.getUser();

      if (error) throw new Error(error.message);
      if (!user) return { user: null, profile: null, session: null };

      // Get user profile
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profileError) {
        console.error('Error getting profile:', profileError);
      }

      // Get session
      const { data: { session } } = await supabase.auth.getSession();

      return {
        user,
        profile: profileData || null,
        session
      };
    } catch (error: any) {
      console.error('Get current user error:', error);
      return {
        user: null,
        profile: null,
        session: null,
        error: error.message
      };
    }
  }

  /**
   * Update user profile
   */
  public async updateProfile(profileData: Partial<UserProfile>): Promise<UserProfile | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Update user metadata
      await supabase.auth.updateUser({
        data: {
          name: profileData.name,
          phone_number: profileData.phone_number,
          district: profileData.district,
          city: profileData.city
        }
      });

      // Update profile in profiles table
      const { data, error } = await supabase
        .from('profiles')
        .update({
          name: profileData.name,
          phone_number: profileData.phone_number,
          district: profileData.district,
          city: profileData.city
        })
        .eq('id', user.id)
        .select()
        .single();

      if (error) throw new Error(error.message);
      return data;
    } catch (error: any) {
      console.error('Update profile error:', error);
      return null;
    }
  }

  /**
   * Request password reset
   */
  public async requestPasswordReset(email: string): Promise<boolean> {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`
      });

      if (error) throw new Error(error.message);
      return true;
    } catch (error: any) {
      console.error('Password reset request error:', error);
      return false;
    }
  }

  /**
   * Reset password
   */
  public async resetPassword(newPassword: string): Promise<boolean> {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) throw new Error(error.message);
      return true;
    } catch (error: any) {
      console.error('Password reset error:', error);
      return false;
    }
  }

  /**
   * Refresh session
   */
  public async refreshSession(refreshToken: string): Promise<AuthResponse> {
    try {
      const { data, error } = await supabase.auth.refreshSession({
        refresh_token: refreshToken
      });

      if (error) throw new Error(error.message);

      return {
        user: data.user,
        profile: null, // Profile would need to be fetched separately
        session: data.session
      };
    } catch (error: any) {
      console.error('Session refresh error:', error);
      return {
        user: null,
        profile: null,
        session: null,
        error: error.message
      };
    }
  }
}

export default AuthService;
