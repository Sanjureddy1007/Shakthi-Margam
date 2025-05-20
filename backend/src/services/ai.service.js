const { Conversation } = require('../models/mongodb');
const { BusinessProfile } = require('../models/postgres');
const logger = require('../utils/logger');
const vectorService = require('./enhanced-vector.service');
const llmService = require('./llm.service');
const contextService = require('./context.service');
const moduleRegistry = require('./modules/moduleRegistry');

/**
 * Process a message from the user
 * @param {Object} params
 * @param {string} params.message - The user's message
 * @param {string} params.activeModule - The active module
 * @param {string} params.conversationId - The conversation ID (optional)
 * @param {string} params.userId - The user ID
 * @returns {Promise<Object>} - The AI response
 */
exports.processMessage = async ({ message, activeModule, conversationId, userId }) => {
  try {
    let conversation;

    // If conversation ID is provided, get the conversation
    if (conversationId) {
      conversation = await Conversation.findOne({
        _id: conversationId,
        userId,
        status: { $ne: 'deleted' }
      });
    }

    // If conversation doesn't exist, create a new one
    if (!conversation) {
      conversation = await Conversation.create({
        userId,
        activeModule,
        title: `New ${activeModule.replace(/-/g, ' ')} conversation`
      });

      // Add system message based on the active module
      const systemMessage = await this.getSystemPrompt(activeModule);
      await conversation.addMessage('system', systemMessage);
    }

    // Add user message
    await conversation.addMessage('user', message);

    // Update context service
    contextService.updateContext(conversation._id.toString(), {
      messages: conversation.messages.map(msg => ({
        role: msg.role,
        content: msg.content
      })),
      metadata: {
        activeModule,
        businessProfileId: conversation.businessProfileId
      }
    });

    // Process message with AI
    const aiResponse = await this.processConversationMessage({
      conversation,
      message,
      userId
    });

    // Add AI response
    await conversation.addMessage('assistant', aiResponse.content, aiResponse.metadata);

    // Update conversation
    conversation.lastUpdated = new Date();
    await conversation.save();

    return {
      content: aiResponse.content,
      metadata: aiResponse.metadata,
      conversationId: conversation._id
    };
  } catch (error) {
    logger.error(`Error processing message: ${error.message}`);
    return {
      content: "I'm sorry, I encountered an error processing your message. Please try again later.",
      metadata: { error: error.message },
      conversationId: null
    };
  }
};

/**
 * Process a message in an existing conversation
 * @param {Object} params
 * @param {Object} params.conversation - The conversation object
 * @param {string} params.message - The user's message
 * @param {string} params.userId - The user ID
 * @returns {Promise<Object>} - The AI response
 */
exports.processConversationMessage = async ({ conversation, message, userId }) => {
  try {
    // Get the active module
    const activeModule = conversation.activeModule;

    // Get the module handler
    const moduleHandler = moduleRegistry.getModuleHandler(activeModule);

    // Get business profile if available
    let businessProfile = null;
    if (conversation.businessProfileId) {
      businessProfile = await BusinessProfile.findByPk(conversation.businessProfileId);
    }

    // Prepare conversation history for the LLM
    const conversationHistory = conversation.messages.map(msg => ({
      role: msg.role,
      content: msg.content
    }));

    // Get relevant context from vector store
    const relevantContext = await vectorService.getRelevantContext({
      query: message,
      activeModule,
      businessProfileId: conversation.businessProfileId,
      userId
    });

    // Process with module handler
    const moduleResponse = await moduleHandler.processMessage({
      message,
      conversationHistory,
      relevantContext,
      businessProfile,
      userId
    });

    // If module handler returns a response, use it
    if (moduleResponse) {
      return moduleResponse;
    }

    // Otherwise, use the LLM service
    const prompt = this.buildPrompt({
      message,
      conversationHistory,
      relevantContext,
      activeModule,
      businessProfile
    });

    // Generate a cache key for the response
    const cacheKey = `${activeModule}:${message.substring(0, 50)}:${conversation._id}`;

    const aiResponse = await llmService.generateResponse({
      messages: prompt.messages,
      cacheKey
    });

    return {
      content: aiResponse.content,
      metadata: {
        sources: relevantContext.sources,
        module: activeModule
      }
    };
  } catch (error) {
    logger.error(`Error processing conversation message: ${error.message}`);
    return {
      content: "I'm sorry, I encountered an error processing your message. Please try again later.",
      metadata: { error: error.message }
    };
  }
};

/**
 * Get the system prompt for a module
 * @param {string} moduleId - The module ID
 * @param {string} businessProfileId - The business profile ID (optional)
 * @returns {Promise<string>} - The system prompt
 */
exports.getSystemPrompt = async (moduleId, businessProfileId) => {
  try {
    // Get the module handler
    const moduleHandler = moduleRegistry.getModuleHandler(moduleId);

    // Get business profile if available
    let businessProfile = null;
    if (businessProfileId) {
      businessProfile = await BusinessProfile.findByPk(businessProfileId);
    }

    // Get system prompt from module handler
    return moduleHandler.getSystemPrompt(businessProfile);
  } catch (error) {
    logger.error(`Error getting system prompt: ${error.message}`);
    return "You are Shakti Margam AI, an assistant for women entrepreneurs in Telangana. Your goal is to provide helpful, accurate, and supportive guidance.";
  }
};

/**
 * Get the welcome message for a module
 * @param {string} moduleId - The module ID
 * @param {Object} businessProfile - The business profile (optional)
 * @returns {Promise<string>} - The welcome message
 */
exports.getWelcomeMessage = async (moduleId, businessProfile = null) => {
  try {
    // Get the module handler
    const moduleHandler = moduleRegistry.getModuleHandler(moduleId);

    // Get welcome message from module handler
    return moduleHandler.getWelcomeMessage(businessProfile);
  } catch (error) {
    logger.error(`Error getting welcome message: ${error.message}`);
    return "Hello! I'm your Shakti Margam AI assistant. How can I help your business today?";
  }
};

/**
 * Build a prompt for the LLM
 * @param {Object} params
 * @param {string} params.message - The user's message
 * @param {Array} params.conversationHistory - The conversation history
 * @param {Object} params.relevantContext - The relevant context
 * @param {string} params.activeModule - The active module
 * @param {Object} params.businessProfile - The business profile (optional)
 * @returns {Object} - The prompt
 */
exports.buildPrompt = ({ message, conversationHistory, relevantContext, activeModule, businessProfile }) => {
  // Get the module handler
  const moduleHandler = moduleRegistry.getModuleHandler(activeModule);

  // Get module-specific prompt
  const modulePrompt = moduleHandler.buildPrompt({
    message,
    conversationHistory,
    relevantContext,
    businessProfile
  });

  // If module handler returns a prompt, use it
  if (modulePrompt) {
    return modulePrompt;
  }

  // Otherwise, build a generic prompt
  const systemPrompt = `You are Shakti Margam AI, an assistant for women entrepreneurs in Telangana.
Your goal is to provide helpful, accurate, and supportive guidance.
You are currently in the ${activeModule.replace(/-/g, ' ')} module.

${relevantContext.text ? `Here is some relevant information that might help you answer the user's question:
${relevantContext.text}` : ''}

${businessProfile ? `Here is some information about the user's business:
${JSON.stringify(businessProfile, null, 2)}` : ''}`;

  return {
    messages: [
      { role: 'system', content: systemPrompt },
      ...conversationHistory
    ]
  };
};

/**
 * Analyze with a specific module
 * @param {Object} params
 * @param {string} params.moduleId - The module ID
 * @param {string} params.businessProfileId - The business profile ID (optional)
 * @param {string} params.query - The query (optional)
 * @param {string} params.userId - The user ID
 * @returns {Promise<Object>} - The analysis
 */
exports.analyzeWithModule = async ({ moduleId, businessProfileId, query, userId }) => {
  try {
    // Get the module handler
    const moduleHandler = moduleRegistry.getModuleHandler(moduleId);

    // Get business profile if available
    let businessProfile = null;
    if (businessProfileId) {
      businessProfile = await BusinessProfile.findByPk(businessProfileId);
    }

    // Get relevant context from vector store
    const relevantContext = await vectorService.getRelevantContext({
      query,
      activeModule: moduleId,
      businessProfileId,
      userId
    });

    // Analyze with module handler
    return moduleHandler.analyze({
      query,
      relevantContext,
      businessProfile,
      userId
    });
  } catch (error) {
    logger.error(`Error analyzing with module: ${error.message}`);
    return {
      error: "I'm sorry, I encountered an error analyzing your request. Please try again later."
    };
  }
};

/**
 * Analyze a business assessment
 * @param {string} businessProfileId - The business profile ID
 * @returns {Promise<Object>} - The analysis
 */
exports.analyzeBusinessAssessment = async (businessProfileId) => {
  try {
    // Get business profile
    const businessProfile = await BusinessProfile.findByPk(businessProfileId);

    if (!businessProfile) {
      throw new Error('Business profile not found');
    }

    // Get the module handler
    const moduleHandler = moduleRegistry.getModuleHandler('initial-assessment');

    // Analyze with module handler
    return moduleHandler.analyzeAssessment(businessProfile);
  } catch (error) {
    logger.error(`Error analyzing business assessment: ${error.message}`);
    return {
      error: "I'm sorry, I encountered an error analyzing your business assessment. Please try again later."
    };
  }
};

/**
 * Generate business analytics
 * @param {string} businessProfileId - The business profile ID
 * @returns {Promise<Object>} - The analytics
 */
exports.generateBusinessAnalytics = async (businessProfileId) => {
  try {
    // Get business profile
    const businessProfile = await BusinessProfile.findByPk(businessProfileId);

    if (!businessProfile) {
      throw new Error('Business profile not found');
    }

    // Get relevant context from vector store
    const relevantContext = await vectorService.getRelevantContext({
      query: `Business analytics for ${businessProfile.name} in ${businessProfile.industry}`,
      activeModule: 'initial-assessment',
      businessProfileId,
      userId: businessProfile.userId
    });

    // Generate analytics with OpenAI
    const prompt = {
      messages: [
        {
          role: 'system',
          content: `You are a business analytics expert. Generate comprehensive analytics for the following business profile.
Include SWOT analysis, market position, growth opportunities, and key metrics to track.
Base your analysis on the business profile and the relevant context provided.

${relevantContext.text ? `Here is some relevant information:
${relevantContext.text}` : ''}`
        },
        {
          role: 'user',
          content: `Generate business analytics for my business:
${JSON.stringify(businessProfile, null, 2)}`
        }
      ]
    };

    const response = await llmService.generateResponse({
      messages: prompt.messages,
      cacheKey: `analytics:${businessProfileId}`
    });

    return {
      analytics: response.content,
      sources: relevantContext.sources
    };
  } catch (error) {
    logger.error(`Error generating business analytics: ${error.message}`);
    return {
      error: "I'm sorry, I encountered an error generating business analytics. Please try again later."
    };
  }
};

/**
 * Generate business recommendations
 * @param {string} businessProfileId - The business profile ID
 * @returns {Promise<Object>} - The recommendations
 */
exports.generateBusinessRecommendations = async (businessProfileId) => {
  try {
    // Get business profile
    const businessProfile = await BusinessProfile.findByPk(businessProfileId);

    if (!businessProfile) {
      throw new Error('Business profile not found');
    }

    // Get relevant context from vector store
    const relevantContext = await vectorService.getRelevantContext({
      query: `Business recommendations for ${businessProfile.name} in ${businessProfile.industry} in Telangana`,
      activeModule: 'initial-assessment',
      businessProfileId,
      userId: businessProfile.userId
    });

    // Generate recommendations with OpenAI
    const prompt = {
      messages: [
        {
          role: 'system',
          content: `You are a business consultant specializing in women entrepreneurship in Telangana.
Generate actionable recommendations for the following business profile.
Include specific steps, resources, and timelines.
Base your recommendations on the business profile and the relevant context provided.

${relevantContext.text ? `Here is some relevant information:
${relevantContext.text}` : ''}`
        },
        {
          role: 'user',
          content: `Generate business recommendations for my business:
${JSON.stringify(businessProfile, null, 2)}`
        }
      ]
    };

    const response = await llmService.generateResponse({
      messages: prompt.messages,
      cacheKey: `recommendations:${businessProfileId}`
    });

    return {
      recommendations: response.content,
      sources: relevantContext.sources
    };
  } catch (error) {
    logger.error(`Error generating business recommendations: ${error.message}`);
    return {
      error: "I'm sorry, I encountered an error generating business recommendations. Please try again later."
    };
  }
};
