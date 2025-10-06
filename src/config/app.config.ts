import { ENV } from "./env";

/**
 * Application Configuration
 * Centralized configuration for routes, external URLs, and app constants
 */

export const APP_CONFIG = {
  // App Info
  app: {
    name: "Strength Over Struggle",
    tagline: "Empowering Resilience. Overcoming Adversity.",
    description:
      "Building stronger communities through mental, physical, and financial wellness programs that transform challenges into opportunities.",
  },

  // Routes
  routes: {
    home: "/",
    shop: "/shop",
    story: "/story",
    contact: "/contact",
  },

  // External URLs
  externalUrls: {
    donationStripe: ENV.donationUrl,
    instagramMain: "https://www.instagram.com/strengthoverstruggle",
  },

  // Analytics configuration
  analytics: {
    datafast: {
      websiteId: ENV.datafastWebsiteId,
      domain: ENV.datafastDomain ?? "strength-over-struggle.com",
      scriptSrc: "https://datafa.st/js/script.js",
    },
  },

  // Contact Info
  contact: {
    email: "contact@strengthoverstruggle.org",
    phone: "(555) 123-4567",
    location: "Beloit, Wisconsin",
  },

  // Social Media
  social: {
    instagram: "https://www.instagram.com/strengthoverstruggle",
    facebook: "",
    twitter: "",
  },

  // UI Constants
  ui: {
    headerOffset: 80, // Sticky header height in pixels
    animationDurations: {
      fast: 200,
      medium: 300,
      slow: 500,
    },
    exitIntent: {
      mobileScrollThreshold: 75, // % of page scroll before trigger
      mobileTimeThreshold: 90000, // 90 seconds
      desktopMouseLeaveY: 5, // pixels from top
    },
  },

  // Validation Constants
  validation: {
    name: {
      minLength: 2,
      maxLength: 100,
    },
    email: {
      maxLength: 255,
    },
    businessName: {
      maxLength: 150,
    },
    message: {
      maxLength: 1000,
    },
    formSubmitMinTime: 3, // seconds (bot protection)
  },

  // Impact Metrics
  impact: {
    gymMemberships: "540+",
    communityPartners: "4",
    livesTransformed: "Growing",
  },
} as const;

// Type exports for TypeScript safety
export type AppRoutes = typeof APP_CONFIG.routes;
export type ExternalUrls = typeof APP_CONFIG.externalUrls;
