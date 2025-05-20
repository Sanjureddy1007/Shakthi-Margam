# Shakti Margam AI Services

This directory contains the enhanced AI services for the Shakti Margam platform, providing specialized assistance for women entrepreneurs in Telangana.

## Core Services

### LLM Service (`llm.service.js`)

The LLM Service provides a unified interface for interacting with language models:

- Supports multiple LLM providers (currently OpenAI)
- Handles response generation with configurable parameters
- Implements caching to reduce API costs
- Generates embeddings for vector search

### Context Service (`context.service.js`)

The Context Service manages conversation context:

- Maintains conversation history with TTL-based expiration
- Handles context window management
- Stores metadata like active module and business profile
- Provides methods for updating and retrieving context

### Enhanced Vector Service (`enhanced-vector.service.js`)

The Enhanced Vector Service provides knowledge retrieval capabilities:

- Retrieves relevant context based on user queries
- Supports hybrid search (vector + keyword)
- Implements re-ranking for improved relevance
- Handles business profile-specific filtering
- Falls back to MongoDB if Pinecone is unavailable

## Module Handlers

Module handlers implement domain-specific logic for different business areas:

### Social Media Strategy Handler (`modules/social-media-strategy.handler.js`)

Implements the 4Cs framework (Captivate, Cultivate, Convince, Convert):

- Platform recommendations based on business profile
- 4Cs strategy generation
- Content calendar creation
- Metrics analysis
- Telangana-specific cultural considerations

### Other Module Handlers

- Initial Assessment
- Financial Analysis
- Telangana Market Insights
- Customer Profiling
- Government Schemes

## Configuration

AI services are configured through `config/ai.config.js`, which includes:

- LLM provider settings
- Vector store configuration
- Context management parameters
- Module-specific settings

## Usage

Example of using the enhanced AI services:

```javascript
const llmService = require('./llm.service');
const contextService = require('./context.service');
const vectorService = require('./enhanced-vector.service');

// Process a user message
async function processMessage(message, conversationId, userId) {
  // Get or create context
  const context = contextService.getContext(conversationId);
  
  // Get relevant knowledge
  const relevantContext = await vectorService.getRelevantContext({
    query: message,
    activeModule: context.metadata.activeModule,
    businessProfileId: context.metadata.businessProfileId,
    userId
  });
  
  // Generate response
  const response = await llmService.generateResponse({
    messages: [
      { role: 'system', content: 'You are Shakti Margam AI...' },
      ...context.messages,
      { role: 'user', content: message }
    ],
    cacheKey: `${conversationId}:${message.substring(0, 50)}`
  });
  
  // Update context
  contextService.addMessage(conversationId, { role: 'user', content: message });
  contextService.addMessage(conversationId, { role: 'assistant', content: response.content });
  
  return response;
}
```

## Environment Variables

Required environment variables:

```
# LLM Configuration
OPENAI_API_KEY=your_openai_api_key
LLM_PROVIDER=openai
OPENAI_COMPLETION_MODEL=gpt-4-turbo-preview
OPENAI_EMBEDDING_MODEL=text-embedding-3-small
ENABLE_LLM_CACHE=true
LLM_CACHE_TTL=3600000

# Vector Store Configuration
VECTOR_STORE_PROVIDER=pinecone
PINECONE_API_KEY=your_pinecone_api_key
PINECONE_ENVIRONMENT=your_pinecone_environment
PINECONE_INDEX=your_pinecone_index
DEFAULT_TOP_K=5
ENABLE_RERANKING=true
ENABLE_HYBRID_SEARCH=true

# Context Management
MAX_CONTEXT_SIZE=10
CONTEXT_TTL=3600000
```
