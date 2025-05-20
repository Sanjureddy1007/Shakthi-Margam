const { BusinessProfile } = require('../models/postgres');
const { Conversation } = require('../models/mongodb');
const AppError = require('../utils/appError');
const aiService = require('../services/ai.service');

/**
 * @desc    Create a new business profile
 * @route   POST /api/profiles
 * @access  Private
 */
exports.createBusinessProfile = async (req, res, next) => {
  try {
    const {
      name,
      description,
      industry,
      stage,
      district,
      city,
      pincode,
      teamSize,
      employmentType,
      hasCoFounders,
      fundingStatus,
      revenue,
      socialMedia,
      offerings,
      customers,
      challenges,
      goals,
      telanganaSpecific
    } = req.body;
    
    // Create business profile
    const businessProfile = await BusinessProfile.create({
      userId: req.user.id,
      name,
      description,
      industry,
      stage,
      district,
      city,
      pincode,
      teamSize,
      employmentType,
      hasCoFounders,
      fundingStatus,
      revenue,
      socialMedia,
      offerings,
      customers,
      challenges,
      goals,
      telanganaSpecific,
      completionPercentage: calculateCompletionPercentage(req.body)
    });
    
    // Create initial conversation for the business profile
    const conversation = await Conversation.create({
      userId: req.user.id,
      businessProfileId: businessProfile.id,
      activeModule: 'initial-assessment',
      title: `Initial assessment for ${businessProfile.name}`
    });
    
    // Add system message
    const systemMessage = await aiService.getSystemPrompt('initial-assessment', businessProfile.id);
    await conversation.addMessage('system', systemMessage);
    
    // Add welcome message
    const welcomeMessage = await aiService.getWelcomeMessage('initial-assessment', businessProfile);
    await conversation.addMessage('assistant', welcomeMessage);
    
    res.status(201).json({
      status: 'success',
      data: {
        businessProfile,
        conversation: {
          id: conversation._id,
          title: conversation.title
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all business profiles for a user
 * @route   GET /api/profiles
 * @access  Private
 */
exports.getBusinessProfiles = async (req, res, next) => {
  try {
    const businessProfiles = await BusinessProfile.findAll({
      where: { userId: req.user.id },
      order: [['updatedAt', 'DESC']]
    });
    
    res.status(200).json({
      status: 'success',
      results: businessProfiles.length,
      data: {
        businessProfiles
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get a single business profile
 * @route   GET /api/profiles/:id
 * @access  Private
 */
exports.getBusinessProfile = async (req, res, next) => {
  try {
    const businessProfile = await BusinessProfile.findOne({
      where: { id: req.params.id, userId: req.user.id }
    });
    
    if (!businessProfile) {
      return next(new AppError('Business profile not found', 404, 'PROFILE_NOT_FOUND'));
    }
    
    res.status(200).json({
      status: 'success',
      data: {
        businessProfile
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update a business profile
 * @route   PUT /api/profiles/:id
 * @access  Private
 */
exports.updateBusinessProfile = async (req, res, next) => {
  try {
    const businessProfile = await BusinessProfile.findOne({
      where: { id: req.params.id, userId: req.user.id }
    });
    
    if (!businessProfile) {
      return next(new AppError('Business profile not found', 404, 'PROFILE_NOT_FOUND'));
    }
    
    // Update fields
    const updatedData = {
      ...req.body,
      completionPercentage: calculateCompletionPercentage({
        ...businessProfile.toJSON(),
        ...req.body
      })
    };
    
    // Update business profile
    await businessProfile.update(updatedData);
    
    res.status(200).json({
      status: 'success',
      data: {
        businessProfile
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete a business profile
 * @route   DELETE /api/profiles/:id
 * @access  Private
 */
exports.deleteBusinessProfile = async (req, res, next) => {
  try {
    const businessProfile = await BusinessProfile.findOne({
      where: { id: req.params.id, userId: req.user.id }
    });
    
    if (!businessProfile) {
      return next(new AppError('Business profile not found', 404, 'PROFILE_NOT_FOUND'));
    }
    
    // Delete business profile
    await businessProfile.destroy();
    
    // Mark associated conversations as deleted
    await Conversation.updateMany(
      { businessProfileId: req.params.id },
      { status: 'deleted' }
    );
    
    res.status(200).json({
      status: 'success',
      data: null
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Submit business assessment
 * @route   POST /api/profiles/:id/assessment
 * @access  Private
 */
exports.submitAssessment = async (req, res, next) => {
  try {
    const businessProfile = await BusinessProfile.findOne({
      where: { id: req.params.id, userId: req.user.id }
    });
    
    if (!businessProfile) {
      return next(new AppError('Business profile not found', 404, 'PROFILE_NOT_FOUND'));
    }
    
    // Update business profile with assessment data
    const updatedData = {
      ...req.body,
      completionPercentage: 100 // Assessment is complete
    };
    
    await businessProfile.update(updatedData);
    
    // Generate AI analysis of the assessment
    const analysis = await aiService.analyzeBusinessAssessment(businessProfile.id);
    
    res.status(200).json({
      status: 'success',
      data: {
        businessProfile,
        analysis
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get business assessment
 * @route   GET /api/profiles/:id/assessment
 * @access  Private
 */
exports.getAssessment = async (req, res, next) => {
  try {
    const businessProfile = await BusinessProfile.findOne({
      where: { id: req.params.id, userId: req.user.id }
    });
    
    if (!businessProfile) {
      return next(new AppError('Business profile not found', 404, 'PROFILE_NOT_FOUND'));
    }
    
    // Get assessment data
    const assessmentData = {
      industry: businessProfile.industry,
      stage: businessProfile.stage,
      location: {
        district: businessProfile.district,
        city: businessProfile.city,
        pincode: businessProfile.pincode
      },
      teamSize: businessProfile.teamSize,
      employmentType: businessProfile.employmentType,
      hasCoFounders: businessProfile.hasCoFounders,
      fundingStatus: businessProfile.fundingStatus,
      revenue: businessProfile.revenue,
      socialMedia: businessProfile.socialMedia,
      offerings: businessProfile.offerings,
      customers: businessProfile.customers,
      challenges: businessProfile.challenges,
      goals: businessProfile.goals,
      telanganaSpecific: businessProfile.telanganaSpecific,
      completionPercentage: businessProfile.completionPercentage
    };
    
    res.status(200).json({
      status: 'success',
      data: {
        assessment: assessmentData
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update business assessment
 * @route   PUT /api/profiles/:id/assessment
 * @access  Private
 */
exports.updateAssessment = async (req, res, next) => {
  try {
    const businessProfile = await BusinessProfile.findOne({
      where: { id: req.params.id, userId: req.user.id }
    });
    
    if (!businessProfile) {
      return next(new AppError('Business profile not found', 404, 'PROFILE_NOT_FOUND'));
    }
    
    // Update assessment data
    const updatedData = {
      ...req.body,
      completionPercentage: calculateCompletionPercentage({
        ...businessProfile.toJSON(),
        ...req.body
      })
    };
    
    await businessProfile.update(updatedData);
    
    res.status(200).json({
      status: 'success',
      data: {
        businessProfile
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get business analytics
 * @route   GET /api/profiles/:id/analytics
 * @access  Private
 */
exports.getBusinessAnalytics = async (req, res, next) => {
  try {
    const businessProfile = await BusinessProfile.findOne({
      where: { id: req.params.id, userId: req.user.id }
    });
    
    if (!businessProfile) {
      return next(new AppError('Business profile not found', 404, 'PROFILE_NOT_FOUND'));
    }
    
    // Generate analytics
    const analytics = await aiService.generateBusinessAnalytics(businessProfile.id);
    
    res.status(200).json({
      status: 'success',
      data: {
        analytics
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get business recommendations
 * @route   GET /api/profiles/:id/recommendations
 * @access  Private
 */
exports.getRecommendations = async (req, res, next) => {
  try {
    const businessProfile = await BusinessProfile.findOne({
      where: { id: req.params.id, userId: req.user.id }
    });
    
    if (!businessProfile) {
      return next(new AppError('Business profile not found', 404, 'PROFILE_NOT_FOUND'));
    }
    
    // Generate recommendations
    const recommendations = await aiService.generateBusinessRecommendations(businessProfile.id);
    
    res.status(200).json({
      status: 'success',
      data: {
        recommendations
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Helper function to calculate completion percentage
 */
const calculateCompletionPercentage = (profile) => {
  const requiredFields = [
    'name',
    'industry',
    'stage',
    'district',
    'city',
    'teamSize',
    'fundingStatus'
  ];
  
  const optionalFields = [
    'description',
    'pincode',
    'employmentType',
    'hasCoFounders',
    'revenue',
    'socialMedia',
    'offerings',
    'customers',
    'challenges',
    'goals',
    'telanganaSpecific'
  ];
  
  // Calculate required fields completion
  const requiredFieldsCompleted = requiredFields.filter(field => 
    profile[field] !== undefined && profile[field] !== null && profile[field] !== ''
  ).length;
  
  // Calculate optional fields completion
  const optionalFieldsCompleted = optionalFields.filter(field => 
    profile[field] !== undefined && profile[field] !== null && profile[field] !== ''
  ).length;
  
  // Calculate percentage
  const requiredPercentage = (requiredFieldsCompleted / requiredFields.length) * 70;
  const optionalPercentage = (optionalFieldsCompleted / optionalFields.length) * 30;
  
  return Math.round(requiredPercentage + optionalPercentage);
};
