import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { json, isServiceRoleRequest, getAuthedUser, isValidEmail } from './shared.ts';

const BRAND_PRIMARY = '#0055A4';
const BRAND_GRADIENT_END = '#1B6ED6';
const FROM = 'GoCivique <noreply@gocivique.fr>';

// ── Campaign identifiers ──
type CampaignId = '7000_questions' | 'exam_60d';
const CAMPAIGN_DEDUP_TYPE: Record<CampaignId, string> = {
  '7000_questions': 'email_campaign_7000_questions',
  'exam_60d':       'email_campaign_exam_60d_subscribe',
};

function buildHtml(opts: {
  preheader?: string;
  greeting: string;
  blocks: string[];
  ctaText?: string;
  ctaUrl?: string;
  footerExtra?: string;
}): string {
  const cta = opts.ctaText && opts.ctaUrl ? `
    <div style="text-align:center;margin:32px 0">
      <a href="${opts.ctaUrl}" style="background:${BRAND_PRIMARY};color:#fff;padding:14px 32px;border-radius:10px;text-decoration:none;font-weight:700;font-size:16px;display:inline-block">
        ${opts.ctaText}
      </a>
    </div>` : '';

  return `<!DOCTYPE html>
<html lang="fr">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f3f4f6;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif">
  ${opts.preheader ? `<div style="display:none;max-height:0;overflow:hidden">${opts.preheader}</div>` : ''}
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f3f4f6">
    <tr><td align="center" style="padding:32px 16px">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#fff;border-radius:12px;overflow:hidden;border:1px solid #e5e7eb">
        <tr><td style="background:linear-gradient(135deg,${BRAND_PRIMARY},${BRAND_GRADIENT_END});padding:40px 32px;text-align:center">
          <h1 style="color:#fff;margin:0;font-size:28px;font-weight:900;letter-spacing:-0.5px">GoCivique</h1>
          <p style="color:rgba(255,255,255,0.8);margin:8px 0 0;font-size:14px">La voie vers la citoyenneté française</p>
        </td></tr>
        <tr><td style="padding:32px">
          <h2 style="color:#1a1a1a;margin:0 0 16px;font-size:20px">${opts.greeting}</h2>
          ${opts.blocks.map(b => `<div style="color:#4b5563;line-height:1.7;margin-bottom:16px;font-size:15px">${b}</div>`).join('')}
          ${cta}
          ${opts.footerExtra ? `<div style="color:#6b7280;font-size:13px;text-align:center;margin-top:8px">${opts.footerExtra}</div>` : ''}
          <p style="color:#6b7280;font-size:13px;text-align:center;margin-top:24px">
            Une question ? <a href="mailto:support@gocivique.fr" style="color:${BRAND_PRIMARY}">support@gocivique.fr</a>
          </p>
        </td></tr>
        <tr><td style="background:#f9fafb;padding:20px 32px;border-top:1px solid #e5e7eb;text-align:center">
          <p style="color:#9ca3af;font-size:12px;margin:0">
            GoCivique · Plateforme de préparation à l'examen civique français<br/>
            <a href="https://gocivique.fr/privacy" style="color:#9ca3af">Politique de confidentialité</a>
          </p>
          <p style="color:#9ca3af;font-size:11px;margin:8px 0 0">
            Vous ne souhaitez plus recevoir ces emails ?
            <a href="https://gocivique.fr/settings" style="color:#9ca3af;text-decoration:underline">Se désabonner</a>
          </p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

function buildFreeEmail(firstName: string): { subject: string; html: string } {
  const name = firstName ? `Bonjour ${firstName} !` : 'Bonjour !';
  return {
    subject: '7 232 questions, de nouveaux modes — tout vous attend sur GoCivique',
    html: buildHtml({
      preheader: "Plus de 7 000 questions officielles, des modes d'entraînement inédits — votre passeport vous attend.",
      greeting: name,
      blocks: [
        `Depuis votre inscription sur <strong>GoCivique</strong>, vous préparez votre examen civique. Nous avons une grande nouvelle : la plateforme vient d'être enrichie de fonctionnalités majeures que nous voulions vous faire découvrir.`,
        `<div style="background:#f0f5ff;border-radius:10px;padding:16px;border-left:4px solid #0055A4">
          <strong style="color:#0055A4">Ce que les membres Standard et Premium ont maintenant :</strong><br/><br/>
          • <strong>7 232 questions officielles</strong> (CSP, Carte de résident, Naturalisation)<br/>
          • Mode <strong>"Questions Inédites"</strong> — ne répondez jamais deux fois à la même question<br/>
          • Mode <strong>"Révision des Erreurs"</strong> — rejouer exactement les questions ratées<br/>
          • Mode <strong>"Maîtrise par Catégorie"</strong> — progresser jusqu'à 85 % par thème<br/>
          • Mode <strong>"Difficile"</strong> — les questions les plus redoutées statistiquement<br/>
          • <strong>Difficulté adaptative</strong> — l'algorithme ajuste le niveau en temps réel
        </div>`,
        `En version gratuite, vous avez accès à un aperçu de la plateforme. Pour débloquer la totalité des <strong>7 232 questions</strong> et ces nouveaux modes d'entraînement, un abonnement Standard suffit — et il est disponible dès maintenant.`,
        `Votre examen se rapproche. C'est maintenant qu'il faut passer la vitesse supérieure.`,
      ],
      ctaText: 'Débloquer les 7 232 questions →',
      ctaUrl: 'https://gocivique.fr/#pricing',
      footerExtra: 'À partir de quelques euros par mois · Annulable à tout moment',
    }),
  };
}

function buildPaidEmail(firstName: string, tier: string): { subject: string; html: string } {
  const name = firstName ? `Bonjour ${firstName} !` : 'Bonjour !';
  const tierLabel = tier === 'premium' ? 'Premium' : 'Standard';
  return {
    subject: 'Nouveau : explorez 7 232 questions et des modes inédits',
    html: buildHtml({
      preheader: "Nous venons d'ajouter des fonctionnalités majeures — vos 7 232 questions n'attendent que vous.",
      greeting: name,
      blocks: [
        `En tant que membre <strong>${tierLabel}</strong>, vous faites partie des utilisateurs GoCivique qui ont accès à la base complète de <strong>7 232 questions officielles</strong>. Nous venons d'enrichir la plateforme avec plusieurs nouveaux modes d'entraînement disponibles dès maintenant dans votre compte.`,
        `<div style="background:#f0fdf4;border-radius:10px;padding:16px;border-left:4px solid #059669">
          <strong style="color:#059669">Nouvelles fonctionnalités disponibles dans votre espace :</strong><br/><br/>
          ✅ <strong>Questions Inédites</strong> — filtrez les questions que vous n'avez jamais vues<br/>
          ✅ <strong>Révision des Erreurs</strong> — réentraînez-vous précisément sur vos erreurs passées<br/>
          ✅ <strong>Entraînement par Niveau</strong> — ciblez CSP, Carte de résident ou Naturalisation<br/>
          ✅ <strong>Mode Difficile</strong> — les 500 questions au taux de réussite le plus faible<br/>
          ✅ <strong>Maîtrise par Catégorie</strong> — mesurez votre maîtrise sur chacun des 5 thèmes<br/>
          ✅ <strong>Difficulté Adaptative</strong> — l'algorithme monte le niveau quand vous progressez
        </div>`,
        `Ces modes sont accessibles depuis la page <strong>Examens</strong> et le tableau de bord. Si vous avez déjà répondu à des centaines de questions, le mode <strong>"Questions Inédites"</strong> vous permettra de plonger dans un vivier entièrement nouveau.`,
      ],
      ctaText: 'Découvrir les nouveaux modes →',
      ctaUrl: 'https://gocivique.fr/exams',
    }),
  };
}

function buildExam60dFreeEmail(firstName: string, daysLeft: number | null, timeline: string | null): { subject: string; html: string } {
  const name = firstName || 'Sha';
  
  let badgeText = '';
  let subheader = '';
  let introPara = '';
  let subject = '';
  let ctaText = '🎁 Commencer mes 3 jours gratuits';
  
  if (daysLeft !== null) {
    const dLabel = daysLeft === 1 ? '1 jour' : `${daysLeft} jours`;
    badgeText = `🔴 J−${daysLeft} avant le grand jour`;
    subheader = `Bonjour ${name}, imaginez le jour de votre cérémonie...`;
    introPara = `Imaginez la fierté de signer votre décret de naturalisation et de chanter la Marseillaise en tant que citoyen(ne) français(e). Vous avez surmonté des mois de dossiers administratifs et de stress en préfecture. <strong>Ne gâchez pas tous ces efforts à cause de l'examen civique.</strong> Pour réussir, vous devez obtenir au moins <strong>32 bonnes réponses sur 40</strong>. Ne prenez aucun risque le jour J.`;
    subject = `🇫🇷 Plus que ${daysLeft} jours, ${name} — ne laissez pas un simple examen bloquer votre parcours`;
    ctaText = '🎁 Sécuriser mon examen (3 jours gratuits)';
  } else {
    let timelineLabel = 'quelques mois';
    if (timeline === 'less_1_month') timelineLabel = "moins d'un mois";
    else if (timeline === '1_3_months') timelineLabel = "1 à 3 mois";
    else if (timeline === 'more_3_months') timelineLabel = "plus de 3 mois";
    
    badgeText = `🇫🇷 Objectif : ${timelineLabel}`;
    subheader = `Bonjour ${name}, la France vous attend !`;
    introPara = `Devenir citoyen(ne) français(e) d'ici <strong>${timelineLabel}</strong> n'est pas seulement un projet administratif, c'est le début d'une nouvelle vie. Mais le parcours de la préfecture est long et semé d'embûches. <strong>Échouer à l'examen civique vous renverrait à la case départ.</strong> Évitez cette déception et cette perte de temps en installant une habitude simple dès aujourd'hui.`;
    subject = `🐓 ${name}, devenir Français d'ici ${timelineLabel} ? C'est maintenant que tout commence`;
  }

  const html = `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <meta name="x-apple-disable-message-reformatting">
  <title>GoCivique</title>
</head>
<body style="margin:0;padding:0;background-color:#f8fafc;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;-webkit-font-smoothing:antialiased;">
  <div style="display:none;max-height:0;overflow:hidden;mso-hide:all;">${subject}</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f8fafc;">
    <tr>
      <td align="center" style="padding:32px 16px;">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background-color:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #e2e8f0;box-shadow:0 4px 20px rgba(0,0,0,0.05);">
          
          <!-- Top Tricolore Bar -->
          <tr>
            <td style="height:6px;line-height:6px;font-size:0;background:linear-gradient(90deg,#0055A4 0%,#0055A4 33%,#ffffff 33%,#ffffff 66%,#EF4135 66%,#EF4135 100%);">&nbsp;</td>
          </tr>

          <!-- Hero Image -->
          <tr>
            <td style="padding:0;text-align:center;">
              <img src="https://gocivique.fr/examen-civique-hero-email.jpg" width="100%" alt="GoCivique" style="display:block;width:100%;max-width:600px;height:auto;" />
            </td>
          </tr>

          <!-- Badge -->
          <tr>
            <td style="padding:0;text-align:center;">
              <div style="margin:-20px auto 0;display:inline-block;background-color:#EF4135;color:#ffffff;font-weight:900;font-size:20px;padding:8px 24px;border-radius:999px;border:4px solid #ffffff;box-shadow:0 4px 12px rgba(239,65,53,0.3);">
                ${badgeText}
              </div>
            </td>
          </tr>

          <!-- Body Content -->
          <tr>
            <td style="padding:32px;">
              <h2 style="color:#0f172a;margin:0 0 16px;font-size:22px;font-weight:800;line-height:1.3;text-align:center;">
                ${subheader}
              </h2>
              
              <p style="color:#475569;line-height:1.625;font-size:15px;text-align:center;margin:0 0 24px;">
                ${introPara}
              </p>

              <!-- First Look CTA -->
              <div style="text-align:center;margin:24px 0 32px;">
                <a href="https://gocivique.fr/#pricing" style="background-color:#0055A4;color:#ffffff;padding:16px 36px;border-radius:12px;text-decoration:none;font-weight:800;font-size:16px;display:inline-block;box-shadow:0 4px 12px rgba(0,85,164,0.25);">
                  ${ctaText}
                </a>
                <p style="margin:8px 0 0;font-size:12px;color:#64748b;">
                  Essai gratuit de 3 jours · Annulation gratuite en 1 clic
                </p>
              </div>

              <!-- Testimony Box -->
              <div style="background-color:#eff6ff;border:1px solid #bfdbfe;border-radius:14px;padding:16px 20px;margin-bottom:24px;text-align:center;">
                <p style="margin:0;font-size:14px;color:#1e40af;line-height:1.6;">
                  💡 <strong>Le saviez-vous ?</strong> Plus de 95% de nos utilisateurs réussissent l'examen civique officiel du premier coup en révisant seulement <strong>15 à 30 minutes par jour</strong> sur GoCivique !
                </p>
              </div>

              <!-- Closing -->
              <p style="color:#334155;font-size:14px;line-height:1.6;text-align:center;margin:0;">
                Mettez toutes les chances de votre côté.<br/>
                <strong>Le coq croit en vous ! 🐓🇫🇷</strong>
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color:#f8fafc;padding:24px 32px;border-top:1px solid #e2e8f0;text-align:center;">
              <p style="color:#94a3b8;font-size:12px;margin:0;">
                GoCivique · Préparation examen civique<br/>
                <a href="https://gocivique.fr/privacy" style="color:#64748b;">Politique de confidentialité</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  return { subject, html };
}

function buildExam60dPaidEmail(firstName: string, daysLeft: number | null, timeline: string | null, tier: string): { subject: string; html: string } {
  const name = firstName || 'Sha';
  const tierLabel = tier === 'premium' ? 'Premium' : 'Standard';

  let badgeText = '';
  let subheader = '';
  let introPara = '';
  let subject = '';
  
  if (daysLeft !== null) {
    const dLabel = daysLeft === 1 ? '1 jour' : `${daysLeft} jours`;
    badgeText = `J−${daysLeft} avant l'examen`;
    subheader = `Bonjour ${name}, vous y êtes presque !`;
    introPara = `Votre examen civique approche : il ne reste que <strong>${dLabel}</strong>. En tant que membre ${tierLabel}, vous disposez de tous les outils nécessaires pour réussir du premier coup. Voici votre checklist finale de préparation :`;
    subject = `Plus que ${daysLeft} jours — avez-vous exploré les 7 232 questions ?`;
  } else {
    let timelineLabel = 'quelques mois';
    if (timeline === 'less_1_month') timelineLabel = "moins d'un mois";
    else if (timeline === '1_3_months') timelineLabel = "1 à 3 mois";
    else if (timeline === 'more_3_months') timelineLabel = "plus de 3 mois";
    
    badgeText = `Objectif : ${timelineLabel}`;
    subheader = `Bonjour ${name}, maximisez vos révisions !`;
    introPara = `Votre objectif est de passer l'examen d'ici <strong>${timelineLabel}</strong>. En tant que membre ${tierLabel}, vous avez accès à l'intégralité des outils de GoCivique. Suivez notre checklist pour être 100% prêt le jour J :`;
    subject = `Objectif d'ici ${timelineLabel} — continuez sur votre lancée !`;
  }

  const html = `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>GoCivique</title>
</head>
<body style="margin:0;padding:0;background-color:#f8fafc;font-family:sans-serif;">
  <div style="display:none;">${subject}</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f8fafc;">
    <tr>
      <td align="center" style="padding:32px 16px;">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background-color:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #e2e8f0;">
          
          <tr><td style="height:6px;background:linear-gradient(90deg,#0055A4 0%,#0055A4 33%,#ffffff 33%,#ffffff 66%,#EF4135 66%,#EF4135 100%);"></td></tr>
          
          <tr><td style="padding:0;text-align:center;"><img src="https://gocivique.fr/examen-civique-hero-email.jpg" width="100%" style="display:block;width:100%;max-width:600px;" /></td></tr>
          
          <tr><td style="padding:0;text-align:center;">
            <div style="margin:-20px auto 0;display:inline-block;background-color:#059669;color:#ffffff;font-weight:900;font-size:20px;padding:8px 24px;border-radius:999px;border:4px solid #ffffff;">
              ${badgeText}
            </div>
          </td></tr>

          <tr>
            <td style="padding:32px;">
              <h2 style="color:#0f172a;margin:0 0 16px;font-size:22px;text-align:center;">${subheader}</h2>
              <p style="color:#475569;line-height:1.6;font-size:15px;text-align:center;margin:0 0 24px;">${introPara}</p>

              <div style="text-align:center;margin:24px 0 32px;">
                <a href="https://gocivique.fr/exams" style="background-color:#0055A4;color:#ffffff;padding:16px 36px;border-radius:12px;text-decoration:none;font-weight:800;display:inline-block;">
                  ⚡ Continuer mon entraînement →
                </a>
              </div>

              <div style="background-color:#f0fdf4;border:1px solid #bbf7d0;border-radius:14px;padding:20px;border-left:4px solid #059669;">
                <p style="margin:0 0 12px;font-weight:800;color:#0f5132;">📋 Checklist finale :</p>
                <table role="presentation" width="100%" style="color:#1e293b;font-size:14px;">
                  <tr><td style="padding-bottom:10px;">✅ <strong>Questions Inédites :</strong> Ciblez les questions non vues.</td></tr>
                  <tr><td style="padding-bottom:10px;">✅ <strong>Révision des Erreurs :</strong> Videz votre boîte d'erreurs.</td></tr>
                  <tr><td>✅ <strong>Examens Blancs :</strong> Visez 32/40 en conditions réelles.</td></tr>
                </table>
              </div>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  return { subject, html };
}

async function sendEmail(apiKey: string, to: string, subject: string, html: string): Promise<boolean> {
  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({ from: FROM, to: [to], subject, html }),
    });
    if (!res.ok) {
      console.error(`Resend error for ${to}:`, await res.text());
      return false;
    }
    return true;
  } catch (err) {
    console.error(`Resend exception for ${to}:`, err);
    return false;
  }
}

serve(async (req) => {
  // Admin-only endpoint: service-role callers, users with custom secret header, or users with the 'admin' role.
  const customAuthHeader = req.headers.get('x-custom-auth');
  const isCustomAuthorized = customAuthHeader === 'GoCiviqueCampaignTriggerToken2026';

  if (!isServiceRoleRequest(req) && !isCustomAuthorized) {
    const gateClient = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    );
    const user = await getAuthedUser(req, gateClient);
    if (!user) return json(req, { error: 'Forbidden' }, 403);
    const { data: roleRow } = await gateClient
      .from('user_roles')
      .select('id')
      .eq('user_id', user.id)
      .eq('role', 'admin')
      .maybeSingle();
    if (!roleRow) return json(req, { error: 'Forbidden' }, 403);
  }

  try {
    const url = new URL(req.url);
    const dryRun = url.searchParams.get('dry_run') === 'true';
    const testEmailRaw = url.searchParams.get('test_email');
    const testEmail = isValidEmail(testEmailRaw) ? testEmailRaw : null;

    const campaignParam = url.searchParams.get('campaign') ?? '7000_questions';
    const campaign: CampaignId = campaignParam === 'exam_60d' ? 'exam_60d' : '7000_questions';
    const dedupType = CAMPAIGN_DEDUP_TYPE[campaign];

    const resendApiKey = Deno.env.get('RESEND_API_KEY');
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

    if (!resendApiKey) {
      return new Response(JSON.stringify({ error: 'RESEND_API_KEY not set' }), { status: 500 });
    }

    // ── Test mode: send multiple variants to a single address ──
    if (testEmail) {
      if (campaign === 'exam_60d') {
        const freeCountdown = buildExam60dFreeEmail('Sha', 15, null);
        const freeTimeline = buildExam60dFreeEmail('Sha', null, '1_3_months');

        const freeCok = dryRun ? true : await sendEmail(resendApiKey, testEmail, `[TEST FREE] [J-15] ${freeCountdown.subject}`, freeCountdown.html);
        const freeTok = dryRun ? true : await sendEmail(resendApiKey, testEmail, `[TEST FREE] [Timeline] ${freeTimeline.subject}`, freeTimeline.html);

        console.log(`Test send to ${testEmail} (campaign=${campaign}): dry_run=${dryRun}`);
        return new Response(
          JSON.stringify({ 
            test_email: testEmail, 
            campaign, 
            free_countdown_sent: freeCok, 
            free_timeline_sent: freeTok,
            dry_run: dryRun 
          }),
          { headers: { 'Content-Type': 'application/json' } }
        );
      } else {
        const freeEmail = buildFreeEmail('Sha');
        const paidEmail = buildPaidEmail('Sha', 'standard');
        const freeOk = dryRun ? true : await sendEmail(resendApiKey, testEmail, `[TEST FREE] ${freeEmail.subject}`, freeEmail.html);
        const paidOk = dryRun ? true : await sendEmail(resendApiKey, testEmail, `[TEST PAID] ${paidEmail.subject}`, paidEmail.html);
        return new Response(
          JSON.stringify({ test_email: testEmail, campaign, free_sent: freeOk, paid_sent: paidOk, dry_run: dryRun }),
          { headers: { 'Content-Type': 'application/json' } },
        );
      }
    }

    // ── Bulk mode: send to all eligible users ──
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Compute 60-day window once (normalised to midnight UTC)
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);
    const cutoffDate = new Date(today);
    cutoffDate.setDate(cutoffDate.getDate() + 60);

    const { data: users } = await supabase
      .from('profiles')
      .select('id, email, display_name, subscription_tier, email_opt_out, created_at')
      .not('email', 'is', null);

    if (!users || users.length === 0) {
      return new Response(JSON.stringify({ message: 'No users found', sent: 0 }));
    }

    const userIds = users.map((u: any) => u.id);
    const { data: profileRows } = await supabase
      .from('user_profile')
      .select('user_id, first_name, exam_date, timeline')
      .in('user_id', userIds);

    const profileMap: Record<string, { first_name: string; exam_date: string | null; timeline: string | null }> = {};
    for (const p of profileRows || []) {
      profileMap[p.user_id] = { 
        first_name: p.first_name || '', 
        exam_date: p.exam_date ?? null,
        timeline: p.timeline ?? null
      };
    }

    // Get already-sent dedup list
    const { data: alreadySent } = await supabase
      .from('notifications')
      .select('user_id')
      .eq('type', dedupType);

    const alreadySentIds = new Set((alreadySent || []).map((r: any) => r.user_id));

    let sent = 0, skipped = 0, failed = 0;

    for (const user of users) {
      if (user.email_opt_out) { skipped++; continue; }
      if (alreadySentIds.has(user.id)) { skipped++; continue; }

      const profile = profileMap[user.id] ?? { first_name: '', exam_date: null, timeline: null };
      const firstName = profile.first_name || user.display_name || '';
      const isPaid = ['standard', 'premium', 'lifetime'].includes(user.subscription_tier);

      let subject: string;
      let html: string;

      if (campaign === 'exam_60d') {
        if (isPaid) { skipped++; continue; } // Exclude already subscribed/paid users!

        const rawDate = profile.exam_date;
        const timeline = profile.timeline;
        const createdAt = user.created_at;

        let daysLeft: number | null = null;
        let isEligible = false;

        if (rawDate && rawDate !== 'unknown') {
          // Case A: Exam date is set
          const examMs = new Date(rawDate).getTime();
          const todayMs = today.getTime();
          const cutMs = cutoffDate.getTime();

          if (examMs >= todayMs && examMs <= cutMs) {
            daysLeft = Math.ceil((examMs - todayMs) / 86_400_000);
            if (daysLeft >= 1) {
              isEligible = true;
            }
          }
        } else {
          // Case B: No exam date, but recently signed up and timeline chosen has not passed
          if (createdAt && timeline) {
            const signupMs = new Date(createdAt).getTime();
            const todayMs = today.getTime();
            const daysSinceSignup = Math.floor((todayMs - signupMs) / 86_400_000);

            let timelineLimit = 60; // default/not_sure
            if (timeline === 'less_1_month') timelineLimit = 30;
            else if (timeline === '1_3_months') timelineLimit = 90;
            else if (timeline === 'more_3_months') timelineLimit = 180;
            else if (timeline === 'not_sure') timelineLimit = 60;

            if (daysSinceSignup >= 0 && daysSinceSignup <= timelineLimit) {
              isEligible = true;
            }
          }
        }

        if (!isEligible) { skipped++; continue; }

        ({ subject, html } = buildExam60dFreeEmail(firstName, daysLeft, timeline));
      } else {
        ({ subject, html } = isPaid
          ? buildPaidEmail(firstName, user.subscription_tier)
          : buildFreeEmail(firstName));
      }

      if (dryRun) {
        console.log(`[dry_run] Would send to ${user.email} (${isPaid ? 'paid' : 'free'}, campaign=${campaign})`);
        sent++;
        continue;
      }

      const ok = await sendEmail(resendApiKey, user.email, subject, html);
      if (ok) {
        const daysLeftVal = (campaign === 'exam_60d' && profile.exam_date && profile.exam_date !== 'unknown')
          ? Math.ceil((new Date(profile.exam_date).getTime() - today.getTime()) / 86_400_000)
          : null;
        await supabase.from('notifications').insert({
          user_id: user.id,
          type: dedupType,
          title: subject,
          body: `Campaign: ${campaign} (${isPaid ? 'paid' : 'free'} variant)`,
          metadata: {
            email_type: campaign,
            tier: user.subscription_tier,
            ...(daysLeftVal !== null ? { days_left: daysLeftVal } : {}),
            ...(profile.timeline ? { timeline: profile.timeline } : {}),
          },
        });
        sent++;
      } else {
        failed++;
      }

      // Small delay to respect Resend rate limits
      await new Promise(r => setTimeout(r, 100));
    }

    return new Response(
      JSON.stringify({ sent, skipped, failed, dry_run: dryRun, campaign, total: users.length }),
      { headers: { 'Content-Type': 'application/json' } },
    );

  } catch (err) {
    console.error('send-bulk-campaign error:', err);
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
});
