# Shakti Margam - The Path of Empowerment

Shakti Margam is an AI-powered platform designed to support women entrepreneurs in Telangana, India. The platform provides personalized guidance, resources, and tools to help women start and grow their businesses.

## Features

- **AI Assistant**: Conversational AI assistant that provides personalized business guidance
- **Knowledge Base**: Comprehensive database of Telangana-specific business resources
- **Module-based Support**: Specialized modules for different aspects of entrepreneurship
- **Admin Dashboard**: Powerful tools for monitoring and managing the platform
- **Data Visualization**: Interactive visualizations for business metrics and market trends
- **Social Media Analytics**: Tools to track and optimize social media performance
- **User Management**: Comprehensive user management system
- **Content Management**: Tools to manage and update platform content
- **Response Moderation**: Quality control for AI-generated responses

## Technology Stack

- **Frontend**: React, TypeScript, TailwindCSS
- **Backend**: Node.js, Express
- **Database**: Supabase (PostgreSQL)
- **AI**: OpenAI API integration
- **Vector Database**: Pinecone for knowledge retrieval
- **Authentication**: JWT-based authentication
- **Visualization**: Recharts for data visualization

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)
- OpenAI API key
- Pinecone API key and environment

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/your-username/shakti-margam.git
   cd shakti-margam
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file in the root directory based on the `.env.example` file:
   ```
   # API Endpoints
   VITE_API_ENDPOINT=http://localhost:3000/api

   # Supabase Configuration
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

   # OpenAI Configuration
   VITE_OPENAI_API_KEY=your_openai_api_key

   # Feature Flags
   VITE_ENABLE_GUEST_MODE=true
   VITE_ENABLE_TELANGANA_INSIGHTS=true
   ```

4. Start the development server:
   ```
   npm start
   ```

   Alternatively, on Windows, you can use the provided batch file:
   ```
   run-local.bat
   ```

5. Open your browser and navigate to `http://localhost:3000`

### Knowledge Base Population

To populate the knowledge base with Telangana-specific content:

1. Ensure you have the required API keys in your `.env` file
2. Run the knowledge base populator:
   ```
   node src/utils/knowledgeBasePopulator.js
   ```

This will process the data in the `src/data` directory and upload it to your vector database.

## Project Structure

```
shakti-margam/
├── docs/                    # Documentation files
├── public/                  # Public assets
├── src/
│   ├── components/          # React components
│   │   ├── admin/           # Admin dashboard components
│   │   ├── assistant/       # AI assistant components
│   │   │   └── renderers/   # Structured response renderers
│   │   └── visualizations/  # Data visualization components
│   ├── context/             # React context providers
│   ├── controllers/         # Controller logic
│   ├── data/                # Knowledge base data
│   │   ├── business-guides/ # Business guides data
│   │   ├── government-schemes/ # Government schemes data
│   │   ├── market-data/     # Market data
│   │   └── success-stories/ # Success stories data
│   ├── layouts/             # Page layout components
│   ├── models/              # Data models
│   ├── pages/               # Page components
│   ├── services/            # API and service functions
│   │   ├── ai/              # AI service components
│   │   ├── api/             # API service functions
│   │   ├── auth/            # Authentication services
│   │   └── supabase/        # Supabase integration
│   ├── styles/              # Global styles
│   └── types/               # TypeScript type definitions
├── .env.example             # Example environment variables
├── package.json             # Project dependencies
├── vercel.json              # Vercel deployment configuration
└── tsconfig.json            # TypeScript configuration
```

## Admin Dashboard

The admin dashboard provides tools for managing and monitoring the platform:

1. **Analytics**: View platform usage metrics and performance data
2. **User Management**: Manage user accounts and permissions
3. **Content Management**: Update and manage platform content
4. **Response Moderation**: Review and moderate AI-generated responses
5. **Social Media Analytics**: Track social media performance metrics
6. **Market Trends**: Visualize market trends and opportunities
7. **System Settings**: Configure platform settings and integrations

To access the admin dashboard, navigate to `/admin` after logging in with an admin account.

## AI Assistant Modules

The AI assistant provides specialized guidance through various modules:

1. **Initial Assessment**: Evaluate business readiness and identify opportunities
2. **Social Media Strategy**: Develop effective social media marketing plans
3. **Financial Analysis**: Financial planning and management guidance
4. **Telangana Market Insights**: Local market data and opportunities
5. **Customer Profiling**: Identify and understand target customers
6. **Government Schemes**: Navigate available government support programs

## Contributing

We welcome contributions to Shakti Margam! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## WE-HUB Integration

Shakti Margam is designed as a WE-HUB initiative to support women entrepreneurs in Telangana. The integration includes:

1. **WE-HUB Branding**: The splash screen prominently displays WE-HUB branding
2. **Resource Integration**: Direct links to WE-HUB programs and resources
3. **Telangana Focus**: Content specifically tailored to the Telangana ecosystem
4. **Complementary Services**: Integration with existing WE-HUB services

## Deployment

Shakti Margam is configured for deployment on Vercel. The `vercel.json` file in the root directory contains the necessary configuration for deployment. For detailed deployment instructions, see the [deployment guide](docs/deployment_environment_variables.md).

## Documentation

Comprehensive documentation is available in the `docs` directory:

- [Demo Preparation Guide](docs/demo_preparation.md): Guide for demonstrating the platform
- [Sample Data Guide](docs/sample_data_guide.md): Information about sample data for demonstration
- [Project Cleanup Guide](docs/project_cleanup_guide.md): Guidelines for maintaining a clean project
- [Deployment Environment Variables](docs/deployment_environment_variables.md): Guide for configuring environment variables

## Acknowledgments

- Government of Telangana for supporting women entrepreneurship initiatives
- WE-Hub for providing valuable insights on women entrepreneurs' needs
- All the women entrepreneurs who provided feedback during development
