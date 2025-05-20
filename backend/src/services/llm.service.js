const { OpenAI } = require('openai');
const logger = require('../utils/logger');
const config = require('../config/ai.config');

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

/**
 * LLM Service for handling different language model providers
 */
class LLMService {
  constructor() {
    this.provider = config.llm.provider;
    this.defaultModel = config.llm.models.openai.completion;
    this.embeddingModel = config.llm.models.openai.embedding;
    this.cache = new Map();
    this.cacheEnabled = config.llm.cache.enabled;
    this.cacheTTL = config.llm.cache.ttl;
  }

  /**
   * Generate a response from the language model
   * @param {Object} options - Options for generating a response
   * @param {Array} options.messages - Array of message objects with role and content
   * @param {string} options.model - Model to use (optional)
   * @param {number} options.temperature - Temperature for response generation (optional)
   * @param {number} options.maxTokens - Maximum tokens to generate (optional)
   * @param {string} options.cacheKey - Key for caching (optional)
   * @returns {Promise<Object>} - The response
   */
  async generateResponse(options) {
    const {
      messages,
      model = this.defaultModel,
      temperature = 0.7,
      maxTokens = 1000,
      cacheKey
    } = options;

    // Check cache if enabled and key provided
    if (this.cacheEnabled && cacheKey) {
      const cachedResponse = this.getCachedResponse(cacheKey);
      if (cachedResponse) {
        logger.info('Using cached LLM response');
        return cachedResponse;
      }
    }

    try {
      logger.info(`Generating response from ${this.provider} using model ${model}`);

      let response;

      // Use the appropriate provider
      switch (this.provider) {
        case 'openai':
          response = await this.generateOpenAIResponse(messages, model, temperature, maxTokens);
          break;
        // Add other providers as needed
        default:
          throw new Error(`Unsupported LLM provider: ${this.provider}`);
      }

      // Cache the response if caching is enabled
      if (this.cacheEnabled && cacheKey) {
        this.cacheResponse(cacheKey, response);
      }

      return response;
    } catch (error) {
      logger.error(`Error generating LLM response: ${error.message}`);
      throw error;
    }
  }

  /**
   * Generate embeddings for a text
   * @param {string} text - The text to generate embeddings for
   * @returns {Promise<Array<number>>} - The embeddings
   */
  async generateEmbeddings(text) {
    try {
      logger.info('Generating embeddings');

      switch (this.provider) {
        case 'openai':
          const response = await openai.embeddings.create({
            model: this.embeddingModel,
            input: text,
            encoding_format: 'float'
          });
          return response.data[0].embedding;
        // Add other providers as needed
        default:
          throw new Error(`Unsupported embedding provider: ${this.provider}`);
      }
    } catch (error) {
      logger.error(`Error generating embeddings: ${error.message}`);
      throw error;
    }
  }

  /**
   * Generate a response using OpenAI
   * @private
   */
  async generateOpenAIResponse(messages, model, temperature, maxTokens) {
    const response = await openai.chat.completions.create({
      model,
      messages,
      temperature,
      max_tokens: maxTokens,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0
    });

    return {
      content: response.choices[0].message.content,
      model: response.model,
      usage: response.usage,
      metadata: {
        provider: 'openai',
        model
      }
    };
  }

  /**
   * Get a cached response
   * @private
   */
  getCachedResponse(key) {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < this.cacheTTL) {
      return cached.response;
    }
    return null;
  }

  /**
   * Cache a response
   * @private
   */
  cacheResponse(key, response) {
    this.cache.set(key, {
      response,
      timestamp: Date.now()
    });
  }

  /**
   * Clear the cache
   */
  clearCache() {
    this.cache.clear();
  }
}

module.exports = new LLMService();
