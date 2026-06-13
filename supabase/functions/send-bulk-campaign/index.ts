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

function buildExam60dFreeEmail(firstName: string, daysLeft: number): { subject: string; html: string } {
  const dLabel = daysLeft === 1 ? '1 jour' : `${daysLeft} jours`;
  const hello = firstName ? `${firstName}, votre` : 'Votre';

  // Rooster-led, Duolingo-style teaser. CTA = the 3-day free Standard trial.
  const html = `<!DOCTYPE html>
<html lang="fr">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f3f4f6;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif">
  <div style="display:none;max-height:0;overflow:hidden">J-${daysLeft} avant votre examen civique — le coq GoCivique commence à s'inquiéter… 🐓</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f3f4f6">
    <tr><td align="center" style="padding:32px 16px">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#fff;border-radius:16px;overflow:hidden;border:1px solid #e5e7eb">

        <!-- Header: rooster + brand -->
        <tr><td style="background:linear-gradient(135deg,${BRAND_PRIMARY},${BRAND_GRADIENT_END});padding:32px 32px 28px;text-align:center">
          <img src="https://gocivique.fr/gocivique-logo-examen-civique.png" width="84" height="84" alt="Le coq GoCivique" style="display:block;margin:0 auto 12px;border-radius:20px;background:#ffffff;padding:6px" />
          <h1 style="color:#fff;margin:0;font-size:26px;font-weight:900;letter-spacing:-0.5px">GoCivique</h1>
          <p style="color:rgba(255,255,255,0.85);margin:6px 0 0;font-size:14px">Cocorico ! Petit message de votre coach 🐓</p>
        </td></tr>

        <!-- Countdown chip -->
        <tr><td style="padding:0;text-align:center">
          <div style="margin:-18px auto 0;display:inline-block;background:#EF4135;color:#fff;font-weight:900;font-size:22px;padding:10px 28px;border-radius:999px;border:4px solid #fff;box-shadow:0 4px 14px rgba(239,65,53,0.35)">
            J−${daysLeft}
          </div>
        </td></tr>

        <tr><td style="padding:28px 32px 8px">
          <h2 style="color:#1a1a1a;margin:0 0 12px;font-size:22px;line-height:1.3;text-align:center">
            ${hello} examen civique est dans <span style="color:#EF4135">${dLabel}</span>.
          </h2>
          <p style="color:#4b5563;line-height:1.7;font-size:15px;text-align:center;margin:0 0 20px">
            Le coq de GoCivique s'est levé tôt pour vous le rappeler : il vous faudra <strong>32 bonnes réponses sur 40</strong> le jour J. La bonne nouvelle ? ${dLabel}, c'est encore largement assez — à condition de s'entraîner avec les vraies questions.
          </p>

          <!-- Progress tease -->
          <div style="background:#f8fafc;border:1px solid #e5e7eb;border-radius:14px;padding:18px 20px;margin-bottom:20px">
            <p style="margin:0 0 10px;font-size:13px;font-weight:700;color:#1a1a1a">Votre accès actuel à la banque officielle :</p>
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
              <tr><td style="background:#e5e7eb;border-radius:999px;height:14px">
                <div style="width:3%;min-width:18px;background:linear-gradient(90deg,${BRAND_PRIMARY},#EF4135);height:14px;border-radius:999px"></div>
              </td></tr>
            </table>
            <p style="margin:10px 0 0;font-size:13px;color:#6b7280">
              <strong style="color:#EF4135">200</strong> questions gratuites sur <strong style="color:${BRAND_PRIMARY}">7 232</strong> questions officielles…
              le coq trouve que c'est un peu juste. 😬
            </p>
          </div>

          <!-- What the trial unlocks -->
          <div style="background:#f0f5ff;border-radius:14px;padding:18px 20px;border-left:4px solid ${BRAND_PRIMARY};margin-bottom:24px">
            <p style="margin:0 0 10px;font-weight:800;color:${BRAND_PRIMARY};font-size:14px">Avec l'essai gratuit Standard, vous débloquez :</p>
            <p style="margin:0;color:#374151;font-size:14px;line-height:1.9">
              🔓 Les <strong>7 232 questions officielles</strong> (CSP, CR, Naturalisation)<br/>
              🎯 Les <strong>examens blancs illimités</strong> en conditions réelles<br/>
              🧠 La <strong>révision de vos erreurs</strong> jusqu'à la maîtrise<br/>
              📈 Votre <strong>score prédit</strong> mis à jour en direct
            </p>
          </div>
        </td></tr>

        <!-- CTA -->
        <tr><td style="padding:0 32px;text-align:center">
          <a href="https://gocivique.fr/#pricing" style="background:${BRAND_PRIMARY};color:#fff;padding:16px 36px;border-radius:14px;text-decoration:none;font-weight:800;font-size:17px;display:inline-block;box-shadow:0 6px 18px rgba(0,85,164,0.35)">
            🎁 Commencer mes 3 jours gratuits
          </a>
          <p style="color:#6b7280;font-size:12px;margin:12px 0 0">
            Aucun débit pendant l'essai · Résiliation en 1 clic
          </p>
        </td></tr>

        <tr><td style="padding:24px 32px 28px">
          <p style="color:#4b5563;font-size:14px;line-height:1.7;text-align:center;margin:0">
            On se retrouve sur la plateforme ?<br/>
            <strong>Le coq croit en vous. 🇫🇷</strong>
          </p>
          <p style="color:#6b7280;font-size:13px;text-align:center;margin:18px 0 0">
            Une question ? <a href="mailto:support@gocivique.fr" style="color:${BRAND_PRIMARY}">support@gocivique.fr</a>
          </p>
        </td></tr>

        <!-- Footer -->
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

  return {
    subject: `🐓 J−${daysLeft} ${firstName ? firstName + ' ' : ''}— le coq a sonné, votre examen approche !`,
    html,
  };
}

function buildExam60dPaidEmail(firstName: string, daysLeft: number, tier: string): { subject: string; html: string } {
  const name = firstName ? `Bonjour ${firstName} !` : 'Bonjour !';
  const tierLabel = tier === 'premium' ? 'Premium' : 'Standard';
  const dLabel = daysLeft === 1 ? '1 jour' : `${daysLeft} jours`;
  const plural = daysLeft > 1 ? 's' : '';

  return {
    subject: `Plus que ${daysLeft} jour${plural} — avez-vous exploré les 7 232 questions ?`,
    html: buildHtml({
      preheader: `J-${daysLeft} avant votre examen — vérifiez que vous exploitez pleinement GoCivique.`,
      greeting: name,
      blocks: [
        `Votre examen civique approche : il ne reste que <strong>${dLabel}</strong>. En tant que membre <strong>${tierLabel}</strong>, vous avez déjà accès à la totalité des <strong>7 232 questions officielles</strong> — mais les avez-vous vraiment exploitées ?`,
        `<div style="background:#f0fdf4;border-radius:10px;padding:16px;border-left:4px solid #059669">
          <strong style="color:#059669">Checklist de préparation finale :</strong><br/><br/>
          ✅ <strong>Questions Inédites</strong> — avez-vous épuisé les questions que vous n'avez jamais vues ?<br/>
          ✅ <strong>Révision des Erreurs</strong> — avez-vous rejoué vos erreurs passées jusqu'à les maîtriser ?<br/>
          ✅ <strong>Mode Difficile</strong> — avez-vous affronté les 500 questions au taux de réussite le plus faible ?<br/>
          ✅ <strong>Maîtrise par Catégorie</strong> — êtes-vous au-dessus de 85 % dans chaque thème ?
        </div>`,
        `Plus vous répondez à de questions, plus vous êtes prêt(e). Chaque session compte.`,
        `Il vous reste <strong>${dLabel}</strong> — mettez-les à profit.`,
      ],
      ctaText: 'Continuer mon entraînement →',
      ctaUrl: 'https://gocivique.fr/exams',
    }),
  };
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
  // Admin-only endpoint: service-role callers or users with the 'admin' role.
  // (verify_jwt alone is NOT enough: any logged-in user has a valid JWT.)
  if (!isServiceRoleRequest(req)) {
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

    // ── Test mode: send both variants to a single address ──
    if (testEmail) {
      let freeEmail: { subject: string; html: string };
      let paidEmail: { subject: string; html: string };

      if (campaign === 'exam_60d') {
        freeEmail = buildExam60dFreeEmail('', 30);
        paidEmail = buildExam60dPaidEmail('', 30, 'standard');
      } else {
        freeEmail = buildFreeEmail('');
        paidEmail = buildPaidEmail('', 'standard');
      }

      const freeOk = dryRun ? true : await sendEmail(resendApiKey, testEmail, `[TEST FREE] ${freeEmail.subject}`, freeEmail.html);
      const paidOk = dryRun ? true : await sendEmail(resendApiKey, testEmail, `[TEST PAID] ${paidEmail.subject}`, paidEmail.html);

      console.log(`Test send to ${testEmail} (campaign=${campaign}): free=${freeOk}, paid=${paidOk}, dry_run=${dryRun}`);
      return new Response(
        JSON.stringify({ test_email: testEmail, campaign, free_sent: freeOk, paid_sent: paidOk, dry_run: dryRun }),
        { headers: { 'Content-Type': 'application/json' } },
      );
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
      .select('id, email, display_name, subscription_tier, email_opt_out')
      .not('email', 'is', null);

    if (!users || users.length === 0) {
      return new Response(JSON.stringify({ message: 'No users found', sent: 0 }));
    }

    const userIds = users.map((u: any) => u.id);
    const { data: profileRows } = await supabase
      .from('user_profile')
      .select('user_id, first_name, exam_date')
      .in('user_id', userIds);

    const profileMap: Record<string, { first_name: string; exam_date: string | null }> = {};
    for (const p of profileRows || []) {
      profileMap[p.user_id] = { first_name: p.first_name || '', exam_date: p.exam_date ?? null };
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

      const profile = profileMap[user.id] ?? { first_name: '', exam_date: null };
      const firstName = profile.first_name || user.display_name || '';
      const isPaid = ['standard', 'premium', 'lifetime'].includes(user.subscription_tier);

      let subject: string;
      let html: string;

      if (campaign === 'exam_60d') {
        const rawDate = profile.exam_date;
        if (!rawDate || rawDate === 'unknown') { skipped++; continue; }

        const examMs = new Date(rawDate).getTime();
        const todayMs = today.getTime();
        const cutMs = cutoffDate.getTime();

        if (examMs < todayMs || examMs > cutMs) { skipped++; continue; }

        const daysLeft = Math.ceil((examMs - todayMs) / 86_400_000);
        if (daysLeft < 1) { skipped++; continue; }

        ({ subject, html } = isPaid
          ? buildExam60dPaidEmail(firstName, daysLeft, user.subscription_tier)
          : buildExam60dFreeEmail(firstName, daysLeft));
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
        const daysLeft = campaign === 'exam_60d'
          ? Math.ceil((new Date(profile.exam_date!).getTime() - today.getTime()) / 86_400_000)
          : undefined;
        await supabase.from('notifications').insert({
          user_id: user.id,
          type: dedupType,
          title: subject,
          body: `Campaign: ${campaign} (${isPaid ? 'paid' : 'free'} variant)`,
          metadata: {
            email_type: campaign,
            tier: user.subscription_tier,
            ...(daysLeft !== undefined ? { days_left: daysLeft } : {}),
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
