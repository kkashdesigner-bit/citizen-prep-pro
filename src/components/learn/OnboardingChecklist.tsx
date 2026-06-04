import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle2, Circle, BookOpen, Award, 
  TrendingUp, ChevronDown, ChevronUp, Sparkles, 
  Target, GraduationCap, X, RefreshCw
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useUserProfile, GOAL_LABELS } from '@/hooks/useUserProfile';
import type { DashboardStats } from '@/hooks/useDashboardStats';

interface OnboardingChecklistProps {
  stats: DashboardStats;
}

export default function OnboardingChecklist({ stats }: OnboardingChecklistProps) {
  const navigate = useNavigate();
  const { profile } = useUserProfile();
  const [isOpen, setIsOpen] = useState(true);
  const [isDismissed, setIsDismissed] = useState(false);
  
  // Local state for page visits
  const [coursesVisited, setCoursesVisited] = useState(false);
  const [masteryVisited, setMasteryVisited] = useState(false);

  useEffect(() => {
    // Check localStorage for visits
    setCoursesVisited(localStorage.getItem('gocivique_courses_visited') === 'true');
    setMasteryVisited(localStorage.getItem('gocivique_mastery_visited') === 'true');
  }, []);

  // Check state loading
  const hasAnswers = stats.totalXP > 0 || stats.recentActivity.some(a => a.type === 'exam' || (a.type === 'milestone' && a.title.includes('Classe')));
  const hasExams = stats.examHistory.length > 0;
  const hasReadCourses = coursesVisited || stats.recentActivity.some(a => a.type === 'milestone' && a.title.includes('Classe'));
  const hasCheckedMastery = masteryVisited;
  
  // Checklist items definitions
  const steps = [
    {
      id: 'goal',
      label: 'Définir votre objectif',
      description: `Situation actuelle : ${profile?.goal_type ? GOAL_LABELS[profile.goal_type as keyof typeof GOAL_LABELS] : 'Non définie'}`,
      isCompleted: !!profile?.goal_type,
      icon: Target,
      ctaText: 'Modifier',
      action: () => {
        // Open the goal dialog (triggers standard modal on dashboard)
        const btn = document.querySelector('[class*="Goal Badge"]') as HTMLButtonElement;
        if (btn) btn.click();
      }
    },
    {
      id: 'courses',
      label: 'Découvrir le cours officiel',
      description: 'Révisez les fiches de cours rédigées par des experts.',
      isCompleted: hasReadCourses,
      icon: GraduationCap,
      ctaText: 'Lire les fiches',
      action: () => {
        localStorage.setItem('gocivique_courses_visited', 'true');
        setCoursesVisited(true);
        navigate('/courses');
      }
    },
    {
      id: 'quiz',
      label: 'Répondre à un quiz thématique',
      description: 'Entraînez-vous avec des QCM par thématique sur le dashboard.',
      isCompleted: hasAnswers,
      icon: Award,
      ctaText: 'Lancer un quiz',
      action: () => {
        // Scroll to category grid
        const grid = document.querySelector('h3:contains("Entraînement par catégorie")') || document.querySelector('.snap-x');
        if (grid) {
          grid.scrollIntoView({ behavior: 'smooth' });
        } else {
          // Fallback, go to first category
          navigate('/quiz?category=Principles and values of the Republic');
        }
      }
    },
    {
      id: 'exam',
      label: 'Simuler un Examen Blanc d\'évaluation',
      description: 'Testez-vous avec une simulation chronométrée de 40 questions.',
      isCompleted: hasExams,
      icon: BookOpen,
      ctaText: 'Lancer l\'examen',
      action: () => {
        navigate('/exams');
      }
    },
    {
      id: 'mastery',
      label: 'Analyser votre maîtrise',
      description: 'Visualisez vos forces et vos faiblesses par thème pour cibler vos révisions.',
      isCompleted: hasCheckedMastery,
      icon: TrendingUp,
      ctaText: 'Voir ma maîtrise',
      action: () => {
        localStorage.setItem('gocivique_mastery_visited', 'true');
        setMasteryVisited(true);
        navigate('/mastery');
      }
    }
  ];

  const completedCount = steps.filter(s => s.isCompleted).length;
  const progressPercent = Math.round((completedCount / steps.length) * 100);
  const isAllCompleted = completedCount === steps.length;
  const nextActiveStep = steps.find(s => !s.isCompleted) || { label: 'Guide de bienvenue complété !', description: 'Vous êtes maintenant pleinement équipé pour réviser.' };

  // Sync state with localStorage to allow permanent dismissal if desired
  useEffect(() => {
    const dismissed = localStorage.getItem('gocivique_onboarding_dismissed') === 'true';
    if (dismissed) {
      setIsDismissed(true);
    }
  }, []);

  const handleDismiss = () => {
    localStorage.setItem('gocivique_onboarding_dismissed', 'true');
    setIsDismissed(true);
  };

  const handleReset = () => {
    localStorage.removeItem('gocivique_onboarding_dismissed');
    localStorage.removeItem('gocivique_courses_visited');
    localStorage.removeItem('gocivique_mastery_visited');
    setCoursesVisited(false);
    setMasteryVisited(false);
    setIsDismissed(false);
    setIsOpen(true);
  };

  if (isDismissed) {
    // Show a mini float or button to restore guide if they want to
    return (
      <div className="flex justify-end mb-4">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={handleReset}
          className="text-xs text-[var(--dash-text-muted)] hover:text-[#0055A4] flex items-center gap-1.5 py-1 h-auto"
        >
          <RefreshCw className="h-3 w-3" />
          Réactiver le guide de démarrage
        </Button>
      </div>
    );
  }

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="mb-6 bg-gradient-to-br from-[var(--dash-card)] via-[var(--dash-card)] to-blue-500/5 rounded-2xl border border-[var(--dash-card-border)] p-5 shadow-[0_4px_20px_rgba(0,85,164,0.04)] relative overflow-hidden"
    >
      {/* Liquid glass effect background */}
      <div className="absolute -top-12 -left-12 w-40 h-40 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-12 -right-12 w-40 h-40 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header section */}
      <div className="flex items-center justify-between gap-4 pb-3 border-b border-[var(--dash-card-border)] mb-4">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-[#0055A4]/10 flex items-center justify-center">
            <Sparkles className="h-4 w-4 text-[#0055A4]" />
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-[var(--dash-text)] tracking-tight">
              Guide de démarrage GoCivique
            </h3>
            <p className="text-[11px] text-[var(--dash-text-muted)] mt-0.5">
              Explorez toutes les facettes de l'application pour maximiser vos chances de réussite
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="h-7 w-7 rounded-lg bg-[var(--dash-surface)] hover:bg-[var(--dash-card-border)] flex items-center justify-center text-[var(--dash-text-muted)] transition-colors"
          >
            {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>
          <button 
            onClick={handleDismiss}
            title="Masquer définitivement"
            className="h-7 w-7 rounded-lg bg-[var(--dash-surface)] hover:bg-red-500/10 hover:text-red-600 flex items-center justify-center text-[var(--dash-text-muted)] transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Circular Progress & Step Detail (Option 8 style) */}
      <div className="flex items-center gap-5 bg-[#0055A4]/5 border border-[#0055A4]/10 rounded-2xl p-4 mb-4">
        {/* Circular Progress Circle */}
        <div className="relative flex items-center justify-center shrink-0 w-[72px] h-[72px]">
          <svg className="w-full h-full transform -rotate-90">
            {/* Background track circle */}
            <circle
              cx="36"
              cy="36"
              r="30"
              className="stroke-slate-200 dark:stroke-slate-700"
              strokeWidth="6"
              fill="transparent"
            />
            {/* Foreground progress circle */}
            <motion.circle
              cx="36"
              cy="36"
              r="30"
              className="stroke-[#0055A4] dark:stroke-blue-500"
              strokeWidth="6"
              fill="transparent"
              strokeDasharray={2 * Math.PI * 30}
              initial={{ strokeDashoffset: 2 * Math.PI * 30 }}
              animate={{ strokeDashoffset: 2 * Math.PI * 30 - (progressPercent / 100) * (2 * Math.PI * 30) }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              strokeLinecap="round"
            />
          </svg>
          {/* Centered text */}
          <div className="absolute flex flex-col items-center justify-center text-center">
            <span className="text-sm font-black text-[var(--dash-text)] leading-none">{completedCount} sur {steps.length}</span>
            <span className="text-[8px] font-bold text-[var(--dash-text-muted)] uppercase tracking-wider mt-0.5">étapes</span>
          </div>
        </div>

        {/* Next step detail description */}
        <div className="flex-1 min-w-0">
          <span className="text-[10px] font-bold text-[#0055A4] dark:text-blue-400 uppercase tracking-widest">
            {isAllCompleted ? "Terminé !" : `Étape active : ${nextActiveStep.label}`}
          </span>
          <h4 className="text-xs font-bold text-[var(--dash-text)] mt-1 truncate">
            {isAllCompleted ? "Félicitations !" : nextActiveStep.description}
          </h4>
          <p className="text-[10px] text-[var(--dash-text-muted)] mt-0.5">
            {isAllCompleted ? "Vous avez complété l'ensemble du guide." : "Cliquez sur l'action correspondante ci-dessous pour continuer."}
          </p>
        </div>
      </div>

      {/* Checklist items list */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="space-y-2.5 overflow-hidden"
          >
            {steps.map((step) => {
              const StepIcon = step.icon;
              return (
                <div 
                  key={step.id} 
                  className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-xl border transition-all ${
                    step.isCompleted 
                      ? 'bg-emerald-500/[0.02] border-emerald-500/10' 
                      : 'bg-[var(--dash-card)] border-[var(--dash-card-border)] hover:border-[#0055A4]/30'
                  }`}
                >
                  <div className="flex gap-3 items-start">
                    <button 
                      disabled 
                      className={`mt-0.5 shrink-0 transition-colors ${
                        step.isCompleted ? 'text-emerald-500' : 'text-slate-300'
                      }`}
                    >
                      {step.isCompleted ? (
                        <CheckCircle2 className="h-5 w-5 fill-emerald-500/10" />
                      ) : (
                        <Circle className="h-5 w-5" />
                      )}
                    </button>
                    <div className="space-y-0.5 text-left">
                      <div className="flex items-center gap-1.5">
                        <StepIcon className={`h-3.5 w-3.5 ${step.isCompleted ? 'text-emerald-500' : 'text-[#0055A4]'}`} />
                        <span className={`text-xs font-bold leading-none ${step.isCompleted ? 'text-slate-500 line-through' : 'text-[var(--dash-text)]'}`}>
                          {step.label}
                        </span>
                      </div>
                      <p className="text-[11px] text-[var(--dash-text-muted)]">
                        {step.description}
                      </p>
                    </div>
                  </div>
                  {!step.isCompleted && (
                    <Button 
                      size="sm"
                      onClick={step.action}
                      className="bg-[#0055A4] hover:bg-[#1B6ED6] text-white font-bold h-8 rounded-lg text-xs shrink-0 self-end sm:self-center"
                    >
                      {step.ctaText}
                    </Button>
                  )}
                </div>
              );
            })}
            
            {isAllCompleted && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-emerald-500/10 text-emerald-800 border border-emerald-500/20 rounded-xl p-3 text-xs text-center font-bold"
              >
                🎉 Félicitations ! Vous avez exploré toutes les sections clés de GoCivique. Vous êtes maintenant prêt à exceller lors de votre examen. Bonnes révisions !
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
