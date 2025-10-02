import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";
import { Resend } from "npm:resend@2.0.0";

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

    // 6. Send email notification via Resend
    const resendApiKey = Deno.env.get('RESEND_API_KEY');
    if (resendApiKey) {
      try {
        const resend = new Resend(resendApiKey);
        
        const emailHtml = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #121212; border-bottom: 2px solid #121212; padding-bottom: 10px;">
              New Contact Form Submission
            </h2>
            
            <div style="margin: 20px 0;">
              <h3 style="color: #545454; font-size: 16px; margin-bottom: 15px;">Contact Details:</h3>
              
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 10px; background: #FAFAFA; font-weight: bold; width: 150px;">Name:</td>
                  <td style="padding: 10px; background: #FAFAFA;">${sanitizedName}</td>
                </tr>
                <tr>
                  <td style="padding: 10px; background: #FFFFFF; font-weight: bold;">Email:</td>
                  <td style="padding: 10px; background: #FFFFFF;">
                    <a href="mailto:${sanitizedEmail}" style="color: #121212;">${sanitizedEmail}</a>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 10px; background: #FAFAFA; font-weight: bold;">Phone:</td>
                  <td style="padding: 10px; background: #FAFAFA;">
                    <a href="tel:${sanitizedPhone}" style="color: #121212;">${sanitizedPhone}</a>
                  </td>
                </tr>
                ${sanitizedBusinessName ? `
                <tr>
                  <td style="padding: 10px; background: #FFFFFF; font-weight: bold;">Business:</td>
                  <td style="padding: 10px; background: #FFFFFF;">${sanitizedBusinessName}</td>
                </tr>
                ` : ''}
                <tr>
                  <td style="padding: 10px; background: ${sanitizedBusinessName ? '#FAFAFA' : '#FFFFFF'}; font-weight: bold;">Reason:</td>
                  <td style="padding: 10px; background: ${sanitizedBusinessName ? '#FAFAFA' : '#FFFFFF'};">${sanitizedReason}</td>
                </tr>
              </table>
            </div>
            
            ${sanitizedMessage ? `
            <div style="margin: 20px 0;">
              <h3 style="color: #545454; font-size: 16px; margin-bottom: 10px;">Message:</h3>
              <div style="padding: 15px; background: #FAFAFA; border-left: 3px solid #121212; white-space: pre-wrap;">
                ${sanitizedMessage}
              </div>
            </div>
            ` : ''}
            
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #E0E0E0; color: #888888; font-size: 12px;">
              <p>Submission ID: ${submission.id}</p>
              <p>Submitted: ${new Date().toLocaleString('en-US', { timeZone: 'America/New_York' })} EST</p>
            </div>
          </div>
        `;

        await resend.emails.send({
          from: 'Strength Over Struggle <notifications@strength-over-struggle.com>',
          to: ['contact@strength-over-struggle.com'],
          subject: `New Contact: ${sanitizedReason} - ${sanitizedName}`,
          html: emailHtml,
        });

        console.log('Email notification sent successfully');
      } catch (emailError) {
        console.error('Email notification failed:', emailError);
        // Don't fail the submission if email fails
      }
    } else {
      console.warn('RESEND_API_KEY not configured - skipping email notification');
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
