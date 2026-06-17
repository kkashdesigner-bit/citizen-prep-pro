import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { buildReferralUrl } from '@/utils/referral';
import { Copy, Check, Gift } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface ReferralSectionProps {
  referralCode: string;
  referralCount: number;
}

export default function ReferralSection({ referralCode, referralCount }: ReferralSectionProps) {
  const [copied, setCopied] = useState(false);
  const { t } = useLanguage();
  const referralUrl = buildReferralUrl(referralCode);

  function handleCopy() {
    navigator.clipboard.writeText(referralUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const rewardText = t('referral.reward');
  const descParts = t('referral.desc').split('{reward}');

  return (
    <div className="glass-card rounded-xl p-6">
      <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
        <Gift className="h-5 w-5 text-[#0055A4]" />
        {t('referral.title')}
      </h3>
      <p className="text-muted-foreground text-sm mb-4">
        {descParts[0]}
        <strong className="text-foreground">{rewardText}</strong>
        {descParts[1]}
      </p>
      <div className="flex gap-2">
        <Input
          readOnly
          value={referralUrl}
          className="flex-1 bg-muted/50"
          aria-label={t('referral.label')}
        />
        <Button onClick={handleCopy} className="gap-2 bg-[#0055A4] hover:bg-[#1B6ED6] text-white">
          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          {copied ? t('referral.copied') : t('referral.copy')}
        </Button>
      </div>
      <p className="text-xs text-muted-foreground mt-2">
        {t('referral.count')
          .replace('{count}', String(referralCount))
          .replace('{s}', referralCount !== 1 ? 's' : '')
          .replace('{s}', referralCount !== 1 ? 's' : '')}
      </p>
    </div>
  );
}
