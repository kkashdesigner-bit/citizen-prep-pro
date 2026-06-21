const BRAND_PRIMARY = '#0055A4';
const BRAND_GRADIENT_END = '#1B6ED6';
const SUPPORT_EMAIL = 'support@gocivique.fr';

export interface EmailTemplateOptions {
  preheader?: string;
  greeting: string;
  blocks: string[];
  ctaText?: string;
  ctaUrl?: string;
  footerExtra?: string;
  showUnsubscribe?: boolean;
  heroImageUrl?: string; // New field for premium header graphics
}

export function buildEmailHtml(opts: EmailTemplateOptions): string {
  const cta = opts.ctaText && opts.ctaUrl ? `
    <div style="text-align:center;margin:32px 0 16px 0">
      <a href="${opts.ctaUrl}" style="background:linear-gradient(135deg,${BRAND_PRIMARY},${BRAND_GRADIENT_END});color:#ffffff;padding:16px 36px;border-radius:12px;text-decoration:none;font-weight:700;font-size:16px;display:inline-block;box-shadow:0 4px 12px rgba(0, 85, 164, 0.2);letter-spacing:0.5px;">
        ${opts.ctaText}
      </a>
    </div>` : '';

  const hero = opts.heroImageUrl ? `
    <tr>
      <td align="center" style="padding:0 32px 16px 32px;">
        <img src="${opts.heroImageUrl}" alt="GoCivique Illustration" width="536" style="max-width:100%;width:100%;border-radius:12px;display:block;border:0;box-shadow:0 4px 12px rgba(0,0,0,0.06);" />
      </td>
    </tr>` : '';

  const unsubscribe = opts.showUnsubscribe !== false ? `
    <p style="color:#94a3b8;font-size:11px;margin:8px 0 0 0">
      Vous ne souhaitez plus recevoir ces emails ?
      <a href="https://gocivique.fr/settings" style="color:#94a3b8;text-decoration:underline">Se désabonner</a>
    </p>` : '';

  return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <meta name="x-apple-disable-message-reformatting">
  <title>GoCivique</title>
</head>
<body style="margin:0;padding:0;background-color:#f8fafc;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;-webkit-font-smoothing:antialiased">
  ${opts.preheader ? `<div style="display:none;max-height:0;overflow:hidden;mso-hide:all;font-size:1px;color:#f8fafc;line-height:1px;">${opts.preheader}</div>` : ''}
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f8fafc;padding:32px 16px;">
    <tr><td align="center">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background-color:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.05);border:1px solid #e2e8f0">
        
        <!-- Top Flag Accent Line -->
        <tr>
          <td>
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="height:5px;line-height:5px;font-size:0;">
              <tr>
                <td width="33%" style="background-color:#0055A4;">&nbsp;</td>
                <td width="34%" style="background-color:#ffffff;">&nbsp;</td>
                <td width="33%" style="background-color:#EF4135;">&nbsp;</td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- Brand Logo Header -->
        <tr>
          <td align="center" style="padding:32px 24px 24px 24px;">
            <a href="https://gocivique.fr" target="_blank" style="text-decoration:none">
              <img src="https://gocivique.fr/gocivique-logo-examen-civique.png" alt="GoCivique Logo" width="150" style="display:block;border:0;outline:none" />
            </a>
            <p style="margin:8px 0 0 0;font-size:12px;color:#64748b;letter-spacing:1px;text-transform:uppercase;font-weight:600">La voie vers la citoyenneté française</p>
          </td>
        </tr>

        <!-- Optional Hero Image -->
        ${hero}

        <!-- Content Body -->
        <tr>
          <td style="padding:24px 40px 40px 40px">
            <h2 style="color:#0f172a;margin:0 0 16px 0;font-size:20px;font-weight:800;letter-spacing:-0.5px">${opts.greeting}</h2>
            ${opts.blocks.map(b => `<div style="color:#475569;line-height:1.6;margin-bottom:16px;font-size:15px">${b}</div>`).join('')}
            ${cta}
            ${opts.footerExtra ? `<div style="color:#64748b;font-size:13px;text-align:center;margin-top:16px">${opts.footerExtra}</div>` : ''}
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="background-color:#f8fafc;padding:32px;border-top:1px solid #e2e8f0;text-align:center">
            <p style="color:#94a3b8;font-size:12px;margin:0 0 8px 0;line-height:1.6">
              Une question ? Répondez directement à cet e-mail ou contactez-nous à <a href="mailto:${SUPPORT_EMAIL}" style="color:${BRAND_PRIMARY};text-decoration:none;font-weight:600">${SUPPORT_EMAIL}</a>
            </p>
            <p style="color:#94a3b8;font-size:11px;margin:0;line-height:1.6">
              GoCivique · Plateforme de préparation à l'examen civique français<br/>
              <a href="https://gocivique.fr/privacy" style="color:#94a3b8">Politique de confidentialité</a>
            </p>
            ${unsubscribe}
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}
