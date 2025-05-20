# Shakti Margam Backend API

This is the backend API for the Shakti Margam application, an AI-powered assistant for women entrepreneurs in Telangana.

## Features

- AI-powered business assessment and guidance
- User authentication and profile management
- Business profile creation and management
- Conversation history and context management
- Integration with OpenAI for natural language processing
- Vector database for knowledge retrieval with Pinecone
- Module-based architecture for specialized business domains
- Email notifications with customizable templates
- Newsletter subscription management
- Contact form handling
- Rate limiting for API security

## Tech Stack

- Node.js
- Express.js
- Supabase (for authentication and structured data)
- MongoDB (for unstructured data)
- Pinecone (for vector embeddings and similarity search)
- OpenAI API integration
- Nodemailer for email notifications

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- Supabase account (for authentication and structured data)
- MongoDB
- Pinecone account (for vector database)
- OpenAI API key
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   ```
   cd backend
   npm install
   ```
3. Create a `.env` file based on `.env.example`
4. Set up the databases:
   - Create a Supabase project at [supabase.com](https://supabase.com)
   - Create MongoDB database named `shakti_margam`
   - Create a Pinecone index named `shakti-margam-index` with dimension 1536
5. Set up Supabase schema:
   - Run the SQL script in `src/scripts/supabase-schema.sql` in the Supabase SQL editor

### Environment Variables

Make sure to set the following environment variables in your `.env` file:

```
# Server Configuration
PORT=3000
NODE_ENV=development

# Supabase Configuration
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_KEY=your_supabase_service_key

# MongoDB Configuration
MONGO_URI=mongodb://localhost:27017/shakti_margam

# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key
OPENAI_EMBEDDING_MODEL=text-embedding-ada-002
OPENAI_COMPLETION_MODEL=gpt-4-turbo-preview

# Pinecone Configuration
PINECONE_API_KEY=your_pinecone_api_key
PINECONE_ENVIRONMENT=your_pinecone_environment
PINECONE_INDEX_NAME=shakti-margam-index

# Email Configuration (optional)
EMAIL_HOST=smtp.example.com
EMAIL_PORT=587
EMAIL_USER=your_email@example.com
EMAIL_PASSWORD=your_email_password
EMAIL_FROM=Shakti Margam <noreply@shaktimargam.org>

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Frontend URL (for password reset links)
FRONTEND_URL=http://localhost:3000
```

### Seeding the Database

To seed the vector database with Telangana-specific business resources:

```
npm run seed:vector
```

To seed the PostgreSQL database with initial data:

```
npm run seed
```

### Running the Server

Development mode:
```
npm run dev
```

Production mode:
```
npm start
```

## API Documentation

### Authentication Endpoints

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/refresh-token` - Refresh access token
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/update-details` - Update user details
- `PUT /api/auth/update-password` - Update password
- `POST /api/auth/logout` - Logout user

### AI Endpoints

- `POST /api/ai/message` - Process a message (public demo)
- `POST /api/ai/conversations` - Create a new conversation
- `GET /api/ai/conversations` - Get all conversations
- `GET /api/ai/conversations/:id` - Get a single conversation
- `DELETE /api/ai/conversations/:id` - Delete a conversation
- `POST /api/ai/conversations/:id/messages` - Add a message to a conversation
- `POST /api/ai/modules/:moduleId/analyze` - Analyze with a specific module
- `POST /api/ai/newsletter` - Subscribe to newsletter
- `POST /api/ai/contact` - Submit contact form

### Profile Endpoints

- `POST /api/profiles` - Create a new business profile
- `GET /api/profiles` - Get all business profiles
- `GET /api/profiles/:id` - Get a single business profile
- `PUT /api/profiles/:id` - Update a business profile
- `DELETE /api/profiles/:id` - Delete a business profile
- `POST /api/profiles/:id/assessment` - Submit business assessment
- `GET /api/profiles/:id/assessment` - Get business assessment
- `PUT /api/profiles/:id/assessment` - Update business assessment
- `GET /api/profiles/:id/analytics` - Get business analytics
- `GET /api/profiles/:id/recommendations` - Get business recommendations

### Resource Endpoints

- `GET /api/resources/public` - Get public resources
- `GET /api/resources/public/:category` - Get public resources by category
- `GET /api/resources/public/search` - Search public resources
- `GET /api/resources/wehub` - Get WE-HUB resources
- `GET /api/resources/wehub/:category` - Get WE-HUB resources by category
- `GET /api/resources/government-schemes` - Get government schemes
- `GET /api/resources/government-schemes/:id` - Get government scheme details
- `GET /api/resources` - Get user resources
- `GET /api/resources/recommended` - Get recommended resources
- `POST /api/resources/save/:id` - Save a resource
- `DELETE /api/resources/save/:id` - Unsave a resource
- `GET /api/resources/saved` - Get saved resources
- `GET /api/resources/templates` - Get business templates
- `GET /api/resources/templates/:id` - Get business template details
- `GET /api/resources/market-insights` - Get market insights
- `GET /api/resources/market-insights/:category` - Get market insights by category

## Project Structure

```
backend/
├── src/
│   ├── config/         # Configuration files
│   │   ├── database.js        # MongoDB connection
│   │   └── supabase.js        # Supabase client
│   ├── controllers/    # Route controllers
│   ├── middleware/     # Middleware functions
│   ├── models/         # Database models
│   │   └── mongodb/    # MongoDB models
│   ├── routes/         # API routes
│   ├── services/       # Business logic
│   │   ├── modules/    # Module handlers
│   │   ├── openai.service.js    # OpenAI integration
│   │   ├── pinecone.service.js  # Pinecone vector DB integration
│   │   ├── vector.service.js    # Vector search service
│   │   ├── email.service.js     # Email service
│   │   ├── newsletter.service.js # Newsletter service
│   │   ├── contact.service.js   # Contact form service
│   │   ├── supabase-auth.service.js # Supabase auth service
│   │   ├── business-profile.service.js # Business profile service
│   │   └── conversation.service.js # Conversation service
│   ├── scripts/        # Database seeding scripts
│   │   ├── seedDatabase.js    # Seed initial data
│   │   ├── seedVectorStore.js # Seed vector database
│   │   ├── supabase-schema.sql # Supabase schema
│   │   └── migrateToSupabase.js # Migration script
│   ├── utils/          # Utility functions
│   └── server.js       # Server entry point
├── logs/               # Log files
├── .env                # Environment variables
├── .env.example        # Example environment variables
└── package.json        # Dependencies and scripts
```

## Vector Database Integration

The backend uses Pinecone for vector database functionality:

1. Text from Telangana-specific business resources is processed and chunked
2. OpenAI's embedding model converts text chunks into vector embeddings
3. Embeddings are stored in Pinecone for efficient similarity search
4. When a user asks a question, the query is converted to an embedding
5. Pinecone finds the most relevant content based on vector similarity
6. Retrieved context is used to generate accurate, contextual responses

## Supabase Integration

The backend uses Supabase for authentication and structured data storage:

1. User authentication with email/password
2. Row-level security for data access control
3. Real-time subscriptions for chat functionality
4. Structured data storage for user profiles, business profiles, and conversations
5. Password reset and account management

## Error Handling and Fallbacks

The system includes robust error handling:

- Fallback to MongoDB if Pinecone is unavailable
- Graceful degradation for OpenAI API failures
- Mock email service if email configuration is missing
- Comprehensive logging for debugging and monitoring

## License

This project is licensed under the MIT License.
