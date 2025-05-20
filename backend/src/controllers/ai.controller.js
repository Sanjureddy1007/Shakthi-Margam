const { Conversation } = require('../models/mongodb');
const { BusinessProfile } = require('../models/postgres');
const AppError = require('../utils/appError');
const logger = require('../utils/logger');
const aiService = require('../services/ai.service');
const vectorService = require('../services/vector.service');
const { saveSubscriber } = require('../services/newsletter.service');
const { saveContactForm } = require('../services/contact.service');

/**
 * @desc    Process a message from the user (public demo endpoint)
 * @route   POST /api/ai/message
 * @access  Public
 */
exports.processMessage = async (req, res, next) => {
  try {
    const { message, activeModule = 'initial-assessment', conversationId } = req.body;
    
    // Get user ID if authenticated
    const userId = req.user ? req.user.id : 'demo-user';
    
    // Process the message
    const response = await aiService.processMessage({
      message,
      activeModule,
      conversationId,
      userId
    });
    
    res.status(200).json({
      status: 'success',
      response: response.content,
      conversationId: response.conversationId
    });
  } catch (error) {
    logger.error(`Error processing message: ${error.message}`);
    next(error);
  }
};

/**
 * @desc    Create a new conversation
 * @route   POST /api/ai/conversations
 * @access  Private
 */
exports.createConversation = async (req, res, next) => {
  try {
    const { businessProfileId, activeModule = 'initial-assessment' } = req.body;
    
    // Validate business profile if provided
    if (businessProfileId) {
      const profile = await BusinessProfile.findOne({
        where: { id: businessProfileId, userId: req.user.id }
      });
      
      if (!profile) {
        return next(new AppError('Business profile not found', 404, 'PROFILE_NOT_FOUND'));
      }
    }
    
    // Create conversation
    const conversation = await Conversation.create({
      userId: req.user.id,
      businessProfileId,
      activeModule,
      title: `New ${activeModule.replace(/-/g, ' ')} conversation`
    });
    
    // Add system message based on the active module
    const systemMessage = await aiService.getSystemPrompt(activeModule, businessProfileId);
    await conversation.addMessage('system', systemMessage);
    
    // Add welcome message
    const welcomeMessage = await aiService.getWelcomeMessage(activeModule);
    await conversation.addMessage('assistant', welcomeMessage);
    
    res.status(201).json({
      status: 'success',
      data: {
        conversation
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all conversations for a user
 * @route   GET /api/ai/conversations
 * @access  Private
 */
exports.getConversations = async (req, res, next) => {
  try {
    const { businessProfileId, activeModule, limit = 10, page = 1 } = req.query;
    
    // Build query
    const query = { userId: req.user.id, status: { $ne: 'deleted' } };
    
    if (businessProfileId) {
      query.businessProfileId = businessProfileId;
    }
    
    if (activeModule) {
      query.activeModule = activeModule;
    }
    
    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    // Get conversations
    const conversations = await Conversation.find(query)
      .sort({ updatedAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .select('title activeModule businessProfileId createdAt updatedAt lastUpdated');
    
    // Get total count
    const total = await Conversation.countDocuments(query);
    
    res.status(200).json({
      status: 'success',
      results: conversations.length,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / parseInt(limit))
      },
      data: {
        conversations
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get a single conversation
 * @route   GET /api/ai/conversations/:id
 * @access  Private
 */
exports.getConversation = async (req, res, next) => {
  try {
    const conversation = await Conversation.findOne({
      _id: req.params.id,
      userId: req.user.id,
      status: { $ne: 'deleted' }
    });
    
    if (!conversation) {
      return next(new AppError('Conversation not found', 404, 'CONVERSATION_NOT_FOUND'));
    }
    
    res.status(200).json({
      status: 'success',
      data: {
        conversation
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete a conversation
 * @route   DELETE /api/ai/conversations/:id
 * @access  Private
 */
exports.deleteConversation = async (req, res, next) => {
  try {
    const conversation = await Conversation.findOne({
      _id: req.params.id,
      userId: req.user.id
    });
    
    if (!conversation) {
      return next(new AppError('Conversation not found', 404, 'CONVERSATION_NOT_FOUND'));
    }
    
    // Soft delete
    conversation.status = 'deleted';
    await conversation.save();
    
    res.status(200).json({
      status: 'success',
      data: null
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Add a message to a conversation
 * @route   POST /api/ai/conversations/:id/messages
 * @access  Private
 */
exports.addMessage = async (req, res, next) => {
  try {
    const { message } = req.body;
    const conversationId = req.params.id;
    
    // Find conversation
    const conversation = await Conversation.findOne({
      _id: conversationId,
      userId: req.user.id,
      status: { $ne: 'deleted' }
    });
    
    if (!conversation) {
      return next(new AppError('Conversation not found', 404, 'CONVERSATION_NOT_FOUND'));
    }
    
    // Add user message
    await conversation.addMessage('user', message);
    
    // Process message with AI
    const aiResponse = await aiService.processConversationMessage({
      conversation,
      message,
      userId: req.user.id
    });
    
    // Add AI response
    await conversation.addMessage('assistant', aiResponse.content, aiResponse.metadata);
    
    // Update conversation
    conversation.lastUpdated = new Date();
    await conversation.save();
    
    res.status(200).json({
      status: 'success',
      data: {
        message: aiResponse.content,
        metadata: aiResponse.metadata
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Analyze with a specific module
 * @route   POST /api/ai/modules/:moduleId/analyze
 * @access  Private
 */
exports.analyzeWithModule = async (req, res, next) => {
  try {
    const { moduleId } = req.params;
    const { businessProfileId, query } = req.body;
    
    // Validate module
    const validModules = [
      'initial-assessment',
      'telangana-market-insights',
      'social-media-strategy',
      'financial-analysis',
      'customer-profiling',
      'government-schemes'
    ];
    
    if (!validModules.includes(moduleId)) {
      return next(new AppError('Invalid module', 400, 'INVALID_MODULE'));
    }
    
    // Validate business profile if provided
    if (businessProfileId) {
      const profile = await BusinessProfile.findOne({
        where: { id: businessProfileId, userId: req.user.id }
      });
      
      if (!profile) {
        return next(new AppError('Business profile not found', 404, 'PROFILE_NOT_FOUND'));
      }
    }
    
    // Analyze with module
    const analysis = await aiService.analyzeWithModule({
      moduleId,
      businessProfileId,
      query,
      userId: req.user.id
    });
    
    res.status(200).json({
      status: 'success',
      data: {
        analysis
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Subscribe to newsletter
 * @route   POST /api/ai/newsletter
 * @access  Public
 */
exports.subscribeNewsletter = async (req, res, next) => {
  try {
    const { email, name } = req.body;
    
    // Save subscriber
    await saveSubscriber({ email, name });
    
    res.status(200).json({
      status: 'success',
      message: 'Successfully subscribed to newsletter'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Submit contact form
 * @route   POST /api/ai/contact
 * @access  Public
 */
exports.submitContactForm = async (req, res, next) => {
  try {
    const { name, email, message, phone } = req.body;
    
    // Save contact form
    await saveContactForm({ name, email, message, phone });
    
    res.status(200).json({
      status: 'success',
      message: 'Contact form submitted successfully'
    });
  } catch (error) {
    next(error);
  }
};
