import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Category, CATEGORY_LABELS } from '@/lib/types';
import {
  Scale, Landmark, Shield, ScrollText, Home,
  Vote, Users, ArrowRight,
} from 'lucide-react';

const DOMAIN_META: { key: Category; icon: typeof Scale; desc_key: string }[] = [
  { key: 'Principles', icon: Scale, desc_key: 'cat.Principles.desc' },
  { key: 'Institutions', icon: Landmark, desc_key: 'cat.Institutions.desc' },
  { key: 'Rights', icon: Shield, desc_key: 'cat.Rights.desc' },
  { key: 'History', icon: ScrollText, desc_key: 'cat.History.desc' },
  { key: 'Living', icon: Home, desc_key: 'cat.Living.desc' },
  { key: 'Politics', icon: Vote, desc_key: 'cat.Politics.desc' },
  { key: 'Society', icon: Users, desc_key: 'cat.Society.desc' },
];

interface DomainCardsProps {
  categoryProgress: { category: string; total: number; completed: number }[];
}

export default function DomainCards({ categoryProgress }: DomainCardsProps) {
  const navigate = useNavigate();
  const { language, t } = useLanguage();

  return (
     <section>
       <h2 className="mb-4 text-lg md:text-xl font-bold text-foreground">Study Domains</h2>
       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
         {DOMAIN_META.map(({ key, icon: Icon, desc_key }) => {
           const cp = categoryProgress.find((c) => c.category === key);
           const pct = cp && cp.total > 0 ? Math.round((cp.completed / cp.total) * 100) : 0;
           const label = CATEGORY_LABELS[language]?.[key] || key;

           return (
             <div
               key={key}
               className="group rounded-2xl border border-border/40 bg-white p-4 md:p-5 transition-all hover:border-secondary/30 hover:shadow-[0_8px_24px_hsl(225,48,25,0.08)] hover:-translate-y-0.5"
             >
               <div className="flex items-center gap-3 mb-3">
                 <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[hsl(192,31,58,0.15)] transition-all group-hover:bg-[hsl(192,31,58,0.25)]">
                   <Icon className="h-5 w-5 text-secondary" />
                 </div>
                 <div className="flex-1 min-w-0">
                   <h3 className="font-semibold text-foreground truncate">{label}</h3>
                 </div>
               </div>

               <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
                 {t(desc_key) || ''}
               </p>

               <div className="mb-3">
                 <div className="flex items-center justify-between text-xs mb-1">
                   <span className="text-muted-foreground">Progress</span>
                   <span className="font-semibold text-foreground">{pct}%</span>
                 </div>
                 <Progress value={pct} className="h-2" />
               </div>

               <Button
                 variant="ghost"
                 size="sm"
                 className="w-full gap-1 text-secondary hover:text-secondary hover:bg-[hsl(192,31,58,0.1)]"
                 onClick={() => navigate(`/quiz?mode=study&category=${key}`)}
               >
                 Explore
                 <ArrowRight className="h-3.5 w-3.5" />
               </Button>
             </div>
           );
         })}
       </div>
     </section>
  );
}
