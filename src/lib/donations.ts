import { APP_CONFIG } from "@/config/app.config";

export const getDonationUrl = (): string | undefined => {
  const url = APP_CONFIG.externalUrls.donationStripe;
  if (typeof url !== "string") {
    return undefined;
  }

  const trimmed = url.trim();
  return trimmed.length > 0 ? trimmed : undefined;
};

export const hasDonationUrl = (): boolean => Boolean(getDonationUrl());

export const openDonationLink = (): boolean => {
  const url = getDonationUrl();
  if (!url || typeof window === "undefined") {
    return false;
  }

  window.open(url, "_blank", "noopener,noreferrer");
  return true;
};
