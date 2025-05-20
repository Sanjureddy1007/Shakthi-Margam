const { getSupabaseClient, getSupabaseAdmin } = require('../config/supabase');
const logger = require('../utils/logger');
const emailService = require('./email.service');

/**
 * Register a new user
 * @param {Object} userData - User registration data
 * @returns {Promise<Object>} - The user object
 */
exports.register = async (userData) => {
  try {
    const { name, email, password, phoneNumber, district, city } = userData;
    const supabase = getSupabaseClient();
    
    // Register user with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
          phone_number: phoneNumber,
          district,
          city
        }
      }
    });
    
    if (authError) throw new Error(authError.message);
    
    // Create profile in profiles table
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: authData.user.id,
        name,
        email,
        phone_number: phoneNumber,
        district,
        city
      })
      .select();
    
    if (profileError) {
      logger.error(`Error creating profile: ${profileError.message}`);
      // Try to delete the user if profile creation fails
      const supabaseAdmin = getSupabaseAdmin();
      await supabaseAdmin.auth.admin.deleteUser(authData.user.id);
      throw new Error(`Error creating profile: ${profileError.message}`);
    }
    
    // Send welcome email
    try {
      await emailService.sendWelcomeEmail({
        name,
        email
      });
    } catch (emailError) {
      logger.error(`Error sending welcome email: ${emailError.message}`);
      // Continue even if email fails
    }
    
    return { 
      user: authData.user, 
      profile: profileData[0],
      session: authData.session
    };
  } catch (error) {
    logger.error(`Error registering user: ${error.message}`);
    throw error;
  }
};

/**
 * Login user
 * @param {Object} credentials - User login credentials
 * @returns {Promise<Object>} - The session object
 */
exports.login = async (credentials) => {
  try {
    const { email, password } = credentials;
    const supabase = getSupabaseClient();
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) throw new Error(error.message);
    
    // Get user profile
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', data.user.id)
      .single();
    
    if (profileError) {
      logger.error(`Error getting profile: ${profileError.message}`);
    }
    
    return {
      user: data.user,
      profile: profileData || null,
      session: data.session
    };
  } catch (error) {
    logger.error(`Error logging in user: ${error.message}`);
    throw error;
  }
};

/**
 * Get current user
 * @param {string} token - JWT token
 * @returns {Promise<Object>} - The user object
 */
exports.getCurrentUser = async (token) => {
  try {
    const supabase = getSupabaseClient();
    
    // Set session from token
    const { data: { user }, error } = await supabase.auth.getUser(token);
    
    if (error) throw new Error(error.message);
    if (!user) throw new Error('User not found');
    
    // Get user profile
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();
    
    if (profileError) {
      logger.error(`Error getting profile: ${profileError.message}`);
    }
    
    return {
      user,
      profile: profileData || null
    };
  } catch (error) {
    logger.error(`Error getting current user: ${error.message}`);
    throw error;
  }
};

/**
 * Update user profile
 * @param {string} userId - User ID
 * @param {Object} profileData - Profile data to update
 * @returns {Promise<Object>} - The updated profile
 */
exports.updateProfile = async (userId, profileData) => {
  try {
    const supabase = getSupabaseClient();
    const { name, phoneNumber, district, city } = profileData;
    
    // Update user metadata
    const { error: authError } = await supabase.auth.updateUser({
      data: {
        name,
        phone_number: phoneNumber,
        district,
        city
      }
    });
    
    if (authError) throw new Error(authError.message);
    
    // Update profile in profiles table
    const { data, error } = await supabase
      .from('profiles')
      .update({
        name,
        phone_number: phoneNumber,
        district,
        city,
        updated_at: new Date()
      })
      .eq('id', userId)
      .select();
    
    if (error) throw new Error(error.message);
    
    return data[0];
  } catch (error) {
    logger.error(`Error updating profile: ${error.message}`);
    throw error;
  }
};

/**
 * Update user password
 * @param {string} currentPassword - Current password
 * @param {string} newPassword - New password
 * @returns {Promise<boolean>} - Success status
 */
exports.updatePassword = async (currentPassword, newPassword) => {
  try {
    const supabase = getSupabaseClient();
    
    // Update password
    const { error } = await supabase.auth.updateUser({
      password: newPassword
    });
    
    if (error) throw new Error(error.message);
    
    return true;
  } catch (error) {
    logger.error(`Error updating password: ${error.message}`);
    throw error;
  }
};

/**
 * Request password reset
 * @param {string} email - User email
 * @returns {Promise<boolean>} - Success status
 */
exports.requestPasswordReset = async (email) => {
  try {
    const supabase = getSupabaseClient();
    
    // Request password reset
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.FRONTEND_URL}/reset-password`
    });
    
    if (error) throw new Error(error.message);
    
    return true;
  } catch (error) {
    logger.error(`Error requesting password reset: ${error.message}`);
    throw error;
  }
};

/**
 * Logout user
 * @returns {Promise<boolean>} - Success status
 */
exports.logout = async () => {
  try {
    const supabase = getSupabaseClient();
    
    const { error } = await supabase.auth.signOut();
    
    if (error) throw new Error(error.message);
    
    return true;
  } catch (error) {
    logger.error(`Error logging out: ${error.message}`);
    throw error;
  }
};
