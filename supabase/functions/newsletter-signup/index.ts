import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface NewsletterSignupRequest {
  email: string;
  name?: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, name }: NewsletterSignupRequest = await req.json();

    if (!email) {
      return new Response(
        JSON.stringify({ error: 'Email is required' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // First, save to our database
    const { data: signupData, error: dbError } = await supabase
      .from('newsletter_signups')
      .insert([{ email, name, status: 'pending' }])
      .select()
      .single();

    if (dbError) {
      console.error('Database error:', dbError);
      return new Response(
        JSON.stringify({ error: 'Failed to save signup' }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Then, subscribe to ConvertKit
    const convertKitApiKey = Deno.env.get('CONVERTKIT_API_KEY');
    
    if (!convertKitApiKey) {
      console.error('ConvertKit API key not found');
      // Update status to error
      await supabase
        .from('newsletter_signups')
        .update({ status: 'error' })
        .eq('id', signupData.id);
      
      return new Response(
        JSON.stringify({ error: 'Newsletter service not configured' }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    try {
      // Subscribe to ConvertKit
      const convertKitResponse = await fetch('https://api.convertkit.com/v4/subscribers', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${convertKitApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email_address: email,
          first_name: name || '',
        }),
      });

      const convertKitData = await convertKitResponse.json();
      
      if (!convertKitResponse.ok) {
        console.error('ConvertKit error:', convertKitData);
        
        // Update status to error
        await supabase
          .from('newsletter_signups')
          .update({ status: 'error' })
          .eq('id', signupData.id);

        return new Response(
          JSON.stringify({ error: 'Failed to subscribe to newsletter' }),
          {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
      }

      // Update with ConvertKit subscriber ID and success status
      await supabase
        .from('newsletter_signups')
        .update({ 
          convertkit_subscriber_id: convertKitData.subscriber.id,
          status: 'subscribed' 
        })
        .eq('id', signupData.id);

      console.log('Successfully subscribed:', email);

      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'Successfully subscribed to newsletter!',
          subscriber_id: convertKitData.subscriber.id
        }),
        {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );

    } catch (convertKitError) {
      console.error('ConvertKit API error:', convertKitError);
      
      // Update status to error
      await supabase
        .from('newsletter_signups')
        .update({ status: 'error' })
        .eq('id', signupData.id);

      return new Response(
        JSON.stringify({ error: 'Newsletter service temporarily unavailable' }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

  } catch (error) {
    console.error('Error in newsletter-signup function:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
};

serve(handler);