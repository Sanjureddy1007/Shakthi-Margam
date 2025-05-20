const { getSupabaseClient } = require('../config/supabase');
const AppError = require('../utils/appError');
const logger = require('../utils/logger');

/**
 * Middleware to protect routes that require authentication
 */
exports.protect = async (req, res, next) => {
  try {
    let token;

    // Get token from Authorization header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    // Check if token exists
    if (!token) {
      return next(new AppError('Not authorized to access this route', 401, 'UNAUTHORIZED'));
    }

    // Verify token with Supabase
    const supabase = getSupabaseClient();
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      logger.error(`Auth error: ${error?.message || 'User not found'}`);
      return next(new AppError('Invalid or expired token. Please log in again', 401, 'UNAUTHORIZED'));
    }

    // Get user profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (profileError) {
      logger.error(`Error getting profile: ${profileError.message}`);
      // Continue even if profile fetch fails
    }

    // Grant access to protected route
    req.user = user;
    req.user.profile = profile;
    req.token = token;
    next();
  } catch (error) {
    logger.error(`Auth middleware error: ${error.message}`);
    return next(new AppError('Authentication failed. Please log in again', 401, 'UNAUTHORIZED'));
  }
};

/**
 * Middleware to restrict access to certain roles
 */
exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    // Get role from user metadata
    const userRole = req.user.app_metadata?.role || 'user';

    if (!roles.includes(userRole)) {
      return next(new AppError('You do not have permission to perform this action', 403, 'FORBIDDEN'));
    }
    next();
  };
};

/**
 * Middleware to check if user owns a resource
 * @param {Function} getResourceOwner - Function to get resource owner ID
 * @param {string} paramName - Parameter name for resource ID
 */
exports.checkOwnership = (getResourceOwner, paramName = 'id') => {
  return async (req, res, next) => {
    try {
      const resourceId = req.params[paramName];

      if (!resourceId) {
        return next(new AppError(`Resource ID parameter '${paramName}' is required`, 400, 'BAD_REQUEST'));
      }

      const ownerId = await getResourceOwner(resourceId);

      if (ownerId !== req.user.id) {
        return next(new AppError('You do not have permission to access this resource', 403, 'FORBIDDEN'));
      }

      next();
    } catch (error) {
      logger.error(`Ownership check error: ${error.message}`);
      next(error);
    }
  };
};
