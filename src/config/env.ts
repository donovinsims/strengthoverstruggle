const sanitizeEnvValue = (value: unknown): string | undefined => {
  if (typeof value !== "string") {
    return undefined;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
};

export const ENV = {
  donationUrl: sanitizeEnvValue(import.meta.env.VITE_DONATION_URL),
  datafastWebsiteId: sanitizeEnvValue(import.meta.env.VITE_DATAFAST_WEBSITE_ID),
  datafastDomain: sanitizeEnvValue(import.meta.env.VITE_DATAFAST_DOMAIN),
} as const;

export type EnvConfig = typeof ENV;
