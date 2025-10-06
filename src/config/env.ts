/**
 * Environment Configuration
 * Centralized access to environment variables with type safety
 */

const sanitizeEnvValue = (value: string | undefined) =>
  value && value.trim().length > 0 ? value : undefined;

const SUPABASE_PROJECT_ID = sanitizeEnvValue(import.meta.env.VITE_SUPABASE_PROJECT_ID);
const SUPABASE_URL = sanitizeEnvValue(import.meta.env.VITE_SUPABASE_URL);
const SUPABASE_PUBLISHABLE_KEY = sanitizeEnvValue(import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY);

export const ENV = {
  supabase: {
    projectId: SUPABASE_PROJECT_ID,
    url: SUPABASE_URL,
    publishableKey: SUPABASE_PUBLISHABLE_KEY,
    isConfigured: Boolean(SUPABASE_URL && SUPABASE_PUBLISHABLE_KEY),
  },
  isDevelopment: import.meta.env.DEV,
  isProduction: import.meta.env.PROD,
} as const;

// Validation function to ensure required env vars are present
export function validateEnv() {
  if (!ENV.supabase.isConfigured) {
    console.warn(
      'Supabase environment variables are not fully configured. Some Supabase features will be disabled.'
    );
    return false;
  }

  return true;
}
