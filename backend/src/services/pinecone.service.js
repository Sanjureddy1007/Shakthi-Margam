const { Pinecone } = require('pinecone-client');
const logger = require('../utils/logger');
const openaiService = require('./openai.service');

// Initialize Pinecone client
let pinecone;
let index;

/**
 * Initialize Pinecone client and index
 */
const initPinecone = async () => {
  try {
    // Initialize Pinecone client
    pinecone = new Pinecone({
      apiKey: process.env.PINECONE_API_KEY,
      environment: process.env.PINECONE_ENVIRONMENT
    });

    // Get or create index
    const indexName = process.env.PINECONE_INDEX_NAME || 'shakti-margam-index';
    
    // Check if index exists
    const indexList = await pinecone.listIndexes();
    
    if (!indexList.includes(indexName)) {
      // Create index if it doesn't exist
      logger.info(`Creating Pinecone index: ${indexName}`);
      await pinecone.createIndex({
        name: indexName,
        dimension: 1536, // OpenAI embedding dimension
        metric: 'cosine'
      });
      
      // Wait for index to be ready
      await new Promise(resolve => setTimeout(resolve, 60000));
    }
    
    // Get index
    index = pinecone.index(indexName);
    
    logger.info(`Pinecone initialized with index: ${indexName}`);
    return index;
  } catch (error) {
    logger.error(`Error initializing Pinecone: ${error.message}`);
    throw error;
  }
};

/**
 * Get Pinecone index
 * @returns {Object} - The Pinecone index
 */
const getIndex = async () => {
  if (!index) {
    await initPinecone();
  }
  return index;
};

/**
 * Upsert vectors to Pinecone
 * @param {Array<Object>} vectors - The vectors to upsert
 * @returns {Promise<Object>} - The upsert response
 */
exports.upsertVectors = async (vectors) => {
  try {
    const idx = await getIndex();
    
    // Upsert vectors
    const response = await idx.upsert({
      vectors: vectors.map(vector => ({
        id: vector.id,
        values: vector.embedding,
        metadata: vector.metadata
      }))
    });
    
    logger.info(`Upserted ${vectors.length} vectors to Pinecone`);
    return response;
  } catch (error) {
    logger.error(`Error upserting vectors to Pinecone: ${error.message}`);
    throw error;
  }
};

/**
 * Query Pinecone for similar vectors
 * @param {Object} params
 * @param {Array<number>} params.embedding - The query embedding
 * @param {Object} params.filter - The filter to apply
 * @param {number} params.topK - The number of results to return
 * @returns {Promise<Array<Object>>} - The query results
 */
exports.querySimilar = async ({ embedding, filter = {}, topK = 5 }) => {
  try {
    const idx = await getIndex();
    
    // Query for similar vectors
    const response = await idx.query({
      vector: embedding,
      topK,
      includeMetadata: true,
      filter
    });
    
    logger.info(`Found ${response.matches.length} similar vectors in Pinecone`);
    return response.matches;
  } catch (error) {
    logger.error(`Error querying Pinecone: ${error.message}`);
    return [];
  }
};

/**
 * Delete vectors from Pinecone
 * @param {Array<string>} ids - The vector IDs to delete
 * @returns {Promise<Object>} - The delete response
 */
exports.deleteVectors = async (ids) => {
  try {
    const idx = await getIndex();
    
    // Delete vectors
    const response = await idx.delete({
      ids
    });
    
    logger.info(`Deleted ${ids.length} vectors from Pinecone`);
    return response;
  } catch (error) {
    logger.error(`Error deleting vectors from Pinecone: ${error.message}`);
    throw error;
  }
};

/**
 * Create embedding and upsert to Pinecone
 * @param {Object} params
 * @param {string} params.id - The vector ID
 * @param {string} params.text - The text to embed
 * @param {Object} params.metadata - The metadata to store with the vector
 * @returns {Promise<Object>} - The upsert response
 */
exports.createAndUpsertEmbedding = async ({ id, text, metadata }) => {
  try {
    // Generate embedding
    const embedding = await openaiService.generateEmbeddings(text);
    
    // Upsert to Pinecone
    return await this.upsertVectors([{
      id,
      embedding,
      metadata: {
        ...metadata,
        text
      }
    }]);
  } catch (error) {
    logger.error(`Error creating and upserting embedding: ${error.message}`);
    throw error;
  }
};

// Initialize Pinecone on module load
initPinecone().catch(error => {
  logger.error(`Failed to initialize Pinecone: ${error.message}`);
});

module.exports.getIndex = getIndex;
