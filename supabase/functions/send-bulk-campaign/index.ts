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
  const name = firstName || 'Sha';

  const html = `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <meta name="x-apple-disable-message-reformatting">
  <title>GoCivique</title>
</head>
<body style="margin:0;padding:0;background-color:#f8fafc;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;-webkit-font-smoothing:antialiased;">
  <div style="display:none;max-height:0;overflow:hidden;mso-hide:all;">J-\${daysLeft} avant votre examen civique — le coq GoCivique commence à s'inquiéter… 🐓</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f8fafc;">
    <tr>
      <td align="center" style="padding:32px 16px;">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background-color:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #e2e8f0;box-shadow:0 4px 20px rgba(0,0,0,0.05);">
          
          <!-- Top Tricolore Bar -->
          <tr>
            <td style="height:6px;line-height:6px;font-size:0;background:linear-gradient(90deg,#0055A4 0%,#0055A4 33%,#ffffff 33%,#ffffff 66%,#EF4135 66%,#EF4135 100%);">&nbsp;</td>
          </tr>

          <!-- Header -->
          <tr>
            <td style="padding:24px 32px;border-bottom:1px solid #f1f5f9;text-align:center;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center">
                    <img src="https://gocivique.fr/gocivique-logo-examen-civique.png" width="64" height="64" alt="GoCivique Logo" style="display:inline-block;vertical-align:middle;border-radius:14px;background-color:#ffffff;padding:4px;border:1px solid #e2e8f0;" />
                    <span style="display:inline-block;vertical-align:middle;margin-left:12px;font-size:24px;font-weight:900;color:#0f172a;letter-spacing:-0.5px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">GoCivique</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Hero Image -->
          <tr>
            <td style="padding:32px 32px 0;text-align:center;">
              <img src="https://gocivique.fr/examen-civique-parcours-100-niveaux-desktop.jpg" width="100%" alt="Parcours de préparation civique" style="display:block;width:100%;max-width:536px;height:auto;border-radius:12px;border:1px solid #e2e8f0;box-shadow:0 2px 10px rgba(0,0,0,0.03);" />
            </td>
          </tr>

          <!-- Countdown Badge -->
          <tr>
            <td style="padding:0;text-align:center;">
              <div style="margin:-20px auto 0;display:inline-block;background-color:#EF4135;color:#ffffff;font-weight:900;font-size:20px;padding:8px 24px;border-radius:999px;border:4px solid #ffffff;box-shadow:0 4px 12px rgba(239,65,53,0.3);">
                J−\${daysLeft} avant l'examen
              </div>
            </td>
          </tr>

          <!-- Body Content -->
          <tr>
            <td style="padding:32px;">
              <h2 style="color:#0f172a;margin:0 0 16px;font-size:22px;font-weight:800;line-height:1.3;text-align:center;">
                Bonjour \${name}, votre examen approche !
              </h2>
              
              <p style="color:#475569;line-height:1.625;font-size:15px;text-align:center;margin:0 0 24px;">
                Le coq de GoCivique a sonné l'alarme : il ne reste que <strong>\${dLabel}</strong> avant votre examen civique officiel. Pour réussir, vous devez obtenir au moins <strong>32 bonnes réponses sur 40</strong>. C'est le moment de passer à la vitesse supérieure !
              </p>

              <!-- Progress bar representation -->
              <div style="background-color:#f8fafc;border:1px solid #e2e8f0;border-radius:14px;padding:20px;margin-bottom:24px;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="font-size:13px;font-weight:700;color:#1e293b;">Votre progression actuelle :</td>
                    <td align="right" style="font-size:13px;font-weight:800;color:#ef4444;">Accès gratuit (3%)</td>
                  </tr>
                  <tr>
                    <td colspan="2" style="padding-top:10px;">
                      <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                        <tr>
                          <td style="background-color:#e2e8f0;border-radius:999px;height:12px;">
                            <div style="width:3%;min-width:18px;background:linear-gradient(90deg,#0055A4,#EF4135);height:12px;border-radius:999px;"></div>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
                <p style="margin:10px 0 0;font-size:13px;color:#64748b;line-height:1.5;">
                  Vous n'avez accès qu'à <strong>200 questions d'entraînement</strong> sur les <strong>7 232 questions officielles</strong> de notre base. Le coq trouve que c'est un peu juste pour aborder l'examen sereinement ! 🐓
                </p>
              </div>

              <h3 style="color:#0f172a;font-size:16px;font-weight:700;margin:0 0 16px;text-align:center;">Pourquoi passer au plan Standard aujourd'hui ?</h3>
              
              <!-- Value Cards Grid -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
                <tr>
                  <td width="48%" valign="top" style="background-color:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;padding:16px;">
                    <div style="font-size:20px;margin-bottom:8px;">🔓</div>
                    <div style="font-weight:800;font-size:14px;color:#0f172a;margin-bottom:4px;">Base Complète</div>
                    <div style="font-size:12px;color:#475569;line-height:1.5;">Accédez aux <strong>7 232 questions officielles</strong> (Naturalisation, Résident, CSP).</div>
                  </td>
                  <td width="4%"></td>
                  <td width="48%" valign="top" style="background-color:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;padding:16px;">
                    <div style="font-size:20px;margin-bottom:8px;">🎯</div>
                    <div style="font-weight:800;font-size:14px;color:#0f172a;margin-bottom:4px;">Examens Blancs</div>
                    <div style="font-size:12px;color:#475569;line-height:1.5;">Entraînez-vous en conditions réelles avec minuteur de 45 min.</div>
                  </td>
                </tr>
                <tr><td colspan="3" style="height:12px;"></td></tr>
                <tr>
                  <td width="48%" valign="top" style="background-color:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;padding:16px;">
                    <div style="font-size:20px;margin-bottom:8px;">🧠</div>
                    <div style="font-weight:800;font-size:14px;color:#0f172a;margin-bottom:4px;">Révision d'Erreurs</div>
                    <div style="font-size:12px;color:#475569;line-height:1.5;">L'algorithme isole vos erreurs et vous fait retravailler vos points faibles.</div>
                  </td>
                  <td width="4%"></td>
                  <td width="48%" valign="top" style="background-color:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;padding:16px;">
                    <div style="font-size:20px;margin-bottom:8px;">📈</div>
                    <div style="font-weight:800;font-size:14px;color:#0f172a;margin-bottom:4px;">Score Prédictif</div>
                    <div style="font-size:12px;color:#475569;line-height:1.5;">Suivez l'évolution de vos chances de réussite calculées en temps réel.</div>
                  </td>
                </tr>
              </table>

              <!-- Call to Action -->
              <div style="text-align:center;margin-bottom:12px;">
                <a href="https://gocivique.fr/#pricing" style="background-color:#0055A4;color:#ffffff;padding:16px 36px;border-radius:12px;text-decoration:none;font-weight:800;font-size:16px;display:inline-block;box-shadow:0 4px 12px rgba(0,85,164,0.25);font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
                  🎁 Commencer mes 3 jours gratuits
                </a>
              </div>
              <p style="color:#64748b;font-size:12px;text-align:center;margin:0 0 28px;">
                Aucune carte requise · Annulation en un clic
              </p>

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
              <p style="color:#94a3b8;font-size:12px;margin:0;line-height:1.6;">
                GoCivique · Plateforme n°1 de préparation aux examens civiques français<br/>
                <a href="https://gocivique.fr/privacy" style="color:#64748b;text-decoration:none;">Politique de confidentialité</a> · <a href="mailto:support@gocivique.fr" style="color:#64748b;text-decoration:none;">Contact Support</a>
              </p>
              <p style="color:#94a3b8;font-size:11px;margin:12px 0 0;">
                Vous souhaitez ne plus recevoir ces rappels ?
                <a href="https://gocivique.fr/settings" style="color:#94a3b8;text-decoration:underline;">Se désabonner</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  return {
    subject: `🐓 J-\${daysLeft} \${name} — le coq a sonné, votre examen approche !`,
    html,
  };
}

function buildExam60dPaidEmail(firstName: string, daysLeft: number, tier: string): { subject: string; html: string } {
  const dLabel = daysLeft === 1 ? '1 jour' : `\${daysLeft} jours`;
  const name = firstName || 'Sha';
  const tierLabel = tier === 'premium' ? 'Premium' : 'Standard';

  const html = `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <meta name="x-apple-disable-message-reformatting">
  <title>GoCivique</title>
</head>
<body style="margin:0;padding:0;background-color:#f8fafc;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;-webkit-font-smoothing:antialiased;">
  <div style="display:none;max-height:0;overflow:hidden;mso-hide:all;">Plus que \${dLabel} avant votre examen — vérifiez votre niveau ! 🐓</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f8fafc;">
    <tr>
      <td align="center" style="padding:32px 16px;">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background-color:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #e2e8f0;box-shadow:0 4px 20px rgba(0,0,0,0.05);">
          
          <!-- Top Tricolore Bar -->
          <tr>
            <td style="height:6px;line-height:6px;font-size:0;background:linear-gradient(90deg,#0055A4 0%,#0055A4 33%,#ffffff 33%,#ffffff 66%,#EF4135 66%,#EF4135 100%);">&nbsp;</td>
          </tr>

          <!-- Header -->
          <tr>
            <td style="padding:24px 32px;border-bottom:1px solid #f1f5f9;text-align:center;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center">
                    <img src="https://gocivique.fr/gocivique-logo-examen-civique.png" width="64" height="64" alt="GoCivique Logo" style="display:inline-block;vertical-align:middle;border-radius:14px;background-color:#ffffff;padding:4px;border:1px solid #e2e8f0;" />
                    <span style="display:inline-block;vertical-align:middle;margin-left:12px;font-size:24px;font-weight:900;color:#0f172a;letter-spacing:-0.5px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">GoCivique</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Hero Image -->
          <tr>
            <td style="padding:32px 32px 0;text-align:center;">
              <img src="https://gocivique.fr/examen-civique-parcours-progression-desktop.jpg" width="100%" alt="Votre progression GoCivique" style="display:block;width:100%;max-width:536px;height:auto;border-radius:12px;border:1px solid #e2e8f0;box-shadow:0 2px 10px rgba(0,0,0,0.03);" />
            </td>
          </tr>

          <!-- Countdown Badge -->
          <tr>
            <td style="padding:0;text-align:center;">
              <div style="margin:-20px auto 0;display:inline-block;background-color:#059669;color:#ffffff;font-weight:900;font-size:20px;padding:8px 24px;border-radius:999px;border:4px solid #ffffff;box-shadow:0 4px 12px rgba(5,150,105,0.3);">
                J−\${daysLeft} avant l'examen
              </div>
            </td>
          </tr>

          <!-- Body Content -->
          <tr>
            <td style="padding:32px;">
              <h2 style="color:#0f172a;margin:0 0 16px;font-size:22px;font-weight:800;line-height:1.3;text-align:center;">
                Bonjour \${name}, vous y êtes presque !
              </h2>
              
              <p style="color:#475569;line-height:1.625;font-size:15px;text-align:center;margin:0 0 24px;">
                Votre examen civique est dans <strong>\${dLabel}</strong>. En tant que membre \${tierLabel}, vous disposez de tous les outils nécessaires pour réussir du premier coup. Voici votre checklist finale de préparation :
              </p>

              <!-- Checklist Box -->
              <div style="background-color:#f0fdf4;border:1px solid #bbf7d0;border-radius:14px;padding:20px;margin-bottom:24px;border-left:4px solid #059669;">
                <p style="margin:0 0 12px;font-weight:800;color:#0f5132;font-size:15px;">📋 Checklist finale de préparation :</p>
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="color:#1e293b;font-size:14px;line-height:1.8;">
                  <tr>
                    <td valign="top" style="padding-bottom:10px;width:24px;">✅</td>
                    <td style="padding-bottom:10px;"><strong>Questions Inédites :</strong> Avez-vous répondu à toutes les questions de notre base de 7 232 questions ? Ciblez-les pour ne laisser aucun angle mort.</td>
                  </tr>
                  <tr>
                    <td valign="top" style="padding-bottom:10px;width:24px;">✅</td>
                    <td style="padding-bottom:10px;"><strong>Révision des Erreurs :</strong> Repassez vos réponses fausses. Videz votre boîte d'erreurs pour perfectionner votre score.</td>
                  </tr>
                  <tr>
                    <td valign="top" style="padding-bottom:10px;width:24px;">✅</td>
                    <td style="padding-bottom:10px;"><strong>Mode Difficile :</strong> Entraînez-vous sur les 500 questions statistiquement les plus redoutées par les candidats.</td>
                  </tr>
                  <tr>
                    <td valign="top" style="width:24px;">✅</td>
                    <td><strong>Examens Blancs :</strong> Réalisez au moins 3 examens blancs avec un score constant supérieur à 32/40.</td>
                  </tr>
                </table>
              </div>

              <!-- Call to Action -->
              <div style="text-align:center;margin-bottom:28px;">
                <a href="https://gocivique.fr/exams" style="background-color:#0055A4;color:#ffffff;padding:16px 36px;border-radius:12px;text-decoration:none;font-weight:800;font-size:16px;display:inline-block;box-shadow:0 4px 12px rgba(0,85,164,0.25);font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
                  ⚡ Continuer mon entraînement →
                </a>
              </div>

              <!-- Closing -->
              <p style="color:#334155;font-size:14px;line-height:1.6;text-align:center;margin:0;">
                Chaque quiz vous rapproche un peu plus de votre réussite.<br/>
                <strong>Le coq croit en vous ! 🐓🇫🇷</strong>
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color:#f8fafc;padding:24px 32px;border-top:1px solid #e2e8f0;text-align:center;">
              <p style="color:#94a3b8;font-size:12px;margin:0;line-height:1.6;">
                GoCivique · Plateforme n°1 de préparation aux examens civiques français<br/>
                <a href="https://gocivique.fr/privacy" style="color:#64748b;text-decoration:none;">Politique de confidentialité</a> · <a href="mailto:support@gocivique.fr" style="color:#64748b;text-decoration:none;">Contact Support</a>
              </p>
              <p style="color:#94a3b8;font-size:11px;margin:12px 0 0;">
                Vous souhaitez ne plus recevoir ces rappels ?
                <a href="https://gocivique.fr/settings" style="color:#94a3b8;text-decoration:underline;">Se désabonner</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;  return {
    subject: `🐓 J-\${daysLeft} \${name} — plus que \${dLabel} pour vous préparer !`,
    html,
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
