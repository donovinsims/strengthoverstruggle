import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";
import { Resend } from "npm:resend@4.0.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ContactFormData {
  name: string;
  email: string;
  message: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const resend = new Resend(Deno.env.get('RESEND_API_KEY') ?? '');
    const data: ContactFormData = await req.json();
    
    console.log('Contact form submission received:', { name: data.name, email: data.email });

    // Validate required fields
    if (!data.name || !data.email || !data.message) {
      return new Response(
        JSON.stringify({ error: 'Name, email, and message are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Sanitize inputs
    const sanitizedName = data.name.trim().slice(0, 100);
    const sanitizedEmail = data.email.trim().toLowerCase().slice(0, 255);
    const sanitizedMessage = data.message.trim().slice(0, 2000);

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
        email: sanitizedEmail,
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
      const userEmailResult = await resend.emails.send({
        from: 'Strength Over Struggle <noreply@strengthoverstruggle.org>',
        to: [sanitizedEmail],
        subject: 'We received your message!',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #333;">Thank you for contacting us, ${sanitizedName}!</h1>
            <p style="color: #666; line-height: 1.6;">
              We have received your message and will get back to you within 24-48 hours.
            </p>
            <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p style="margin: 0; color: #888; font-size: 14px;"><strong>Your message:</strong></p>
              <p style="color: #333; margin-top: 10px;">${sanitizedMessage}</p>
            </div>
            <p style="color: #666; line-height: 1.6;">
              Best regards,<br>
              <strong>The Strength Over Struggle Team</strong>
            </p>
          </div>
        `,
      });
      console.log('Confirmation email sent to user:', userEmailResult);
    } catch (emailError) {
      console.error('Error sending confirmation email:', emailError);
      // Don't fail the submission if email fails
    }

    // Send notification email to admin
    try {
      const adminEmailResult = await resend.emails.send({
        from: 'Strength Over Struggle <noreply@strengthoverstruggle.org>',
        to: ['admin@strengthoverstruggle.org'], // Replace with actual admin email
        subject: `New Contact Form Submission from ${sanitizedName}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #333;">New Contact Form Submission</h1>
            <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p style="margin: 0; color: #888; font-size: 14px;"><strong>From:</strong></p>
              <p style="color: #333; margin: 5px 0;">${sanitizedName}</p>
              <p style="color: #333; margin: 5px 0;">${sanitizedEmail}</p>
              
              <p style="margin: 20px 0 0 0; color: #888; font-size: 14px;"><strong>Message:</strong></p>
              <p style="color: #333; margin-top: 10px;">${sanitizedMessage}</p>
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
      console.log('Admin notification email sent:', adminEmailResult);
    } catch (emailError) {
      console.error('Error sending admin notification:', emailError);
      // Don't fail the submission if email fails
    }

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
