import { createClient } from '@supabase/supabase-js';

// Get Supabase URL and anon key from environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

// Check if environment variables are set and use mock if needed
let supabase;

if (!supabaseUrl || !supabaseAnonKey || supabaseUrl.includes('your_supabase_url_here')) {
  console.warn('Using mock Supabase client for development');

  // Create a mock Supabase client for development
  supabase = {
    auth: {
      getUser: async () => ({ data: { user: null }, error: null }),
      getSession: async () => ({ data: { session: null }, error: null }),
      signInWithPassword: async () => ({ data: { user: { id: 'mock-user-id', email: 'mock@example.com' } }, error: null }),
      signUp: async () => ({ data: { user: { id: 'mock-user-id', email: 'mock@example.com' } }, error: null }),
      signOut: async () => ({ error: null }),
      resetPasswordForEmail: async () => ({ error: null }),
      updateUser: async () => ({ data: { user: { id: 'mock-user-id', email: 'mock@example.com' } }, error: null }),
      onAuthStateChange: () => ({
        data: {
          subscription: {
            unsubscribe: () => {}
          }
        }
      })
    },
    from: (table: string) => ({
      select: () => ({
        eq: () => ({
          single: async () => ({ data: { id: 'mock-profile-id', user_id: 'mock-user-id', full_name: 'Mock User' }, error: null })
        })
      }),
      insert: async () => ({ data: { id: 'mock-profile-id' }, error: null }),
      update: async () => ({ data: { id: 'mock-profile-id' }, error: null })
    })
  };
} else {
  // Create actual Supabase client
  supabase = createClient(supabaseUrl, supabaseAnonKey);
}

export default supabase;
