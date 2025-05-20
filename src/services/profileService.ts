import { profiles } from './supabase';

export interface UserProfile {
  id: string;
  full_name: string;
  email: string;
  phone_number?: string;
  district?: string;
  city?: string;
  business_type?: string;
  business_stage?: string;
  avatar_url?: string;
  created_at?: string;
  updated_at?: string;
}

export const profileService = {
  /**
   * Get the current user's profile
   */
  getCurrentProfile: async (userId: string): Promise<UserProfile | null> => {
    try {
      const { data, error } = await profiles.getProfileById(userId);
      
      if (error) {
        console.error('Error fetching profile:', error);
        return null;
      }
      
      return data as UserProfile;
    } catch (error) {
      console.error('Error in getCurrentProfile:', error);
      return null;
    }
  },
  
  /**
   * Update the current user's profile
   */
  updateProfile: async (userId: string, profileData: Partial<UserProfile>): Promise<boolean> => {
    try {
      const { error } = await profiles.updateProfile(userId, {
        ...profileData,
        updated_at: new Date().toISOString()
      });
      
      if (error) {
        console.error('Error updating profile:', error);
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Error in updateProfile:', error);
      return false;
    }
  },
  
  /**
   * Create a new user profile
   */
  createProfile: async (profileData: UserProfile): Promise<boolean> => {
    try {
      const { error } = await profiles.createProfile({
        ...profileData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });
      
      if (error) {
        console.error('Error creating profile:', error);
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Error in createProfile:', error);
      return false;
    }
  }
};

export default profileService;
