const { VectorEntry } = require('../models/mongodb');
const { BusinessProfile, User } = require('../models/postgres');
const logger = require('../utils/logger');
const openaiService = require('./openai.service');
const pineconeService = require('./pinecone.service');

/**
 * Get relevant context for a query
 * @param {Object} params
 * @param {string} params.query - The query
 * @param {string} params.activeModule - The active module
 * @param {string} params.businessProfileId - The business profile ID (optional)
 * @param {string} params.userId - The user ID
 * @returns {Promise<Object>} - The relevant context
 */
exports.getRelevantContext = async ({ query, activeModule, businessProfileId, userId }) => {
  try {
    // Generate embeddings for the query
    const queryEmbedding = await openaiService.generateEmbeddings(query);

    // Define sources based on the active module
    let sources = [];
    switch (activeModule) {
      case 'initial-assessment':
        sources = ['business-templates', 'telangana-market-data'];
        break;
      case 'telangana-market-insights':
        sources = ['telangana-market-data', 'government-schemes'];
        break;
      case 'social-media-strategy':
        sources = ['social-media-guides', 'telangana-market-data'];
        break;
      case 'financial-analysis':
        sources = ['financial-resources', 'government-schemes'];
        break;
      case 'customer-profiling':
        sources = ['customer-insights', 'telangana-market-data'];
        break;
      case 'government-schemes':
        sources = ['government-schemes', 'wehub-resources'];
        break;
      default:
        sources = ['telangana-market-data', 'business-templates', 'government-schemes'];
    }

    // Get business profile if available
    let businessProfile = null;
    if (businessProfileId) {
      businessProfile = await BusinessProfile.findByPk(businessProfileId);
    }

    // Build filter for Pinecone
    const filter = {
      source: { $in: sources }
    };

    if (businessProfile) {
      // Add industry filter if available
      if (businessProfile.industry) {
        filter.$or = [
          { 'industry': businessProfile.industry },
          { 'industry': { $exists: false } }
        ];
      }

      // Add district filter if available
      if (businessProfile.district) {
        filter.$or = filter.$or || [];
        filter.$or.push(
          { 'district': businessProfile.district },
          { 'district': { $exists: false } }
        );
      }
    }

    // Query Pinecone for similar vectors
    const matches = await pineconeService.querySimilar({
      embedding: queryEmbedding,
      filter,
      topK: 5
    });

    // Extract relevant entries from matches
    const relevantEntries = matches.map(match => ({
      id: match.id,
      content: match.metadata.text,
      source: match.metadata.source,
      category: match.metadata.category,
      metadata: match.metadata
    }));

    // Combine the relevant entries into a single context
    const contextText = relevantEntries.map(entry => {
      return `[${entry.source}] ${entry.content}`;
    }).join('\n\n');

    return {
      text: contextText,
      sources: relevantEntries.map(entry => ({
        id: entry.id,
        source: entry.source,
        category: entry.category,
        metadata: entry.metadata
      }))
    };
  } catch (error) {
    logger.error(`Error getting relevant context: ${error.message}`);

    // Fallback to MongoDB if Pinecone fails
    try {
      // Build filter for MongoDB
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
        if (businessProfile.district) {
          filter.$or = filter.$or || [];
          filter.$or.push(
            { 'metadata.district': businessProfile.district },
            { 'metadata.district': { $exists: false } }
          );
        }
      }

      // Search for relevant entries in MongoDB
      const relevantEntries = await VectorEntry.find(filter)
        .sort({ relevanceScore: -1 })
        .limit(5)
        .select('-embedding');

      // Combine the relevant entries into a single context
      const contextText = relevantEntries.map(entry => {
        return `[${entry.source}] ${entry.content}`;
      }).join('\n\n');

      return {
        text: contextText,
        sources: relevantEntries.map(entry => ({
          id: entry._id,
          source: entry.source,
          category: entry.category,
          metadata: entry.metadata
        }))
      };
    } catch (fallbackError) {
      logger.error(`Fallback to MongoDB also failed: ${fallbackError.message}`);
      return {
        text: '',
        sources: []
      };
    }
  }
};

/**
 * Search resources
 * @param {Object} params
 * @param {string} params.query - The query
 * @param {number} params.limit - The limit
 * @param {number} params.page - The page
 * @param {Array<string>} params.sources - The sources to search in
 * @returns {Promise<Object>} - The search results
 */
exports.searchResources = async ({ query, limit = 10, page = 1, sources = [] }) => {
  try {
    // Generate embeddings for the query
    const queryEmbedding = await openaiService.generateEmbeddings(query);

    // Build filter for Pinecone
    const filter = {};
    if (sources && sources.length > 0) {
      filter.source = { $in: sources };
    }

    // Query Pinecone for similar vectors
    const matches = await pineconeService.querySimilar({
      embedding: queryEmbedding,
      filter,
      topK: limit
    });

    // Extract resources from matches
    const resources = matches.map(match => ({
      id: match.id,
      content: match.metadata.text,
      source: match.metadata.source,
      category: match.metadata.category,
      metadata: match.metadata,
      score: match.score
    }));

    // For pagination, we need to get the total count
    // This is a limitation of vector databases, so we'll estimate
    const total = Math.max(resources.length, limit * 2);

    return {
      resources,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    };
  } catch (error) {
    logger.error(`Error searching resources: ${error.message}`);

    // Fallback to MongoDB if Pinecone fails
    try {
      // Build filter for MongoDB
      const filter = {};
      if (sources && sources.length > 0) {
        filter.source = { $in: sources };
      }

      // Pagination
      const skip = (page - 1) * limit;

      // Search for resources in MongoDB
      const resources = await VectorEntry.find({
        $text: { $search: query },
        ...filter
      })
        .sort({ score: { $meta: 'textScore' } })
        .skip(skip)
        .limit(limit)
        .select('-embedding');

      // Get total count
      const total = await VectorEntry.countDocuments({
        $text: { $search: query },
        ...filter
      });

      return {
        resources,
        pagination: {
          total,
          page,
          limit,
          pages: Math.ceil(total / limit)
        }
      };
    } catch (fallbackError) {
      logger.error(`Fallback to MongoDB also failed: ${fallbackError.message}`);
      return {
        resources: [],
        pagination: {
          total: 0,
          page,
          limit,
          pages: 0
        }
      };
    }
  }
};

/**
 * Get personalized resources for a user
 * @param {Object} params
 * @param {Object} params.user - The user
 * @param {number} params.limit - The limit
 * @param {number} params.page - The page
 * @returns {Promise<Object>} - The personalized resources
 */
exports.getPersonalizedResources = async ({ user, limit = 10, page = 1 }) => {
  try {
    // Get user's business profiles
    const businessProfiles = await BusinessProfile.findAll({
      where: { userId: user.id }
    });

    // Build filter based on user's business profiles
    const filter = {};

    if (businessProfiles.length > 0) {
      const industries = [...new Set(businessProfiles.map(profile => profile.industry).filter(Boolean))];
      const districts = [...new Set(businessProfiles.map(profile => profile.district).filter(Boolean))];

      if (industries.length > 0 || districts.length > 0) {
        filter.$or = [];

        if (industries.length > 0) {
          filter.$or.push({ 'industry': { $in: industries } });
        }

        if (districts.length > 0) {
          filter.$or.push({ 'district': { $in: districts } });
        }
      }
    }

    // Generate a query based on user's profile
    let queryText = "women entrepreneurs in Telangana";
    if (businessProfiles.length > 0) {
      const recentProfile = businessProfiles.sort((a, b) =>
        new Date(b.updatedAt) - new Date(a.updatedAt)
      )[0];

      queryText = `${recentProfile.industry || ''} ${recentProfile.stage || ''} business in ${recentProfile.district || 'Telangana'}`;
    }

    // Generate embeddings for the query
    const queryEmbedding = await openaiService.generateEmbeddings(queryText);

    // Query Pinecone for similar vectors
    const matches = await pineconeService.querySimilar({
      embedding: queryEmbedding,
      filter,
      topK: limit
    });

    // Extract resources from matches
    const resources = matches.map(match => ({
      id: match.id,
      content: match.metadata.text,
      source: match.metadata.source,
      category: match.metadata.category,
      metadata: match.metadata,
      score: match.score
    }));

    // For pagination, we need to get the total count
    // This is a limitation of vector databases, so we'll estimate
    const total = Math.max(resources.length, limit * 2);

    return {
      resources,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    };
  } catch (error) {
    logger.error(`Error getting personalized resources: ${error.message}`);

    // Fallback to MongoDB
    try {
      // Build filter for MongoDB
      const filter = {};

      if (businessProfiles.length > 0) {
        const industries = [...new Set(businessProfiles.map(profile => profile.industry).filter(Boolean))];
        const districts = [...new Set(businessProfiles.map(profile => profile.district).filter(Boolean))];

        if (industries.length > 0 || districts.length > 0) {
          filter.$or = [];

          if (industries.length > 0) {
            filter.$or.push({ 'metadata.industry': { $in: industries } });
          }

          if (districts.length > 0) {
            filter.$or.push({ 'metadata.district': { $in: districts } });
          }
        }
      }

      // Pagination
      const skip = (page - 1) * limit;

      // Get resources from MongoDB
      const resources = await VectorEntry.find(filter)
        .sort({ relevanceScore: -1, createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .select('-embedding');

      // Get total count
      const total = await VectorEntry.countDocuments(filter);

      return {
        resources,
        pagination: {
          total,
          page,
          limit,
          pages: Math.ceil(total / limit)
        }
      };
    } catch (fallbackError) {
      logger.error(`Fallback to MongoDB also failed: ${fallbackError.message}`);
      return {
        resources: [],
        pagination: {
          total: 0,
          page,
          limit,
          pages: 0
        }
      };
    }
  }
};
