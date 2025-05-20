const logger = require('../utils/logger');
const config = require('../config/ai.config');

/**
 * Context Service for managing conversation context
 */
class ContextService {
  constructor() {
    this.contexts = new Map();
    this.maxContextSize = config.context.maxContextSize;
    this.contextTTL = config.context.ttl;
  }

  /**
   * Get the context for a conversation
   * @param {string} conversationId - The conversation ID
   * @returns {Object} - The context
   */
  getContext(conversationId) {
    const context = this.contexts.get(conversationId);
    if (!context) {
      return {
        messages: [],
        metadata: {},
        timestamp: Date.now()
      };
    }

    // Update timestamp to extend TTL
    context.timestamp = Date.now();
    return context;
  }

  /**
   * Update the context for a conversation
   * @param {string} conversationId - The conversation ID
   * @param {Object} context - The context to update
   */
  updateContext(conversationId, context) {
    // Ensure messages don't exceed max context size
    if (context.messages && context.messages.length > this.maxContextSize) {
      // Keep system message if present, then most recent messages
      const systemMessages = context.messages.filter(msg => msg.role === 'system');
      const nonSystemMessages = context.messages.filter(msg => msg.role !== 'system');

      const recentMessages = nonSystemMessages.slice(-this.maxContextSize + systemMessages.length);
      context.messages = [...systemMessages, ...recentMessages];
    }

    this.contexts.set(conversationId, {
      ...context,
      timestamp: Date.now()
    });
  }

  /**
   * Add a message to the context
   * @param {string} conversationId - The conversation ID
   * @param {Object} message - The message to add
   */
  addMessage(conversationId, message) {
    const context = this.getContext(conversationId);
    context.messages.push(message);
    this.updateContext(conversationId, context);
  }

  /**
   * Update metadata in the context
   * @param {string} conversationId - The conversation ID
   * @param {Object} metadata - The metadata to update
   */
  updateMetadata(conversationId, metadata) {
    const context = this.getContext(conversationId);
    context.metadata = {
      ...context.metadata,
      ...metadata
    };
    this.updateContext(conversationId, context);
  }

  /**
   * Get the active module from context
   * @param {string} conversationId - The conversation ID
   * @returns {string|null} - The active module ID
   */
  getActiveModule(conversationId) {
    const context = this.getContext(conversationId);
    return context.metadata.activeModule || null;
  }

  /**
   * Set the active module in context
   * @param {string} conversationId - The conversation ID
   * @param {string} moduleId - The module ID
   */
  setActiveModule(conversationId, moduleId) {
    this.updateMetadata(conversationId, { activeModule: moduleId });
  }

  /**
   * Get the business profile ID from context
   * @param {string} conversationId - The conversation ID
   * @returns {string|null} - The business profile ID
   */
  getBusinessProfileId(conversationId) {
    const context = this.getContext(conversationId);
    return context.metadata.businessProfileId || null;
  }

  /**
   * Set the business profile ID in context
   * @param {string} conversationId - The conversation ID
   * @param {string} profileId - The business profile ID
   */
  setBusinessProfileId(conversationId, profileId) {
    this.updateMetadata(conversationId, { businessProfileId: profileId });
  }

  /**
   * Clean up expired contexts
   */
  cleanupExpiredContexts() {
    const now = Date.now();
    for (const [conversationId, context] of this.contexts.entries()) {
      if (now - context.timestamp > this.contextTTL) {
        this.contexts.delete(conversationId);
      }
    }
  }

  /**
   * Start periodic cleanup
   */
  startPeriodicCleanup() {
    // Clean up every hour
    setInterval(() => {
      this.cleanupExpiredContexts();
    }, 3600000);
  }
}

module.exports = new ContextService();
