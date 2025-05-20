const logger = require('../../utils/logger');
const openaiService = require('../openai.service');

/**
 * Social Media Strategy Module
 * Helps create customized social media plans
 */
const socialMediaStrategyModule = {
  name: 'Social Media Strategy',
  description: 'Create customized social media plans for different platforms popular in Telangana.',
  capabilities: [
    'Platform selection guidance',
    'Content strategy development',
    'Posting schedule creation',
    'Audience targeting advice',
    'Performance metrics analysis'
  ],
  
  /**
   * Get system prompt for the module
   * @param {Object} businessProfile - The business profile (optional)
   * @returns {string} - The system prompt
   */
  getSystemPrompt: (businessProfile) => {
    let prompt = `You are Shakti Margam AI, an assistant specializing in social media strategy for women entrepreneurs in Telangana.
Your goal is to help entrepreneurs create effective social media plans tailored to their business and target audience.
Focus on platforms popular in Telangana, content strategies that resonate with local audiences, and practical implementation steps.
Provide specific, actionable advice that considers the unique context of Telangana's social media landscape.`;
    
    if (businessProfile) {
      prompt += `\n\nYou are currently creating a social media strategy for the following business:
Name: ${businessProfile.name}
Industry: ${businessProfile.industry || 'Not specified'}
Stage: ${businessProfile.stage || 'Not specified'}
Location: ${businessProfile.district ? `${businessProfile.district}, Telangana` : 'Telangana'}`;
    }
    
    return prompt;
  },
  
  /**
   * Get welcome message for the module
   * @param {Object} businessProfile - The business profile (optional)
   * @returns {string} - The welcome message
   */
  getWelcomeMessage: (businessProfile) => {
    if (businessProfile) {
      return `Welcome to Social Media Strategy! I'll help you create an effective social media plan for ${businessProfile.name}. What platforms are you currently using or interested in exploring?`;
    }
    
    return "Welcome to Social Media Strategy! I'll help you create a customized social media plan for your business. To get started, could you tell me about your business and your current social media presence?";
  },
  
  /**
   * Process a message
   * @param {Object} params
   * @param {string} params.message - The user's message
   * @param {Array} params.conversationHistory - The conversation history
   * @param {Object} params.relevantContext - The relevant context
   * @param {Object} params.businessProfile - The business profile (optional)
   * @param {string} params.userId - The user ID
   * @returns {Promise<Object>} - The response
   */
  processMessage: async ({ message, conversationHistory, relevantContext, businessProfile, userId }) => {
    // For now, use the default OpenAI processing
    return null;
  },
  
  /**
   * Build a prompt for the LLM
   * @param {Object} params
   * @param {string} params.message - The user's message
   * @param {Array} params.conversationHistory - The conversation history
   * @param {Object} params.relevantContext - The relevant context
   * @param {Object} params.businessProfile - The business profile (optional)
   * @returns {Object} - The prompt
   */
  buildPrompt: ({ message, conversationHistory, relevantContext, businessProfile }) => {
    // Use the default prompt building
    return null;
  },
  
  /**
   * Analyze with the module
   * @param {Object} params
   * @param {string} params.query - The query
   * @param {Object} params.relevantContext - The relevant context
   * @param {Object} params.businessProfile - The business profile (optional)
   * @param {string} params.userId - The user ID
   * @returns {Promise<Object>} - The analysis
   */
  analyze: async ({ query, relevantContext, businessProfile, userId }) => {
    try {
      // Generate social media strategy
      const prompt = {
        messages: [
          {
            role: 'system',
            content: `You are a social media strategy expert for businesses in Telangana.
Create a comprehensive social media strategy based on the information provided.
Include platform selection, content themes, posting schedule, audience targeting, and performance metrics.
Be specific to Telangana's social media landscape and provide practical implementation steps.

${relevantContext.text ? `Here is some relevant information:
${relevantContext.text}` : ''}`
          },
          {
            role: 'user',
            content: `Create a social media strategy for ${businessProfile ? `this business:
${JSON.stringify(businessProfile, null, 2)}` : query || 'a business in Telangana'}`
          }
        ]
      };
      
      const response = await openaiService.generateResponse(prompt);
      
      return {
        strategy: response.content,
        sources: relevantContext.sources
      };
    } catch (error) {
      logger.error(`Error analyzing with social media strategy module: ${error.message}`);
      return {
        error: "I'm sorry, I encountered an error creating a social media strategy. Please try again later."
      };
    }
  }
};

module.exports = socialMediaStrategyModule;
