# Shakti Margam Supabase Backend Setup

This document provides instructions for setting up the Supabase backend for the Shakti Margam application.

## Prerequisites

- A Supabase account (sign up at [supabase.com](https://supabase.com))
- Access to the Supabase project dashboard

## Setup Instructions

### 1. Create a New Supabase Project

1. Log in to your Supabase account
2. Click "New Project"
3. Enter a name for your project (e.g., "Shakti Margam")
4. Choose a database password (save this for future reference)
5. Choose a region closest to your users (e.g., "Asia Pacific (Mumbai)" for Telangana users)
6. Click "Create new project"

### 2. Set Up Database Schema

1. In your Supabase project dashboard, navigate to the "SQL Editor" section
2. Click "New Query"
3. Copy and paste the contents of the `schema.sql` file in this directory
4. Click "Run" to execute the SQL and create the necessary tables and policies

### 3. Configure Authentication

1. Navigate to the "Authentication" section in your Supabase dashboard
2. Under "Settings" > "Email", configure the following:
   - Enable "Enable Email Signup"
   - Configure "Site URL" to match your frontend application URL
   - Customize email templates if desired
3. Under "Settings" > "Email Templates", customize the email templates for:
   - Confirmation
   - Invitation
   - Magic Link
   - Reset Password

### 4. Set Up Environment Variables

1. In your frontend application, create or update the `.env` file with your Supabase credentials:
   ```
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   ```
2. Replace `your-project-id` and `your-anon-key` with the values from your Supabase project dashboard (found under "Settings" > "API")

### 5. Test the Connection

1. Run your frontend application
2. Try to register a new user
3. Verify that the user is created in the Supabase Auth dashboard
4. Verify that a corresponding profile is created in the "profiles" table

## Database Schema

The Supabase backend includes the following tables:

### profiles
- Stores user profile information
- Created automatically when a new user signs up
- Contains fields for name, email, phone number, district, city, etc.

### chat_messages
- Stores all chat messages between users and the AI assistant
- Each message is linked to a user and a specific module
- Includes a flag to indicate whether the message is from the user or the assistant

### user_preferences
- Stores user preferences such as theme, language, notification settings, etc.
- Created automatically when a new user signs up

### business_profiles
- Stores information about users' businesses
- Can be created and updated by users

## Security

The database is secured using Row Level Security (RLS) policies:

- Users can only access their own data
- Authentication is required for all operations
- API keys are restricted to specific operations

## Troubleshooting

If you encounter issues with the Supabase setup:

1. Check that the SQL schema was executed successfully
2. Verify that RLS policies are enabled
3. Ensure that environment variables are set correctly
4. Check the browser console for any API errors

For more help, refer to the [Supabase documentation](https://supabase.com/docs).
