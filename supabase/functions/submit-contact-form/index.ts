import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const convertKitApiKey = Deno.env.get('CONVERTKIT_API_KEY');
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { 
      name, 
      business_name, 
      phone, 
      email, 
      reason, 
      message,
      website_url,
      form_render_time,
      submission_time
    } = await req.json();

    // Get IP address for rate limiting
    const ipAddress = req.headers.get('x-forwarded-for') || 
                     req.headers.get('x-real-ip') || 
                     'unknown';

    console.log('Contact form submission attempt from IP:', ipAddress);

    // 1. Honeypot validation (silent rejection)
    if (website_url && website_url.trim() !== '') {
      console.log('Honeypot triggered, rejecting silently');
      return new Response(
        JSON.stringify({ error: 'Invalid submission' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // 2. Time-based validation (bot protection)
    if (form_render_time && submission_time) {
      const timeDiff = (submission_time - form_render_time) / 1000;
      if (timeDiff < 3) {
        console.log('Submission too fast, likely a bot');
        return new Response(
          JSON.stringify({ error: 'Invalid submission' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }

    // 3. Rate limiting (3 submissions per IP per hour)
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
    const { count } = await supabase
      .from('contact_submissions')
      .select('id', { count: 'exact', head: true })
      .eq('ip_address', ipAddress)
      .gte('created_at', oneHourAgo);

    if (count && count >= 3) {
      console.log('Rate limit exceeded for IP:', ipAddress);
      return new Response(
        JSON.stringify({ error: 'Rate limit exceeded. Please try again in 1 hour.' }),
        { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // 4. Server-side validation
    const errors: string[] = [];

    // Validate name
    const trimmedName = name?.trim();
    if (!trimmedName || trimmedName.length < 2 || trimmedName.length > 100) {
      errors.push('Name must be between 2 and 100 characters');
    }
    if (trimmedName && !/^[a-zA-Z\s'-]+$/.test(trimmedName)) {
      errors.push('Name contains invalid characters');
    }

    // Validate email
    const trimmedEmail = email?.trim().toLowerCase();
    if (!trimmedEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      errors.push('Invalid email address');
    }

    // Validate phone (NANP format)
    if (!phone || !/^\(\d{3}\) \d{3}-\d{4}$/.test(phone)) {
      errors.push('Invalid phone number format');
    }

    // Validate reason
    const validReasons = [
      'Donation Inquiry',
      'Gym Partnership',
      'Corporate Sponsorship',
      'Payment/Technical Issues',
      'General Questions',
      'Other'
    ];
    if (!reason || !validReasons.includes(reason)) {
      errors.push('Invalid reason for contact');
    }

    // Validate business name (optional)
    const trimmedBusinessName = business_name?.trim();
    if (trimmedBusinessName && trimmedBusinessName.length > 150) {
      errors.push('Business name must be less than 150 characters');
    }

    // Validate message (optional)
    const trimmedMessage = message?.trim();
    if (trimmedMessage && trimmedMessage.length > 1000) {
      errors.push('Message must be less than 1000 characters');
    }

    if (errors.length > 0) {
      console.log('Validation errors:', errors);
      return new Response(
        JSON.stringify({ error: errors.join(', ') }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // 5. Insert into database
    const { data: submission, error: dbError } = await supabase
      .from('contact_submissions')
      .insert({
        name: trimmedName,
        business_name: trimmedBusinessName || null,
        phone: phone,
        email: trimmedEmail,
        reason: reason,
        message: trimmedMessage || null,
        ip_address: ipAddress,
        status: 'new',
      })
      .select()
      .single();

    if (dbError) {
      console.error('Database error:', dbError);
      throw new Error('Failed to save submission');
    }

    console.log('Submission saved successfully:', submission.id);

    // 6. ConvertKit integration (optional, don't fail submission if it fails)
    if (convertKitApiKey) {
      try {
        // Create/update subscriber in ConvertKit
        const subscriberResponse = await fetch('https://api.convertkit.com/v3/subscribers', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            api_key: convertKitApiKey,
            email: trimmedEmail,
            first_name: trimmedName.split(' ')[0],
            fields: {
              reason: reason,
              message: trimmedMessage || '',
              business_name: trimmedBusinessName || '',
            },
          }),
        });

        if (subscriberResponse.ok) {
          console.log('ConvertKit subscriber created/updated');
        } else {
          const errorText = await subscriberResponse.text();
          console.error('ConvertKit API error:', errorText);
        }
      } catch (convertKitError) {
        console.error('ConvertKit integration error:', convertKitError);
        // Don't fail the submission if ConvertKit fails
      }
    }

    // 7. Return success
    return new Response(
      JSON.stringify({ 
        success: true,
        message: 'Thank you for contacting us! We will respond within 24-48 hours.'
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Unexpected error:', error);
    return new Response(
      JSON.stringify({ 
        error: 'An unexpected error occurred. Please try again or email us directly at contact@strengthoverstruggle.org.' 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
