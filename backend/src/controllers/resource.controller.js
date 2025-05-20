const { VectorEntry } = require('../models/mongodb');
const { User } = require('../models/postgres');
const AppError = require('../utils/appError');
const vectorService = require('../services/vector.service');
const wehubService = require('../services/wehub.service');

/**
 * @desc    Get public resources
 * @route   GET /api/resources/public
 * @access  Public
 */
exports.getPublicResources = async (req, res, next) => {
  try {
    const { limit = 10, page = 1 } = req.query;
    
    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    // Get resources
    const resources = await VectorEntry.find({
      source: { $in: ['telangana-market-data', 'government-schemes', 'business-templates'] }
    })
      .sort({ relevanceScore: -1, createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .select('-embedding');
    
    // Get total count
    const total = await VectorEntry.countDocuments({
      source: { $in: ['telangana-market-data', 'government-schemes', 'business-templates'] }
    });
    
    res.status(200).json({
      status: 'success',
      results: resources.length,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / parseInt(limit))
      },
      data: {
        resources
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get public resources by category
 * @route   GET /api/resources/public/:category
 * @access  Public
 */
exports.getPublicResourcesByCategory = async (req, res, next) => {
  try {
    const { category } = req.params;
    const { limit = 10, page = 1 } = req.query;
    
    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    // Get resources
    const resources = await VectorEntry.find({
      source: { $in: ['telangana-market-data', 'government-schemes', 'business-templates'] },
      category
    })
      .sort({ relevanceScore: -1, createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .select('-embedding');
    
    // Get total count
    const total = await VectorEntry.countDocuments({
      source: { $in: ['telangana-market-data', 'government-schemes', 'business-templates'] },
      category
    });
    
    res.status(200).json({
      status: 'success',
      results: resources.length,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / parseInt(limit))
      },
      data: {
        resources
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Search public resources
 * @route   GET /api/resources/public/search
 * @access  Public
 */
exports.searchPublicResources = async (req, res, next) => {
  try {
    const { query, limit = 10, page = 1 } = req.query;
    
    if (!query) {
      return next(new AppError('Search query is required', 400, 'MISSING_QUERY'));
    }
    
    // Search resources
    const searchResults = await vectorService.searchResources({
      query,
      limit: parseInt(limit),
      page: parseInt(page),
      sources: ['telangana-market-data', 'government-schemes', 'business-templates']
    });
    
    res.status(200).json({
      status: 'success',
      results: searchResults.resources.length,
      pagination: searchResults.pagination,
      data: {
        resources: searchResults.resources
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get WE-HUB resources
 * @route   GET /api/resources/wehub
 * @access  Public
 */
exports.getWEHubResources = async (req, res, next) => {
  try {
    const { limit = 10, page = 1 } = req.query;
    
    // Get WE-HUB resources
    const wehubResources = await wehubService.getResources({
      limit: parseInt(limit),
      page: parseInt(page)
    });
    
    res.status(200).json({
      status: 'success',
      results: wehubResources.resources.length,
      pagination: wehubResources.pagination,
      data: {
        resources: wehubResources.resources
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get WE-HUB resources by category
 * @route   GET /api/resources/wehub/:category
 * @access  Public
 */
exports.getWEHubResourcesByCategory = async (req, res, next) => {
  try {
    const { category } = req.params;
    const { limit = 10, page = 1 } = req.query;
    
    // Get WE-HUB resources by category
    const wehubResources = await wehubService.getResourcesByCategory({
      category,
      limit: parseInt(limit),
      page: parseInt(page)
    });
    
    res.status(200).json({
      status: 'success',
      results: wehubResources.resources.length,
      pagination: wehubResources.pagination,
      data: {
        resources: wehubResources.resources
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get government schemes
 * @route   GET /api/resources/government-schemes
 * @access  Public
 */
exports.getGovernmentSchemes = async (req, res, next) => {
  try {
    const { limit = 10, page = 1 } = req.query;
    
    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    // Get government schemes
    const schemes = await VectorEntry.find({
      source: 'government-schemes'
    })
      .sort({ relevanceScore: -1, createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .select('-embedding');
    
    // Get total count
    const total = await VectorEntry.countDocuments({
      source: 'government-schemes'
    });
    
    res.status(200).json({
      status: 'success',
      results: schemes.length,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / parseInt(limit))
      },
      data: {
        schemes
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get government scheme details
 * @route   GET /api/resources/government-schemes/:id
 * @access  Public
 */
exports.getGovernmentSchemeDetails = async (req, res, next) => {
  try {
    const scheme = await VectorEntry.findOne({
      _id: req.params.id,
      source: 'government-schemes'
    }).select('-embedding');
    
    if (!scheme) {
      return next(new AppError('Government scheme not found', 404, 'SCHEME_NOT_FOUND'));
    }
    
    res.status(200).json({
      status: 'success',
      data: {
        scheme
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get user resources
 * @route   GET /api/resources
 * @access  Private
 */
exports.getUserResources = async (req, res, next) => {
  try {
    const { limit = 10, page = 1 } = req.query;
    
    // Get user
    const user = await User.findByPk(req.user.id);
    
    // Get resources based on user profile
    const resources = await vectorService.getPersonalizedResources({
      user,
      limit: parseInt(limit),
      page: parseInt(page)
    });
    
    res.status(200).json({
      status: 'success',
      results: resources.resources.length,
      pagination: resources.pagination,
      data: {
        resources: resources.resources
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get recommended resources
 * @route   GET /api/resources/recommended
 * @access  Private
 */
exports.getRecommendedResources = async (req, res, next) => {
  try {
    const { limit = 10, page = 1 } = req.query;
    
    // Get user
    const user = await User.findByPk(req.user.id, {
      include: ['businessProfiles']
    });
    
    // Get recommended resources
    const recommendations = await vectorService.getRecommendedResources({
      user,
      limit: parseInt(limit),
      page: parseInt(page)
    });
    
    res.status(200).json({
      status: 'success',
      results: recommendations.resources.length,
      pagination: recommendations.pagination,
      data: {
        resources: recommendations.resources
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Save a resource
 * @route   POST /api/resources/save/:id
 * @access  Private
 */
exports.saveResource = async (req, res, next) => {
  try {
    const resourceId = req.params.id;
    
    // Check if resource exists
    const resource = await VectorEntry.findById(resourceId);
    
    if (!resource) {
      return next(new AppError('Resource not found', 404, 'RESOURCE_NOT_FOUND'));
    }
    
    // Get user
    const user = await User.findByPk(req.user.id);
    
    // Save resource to user's saved resources
    await user.addSavedResource(resourceId);
    
    res.status(200).json({
      status: 'success',
      message: 'Resource saved successfully'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Unsave a resource
 * @route   DELETE /api/resources/save/:id
 * @access  Private
 */
exports.unsaveResource = async (req, res, next) => {
  try {
    const resourceId = req.params.id;
    
    // Get user
    const user = await User.findByPk(req.user.id);
    
    // Remove resource from user's saved resources
    await user.removeSavedResource(resourceId);
    
    res.status(200).json({
      status: 'success',
      message: 'Resource removed from saved resources'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get saved resources
 * @route   GET /api/resources/saved
 * @access  Private
 */
exports.getSavedResources = async (req, res, next) => {
  try {
    const { limit = 10, page = 1 } = req.query;
    
    // Get user
    const user = await User.findByPk(req.user.id);
    
    // Get saved resources
    const savedResources = await user.getSavedResources({
      limit: parseInt(limit),
      offset: (parseInt(page) - 1) * parseInt(limit)
    });
    
    // Get total count
    const total = await user.countSavedResources();
    
    res.status(200).json({
      status: 'success',
      results: savedResources.length,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / parseInt(limit))
      },
      data: {
        resources: savedResources
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get business templates
 * @route   GET /api/resources/templates
 * @access  Private
 */
exports.getBusinessTemplates = async (req, res, next) => {
  try {
    const { limit = 10, page = 1 } = req.query;
    
    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    // Get business templates
    const templates = await VectorEntry.find({
      source: 'business-templates'
    })
      .sort({ relevanceScore: -1, createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .select('-embedding');
    
    // Get total count
    const total = await VectorEntry.countDocuments({
      source: 'business-templates'
    });
    
    res.status(200).json({
      status: 'success',
      results: templates.length,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / parseInt(limit))
      },
      data: {
        templates
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get business template details
 * @route   GET /api/resources/templates/:id
 * @access  Private
 */
exports.getBusinessTemplateDetails = async (req, res, next) => {
  try {
    const template = await VectorEntry.findOne({
      _id: req.params.id,
      source: 'business-templates'
    }).select('-embedding');
    
    if (!template) {
      return next(new AppError('Business template not found', 404, 'TEMPLATE_NOT_FOUND'));
    }
    
    res.status(200).json({
      status: 'success',
      data: {
        template
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get market insights
 * @route   GET /api/resources/market-insights
 * @access  Private
 */
exports.getMarketInsights = async (req, res, next) => {
  try {
    const { limit = 10, page = 1 } = req.query;
    
    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    // Get market insights
    const insights = await VectorEntry.find({
      source: 'telangana-market-data'
    })
      .sort({ relevanceScore: -1, createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .select('-embedding');
    
    // Get total count
    const total = await VectorEntry.countDocuments({
      source: 'telangana-market-data'
    });
    
    res.status(200).json({
      status: 'success',
      results: insights.length,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / parseInt(limit))
      },
      data: {
        insights
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get market insights by category
 * @route   GET /api/resources/market-insights/:category
 * @access  Private
 */
exports.getMarketInsightsByCategory = async (req, res, next) => {
  try {
    const { category } = req.params;
    const { limit = 10, page = 1 } = req.query;
    
    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    // Get market insights by category
    const insights = await VectorEntry.find({
      source: 'telangana-market-data',
      category
    })
      .sort({ relevanceScore: -1, createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .select('-embedding');
    
    // Get total count
    const total = await VectorEntry.countDocuments({
      source: 'telangana-market-data',
      category
    });
    
    res.status(200).json({
      status: 'success',
      results: insights.length,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / parseInt(limit))
      },
      data: {
        insights
      }
    });
  } catch (error) {
    next(error);
  }
};
