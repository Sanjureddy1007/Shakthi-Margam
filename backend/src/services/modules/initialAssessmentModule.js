const logger = require('../../utils/logger');
const openaiService = require('../openai.service');

/**
 * Initial Assessment Module
 * Handles business assessment and analysis
 */
const initialAssessmentModule = {
  name: 'Initial Business Assessment',
  description: 'Analyze your business idea, model, and current performance to identify strengths and areas for improvement.',
  capabilities: [
    'Business model analysis',
    'Strengths and weaknesses identification',
    'Market fit assessment',
    'Growth potential evaluation',
    'Competitive advantage analysis'
  ],
  
  /**
   * Get system prompt for the module
   * @param {Object} businessProfile - The business profile (optional)
   * @returns {string} - The system prompt
   */
  getSystemPrompt: (businessProfile) => {
    let prompt = `You are Shakti Margam AI, an assistant specializing in business assessment for women entrepreneurs in Telangana.
Your goal is to help entrepreneurs evaluate their business ideas, models, and current performance.
Provide constructive feedback, identify strengths and weaknesses, and suggest improvements.
Focus on practical advice that considers the unique context of Telangana's business environment.`;
    
    if (businessProfile) {
      prompt += `\n\nYou are currently assessing the following business:
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
      return `Welcome to the Initial Business Assessment for ${businessProfile.name}! I'll help you evaluate your ${businessProfile.industry || 'business'} and identify opportunities for growth. What specific aspect of your business would you like to assess first?`;
    }
    
    return "Welcome to the Initial Business Assessment! I'll help you evaluate your business idea or current operations to identify strengths, weaknesses, and opportunities for growth. To get started, could you tell me about your business or business idea?";
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
    try {
      // Check if the message is asking for a specific assessment
      const lowerMessage = message.toLowerCase();
      
      // Handle specific assessment requests
      if (lowerMessage.includes('swot') || 
          (lowerMessage.includes('strength') && lowerMessage.includes('weakness'))) {
        return await initialAssessmentModule.generateSWOTAnalysis(businessProfile, relevantContext);
      }
      
      if (lowerMessage.includes('competitor') || lowerMessage.includes('competition')) {
        return await initialAssessmentModule.analyzeCompetitors(businessProfile, relevantContext);
      }
      
      if (lowerMessage.includes('market fit') || 
          (lowerMessage.includes('product') && lowerMessage.includes('market'))) {
        return await initialAssessmentModule.assessMarketFit(businessProfile, relevantContext);
      }
      
      // For other messages, use the default OpenAI processing
      return null;
    } catch (error) {
      logger.error(`Error in initial assessment module: ${error.message}`);
      return {
        content: "I'm sorry, I encountered an error while processing your request. Please try again.",
        metadata: { error: error.message }
      };
    }
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
      if (!businessProfile) {
        return {
          analysis: "To provide a comprehensive business assessment, I need information about your business. Please create a business profile first.",
          nextSteps: ["Create a business profile", "Provide information about your business"]
        };
      }
      
      // Generate a comprehensive business assessment
      const prompt = {
        messages: [
          {
            role: 'system',
            content: `You are a business assessment expert for women entrepreneurs in Telangana.
Provide a comprehensive assessment of the business based on the information provided.
Include strengths, weaknesses, opportunities, threats, market fit, and growth potential.
Be specific, practical, and actionable in your assessment.

${relevantContext.text ? `Here is some relevant information:
${relevantContext.text}` : ''}`
          },
          {
            role: 'user',
            content: `Analyze this business:
${JSON.stringify(businessProfile, null, 2)}

${query ? `Specific focus: ${query}` : ''}`
          }
        ]
      };
      
      const response = await openaiService.generateResponse(prompt);
      
      return {
        analysis: response.content,
        businessProfile: {
          id: businessProfile.id,
          name: businessProfile.name,
          industry: businessProfile.industry,
          stage: businessProfile.stage
        },
        sources: relevantContext.sources
      };
    } catch (error) {
      logger.error(`Error analyzing with initial assessment module: ${error.message}`);
      return {
        error: "I'm sorry, I encountered an error analyzing your business. Please try again later."
      };
    }
  },
  
  /**
   * Analyze a business assessment
   * @param {Object} businessProfile - The business profile
   * @returns {Promise<Object>} - The analysis
   */
  analyzeAssessment: async (businessProfile) => {
    try {
      // Generate a comprehensive business assessment
      const prompt = {
        messages: [
          {
            role: 'system',
            content: `You are a business assessment expert for women entrepreneurs in Telangana.
Provide a comprehensive assessment of the business based on the information provided.
Include strengths, weaknesses, opportunities, threats, market fit, and growth potential.
Be specific, practical, and actionable in your assessment.
Format your response with clear sections and bullet points.`
          },
          {
            role: 'user',
            content: `Analyze this business:
${JSON.stringify(businessProfile, null, 2)}`
          }
        ]
      };
      
      const response = await openaiService.generateResponse(prompt);
      
      return {
        assessment: response.content,
        completionPercentage: businessProfile.completionPercentage,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      logger.error(`Error analyzing assessment: ${error.message}`);
      return {
        error: "I'm sorry, I encountered an error analyzing your business assessment. Please try again later."
      };
    }
  },
  
  /**
   * Generate a SWOT analysis
   * @param {Object} businessProfile - The business profile
   * @param {Object} relevantContext - The relevant context
   * @returns {Promise<Object>} - The SWOT analysis
   */
  generateSWOTAnalysis: async (businessProfile, relevantContext) => {
    try {
      if (!businessProfile) {
        return {
          content: "To provide a SWOT analysis, I need information about your business. Could you tell me about your business or create a business profile?",
          metadata: { type: 'swot_analysis_request' }
        };
      }
      
      // Generate a SWOT analysis
      const prompt = {
        messages: [
          {
            role: 'system',
            content: `You are a business assessment expert for women entrepreneurs in Telangana.
Generate a detailed SWOT (Strengths, Weaknesses, Opportunities, Threats) analysis for the business.
Be specific, practical, and actionable in your analysis.
Format your response with clear sections for Strengths, Weaknesses, Opportunities, and Threats.

${relevantContext.text ? `Here is some relevant information:
${relevantContext.text}` : ''}`
          },
          {
            role: 'user',
            content: `Generate a SWOT analysis for this business:
${JSON.stringify(businessProfile, null, 2)}`
          }
        ]
      };
      
      const response = await openaiService.generateResponse(prompt);
      
      return {
        content: response.content,
        metadata: { 
          type: 'swot_analysis',
          businessProfileId: businessProfile.id,
          sources: relevantContext.sources
        }
      };
    } catch (error) {
      logger.error(`Error generating SWOT analysis: ${error.message}`);
      return {
        content: "I'm sorry, I encountered an error generating the SWOT analysis. Please try again later.",
        metadata: { error: error.message }
      };
    }
  },
  
  /**
   * Analyze competitors
   * @param {Object} businessProfile - The business profile
   * @param {Object} relevantContext - The relevant context
   * @returns {Promise<Object>} - The competitor analysis
   */
  analyzeCompetitors: async (businessProfile, relevantContext) => {
    try {
      if (!businessProfile) {
        return {
          content: "To analyze competitors, I need information about your business. Could you tell me about your business or create a business profile?",
          metadata: { type: 'competitor_analysis_request' }
        };
      }
      
      // Generate a competitor analysis
      const prompt = {
        messages: [
          {
            role: 'system',
            content: `You are a business assessment expert for women entrepreneurs in Telangana.
Generate a detailed competitor analysis for the business.
Identify key competitors in Telangana, their strengths and weaknesses, and how the business can differentiate itself.
Be specific, practical, and actionable in your analysis.

${relevantContext.text ? `Here is some relevant information:
${relevantContext.text}` : ''}`
          },
          {
            role: 'user',
            content: `Analyze competitors for this business:
${JSON.stringify(businessProfile, null, 2)}`
          }
        ]
      };
      
      const response = await openaiService.generateResponse(prompt);
      
      return {
        content: response.content,
        metadata: { 
          type: 'competitor_analysis',
          businessProfileId: businessProfile.id,
          sources: relevantContext.sources
        }
      };
    } catch (error) {
      logger.error(`Error analyzing competitors: ${error.message}`);
      return {
        content: "I'm sorry, I encountered an error analyzing competitors. Please try again later.",
        metadata: { error: error.message }
      };
    }
  },
  
  /**
   * Assess market fit
   * @param {Object} businessProfile - The business profile
   * @param {Object} relevantContext - The relevant context
   * @returns {Promise<Object>} - The market fit assessment
   */
  assessMarketFit: async (businessProfile, relevantContext) => {
    try {
      if (!businessProfile) {
        return {
          content: "To assess market fit, I need information about your business. Could you tell me about your business or create a business profile?",
          metadata: { type: 'market_fit_assessment_request' }
        };
      }
      
      // Generate a market fit assessment
      const prompt = {
        messages: [
          {
            role: 'system',
            content: `You are a business assessment expert for women entrepreneurs in Telangana.
Assess the product-market fit for the business.
Evaluate how well the business's products or services meet the needs of the Telangana market.
Identify opportunities to improve market fit and reach more customers.
Be specific, practical, and actionable in your assessment.

${relevantContext.text ? `Here is some relevant information:
${relevantContext.text}` : ''}`
          },
          {
            role: 'user',
            content: `Assess market fit for this business:
${JSON.stringify(businessProfile, null, 2)}`
          }
        ]
      };
      
      const response = await openaiService.generateResponse(prompt);
      
      return {
        content: response.content,
        metadata: { 
          type: 'market_fit_assessment',
          businessProfileId: businessProfile.id,
          sources: relevantContext.sources
        }
      };
    } catch (error) {
      logger.error(`Error assessing market fit: ${error.message}`);
      return {
        content: "I'm sorry, I encountered an error assessing market fit. Please try again later.",
        metadata: { error: error.message }
      };
    }
  }
};

module.exports = initialAssessmentModule;
