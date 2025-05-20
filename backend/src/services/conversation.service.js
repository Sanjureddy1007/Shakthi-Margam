const { getSupabaseClient } = require('../config/supabase');
const logger = require('../utils/logger');

/**
 * Create a conversation
 * @param {Object} conversationData - Conversation data
 * @param {string} userId - User ID
 * @returns {Promise<Object>} - The conversation
 */
exports.createConversation = async (conversationData, userId) => {
  try {
    const supabase = getSupabaseClient();
    
    // Create conversation
    const { data: conversation, error: conversationError } = await supabase
      .from('conversations')
      .insert({
        user_id: userId,
        business_profile_id: conversationData.businessProfileId,
        title: conversationData.title || `New ${conversationData.activeModule?.replace(/-/g, ' ') || ''} conversation`,
        active_module: conversationData.activeModule,
        status: 'active',
        last_updated: new Date()
      })
      .select();
    
    if (conversationError) throw new Error(conversationError.message);
    
    // Add system message if provided
    if (conversationData.systemMessage) {
      const { error: messageError } = await supabase
        .from('messages')
        .insert({
          conversation_id: conversation[0].id,
          role: 'system',
          content: conversationData.systemMessage
        });
      
      if (messageError) throw new Error(messageError.message);
    }
    
    // Add welcome message if provided
    if (conversationData.welcomeMessage) {
      const { error: welcomeError } = await supabase
        .from('messages')
        .insert({
          conversation_id: conversation[0].id,
          role: 'assistant',
          content: conversationData.welcomeMessage
        });
      
      if (welcomeError) throw new Error(welcomeError.message);
    }
    
    return conversation[0];
  } catch (error) {
    logger.error(`Error creating conversation: ${error.message}`);
    throw error;
  }
};

/**
 * Get conversations for a user
 * @param {string} userId - User ID
 * @param {Object} options - Query options
 * @returns {Promise<Object>} - The conversations and pagination info
 */
exports.getConversations = async (userId, options = {}) => {
  try {
    const supabase = getSupabaseClient();
    const { businessProfileId, activeModule, limit = 10, page = 1 } = options;
    
    // Build query
    let query = supabase
      .from('conversations')
      .select('*', { count: 'exact' })
      .eq('user_id', userId)
      .eq('status', 'active');
    
    if (businessProfileId) {
      query = query.eq('business_profile_id', businessProfileId);
    }
    
    if (activeModule) {
      query = query.eq('active_module', activeModule);
    }
    
    // Add pagination
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    
    query = query
      .order('last_updated', { ascending: false })
      .range(from, to);
    
    // Execute query
    const { data, error, count } = await query;
    
    if (error) throw new Error(error.message);
    
    return {
      conversations: data,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(count / parseInt(limit))
      }
    };
  } catch (error) {
    logger.error(`Error getting conversations: ${error.message}`);
    throw error;
  }
};

/**
 * Get a conversation by ID
 * @param {string} conversationId - Conversation ID
 * @param {string} userId - User ID
 * @returns {Promise<Object>} - The conversation with messages
 */
exports.getConversation = async (conversationId, userId) => {
  try {
    const supabase = getSupabaseClient();
    
    // Get conversation
    const { data: conversation, error: conversationError } = await supabase
      .from('conversations')
      .select('*')
      .eq('id', conversationId)
      .eq('user_id', userId)
      .eq('status', 'active')
      .single();
    
    if (conversationError) throw new Error(conversationError.message);
    
    // Get messages
    const { data: messages, error: messagesError } = await supabase
      .from('messages')
      .select('*')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true });
    
    if (messagesError) throw new Error(messagesError.message);
    
    // Combine conversation and messages
    return {
      ...conversation,
      messages
    };
  } catch (error) {
    logger.error(`Error getting conversation: ${error.message}`);
    throw error;
  }
};

/**
 * Add a message to a conversation
 * @param {string} conversationId - Conversation ID
 * @param {string} role - Message role (user, assistant, system)
 * @param {string} content - Message content
 * @param {Object} metadata - Message metadata
 * @param {string} userId - User ID
 * @returns {Promise<Object>} - The message
 */
exports.addMessage = async (conversationId, role, content, metadata = {}, userId) => {
  try {
    const supabase = getSupabaseClient();
    
    // Verify conversation belongs to user
    const { data: conversation, error: conversationError } = await supabase
      .from('conversations')
      .select('*')
      .eq('id', conversationId)
      .eq('user_id', userId)
      .eq('status', 'active')
      .single();
    
    if (conversationError) throw new Error(conversationError.message);
    
    // Add message
    const { data: message, error: messageError } = await supabase
      .from('messages')
      .insert({
        conversation_id: conversationId,
        role,
        content,
        metadata
      })
      .select();
    
    if (messageError) throw new Error(messageError.message);
    
    // Update conversation last_updated
    const { error: updateError } = await supabase
      .from('conversations')
      .update({ last_updated: new Date() })
      .eq('id', conversationId);
    
    if (updateError) {
      logger.error(`Error updating conversation last_updated: ${updateError.message}`);
    }
    
    return message[0];
  } catch (error) {
    logger.error(`Error adding message: ${error.message}`);
    throw error;
  }
};

/**
 * Delete a conversation (soft delete)
 * @param {string} conversationId - Conversation ID
 * @param {string} userId - User ID
 * @returns {Promise<boolean>} - Success status
 */
exports.deleteConversation = async (conversationId, userId) => {
  try {
    const supabase = getSupabaseClient();
    
    // Soft delete conversation
    const { error } = await supabase
      .from('conversations')
      .update({ status: 'deleted' })
      .eq('id', conversationId)
      .eq('user_id', userId);
    
    if (error) throw new Error(error.message);
    
    return true;
  } catch (error) {
    logger.error(`Error deleting conversation: ${error.message}`);
    throw error;
  }
};

/**
 * Generate a summary for a conversation
 * @param {string} conversationId - Conversation ID
 * @param {string} summary - Summary text
 * @param {string} userId - User ID
 * @returns {Promise<Object>} - The updated conversation
 */
exports.updateConversationSummary = async (conversationId, summary, userId) => {
  try {
    const supabase = getSupabaseClient();
    
    // Update conversation summary
    const { data, error } = await supabase
      .from('conversations')
      .update({ summary })
      .eq('id', conversationId)
      .eq('user_id', userId)
      .select();
    
    if (error) throw new Error(error.message);
    
    return data[0];
  } catch (error) {
    logger.error(`Error updating conversation summary: ${error.message}`);
    throw error;
  }
};

/**
 * Update conversation insights
 * @param {string} conversationId - Conversation ID
 * @param {Object} insights - Insights data
 * @param {string} userId - User ID
 * @returns {Promise<Object>} - The updated conversation
 */
exports.updateConversationInsights = async (conversationId, insights, userId) => {
  try {
    const supabase = getSupabaseClient();
    
    // Update conversation insights
    const { data, error } = await supabase
      .from('conversations')
      .update({ insights })
      .eq('id', conversationId)
      .eq('user_id', userId)
      .select();
    
    if (error) throw new Error(error.message);
    
    return data[0];
  } catch (error) {
    logger.error(`Error updating conversation insights: ${error.message}`);
    throw error;
  }
};
