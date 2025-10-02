import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";
import { Resend } from "npm:resend@4.0.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface SubscribeData {
  email: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    const resendApiKey = Deno.env.get('RESEND_API_KEY');
    const siteUrl = Deno.env.get('SITE_URL');
    const senderEmail = 'Strength Over Struggle <contact@strength-over-struggle.com>';

    if (!supabaseUrl) {
      console.error('Missing SUPABASE_URL environment variable');
      throw new Error('Server configuration is incomplete. Please contact support.');
    }

    if (!serviceRoleKey) {
      console.error('Missing SUPABASE_SERVICE_ROLE_KEY environment variable');
      throw new Error('Server configuration is incomplete. Please contact support.');
    }

    if (!resendApiKey) {
      console.error('Missing RESEND_API_KEY environment variable');
      throw new Error('Email service configuration is missing. Please contact support.');
    }

    if (!siteUrl) {
      console.error('Missing SITE_URL environment variable');
      throw new Error('Site URL is not configured. Please contact support.');
    }

    const supabaseClient = createClient(supabaseUrl, serviceRoleKey);

    const resend = new Resend(resendApiKey);
    const data: SubscribeData = await req.json();
    
    console.log('=== NEWSLETTER SUBSCRIPTION START ===');
    console.log('Raw request body:', JSON.stringify(data, null, 2));
    console.log('Email received:', data.email);

    // Validate email
    const sanitizedEmail = data.email.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!emailRegex.test(sanitizedEmail)) {
      return new Response(
        JSON.stringify({ error: 'Invalid email address' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check if already subscribed
    const { data: existing } = await supabaseClient
      .from('newsletter_subscribers')
      .select('id, status')
      .eq('email', sanitizedEmail)
      .single();

    if (existing) {
      if (existing.status === 'confirmed') {
        return new Response(
          JSON.stringify({ error: 'This email is already subscribed to our newsletter.' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      } else if (existing.status === 'pending') {
        return new Response(
          JSON.stringify({ error: 'Please check your email to confirm your subscription.' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }

    // Generate confirmation token
    const confirmationToken = crypto.randomUUID();

    // Insert into database
    const { data: subscriber, error: insertError } = await supabaseClient
      .from('newsletter_subscribers')
      .insert({
        email: sanitizedEmail,
        status: 'pending',
        confirmation_token: confirmationToken,
      })
      .select()
      .single();

    if (insertError) {
      console.error('Database insertion error:', insertError);
      return new Response(
        JSON.stringify({ error: 'Failed to subscribe. Please try again.' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Newsletter subscriber created:', subscriber.id);

    // Send double opt-in confirmation email
    const normalizedSiteUrl = siteUrl.endsWith('/') ? siteUrl.slice(0, -1) : siteUrl;
    const confirmationUrl = `${normalizedSiteUrl}/functions/v1/confirm-newsletter?token=${confirmationToken}`;
    
    console.log('Confirmation URL:', confirmationUrl);
    console.log('Sending confirmation email...');
    
    try {
      const emailResult = await resend.emails.send({
        from: senderEmail,
        to: [sanitizedEmail],
        subject: 'Confirm your newsletter subscription',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #333;">Confirm Your Subscription</h1>
            <p style="color: #666; line-height: 1.6;">
              Thank you for subscribing to the Strength Over Struggle newsletter!
            </p>
            <p style="color: #666; line-height: 1.6;">
              Please confirm your email address by clicking the button below:
            </p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${confirmationUrl}" 
                 style="background: #000; color: #fff; padding: 12px 30px; text-decoration: none; 
                        border-radius: 8px; display: inline-block; font-weight: bold;">
                Confirm Subscription
              </a>
            </div>
            <p style="color: #999; font-size: 12px; line-height: 1.6;">
              If you didn't subscribe to this newsletter, you can safely ignore this email.
            </p>
          </div>
        `,
      });
      console.log('✅ Confirmation email sent successfully:', JSON.stringify(emailResult, null, 2));
    } catch (emailError: any) {
      console.error('❌ FAILED to send confirmation email:', {
        error: emailError.message,
        name: emailError.name,
        statusCode: emailError.statusCode,
        details: JSON.stringify(emailError.response?.body || emailError, null, 2)
      });
      return new Response(
        JSON.stringify({ error: 'Failed to send confirmation email. Please try again or contact support.' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('=== NEWSLETTER SUBSCRIPTION SUCCESS ===');
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Please check your email to confirm your subscription.' 
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: any) {
    console.error('=== NEWSLETTER SUBSCRIPTION ERROR ===');
    console.error('Error details:', {
      message: error.message,
      name: error.name,
      stack: error.stack,
      full: JSON.stringify(error, null, 2)
    });
    return new Response(
      JSON.stringify({ error: error.message || 'An unexpected error occurred' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
