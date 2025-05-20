const { getSupabaseClient } = require('../config/supabase');
const logger = require('../utils/logger');

/**
 * Create a business profile
 * @param {Object} profileData - Business profile data
 * @param {string} userId - User ID
 * @returns {Promise<Object>} - The business profile
 */
exports.createBusinessProfile = async (profileData, userId) => {
  try {
    const supabase = getSupabaseClient();
    
    // Create business profile
    const { data, error } = await supabase
      .from('business_profiles')
      .insert({
        ...profileData,
        user_id: userId
      })
      .select();
    
    if (error) throw new Error(error.message);
    
    return data[0];
  } catch (error) {
    logger.error(`Error creating business profile: ${error.message}`);
    throw error;
  }
};

/**
 * Get business profiles for a user
 * @param {string} userId - User ID
 * @returns {Promise<Array>} - The business profiles
 */
exports.getBusinessProfiles = async (userId) => {
  try {
    const supabase = getSupabaseClient();
    
    // Get business profiles
    const { data, error } = await supabase
      .from('business_profiles')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) throw new Error(error.message);
    
    return data;
  } catch (error) {
    logger.error(`Error getting business profiles: ${error.message}`);
    throw error;
  }
};

/**
 * Get a business profile by ID
 * @param {string} profileId - Business profile ID
 * @param {string} userId - User ID
 * @returns {Promise<Object>} - The business profile
 */
exports.getBusinessProfile = async (profileId, userId) => {
  try {
    const supabase = getSupabaseClient();
    
    // Get business profile
    const { data, error } = await supabase
      .from('business_profiles')
      .select('*')
      .eq('id', profileId)
      .eq('user_id', userId)
      .single();
    
    if (error) throw new Error(error.message);
    
    return data;
  } catch (error) {
    logger.error(`Error getting business profile: ${error.message}`);
    throw error;
  }
};

/**
 * Update a business profile
 * @param {string} profileId - Business profile ID
 * @param {Object} profileData - Business profile data
 * @param {string} userId - User ID
 * @returns {Promise<Object>} - The updated business profile
 */
exports.updateBusinessProfile = async (profileId, profileData, userId) => {
  try {
    const supabase = getSupabaseClient();
    
    // Update business profile
    const { data, error } = await supabase
      .from('business_profiles')
      .update(profileData)
      .eq('id', profileId)
      .eq('user_id', userId)
      .select();
    
    if (error) throw new Error(error.message);
    
    return data[0];
  } catch (error) {
    logger.error(`Error updating business profile: ${error.message}`);
    throw error;
  }
};

/**
 * Delete a business profile
 * @param {string} profileId - Business profile ID
 * @param {string} userId - User ID
 * @returns {Promise<boolean>} - Success status
 */
exports.deleteBusinessProfile = async (profileId, userId) => {
  try {
    const supabase = getSupabaseClient();
    
    // Delete business profile
    const { error } = await supabase
      .from('business_profiles')
      .delete()
      .eq('id', profileId)
      .eq('user_id', userId);
    
    if (error) throw new Error(error.message);
    
    return true;
  } catch (error) {
    logger.error(`Error deleting business profile: ${error.message}`);
    throw error;
  }
};

/**
 * Submit business assessment
 * @param {string} profileId - Business profile ID
 * @param {Object} assessmentData - Assessment data
 * @param {string} userId - User ID
 * @returns {Promise<Object>} - The updated business profile
 */
exports.submitBusinessAssessment = async (profileId, assessmentData, userId) => {
  try {
    const supabase = getSupabaseClient();
    
    // Get current profile
    const { data: currentProfile, error: profileError } = await supabase
      .from('business_profiles')
      .select('*')
      .eq('id', profileId)
      .eq('user_id', userId)
      .single();
    
    if (profileError) throw new Error(profileError.message);
    
    // Calculate completion percentage
    const totalFields = Object.keys(assessmentData).length;
    const filledFields = Object.values(assessmentData).filter(value => 
      value !== null && value !== undefined && value !== '' && 
      (Array.isArray(value) ? value.length > 0 : true) &&
      (typeof value === 'object' ? Object.keys(value).length > 0 : true)
    ).length;
    
    const completionPercentage = Math.round((filledFields / totalFields) * 100);
    
    // Update business profile with assessment data
    const { data, error } = await supabase
      .from('business_profiles')
      .update({
        ...assessmentData,
        completion_percentage: completionPercentage
      })
      .eq('id', profileId)
      .eq('user_id', userId)
      .select();
    
    if (error) throw new Error(error.message);
    
    return data[0];
  } catch (error) {
    logger.error(`Error submitting business assessment: ${error.message}`);
    throw error;
  }
};

/**
 * Get business assessment
 * @param {string} profileId - Business profile ID
 * @param {string} userId - User ID
 * @returns {Promise<Object>} - The business assessment
 */
exports.getBusinessAssessment = async (profileId, userId) => {
  try {
    // Reuse getBusinessProfile method
    return this.getBusinessProfile(profileId, userId);
  } catch (error) {
    logger.error(`Error getting business assessment: ${error.message}`);
    throw error;
  }
};
