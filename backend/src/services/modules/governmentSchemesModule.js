const logger = require('../../utils/logger');
const openaiService = require('../openai.service');

/**
 * Government Schemes Module
 * Helps identify government schemes and programs
 */
const governmentSchemesModule = {
  name: 'Government Scheme Navigator',
  description: 'Identify government schemes and programs you\'re eligible for with guidance on application processes.',
  capabilities: [
    'Scheme eligibility assessment',
    'Application process guidance',
    'Document requirement information',
    'Deadline tracking',
    'Benefit comparison'
  ],
  
  /**
   * Get system prompt for the module
   * @param {Object} businessProfile - The business profile (optional)
   * @returns {string} - The system prompt
   */
  getSystemPrompt: (businessProfile) => {
    let prompt = `You are Shakti Margam AI, an assistant specializing in government schemes for women entrepreneurs in Telangana.
Your goal is to help entrepreneurs identify schemes they're eligible for and guide them through the application process.
Focus on providing accurate, up-to-date information about government programs, eligibility criteria, and application requirements.
Be specific about the benefits, deadlines, and documentation needed for each scheme.`;
    
    if (businessProfile) {
      prompt += `\n\nYou are currently identifying government schemes for the following business:
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
      return `Welcome to Government Scheme Navigator! I'll help you identify government schemes and programs that ${businessProfile.name} may be eligible for. What specific type of support are you looking for (funding, training, infrastructure, etc.)?`;
    }
    
    return "Welcome to Government Scheme Navigator! I'll help you identify government schemes and programs you may be eligible for as a woman entrepreneur in Telangana. To get started, could you tell me about your business and what type of support you're looking for?";
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
      // Identify eligible government schemes
      const prompt = {
        messages: [
          {
            role: 'system',
            content: `You are an expert on government schemes for women entrepreneurs in Telangana.
Identify relevant government schemes based on the information provided.
For each scheme, include eligibility criteria, benefits, application process, required documents, and deadlines.
Be specific and provide accurate, up-to-date information.
Format your response with clear sections for each scheme.

${relevantContext.text ? `Here is some relevant information:
${relevantContext.text}` : ''}`
          },
          {
            role: 'user',
            content: `Identify government schemes for ${businessProfile ? `this business:
${JSON.stringify(businessProfile, null, 2)}` : query || 'a women-led business in Telangana'}`
          }
        ]
      };
      
      const response = await openaiService.generateResponse(prompt);
      
      return {
        schemes: response.content,
        sources: relevantContext.sources
      };
    } catch (error) {
      logger.error(`Error analyzing with government schemes module: ${error.message}`);
      return {
        error: "I'm sorry, I encountered an error identifying government schemes. Please try again later."
      };
    }
  }
};

module.exports = governmentSchemesModule;
