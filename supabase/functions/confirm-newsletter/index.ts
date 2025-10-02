import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";
import { Resend } from "npm:resend@4.0.0";

serve(async (req) => {
  try {
    const url = new URL(req.url);
    const token = url.searchParams.get('token');

    if (!token) {
      return new Response(
        'Invalid confirmation link',
        { status: 400, headers: { 'Content-Type': 'text/html' } }
      );
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const resend = new Resend(Deno.env.get('RESEND_API_KEY') ?? '');

    // Find subscriber by token
    const { data: subscriber, error: findError } = await supabaseClient
      .from('newsletter_subscribers')
      .select('*')
      .eq('confirmation_token', token)
      .single();

    if (findError || !subscriber) {
      console.error('Subscriber not found:', findError);
      return new Response(
        '<html><body style="font-family: Arial; text-align: center; padding: 50px;"><h1>Invalid or expired confirmation link</h1></body></html>',
        { status: 404, headers: { 'Content-Type': 'text/html' } }
      );
    }

    if (subscriber.status === 'confirmed') {
      return new Response(
        '<html><body style="font-family: Arial; text-align: center; padding: 50px;"><h1>You are already subscribed!</h1><p>Thank you for being part of our community.</p></body></html>',
        { status: 200, headers: { 'Content-Type': 'text/html' } }
      );
    }

    // Update subscriber status
    const { error: updateError } = await supabaseClient
      .from('newsletter_subscribers')
      .update({
        status: 'confirmed',
        confirmed_at: new Date().toISOString(),
        confirmation_token: null,
      })
      .eq('id', subscriber.id);

    if (updateError) {
      console.error('Error updating subscriber:', updateError);
      return new Response(
        '<html><body style="font-family: Arial; text-align: center; padding: 50px;"><h1>Error confirming subscription</h1><p>Please try again later.</p></body></html>',
        { status: 500, headers: { 'Content-Type': 'text/html' } }
      );
    }

    console.log('Newsletter subscription confirmed:', subscriber.email);

    // Add to Resend audience (optional)
    try {
      const audienceId = Deno.env.get('RESEND_AUDIENCE_ID');
      if (audienceId) {
        await resend.contacts.create({
          email: subscriber.email,
          audienceId: audienceId,
        });
        console.log('Added to Resend audience:', subscriber.email);
      }
    } catch (resendError) {
      console.error('Error adding to Resend audience:', resendError);
      // Don't fail confirmation if Resend fails
    }

    // Send welcome email
    try {
      console.log('Sending welcome email...');
      await resend.emails.send({
        from: 'Strength Over Struggle <contact@strength-over-struggle.com>',
        to: [subscriber.email],
        subject: 'Welcome to our newsletter!',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #333;">Welcome to Strength Over Struggle!</h1>
            <p style="color: #666; line-height: 1.6;">
              Thank you for confirming your subscription. You're now part of our community 
              dedicated to empowering resilience and overcoming adversity.
            </p>
            <p style="color: #666; line-height: 1.6;">
              You'll receive updates about our programs, success stories, and opportunities 
              to get involved in making a difference.
            </p>
            <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p style="color: #333; font-weight: bold; margin: 0;">Stay Connected:</p>
              <p style="color: #666; margin: 10px 0 0 0;">
                Follow us on social media and visit our website to learn more about 
                our mission and programs.
              </p>
            </div>
            <p style="color: #999; font-size: 12px; line-height: 1.6;">
              You can unsubscribe at any time by clicking the unsubscribe link in any of our emails.
            </p>
          </div>
        `,
      });
      console.log('✅ Welcome email sent successfully');
    } catch (emailError: any) {
      console.error('❌ FAILED to send welcome email:', {
        error: emailError.message,
        name: emailError.name,
        statusCode: emailError.statusCode,
        details: JSON.stringify(emailError.response?.body || emailError, null, 2)
      });
    }

    // Redirect to success page
    return new Response(
      '<html><body style="font-family: Arial; text-align: center; padding: 50px;"><h1>Subscription Confirmed! 🎉</h1><p>Thank you for subscribing to our newsletter. You will receive updates about our programs and mission.</p><p style="margin-top: 30px;"><a href="/" style="color: #0066cc; text-decoration: none;">Return to homepage →</a></p></body></html>',
      { status: 200, headers: { 'Content-Type': 'text/html' } }
    );

  } catch (error: any) {
    console.error('Newsletter confirmation error:', error);
    return new Response(
      '<html><body style="font-family: Arial; text-align: center; padding: 50px;"><h1>Error</h1><p>An unexpected error occurred. Please try again later.</p></body></html>',
      { status: 500, headers: { 'Content-Type': 'text/html' } }
    );
  }
});
