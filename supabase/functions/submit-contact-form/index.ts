import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ContactFormData {
  name: string;
  business_name?: string;
  phone: string;
  email: string;
  reason: string;
  message?: string;
  website_url?: string;
  form_render_time?: number;
  submission_time?: number;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const data: ContactFormData = await req.json();
    
    // Extract IP address for rate limiting
    const ipAddress = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';
    
    console.log('Contact form submission received from IP:', ipAddress);

    // 1. Check rate limit: 3 submissions per IP per hour
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
    const { count, error: countError } = await supabaseClient
      .from('contact_submissions')
      .select('id', { count: 'exact', head: true })
      .eq('ip_address', ipAddress)
      .gte('created_at', oneHourAgo);

    if (countError) {
      console.error('Error checking rate limit:', countError);
    }

    if (count && count >= 3) {
      console.log('Rate limit exceeded for IP:', ipAddress);
      return new Response(
        JSON.stringify({ error: 'Rate limit exceeded. Please try again in 1 hour.' }),
        { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // 2. Validate honeypot field (spam bot detection)
    if (data.website_url && data.website_url.length > 0) {
      console.log('Honeypot triggered - potential bot submission');
      return new Response(
        JSON.stringify({ error: 'Invalid submission' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // 3. Time-based validation (bot protection)
    if (data.form_render_time && data.submission_time) {
      const timeDiff = (data.submission_time - data.form_render_time) / 1000;
      if (timeDiff < 3) {
        console.log('Form submitted too quickly - potential bot');
        return new Response(
          JSON.stringify({ error: 'Invalid submission' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }

    // 4. Server-side validation and sanitization
    const sanitizedName = data.name.trim().slice(0, 100);
    const sanitizedBusinessName = data.business_name?.trim().slice(0, 150) || null;
    const sanitizedEmail = data.email.trim().toLowerCase().slice(0, 255);
    const sanitizedPhone = data.phone.trim();
    const sanitizedReason = data.reason.trim();
    const sanitizedMessage = data.message?.trim().slice(0, 1000) || null;

    // Validate required fields
    if (!sanitizedName || sanitizedName.length < 2) {
      return new Response(
        JSON.stringify({ error: 'Name must be at least 2 characters' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(sanitizedEmail)) {
      return new Response(
        JSON.stringify({ error: 'Invalid email address' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validate phone format (NANP)
    const phoneRegex = /^\(\d{3}\) \d{3}-\d{4}$/;
    if (!phoneRegex.test(sanitizedPhone)) {
      return new Response(
        JSON.stringify({ error: 'Invalid phone number format' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validate reason is in allowed list
    const allowedReasons = [
      'Donation Inquiry',
      'Gym Partnership',
      'Corporate Sponsorship',
      'Payment/Technical Issues',
      'General Questions',
      'Other'
    ];
    if (!allowedReasons.includes(sanitizedReason)) {
      return new Response(
        JSON.stringify({ error: 'Invalid reason for contact' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // 5. Insert into database
    const { data: submission, error: insertError } = await supabaseClient
      .from('contact_submissions')
      .insert({
        name: sanitizedName,
        business_name: sanitizedBusinessName,
        phone: sanitizedPhone,
        email: sanitizedEmail,
        reason: sanitizedReason,
        message: sanitizedMessage,
        ip_address: ipAddress,
        status: 'new',
      })
      .select()
      .single();

    if (insertError) {
      console.error('Database insertion error:', insertError);
      return new Response(
        JSON.stringify({ error: 'Failed to submit form. Please try again.' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Contact submission saved:', submission.id);

    // 6. ConvertKit API v4 Integration
    const convertKitApiKey = Deno.env.get('CONVERTKIT_API_KEY');
    if (convertKitApiKey) {
      try {
        // Create or update subscriber in ConvertKit
        const kitResponse = await fetch('https://api.convertkit.com/v4/subscribers', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${convertKitApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email_address: sanitizedEmail,
            first_name: sanitizedName.split(' ')[0],
            state: 'active',
            fields: {
              reason: sanitizedReason,
              message: sanitizedMessage || '',
              phone: sanitizedPhone,
              business_name: sanitizedBusinessName || '',
            },
          }),
        });

        if (kitResponse.ok) {
          const kitData = await kitResponse.json();
          console.log('ConvertKit subscriber created/updated:', kitData.subscriber?.id);
          
          // Note: Tag and automation would be configured in ConvertKit dashboard
          // The automation can be triggered when a subscriber is added or based on specific criteria
        } else {
          const errorText = await kitResponse.text();
          console.error('ConvertKit API error:', errorText);
          // Don't fail the submission if ConvertKit fails
        }
      } catch (kitError) {
        console.error('ConvertKit integration error:', kitError);
        // Don't fail the submission if ConvertKit fails
      }
    } else {
      console.warn('CONVERTKIT_API_KEY not configured');
    }

    // 7. Return success
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Thank you for contacting us! We will respond within 24-48 hours.' 
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: any) {
    console.error('Contact form submission error:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'An unexpected error occurred' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
