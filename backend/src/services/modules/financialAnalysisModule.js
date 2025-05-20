const logger = require('../../utils/logger');
const openaiService = require('../openai.service');

/**
 * Financial Analysis Module
 * Provides financial guidance and analysis
 */
const financialAnalysisModule = {
  name: 'Financial Advisor',
  description: 'Guidance on cash flow management, funding opportunities for women entrepreneurs, and financial planning.',
  capabilities: [
    'Cash flow analysis',
    'Funding opportunity identification',
    'Financial planning assistance',
    'Budget creation',
    'Profit margin optimization'
  ],
  
  /**
   * Get system prompt for the module
   * @param {Object} businessProfile - The business profile (optional)
   * @returns {string} - The system prompt
   */
  getSystemPrompt: (businessProfile) => {
    let prompt = `You are Shakti Margam AI, an assistant specializing in financial guidance for women entrepreneurs in Telangana.
Your goal is to help entrepreneurs manage their finances effectively, identify funding opportunities, and plan for growth.
Focus on practical financial advice that considers the unique context of women-led businesses in Telangana.
Provide specific information about funding schemes, grants, and loans available to women entrepreneurs in the region.`;
    
    if (businessProfile) {
      prompt += `\n\nYou are currently providing financial guidance for the following business:
Name: ${businessProfile.name}
Industry: ${businessProfile.industry || 'Not specified'}
Stage: ${businessProfile.stage || 'Not specified'}
Location: ${businessProfile.district ? `${businessProfile.district}, Telangana` : 'Telangana'}
Funding Status: ${businessProfile.fundingStatus || 'Not specified'}`;
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
      return `Welcome to Financial Advisor! I'll help you manage finances and identify funding opportunities for ${businessProfile.name}. What specific financial aspect would you like guidance on?`;
    }
    
    return "Welcome to Financial Advisor! I'll help you with cash flow management, funding opportunities, and financial planning for your business. What financial aspect would you like to discuss today?";
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
      // Generate financial analysis
      const prompt = {
        messages: [
          {
            role: 'system',
            content: `You are a financial advisor specializing in women-led businesses in Telangana.
Provide comprehensive financial guidance based on the information provided.
Include cash flow management, funding opportunities, financial planning, and budget optimization.
Be specific to Telangana's business environment and funding landscape for women entrepreneurs.

${relevantContext.text ? `Here is some relevant information:
${relevantContext.text}` : ''}`
          },
          {
            role: 'user',
            content: `Provide financial guidance for ${businessProfile ? `this business:
${JSON.stringify(businessProfile, null, 2)}` : query || 'a women-led business in Telangana'}`
          }
        ]
      };
      
      const response = await openaiService.generateResponse(prompt);
      
      return {
        guidance: response.content,
        sources: relevantContext.sources
      };
    } catch (error) {
      logger.error(`Error analyzing with financial analysis module: ${error.message}`);
      return {
        error: "I'm sorry, I encountered an error providing financial guidance. Please try again later."
      };
    }
  }
};

module.exports = financialAnalysisModule;
