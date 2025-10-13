import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Rate limiting configuration
const RATE_LIMIT = 5; // Max submissions per hour
const RATE_WINDOW_MINUTES = 60; // 1 hour in minutes

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

async function checkRateLimit(ip: string, supabaseClient: any): Promise<boolean> {
  try {
    const { data, error } = await supabaseClient.rpc('check_and_increment_rate_limit', {
      _ip: ip,
      _endpoint: 'contact-form',
      _limit: RATE_LIMIT,
      _window_minutes: RATE_WINDOW_MINUTES
    });

    if (error) {
      console.error('Rate limit check error:', error);
      // Fail open - allow request if rate limit check fails
      return true;
    }

    return data?.allowed ?? true;
  } catch (error) {
    console.error('Rate limit check exception:', error);
    // Fail open - allow request if rate limit check fails
    return true;
  }
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
    // Initialize Supabase client for rate limiting
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Check rate limit with persistent storage
    const clientIP = getClientIP(req);
    const rateLimitAllowed = await checkRateLimit(clientIP, supabase);
    
    if (!rateLimitAllowed) {
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
