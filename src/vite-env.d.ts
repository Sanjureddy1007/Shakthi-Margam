/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string;
  readonly VITE_SUPABASE_ANON_KEY: string;
  readonly VITE_OPENAI_API_KEY: string;
  readonly VITE_PINECONE_API_KEY: string;
  readonly VITE_PINECONE_ENVIRONMENT: string;
  readonly VITE_PINECONE_INDEX: string;
  readonly VITE_AI_API_ENDPOINT: string;
  readonly VITE_API_KEY: string;
  readonly VITE_AUTH_API_ENDPOINT: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
