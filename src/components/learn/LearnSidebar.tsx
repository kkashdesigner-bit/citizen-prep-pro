import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import Logo from '@/components/Logo';
import {
  LayoutDashboard, Dumbbell, BookOpen, BarChart3,
  Users, UserCircle, Settings,
} from 'lucide-react';

const NAV_ITEMS = [
  { key: 'dashboard', icon: LayoutDashboard, path: '/learn', label: 'Tableau de bord' },
  { key: 'exams', icon: Dumbbell, path: '/exams', label: 'Examens' },
  { key: 'modules', icon: BookOpen, path: '/study-material', label: "Matériel d'étude" },
  { key: 'progress', icon: BarChart3, path: '/progress', label: 'Progression' },
  { key: 'analytics', icon: Users, path: '/analytics', label: 'Analyses' },
  { key: 'profile', icon: UserCircle, path: '/dashboard', label: 'Profil' },
  { key: 'settings', icon: Settings, path: '/dashboard', label: 'Paramètres' },
];

export default function LearnSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useLanguage();

  const isActive = (item: typeof NAV_ITEMS[0]) => {
    if (item.path === '/learn' && item.key === 'dashboard') {
      return location.pathname === '/learn' && !location.search;
    }
    return location.pathname === item.path;
  };

  return (
    <>
       {/* Desktop sidebar */}
       <aside className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 z-50 border-r border-border/30 bg-white">
          <div className="flex h-16 items-center gap-2 px-6 border-b border-border/30">
            <Link to="/">
              <Logo size="sm" />
            </Link>
          </div>

         <nav className="flex-1 space-y-1 px-3 py-4 overflow-y-auto">
           {NAV_ITEMS.map((item) => {
             const Icon = item.icon;
             const active = isActive(item);
             return (
                <button
                  key={item.key}
                  onClick={() => navigate(item.path)}
                  className={`group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
                    active
                      ? 'bg-[hsl(168,35%,95%)] text-primary'
                      : 'text-muted-foreground hover:bg-[hsl(220,50%,96%)] hover:text-foreground'
                  }`}
                >
                  <Icon className={`h-5 w-5 transition-colors ${active ? 'text-primary' : ''}`} />
                  <span>{item.label}</span>
                  {active && (
                    <span className="ml-auto h-2 w-2 rounded-full bg-secondary" />
                  )}
                </button>
             );
           })}
         </nav>
       </aside>

       {/* Mobile bottom navigation */}
       <nav className="fixed bottom-0 inset-x-0 z-50 md:hidden border-t border-border/30 bg-white safe-area-bottom">
         <div className="flex items-center justify-around px-2 py-2">
           {NAV_ITEMS.slice(0, 5).map((item) => {
             const Icon = item.icon;
             const active = isActive(item);
             return (
                <button
                  key={item.key}
                  onClick={() => navigate(item.path)}
                  className={`flex flex-col items-center gap-0.5 rounded-lg px-3 py-1.5 text-[10px] font-medium transition-all ${
                    active
                      ? 'text-primary bg-[hsl(168,35%,95%)]'
                      : 'text-muted-foreground'
                  }`}
                >
                  <Icon className={`h-5 w-5 ${active ? 'text-primary' : ''}`} />
                  <span>{item.label}</span>
                </button>
             );
           })}
         </div>
       </nav>
    </>
  );
}
