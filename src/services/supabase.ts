import { createClient } from '@supabase/supabase-js';

// Initialize the Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://fdldipifcicvvkceodwp.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZkbGRpcGlmY2ljdnZrY2VvZHdwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc3MDkyMjIsImV4cCI6MjA2MzI4NTIyMn0.ljVMpLDE2I1ffZZTT8N1jsKMfTzEywCqPBZUgfRDcl0';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Authentication functions
export const auth = {
  // Sign up a new user
  signUp: async (email: string, password: string, userData: any = {}) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: userData,
      },
    });
    return { data, error };
  },

  // Sign in an existing user
  signIn: async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { data, error };
  },

  // Sign out the current user
  signOut: async () => {
    const { error } = await supabase.auth.signOut();
    return { error };
  },

  // Reset password
  resetPassword: async (email: string) => {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    return { data, error };
  },

  // Update password
  updatePassword: async (newPassword: string) => {
    const { data, error } = await supabase.auth.updateUser({
      password: newPassword,
    });
    return { data, error };
  },

  // Get the current user
  getCurrentUser: async () => {
    const { data, error } = await supabase.auth.getUser();
    return { data, error };
  },

  // Get the current session
  getSession: async () => {
    const { data, error } = await supabase.auth.getSession();
    return { data, error };
  },
};

// User profile functions
export const profiles = {
  // Get a user profile by ID
  getProfileById: async (userId: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    return { data, error };
  },

  // Update a user profile
  updateProfile: async (userId: string, profileData: any) => {
    const { data, error } = await supabase
      .from('profiles')
      .update(profileData)
      .eq('id', userId);
    return { data, error };
  },

  // Create a new profile
  createProfile: async (profileData: any) => {
    const { data, error } = await supabase
      .from('profiles')
      .insert([profileData]);
    return { data, error };
  },
};

// AI assistant related functions
export const aiAssistant = {
  // Save a chat message
  saveMessage: async (userId: string, message: string, isUser: boolean, moduleId: string) => {
    const { data, error } = await supabase
      .from('chat_messages')
      .insert([
        {
          user_id: userId,
          content: message,
          is_user_message: isUser,
          module_id: moduleId,
          created_at: new Date().toISOString(),
        },
      ]);
    return { data, error };
  },

  // Get chat history for a user and module
  getChatHistory: async (userId: string, moduleId: string) => {
    const { data, error } = await supabase
      .from('chat_messages')
      .select('*')
      .eq('user_id', userId)
      .eq('module_id', moduleId)
      .order('created_at', { ascending: true });
    return { data, error };
  },

  // Save user preferences
  saveUserPreferences: async (userId: string, preferences: any) => {
    const { data, error } = await supabase
      .from('user_preferences')
      .upsert([
        {
          user_id: userId,
          ...preferences,
        },
      ]);
    return { data, error };
  },

  // Get user preferences
  getUserPreferences: async (userId: string) => {
    const { data, error } = await supabase
      .from('user_preferences')
      .select('*')
      .eq('user_id', userId)
      .single();
    return { data, error };
  },
};

export default supabase;
