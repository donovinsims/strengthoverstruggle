/**
 * Environment Configuration
 * Centralized access to environment variables with type safety
 */

export const ENV = {
  supabase: {
    projectId: import.meta.env.VITE_SUPABASE_PROJECT_ID,
    url: import.meta.env.VITE_SUPABASE_URL,
    publishableKey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
  },
  isDevelopment: import.meta.env.DEV,
  isProduction: import.meta.env.PROD,
} as const;

// Validation function to ensure required env vars are present
export function validateEnv() {
  const required = [
    { key: 'VITE_SUPABASE_URL', value: ENV.supabase.url },
    { key: 'VITE_SUPABASE_PUBLISHABLE_KEY', value: ENV.supabase.publishableKey },
  ];

  const missing = required.filter(({ value }) => !value);

  if (missing.length > 0) {
    console.warn(
      'Missing environment variables:',
      missing.map(({ key }) => key).join(', ')
    );
  }

  return missing.length === 0;
}
