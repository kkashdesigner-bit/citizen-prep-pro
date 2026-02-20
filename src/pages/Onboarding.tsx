import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { useUserProfile, GoalType, LevelType, TimelineType, GOAL_TO_LEVEL } from '@/hooks/useUserProfile';
import {
  Check, ArrowRight, Target, Clock, Zap, ChevronLeft,
  Landmark, CreditCard, FileText, ClipboardList, HelpCircle,
  Sprout, BookOpen, GraduationCap, ShieldQuestion,
  PartyPopper, Crosshair, BarChart3, RotateCcw, Timer, Flag,
} from 'lucide-react';
import Logo from '@/components/Logo';

const TOTAL_STEPS = 5;

type OnboardingData = {
  goal_type: GoalType | null;
  level: LevelType | null;
  timeline: TimelineType | null;
};

export default function Onboarding() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { profile, loading: profileLoading, saveProfile } = useUserProfile();
  const [step, setStep] = useState(1);
  const [data, setData] = useState<OnboardingData>({ goal_type: null, level: null, timeline: null });
  const [saving, setSaving] = useState(false);
  const [animating, setAnimating] = useState(false);

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
    await saveProfile({
      goal_type: data.goal_type,
      level: data.level,
      timeline: data.timeline,
      onboarding_completed: true,
    });
    setSaving(false);
    navigate('/learn');
  };

  if (authLoading || profileLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top bar */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-border/40">
        <Logo size="sm" />
        <div className="flex items-center gap-3">
          {step > 1 && (
            <button
              onClick={() => goToStep(step - 1)}
              className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1 text-sm"
            >
              <ChevronLeft className="h-4 w-4" />
              Retour
            </button>
          )}
          <div className="flex items-center gap-1.5">
            {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
              <div
                key={i}
                className={`h-2 rounded-full transition-all duration-300 ${
                  i + 1 <= step ? 'w-6 bg-primary' : 'w-2 bg-border'
                }`}
              />
            ))}
          </div>
          <span className="text-xs text-muted-foreground font-medium">{step}/{TOTAL_STEPS}</span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-1 bg-border/40">
        <div className="h-full bg-primary transition-all duration-500" style={{ width: `${(step / TOTAL_STEPS) * 100}%` }} />
      </div>

      {/* Step content */}
      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <div className={`w-full max-w-xl transition-all duration-220 ${animating ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'}`}>
          {step === 1 && <StepWelcome onContinue={() => goToStep(2)} />}
          {step === 2 && (
            <StepGoal
              selected={data.goal_type}
              onSelect={(g) => setData(d => ({ ...d, goal_type: g }))}
              onContinue={() => goToStep(3)}
            />
          )}
          {step === 3 && (
            <StepLevel
              selected={data.level}
              onSelect={(l) => setData(d => ({ ...d, level: l }))}
              onContinue={() => goToStep(4)}
            />
          )}
          {step === 4 && (
            <StepTimeline
              selected={data.timeline}
              onSelect={(t) => setData(d => ({ ...d, timeline: t }))}
              onContinue={() => goToStep(5)}
            />
          )}
          {step === 5 && <StepComplete data={data} onStart={handleComplete} saving={saving} />}
        </div>
      </div>
    </div>
  );
}

/* ─── Step 1: Welcome ─── */
function StepWelcome({ onContinue }: { onContinue: () => void }) {
  return (
    <div className="text-center space-y-8">
      <div className="space-y-4">
        <div className="inline-flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/10 mx-auto">
          <Flag className="h-10 w-10 text-primary" />
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-foreground leading-tight">
          Commençons par comprendre<br />
          <span className="text-primary">votre objectif</span>
        </h1>
        <p className="text-muted-foreground text-lg max-w-md mx-auto">
          Répondez à quelques questions pour que nous puissions personnaliser votre parcours d'apprentissage.
        </p>
      </div>

      <div className="grid grid-cols-3 gap-4 text-center">
        {[
          { icon: <Crosshair className="h-6 w-6 text-primary" />, label: 'Objectif ciblé' },
          { icon: <BarChart3 className="h-6 w-6 text-primary" />, label: 'Progression suivie' },
          { icon: <Zap className="h-6 w-6 text-primary" />, label: 'Résultats rapides' },
        ].map(item => (
          <div key={item.label} className="rounded-2xl border border-border/60 bg-card p-4 flex flex-col items-center gap-2">
            {item.icon}
            <p className="text-xs text-muted-foreground font-medium">{item.label}</p>
          </div>
        ))}
      </div>

      <Button size="lg" className="w-full gap-2 h-14 text-base font-semibold" onClick={onContinue}>
        Continuer
        <ArrowRight className="h-5 w-5" />
      </Button>
    </div>
  );
}

/* ─── Step 2: Goal / Persona ─── */
const GOALS: { value: GoalType; label: string; description: string; icon: React.ReactNode }[] = [
  { value: 'naturalisation', label: 'Naturalisation française', description: 'Je prépare ma demande de naturalisation', icon: <Landmark className="h-6 w-6" /> },
  { value: 'carte_resident', label: 'Carte de Résident (CR)', description: 'Je renouvelle ou demande ma CR 10 ans', icon: <CreditCard className="h-6 w-6" /> },
  { value: 'carte_resident_permanent', label: 'Carte de Résident Permanent (CPR)', description: 'Résidence permanente en France', icon: <FileText className="h-6 w-6" /> },
  { value: 'ofii', label: 'Test OFII', description: 'Test de connaissance du français/civisme', icon: <ClipboardList className="h-6 w-6" /> },
  { value: 'unknown', label: 'Je ne sais pas encore', description: 'Je découvre et prépare à l\'avance', icon: <HelpCircle className="h-6 w-6" /> },
];

function StepGoal({ selected, onSelect, onContinue }: {
  selected: GoalType | null;
  onSelect: (g: GoalType) => void;
  onContinue: () => void;
}) {
  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <p className="text-xs font-semibold text-primary uppercase tracking-widest">Étape 1 sur 4</p>
        <h2 className="text-2xl md:text-3xl font-bold text-foreground">Quel est votre objectif ?</h2>
        <p className="text-muted-foreground">Sélectionnez votre situation actuelle</p>
      </div>

      <div className="space-y-3">
        {GOALS.map(goal => (
          <button
            key={goal.value}
            onClick={() => onSelect(goal.value)}
            className={`w-full flex items-center gap-4 rounded-2xl border-2 p-4 text-left transition-all duration-200 hover:-translate-y-0.5 ${
              selected === goal.value
                ? 'border-primary bg-primary/5 shadow-[0_4px_16px_hsl(var(--primary)/0.15)]'
                : 'border-border/60 bg-card hover:border-primary/30 hover:bg-primary/3'
            }`}
          >
            <div className={`flex-shrink-0 h-10 w-10 rounded-xl flex items-center justify-center transition-colors ${
              selected === goal.value ? 'bg-primary text-primary-foreground' : 'bg-primary/10 text-primary'
            }`}>
              {goal.icon}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-foreground">{goal.label}</p>
              <p className="text-sm text-muted-foreground mt-0.5">{goal.description}</p>
            </div>
            {selected === goal.value && (
              <div className="flex-shrink-0 h-6 w-6 rounded-full bg-primary flex items-center justify-center">
                <Check className="h-3.5 w-3.5 text-primary-foreground" />
              </div>
            )}
          </button>
        ))}
      </div>

      <Button
        size="lg"
        className="w-full gap-2 h-14 text-base font-semibold"
        disabled={!selected}
        onClick={onContinue}
      >
        Continuer
        <ArrowRight className="h-5 w-5" />
      </Button>
    </div>
  );
}

/* ─── Step 3: Level ─── */
const LEVELS: { value: LevelType; label: string; description: string; icon: React.ReactNode }[] = [
  { value: 'beginner', label: 'Débutant', description: 'Je commence à apprendre les bases', icon: <Sprout className="h-6 w-6" /> },
  { value: 'intermediate', label: 'Intermédiaire', description: 'J\'ai quelques connaissances du sujet', icon: <BookOpen className="h-6 w-6" /> },
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
        <p className="text-xs font-semibold text-primary uppercase tracking-widest">Étape 2 sur 4</p>
        <h2 className="text-2xl md:text-3xl font-bold text-foreground">Quel est votre niveau actuel ?</h2>
        <p className="text-muted-foreground">Cela nous aide à calibrer vos questions</p>
      </div>

      <div className="space-y-3">
        {LEVELS.map(level => (
          <button
            key={level.value}
            onClick={() => onSelect(level.value)}
            className={`w-full flex items-center gap-4 rounded-2xl border-2 p-5 text-left transition-all duration-200 hover:-translate-y-0.5 ${
              selected === level.value
                ? 'border-primary bg-primary/5 shadow-[0_4px_16px_hsl(var(--primary)/0.15)]'
                : 'border-border/60 bg-card hover:border-primary/30'
            }`}
          >
            <div className={`flex-shrink-0 h-12 w-12 rounded-xl flex items-center justify-center transition-colors ${
              selected === level.value ? 'bg-primary text-primary-foreground' : 'bg-primary/10 text-primary'
            }`}>
              {level.icon}
            </div>
            <div className="flex-1">
              <p className="font-semibold text-foreground text-lg">{level.label}</p>
              <p className="text-sm text-muted-foreground">{level.description}</p>
            </div>
            {selected === level.value && (
              <div className="flex-shrink-0 h-6 w-6 rounded-full bg-primary flex items-center justify-center">
                <Check className="h-3.5 w-3.5 text-primary-foreground" />
              </div>
            )}
          </button>
        ))}
      </div>

      <Button
        size="lg"
        className="w-full gap-2 h-14 text-base font-semibold"
        disabled={!selected}
        onClick={onContinue}
      >
        Continuer
        <ArrowRight className="h-5 w-5" />
      </Button>
    </div>
  );
}

/* ─── Step 4: Timeline ─── */
const TIMELINES: { value: TimelineType; label: string; description: string; icon: React.ReactNode }[] = [
  { value: 'less_1_month', label: 'Moins de 1 mois', description: 'Mode intensif — révision express', icon: <Zap className="h-5 w-5" /> },
  { value: '1_3_months', label: '1 à 3 mois', description: 'Préparation progressive et solide', icon: <Target className="h-5 w-5" /> },
  { value: 'more_3_months', label: 'Plus de 3 mois', description: 'Apprentissage approfondi et durable', icon: <Clock className="h-5 w-5" /> },
  { value: 'not_sure', label: 'Pas sûr', description: 'Je veux juste m\'entraîner pour l\'instant', icon: <ShieldQuestion className="h-5 w-5" /> },
];

function StepTimeline({ selected, onSelect, onContinue }: {
  selected: TimelineType | null;
  onSelect: (t: TimelineType) => void;
  onContinue: () => void;
}) {
  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <p className="text-xs font-semibold text-primary uppercase tracking-widest">Étape 3 sur 4</p>
        <h2 className="text-2xl md:text-3xl font-bold text-foreground">Quand voulez-vous passer l'examen ?</h2>
        <p className="text-muted-foreground">Adaptez le rythme à votre calendrier</p>
      </div>

      <div className="space-y-3">
        {TIMELINES.map(t => (
          <button
            key={t.value}
            onClick={() => onSelect(t.value)}
            className={`w-full flex items-center gap-4 rounded-2xl border-2 p-4 text-left transition-all duration-200 hover:-translate-y-0.5 ${
              selected === t.value
                ? 'border-primary bg-primary/5 shadow-[0_4px_16px_hsl(var(--primary)/0.15)]'
                : 'border-border/60 bg-card hover:border-primary/30'
            }`}
          >
            <div className={`flex-shrink-0 h-10 w-10 rounded-xl flex items-center justify-center ${
              selected === t.value ? 'bg-primary text-primary-foreground' : 'bg-primary/10 text-primary'
            }`}>
              {t.icon}
            </div>
            <div className="flex-1">
              <p className="font-semibold text-foreground">{t.label}</p>
              <p className="text-sm text-muted-foreground">{t.description}</p>
            </div>
            {selected === t.value && (
              <div className="flex-shrink-0 h-6 w-6 rounded-full bg-primary flex items-center justify-center">
                <Check className="h-3.5 w-3.5 text-primary-foreground" />
              </div>
            )}
          </button>
        ))}
      </div>

      <Button
        size="lg"
        className="w-full gap-2 h-14 text-base font-semibold"
        disabled={!selected}
        onClick={onContinue}
      >
        Continuer
        <ArrowRight className="h-5 w-5" />
      </Button>
    </div>
  );
}

/* ─── Step 5: Completion ─── */
const GOAL_LABELS_MAP: Record<GoalType, string> = {
  naturalisation: 'Naturalisation française',
  carte_resident: 'Carte de Résident',
  carte_resident_permanent: 'Carte de Résident Permanent',
  ofii: 'Test OFII',
  unknown: 'Parcours général',
};

const LEVEL_LABELS: Record<LevelType, string> = {
  beginner: 'Débutant',
  intermediate: 'Intermédiaire',
  advanced: 'Avancé',
};

function StepComplete({ data, onStart, saving }: {
  data: OnboardingData;
  onStart: () => void;
  saving: boolean;
}) {
  const examLevel = data.goal_type ? GOAL_TO_LEVEL[data.goal_type] : 'CSP';

  return (
    <div className="text-center space-y-8">
      <div className="space-y-4">
        <div className="inline-flex h-24 w-24 items-center justify-center rounded-3xl bg-primary mx-auto shadow-[0_8px_32px_hsl(var(--primary)/0.3)]">
          <PartyPopper className="h-12 w-12 text-primary-foreground" />
        </div>
        <h2 className="text-3xl md:text-4xl font-bold text-foreground leading-tight">
          Votre parcours personnalisé<br />
          <span className="text-primary">est prêt !</span>
        </h2>
        <p className="text-muted-foreground text-lg">
          Voici ce que nous avons préparé pour vous
        </p>
      </div>

      {/* Summary card */}
      <div className="rounded-2xl border border-border/60 bg-card p-6 text-left space-y-4">
        <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">Votre profil</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground text-sm">Objectif</span>
            <span className="font-semibold text-foreground text-sm">
              {data.goal_type ? GOAL_LABELS_MAP[data.goal_type] : '—'}
            </span>
          </div>
          <div className="h-px bg-border/60" />
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground text-sm">Niveau</span>
            <span className="font-semibold text-foreground text-sm">
              {data.level ? LEVEL_LABELS[data.level] : '—'}
            </span>
          </div>
          <div className="h-px bg-border/60" />
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground text-sm">Type d'examen</span>
            <span className="font-semibold text-primary text-sm">{examLevel}</span>
          </div>
        </div>
      </div>

      {/* Features unlocked */}
      <div className="grid grid-cols-2 gap-3">
        {[
          { icon: <Crosshair className="h-5 w-5 text-primary" />, text: 'Questions adaptées à votre objectif' },
          { icon: <BarChart3 className="h-5 w-5 text-primary" />, text: 'Progression personnalisée' },
          { icon: <RotateCcw className="h-5 w-5 text-primary" />, text: 'Révision des points faibles' },
          { icon: <Timer className="h-5 w-5 text-primary" />, text: 'Simulations d\'examen' },
        ].map(item => (
          <div key={item.text} className="flex items-start gap-2 rounded-xl bg-primary/5 border border-primary/15 p-3 text-left">
            <div className="flex-shrink-0 mt-0.5">{item.icon}</div>
            <p className="text-xs text-foreground font-medium leading-tight">{item.text}</p>
          </div>
        ))}
      </div>

      <Button
        size="lg"
        className="w-full gap-2 h-14 text-base font-semibold"
        onClick={onStart}
        disabled={saving}
      >
        {saving ? 'Préparation...' : 'Commencer l\'entraînement'}
        {!saving && <ArrowRight className="h-5 w-5" />}
      </Button>
    </div>
  );
}
