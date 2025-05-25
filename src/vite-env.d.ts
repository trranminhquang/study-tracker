/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_UPSTASH_REDIS_REST_URL: string;
  readonly VITE_UPSTASH_REDIS_REST_TOKEN: string;

  readonly VITE_SUPABASE_URL: string;
  readonly VITE_SUPABASE_ANON_KEY: string;

  readonly VITE_GOOGLE_ANALYTICS_ID?: string;
}