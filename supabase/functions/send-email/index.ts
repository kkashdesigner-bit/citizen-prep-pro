import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { buildEmailHtml } from './template.ts';
import {
  preflight, json, tooMany, clientIp, serviceClient,
  isServiceRoleRequest, getAuthedUser, rateLimit,
  escapeHtml, readJson, isValidEmail, str,
} from './shared.ts';

const FROM = 'GoCivique <noreply@gocivique.fr>';
const SUPPORT_EMAIL = 'gocivique@gmail.com';

// Types a normal authenticated user may trigger for THEIR OWN address.
const USER_TYPES = new Set(['signup_welcome', 'onboarding_complete', 'password_changed', 'welcome', 'subscription_activated']);
// Types reserved for internal (service-role) callers, e.g. stripe-webhook.
const INTERNAL_TYPES = new Set(['payment_failed', 'subscription_cancelled']);
// Types anyone may trigger (strictly rate-limited, fully validated).
const PUBLIC_TYPES = new Set(['contact', 'report']);

async function sendResendEmail(apiKey: string, payload: object): Promise<{ ok: boolean; error?: string }> {
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
    body: JSON.stringify({
      reply_to: SUPPORT_EMAIL,
      ...payload,
    }),
  });
  if (!res.ok) return { ok: false, error: await res.text() };
  return { ok: true };
}

const GOAL_LABELS: Record<string, string> = {
  naturalisation: 'la naturalisation française',
  carte_resident: "la carte de résident (CR)",
  csp: 'la carte de séjour pluriannuelle (CSP)',
};

serve(async (req) => {
  const pf = preflight(req);
  if (pf) return pf;
  if (req.method !== 'POST') return json(req, { error: 'Méthode non autorisée' }, 405);

  try {
    const body = await readJson<{ type?: unknown; data?: Record<string, unknown> }>(req);
    if (!body || typeof body.type !== 'string' || typeof body.data !== 'object' || body.data === null) {
      return json(req, { error: 'Requête invalide' }, 400);
    }
    const type = body.type;
    const data = body.data as Record<string, unknown>;

    const isInternal = isServiceRoleRequest(req);
    const supabase = serviceClient();
    const user = isInternal ? null : await getAuthedUser(req, supabase);
    const ip = clientIp(req);

    // ── Authorization by email type ──
    if (!isInternal) {
      if (INTERNAL_TYPES.has(type)) return json(req, { error: 'Non autorisé' }, 403);
      if (!PUBLIC_TYPES.has(type) && !USER_TYPES.has(type)) return json(req, { error: 'Type inconnu' }, 400);
      if (USER_TYPES.has(type) && type !== 'signup_welcome' && !user) {
        return json(req, { error: 'Non authentifié' }, 401);
      }
      // Rate limits: per IP always; per user when authenticated.
      const ipLimit = await rateLimit(supabase, `send-email:ip:${ip}`, 10, 900);
      if (!ipLimit.allowed) return tooMany(req, ipLimit.retryAfter);
      if (user) {
        const userLimit = await rateLimit(supabase, `send-email:user:${user.id}`, 10, 900);
        if (!userLimit.allowed) return tooMany(req, userLimit.retryAfter);
      }
    }

    const resendApiKey = Deno.env.get('RESEND_API_KEY');

    // For self-service lifecycle emails, the recipient is ALWAYS the authenticated
    // user's own address — never a client-supplied one (prevents spam relay).
    const selfRecipient = user?.email ?? null;

    // ─── Contact form (public, fully escaped) ───
    if (type === 'contact') {
      const name = str(data.name, 100);
      const email = str(data.email, 320);
      const subject = str(data.subject, 200);
      const message = str(data.message, 5000);
      if (!name || !message || !isValidEmail(email)) {
        return json(req, { error: 'Champs invalides (nom, email et message requis)' }, 400);
      }
      if (resendApiKey) {
        const result = await sendResendEmail(resendApiKey, {
          from: FROM,
          to: [SUPPORT_EMAIL],
          reply_to: email,
          subject: `[Contact] ${subject || 'Nouveau message'}`,
          html: `
            <div style="font-family:sans-serif;max-width:600px;margin:auto">
              <h2 style="color:#0055A4">Nouveau message de contact</h2>
              <p><strong>Nom :</strong> ${escapeHtml(name)}</p>
              <p><strong>Email :</strong> ${escapeHtml(email)}</p>
              <p><strong>Sujet :</strong> ${escapeHtml(subject) || '—'}</p>
              <hr style="border:1px solid #eee;margin:16px 0"/>
              <p><strong>Message :</strong></p>
              <p style="white-space:pre-wrap">${escapeHtml(message)}</p>
            </div>
          `,
        });
        if (!result.ok) console.error('Resend contact error:', result.error);
      }
      return json(req, { success: true });
    }

    // ─── Question report (public, fully escaped; reporter identity from JWT only) ───
    if (type === 'report') {
      const questionId = str(data.questionId, 64);
      const questionText = str(data.questionText, 1000);
      const reason = str(data.reason, 1000);
      if (!questionId || !reason) return json(req, { error: 'Champs invalides' }, 400);
      if (resendApiKey) {
        const result = await sendResendEmail(resendApiKey, {
          from: FROM,
          to: [SUPPORT_EMAIL],
          subject: `[Signalement] Question #${questionId.replace(/[^\w-]/g, '')}`,
          html: `
            <div style="font-family:sans-serif;max-width:600px;margin:auto">
              <h2 style="color:#EF4135">Signalement de question</h2>
              <p><strong>Question ID :</strong> ${escapeHtml(questionId)}</p>
              <p><strong>Utilisateur :</strong> ${escapeHtml(user?.id ?? 'Anonyme')}</p>
              <p><strong>Raison :</strong> ${escapeHtml(reason)}</p>
              <hr style="border:1px solid #eee;margin:16px 0"/>
              <p><strong>Texte de la question :</strong></p>
              <p style="background:#f5f5f5;padding:12px;border-radius:6px">${escapeHtml(questionText)}</p>
            </div>
          `,
        });
        if (!result.ok) console.error('Resend report error:', result.error);
      }
      return json(req, { success: true });
    }

    // Recipient + display name for lifecycle emails
    let recipient: string | null;
    if (isInternal) {
      recipient = isValidEmail(data.email) ? (data.email as string) : null;
    } else if (type === 'signup_welcome' && !user) {
      // Fired right after sign-up, before email confirmation (no session yet).
      // Strictly rate-limited per IP; recipient must be a valid address.
      const extra = await rateLimit(supabase, `send-email:signup:${ip}`, 3, 3600);
      if (!extra.allowed) return tooMany(req, extra.retryAfter);
      recipient = isValidEmail(data.email) ? (data.email as string) : null;
    } else {
      recipient = selfRecipient;
    }
    if (!recipient) return json(req, { error: 'Destinataire invalide' }, 400);

    const firstName = escapeHtml(str(data.firstName, 100));
    const tierRaw = str(data.tier, 20);
    const tierLabel = (tierRaw === 'premium' || tierRaw === 'lifetime') ? 'Premium' : 'Standard';

    // ─── Signup welcome ───
    if (type === 'signup_welcome') {
      const html = buildEmailHtml({
        preheader: 'Bienvenue ! Votre préparation à l’examen civique commence.',
        greeting: `Bienvenue${firstName ? `, ${firstName}` : ''} !`,
        heroImageUrl: 'https://gocivique.fr/examen-civique-auth-hero.jpg',
        blocks: [
          `Vous venez de créer votre compte sur <strong>GoCivique</strong> — la plateforme n°1 pour préparer l’examen civique français.`,
          `Voici ce qui vous attend :<br/>
          <ul style="line-height:2;padding-left:20px;margin-top:8px">
            <li><strong>+7 000 questions</strong> officielles et actualisées</li>
            <li><strong>Examens blancs</strong> chronométrés en conditions réelles</li>
            <li><strong>Parcours d’apprentissage</strong> personnalisé pas-à-pas</li>
            <li><strong>Suivi de progression</strong> intelligent en temps réel</li>
          </ul>`,
          `Commencez par configurer votre profil pour obtenir un parcours adapté à votre objectif.`,
        ],
        ctaText: 'Configurer mon profil →',
        ctaUrl: 'https://gocivique.fr/onboarding',
        showUnsubscribe: false,
      });
      if (resendApiKey) {
        const result = await sendResendEmail(resendApiKey, { from: FROM, to: [recipient], subject: 'Bienvenue sur GoCivique !', html });
        if (!result.ok) console.error('Resend signup_welcome error:', result.error);
      }
      return json(req, { success: true });
    }

    // ─── Onboarding complete ───
    if (type === 'onboarding_complete') {
      const goalLabel = GOAL_LABELS[str(data.goalType, 30)] || 'votre examen civique';
      const html = buildEmailHtml({
        preheader: 'Votre parcours personnalisé est prêt !',
        greeting: `${firstName ? `${firstName}, v` : 'V'}otre parcours est prêt !`,
        heroImageUrl: 'https://gocivique.fr/examen-civique-parcours-100-niveaux-desktop.jpg',
        blocks: [
          `Votre profil est configuré pour <strong>${goalLabel}</strong>. Nous avons personnalisé votre parcours d’apprentissage en conséquence.`,
          `<div style="background-color:#f0f7ff;border-radius:12px;padding:20px;border-left:4px solid #0055A4;border:1px solid #e0f2fe;">
            <strong style="color:#0369a1;display:block;margin-bottom:12px;font-size:14px;letter-spacing:0.5px;text-transform:uppercase;">Prochaines étapes recommandées :</strong>
            <span style="display:block;font-size:14px;line-height:1.6;">
              <strong>1. Répondez à la question du jour</strong><br/>Un excellent rituel quotidien pour ancrer vos connaissances.<br/><br/>
              <strong>2. Lancez un quiz flash (5 questions)</strong><br/>Idéal pour les sessions d’entraînement rapides.<br/><br/>
              <strong>3. Explorez le parcours citoyen</strong><br/>Gravissez les 100 niveaux thématiques pas-à-pas.
            </span>
          </div>`,
          `Plus vous pratiquez, plus notre algorithme s’adapte à vos points faibles pour vous faire progresser efficacement.`,
        ],
        ctaText: 'Commencer l’entraînement →',
        ctaUrl: 'https://gocivique.fr/learn',
        showUnsubscribe: false,
      });
      if (resendApiKey) {
        const result = await sendResendEmail(resendApiKey, { from: FROM, to: [recipient], subject: 'Votre parcours personnalisé est prêt !', html });
        if (!result.ok) console.error('Resend onboarding_complete error:', result.error);
      }
      return json(req, { success: true });
    }

    // ─── Password changed ───
    if (type === 'password_changed') {
      const html = buildEmailHtml({
        preheader: 'Votre mot de passe a été modifié avec succès.',
        greeting: `${firstName ? `${firstName}, m` : 'M'}ot de passe mis à jour`,
        blocks: [
          `Votre mot de passe GoCivique a été modifié avec succès.`,
          `<div style="background:#fef3c7;border-radius:10px;padding:16px;border-left:4px solid #f59e0b">
            <strong style="color:#92400e">⚠️ Si vous n’êtes pas à l’origine de cette modification</strong><br/>
            <span style="color:#78350f">Contactez-nous immédiatement à <a href="mailto:${SUPPORT_EMAIL}" style="color:#0055A4">${SUPPORT_EMAIL}</a> pour sécuriser votre compte.</span>
          </div>`,
        ],
        ctaText: 'Accéder à mon compte →',
        ctaUrl: 'https://gocivique.fr/learn',
        showUnsubscribe: false,
      });
      if (resendApiKey) {
        const result = await sendResendEmail(resendApiKey, { from: FROM, to: [recipient], subject: 'Mot de passe modifié avec succès', html });
        if (!result.ok) console.error('Resend password_changed error:', result.error);
      }
      return json(req, { success: true });
    }

    // ─── Payment failed (internal only) ───
    if (type === 'payment_failed') {
      const html = buildEmailHtml({
        preheader: 'Votre paiement n’a pas abouti — action requise.',
        greeting: `${firstName ? `${firstName}, u` : 'U'}n problème avec votre paiement`,
        blocks: [
          `Nous n’avons pas pu procéder au renouvellement de votre abonnement <strong>${tierLabel}</strong>.`,
          `<div style="background:#fef2f2;border-radius:10px;padding:16px;border-left:4px solid #ef4444">
            <strong style="color:#991b1b">Que se passe-t-il ?</strong><br/>
            <span style="color:#7f1d1d">Votre moyen de paiement a été refusé. Veuillez mettre à jour vos informations de paiement pour conserver votre accès.</span>
          </div>`,
          `Si le problème persiste, votre abonnement sera suspendu automatiquement.`,
        ],
        ctaText: 'Mettre à jour mon paiement →',
        ctaUrl: 'https://gocivique.fr/settings',
        showUnsubscribe: false,
      });
      if (resendApiKey) {
        const result = await sendResendEmail(resendApiKey, { from: FROM, to: [recipient], subject: 'Action requise : problème de paiement', html });
        if (!result.ok) console.error('Resend payment_failed error:', result.error);
      }
      return json(req, { success: true });
    }

    // ─── Subscription cancelled (internal only) ───
    if (type === 'subscription_cancelled') {
      const html = buildEmailHtml({
        preheader: 'Votre abonnement GoCivique a pris fin.',
        greeting: `${firstName ? `${firstName}, v` : 'V'}otre abonnement a pris fin`,
        blocks: [
          `Votre abonnement <strong>${tierLabel}</strong> est désormais terminé. Vous êtes repassé(e) au plan Gratuit.`,
          `<div style="background:#f0f5ff;border-radius:10px;padding:16px;border-left:4px solid #0055A4">
            <strong style="color:#0055A4">Ce que vous perdez :</strong><br/>
            <span style="color:#4b5563">• Examens blancs illimités<br/>
            • Parcours d’apprentissage complet<br/>
            • Traduction instantanée<br/>
            • Entraînement par catégorie</span>
          </div>`,
          `Vous pouvez réactiver votre abonnement à tout moment pour reprendre où vous en étiez.`,
        ],
        ctaText: 'Réactiver mon abonnement →',
        ctaUrl: 'https://gocivique.fr/#pricing',
        showUnsubscribe: true,
      });
      if (resendApiKey) {
        const result = await sendResendEmail(resendApiKey, { from: FROM, to: [recipient], subject: 'Votre abonnement GoCivique a pris fin', html });
        if (!result.ok) console.error('Resend subscription_cancelled error:', result.error);
      }
      return json(req, { success: true });
    }

    // ─── Welcome / subscription confirmation ───
    if (type === 'welcome' || type === 'subscription_activated') {
      const isTrial = tierRaw === 'standard' || tierRaw === 'yearly';
      
      const blocks = [
        isTrial 
          ? `Votre essai gratuit de 3 jours au plan <strong>Standard</strong> a commencé ! Vous ne serez pas débité(e) pendant l'essai et vous pouvez annuler à tout moment en un clic depuis vos paramètres.`
          : `Votre abonnement <strong>${tierLabel}</strong> est maintenant actif. Vous avez accès à l’ensemble de la plateforme GoCivique.`,
        `<ul style="color:#4b5563;line-height:2;padding-left:20px">
          <li>Examens blancs illimités (40 questions, 45 min)</li>
          <li>Parcours d’apprentissage complet (100 classes)</li>
          <li>Traduction instantanée des questions</li>
          <li>Suivi de progression en temps réel</li>
        </ul>`,
        `Si vous rencontrez le moindre problème ou si vous avez des questions, répondez simplement à cet e-mail ou écrivez-nous à <strong>${SUPPORT_EMAIL}</strong>. Nous sommes là pour vous aider !`
      ];

      const html = buildEmailHtml({
        preheader: isTrial 
          ? `Votre essai gratuit Standard de 3 jours commence maintenant !` 
          : `Votre abonnement ${tierLabel} est actif !`,
        greeting: `Bienvenue${firstName ? `, ${firstName}` : ''} !`,
        heroImageUrl: isTrial 
          ? 'https://gocivique.fr/examen-civique-nationalite-standard-gocivique.png' 
          : 'https://gocivique.fr/examen-civique-nationalite-premium-gocivique.png',
        blocks,
        ctaText: 'Commencer l’entraînement →',
        ctaUrl: 'https://gocivique.fr/learn',
        showUnsubscribe: false,
      });
      if (resendApiKey) {
        const subject = isTrial 
          ? `Votre essai gratuit de 3 jours GoCivique Standard est activé !` 
          : `Bienvenue sur GoCivique ${tierLabel} !`;
        const result = await sendResendEmail(resendApiKey, { from: FROM, to: [recipient], subject, html });
        if (!result.ok) console.error('Resend welcome error:', result.error);
      }
      return json(req, { success: true });
    }

    return json(req, { error: 'Type inconnu' }, 400);
  } catch (err) {
    console.error('send-email error:', err);
    return json(req, { error: 'Erreur interne' }, 500);
  }
});
