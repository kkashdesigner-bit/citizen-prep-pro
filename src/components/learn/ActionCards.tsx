import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { Play, ArrowRight, Zap, BookOpen } from 'lucide-react';

interface ActionCardsProps {
  nextLesson?: { id: string; title: string; category: string; estimated_minutes: number } | null;
  isStandardOrAbove: boolean;
  onGate: (tier: 'standard' | 'premium') => void;
}

export default function ActionCards({ nextLesson, isStandardOrAbove, onGate }: ActionCardsProps) {
  const navigate = useNavigate();
  const { t } = useLanguage();

  return (
     <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
       {/* Resume Learning */}
       <div className="relative overflow-hidden rounded-2xl border border-border/40 bg-[hsl(225,48,25)] p-5 md:p-6 transition-all hover:shadow-[0_8px_24px_hsl(225,48,25,0.12)]">
         <div className="flex items-center gap-2 mb-3">
           <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10">
             <BookOpen className="h-4 w-4 text-white" />
           </div>
           <h3 className="font-semibold text-white">{t('learn.continueLearning')}</h3>
         </div>

         {nextLesson ? (
           <>
             <div className="rounded-lg bg-white/10 border border-white/20 p-3 mb-4">
               <p className="text-xs text-white/70 mb-1">{nextLesson.category} · {nextLesson.estimated_minutes} min</p>
               <p className="text-sm font-medium text-white">{nextLesson.title}</p>
             </div>
             <Button
               className="w-full gap-2 bg-white text-primary hover:bg-white/95"
               onClick={() => {
                 if (!isStandardOrAbove) { onGate('standard'); return; }
                 navigate(`/lesson/${nextLesson.id}`);
               }}
             >
               <Play className="h-4 w-4" />
               Continue
               <ArrowRight className="h-4 w-4" />
             </Button>
           </>
         ) : (
           <div className="text-center py-4">
             <p className="text-sm text-white/70">Start your first module</p>
             <Button className="mt-3 gap-2 bg-white text-primary hover:bg-white/95" onClick={() => navigate('/learn?tab=modules')}>
               <BookOpen className="h-4 w-4" />
               Browse Modules
             </Button>
           </div>
         )}
       </div>

       {/* Quick Practice */}
       <div className="relative overflow-hidden rounded-2xl border border-border/40 bg-white p-5 md:p-6 transition-all hover:shadow-[0_8px_24px_hsl(225,48,25,0.08)]">
         <div className="flex items-center gap-2 mb-3">
           <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[hsl(192,31,58,0.15)]">
             <Zap className="h-4 w-4 text-secondary" />
           </div>
           <h3 className="font-semibold text-foreground">Quick Practice</h3>
         </div>
         <p className="text-sm text-muted-foreground mb-4">
           Test yourself with 10 random questions from all domains.
         </p>
         <Button
           className="w-full gap-2"
           onClick={() => navigate('/quiz?mode=study')}
         >
           <Zap className="h-4 w-4" />
           Start Now
         </Button>
       </div>
     </div>
  );
}
