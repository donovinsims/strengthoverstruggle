/**
 * Security utilities for input validation and sanitization
 * These functions help protect against common web vulnerabilities
 */

import { z } from 'zod';

/**
 * Sanitizes HTML input by removing potentially dangerous characters
 * Useful for preventing XSS attacks in user-generated content
 */
export function sanitizeHtml(input: string): string {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

/**
 * Validates and sanitizes email addresses
 * Returns null if email is invalid
 */
export function validateEmail(email: string): string | null {
  const emailSchema = z.string().email().max(254);
  try {
    return emailSchema.parse(email.trim().toLowerCase());
  } catch {
    return null;
  }
}

/**
 * Validates phone numbers (basic US format)
 * Returns null if phone number is invalid
 */
export function validatePhone(phone: string): string | null {
  const phoneSchema = z.string().regex(/^\+?1?[-.\s]?\(?[0-9]{3}\)?[-.\s]?[0-9]{3}[-.\s]?[0-9]{4}$/);
  try {
    return phoneSchema.parse(phone.replace(/\s/g, ''));
  } catch {
    return null;
  }
}

/**
 * Validates donation amounts
 * Ensures amount is positive and within reasonable limits
 */
export function validateDonationAmount(amount: number): boolean {
  const amountSchema = z.number().min(1).max(100000);
  try {
    amountSchema.parse(amount);
    return true;
  } catch {
    return false;
  }
}

/**
 * Sanitizes text input for general use
 * Removes excessive whitespace and potentially harmful characters
 */
export function sanitizeTextInput(input: string, maxLength: number = 1000): string {
  return input
    .trim()
    .slice(0, maxLength)
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, ''); // Remove control characters
}

/**
 * Validates URL format and ensures it's from allowed domains
 * Returns null if URL is invalid or not from allowed domains
 */
export function validateUrl(url: string, allowedDomains?: string[]): string | null {
  try {
    const urlObj = new URL(url);
    
    // Only allow https URLs (except localhost for development)
    if (urlObj.protocol !== 'https:' && !urlObj.hostname.includes('localhost')) {
      return null;
    }
    
    // Check against allowed domains if provided
    if (allowedDomains && !allowedDomains.some(domain => urlObj.hostname.includes(domain))) {
      return null;
    }
    
    return url;
  } catch {
    return null;
  }
}

/**
 * Content Security Policy helper
 * Generates nonce for inline scripts if needed
 */
export function generateNonce(): string {
  const array = new Uint8Array(16);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

/**
 * Rate limiting helper (for future API implementations)
 * Simple in-memory rate limiter
 */
export class RateLimiter {
  private requests: Map<string, number[]> = new Map();
  
  constructor(
    private maxRequests: number = 100,
    private windowMs: number = 15 * 60 * 1000 // 15 minutes
  ) {}
  
  isAllowed(identifier: string): boolean {
    const now = Date.now();
    const userRequests = this.requests.get(identifier) || [];
    
    // Remove old requests outside the window
    const validRequests = userRequests.filter(time => now - time < this.windowMs);
    
    if (validRequests.length >= this.maxRequests) {
      return false;
    }
    
    validRequests.push(now);
    this.requests.set(identifier, validRequests);
    return true;
  }
}