import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface NewsletterSignupRequest {
  email: string;
  name?: string;
}

serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, name }: NewsletterSignupRequest = await req.json();
    console.log('Newsletter signup request:', { email, name });

    // Initialize Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    // Check if email already exists
    const { data: existingSignup, error: selectError } = await supabase
      .from('newsletter_signups')
      .select('id, status')
      .eq('email', email)
      .maybeSingle();

    // Log the check result
    console.log('Existing signup check:', { existingSignup, selectError });

    if (existingSignup) {
      console.log('Email already exists:', email);
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'Already subscribed!',
          status: 'existing'
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Add subscriber to ConvertKit
    console.log('Attempting ConvertKit subscription for:', email);
    const convertKitResponse = await fetch('https://api.convertkit.com/v3/subscribers', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        api_key: Deno.env.get('CONVERTKIT_API_KEY'),
        email: email,
        first_name: name || '',
      }),
    });

    console.log('ConvertKit response status:', convertKitResponse.status);

    let convertKitSubscriberId = null;
    let status = 'pending';

    if (convertKitResponse.ok) {
      const convertKitData = await convertKitResponse.json();
      convertKitSubscriberId = convertKitData.subscriber?.id?.toString();
      status = 'subscribed';
      console.log('ConvertKit subscription successful:', convertKitData);
    } else {
      const errorData = await convertKitResponse.text();
      console.error('ConvertKit API error:', errorData);
      // Still proceed to save in database even if ConvertKit fails
      status = 'failed';
    }

    // Save to database
    const { data: signup, error: insertError } = await supabase
      .from('newsletter_signups')
      .insert({
        email,
        name: name || null,
        convertkit_subscriber_id: convertKitSubscriberId,
        status,
      })
      .select()
      .single();

    if (insertError) {
      console.error('Database insert error:', insertError);
      throw new Error(`Failed to save signup: ${insertError.message}`);
    }

    console.log('Newsletter signup saved:', signup);

    return new Response(
      JSON.stringify({
        success: true,
        message: status === 'subscribed' ? 'Successfully subscribed!' : 'Subscription saved, will retry ConvertKit later',
        status,
        id: signup.id,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error: any) {
    console.error('Error in newsletter-signup function:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || 'Failed to process newsletter signup',
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});