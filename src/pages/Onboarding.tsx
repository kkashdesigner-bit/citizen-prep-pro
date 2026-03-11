import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SEOHead from '@/components/SEOHead';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/useAuth';
import { useUserProfile, GoalType, LevelType, TimelineType, GOAL_TO_LEVEL } from '@/hooks/useUserProfile';
import { supabase } from '@/integrations/supabase/client';
import {
  Check, ArrowRight, Target, Clock, Zap, ChevronLeft,
  Landmark, CreditCard, ClipboardList,
  Sprout, BookOpen, GraduationCap, ShieldQuestion,
  PartyPopper, Flag, User,
} from 'lucide-react';
import Logo from '@/components/Logo';

const TOTAL_STEPS = 6;
const AVATARS = Array.from({ length: 8 }, (_, i) => `/avatar-${i + 1}.webp`);

type OnboardingData = {
  first_name: string;
  avatar_url: string | null;
  goal_type: GoalType | null;
  level: LevelType | null;
  timeline: TimelineType | null;
};

export default function Onboarding() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { profile, loading: profileLoading, saveProfile } = useUserProfile();
  const [step, setStep] = useState(1);
  const [data, setData] = useState<OnboardingData>({
    first_name: '',
    avatar_url: null,
    goal_type: null,
    level: null,
    timeline: null,
  });
  const [saving, setSaving] = useState(false);
  const [animating, setAnimating] = useState(false);

  // Pre-fill name from profiles
  useEffect(() => {
    if (!user) return;
    supabase.from('profiles').select('display_name').eq('id', user.id).maybeSingle().then(({ data: p }) => {
      if (p?.display_name) setData(d => ({ ...d, first_name: p.display_name }));
    });
  }, [user]);

  useEffect(() => {
    if (authLoading || profileLoading) return;
    if (!user) { navigate('/auth'); return; }
    if (profile?.onboarding_completed) { navigate('/learn'); return; }
  }, [user, authLoading, profile, profileLoading, navigate]);

  const goToStep = (next: number) => {
    setAnimating(true);
    setTimeout(() => {
      setStep(next);
      setAnimating(false);
    }, 220);
  };

  const handleComplete = async () => {
    setSaving(true);
    // Save to user_profile
    await saveProfile({
      first_name: data.first_name || null,
      avatar_url: data.avatar_url,
      goal_type: data.goal_type,
      level: data.level,
      timeline: data.timeline,
      onboarding_completed: true,
    });
    // Also sync avatar + display name to profiles table
    if (user) {
      await supabase.from('profiles').update({
        display_name: data.first_name || null,
        avatar_url: data.avatar_url,
      }).eq('id', user.id);
    }
    setSaving(false);
    navigate('/learn');
  };

  if (authLoading || profileLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#0055A4] border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <SEOHead noindex />
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-[#E6EAF0]">
        <Logo size="sm" />
        <div className="flex items-center gap-3">
          {step > 1 && (
            <button
              onClick={() => goToStep(step - 1)}
              className="text-[#1A1A1A]/50 hover:text-[#1A1A1A] transition-colors flex items-center gap-1 text-sm font-medium"
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Retour</span>
            </button>
          )}
          <div className="flex items-center gap-1.5">
            {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
              <div
                key={i}
                className={`h-2 rounded-full transition-all duration-500 ${i + 1 <= step ? 'w-6 bg-[#0055A4]' : 'w-2 bg-[#E6EAF0]'
                  }`}
              />
            ))}
          </div>
          <span className="text-xs text-[#1A1A1A]/40 font-bold tabular-nums">{step}/{TOTAL_STEPS}</span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-1 bg-[#E6EAF0]">
        <div className="h-full bg-[#0055A4] transition-all duration-500 ease-out" style={{ width: `${(step / TOTAL_STEPS) * 100}%` }} />
      </div>

      {/* Step content */}
      <div className="flex-1 flex items-center justify-center px-4 py-6 sm:py-8">
        <div className={`w-full max-w-xl transition-all duration-220 ${animating ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'}`}>
          {step === 1 && <StepWelcome onContinue={() => goToStep(2)} />}
          {step === 2 && (
            <StepProfile
              name={data.first_name}
              avatar={data.avatar_url}
              onNameChange={(n) => setData(d => ({ ...d, first_name: n }))}
              onAvatarChange={(a) => setData(d => ({ ...d, avatar_url: a }))}
              onContinue={() => goToStep(3)}
            />
          )}
          {step === 3 && (
            <StepGoal
              selected={data.goal_type}
              onSelect={(g) => setData(d => ({ ...d, goal_type: g }))}
              onContinue={() => goToStep(4)}
            />
          )}
          {step === 4 && (
            <StepLevel
              selected={data.level}
              onSelect={(l) => setData(d => ({ ...d, level: l }))}
              onContinue={() => goToStep(5)}
            />
          )}
          {step === 5 && (
            <StepTimeline
              selected={data.timeline}
              onSelect={(t) => setData(d => ({ ...d, timeline: t }))}
              onContinue={() => goToStep(6)}
            />
          )}
          {step === 6 && <StepComplete data={data} onStart={handleComplete} saving={saving} />}
        </div>
      </div>

      <style>{`
        @keyframes bounceIn {
          0% { transform: scale(0.8); opacity: 0; }
          50% { transform: scale(1.05); }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes ringPulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(0,85,164,0.4); }
          50% { box-shadow: 0 0 0 8px rgba(0,85,164,0); }
        }
        @keyframes slideUp {
          0% { opacity: 0; transform: translateY(16px); }
          100% { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

/* ─── Step 1: Welcome ─── */
function StepWelcome({ onContinue }: { onContinue: () => void }) {
  return (
    <div className="text-center space-y-8">
      <div className="space-y-4" style={{ animation: 'slideUp 0.6s ease-out' }}>
        <div className="inline-flex h-20 w-20 items-center justify-center rounded-3xl bg-[#0055A4]/10 mx-auto">
          <Flag className="h-10 w-10 text-[#0055A4]" />
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-[#1A1A1A] leading-tight">
          Commençons par comprendre<br />
          <span className="text-[#0055A4]">votre objectif</span>
        </h1>
        <p className="text-[#1A1A1A]/60 text-lg max-w-md mx-auto">
          Répondez à quelques questions pour que nous puissions personnaliser votre parcours d'apprentissage.
        </p>
      </div>

      <div className="grid grid-cols-3 gap-3 sm:gap-4" style={{ animation: 'slideUp 0.6s ease-out 0.15s both' }}>
        {[
          { icon: <Crosshair className="h-5 w-5 sm:h-6 sm:w-6 text-[#0055A4]" />, label: 'Objectif ciblé' },
          { icon: <BarChart3 className="h-5 w-5 sm:h-6 sm:w-6 text-[#0055A4]" />, label: 'Progression suivie' },
          { icon: <Zap className="h-5 w-5 sm:h-6 sm:w-6 text-[#0055A4]" />, label: 'Résultats rapides' },
        ].map(item => (
          <div key={item.label} className="rounded-2xl border border-[#E6EAF0] bg-[#F5F7FA] p-4 flex flex-col items-center gap-2">
            {item.icon}
            <p className="text-xs text-[#1A1A1A]/60 font-medium">{item.label}</p>
          </div>
        ))}
      </div>

      <Button
        size="lg"
        className="w-full gap-2 h-14 text-base font-bold bg-[#0055A4] hover:bg-[#1B6ED6] rounded-xl transition-all hover:scale-[1.01]"
        onClick={onContinue}
        style={{ animation: 'slideUp 0.6s ease-out 0.3s both' }}
      >
        Continuer
        <ArrowRight className="h-5 w-5" />
      </Button>
    </div>
  );
}

/* ─── Step 2: Profile & Avatar ─── */
function StepProfile({ name, avatar, onNameChange, onAvatarChange, onContinue }: {
  name: string;
  avatar: string | null;
  onNameChange: (n: string) => void;
  onAvatarChange: (a: string) => void;
  onContinue: () => void;
}) {
  return (
    <div className="space-y-6">
      <div className="text-center space-y-2" style={{ animation: 'slideUp 0.5s ease-out' }}>
        <h2 className="text-2xl md:text-3xl font-bold text-[#1A1A1A]">Personnalisez votre profil</h2>
        <p className="text-[#1A1A1A]/60">Choisissez votre avatar et entrez votre prénom</p>
      </div>

      {/* Name input */}
      <div className="space-y-2" style={{ animation: 'slideUp 0.5s ease-out 0.1s both' }}>
        <Label htmlFor="onboard-name" className="text-sm font-medium text-[#1A1A1A]">Comment vous appelez-vous ?</Label>
        <div className="relative">
          <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#1A1A1A]/30" />
          <Input
            id="onboard-name"
            type="text"
            placeholder="Votre prénom"
            value={name}
            onChange={(e) => onNameChange(e.target.value)}
            className="pl-10 h-12 rounded-xl border-[#E6EAF0] bg-[#F5F7FA] hover:border-[#0055A4]/30 focus:border-[#0055A4] focus:bg-white focus:shadow-[0_0_0_3px_rgba(0,85,164,0.1)] transition-all text-lg"
          />
        </div>
      </div>

      {/* Avatar grid */}
      <div style={{ animation: 'slideUp 0.5s ease-out 0.2s both' }}>
        <p className="text-sm font-medium text-[#1A1A1A] mb-3">Choisissez votre avatar</p>
        <div className="grid grid-cols-4 gap-3 sm:gap-4">
          {AVATARS.map((src, i) => {
            const isSelected = avatar === src;
            return (
              <button
                key={i}
                onClick={() => onAvatarChange(src)}
                className={`relative aspect-square rounded-2xl overflow-hidden border-[3px] transition-all duration-300 ${isSelected
                    ? 'border-[#0055A4] scale-105 shadow-lg'
                    : 'border-[#E6EAF0] hover:border-[#0055A4]/40 hover:scale-[1.03]'
                  }`}
                style={{
                  animation: `bounceIn 0.4s ease-out ${0.05 * i}s both`,
                  ...(isSelected ? { animation: `bounceIn 0.4s ease-out ${0.05 * i}s both, ringPulse 2s ease-in-out infinite` } : {}),
                }}
              >
                <img src={src} alt={`Avatar ${i + 1}`} className="w-full h-full object-cover" loading="lazy" />
                {isSelected && (
                  <div className="absolute inset-0 bg-[#0055A4]/15 flex items-center justify-center">
                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#0055A4] flex items-center justify-center shadow-lg">
                      <Check className="h-4 w-4 text-white" strokeWidth={3} />
                    </div>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      <Button
        size="lg"
        className="w-full gap-2 h-14 text-base font-bold bg-[#0055A4] hover:bg-[#1B6ED6] rounded-xl transition-all hover:scale-[1.01]"
        disabled={!avatar}
        onClick={onContinue}
        style={{ animation: 'slideUp 0.5s ease-out 0.3s both' }}
      >
        Continuer
        <ArrowRight className="h-5 w-5" />
      </Button>
    </div>
  );
}

/* ─── Step 3: Goal ─── */
const GOALS: { value: GoalType; label: string; description: string; icon: React.ReactNode }[] = [
  { value: 'naturalisation', label: 'Naturalisation française', description: 'Je prépare ma demande de naturalisation', icon: <Landmark className="h-6 w-6" /> },
  { value: 'carte_resident', label: 'Carte de Résident (CR)', description: 'Je renouvelle ou demande ma CR 10 ans', icon: <CreditCard className="h-6 w-6" /> },
  { value: 'csp', label: 'Carte de Séjour Pluriannuelle (CSP)', description: 'Valeurs républicaines fondamentales', icon: <ClipboardList className="h-6 w-6" /> },
];

function StepGoal({ selected, onSelect, onContinue }: {
  selected: GoalType | null;
  onSelect: (g: GoalType) => void;
  onContinue: () => void;
}) {
  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl md:text-3xl font-bold text-[#1A1A1A]">Quel est votre objectif ?</h2>
        <p className="text-[#1A1A1A]/60">Sélectionnez votre situation actuelle</p>
      </div>

      <div className="space-y-3">
        {GOALS.map((goal, i) => (
          <button
            key={goal.value}
            onClick={() => onSelect(goal.value)}
            className={`w-full flex items-center gap-4 rounded-2xl border-2 p-4 text-left transition-all duration-200 hover:-translate-y-0.5 ${selected === goal.value
              ? 'border-[#0055A4] bg-[#0055A4]/5 shadow-[0_4px_16px_rgba(0,85,164,0.15)]'
              : 'border-[#E6EAF0] bg-white hover:border-[#0055A4]/30'
              }`}
            style={{ animation: `slideUp 0.4s ease-out ${i * 0.08}s both` }}
          >
            <div className={`flex-shrink-0 h-10 w-10 rounded-xl flex items-center justify-center transition-colors ${selected === goal.value ? 'bg-[#0055A4] text-white' : 'bg-[#0055A4]/10 text-[#0055A4]'
              }`}>
              {goal.icon}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-[#1A1A1A]">{goal.label}</p>
              <p className="text-sm text-[#1A1A1A]/60 mt-0.5">{goal.description}</p>
            </div>
            {selected === goal.value && (
              <div className="flex-shrink-0 h-6 w-6 rounded-full bg-[#0055A4] flex items-center justify-center">
                <Check className="h-3.5 w-3.5 text-white" />
              </div>
            )}
          </button>
        ))}
      </div>

      <Button
        size="lg"
        className="w-full gap-2 h-14 text-base font-bold bg-[#0055A4] hover:bg-[#1B6ED6] rounded-xl transition-all hover:scale-[1.01]"
        disabled={!selected}
        onClick={onContinue}
      >
        Continuer
        <ArrowRight className="h-5 w-5" />
      </Button>
    </div>
  );
}

/* ─── Step 4: Level ─── */
const LEVELS: { value: LevelType; label: string; description: string; icon: React.ReactNode }[] = [
  { value: 'beginner', label: 'Débutant', description: 'Je commence à apprendre les bases', icon: <Sprout className="h-6 w-6" /> },
  { value: 'intermediate', label: 'Intermédiaire', description: "J'ai quelques connaissances du sujet", icon: <BookOpen className="h-6 w-6" /> },
  { value: 'advanced', label: 'Avancé', description: 'Je connais bien le sujet et veux affiner', icon: <GraduationCap className="h-6 w-6" /> },
];

function StepLevel({ selected, onSelect, onContinue }: {
  selected: LevelType | null;
  onSelect: (l: LevelType) => void;
  onContinue: () => void;
}) {
  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl md:text-3xl font-bold text-[#1A1A1A]">Quel est votre niveau actuel ?</h2>
        <p className="text-[#1A1A1A]/60">Cela nous aide à calibrer vos questions</p>
      </div>

      <div className="space-y-3">
        {LEVELS.map((level, i) => (
          <button
            key={level.value}
            onClick={() => onSelect(level.value)}
            className={`w-full flex items-center gap-4 rounded-2xl border-2 p-5 text-left transition-all duration-200 hover:-translate-y-0.5 ${selected === level.value
              ? 'border-[#0055A4] bg-[#0055A4]/5 shadow-[0_4px_16px_rgba(0,85,164,0.15)]'
              : 'border-[#E6EAF0] bg-white hover:border-[#0055A4]/30'
              }`}
            style={{ animation: `slideUp 0.4s ease-out ${i * 0.08}s both` }}
          >
            <div className={`flex-shrink-0 h-12 w-12 rounded-xl flex items-center justify-center transition-colors ${selected === level.value ? 'bg-[#0055A4] text-white' : 'bg-[#0055A4]/10 text-[#0055A4]'
              }`}>
              {level.icon}
            </div>
            <div className="flex-1">
              <p className="font-semibold text-[#1A1A1A] text-lg">{level.label}</p>
              <p className="text-sm text-[#1A1A1A]/60">{level.description}</p>
            </div>
            {selected === level.value && (
              <div className="flex-shrink-0 h-6 w-6 rounded-full bg-[#0055A4] flex items-center justify-center">
                <Check className="h-3.5 w-3.5 text-white" />
              </div>
            )}
          </button>
        ))}
      </div>

      <Button
        size="lg"
        className="w-full gap-2 h-14 text-base font-bold bg-[#0055A4] hover:bg-[#1B6ED6] rounded-xl transition-all hover:scale-[1.01]"
        disabled={!selected}
        onClick={onContinue}
      >
        Continuer
        <ArrowRight className="h-5 w-5" />
      </Button>
    </div>
  );
}

/* ─── Step 5: Timeline ─── */
const TIMELINES: { value: TimelineType; label: string; description: string; icon: React.ReactNode }[] = [
  { value: 'less_1_month', label: 'Moins de 1 mois', description: 'Mode intensif — révision express', icon: <Zap className="h-5 w-5" /> },
  { value: '1_3_months', label: '1 à 3 mois', description: 'Préparation progressive et solide', icon: <Target className="h-5 w-5" /> },
  { value: 'more_3_months', label: 'Plus de 3 mois', description: 'Apprentissage approfondi et durable', icon: <Clock className="h-5 w-5" /> },
  { value: 'not_sure', label: 'Pas sûr', description: "Je veux juste m'entraîner pour l'instant", icon: <ShieldQuestion className="h-5 w-5" /> },
];

function StepTimeline({ selected, onSelect, onContinue }: {
  selected: TimelineType | null;
  onSelect: (t: TimelineType) => void;
  onContinue: () => void;
}) {
  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl md:text-3xl font-bold text-[#1A1A1A]">Quand voulez-vous passer l'examen ?</h2>
        <p className="text-[#1A1A1A]/60">Adaptez le rythme à votre calendrier</p>
      </div>

      <div className="space-y-3">
        {TIMELINES.map((t, i) => (
          <button
            key={t.value}
            onClick={() => onSelect(t.value)}
            className={`w-full flex items-center gap-4 rounded-2xl border-2 p-4 text-left transition-all duration-200 hover:-translate-y-0.5 ${selected === t.value
              ? 'border-[#0055A4] bg-[#0055A4]/5 shadow-[0_4px_16px_rgba(0,85,164,0.15)]'
              : 'border-[#E6EAF0] bg-white hover:border-[#0055A4]/30'
              }`}
            style={{ animation: `slideUp 0.4s ease-out ${i * 0.08}s both` }}
          >
            <div className={`flex-shrink-0 h-10 w-10 rounded-xl flex items-center justify-center ${selected === t.value ? 'bg-[#0055A4] text-white' : 'bg-[#0055A4]/10 text-[#0055A4]'
              }`}>
              {t.icon}
            </div>
            <div className="flex-1">
              <p className="font-semibold text-[#1A1A1A]">{t.label}</p>
              <p className="text-sm text-[#1A1A1A]/60">{t.description}</p>
            </div>
            {selected === t.value && (
              <div className="flex-shrink-0 h-6 w-6 rounded-full bg-[#0055A4] flex items-center justify-center">
                <Check className="h-3.5 w-3.5 text-white" />
              </div>
            )}
          </button>
        ))}
      </div>

      <Button
        size="lg"
        className="w-full gap-2 h-14 text-base font-bold bg-[#0055A4] hover:bg-[#1B6ED6] rounded-xl transition-all hover:scale-[1.01]"
        disabled={!selected}
        onClick={onContinue}
      >
        Continuer
        <ArrowRight className="h-5 w-5" />
      </Button>
    </div>
  );
}

/* ─── Step 6: Completion ─── */

function StepComplete({ data, onStart, saving }: {
  data: OnboardingData;
  onStart: () => void;
  saving: boolean;
}) {
  return (
    <div className="text-center space-y-8">
      <div className="space-y-4" style={{ animation: 'slideUp 0.6s ease-out' }}>
        {/* Avatar */}
        <div className="relative inline-block">
          {data.avatar_url ? (
            <img
              src={data.avatar_url}
              alt="Votre avatar"
              className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl object-cover border-4 border-[#0055A4] mx-auto shadow-[0_8px_32px_rgba(0,85,164,0.3)]"
              style={{ animation: 'bounceIn 0.6s ease-out' }}
            />
          ) : (
            <div className="inline-flex h-24 w-24 items-center justify-center rounded-3xl bg-[#0055A4] mx-auto shadow-[0_8px_32px_rgba(0,85,164,0.3)]">
              <PartyPopper className="h-12 w-12 text-white" />
            </div>
          )}
        </div>

        <h2 className="text-3xl md:text-4xl font-bold text-[#1A1A1A] leading-tight">
          {data.first_name ? `Bienvenue, ${data.first_name} !` : 'Bienvenue !'}
          <br />
          <span className="text-[#0055A4]">Tout est prêt !</span>
        </h2>
      </div>

      <Button
        size="lg"
        className="w-full gap-2 h-14 text-base font-bold bg-[#0055A4] hover:bg-[#1B6ED6] rounded-xl transition-all hover:scale-[1.01]"
        onClick={onStart}
        disabled={saving}
        style={{ animation: 'slideUp 0.6s ease-out 0.2s both' }}
      >
        {saving ? 'Préparation...' : "Commencer l'entraînement"}
        {!saving && <ArrowRight className="h-5 w-5" />}
      </Button>
    </div>
  );
}
