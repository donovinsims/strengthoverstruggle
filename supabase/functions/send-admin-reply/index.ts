import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";
import { Resend } from "npm:resend@4.0.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ReplyData {
  contactId: string;
  subject: string;
  body: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Authorization required' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    );

    // Get user from token
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser();
    
    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check if user has admin role
    const { data: roles } = await supabaseClient
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .eq('role', 'admin')
      .single();

    if (!roles) {
      return new Response(
        JSON.stringify({ error: 'Admin access required' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const data: ReplyData = await req.json();
    const { contactId, subject, body } = data;

    if (!contactId || !subject || !body) {
      return new Response(
        JSON.stringify({ error: 'Contact ID, subject, and body are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get contact details using service role
    const supabaseServiceClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { data: contact, error: contactError } = await supabaseServiceClient
      .from('contacts')
      .select('*')
      .eq('id', contactId)
      .single();

    if (contactError || !contact) {
      return new Response(
        JSON.stringify({ error: 'Contact not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Send email via Resend
    const resend = new Resend(Deno.env.get('RESEND_API_KEY') ?? '');
    
    const emailResult = await resend.emails.send({
      from: 'Strength Over Struggle <noreply@strengthoverstruggle.org>',
      to: [contact.email],
      subject: subject,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Hello ${contact.name},</h2>
          <div style="color: #666; line-height: 1.6; white-space: pre-wrap;">${body}</div>
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd;">
            <p style="color: #666; line-height: 1.6;">
              Best regards,<br>
              <strong>The Strength Over Struggle Team</strong>
            </p>
          </div>
          <p style="color: #999; font-size: 12px; margin-top: 30px;">
            This is a reply to your contact form submission from ${new Date(contact.created_at).toLocaleDateString()}.
          </p>
        </div>
      `,
    });

    console.log('Admin reply sent:', emailResult);

    // Save to sent_emails table
    const { error: insertError } = await supabaseServiceClient
      .from('sent_emails')
      .insert({
        contact_id: contactId,
        subject: subject,
        body: body,
        sent_by: user.id,
      });

    if (insertError) {
      console.error('Error saving sent email:', insertError);
    }

    // Update contact status
    await supabaseServiceClient
      .from('contacts')
      .update({ status: 'contacted' })
      .eq('id', contactId);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Reply sent successfully' 
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: any) {
    console.error('Send reply error:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'An unexpected error occurred' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
