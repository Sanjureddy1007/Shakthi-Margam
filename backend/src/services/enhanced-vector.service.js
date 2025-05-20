const logger = require('../utils/logger');
const config = require('../config/ai.config');
const llmService = require('./llm.service');
const pineconeService = require('./pinecone.service');
const { VectorEntry } = require('../models/mongodb/VectorEntry');
const { BusinessProfile } = require('../models/supabase/BusinessProfile');

/**
 * Enhanced Vector Service for knowledge retrieval
 */
class EnhancedVectorService {
  constructor() {
    this.defaultTopK = config.vectorStore.topK;
    this.reRankingEnabled = config.vectorStore.reranking.enabled;
    this.hybridSearchEnabled = config.vectorStore.hybridSearch.enabled;
    this.vectorWeight = config.vectorStore.hybridSearch.weights.vector;
    this.keywordWeight = config.vectorStore.hybridSearch.weights.keyword;
  }

  /**
   * Get relevant context for a query
   * @param {Object} params - Parameters for context retrieval
   * @param {string} params.query - The query
   * @param {string} params.activeModule - The active module
   * @param {string} params.businessProfileId - The business profile ID
   * @param {string} params.userId - The user ID
   * @param {number} params.topK - Number of results to return
   * @returns {Promise<Object>} - The relevant context
   */
  async getRelevantContext(params) {
    try {
      const {
        query,
        activeModule,
        businessProfileId,
        userId,
        topK = this.defaultTopK
      } = params;

      // Determine sources based on active module
      const sources = this.getSourcesForModule(activeModule);

      // Generate embeddings for the query
      const queryEmbedding = await llmService.generateEmbeddings(query);

      // Get business profile if available
      let businessProfile = null;
      if (businessProfileId) {
        businessProfile = await BusinessProfile.findByPk(businessProfileId);
      }

      // Build filter for vector search
      const filter = this.buildSearchFilter(sources, businessProfile);

      // Perform vector search
      const vectorResults = await this.performVectorSearch(queryEmbedding, filter, topK);

      // If hybrid search is enabled, also perform keyword search and combine results
      let combinedResults = vectorResults;
      if (this.hybridSearchEnabled) {
        const keywordResults = await this.performKeywordSearch(query, filter, topK);
        combinedResults = this.combineSearchResults(vectorResults, keywordResults);
      }

      // Re-rank results if enabled
      let finalResults = combinedResults;
      if (this.reRankingEnabled) {
        finalResults = await this.reRankResults(query, combinedResults);
      }

      // Format results for response
      return this.formatResults(finalResults);
    } catch (error) {
      logger.error(`Error getting relevant context: ${error.message}`);

      // Return empty context on error
      return {
        text: '',
        sources: []
      };
    }
  }

  /**
   * Get sources for a module
   * @private
   */
  getSourcesForModule(moduleId) {
    switch (moduleId) {
      case 'initial-assessment':
        return ['business_basics', 'assessment_guides', 'telangana_business_environment'];
      case 'social-media-strategy':
        return ['social_media_guides', '4cs_framework', 'telangana_social_trends'];
      case 'financial-analysis':
        return ['financial_guides', 'funding_opportunities', 'telangana_financial_resources'];
      case 'telangana-market-insights':
        return ['telangana_market_data', 'industry_reports', 'success_stories'];
      case 'customer-profiling':
        return ['customer_segmentation', 'telangana_demographics', 'marketing_guides'];
      case 'government-schemes':
        return ['government_schemes', 'telangana_policies', 'application_guides'];
      default:
        return ['general_knowledge', 'telangana_business_environment'];
    }
  }

  /**
   * Build search filter
   * @private
   */
  buildSearchFilter(sources, businessProfile) {
    const filter = {
      source: { $in: sources }
    };

    if (businessProfile) {
      // Add industry filter if available
      if (businessProfile.industry) {
        filter.$or = [
          { 'metadata.industry': businessProfile.industry },
          { 'metadata.industry': { $exists: false } }
        ];
      }

      // Add district filter if available
      if (businessProfile.location && businessProfile.location.district) {
        filter.$or = filter.$or || [];
        filter.$or.push(
          { 'metadata.district': businessProfile.location.district },
          { 'metadata.district': { $exists: false } }
        );
      }
    }

    return filter;
  }

  /**
   * Perform vector search
   * @private
   */
  async performVectorSearch(queryEmbedding, filter, topK) {
    try {
      // Try Pinecone first
      const matches = await pineconeService.querySimilar({
        embedding: queryEmbedding,
        filter,
        topK
      });

      return matches.map(match => ({
        id: match.id,
        content: match.metadata.text,
        source: match.metadata.source,
        category: match.metadata.category,
        metadata: match.metadata,
        score: match.score,
        type: 'vector'
      }));
    } catch (error) {
      logger.error(`Pinecone search failed, falling back to MongoDB: ${error.message}`);

      // Fallback to MongoDB
      const entries = await VectorEntry.find(filter)
        .sort({ relevanceScore: -1 })
        .limit(topK)
        .select('-embedding');

      return entries.map(entry => ({
        id: entry._id.toString(),
        content: entry.text,
        source: entry.source,
        category: entry.category,
        metadata: entry.metadata,
        score: entry.relevanceScore,
        type: 'vector'
      }));
    }
  }

  /**
   * Format results for response
   * @private
   */
  formatResults(results) {
    // Combine all text with source attribution
    const text = results.map(result =>
      `[${result.source}] ${result.content}`
    ).join('\n\n');

    // Extract sources for citation
    const sources = results.map(result => ({
      id: result.id,
      source: result.source,
      category: result.category
    }));

    return {
      text,
      sources
    };
  }

  // Additional methods for hybrid search and re-ranking would be implemented here
}

module.exports = new EnhancedVectorService();
