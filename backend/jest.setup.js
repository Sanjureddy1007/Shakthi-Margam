// Set up environment variables for testing
process.env.NODE_ENV = 'test';
process.env.SUPABASE_URL = 'https://test-supabase-url.supabase.co';
process.env.SUPABASE_ANON_KEY = 'test-supabase-anon-key';
process.env.SUPABASE_SERVICE_KEY = 'test-supabase-service-key';
process.env.MONGO_URI = 'mongodb://localhost:27017/shakti_margam_test';
process.env.OPENAI_API_KEY = 'test-openai-api-key';
process.env.PINECONE_API_KEY = 'test-pinecone-api-key';
process.env.PINECONE_ENVIRONMENT = 'test-environment';
process.env.PINECONE_INDEX_NAME = 'test-index';
process.env.FRONTEND_URL = 'http://localhost:3000';

// Mock Supabase
jest.mock('@supabase/supabase-js', () => {
  const mockSupabase = {
    auth: {
      signUp: jest.fn(),
      signInWithPassword: jest.fn(),
      getUser: jest.fn(),
      updateUser: jest.fn(),
      resetPasswordForEmail: jest.fn(),
      signOut: jest.fn(),
      refreshSession: jest.fn()
    },
    from: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    insert: jest.fn().mockReturnThis(),
    update: jest.fn().mockReturnThis(),
    delete: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    single: jest.fn(),
    order: jest.fn().mockReturnThis(),
    range: jest.fn().mockReturnThis()
  };

  return {
    createClient: jest.fn().mockReturnValue(mockSupabase)
  };
});

// Mock MongoDB
jest.mock('mongoose', () => {
  const mockMongoose = {
    connect: jest.fn().mockResolvedValue({}),
    connection: {
      on: jest.fn(),
      once: jest.fn()
    }
  };
  return mockMongoose;
});

// Mock Pinecone
jest.mock('pinecone-client', () => {
  const mockPinecone = {
    index: jest.fn().mockReturnThis(),
    upsert: jest.fn(),
    query: jest.fn(),
    delete: jest.fn(),
    listIndexes: jest.fn(),
    createIndex: jest.fn()
  };

  return {
    Pinecone: jest.fn().mockImplementation(() => mockPinecone)
  };
});

// Mock OpenAI
jest.mock('openai', () => {
  const mockOpenAI = {
    embeddings: {
      create: jest.fn()
    },
    chat: {
      completions: {
        create: jest.fn()
      }
    }
  };

  return {
    OpenAI: jest.fn().mockImplementation(() => mockOpenAI)
  };
});

// Mock Nodemailer
jest.mock('nodemailer', () => {
  const mockTransporter = {
    sendMail: jest.fn().mockResolvedValue({ messageId: 'test-message-id' })
  };

  return {
    createTransport: jest.fn().mockReturnValue(mockTransporter)
  };
});
