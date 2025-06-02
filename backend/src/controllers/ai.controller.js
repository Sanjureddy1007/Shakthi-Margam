const { validationResult } = require('express-validator');
const logger = require('../utils/logger');
const AppError = require('../utils/appError');
const aiService = require('../services/ai.service');
const vectorService = require('../services/vector.service');
const contextService = require('../services/context.service');
const llmService = require('../services/llm.service');
const openaiService = require('../services/openai.service'); // Assuming this service handles direct OpenAI calls like moderation
const config = require('../config/ai.config');
// const mongoose = require('mongoose'); // Only if direct mongoose interaction is needed here, otherwise services handle it.

/**
 * Process a chat message and return an AI response (non-streaming)
 * @route POST /api/ai/chat
 */
exports.chat = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { message, moduleId } = req.body;
    // userId should be set by auth middleware, fallback to body or guest
    const userId = req.user?.id || req.body.userId || 'guest-user';

    logger.info(`[AIController] Processing chat for module: ${moduleId}, user: ${userId}, message: "${message.substring(0, 50)}..."`);

    // 1. Content Moderation (Optional)
    if (config.moderation?.enabled) {
      try {
        const moderationResult = await openaiService.moderateContent(message); // Assumes openaiService has this
        if (moderationResult.flagged) {
          logger.warn(`[AIController] Content flagged for user: ${userId}, message: "${message.substring(0,50)}..."`);
          return res.status(400).json({
            error: 'Your message violates our content policy. Please rephrase.',
            details: moderationResult.categories,
          });
        }
      } catch (modError) {
        logger.error(`[AIController] Moderation check failed: ${modError.message}. Proceeding without moderation.`);
      }
    }

    // 2. Save User Message
    await aiService.saveMessage(userId, message, true, moduleId);

    // 3. Retrieve Conversation History
    const chatHistory = await contextService.getChatHistory(userId, moduleId, config.context.maxContextSize);

    // 4. Generate Embedding for User Message
    const userMessageEmbedding = await vectorService.generateEmbedding(message);

    // 5. Query Vector Store for Relevant Documents
    const namespace = moduleId || config.vectorStore.defaultNamespace || 'general';
    let relevantDocs = await vectorService.query(userMessageEmbedding, namespace, config.vectorStore.topK);

    // 6. Rerank Results (Optional)
    if (config.vectorStore.reranking?.enabled && relevantDocs.length > 0) {
      relevantDocs = await vectorService.rerankResults(message, relevantDocs);
    }

    // 7. Format Documents and History for Prompt
    const formattedDocsText = relevantDocs
      .map((doc, index) => `Source[${index + 1}]: ${doc.metadata?.title || 'Document ' + (index+1)}\n${doc.metadata?.text || doc.metadata?.content || ''}`)
      .join('\n\n');

    const formattedHistory = chatHistory.map(msg => ({
      role: msg.is_user_message ? 'user' : 'assistant',
      content: msg.content,
    }));

    // 8. Get System Prompt
    const systemPrompt = await aiService.getSystemPrompt(moduleId, relevantDocs); // Pass docs if system prompt needs them

    // 9. Build Messages Array
    const messagesForLLM = [
      { role: 'system', content: systemPrompt },
      ...formattedHistory,
      { role: 'user', content: message },
    ];

    if (formattedDocsText) {
      messagesForLLM.push({
        role: 'system',
        content: `Use the following relevant information to answer the user's question. Cite sources using Source[number] format where appropriate:\n${formattedDocsText}`,
      });
    }

    // 10. Call LLM Service
    const llmResponse = await llmService.generateCompletion(messagesForLLM);

    // 11. Extract Citations (if LLM is instructed to produce them or based on used docs)
    const citations = relevantDocs.map((doc, index) => ({
      id: doc.id,
      title: doc.metadata?.title || `Source ${index + 1}`,
      source: doc.metadata?.source || 'Knowledge Base',
      score: doc.score,
    }));

    // 12. Save AI Response
    await aiService.saveMessage(userId, llmResponse.content, false, moduleId, {
      citations,
      usage: llmResponse.usage,
      model: llmResponse.model,
    });

    // 13. Log Interaction (Async)
    aiService.logInteraction(userId, moduleId, messagesForLLM, llmResponse).catch(logErr => {
      logger.error(`[AIController] Failed to log interaction: ${logErr.message}`);
    });

    // 14. Return Response
    res.status(200).json({
      content: llmResponse.content,
      citations,
      usage: llmResponse.usage,
      model: llmResponse.model,
    });

  } catch (error) {
    logger.error(`[AIController] Error in chat: ${error.message}\n${error.stack}`);
    try {
      const fallbackResponse = await aiService.generateFallbackResponse(req.body.message, req.body.moduleId);
      const userId = req.user?.id || req.body.userId || 'guest-user';
      await aiService.saveMessage(userId, fallbackResponse.content, false, req.body.moduleId, { fallback: true, error: error.message });
      return res.status(200).json(fallbackResponse); // Send 200 for fallback to avoid FE error state
    } catch (fallbackError) {
      logger.error(`[AIController] Fallback response generation also failed: ${fallbackError.message}`);
      return next(new AppError('Sorry, I encountered an issue processing your request. Please try again later.', 500));
    }
  }
};

/**
 * Stream chat response using Server-Sent Events (SSE)
 * @route GET /api/ai/chat/stream
 */
exports.streamChat = async (req, res, next) => {
  try {
    const errors = validationResult(req); // Assuming validation rules are set up for GET query params
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { message, moduleId } = req.query;
    const userId = req.user?.id || req.query.userId || 'guest-user'; // Allow userId via query for unauthed streams if designed

    logger.info(`[AIController] Streaming chat for module: ${moduleId}, user: ${userId}, message: "${message.substring(0,50)}..."`);

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders(); // Flush the headers to establish the connection

    // Save user message (async, don't block stream start)
    aiService.saveMessage(userId, message, true, moduleId).catch(err => logger.error(`Error saving user stream message: ${err.message}`));

    // RAG Pipeline (similar to non-streaming, adapted for stream)
    const chatHistory = await contextService.getChatHistory(userId, moduleId, config.context.maxContextSize);
    const userMessageEmbedding = await vectorService.generateEmbedding(message);
    const namespace = moduleId || config.vectorStore.defaultNamespace || 'general';
    let relevantDocs = await vectorService.query(userMessageEmbedding, namespace, config.vectorStore.topK);

    if (config.vectorStore.reranking?.enabled && relevantDocs.length > 0) {
      relevantDocs = await vectorService.rerankResults(message, relevantDocs);
    }

    const formattedDocsText = relevantDocs
      .map((doc, index) => `Source[${index + 1}]: ${doc.metadata?.title || 'Document ' + (index+1)}\n${doc.metadata?.text || doc.metadata?.content || ''}`)
      .join('\n\n');
    
    const systemPrompt = await aiService.getSystemPrompt(moduleId, relevantDocs);
    const formattedHistory = chatHistory.map(msg => ({
      role: msg.is_user_message ? 'user' : 'assistant',
      content: msg.content,
    }));

    const messagesForLLM = [
      { role: 'system', content: systemPrompt },
      ...formattedHistory,
      { role: 'user', content: message },
    ];
    if (formattedDocsText) {
      messagesForLLM.push({
        role: 'system',
        content: `Use the following relevant information to answer the user's question. Cite sources using Source[number] format where appropriate:\n${formattedDocsText}`,
      });
    }

    // Send initial citations data if available
    const citations = relevantDocs.map((doc, index) => ({
      id: doc.id,
      title: doc.metadata?.title || `Source ${index + 1}`,
      source: doc.metadata?.source || 'Knowledge Base',
      score: doc.score,
    }));
    if (citations.length > 0) {
      res.write(`data: ${JSON.stringify({ type: 'citations', payload: citations })}\n\n`);
    }
    
    let fullResponseContent = '';
    let finalLLMUsage = null;
    let finalModel = null;

    try {
      const stream = await llmService.generateCompletionStream(messagesForLLM);
      for await (const chunk of stream) {
        const contentChunk = chunk.choices[0]?.delta?.content || '';
        if (contentChunk) {
          fullResponseContent += contentChunk;
          res.write(`data: ${JSON.stringify({ type: 'content', payload: contentChunk })}\n\n`);
        }
        if (chunk.usage) { // OpenAI stream can send usage at the end
            finalLLMUsage = chunk.usage;
        }
        if(chunk.model) {
            finalModel = chunk.model;
        }
      }
    } catch (streamError) {
      logger.error(`[AIController] LLM stream error: ${streamError.message}`);
      // Attempt to send a fallback message through the stream
      const fallback = await aiService.generateFallbackResponse(message, moduleId);
      res.write(`data: ${JSON.stringify({ type: 'error', payload: fallback.content, fallback: true })}\n\n`);
      fullResponseContent = fallback.content; // So fallback is saved
      // Save fallback AI message
      aiService.saveMessage(userId, fullResponseContent, false, moduleId, { fallback: true, error: streamError.message, citations, usage: finalLLMUsage, model: finalModel })
        .catch(err => logger.error(`Error saving fallback stream message: ${err.message}`));
    }

    // Send 'done' signal
    res.write(`data: ${JSON.stringify({ type: 'done', payload: { usage: finalLLMUsage, model: finalModel } })}\n\n`);
    res.end();

    // Save full AI response (if not already saved as fallback)
    if (fullResponseContent && !res.headersSent?.fallback) { // Check if fallback was sent
        aiService.saveMessage(userId, fullResponseContent, false, moduleId, { citations, usage: finalLLMUsage, model: finalModel, streamed: true })
            .catch(err => logger.error(`Error saving full stream message: ${err.message}`));
    }

    // Log interaction (async)
    aiService.logInteraction(userId, moduleId, messagesForLLM, { content: fullResponseContent, usage: finalLLMUsage, model: finalModel })
        .catch(logErr => logger.error(`[AIController] Failed to log stream interaction: ${logErr.message}`));

  } catch (error) {
    logger.error(`[AIController] Error in streamChat setup: ${error.message}\n${error.stack}`);
    // If headers not sent, pass to error middleware
    if (!res.headersSent) {
      return next(new AppError('Failed to initiate stream.', 500));
    }
    // If headers sent, try to send an error event and end stream
    try {
      res.write(`data: ${JSON.stringify({ type: 'error', payload: 'An internal server error occurred.' })}\n\n`);
      res.write(`data: ${JSON.stringify({ type: 'done' })}\n\n`);
      res.end();
    } catch (e) {
      logger.error('[AIController] Failed to send error event on stream:', e);
    }
  }
};

/**
 * Get chat history for a module
 * @route GET /api/ai/history/:moduleId
 */
exports.getChatHistory = async (req, res, next) => {
  try {
    const { moduleId } = req.params;
    const userId = req.user?.id || req.query.userId || 'guest-user'; // Allow userId via query for specific use cases
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || config.context.defaultHistoryLimit || 20;

    logger.info(`[AIController] Fetching chat history for module: ${moduleId}, user: ${userId}, page: ${page}, limit: ${limit}`);

    const historyData = await aiService.getPaginatedChatHistory(userId, moduleId, page, limit);

    res.status(200).json({
      success: true,
      data: historyData.messages,
      pagination: historyData.pagination,
    });
  } catch (error) {
    logger.error(`[AIController] Error fetching chat history: ${error.message}`);
    next(new AppError('Failed to retrieve chat history.', 500));
  }
};

/**
 * Clear chat history for a module
 * @route DELETE /api/ai/history/:moduleId
 */
exports.clearChatHistory = async (req, res, next) => {
  try {
    const { moduleId } = req.params;
    const userId = req.user?.id; // Must be authenticated

    if (!userId) {
      return next(new AppError('Authentication required to clear history.', 401));
    }

    logger.info(`[AIController] Clearing chat history for module: ${moduleId}, user: ${userId}`);
    await aiService.clearChatHistory(userId, moduleId);

    res.status(200).json({
      success: true,
      message: `Chat history for module '${moduleId}' cleared successfully.`,
    });
  } catch (error) {
    logger.error(`[AIController] Error clearing chat history: ${error.message}`);
    next(new AppError('Failed to clear chat history.', 500));
  }
};

/**
 * Get available AI modules
 * @route GET /api/ai/modules
 */
exports.getModules = (req, res, next) => {
  try {
    const modules = Object.entries(config.modules)
      .filter(([, moduleConfig]) => moduleConfig.enabled)
      .map(([id, moduleConf]) => ({
        id,
        name: moduleConf.name || id.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
        description: moduleConf.description || `AI assistance for ${id}`,
        features: moduleConf.features || [],
        // Add any other relevant public info from config
      }));
    
    logger.info(`[AIController] Fetching available AI modules. Count: ${modules.length}`);
    res.status(200).json({ success: true, data: modules });
  } catch (error) {
    logger.error(`[AIController] Error fetching modules: ${error.message}`);
    next(new AppError('Could not retrieve AI modules.', 500));
  }
};
