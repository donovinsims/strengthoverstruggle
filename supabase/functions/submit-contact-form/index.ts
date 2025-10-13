import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Simple in-memory rate limiting (resets on function restart)
const submissionTracker = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT = 5; // Max submissions per hour
const RATE_WINDOW = 60 * 60 * 1000; // 1 hour in milliseconds

interface ContactFormData {
  fullName: string;
  email: string;
  reason: string;
  message?: string;
}

function getClientIP(req: Request): string {
  return req.headers.get('x-forwarded-for')?.split(',')[0] || 
         req.headers.get('x-real-ip') || 
         'unknown';
}

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const tracker = submissionTracker.get(ip);
  
  if (!tracker || now > tracker.resetTime) {
    submissionTracker.set(ip, { count: 1, resetTime: now + RATE_WINDOW });
    return true;
  }
  
  if (tracker.count >= RATE_LIMIT) {
    return false;
  }
  
  tracker.count++;
  return true;
}

function sanitizeInput(input: string): string {
  // Remove HTML tags and dangerous characters
  return input
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .replace(/[<>'"]/g, '') // Remove potential XSS characters
    .trim();
}

function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 255;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Check rate limit
    const clientIP = getClientIP(req);
    if (!checkRateLimit(clientIP)) {
      console.log(`Rate limit exceeded for IP: ${clientIP}`);
      return new Response(
        JSON.stringify({ 
          error: 'Too many submissions. Please try again later.' 
        }),
        { 
          status: 429, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Parse and validate request body
    const data: ContactFormData = await req.json();

    // Server-side validation
    if (!data.fullName || data.fullName.length > 100) {
      throw new Error('Invalid name');
    }
    if (!data.email || !validateEmail(data.email)) {
      throw new Error('Invalid email');
    }
    if (!data.reason || data.reason.length > 100) {
      throw new Error('Invalid reason');
    }
    if (data.message && data.message.length > 1000) {
      throw new Error('Message too long');
    }

    // Sanitize all inputs
    const sanitizedData = {
      fullName: sanitizeInput(data.fullName),
      email: data.email.toLowerCase().trim(),
      reason: sanitizeInput(data.reason),
      message: data.message ? sanitizeInput(data.message) : ''
    };

    // Get ConvertKit credentials from environment
    const convertkitApiKey = Deno.env.get('CONVERTKIT_API_KEY');
    const convertkitFormId = Deno.env.get('CONVERTKIT_FORM_ID');

    if (!convertkitApiKey || !convertkitFormId) {
      console.error('Missing ConvertKit configuration');
      throw new Error('Service configuration error');
    }

    // Submit to ConvertKit
    const convertkitResponse = await fetch(
      `https://api.convertkit.com/v3/forms/${convertkitFormId}/subscribe`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          api_key: convertkitApiKey,
          email: sanitizedData.email,
          first_name: sanitizedData.fullName,
          fields: {
            reason: sanitizedData.reason,
            message: sanitizedData.message
          }
        })
      }
    );

    if (!convertkitResponse.ok) {
      console.error('ConvertKit API error:', await convertkitResponse.text());
      throw new Error('Failed to submit to ConvertKit');
    }

    // Store submission record in Supabase (if contact_submissions table exists)
    try {
      const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
      const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
      const supabase = createClient(supabaseUrl, supabaseServiceKey);

      await supabase.from('contact_submissions').insert({
        full_name: sanitizedData.fullName,
        email: sanitizedData.email,
        reason: sanitizedData.reason,
        message: sanitizedData.message,
        ip_address: clientIP,
        status: 'pending'
      });
    } catch (dbError) {
      // Log but don't fail the request if DB storage fails
      console.error('Failed to store submission in database:', dbError);
    }

    console.log(`Contact form submitted successfully from IP: ${clientIP}`);

    return new Response(
      JSON.stringify({ success: true, message: 'Form submitted successfully' }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Error processing contact form:', error);
    
    return new Response(
      JSON.stringify({ 
        error: 'Failed to process form submission',
        message: error instanceof Error ? error.message : 'Unknown error'
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
