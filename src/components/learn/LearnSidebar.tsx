import { useLocation, useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import Logo from '@/components/Logo';
import {
  LayoutDashboard, Dumbbell, BookOpen, BarChart3,
  Users, UserCircle, Settings,
} from 'lucide-react';

const NAV_ITEMS = [
  { key: 'dashboard', icon: LayoutDashboard, path: '/learn', label: 'Dashboard' },
  { key: 'practice', icon: Dumbbell, path: '/learn?tab=practice', label: 'Practice' },
  { key: 'modules', icon: BookOpen, path: '/learn?tab=modules', label: 'Modules' },
  { key: 'progress', icon: BarChart3, path: '/learn?tab=progress', label: 'Progress' },
  { key: 'community', icon: Users, path: '#', label: 'Community', disabled: true },
  { key: 'profile', icon: UserCircle, path: '/dashboard', label: 'Profile' },
  { key: 'settings', icon: Settings, path: '/dashboard', label: 'Settings' },
];

export default function LearnSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useLanguage();

  const isActive = (item: typeof NAV_ITEMS[0]) => {
    if (item.path === '/learn' && item.key === 'dashboard') {
      return location.pathname === '/learn' && !location.search;
    }
    return location.pathname + location.search === item.path;
  };

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 z-50 border-r border-border/50 bg-card/80 backdrop-blur-xl">
        <div className="flex h-16 items-center gap-2 px-6 border-b border-border/50">
          <Logo size="sm" />
        </div>

        <nav className="flex-1 space-y-1 px-3 py-4 overflow-y-auto">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const active = isActive(item);
            return (
              <button
                key={item.key}
                onClick={() => !item.disabled && navigate(item.path)}
                disabled={item.disabled}
                className={`group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
                  active
                    ? 'bg-primary/15 text-primary shadow-[inset_0_0_20px_hsl(var(--primary)/0.1)]'
                    : item.disabled
                    ? 'text-muted-foreground/40 cursor-not-allowed'
                    : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                }`}
              >
                <Icon className={`h-5 w-5 transition-colors ${active ? 'text-primary' : ''}`} />
                <span>{item.label}</span>
                {item.disabled && (
                  <span className="ml-auto text-[10px] uppercase tracking-wider text-muted-foreground/50">Soon</span>
                )}
                {active && (
                  <span className="ml-auto h-2 w-2 rounded-full bg-primary shadow-[0_0_8px_hsl(var(--primary)/0.6)]" />
                )}
              </button>
            );
          })}
        </nav>
      </aside>

      {/* Mobile bottom navigation */}
      <nav className="fixed bottom-0 inset-x-0 z-50 md:hidden border-t border-border/50 bg-card/95 backdrop-blur-xl safe-area-bottom">
        <div className="flex items-center justify-around px-2 py-2">
          {NAV_ITEMS.slice(0, 5).map((item) => {
            const Icon = item.icon;
            const active = isActive(item);
            return (
              <button
                key={item.key}
                onClick={() => !item.disabled && navigate(item.path)}
                disabled={item.disabled}
                className={`flex flex-col items-center gap-0.5 rounded-lg px-3 py-1.5 text-[10px] font-medium transition-all ${
                  active
                    ? 'text-primary'
                    : item.disabled
                    ? 'text-muted-foreground/30'
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
