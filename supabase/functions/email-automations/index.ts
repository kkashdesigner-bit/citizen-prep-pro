import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

// ── Shared template (copied — Deno edge functions can't share across dirs) ──

const BRAND_PRIMARY = '#0055A4';
const BRAND_GRADIENT_END = '#1B6ED6';

interface EmailOpts {
  preheader?: string;
  greeting: string;
  blocks: string[];
  ctaText?: string;
  ctaUrl?: string;
}

function buildHtml(opts: EmailOpts): string {
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
            <a href="https://gocivique.fr/settings" style="color:#9ca3af;text-decoration:underline">Se désabonner</a>
          </p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

// ── Resend helper ──

async function sendEmail(apiKey: string, to: string, subject: string, html: string): Promise<boolean> {
  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({ from: 'GoCivique <noreply@gocivique.fr>', to: [to], subject, html }),
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

// ── Streak computation (mirrors useStreak.ts logic) ──

function computeStreak(answerDates: string[]): number {
  if (answerDates.length === 0) return 0;
  const uniqueDays = [...new Set(answerDates.map(d => d.slice(0, 10)))].sort().reverse();
  const today = new Date().toISOString().slice(0, 10);
  if (uniqueDays[0] !== today) {
    // Check yesterday
    const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
    if (uniqueDays[0] !== yesterday) return 0;
  }
  let streak = 1;
  for (let i = 1; i < uniqueDays.length; i++) {
    const prev = new Date(uniqueDays[i - 1]);
    const curr = new Date(uniqueDays[i]);
    const diffDays = (prev.getTime() - curr.getTime()) / 86400000;
    if (Math.abs(diffDays - 1) < 0.01) {
      streak++;
    } else {
      break;
    }
  }
  return streak;
}

// ── Email content builders ──

interface UserCtx {
  firstName: string;
  email: string;
  goalType?: string;
  streak?: number;
  questionsThisWeek?: number;
  correctPctThisWeek?: number;
  weakCategory?: string;
}

const GOAL_LABELS: Record<string, string> = {
  naturalisation: 'la naturalisation',
  carte_resident: 'la carte de résident',
  csp: 'la carte de séjour pluriannuelle',
};

function inactivityEmail(u: UserCtx, days: number): { subject: string; html: string } {
  const name = u.firstName || '';
  if (days === 3) {
    return {
      subject: 'Reprenez votre entraînement !',
      html: buildHtml({
        preheader: '3 jours sans réviser — votre série est en danger.',
        greeting: `${name ? `${name}, n` : 'N'}e perdez pas votre élan !`,
        blocks: [
          `Cela fait <strong>3 jours</strong> sans activité sur GoCivique. Votre série de jours consécutifs est en danger !`,
          `Une seule question suffit pour maintenir votre progression. Pourquoi ne pas répondre à la question du jour ?`,
        ],
        ctaText: 'Reprendre l\'entraînement →',
        ctaUrl: 'https://gocivique.fr/learn',
      }),
    };
  }
  if (days === 7) {
    return {
      subject: '1 semaine sans réviser — ne perdez pas vos acquis',
      html: buildHtml({
        preheader: 'Vos connaissances s\'estompent sans pratique régulière.',
        greeting: `${name ? `${name}, v` : 'V'}otre préparation vous attend`,
        blocks: [
          `Cela fait <strong>une semaine</strong> sans pratiquer. Les recherches montrent que la révision régulière est la clé de la réussite à l'examen.`,
          `<div style="background:#f0f5ff;border-radius:10px;padding:16px;border-left:4px solid #0055A4">
            <strong style="color:#0055A4">Le saviez-vous ?</strong><br/>
            <span style="color:#4b5563">Les candidats qui révisent quotidiennement ont 3x plus de chances de réussir leur examen du premier coup.</span>
          </div>`,
        ],
        ctaText: 'Relancer ma préparation →',
        ctaUrl: 'https://gocivique.fr/learn',
      }),
    };
  }
  // 14 days
  const goalLabel = GOAL_LABELS[u.goalType || ''] || 'votre examen civique';
  return {
    subject: 'Votre objectif de citoyenneté vous attend',
    html: buildHtml({
      preheader: '2 semaines d\'inactivité — revenez à votre rythme.',
      greeting: `${name ? `${name}, v` : 'V'}otre objectif est toujours là`,
      blocks: [
        `Cela fait <strong>2 semaines</strong> sans activité. Votre objectif de <strong>${goalLabel}</strong> mérite votre attention.`,
        `Pas besoin de tout rattraper d'un coup. Commencez par un quiz flash de 5 questions pour reprendre en douceur.`,
        `Nous avons gardé votre progression intacte — tout est là où vous l'avez laissé.`,
      ],
      ctaText: 'Reprendre doucement →',
      ctaUrl: 'https://gocivique.fr/learn',
    }),
  };
}

function weeklyDigestEmail(u: UserCtx): { subject: string; html: string } {
  const name = u.firstName || '';
  const qs = u.questionsThisWeek || 0;
  const pct = u.correctPctThisWeek || 0;
  const streak = u.streak || 0;
  const weak = u.weakCategory || '—';

  return {
    subject: 'Votre bilan de la semaine sur GoCivique',
    html: buildHtml({
      preheader: `${qs} questions cette semaine — ${pct}% de réussite.`,
      greeting: `${name ? `${name}, v` : 'V'}oici votre bilan hebdomadaire`,
      blocks: [
        `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse">
          <tr>
            <td style="padding:12px 16px;background:#f0f5ff;border-radius:8px 8px 0 0;border-bottom:1px solid #e5e7eb">
              <strong style="color:#0055A4">📊 Questions répondues</strong>
              <span style="float:right;font-weight:700;color:#1a1a1a">${qs}</span>
            </td>
          </tr>
          <tr>
            <td style="padding:12px 16px;background:#fff;border-bottom:1px solid #e5e7eb">
              <strong style="color:#0055A4">✅ Taux de réussite</strong>
              <span style="float:right;font-weight:700;color:${pct >= 70 ? '#059669' : pct >= 50 ? '#f59e0b' : '#ef4444'}">${pct}%</span>
            </td>
          </tr>
          <tr>
            <td style="padding:12px 16px;background:#f0f5ff;border-bottom:1px solid #e5e7eb">
              <strong style="color:#0055A4">🔥 Série actuelle</strong>
              <span style="float:right;font-weight:700;color:#1a1a1a">${streak} jour${streak !== 1 ? 's' : ''}</span>
            </td>
          </tr>
          <tr>
            <td style="padding:12px 16px;background:#fff;border-radius:0 0 8px 8px">
              <strong style="color:#0055A4">🎯 Point à travailler</strong>
              <span style="float:right;font-weight:700;color:#1a1a1a">${weak}</span>
            </td>
          </tr>
        </table>`,
        qs > 0
          ? `Beau travail cette semaine ! Continuez sur cette lancée pour atteindre vos objectifs.`
          : `Aucune activité cette semaine. Même 5 questions par jour font une grande différence !`,
      ],
      ctaText: 'Continuer l\'entraînement →',
      ctaUrl: 'https://gocivique.fr/learn',
    }),
  };
}

function examReminderEmail(u: UserCtx, daysLeft: number): { subject: string; html: string } {
  const name = u.firstName || '';
  const subjects: Record<number, string> = {
    30: 'J-30 avant votre examen civique !',
    14: 'J-14 — il est temps d\'intensifier',
    7: 'J-7 — dernière ligne droite !',
    3: 'J-3 — dernier virage avant l\'examen',
    1: 'C\'est demain ! Dernières révisions',
  };
  const tips: Record<number, string> = {
    30: 'Vous avez encore un mois — c\'est le moment idéal pour couvrir tous les domaines et identifier vos points faibles.',
    14: 'Concentrez-vous sur vos catégories les plus faibles. L\'algorithme GoCivique adapte les questions à vos besoins.',
    7: 'Faites un examen blanc complet pour évaluer votre niveau. Visez 80% de réussite.',
    3: 'Révisez les points essentiels : valeurs de la République, institutions, droits et devoirs. Pas de nouvelles matières — consolidez.',
    1: 'Repos et confiance. Relisez vos notes, faites un dernier quiz flash, et couchez-vous tôt. Vous êtes prêt(e) !',
  };

  return {
    subject: subjects[daysLeft] || `J-${daysLeft} avant votre examen`,
    html: buildHtml({
      preheader: `Plus que ${daysLeft} jour${daysLeft > 1 ? 's' : ''} avant votre examen civique.`,
      greeting: `${name ? `${name}, ` : ''}J-${daysLeft} avant l'examen !`,
      blocks: [
        `<div style="text-align:center;padding:20px;background:linear-gradient(135deg,#0055A4,#1B6ED6);border-radius:12px;margin-bottom:16px">
          <span style="font-size:48px;font-weight:900;color:#fff">${daysLeft}</span>
          <br/><span style="color:rgba(255,255,255,0.9);font-size:14px;font-weight:600">jour${daysLeft > 1 ? 's' : ''} restant${daysLeft > 1 ? 's' : ''}</span>
        </div>`,
        `<strong>Conseil du jour :</strong> ${tips[daysLeft] || ''}`,
      ],
      ctaText: daysLeft <= 3 ? 'Quiz flash de dernière minute →' : 'Continuer la préparation →',
      ctaUrl: 'https://gocivique.fr/learn',
    }),
  };
}

function streakMilestoneEmail(u: UserCtx, milestone: number): { subject: string; html: string } {
  const name = u.firstName || '';
  const emojis: Record<number, string> = { 7: '🔥', 30: '⭐', 60: '🏆', 100: '👑' };
  const messages: Record<number, string> = {
    7: 'Une semaine complète de révisions quotidiennes — vous avez pris le rythme !',
    30: 'Un mois entier sans interruption ! Votre régularité est impressionnante.',
    60: 'Deux mois de pratique quotidienne — vous faites partie du top 5% de nos utilisateurs.',
    100: '100 jours consécutifs ! C\'est un exploit remarquable. Vous êtes un(e) champion(ne) !',
  };

  return {
    subject: `${emojis[milestone] || '🎉'} ${milestone} jours de suite — bravo !`,
    html: buildHtml({
      preheader: `Série de ${milestone} jours sur GoCivique !`,
      greeting: `${name ? `${name}, ` : ''}${emojis[milestone] || '🎉'} ${milestone} jours !`,
      blocks: [
        `<div style="text-align:center;padding:24px;background:#f0fdf4;border-radius:12px;border:2px solid #bbf7d0;margin-bottom:16px">
          <span style="font-size:56px">${emojis[milestone] || '🎉'}</span><br/>
          <span style="font-size:32px;font-weight:900;color:#059669">${milestone} jours</span><br/>
          <span style="color:#4b5563;font-size:14px">de révision consécutive</span>
        </div>`,
        messages[milestone] || `${milestone} jours de suite — continuez comme ça !`,
        `Chaque jour de pratique vous rapproche de la réussite à votre examen civique.`,
      ],
      ctaText: 'Continuer ma série →',
      ctaUrl: 'https://gocivique.fr/learn',
    }),
  };
}

// ── Main cron handler ──

const EXAM_REMINDER_DAYS = [30, 14, 7, 3, 1];
const STREAK_MILESTONES = [7, 30, 60, 100];
const INACTIVITY_DAYS = [3, 7, 14];

serve(async (_req) => {
  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const resendApiKey = Deno.env.get('RESEND_API_KEY');
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    if (!resendApiKey) {
      return new Response(JSON.stringify({ error: 'RESEND_API_KEY not set' }), { status: 500 });
    }

    const today = new Date().toISOString().slice(0, 10);
    const dayOfWeek = new Date().getDay(); // 0=Sun, 1=Mon
    const sevenDaysAgo = new Date(Date.now() - 7 * 86400000).toISOString();
    const sixtyDaysAgo = new Date(Date.now() - 60 * 86400000).toISOString();

    // Fetch all users with profiles + user_profile data
    const { data: users } = await supabase
      .from('profiles')
      .select('id, email, display_name, email_opt_out, subscription_tier')
      .eq('email_opt_out', false)
      .not('email', 'is', null);

    if (!users || users.length === 0) {
      return new Response(JSON.stringify({ message: 'No eligible users', sent: 0 }));
    }

    // Fetch user_profile data for all users
    const userIds = users.map((u: any) => u.id);
    const { data: profiles } = await supabase
      .from('user_profile')
      .select('user_id, first_name, goal_type, exam_date')
      .in('user_id', userIds);

    const profileMap: Record<string, any> = {};
    for (const p of profiles || []) {
      profileMap[p.user_id] = p;
    }

    let totalSent = 0;
    const batchSize = 50;

    for (let i = 0; i < users.length; i += batchSize) {
      const batch = users.slice(i, i + batchSize);
      const sends: Promise<void>[] = [];

      for (const user of batch) {
        sends.push((async () => {
          const profile = profileMap[user.id] || {};
          const firstName = profile.first_name || user.display_name || '';

          // Rate limit: max 1 lifecycle email per user per day
          const { count: todayEmails } = await supabase
            .from('notifications')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', user.id)
            .like('type', 'email_%')
            .gte('created_at', `${today}T00:00:00`);

          if ((todayEmails || 0) >= 1) return;

          const ctx: UserCtx = {
            firstName,
            email: user.email,
            goalType: profile.goal_type,
          };

          // ── Priority 1: Exam reminders ──
          if (profile.exam_date) {
            const examDate = new Date(profile.exam_date);
            const diffMs = examDate.getTime() - new Date(today).getTime();
            const daysLeft = Math.round(diffMs / 86400000);

            if (EXAM_REMINDER_DAYS.includes(daysLeft)) {
              const emailType = `email_exam_reminder_${daysLeft}d`;
              const { count: exists } = await supabase
                .from('notifications')
                .select('*', { count: 'exact', head: true })
                .eq('user_id', user.id)
                .eq('type', emailType);

              if (exists === 0) {
                const { subject, html } = examReminderEmail(ctx, daysLeft);
                const sent = await sendEmail(resendApiKey, user.email, subject, html);
                if (sent) {
                  await supabase.from('notifications').insert({
                    user_id: user.id, type: emailType,
                    title: subject, body: `Exam reminder: J-${daysLeft}`,
                    metadata: { email_type: emailType, days_left: daysLeft },
                  });
                  totalSent++;
                }
                return; // 1 email per user per day
              }
            }
          }

          // ── Priority 2: Streak milestones ──
          const { data: answerDates } = await supabase
            .from('user_answers')
            .select('created_at')
            .eq('user_id', user.id)
            .gte('created_at', sixtyDaysAgo)
            .order('created_at', { ascending: false });

          const streak = computeStreak((answerDates || []).map((a: any) => a.created_at));
          ctx.streak = streak;

          if (STREAK_MILESTONES.includes(streak)) {
            const emailType = `email_streak_milestone_${streak}`;
            const { count: exists } = await supabase
              .from('notifications')
              .select('*', { count: 'exact', head: true })
              .eq('user_id', user.id)
              .eq('type', emailType);

            if (exists === 0) {
              const { subject, html } = streakMilestoneEmail(ctx, streak);
              const sent = await sendEmail(resendApiKey, user.email, subject, html);
              if (sent) {
                await supabase.from('notifications').insert({
                  user_id: user.id, type: emailType,
                  title: subject, body: `Streak milestone: ${streak} days`,
                  metadata: { email_type: emailType, streak },
                });
                totalSent++;
              }
              return;
            }
          }

          // ── Priority 3: Inactivity re-engagement ──
          const lastActivityDate = answerDates && answerDates.length > 0
            ? answerDates[0].created_at.slice(0, 10)
            : null;

          if (lastActivityDate) {
            const daysInactive = Math.round(
              (new Date(today).getTime() - new Date(lastActivityDate).getTime()) / 86400000
            );

            for (const threshold of INACTIVITY_DAYS) {
              if (daysInactive === threshold) {
                const emailType = `email_inactivity_${threshold}d`;
                const { count: exists } = await supabase
                  .from('notifications')
                  .select('*', { count: 'exact', head: true })
                  .eq('user_id', user.id)
                  .eq('type', emailType);

                if (exists === 0) {
                  const { subject, html } = inactivityEmail(ctx, threshold);
                  const sent = await sendEmail(resendApiKey, user.email, subject, html);
                  if (sent) {
                    await supabase.from('notifications').insert({
                      user_id: user.id, type: emailType,
                      title: subject, body: `Inactivity: ${threshold} days`,
                      metadata: { email_type: emailType, days_inactive: threshold },
                    });
                    totalSent++;
                  }
                  return;
                }
                break;
              }
            }
          }

          // ── Priority 4: Weekly digest (Mondays only) ──
          if (dayOfWeek === 1) {
            const sixDaysAgo = new Date(Date.now() - 6 * 86400000).toISOString();
            const { count: recentDigest } = await supabase
              .from('notifications')
              .select('*', { count: 'exact', head: true })
              .eq('user_id', user.id)
              .eq('type', 'email_weekly_digest')
              .gte('created_at', sixDaysAgo);

            if (recentDigest === 0) {
              // Compute weekly stats
              const { data: weekAnswers } = await supabase
                .from('user_answers')
                .select('is_correct, category')
                .eq('user_id', user.id)
                .gte('created_at', sevenDaysAgo);

              const wa = weekAnswers || [];
              const questionsThisWeek = wa.length;
              const correctThisWeek = wa.filter((a: any) => a.is_correct).length;
              const correctPctThisWeek = questionsThisWeek > 0
                ? Math.round((correctThisWeek / questionsThisWeek) * 100) : 0;

              // Find weakest category
              const catMap: Record<string, { total: number; correct: number }> = {};
              for (const a of wa) {
                if (!catMap[a.category]) catMap[a.category] = { total: 0, correct: 0 };
                catMap[a.category].total++;
                if (a.is_correct) catMap[a.category].correct++;
              }
              let weakCategory = '—';
              let worstPct = 100;
              for (const [cat, stats] of Object.entries(catMap)) {
                const pct = Math.round((stats.correct / stats.total) * 100);
                if (pct < worstPct) { worstPct = pct; weakCategory = cat; }
              }
              // Shorten category name for display
              const shortCatNames: Record<string, string> = {
                'Principles and values of the Republic': 'Valeurs & Principes',
                'Institutional and political system': 'Institutions',
                'Rights and duties': 'Droits & Devoirs',
                'History, geography and culture': 'Histoire & Culture',
                'Living in French society': 'Vivre en société',
              };
              weakCategory = shortCatNames[weakCategory] || weakCategory;

              ctx.questionsThisWeek = questionsThisWeek;
              ctx.correctPctThisWeek = correctPctThisWeek;
              ctx.weakCategory = weakCategory;

              const { subject, html } = weeklyDigestEmail(ctx);
              const sent = await sendEmail(resendApiKey, user.email, subject, html);
              if (sent) {
                await supabase.from('notifications').insert({
                  user_id: user.id, type: 'email_weekly_digest',
                  title: subject, body: `Weekly digest: ${questionsThisWeek} Qs, ${correctPctThisWeek}%`,
                  metadata: { email_type: 'weekly_digest', questionsThisWeek, correctPctThisWeek },
                });
                totalSent++;
              }
            }
          }
        })());
      }

      await Promise.allSettled(sends);

      // Small delay between batches to respect Resend rate limits
      if (i + batchSize < users.length) {
        await new Promise(r => setTimeout(r, 200));
      }
    }

    return new Response(
      JSON.stringify({ message: 'Done', users: users.length, sent: totalSent }),
      { headers: { 'Content-Type': 'application/json' } },
    );
  } catch (err) {
    console.error('email-automations error:', err);
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
});
