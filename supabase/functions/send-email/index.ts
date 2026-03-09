import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { type, data } = await req.json();

    if (type !== 'contact') {
      return new Response(JSON.stringify({ error: 'Type inconnu' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { name, email, subject, message } = data;

    // Use Resend (or any SMTP service). Fallback: log + return success
    // Replace RESEND_API_KEY with your actual key in Supabase secrets
    const resendApiKey = Deno.env.get('RESEND_API_KEY');

    if (resendApiKey) {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${resendApiKey}`,
        },
        body: JSON.stringify({
          from: 'GoCivique Support <noreply@gocivique.fr>',
          to: ['gocivique@gmail.com'],
          reply_to: email,
          subject: `[Contact] ${subject || 'Nouveau message'}`,
          html: `
            <h2>Nouveau message de contact</h2>
            <p><strong>Nom :</strong> ${name}</p>
            <p><strong>Email :</strong> ${email}</p>
            <p><strong>Sujet :</strong> ${subject || '—'}</p>
            <hr/>
            <p><strong>Message :</strong></p>
            <p>${message.replace(/\n/g, '<br/>')}</p>
          `,
        }),
      });

      if (!res.ok) {
        const err = await res.text();
        console.error('Resend error:', err);
        // Still return success to avoid blocking the user
      }
    } else {
      // No email service configured — just log
      console.log('Contact form submission:', { name, email, subject, message });
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('send-email error:', err);
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
