import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Play, RotateCcw, AlertTriangle, ArrowRight, 
  HelpCircle, Compass, CheckSquare, Sparkles, BookOpen
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useParcours } from '@/hooks/useParcours';
import type { DashboardStats } from '@/hooks/useDashboardStats';

interface NextActionCardProps {
  stats: DashboardStats;
}

export default function NextActionCard({ stats }: NextActionCardProps) {
  const navigate = useNavigate();
  const { classes: parcoursClasses, progress: parcoursProgress } = useParcours();

  // Find next class in the learning path
  const nextClass = parcoursClasses.find(c => parcoursProgress[c.id]?.status !== 'completed');

  // Determine the next best action
  let title = '';
  let description = '';
  let badgeText = '';
  let ctaText = '';
  let icon = Compass;
  let actionFn = () => {};
  let cardColorClass = 'from-blue-500/10 to-indigo-500/5 border-blue-500/20';
  let badgeColorClass = 'bg-blue-100 text-[#0055A4]';
  let ctaColorClass = 'bg-[#0055A4] hover:bg-[#1B6ED6] text-white';

  // 1. Fresh User Rule
  if (stats.totalXP === 0) {
    title = "Commencer votre entraînement";
    description = "Découvrez les bases de l'examen civique 2026 en répondant à vos premières questions d'entraînement.";
    badgeText = "Évaluation";
    ctaText = "Lancer un Quiz rapide";
    icon = Play;
    actionFn = () => navigate('/quiz?category=Principles and values of the Republic');
  }
  // 2. Drill Errors Rule
  else if (stats.wrongQuestionsCount > 0) {
    title = "Révisez vos erreurs";
    description = `Vous avez ${stats.wrongQuestionsCount} questions à corriger. C'est le moyen le plus efficace d'élever votre score de réussite.`;
    badgeText = "Correction ciblée";
    ctaText = "Rallier mes erreurs";
    icon = AlertTriangle;
    actionFn = () => navigate('/quiz?mode=revision');
    cardColorClass = 'from-red-500/10 to-orange-500/5 border-red-500/20 dark:border-red-500/30';
    badgeColorClass = 'bg-red-100 text-red-700';
    ctaColorClass = 'bg-[#EF4135] hover:bg-red-600 text-white';
  }
  // 3. Failed Recent Exam Rule
  else if (stats.examHistory.length > 0 && !stats.examHistory[0].passed) {
    title = "Prenez votre revanche sur l'Examen Blanc";
    description = "Votre dernier examen blanc n'a pas atteint le seuil requis de 80%. Retentez l'examen pour valider vos révisions.";
    badgeText = "Revanche";
    ctaText = "Retenter l'examen";
    icon = RotateCcw;
    actionFn = () => navigate('/exams');
    cardColorClass = 'from-amber-500/10 to-yellow-500/5 border-amber-500/20';
    badgeColorClass = 'bg-amber-100 text-amber-700';
    ctaColorClass = 'bg-amber-600 hover:bg-amber-700 text-white';
  }
  // 4. Weak Category Rule
  else if (stats.weaknessAlerts.length > 0) {
    const mainWeakness = stats.weaknessAlerts[0];
    title = `Renforcer : ${mainWeakness.domain}`;
    description = `Votre score est en dessous de 70% sur la thématique '${mainWeakness.domain}'. Comblez cette faiblesse avant l'examen officiel.`;
    badgeText = "Point faible détecté";
    ctaText = "Travailler ce thème";
    icon = BookOpen;
    actionFn = () => navigate(`/quiz?category=${encodeURIComponent(mainWeakness.category)}`);
    cardColorClass = 'from-indigo-500/10 to-violet-500/5 border-indigo-500/20';
    badgeColorClass = 'bg-indigo-100 text-indigo-700';
    ctaColorClass = 'bg-indigo-600 hover:bg-indigo-700 text-white';
  }
  // 5. Lesson Progress Rule
  else if (nextClass) {
    title = `Classe suivante — ${nextClass.title}`;
    description = `Continuez votre progression guidée pas-à-pas. Leçon ${nextClass.class_number} sur ${parcoursClasses.length} disponible.`;
    badgeText = "Parcours 1→100";
    ctaText = "Lancer la leçon";
    icon = Play;
    actionFn = () => navigate(`/parcours/classe/${nextClass.id}`);
    cardColorClass = 'from-emerald-500/10 to-teal-500/5 border-emerald-500/20';
    badgeColorClass = 'bg-emerald-100 text-emerald-700';
    ctaColorClass = 'bg-emerald-600 hover:bg-emerald-700 text-white';
  }
  // 6. High Performer Fallback Rule
  else {
    title = "Faire une simulation d'Examen Blanc";
    description = "Vos scores thématiques sont excellents. Testez votre préparation dans les conditions réelles de l'épreuve officielle.";
    badgeText = "Prêt pour l'examen";
    ctaText = "Lancer l'Examen Blanc";
    icon = CheckSquare;
    actionFn = () => navigate('/quiz?mode=exam&limit=40');
  }

  const ActionIcon = icon;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`bg-gradient-to-br ${cardColorClass} rounded-2xl border-2 p-5 shadow-[0_4px_24px_rgba(0,0,0,0.02)] relative overflow-hidden mb-6`}
    >
      {/* Visual background lights */}
      <div className="absolute top-0 right-0 w-36 h-36 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 relative z-10">
        <div className="space-y-2 text-left">
          <div className="flex flex-wrap items-center gap-2">
            <span className={`text-[9px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider ${badgeColorClass}`}>
              {badgeText}
            </span>
            <span className="text-[10px] font-bold text-[var(--dash-text-muted)] flex items-center gap-1">
              <Sparkles className="h-3 w-3 text-amber-500" /> Plan d'action personnalisé
            </span>
          </div>
          <h3 className="text-base sm:text-lg font-extrabold text-[var(--dash-text)] tracking-tight">
            {title}
          </h3>
          <p className="text-xs sm:text-sm text-[var(--dash-text-muted)] max-w-2xl leading-relaxed">
            {description}
          </p>
        </div>

        <Button
          onClick={actionFn}
          className={`${ctaColorClass} font-bold rounded-xl h-11 px-6 shadow-md hover:-translate-y-0.5 transition-all flex items-center gap-2 shrink-0 self-stretch sm:self-center justify-center`}
        >
          <ActionIcon className="h-4 w-4" />
          <span>{ctaText}</span>
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </motion.div>
  );
}
