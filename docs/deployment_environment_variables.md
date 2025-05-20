# Shakti Margam Deployment Environment Variables

This document outlines the environment variables required for deploying the Shakti Margam application to Vercel.

## Required Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_SUPABASE_URL` | The URL of your Supabase project | `https://xyzproject.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | The anonymous key for your Supabase project | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` |
| `VITE_API_ENDPOINT` | The endpoint for the backend API | `https://api.shaktimargam.com` or `/api` for same-domain deployment |
| `VITE_OPENAI_API_KEY` | OpenAI API key for AI functionality | `sk-...` |

## Setting Up Environment Variables in Vercel

1. Go to your project in the Vercel dashboard
2. Navigate to Settings > Environment Variables
3. Add each of the required variables with their corresponding values
4. Ensure that the variables are added to all environments (Production, Preview, Development)

## Local Development Environment

For local development, create a `.env` file in the root directory with the following content:

```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_API_ENDPOINT=your_api_endpoint
VITE_OPENAI_API_KEY=your_openai_api_key
```

**Important:** Never commit the `.env` file to version control. It is already included in `.gitignore`.

## Vercel Deployment Configuration

The `vercel.json` file in the root directory contains the configuration for deploying the application to Vercel. It includes:

- Build configuration for the React application
- Route handling for static assets and SPA routing
- Environment variable references

## Supabase Configuration

Ensure that your Supabase project has the following configurations:

1. Authentication enabled with Email/Password provider
2. Database tables created according to the schema
3. Storage buckets configured for user uploads
4. Row-level security policies implemented for data protection

## Testing the Deployment

After deploying to Vercel, verify that:

1. The application loads correctly
2. Authentication works (login, register, password reset)
3. The AI assistant responds appropriately
4. All features are functional

## Troubleshooting

If you encounter issues with the deployment, check:

1. Environment variables are correctly set in Vercel
2. Build logs for any errors
3. Network requests in the browser console
4. Supabase dashboard for any authentication or database issues

For specific error messages, refer to the troubleshooting section in the main documentation.
