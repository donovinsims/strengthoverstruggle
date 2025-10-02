import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";
import { Resend } from "npm:resend@4.0.0";

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
  website_url?: string; // Honeypot field
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    const resendApiKey = Deno.env.get('RESEND_API_KEY');
    const senderEmail = 'Strength Over Struggle <contact@strength-over-struggle.com>';

    if (!supabaseUrl) {
      console.error('Missing SUPABASE_URL environment variable');
      throw new Error('Server configuration is incomplete. Please contact support.');
    }

    if (!serviceRoleKey) {
      console.error('Missing SUPABASE_SERVICE_ROLE_KEY environment variable');
      throw new Error('Secure database access is not configured. Please contact support.');
    }

    if (!resendApiKey) {
      console.error('Missing RESEND_API_KEY environment variable');
      throw new Error('Email service configuration is missing. Please contact support.');
    }

    const supabaseClient = createClient(supabaseUrl, serviceRoleKey);

    const resend = new Resend(resendApiKey);
    const data: ContactFormData = await req.json();
    
    console.log('=== CONTACT FORM SUBMISSION START ===');
    console.log('Raw request body:', JSON.stringify(data, null, 2));
    console.log('Fields received:', { 
      name: data.name, 
      email: data.email, 
      phone: data.phone,
      reason: data.reason,
      business_name: data.business_name,
      message: data.message,
      website_url: data.website_url
    });

    // Check honeypot field (bot detection)
    if (data.website_url && data.website_url.trim() !== '') {
      console.log('Honeypot triggered - potential bot submission');
      return new Response(
        JSON.stringify({ error: 'Invalid submission' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validate required fields
    if (!data.name || !data.email || !data.phone || !data.reason) {
      return new Response(
        JSON.stringify({ error: 'Name, email, phone, and reason are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Sanitize inputs
    const sanitizedName = data.name.trim().slice(0, 100);
    const sanitizedBusinessName = data.business_name?.trim().slice(0, 150) || null;
    const sanitizedPhone = data.phone.trim().slice(0, 20);
    const sanitizedEmail = data.email.trim().toLowerCase().slice(0, 255);
    const sanitizedReason = data.reason.trim().slice(0, 100);
    const sanitizedMessage = data.message?.trim().slice(0, 1000) || null;

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(sanitizedEmail)) {
      return new Response(
        JSON.stringify({ error: 'Invalid email address' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Insert into database
    const { data: contact, error: insertError } = await supabaseClient
      .from('contacts')
      .insert({
        name: sanitizedName,
        business_name: sanitizedBusinessName,
        phone: sanitizedPhone,
        email: sanitizedEmail,
        reason: sanitizedReason,
        message: sanitizedMessage,
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

    console.log('Contact saved to database:', contact.id);

    // Send confirmation email to user
    try {
      console.log('Sending confirmation email to user...');
      const userEmailResult = await resend.emails.send({
        from: senderEmail,
        to: [sanitizedEmail],
        subject: 'We received your message!',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #333;">Thank you for contacting us, ${sanitizedName}!</h1>
            <p style="color: #666; line-height: 1.6;">
              We have received your message and will get back to you within 24-48 hours.
            </p>
            <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p style="margin: 0; color: #888; font-size: 14px;"><strong>Your inquiry:</strong></p>
              <p style="color: #333; margin-top: 5px;"><strong>Reason:</strong> ${sanitizedReason}</p>
              ${sanitizedBusinessName ? `<p style="color: #333; margin-top: 5px;"><strong>Business:</strong> ${sanitizedBusinessName}</p>` : ''}
              <p style="color: #333; margin-top: 5px;"><strong>Phone:</strong> ${sanitizedPhone}</p>
              ${sanitizedMessage ? `<p style="color: #333; margin-top: 10px;"><strong>Message:</strong><br>${sanitizedMessage}</p>` : ''}
            </div>
            <p style="color: #666; line-height: 1.6;">
              Best regards,<br>
              <strong>The Strength Over Struggle Team</strong>
            </p>
          </div>
        `,
      });
      console.log('✅ Confirmation email sent to user successfully:', JSON.stringify(userEmailResult, null, 2));
    } catch (emailError: any) {
      console.error('❌ FAILED to send confirmation email:', {
        error: emailError.message,
        name: emailError.name,
        statusCode: emailError.statusCode,
        details: JSON.stringify(emailError.response?.body || emailError, null, 2)
      });
      // Don't fail the submission if email fails
    }

    // Send notification email to admin
    try {
      console.log('Sending admin notification email...');
      const adminEmailResult = await resend.emails.send({
        from: senderEmail,
        to: ['contact@strength-over-struggle.com'],
        subject: `New Contact Form Submission from ${sanitizedName}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #333;">New Contact Form Submission</h1>
            <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p style="margin: 0; color: #888; font-size: 14px;"><strong>Contact Details:</strong></p>
              <p style="color: #333; margin: 5px 0;"><strong>Name:</strong> ${sanitizedName}</p>
              ${sanitizedBusinessName ? `<p style="color: #333; margin: 5px 0;"><strong>Business:</strong> ${sanitizedBusinessName}</p>` : ''}
              <p style="color: #333; margin: 5px 0;"><strong>Email:</strong> ${sanitizedEmail}</p>
              <p style="color: #333; margin: 5px 0;"><strong>Phone:</strong> ${sanitizedPhone}</p>
              <p style="color: #333; margin: 5px 0;"><strong>Reason:</strong> ${sanitizedReason}</p>
              
              ${sanitizedMessage ? `<p style="margin: 20px 0 0 0; color: #888; font-size: 14px;"><strong>Message:</strong></p>
              <p style="color: #333; margin-top: 10px;">${sanitizedMessage}</p>` : '<p style="color: #888; margin: 10px 0 0 0; font-style: italic;">No additional message provided</p>'}
            </div>
            <p style="color: #666; font-size: 14px;">
              <a href="https://ywkrozcdrwbzojxxhuxu.supabase.co/project/ywkrozcdrwbzojxxhuxu/editor" 
                 style="color: #0066cc; text-decoration: none;">
                View in Dashboard →
              </a>
            </p>
          </div>
        `,
      });
      console.log('✅ Admin notification email sent successfully:', JSON.stringify(adminEmailResult, null, 2));
    } catch (emailError: any) {
      console.error('❌ FAILED to send admin notification:', {
        error: emailError.message,
        name: emailError.name,
        statusCode: emailError.statusCode,
        details: JSON.stringify(emailError.response?.body || emailError, null, 2)
      });
      // Don't fail the submission if email fails
    }

    console.log('=== CONTACT FORM SUBMISSION SUCCESS ===');
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Thank you for contacting us! We will respond within 24-48 hours.' 
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: any) {
    console.error('=== CONTACT FORM SUBMISSION ERROR ===');
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
