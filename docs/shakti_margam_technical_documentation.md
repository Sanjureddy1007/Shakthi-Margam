# Shakti Margam: Technical Documentation

## 1. Executive Summary

Shakti Margam is an AI-powered assistant platform specifically designed for women entrepreneurs in Telangana, India. The platform serves as a comprehensive business guidance system, providing personalized support across multiple domains including business assessment, social media strategy, cash flow management, and Telangana-specific market insights.

The assistant employs a modular architecture, leveraging advanced language models enhanced with retrieval-augmented generation and domain-specific knowledge to deliver contextually relevant advice. Core features include a 4Cs framework (Captivate, Cultivate, Convince, Convert) for social media strategy development, SHAKTI framework for cash flow management, and integration of Telangana-specific resources and market insights.

Shakti Margam is implemented as a web application built with React, TypeScript, and TailwindCSS, with a modular AI backend designed for extensibility and context-awareness. The platform supports both English and Telugu languages to maximize accessibility for women entrepreneurs throughout Telangana.

## 2. System Architecture

### 2.1 High-Level Architecture Overview

Shakti Margam follows a modular, layered architecture pattern:

```
┌─────────────────────────────────────────────────┐
│                  Frontend Layer                  │
│ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ │
│ │    Pages    │ │ Components  │ │ Context &   │ │
│ │             │ │             │ │   Hooks     │ │
│ └─────────────┘ └─────────────┘ └─────────────┘ │
└───────────────────────┬─────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────┐
│                Controller Layer                  │
│ ┌─────────────────────────────────────────────┐ │
│ │              AIController.ts                │ │
│ └─────────────────────────────────────────────┘ │
└───────────────────────┬─────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────┐
│                 Core AI Layer                    │
│ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ │
│ │ShaktiMargam │ │ Knowledge   │ │ Module      │ │
│ │ AIEngine    │ │ Management  │ │ Registry    │ │
│ └─────────────┘ └─────────────┘ └─────────────┘ │
└───────────────────────┬─────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────┐
│               Knowledge Layer                    │
│ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ │
│ │ Vector      │ │ Structured  │ │ External    │ │
│ │ Store       │ │ Knowledge   │ │ APIs        │ │
│ └─────────────┘ └─────────────┘ └─────────────┘ │
└─────────────────────────────────────────────────┘
```

### 2.2 Core AI Engine Components

#### 2.2.1 ShaktiMargamAIEngine.ts

The `ShaktiMargamAIEngine` class serves as the central coordinator for all AI functionality in Shakti Margam. It handles:

- Message processing and module routing
- Knowledge retrieval coordination
- Reasoning strategy selection
- Response generation through module handlers
- Conversation context management

Key methods include:
- `processMessage()`: Main entry point for handling user queries
- `determineModuleForQuery()`: Identifies appropriate module based on message content
- `retrieveKnowledge()`: Gathers relevant knowledge from various sources
- `selectReasoningStrategy()`: Selects appropriate reasoning approach based on query complexity
- `generateResponse()`: Coordinates response generation using module-specific logic

The engine implements a sophisticated domain detection system that analyzes message content to route queries to appropriate modules:
- Social media-related queries → social-media-strategy module
- Financial queries → cash-flow-management module
- Market-related queries → market-insights module
- Initial conversations → initial-assessment module

#### 2.2.2 KnowledgeBase.ts

The `KnowledgeBase` class manages structured knowledge across domains relevant to women entrepreneurs in Telangana:

- Business knowledge (general entrepreneurship principles)
- Financial knowledge (cash flow management, funding, etc.)
- Social media knowledge (platform strategies, content creation)
- Market insights (Telangana-specific industry data)
- Telangana policies (government regulations, incentives)
- Funding opportunities (grants, loans, investment sources)

Key methods include:
- `getIndustrySpecificKnowledge()`: Retrieves knowledge related to specific industries
- `getModuleKnowledge()`: Gets knowledge specific to a particular module
- `getFundingOpportunities()`: Retrieves funding sources filtered by business stage/industry
- `getTelanganaPolicies()`: Accesses Telangana-specific policies and regulations

#### 2.2.3 VectorStore.ts

The `VectorStore` class implements vector-based similarity search for finding relevant information based on natural language queries:

- Stores document vectors with metadata (source, category, tags, language)
- Provides semantic search capabilities for knowledge retrieval
- Supports multilingual search (English and Telugu)
- Includes document metadata to aid in source attribution and filtering

The implementation includes interfaces for:
- `VectorDocument`: Structure for storing document vectors with metadata
- `SearchResult`: Structure for returning search results with similarity scores

#### 2.2.4 ModuleRegistry.ts

The `ModuleRegistry` class manages module handlers for different domains:

- Maintains a registry of available AI modules
- Provides dynamic access to appropriate modules for specific tasks
- Facilitates module loading and registration
- Enables extensibility through a consistent module interface

Core functionality includes:
- `registerModule()`: Adds module handlers to the registry
- `getModuleHandler()`: Retrieves the appropriate handler for a module ID
- `getModuleIds()`: Lists all registered modules
- `getModuleKnowledge()`: Obtains module-specific knowledge

### 2.3 Business Data Models

#### 2.3.1 BusinessProfile.ts

The `BusinessProfile` interface defines a comprehensive data model for storing entrepreneur business information:

- Basic business details (name, description, industry, stage)
- Location information (district, city, pincode)
- Team information (size, employment status)
- Financial details (revenue, expenses, funding status)
- Social media presence (platforms, followers, engagement)
- Products and services (offerings, price range, production type)
- Customer information (target segments, demographics)
- Business challenges and goals
- Telangana-specific information (government scheme usage, associations)

This model serves as the foundation for personalized guidance, allowing the AI to tailor advice based on the specific characteristics and needs of each business.

### 2.4 API Controllers

#### 2.4.1 AIController.ts

The `AIController` class serves as the interface between the frontend and the AI engine:

- Processes incoming message requests
- Manages conversation context
- Retrieves business profiles when needed
- Handles error states and provides graceful degradation

Key methods include:
- `processMessage()`: Main entry point for processing user messages
- `getConversationContext()`: Retrieves or creates conversation context
- `updateConversationContext()`: Updates context after processing
- `getBusinessProfile()`: Retrieves business profile by ID

The controller maintains a singleton instance of the `ShaktiMargamAIEngine` to ensure consistent state across requests.

### 2.5 Frontend Integration

#### 2.5.1 AIAssistantProvider.tsx

The `AIAssistantProvider` component creates a React context for AI assistant functionality:

- Manages conversation state (messages, processing status)
- Provides methods for sending messages and clearing conversations
- Handles module selection and business profile association
- Displays appropriate UI states (loading, error, success)

Key features include:
- Message history management
- Processing state indicators
- Module switching capability
- Business profile integration
- Conversation persistence

## 3. Module Documentation

### 3.1 Social Media Strategy Module (4Cs Framework)

The social media strategy module implements the 4Cs framework (Captivate, Cultivate, Convince, Convert) to help women entrepreneurs develop effective social media strategies.

#### 3.1.1 Module Components

- `FourCsStrategyBuilder.tsx`: UI component for building 4Cs strategies
- Module handler implementation that processes social media queries
- Knowledge sources specific to social media strategy

#### 3.1.2 Framework Implementation

1. **Captivate**:
   - Audience identification and targeting
   - Attention-grabbing content creation
   - Brand personality development
   - Visual identity establishment

2. **Cultivate**:
   - Relationship building strategies
   - Engagement techniques
   - Community development
   - Consistent posting schedules

3. **Convince**:
   - Trust-building content
   - Testimonial and review integration
   - Product/service showcasing
   - Value proposition communication

4. **Convert**:
   - Call-to-action optimization
   - Sales funnel development
   - Direct response techniques
   - Conversion tracking and analysis

#### 3.1.3 Platform-Specific Strategies

The module provides tailored strategies for platforms most relevant to Telangana women entrepreneurs:
- Instagram
- Facebook
- YouTube
- WhatsApp Business
- LinkedIn

### 3.2 Cash Flow Management Module (SHAKTI Framework)

The cash flow management module implements the SHAKTI framework to help women entrepreneurs manage their business finances effectively.

#### 3.2.1 Module Components

- Cash flow analysis tools
- Module handler implementation for financial queries
- Knowledge sources specific to financial management

#### 3.2.2 Framework Implementation

The SHAKTI framework consists of:

1. **S - Secure Revenue Streams**:
   - Revenue diversification
   - Customer retention strategies
   - Subscription and recurring revenue models
   - Advance payment incentives

2. **H - Handle Expenses Wisely**:
   - Cost reduction strategies
   - Expense categorization and prioritization
   - Vendor negotiation techniques
   - Resource optimization

3. **A - Anticipate Cash Flow Gaps**:
   - Cash flow forecasting
   - Seasonal variation management
   - Emergency fund establishment
   - Early warning system for cash constraints

4. **K - Keep Accurate Records**:
   - Bookkeeping best practices
   - Digital record-keeping tools
   - Invoice and receipt management
   - Financial statement preparation

5. **T - Track Key Metrics**:
   - Cash flow KPI monitoring
   - Profitability analysis
   - Working capital optimization
   - Customer acquisition cost tracking

6. **I - Implement Growth Strategies**:
   - Reinvestment planning
   - Sustainable growth rates
   - Funding source identification
   - Expansion timing optimization

### 3.3 Telangana-Specific Resources and Market Insights

This module provides specialized information about the Telangana market and resources available to women entrepreneurs in the region.

#### 3.3.1 Module Components

- `TelanganaMarketInsightsPanel.tsx`: UI component for displaying market insights
- Module handler implementation for Telangana-specific queries
- Knowledge sources focused on regional information

#### 3.3.2 Implemented Features

1. **Industry Insights**:
   - Growth potential assessment
   - Opportunity identification
   - Challenge analysis
   - Success strategies
   - Resource connections

2. **Market Trends**:
   - Emerging trend identification
   - Impact assessment
   - Application guidance
   - Industry relevance mapping

3. **Regional Regulations**:
   - Policy summaries
   - Compliance requirements
   - Business type relevance
   - Department contact information

4. **Success Stories**:
   - Telangana women entrepreneur profiles
   - Challenge-solution narratives
   - Industry-specific success examples
   - Practical advice from local entrepreneurs

5. **Resource Directory**:
   - Government initiatives (WE-HUB, TSWDC)
   - Financial resources (Stree Nidhi)
   - Skill development programs (TASK)
   - Startup support services

## 4. Implementation Details

### 4.1 Web Interface Components

#### 4.1.1 Core Components

- `ChatInterface.tsx`: Main conversational interface for interacting with the AI
- `ModuleSelector.tsx`: Component for selecting different assistant modules
- `AssessmentForm.tsx`: Gathers business information for profile creation
- `SuccessfulStrategyTemplates.tsx`: Displays successful strategies for reference

#### 4.1.2 Module-Specific Components

- `SocialMediaMetricsDashboard.tsx`: Visualizes social media performance
- `FourCsStrategyBuilder.tsx`: Interface for building 4Cs social media strategies
- `TelanganaMarketInsightsPanel.tsx`: Displays Telangana-specific market information

### 4.2 Data Flow Architecture

```
┌───────────┐    ┌────────────┐    ┌────────────────┐
│  User     │───>│ React      │───>│ AIAssistant    │
│  Input    │    │ Components │    │ Provider       │
└───────────┘    └────────────┘    └───────┬────────┘
                                           │
                                           ▼
┌───────────────────┐    ┌───────────────────────┐
│ API Response      │<───┤ AIController          │
│ (To Frontend)     │    │ (Controller Layer)    │
└───────────────────┘    └───────────┬───────────┘
                                     │
                                     ▼
┌────────────────┐    ┌──────────────────────────┐
│ Module         │<───┤ ShaktiMargamAIEngine     │
│ Registry       │    │ (Core AI Processing)     │
└────┬───────────┘    └──────────────┬───────────┘
     │                               │
     ▼                               ▼
┌────────────────┐    ┌──────────────────────────┐
│ Module         │    │ Knowledge Retrieval      │
│ Handlers       │    │ (KnowledgeBase/Vector)   │
└────────────────┘    └──────────────────────────┘
```

1. User input flows from React components to the AIAssistantProvider
2. The provider sends requests to the AIController
3. AIController processes the request using the ShaktiMargamAIEngine
4. The engine determines the appropriate module and retrieves relevant knowledge
5. Module-specific handlers generate responses using the knowledge
6. Responses flow back through the controller to the frontend
7. Frontend components update to display the response

### 4.3 Integration of Telangana-Specific Elements

#### 4.3.1 Data Integration

Telangana-specific data is integrated through:

- `telangana-market-insights.ts`: Industry insights, market trends, regulations
- `telangana-funding.ts`: Funding opportunities specific to Telangana
- `telangana-resources-integration.ts`: Regional resources and support programs

#### 4.3.2 Cultural Integration

The system incorporates Telangana cultural elements:

- Recognition of local festivals and events
- References to regional success stories
- Integration of Telangana handicrafts terminology (Pochampally Ikat, etc.)
- Contextual understanding of local business challenges

#### 4.3.3 Component Integration

Telangana elements are integrated into UI components:

- `TelanganaMarketInsightsPage.tsx`: Dedicated page for regional insights
- Regional success stories in testimonials
- Visual design elements inspired by Telangana cultural motifs

### 4.4 Telugu Language Support

Telugu language support is implemented through:

- Multilingual interface elements with language toggle
- Language detection in user queries
- Telugu-language knowledge sources in the vector store
- Metadata tagging of content with language information ('english', 'telugu', 'both')
- Stored content translations for key information

## 5. Development Environment Setup

### 5.1 Prerequisites

- Node.js v18.0.0 or higher
- PNPM package manager
- Git

### 5.2 Environment Setup Steps

1. Clone the repository:
   ```bash
   git clone https://github.com/shakti-margam/shakti-margam.git
   cd shakti-margam
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Configure environment variables:
   ```bash
   cp .env.example .env.local
   ```
   
   Edit `.env.local` with appropriate configuration values:
   ```
   VITE_AI_API_ENDPOINT=http://localhost:3000/api/ai
   VITE_API_KEY=your_api_key_here
   ```

4. Start the development server:
   ```bash
   pnpm dev
   ```

5. Access the application:
   Open `http://localhost:5173` in your web browser

### 5.3 Development Tools

- **Build System**: Vite
- **UI Framework**: React with TypeScript
- **Styling**: TailwindCSS
- **Component Library**: Shadcn/UI
- **State Management**: React Context API
- **Testing**: Vitest + React Testing Library
- **Linting**: ESLint with TypeScript preset
- **Code Formatting**: Prettier

### 5.4 Project Structure

```
/src
  /components       # UI components
    /assistant      # AI assistant-specific components
    /home           # Homepage components
    /resources      # Resource directory components
    /shared         # Shared components (header, footer)
    /ui             # Base UI components
  /context          # React context providers
  /controllers      # API controllers
  /data             # Static data files
  /features         # Feature-specific code
    /social-media   # Social media module
    /cash-flow      # Cash flow management module
  /hooks            # Custom React hooks
  /layouts          # Page layout components
  /lib              # Utility libraries
  /models           # Data models
  /pages            # Page components
  /services         # Service implementations
    /ai             # AI-related services
      /types        # Type definitions
  /types            # TypeScript type definitions
  /utils            # Utility functions
```

## 6. Deployment Guide

### 6.1 Production Build

1. Create a production build:
   ```bash
   pnpm build
   ```

2. The build output will be in the `dist/` directory

### 6.2 Deployment Options

#### 6.2.1 Static Hosting

For static hosting (e.g., Netlify, Vercel):

1. Configure environment variables in the hosting platform
2. Connect repository for CI/CD deployment
3. Configure build command: `pnpm build`
4. Configure output directory: `dist`

#### 6.2.2 Traditional Server Deployment

For traditional server deployment:

1. Copy the contents of the `dist/` directory to your web server
2. Configure server to serve static files
3. Configure server to handle API requests
4. Set up HTTPS with a valid SSL certificate

### 6.3 Environment Configuration

Production environment variables:

```
VITE_AI_API_ENDPOINT=https://api.shaktimargam.org/api/ai
VITE_API_KEY=your_production_api_key
```

### 6.4 Monitoring and Maintenance

1. Set up application monitoring:
   - Error tracking (e.g., Sentry)
   - Performance monitoring (e.g., New Relic)
   - Analytics (e.g., Google Analytics)

2. Establish regular maintenance tasks:
   - Knowledge base updates
   - Model fine-tuning with new data
   - User feedback incorporation

## 7. System Dependencies

### 7.1 Frontend Dependencies

- React: UI framework
- TypeScript: Type-safe JavaScript
- TailwindCSS: Utility-first CSS framework
- Shadcn/UI: Component library
- Vite: Build tool

### 7.2 AI Dependencies

- Vector database (e.g., Pinecone, Weaviate)
- Language model API (e.g., OpenAI)
- Embeddings generation API
- Knowledge base storage

## 8. Security Considerations

### 8.1 Data Protection

- User data encryption in transit and at rest
- Sanitization of user inputs
- Access control for sensitive business information
- Compliance with Indian data protection regulations

### 8.2 API Security

- API authentication using secure tokens
- Rate limiting to prevent abuse
- Input validation and sanitization
- CORS configuration for API endpoints

### 8.3 Content Security

- Moderation of user inputs
- Content filtering for sensitive information
- Safe storage of business profiles

## 9. Future Development Roadmap

### 9.1 Short-term Enhancements

- Enhanced Telugu language support
- Additional business sectors coverage
- Mobile app development
- Offline capabilities for rural areas

### 9.2 Long-term Vision

- Integration with government services
- Advanced predictive analytics
- Expanded network of mentors
- Cross-border market expansion guidance

## 10. Appendix

### 10.1 API Reference

Detailed documentation of available API endpoints:

- `/api/ai/message` - Process user messages
- `/api/profiles` - Manage business profiles
- `/api/resources` - Access Telangana-specific resources

### 10.2 Module Integration Guide

Instructions for developing and integrating new modules:

1. Define module interface and knowledge requirements
2. Implement module handler with appropriate reasoning logic
3. Create UI components for interactive features
4. Register module with the ModuleRegistry
5. Add module-specific knowledge to the KnowledgeBase

### 10.3 Glossary

- **4Cs Framework**: Captivate, Cultivate, Convince, Convert
- **SHAKTI Framework**: Secure revenue, Handle expenses, Anticipate gaps, Keep records, Track metrics, Implement growth
- **RAG**: Retrieval Augmented Generation
- **WE-HUB**: Women Entrepreneurs Hub (Telangana government initiative)