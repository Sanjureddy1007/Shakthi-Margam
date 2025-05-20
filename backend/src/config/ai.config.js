/**
 * AI Configuration
 * This file contains configuration for AI components
 */

module.exports = {
  // LLM Configuration
  llm: {
    provider: process.env.LLM_PROVIDER || 'openai',
    models: {
      openai: {
        completion: process.env.OPENAI_COMPLETION_MODEL || 'gpt-4-turbo-preview',
        embedding: process.env.OPENAI_EMBEDDING_MODEL || 'text-embedding-3-small'
      }
    },
    cache: {
      enabled: process.env.ENABLE_LLM_CACHE === 'true',
      ttl: parseInt(process.env.LLM_CACHE_TTL || '3600000') // Default 1 hour
    }
  },
  
  // Vector Store Configuration
  vectorStore: {
    provider: process.env.VECTOR_STORE_PROVIDER || 'pinecone',
    pinecone: {
      environment: process.env.PINECONE_ENVIRONMENT,
      apiKey: process.env.PINECONE_API_KEY,
      index: process.env.PINECONE_INDEX
    },
    dimensions: 1536, // OpenAI embedding dimensions
    topK: parseInt(process.env.DEFAULT_TOP_K || '5'),
    reranking: {
      enabled: process.env.ENABLE_RERANKING === 'true',
      model: process.env.RERANKING_MODEL || 'cross-encoder/ms-marco-MiniLM-L-6-v2'
    },
    hybridSearch: {
      enabled: process.env.ENABLE_HYBRID_SEARCH === 'true',
      weights: {
        vector: parseFloat(process.env.VECTOR_WEIGHT || '0.7'),
        keyword: parseFloat(process.env.KEYWORD_WEIGHT || '0.3')
      }
    }
  },
  
  // Context Management Configuration
  context: {
    maxContextSize: parseInt(process.env.MAX_CONTEXT_SIZE || '10'),
    ttl: parseInt(process.env.CONTEXT_TTL || '3600000') // Default 1 hour
  },
  
  // Module Configuration
  modules: {
    'initial-assessment': {
      enabled: true,
      features: [
        'business-idea-validation',
        'swot-analysis',
        'competition-analysis',
        'business-roadmap'
      ]
    },
    'social-media-strategy': {
      enabled: true,
      features: [
        'platform-recommendation',
        '4cs-framework',
        'content-calendar',
        'metrics-analysis'
      ],
      platforms: [
        'instagram',
        'facebook',
        'linkedin',
        'twitter',
        'youtube'
      ]
    },
    'financial-analysis': {
      enabled: true,
      features: [
        'cash-flow-management',
        'funding-opportunities',
        'expense-optimization',
        'revenue-forecasting'
      ]
    },
    'telangana-market-insights': {
      enabled: true,
      features: [
        'industry-analysis',
        'local-market-trends',
        'regulatory-guidance',
        'success-stories'
      ]
    },
    'customer-profiling': {
      enabled: true,
      features: [
        'customer-segmentation',
        'persona-development',
        'acquisition-strategy',
        'retention-strategy'
      ]
    },
    'government-schemes': {
      enabled: true,
      features: [
        'scheme-eligibility',
        'application-guidance',
        'documentation-assistance',
        'success-rate-analysis'
      ]
    }
  }
};
