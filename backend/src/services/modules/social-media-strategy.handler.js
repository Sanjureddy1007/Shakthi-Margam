const logger = require('../../utils/logger');
const config = require('../../config/ai.config');
const llmService = require('../llm.service');
const { BusinessProfile } = require('../../models/supabase/BusinessProfile');

/**
 * Social Media Strategy Module Handler
 * Implements the 4Cs framework (Captivate, Cultivate, Convince, Convert)
 */
class SocialMediaStrategyHandler {
  constructor() {
    this.moduleId = 'social-media-strategy';
    this.title = 'Social Media Strategy';
    this.description = 'Develop effective social media strategies using the 4Cs framework: Captivate, Cultivate, Convince, and Convert.';
    this.features = config.modules['social-media-strategy'].features;
    this.platforms = config.modules['social-media-strategy'].platforms;
  }

  /**
   * Process a message in the social media strategy module
   * @param {Object} params - Parameters for processing
   * @param {string} params.message - The user message
   * @param {Array} params.conversationHistory - The conversation history
   * @param {Object} params.relevantContext - Relevant context from vector store
   * @param {Object} params.businessProfile - The business profile
   * @param {string} params.userId - The user ID
   * @returns {Promise<Object>} - The response
   */
  async processMessage(params) {
    try {
      const { message, conversationHistory, relevantContext, businessProfile, userId } = params;

      // Detect intent to determine specific functionality
      const intent = await this.detectIntent(message);

      // Handle based on intent
      switch (intent) {
        case 'platform_recommendation':
          return await this.generatePlatformRecommendations(businessProfile, relevantContext);
        case 'content_strategy':
          return await this.generate4CsStrategy(message, businessProfile, relevantContext);
        case 'content_calendar':
          return await this.generateContentCalendar(message, businessProfile, relevantContext);
        case 'metrics_analysis':
          return await this.analyzeMetrics(message, businessProfile);
        default:
          // General social media advice
          return await this.generateGeneralAdvice(message, conversationHistory, relevantContext, businessProfile);
      }
    } catch (error) {
      logger.error(`Error in social media strategy handler: ${error.message}`);
      return {
        content: "I'm sorry, I encountered an error while processing your social media strategy request. Please try again.",
        metadata: { error: error.message }
      };
    }
  }

  /**
   * Analyze with the social media strategy module
   * @param {Object} params - Parameters for analysis
   * @param {string} params.query - The query
   * @param {Object} params.relevantContext - Relevant context from vector store
   * @param {Object} params.businessProfile - The business profile
   * @param {string} params.userId - The user ID
   * @returns {Promise<Object>} - The analysis
   */
  async analyze(params) {
    try {
      const { query, relevantContext, businessProfile, userId } = params;

      // Determine analysis type
      if (query.toLowerCase().includes('platform') || query.toLowerCase().includes('which social media')) {
        return await this.generatePlatformRecommendations(businessProfile, relevantContext);
      } else if (query.toLowerCase().includes('content') || query.toLowerCase().includes('strategy')) {
        return await this.generate4CsStrategy(query, businessProfile, relevantContext);
      } else if (query.toLowerCase().includes('calendar') || query.toLowerCase().includes('schedule')) {
        return await this.generateContentCalendar(query, businessProfile, relevantContext);
      } else {
        // General social media analysis
        return await this.generateComprehensiveAnalysis(businessProfile, relevantContext);
      }
    } catch (error) {
      logger.error(`Error in social media strategy analysis: ${error.message}`);
      return {
        error: "I'm sorry, I encountered an error analyzing your social media strategy. Please try again."
      };
    }
  }

  /**
   * Build a prompt for the social media strategy module
   * @param {Object} params - Parameters for building the prompt
   * @returns {Object} - The prompt
   */
  buildPrompt(params) {
    const { message, conversationHistory, relevantContext, businessProfile } = params;

    // Create system message with 4Cs framework context
    const systemMessage = `You are a social media strategy expert for women entrepreneurs in Telangana, India.
You specialize in the 4Cs framework: Captivate, Cultivate, Convince, and Convert.

- Captivate: Strategies to attract attention and generate interest
- Cultivate: Methods to nurture relationships and build community
- Convince: Approaches to establish credibility and overcome objections
- Convert: Techniques to drive desired actions and measure results

Tailor your advice to the unique cultural and business context of Telangana.
Consider local festivals, regional preferences, and cultural nuances in your recommendations.

${relevantContext.text ? `Here is some relevant information that might help you answer:
${relevantContext.text}` : ''}

${businessProfile ? `Business Profile:
${JSON.stringify(businessProfile, null, 2)}` : ''}`;

    // Construct the prompt
    return {
      messages: [
        { role: 'system', content: systemMessage },
        ...conversationHistory
      ]
    };
  }

  /**
   * Detect intent from a message
   * @private
   */
  async detectIntent(message) {
    const prompt = {
      messages: [
        {
          role: 'system',
          content: `You are an intent classifier for a social media strategy assistant.
Classify the user's message into one of the following intents:
- platform_recommendation: User wants recommendations on which social media platforms to use
- content_strategy: User wants help with content strategy or implementing the 4Cs framework
- content_calendar: User wants help creating a content calendar or posting schedule
- metrics_analysis: User wants help analyzing social media metrics or performance
- general_advice: General questions about social media marketing

Respond with just the intent name, nothing else.`
        },
        { role: 'user', content: message }
      ],
      temperature: 0.3,
      maxTokens: 20
    };

    const response = await llmService.generateResponse(prompt);
    return response.content.trim().toLowerCase();
  }

  /**
   * Generate platform recommendations
   * @private
   */
  async generatePlatformRecommendations(businessProfile, relevantContext) {
    try {
      const prompt = {
        messages: [
          {
            role: 'system',
            content: `You are a social media strategy expert for women entrepreneurs in Telangana, India.
Generate platform-specific recommendations for the business profile provided.
For each recommended platform, explain:
1. Why it's suitable for this specific business
2. Key features to leverage
3. Content types that would perform well
4. Posting frequency recommendations
5. Specific Telangana cultural considerations

Base your recommendations on the business profile and relevant context provided.
Format your response as structured recommendations with clear sections for each platform.

${relevantContext.text ? `Relevant context:
${relevantContext.text}` : ''}`
          },
          {
            role: 'user',
            content: `Generate social media platform recommendations for my business:
${JSON.stringify(businessProfile, null, 2)}`
          }
        ],
        cacheKey: `platform_recommendations:${businessProfile.id}`
      };

      const response = await llmService.generateResponse(prompt);

      return {
        content: response.content,
        metadata: {
          type: 'platform_recommendations',
          sources: relevantContext.sources,
          module: this.moduleId
        }
      };
    } catch (error) {
      logger.error(`Error generating platform recommendations: ${error.message}`);
      return {
        content: "I'm sorry, I encountered an error generating platform recommendations. Please try again.",
        metadata: { error: error.message }
      };
    }
  }

  /**
   * Generate a 4Cs strategy
   * @private
   */
  async generate4CsStrategy(message, businessProfile, relevantContext) {
    try {
      const prompt = {
        messages: [
          {
            role: 'system',
            content: `You are a social media strategy expert specializing in the 4Cs framework for women entrepreneurs in Telangana.
Create a comprehensive 4Cs strategy (Captivate, Cultivate, Convince, Convert) for the business profile provided.

For each of the 4Cs, provide:
1. 3-5 specific tactics tailored to the business
2. Implementation steps
3. Examples of content or approaches
4. Metrics to track success

Format your response as a structured 4Cs strategy with clear sections and actionable items.
Include Telangana-specific cultural elements and considerations.

${relevantContext.text ? `Relevant context:
${relevantContext.text}` : ''}`
          },
          {
            role: 'user',
            content: `Generate a 4Cs social media strategy for my business:
${JSON.stringify(businessProfile, null, 2)}

Additional context from my message: ${message}`
          }
        ],
        cacheKey: `4cs_strategy:${businessProfile.id}:${message.substring(0, 30)}`
      };

      const response = await llmService.generateResponse(prompt);

      return {
        content: response.content,
        metadata: {
          type: '4cs_strategy',
          sources: relevantContext.sources,
          module: this.moduleId
        }
      };
    } catch (error) {
      logger.error(`Error generating 4Cs strategy: ${error.message}`);
      return {
        content: "I'm sorry, I encountered an error generating your 4Cs strategy. Please try again.",
        metadata: { error: error.message }
      };
    }
  }

  /**
   * Generate a content calendar
   * @private
   */
  async generateContentCalendar(message, businessProfile, relevantContext) {
    try {
      // Extract platform from message if mentioned
      let platform = 'all';
      for (const p of this.platforms) {
        if (message.toLowerCase().includes(p)) {
          platform = p;
          break;
        }
      }

      const prompt = {
        messages: [
          {
            role: 'system',
            content: `You are a social media content calendar expert for women entrepreneurs in Telangana, India.
Create a 4-week content calendar for the ${platform === 'all' ? 'requested platforms' : platform} based on the business profile provided.

Include:
1. Content themes for each week
2. Specific post ideas for each day (3-4 posts per week)
3. Best times to post
4. Content types (image, video, story, etc.)
5. Hashtag recommendations
6. Telangana cultural events or festivals to leverage

Format your response as a structured weekly calendar with specific post recommendations.
Include Telangana-specific cultural elements and considerations.

${relevantContext.text ? `Relevant context:
${relevantContext.text}` : ''}`
          },
          {
            role: 'user',
            content: `Generate a social media content calendar for my business:
${JSON.stringify(businessProfile, null, 2)}

Additional context from my message: ${message}`
          }
        ],
        cacheKey: `content_calendar:${businessProfile.id}:${platform}`
      };

      const response = await llmService.generateResponse(prompt);

      return {
        content: response.content,
        metadata: {
          type: 'content_calendar',
          platform,
          sources: relevantContext.sources,
          module: this.moduleId
        }
      };
    } catch (error) {
      logger.error(`Error generating content calendar: ${error.message}`);
      return {
        content: "I'm sorry, I encountered an error generating your content calendar. Please try again.",
        metadata: { error: error.message }
      };
    }
  }

  /**
   * Analyze social media metrics
   * @private
   */
  async analyzeMetrics(message, businessProfile) {
    try {
      // Extract metrics from message
      // This is a simplified implementation - in a real system, you would parse structured metrics data

      const prompt = {
        messages: [
          {
            role: 'system',
            content: `You are a social media metrics analyst for women entrepreneurs in Telangana, India.
Analyze the social media metrics described in the user's message and provide insights and recommendations.

Include:
1. Analysis of current performance
2. Identification of strengths and weaknesses
3. Comparison to industry benchmarks (if possible)
4. Specific recommendations for improvement
5. Key metrics to focus on going forward

Format your response as a structured analysis with clear sections for insights and recommendations.`
          },
          {
            role: 'user',
            content: `Analyze these social media metrics for my business:
${message}

Business profile:
${JSON.stringify(businessProfile, null, 2)}`
          }
        ],
        temperature: 0.5
      };

      const response = await llmService.generateResponse(prompt);

      return {
        content: response.content,
        metadata: {
          type: 'metrics_analysis',
          module: this.moduleId
        }
      };
    } catch (error) {
      logger.error(`Error analyzing metrics: ${error.message}`);
      return {
        content: "I'm sorry, I encountered an error analyzing your social media metrics. Please try again.",
        metadata: { error: error.message }
      };
    }
  }

  /**
   * Generate general social media advice
   * @private
   */
  async generateGeneralAdvice(message, conversationHistory, relevantContext, businessProfile) {
    try {
      const prompt = {
        messages: [
          {
            role: 'system',
            content: `You are a social media strategy expert for women entrepreneurs in Telangana, India.
You specialize in the 4Cs framework: Captivate, Cultivate, Convince, and Convert.

Provide helpful, specific advice based on the user's message and business profile.
Include Telangana-specific cultural considerations when relevant.
Make your advice actionable and tailored to the specific business context.

${relevantContext.text ? `Relevant context:
${relevantContext.text}` : ''}`
          },
          ...conversationHistory,
          {
            role: 'user',
            content: message
          }
        ]
      };

      const response = await llmService.generateResponse(prompt);

      return {
        content: response.content,
        metadata: {
          type: 'general_advice',
          sources: relevantContext.sources,
          module: this.moduleId
        }
      };
    } catch (error) {
      logger.error(`Error generating general advice: ${error.message}`);
      return {
        content: "I'm sorry, I encountered an error generating social media advice. Please try again.",
        metadata: { error: error.message }
      };
    }
  }

  /**
   * Generate a comprehensive social media analysis
   * @private
   */
  async generateComprehensiveAnalysis(businessProfile, relevantContext) {
    try {
      const prompt = {
        messages: [
          {
            role: 'system',
            content: `You are a social media strategy expert for women entrepreneurs in Telangana, India.
Generate a comprehensive social media analysis for the business profile provided.

Include:
1. Current social media presence assessment
2. Platform recommendations with rationale
3. 4Cs strategy overview (Captivate, Cultivate, Convince, Convert)
4. Content themes and ideas
5. Posting schedule recommendations
6. Metrics to track
7. Telangana-specific opportunities and considerations

Format your response as a structured analysis with clear sections and actionable recommendations.

${relevantContext.text ? `Relevant context:
${relevantContext.text}` : ''}`
          },
          {
            role: 'user',
            content: `Generate a comprehensive social media analysis for my business:
${JSON.stringify(businessProfile, null, 2)}`
          }
        ],
        cacheKey: `comprehensive_analysis:${businessProfile.id}`
      };

      const response = await llmService.generateResponse(prompt);

      return {
        analysis: response.content,
        sources: relevantContext.sources
      };
    } catch (error) {
      logger.error(`Error generating comprehensive analysis: ${error.message}`);
      return {
        error: "I'm sorry, I encountered an error generating your social media analysis. Please try again."
      };
    }
  }
}

module.exports = new SocialMediaStrategyHandler();
