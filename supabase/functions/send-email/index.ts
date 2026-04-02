import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { buildEmailHtml } from './template.ts';

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

const GOAL_LABELS: Record<string, string> = {
  naturalisation: 'la naturalisation fran\u00e7aise',
  carte_resident: "la carte de r\u00e9sident (CR)",
  csp: 'la carte de s\u00e9jour pluriannuelle (CSP)',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { type, data } = await req.json();
    const resendApiKey = Deno.env.get('RESEND_API_KEY');

    // ─── Contact form ───
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
              <p><strong>Sujet :</strong> ${subject || '\u2014'}</p>
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

    // ─── Question report ───
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

    // ─── Signup welcome ───
    if (type === 'signup_welcome') {
      const { email, firstName } = data;
      const name = firstName || '';
      const html = buildEmailHtml({
        preheader: 'Bienvenue ! Votre pr\u00e9paration \u00e0 l\u2019examen civique commence.',
        greeting: `Bienvenue${name ? `, ${name}` : ''} !`,
        blocks: [
          `Vous venez de cr\u00e9er votre compte sur <strong>GoCivique</strong> \u2014 la plateforme n\u00b01 pour pr\u00e9parer l\u2019examen civique fran\u00e7ais.`,
          `Voici ce qui vous attend :<br/>
          <ul style="color:#4b5563;line-height:2;padding-left:20px">
            <li>+7 000 questions officielles actualis\u00e9es</li>
            <li>Examens blancs en conditions r\u00e9elles</li>
            <li>Parcours d\u2019apprentissage personnalis\u00e9</li>
            <li>Suivi de progression en temps r\u00e9el</li>
          </ul>`,
          `Commencez par configurer votre profil pour obtenir un parcours adapt\u00e9 \u00e0 votre objectif.`,
        ],
        ctaText: 'Configurer mon profil \u2192',
        ctaUrl: 'https://gocivique.fr/onboarding',
        showUnsubscribe: false,
      });
      if (resendApiKey) {
        const result = await sendResendEmail(resendApiKey, {
          from: FROM, to: [email], subject: 'Bienvenue sur GoCivique !', html,
        });
        if (!result.ok) console.error('Resend signup_welcome error:', result.error);
      } else {
        console.log('[send-email] signup_welcome:', { email, firstName });
      }
      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // ─── Onboarding complete ───
    if (type === 'onboarding_complete') {
      const { email, firstName, goalType } = data;
      const name = firstName || '';
      const goalLabel = GOAL_LABELS[goalType] || 'votre examen civique';
      const html = buildEmailHtml({
        preheader: 'Votre parcours personnalis\u00e9 est pr\u00eat !',
        greeting: `${name ? `${name}, v` : 'V'}otre parcours est pr\u00eat !`,
        blocks: [
          `Votre profil est configur\u00e9 pour <strong>${goalLabel}</strong>. Nous avons personnalis\u00e9 votre parcours d\u2019apprentissage en cons\u00e9quence.`,
          `<div style="background:#f0f5ff;border-radius:10px;padding:16px;border-left:4px solid #0055A4">
            <strong style="color:#0055A4">Prochaines \u00e9tapes recommand\u00e9es :</strong><br/>
            <span style="color:#4b5563">1. R\u00e9pondez \u00e0 la question du jour<br/>
            2. Lancez un quiz flash (5 questions)<br/>
            3. Explorez le parcours citoyen</span>
          </div>`,
          `Plus vous pratiquez, plus notre algorithme s\u2019adapte \u00e0 vos points faibles.`,
        ],
        ctaText: 'Commencer l\u2019entra\u00eenement \u2192',
        ctaUrl: 'https://gocivique.fr/learn',
        showUnsubscribe: false,
      });
      if (resendApiKey) {
        const result = await sendResendEmail(resendApiKey, {
          from: FROM, to: [email], subject: 'Votre parcours personnalis\u00e9 est pr\u00eat !', html,
        });
        if (!result.ok) console.error('Resend onboarding_complete error:', result.error);
      } else {
        console.log('[send-email] onboarding_complete:', { email, firstName, goalType });
      }
      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // ─── Password changed ───
    if (type === 'password_changed') {
      const { email, firstName } = data;
      const name = firstName || '';
      const html = buildEmailHtml({
        preheader: 'Votre mot de passe a \u00e9t\u00e9 modifi\u00e9 avec succ\u00e8s.',
        greeting: `${name ? `${name}, m` : 'M'}ot de passe mis \u00e0 jour`,
        blocks: [
          `Votre mot de passe GoCivique a \u00e9t\u00e9 modifi\u00e9 avec succ\u00e8s.`,
          `<div style="background:#fef3c7;border-radius:10px;padding:16px;border-left:4px solid #f59e0b">
            <strong style="color:#92400e">\u26a0\ufe0f Si vous n\u2019\u00eates pas \u00e0 l\u2019origine de cette modification</strong><br/>
            <span style="color:#78350f">Contactez-nous imm\u00e9diatement \u00e0 <a href="mailto:${SUPPORT_EMAIL}" style="color:#0055A4">${SUPPORT_EMAIL}</a> pour s\u00e9curiser votre compte.</span>
          </div>`,
        ],
        ctaText: 'Acc\u00e9der \u00e0 mon compte \u2192',
        ctaUrl: 'https://gocivique.fr/learn',
        showUnsubscribe: false,
      });
      if (resendApiKey) {
        const result = await sendResendEmail(resendApiKey, {
          from: FROM, to: [email], subject: 'Mot de passe modifi\u00e9 avec succ\u00e8s', html,
        });
        if (!result.ok) console.error('Resend password_changed error:', result.error);
      } else {
        console.log('[send-email] password_changed:', { email });
      }
      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // ─── Payment failed ───
    if (type === 'payment_failed') {
      const { email, firstName, tier } = data;
      const name = firstName || '';
      const tierLabel = tier === 'premium' ? 'Premium' : 'Standard';
      const html = buildEmailHtml({
        preheader: 'Votre paiement n\u2019a pas abouti \u2014 action requise.',
        greeting: `${name ? `${name}, u` : 'U'}n probl\u00e8me avec votre paiement`,
        blocks: [
          `Nous n\u2019avons pas pu proc\u00e9der au renouvellement de votre abonnement <strong>${tierLabel}</strong>.`,
          `<div style="background:#fef2f2;border-radius:10px;padding:16px;border-left:4px solid #ef4444">
            <strong style="color:#991b1b">Que se passe-t-il ?</strong><br/>
            <span style="color:#7f1d1d">Votre moyen de paiement a \u00e9t\u00e9 refus\u00e9. Veuillez mettre \u00e0 jour vos informations de paiement pour conserver votre acc\u00e8s.</span>
          </div>`,
          `Si le probl\u00e8me persiste, votre abonnement sera suspendu automatiquement.`,
        ],
        ctaText: 'Mettre \u00e0 jour mon paiement \u2192',
        ctaUrl: 'https://gocivique.fr/settings',
        showUnsubscribe: false,
      });
      if (resendApiKey) {
        const result = await sendResendEmail(resendApiKey, {
          from: FROM, to: [email], subject: 'Action requise : probl\u00e8me de paiement', html,
        });
        if (!result.ok) console.error('Resend payment_failed error:', result.error);
      } else {
        console.log('[send-email] payment_failed:', { email, tier });
      }
      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // ─── Subscription cancelled ───
    if (type === 'subscription_cancelled') {
      const { email, firstName, tier } = data;
      const name = firstName || '';
      const tierLabel = tier === 'premium' ? 'Premium' : 'Standard';
      const html = buildEmailHtml({
        preheader: 'Votre abonnement GoCivique a pris fin.',
        greeting: `${name ? `${name}, v` : 'V'}otre abonnement a pris fin`,
        blocks: [
          `Votre abonnement <strong>${tierLabel}</strong> est d\u00e9sormais termin\u00e9. Vous \u00eates repass\u00e9(e) au plan Gratuit.`,
          `<div style="background:#f0f5ff;border-radius:10px;padding:16px;border-left:4px solid #0055A4">
            <strong style="color:#0055A4">Ce que vous perdez :</strong><br/>
            <span style="color:#4b5563">\u2022 Examens blancs illimit\u00e9s<br/>
            \u2022 Parcours d\u2019apprentissage complet<br/>
            \u2022 Traduction instantan\u00e9e<br/>
            \u2022 Entra\u00eenement par cat\u00e9gorie</span>
          </div>`,
          `Vous pouvez r\u00e9activer votre abonnement \u00e0 tout moment pour reprendre o\u00f9 vous en \u00e9tiez.`,
        ],
        ctaText: 'R\u00e9activer mon abonnement \u2192',
        ctaUrl: 'https://gocivique.fr/#pricing',
        showUnsubscribe: true,
      });
      if (resendApiKey) {
        const result = await sendResendEmail(resendApiKey, {
          from: FROM, to: [email], subject: 'Votre abonnement GoCivique a pris fin', html,
        });
        if (!result.ok) console.error('Resend subscription_cancelled error:', result.error);
      } else {
        console.log('[send-email] subscription_cancelled:', { email, tier });
      }
      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // ─── Welcome / subscription confirmation (existing, refactored) ───
    if (type === 'welcome' || type === 'subscription_activated') {
      const { email, firstName, tier } = data;
      const name = firstName || '';
      const tierLabel = tier === 'premium' ? 'Premium' : 'Standard';
      const html = buildEmailHtml({
        preheader: `Votre abonnement ${tierLabel} est actif !`,
        greeting: `Bienvenue${name ? `, ${name}` : ''} !`,
        blocks: [
          `Votre abonnement <strong>${tierLabel}</strong> est maintenant actif. Vous avez acc\u00e8s \u00e0 l\u2019ensemble de la plateforme GoCivique.`,
          `<ul style="color:#4b5563;line-height:2;padding-left:20px">
            <li>Examens blancs illimit\u00e9s (40 questions, 45 min)</li>
            <li>Parcours d\u2019apprentissage complet (100 classes)</li>
            <li>Traduction instantan\u00e9e des questions</li>
            <li>Suivi de progression en temps r\u00e9el</li>
          </ul>`,
        ],
        ctaText: 'Commencer l\u2019entra\u00eenement \u2192',
        ctaUrl: 'https://gocivique.fr/learn',
        showUnsubscribe: false,
      });
      if (resendApiKey) {
        const result = await sendResendEmail(resendApiKey, {
          from: FROM, to: [email], subject: `Bienvenue sur GoCivique ${tierLabel} !`, html,
        });
        if (!result.ok) console.error('Resend welcome error:', result.error);
      } else {
        console.log('[send-email] welcome:', { email, firstName, tier });
      }
      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // ─── Unknown type ───
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
