import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/contexts/LanguageContext';
import { Check, X, Crown, Sparkles, Shield, Infinity, Zap, Star, Gift, Globe, BookOpen, BarChart2, Unlock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AnimatedSection from '@/components/AnimatedSection';
import { useAuth } from '@/hooks/useAuth';
import { useSubscription } from '@/hooks/useSubscription';
import SubscriptionGate from '@/components/SubscriptionGate';

export default function PricingSection() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { tier: userTier, isStandardOrAbove, isPremium, isLifetime } = useSubscription();

  const [showGate, setShowGate] = useState(false);
  const [gateTier, setGateTier] = useState<'standard' | 'premium'>('standard');

  // Feature comparison rows for Free vs Standard
  const standardFeatures = [
    { key: 'pricing.feat.browse', free: true, standard: true },
    { key: 'pricing.feat.exam1', free: true, standard: true },
    { key: 'pricing.feat.classes10', free: true, standard: true },
    { key: 'pricing.feat.unlimited', free: false, standard: true },
    { key: 'pricing.feat.training', free: false, standard: true },
    { key: 'pricing.feat.progress', free: false, standard: true },
    { key: 'pricing.feat.lessons', free: false, standard: true },
    { key: 'pricing.feat.path', free: false, standard: true },
  ];

  const lifetimePerks = [
    { icon: Infinity,  key: 'pricing.lifetime.perk1' },
    { icon: Unlock,    key: 'pricing.lifetime.perk2' },
    { icon: Globe,     key: 'pricing.lifetime.perk3' },
    { icon: BarChart2, key: 'pricing.lifetime.perk4' },
    { icon: BookOpen,  key: 'pricing.lifetime.perk5' },
    { icon: Zap,       key: 'pricing.lifetime.perk6' },
    { icon: Star,      key: 'pricing.lifetime.perk7' },
    { icon: Gift,      key: 'pricing.lifetime.perk8' },
  ];

  const isUserTier = (tierId: string) => user && userTier === tierId;
  const isUserAboveTier = (tierId: string) => {
    if (!user) return false;
    const order: Record<string, number> = { free: 0, standard: 1, premium: 2, lifetime: 3 };
    return (order[userTier] ?? 0) > (order[tierId] ?? 0);
  };

  return (
    <section id="pricing" className="relative bg-background py-12 md:py-24 section-glow">
      <div className="container relative z-10 px-4">
        <AnimatedSection>
          <div className="mx-auto max-w-2xl text-center mb-10 md:mb-14">
            <h2 className="font-serif text-2xl font-bold sm:text-3xl md:text-4xl">
              <span className="gradient-text">{t('pricing.title')}</span>
            </h2>
            <p className="mt-3 text-sm text-muted-foreground">
              {t('pricing.subtitle2')}
            </p>
          </div>
        </AnimatedSection>

        {/* ─── Lifetime highlight banner ─── */}
        <AnimatedSection delay={50}>
          <div className="mx-auto mb-10 max-w-4xl rounded-3xl overflow-hidden shadow-2xl border border-violet-200/50">
            <div className="relative bg-gradient-to-br from-[#1e1b4b] via-[#312e81] to-[#4c1d95] p-8 md:p-10">
              {/* Decorative blobs */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-violet-400/10 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-indigo-400/10 rounded-full blur-3xl pointer-events-none" />

              <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center gap-8">
                {/* Left: hero copy */}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="bg-violet-400/20 border border-violet-400/30 text-violet-300 text-xs font-black px-3 py-1 rounded-full uppercase tracking-widest flex items-center gap-1.5">
                      <Infinity className="w-3 h-3" /> {t('pricing.lifetime.badge')}
                    </span>
                    <span className="bg-amber-400/20 border border-amber-400/30 text-amber-300 text-xs font-bold px-3 py-1 rounded-full">
                      {t('pricing.lifetime.bestValue')}
                    </span>
                  </div>

                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="text-5xl md:text-6xl font-black text-white">30 €</span>
                    <span className="text-white/50 text-lg font-semibold line-through">79,99 €/an</span>
                    <span className="bg-emerald-500 text-white text-xs font-black px-2 py-0.5 rounded-full">−63%</span>
                  </div>
                  <p className="text-white/60 text-sm mb-6">{t('pricing.lifetime.oneTime')}</p>

                  {/* Perks grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {lifetimePerks.map(({ icon: Icon, key }) => (
                      <div key={key} className="flex items-center gap-2">
                        <div className="flex-shrink-0 w-5 h-5 rounded-full bg-violet-400/20 flex items-center justify-center">
                          <Icon className="w-3 h-3 text-violet-300" />
                        </div>
                        <span className="text-xs text-white/80 font-medium">{t(key)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right: CTA */}
                <div className="flex-shrink-0 flex flex-col items-center gap-4 w-full lg:w-56">
                  {isLifetime ? (
                    <Button className="w-full h-14 rounded-2xl bg-white/20 text-white border border-white/30 font-bold text-base cursor-default" disabled>
                      <Check className="h-5 w-5 mr-2" /> {t('pricing.yourPlan')}
                    </Button>
                  ) : (
                    <>
                      <Button
                        onClick={() => { setGateTier('premium'); setShowGate(true); }}
                        className="w-full h-14 rounded-2xl font-black text-base shadow-2xl hover:-translate-y-0.5 transition-all"
                        style={{ background: 'linear-gradient(135deg, #7C3AED, #4F46E5)' }}
                      >
                        <Infinity className="h-5 w-5 mr-2" />
                        {t('pricing.lifetime.cta')}
                      </Button>
                      <div className="flex items-center gap-1.5 text-white/50 text-xs">
                        <Shield className="h-3 w-3 text-emerald-400" />
                        {t('pricing.securePaymentStripe')}
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Bottom strip */}
            <div className="bg-violet-950/60 border-t border-violet-700/30 px-8 py-3 flex flex-wrap items-center justify-center gap-x-6 gap-y-1">
              {['pricing.lifetime.strip1', 'pricing.lifetime.strip2', 'pricing.lifetime.strip3', 'pricing.lifetime.strip4'].map(k => (
                <span key={k} className="flex items-center gap-1.5 text-xs text-violet-300/70 font-medium">
                  <Check className="w-3 h-3 text-violet-400" /> {t(k)}
                </span>
              ))}
            </div>
          </div>
        </AnimatedSection>

        {/* ─── Free vs Standard monthly cards ─── */}
        <div className="mx-auto max-w-3xl grid grid-cols-1 gap-5 sm:grid-cols-2">
          {/* Free */}
          <AnimatedSection delay={100}>
            <div className={`glass-card relative flex flex-col overflow-hidden p-6 h-full ${isUserTier('free') ? 'border-[#1764ac] ring-2 ring-[#1764ac]/30' : ''}`}>
              {isUserTier('free') && (
                <Badge className="absolute right-4 top-4 bg-[#1764ac] text-white border-0">✓ {t('pricing.yourPlan')}</Badge>
              )}
              <div className="mb-4">
                <p className="text-xl font-bold text-foreground">{t('pricing.free')}</p>
                <div className="flex items-baseline gap-1 mt-2">
                  <span className="font-serif text-4xl font-bold text-[#1764ac]">0 €</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">{t('pricing.free.tagline')}</p>
              </div>

              <ul className="mb-6 flex-1 space-y-3">
                {standardFeatures.map((feat) => (
                  <li key={feat.key} className="flex items-center gap-2 text-sm">
                    {feat.free ? (
                      <Check className="h-4 w-4 shrink-0 text-[#1764ac]" />
                    ) : (
                      <X className="h-4 w-4 shrink-0 text-muted-foreground/40" />
                    )}
                    <span className={feat.free ? 'text-foreground' : 'text-muted-foreground/50'}>{t(feat.key)}</span>
                  </li>
                ))}
              </ul>

              {isUserTier('free') ? (
                <Button className="w-full" variant="outline" disabled><Check className="h-4 w-4 mr-2" /> {t('pricing.subscribed')}</Button>
              ) : isUserAboveTier('free') ? (
                <Button className="w-full" variant="outline" disabled>{t('pricing.includedInPlan')}</Button>
              ) : (
                <Button
                  className="w-full bg-[#0055A4] hover:bg-[#1B6ED6] text-white border-0 shadow-lg shadow-[#0055A4]/25"
                  onClick={() => navigate('/auth')}
                >
                  {t('pricing.ctaFree')}
                </Button>
              )}
            </div>
          </AnimatedSection>

          {/* Standard monthly */}
          <AnimatedSection delay={200}>
            <div className={`glass-card glow-hover relative flex flex-col overflow-hidden p-6 h-full border-[#f04e42]/40 shadow-[0_0_35px_rgba(240,78,66,0.12)] ${isUserTier('standard') ? 'border-emerald-400 shadow-[0_0_35px_rgba(16,185,129,0.15)] ring-2 ring-emerald-400/30' : ''}`}>
              {isUserTier('standard') ? (
                <Badge className="absolute right-4 top-4 bg-emerald-500 text-white border-0">✓ {t('pricing.yourPlan')}</Badge>
              ) : !isUserAboveTier('standard') ? (
                <Badge
                  className="absolute right-4 top-4 text-white border-0"
                  style={{ background: 'linear-gradient(135deg, #f04e42, #ff7b6b)' }}
                >
                  {t('pricing.recommended')}
                </Badge>
              ) : null}

              <div className="mb-4">
                <p className="text-xl font-bold text-foreground flex items-center gap-2">
                  Standard <Sparkles className="h-4 w-4 text-[#f04e42]" />
                </p>
                <div className="flex items-baseline gap-1 mt-2">
                  <span className="font-serif text-4xl font-bold text-[#f04e42]">6,99 €</span>
                  <span className="text-sm font-medium text-muted-foreground">{t('gate.perMonth')}</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">{t('pricing.standard.tagline')}</p>
              </div>

              <ul className="mb-6 flex-1 space-y-3">
                {standardFeatures.map((feat) => (
                  <li key={feat.key} className="flex items-center gap-2 text-sm">
                    {feat.standard ? (
                      <Check className="h-4 w-4 shrink-0 text-[#f04e42]" />
                    ) : (
                      <X className="h-4 w-4 shrink-0 text-muted-foreground/40" />
                    )}
                    <span className={feat.standard ? 'text-foreground' : 'text-muted-foreground/50'}>{t(feat.key)}</span>
                  </li>
                ))}
              </ul>

              {isUserTier('standard') ? (
                <Button className="w-full" variant="outline" disabled><Check className="h-4 w-4 mr-2" /> {t('pricing.subscribed')}</Button>
              ) : isUserAboveTier('standard') ? (
                <Button className="w-full" variant="outline" disabled>{t('pricing.includedInPlan')}</Button>
              ) : (
                <Button
                  className="w-full bg-white text-[#EF4135] border-2 border-[#EF4135] hover:bg-[#EF4135] hover:text-white shadow-lg shadow-[#EF4135]/20 transition-colors"
                  variant="outline"
                  onClick={() => { setGateTier('standard'); setShowGate(true); }}
                >
                  {t('pricing.ctaStandard')}
                </Button>
              )}
            </div>
          </AnimatedSection>
        </div>

        {/* Reassurance strip */}
        <AnimatedSection delay={300}>
          <div className="mx-auto mt-8 max-w-3xl flex items-center justify-center gap-2.5 rounded-full border border-emerald-200 bg-emerald-50 px-5 py-2.5 text-sm font-semibold text-emerald-800 shadow-sm">
            <Shield className="h-4 w-4 shrink-0 text-emerald-600" />
            <span>{t('pricing.reassurance')}</span>
          </div>
        </AnimatedSection>
      </div>

      <SubscriptionGate open={showGate} onOpenChange={setShowGate} requiredTier={gateTier} />
    </section>
  );
}
