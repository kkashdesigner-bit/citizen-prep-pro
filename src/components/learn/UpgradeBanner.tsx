import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Lock, ArrowRight } from 'lucide-react';

interface UpgradeBannerProps {
  title: string;
  description: string;
  tier: 'standard' | 'premium';
  onUpgrade: () => void;
}

export default function UpgradeBanner({ title, description, tier, onUpgrade }: UpgradeBannerProps) {
  return (
    <div className="rounded-2xl border border-primary/20 bg-card/80 p-5 md:p-6 text-center">
      <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
        <Lock className="h-5 w-5 text-primary" />
      </div>
      <h3 className="font-semibold text-foreground mb-1">{title}</h3>
      <p className="text-sm text-muted-foreground mb-4">{description}</p>
      <Button className="gap-2" onClick={onUpgrade}>
        Upgrade to {tier === 'premium' ? 'Premium' : 'Standard'}
        <ArrowRight className="h-4 w-4" />
      </Button>
    </div>
  );
}
