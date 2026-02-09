import { useState } from 'react';
import { PlayCircle, Lock } from 'lucide-react';
import SubscriptionGate from '@/components/SubscriptionGate';

interface PremiumVideoGuidesProps {
  isTier2: boolean;
}

const VIDEO_GUIDES = [
  { title: 'Les symboles de la République', duration: '12 min' },
  { title: 'La Constitution expliquée', duration: '18 min' },
  { title: 'Préparer l\'entretien', duration: '15 min' },
];

export default function PremiumVideoGuides({ isTier2 }: PremiumVideoGuidesProps) {
  const [showGate, setShowGate] = useState(false);

  const handleClick = () => {
    if (!isTier2) {
      setShowGate(true);
    }
  };

  return (
    <>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {VIDEO_GUIDES.map((video) => (
          <div
            key={video.title}
            className={`glass-card glow-hover cursor-pointer p-5 transition-all ${!isTier2 ? 'opacity-70' : ''}`}
            onClick={handleClick}
          >
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10 shadow-[0_0_10px_hsl(var(--primary)/0.15)]">
                {isTier2 ? (
                  <PlayCircle className="h-6 w-6 text-primary" />
                ) : (
                  <Lock className="h-5 w-5 text-muted-foreground animate-pulse" />
                )}
              </div>
              <div>
                <p className="font-medium text-foreground">{video.title}</p>
                <p className="text-xs text-muted-foreground">{video.duration}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      <SubscriptionGate open={showGate} onOpenChange={setShowGate} requiredTier="tier_2" />
    </>
  );
}
