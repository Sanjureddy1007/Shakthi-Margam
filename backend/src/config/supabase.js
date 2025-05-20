const { createClient } = require('@supabase/supabase-js');
const logger = require('../utils/logger');

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  logger.error('Supabase URL or Anon Key not found in environment variables');
}

// Create Supabase client with anonymous key (for client-side operations)
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Create Supabase admin client with service key (for server-side operations)
const supabaseAdmin = supabaseServiceKey 
  ? createClient(supabaseUrl, supabaseServiceKey)
  : null;

if (!supabaseAdmin) {
  logger.warn('Supabase Service Key not found. Admin operations will not be available.');
}

/**
 * Get Supabase client
 * @returns {Object} - Supabase client
 */
const getSupabaseClient = () => {
  return supabase;
};

/**
 * Get Supabase admin client
 * @returns {Object} - Supabase admin client
 */
const getSupabaseAdmin = () => {
  if (!supabaseAdmin) {
    logger.error('Supabase admin client not available. Check SUPABASE_SERVICE_KEY.');
    throw new Error('Supabase admin client not available');
  }
  return supabaseAdmin;
};

module.exports = {
  getSupabaseClient,
  getSupabaseAdmin
};
