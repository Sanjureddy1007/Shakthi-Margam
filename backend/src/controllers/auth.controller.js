const AppError = require('../utils/appError');
const logger = require('../utils/logger');
const supabaseAuthService = require('../services/supabase-auth.service');
const emailService = require('../services/email.service');
const { getSupabaseClient } = require('../config/supabase');

// Helper function to send token response
const sendTokenResponse = (data, statusCode, res) => {
  res.status(statusCode).json({
    status: 'success',
    token: data.session?.access_token,
    refresh_token: data.session?.refresh_token,
    data: {
      user: data.user,
      profile: data.profile
    }
  });
};

/**
 * @desc    Register a new user
 * @route   POST /api/auth/register
 * @access  Public
 */
exports.register = async (req, res, next) => {
  try {
    const { name, email, password, phoneNumber, district, city } = req.body;

    // Register user with Supabase
    const userData = await supabaseAuthService.register({
      name,
      email,
      password,
      phoneNumber,
      district,
      city
    });

    // Send token response
    sendTokenResponse(userData, 201, res);
  } catch (error) {
    // Handle specific Supabase errors
    if (error.message.includes('already registered')) {
      return next(new AppError('Email already in use', 400, 'EMAIL_IN_USE'));
    }

    next(error);
  }
};

/**
 * @desc    Login user
 * @route   POST /api/auth/login
 * @access  Public
 */
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Check if email and password are provided
    if (!email || !password) {
      return next(new AppError('Please provide email and password', 400, 'MISSING_CREDENTIALS'));
    }

    // Login user with Supabase
    const userData = await supabaseAuthService.login({
      email,
      password
    });

    // Send token response
    sendTokenResponse(userData, 200, res);
  } catch (error) {
    // Handle specific Supabase errors
    if (error.message.includes('Invalid login credentials')) {
      return next(new AppError('Invalid credentials', 401, 'INVALID_CREDENTIALS'));
    }

    next(error);
  }
};

/**
 * @desc    Get current logged in user
 * @route   GET /api/auth/me
 * @access  Private
 */
exports.getMe = async (req, res, next) => {
  try {
    // User is already available in req.user from the protect middleware
    res.status(200).json({
      status: 'success',
      data: {
        user: req.user,
        profile: req.user.profile
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update user details
 * @route   PUT /api/auth/update-details
 * @access  Private
 */
exports.updateDetails = async (req, res, next) => {
  try {
    const { name, phoneNumber, district, city } = req.body;

    // Update user profile with Supabase
    const updatedProfile = await supabaseAuthService.updateProfile(
      req.user.id,
      {
        name,
        phoneNumber,
        district,
        city
      }
    );

    res.status(200).json({
      status: 'success',
      data: {
        profile: updatedProfile
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update password
 * @route   PUT /api/auth/update-password
 * @access  Private
 */
exports.updatePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    // Update password with Supabase
    const success = await supabaseAuthService.updatePassword(
      currentPassword,
      newPassword
    );

    if (!success) {
      return next(new AppError('Failed to update password', 400, 'PASSWORD_UPDATE_FAILED'));
    }

    res.status(200).json({
      status: 'success',
      message: 'Password updated successfully'
    });
  } catch (error) {
    // Handle specific Supabase errors
    if (error.message.includes('Invalid login credentials')) {
      return next(new AppError('Current password is incorrect', 401, 'INVALID_PASSWORD'));
    }

    next(error);
  }
};

/**
 * @desc    Forgot password
 * @route   POST /api/auth/forgot-password
 * @access  Public
 */
exports.forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    // Request password reset with Supabase
    const success = await supabaseAuthService.requestPasswordReset(email);

    if (!success) {
      return next(new AppError('Failed to send password reset email', 500, 'PASSWORD_RESET_FAILED'));
    }

    res.status(200).json({
      status: 'success',
      message: 'Password reset email sent'
    });
  } catch (error) {
    // Don't reveal if email exists or not for security
    res.status(200).json({
      status: 'success',
      message: 'If a user with that email exists, a password reset link will be sent'
    });
  }
};

/**
 * @desc    Logout user
 * @route   POST /api/auth/logout
 * @access  Private
 */
exports.logout = async (req, res, next) => {
  try {
    // Logout user with Supabase
    await supabaseAuthService.logout();

    res.status(200).json({
      status: 'success',
      message: 'Logged out successfully'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Refresh token
 * @route   POST /api/auth/refresh-token
 * @access  Public
 */
exports.refreshToken = async (req, res, next) => {
  try {
    const { refresh_token } = req.body;

    if (!refresh_token) {
      return next(new AppError('Refresh token is required', 400, 'MISSING_REFRESH_TOKEN'));
    }

    const supabase = getSupabaseClient();

    // Refresh token with Supabase
    const { data, error } = await supabase.auth.refreshSession({
      refresh_token
    });

    if (error) {
      return next(new AppError('Invalid or expired refresh token', 401, 'INVALID_REFRESH_TOKEN'));
    }

    res.status(200).json({
      status: 'success',
      token: data.session.access_token,
      refresh_token: data.session.refresh_token,
      data: {
        user: data.user
      }
    });
  } catch (error) {
    next(error);
  }
};
