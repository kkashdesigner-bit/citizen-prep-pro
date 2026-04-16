import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { buildReferralUrl } from '@/utils/referral';
import { Copy, Check, Gift } from 'lucide-react';

interface ReferralSectionProps {
  referralCode: string;
  referralCount: number;
}

export default function ReferralSection({ referralCode, referralCount }: ReferralSectionProps) {
  const [copied, setCopied] = useState(false);
  const referralUrl = buildReferralUrl(referralCode);

  function handleCopy() {
    navigator.clipboard.writeText(referralUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="glass-card rounded-xl p-6">
      <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
        <Gift className="h-5 w-5 text-[#0055A4]" />
        Invitez un ami
      </h3>
      <p className="text-muted-foreground text-sm mb-4">
        Partagez GoCivique avec un ami qui pr&eacute;pare aussi l'examen civique.
        S'il souscrit, vous recevez tous les deux{' '}
        <strong className="text-foreground">1 mois Standard offert</strong>.
      </p>
      <div className="flex gap-2">
        <Input
          readOnly
          value={referralUrl}
          className="flex-1 bg-muted/50"
          aria-label="Lien de parrainage"
        />
        <Button onClick={handleCopy} className="gap-2 bg-[#0055A4] hover:bg-[#1B6ED6] text-white">
          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          {copied ? 'Copi\u00e9 !' : 'Copier'}
        </Button>
      </div>
      <p className="text-xs text-muted-foreground mt-2">
        {referralCount} ami{referralCount !== 1 ? 's' : ''} inscrit{referralCount !== 1 ? 's' : ''} via votre lien
      </p>
    </div>
  );
}
