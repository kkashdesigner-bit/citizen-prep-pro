import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const FROM = 'GoCivique <noreply@gocivique.fr>';
const SUPPORT_EMAIL = 'gocivique@gmail.com';

async function sendResendEmail(apiKey: string, payload: object): Promise<{ ok: boolean; error?: string }> {
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.text();
    return { ok: false, error: err };
  }
  return { ok: true };
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { type, data } = await req.json();
    const resendApiKey = Deno.env.get('RESEND_API_KEY');

    // ─── Contact form ───────────────────────────────────────────
    if (type === 'contact') {
      const { name, email, subject, message } = data;

      if (resendApiKey) {
        const result = await sendResendEmail(resendApiKey, {
          from: FROM,
          to: [SUPPORT_EMAIL],
          reply_to: email,
          subject: `[Contact] ${subject || 'Nouveau message'}`,
          html: `
            <div style="font-family:sans-serif;max-width:600px;margin:auto">
              <h2 style="color:#0055A4">Nouveau message de contact</h2>
              <p><strong>Nom :</strong> ${name}</p>
              <p><strong>Email :</strong> ${email}</p>
              <p><strong>Sujet :</strong> ${subject || '—'}</p>
              <hr style="border:1px solid #eee;margin:16px 0"/>
              <p><strong>Message :</strong></p>
              <p style="white-space:pre-wrap">${message.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</p>
            </div>
          `,
        });
        if (!result.ok) console.error('Resend contact error:', result.error);
      } else {
        console.log('[send-email] contact:', { name, email, subject, message });
      }

      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // ─── Question report ─────────────────────────────────────────
    if (type === 'report') {
      const { questionId, questionText, reason, userId } = data;

      if (resendApiKey) {
        const result = await sendResendEmail(resendApiKey, {
          from: FROM,
          to: [SUPPORT_EMAIL],
          subject: `[Signalement] Question #${questionId}`,
          html: `
            <div style="font-family:sans-serif;max-width:600px;margin:auto">
              <h2 style="color:#EF4135">Signalement de question</h2>
              <p><strong>Question ID :</strong> ${questionId}</p>
              <p><strong>Utilisateur :</strong> ${userId || 'Anonyme'}</p>
              <p><strong>Raison :</strong> ${reason}</p>
              <hr style="border:1px solid #eee;margin:16px 0"/>
              <p><strong>Texte de la question :</strong></p>
              <p style="background:#f5f5f5;padding:12px;border-radius:6px">${String(questionText || '').replace(/</g, '&lt;')}</p>
            </div>
          `,
        });
        if (!result.ok) console.error('Resend report error:', result.error);
      } else {
        console.log('[send-email] report:', { questionId, reason, userId });
      }

      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // ─── Welcome / subscription confirmation ─────────────────────
    if (type === 'welcome') {
      const { email, firstName, tier } = data;

      const tierLabel = tier === 'premium' ? 'Premium' : 'Standard';

      if (resendApiKey) {
        const result = await sendResendEmail(resendApiKey, {
          from: FROM,
          to: [email],
          subject: `Bienvenue sur GoCivique ${tierLabel} !`,
          html: `
            <div style="font-family:sans-serif;max-width:600px;margin:auto;background:#fff;border-radius:12px;overflow:hidden;border:1px solid #e5e7eb">
              <!-- Header -->
              <div style="background:linear-gradient(135deg,#0055A4,#1B6ED6);padding:40px 32px;text-align:center">
                <h1 style="color:#fff;margin:0;font-size:28px;font-weight:900">GoCivique</h1>
                <p style="color:rgba(255,255,255,0.8);margin:8px 0 0;font-size:14px">La voie vers la citoyenneté française</p>
              </div>
              <!-- Body -->
              <div style="padding:32px">
                <h2 style="color:#1a1a1a;margin:0 0 12px">Bienvenue${firstName ? `, ${firstName}` : ''} !</h2>
                <p style="color:#4b5563;line-height:1.6">
                  Votre abonnement <strong>${tierLabel}</strong> est maintenant actif.
                  Vous avez accès à l'ensemble de la plateforme GoCivique pour préparer votre examen civique.
                </p>
                <ul style="color:#4b5563;line-height:2">
                  <li>Examens blancs illimités (40 questions, 45 min)</li>
                  <li>Parcours d'apprentissage complet (100 classes)</li>
                  <li>Traduction instantanée des questions</li>
                  <li>Suivi de progression en temps réel</li>
                </ul>
                <div style="text-align:center;margin:32px 0">
                  <a href="https://gocivique.fr/learn" style="background:#0055A4;color:#fff;padding:14px 32px;border-radius:8px;text-decoration:none;font-weight:700;font-size:16px;display:inline-block">
                    Commencer l'entraînement →
                  </a>
                </div>
                <p style="color:#6b7280;font-size:13px;text-align:center">
                  Une question ? Écrivez-nous à <a href="mailto:${SUPPORT_EMAIL}" style="color:#0055A4">${SUPPORT_EMAIL}</a>
                </p>
              </div>
              <!-- Footer -->
              <div style="background:#f9fafb;padding:20px 32px;border-top:1px solid #e5e7eb;text-align:center">
                <p style="color:#9ca3af;font-size:12px;margin:0">
                  GoCivique · Plateforme de préparation à l'examen civique français<br/>
                  <a href="https://gocivique.fr/privacy" style="color:#9ca3af">Politique de confidentialité</a>
                </p>
              </div>
            </div>
          `,
        });
        if (!result.ok) console.error('Resend welcome error:', result.error);
      } else {
        console.log('[send-email] welcome:', { email, firstName, tier });
      }

      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // ─── Unknown type ─────────────────────────────────────────────
    return new Response(JSON.stringify({ error: 'Type inconnu' }), {
      status: 400,
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
