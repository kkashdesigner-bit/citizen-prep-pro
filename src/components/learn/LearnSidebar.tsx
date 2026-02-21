import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useUserProfile } from '@/hooks/useUserProfile';
import { useSubscription } from '@/hooks/useSubscription';
import Logo from '@/components/Logo';
import {
  LayoutDashboard, FileText, Route, BookOpen, BarChart3,
  Settings, HelpCircle, UserCircle, LogOut
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const NAV_ITEMS = [
  { key: 'dashboard', icon: LayoutDashboard, path: '/learn', label: 'Tableau de bord' },
  { key: 'exams', icon: FileText, path: '/exams', label: 'Examens' },
  { key: 'path', icon: Route, path: '/path', label: 'Parcours personnalisé' },
  { key: 'modules', icon: BookOpen, path: '/study-material', label: "Matériel d'étude" },
  { key: 'progress', icon: BarChart3, path: '/progress', label: 'Progression' },
  { key: 'settings', icon: Settings, path: '/dashboard', label: 'Paramètres' },
  { key: 'help', icon: HelpCircle, path: '/about', label: 'Help' },
];

const MOBILE_NAV = [
  { key: 'dashboard', icon: LayoutDashboard, path: '/learn', label: 'Accueil' },
  { key: 'exams', icon: FileText, path: '/exams', label: 'Examens' },
  { key: 'progress', icon: BarChart3, path: '/progress', label: 'Progression' },
  { key: 'profile', icon: UserCircle, path: '/dashboard', label: 'Profil' },
];

export default function LearnSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { profile } = useUserProfile();
  const { tier } = useSubscription();

  const isActive = (item: { path: string, key: string }) => {
    if (item.path === '/learn' && item.key === 'dashboard') {
      return location.pathname === '/learn' && !location.search;
    }
    return location.pathname === item.path;
  };

  const displayName = profile?.display_name || user?.email?.split('@')[0] || 'Étudiant';

  // French tier labels
  const tierLabels = {
    free: 'Liberté',
    standard: 'Égalité',
    premium: 'Fraternité',
  };

  // Mock progress percentage (could be fetched later)
  const progressPercent = 35;

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex md:w-[260px] md:flex-col md:fixed md:inset-y-0 z-50 bg-white border-r border-[#E6EAF0]">
        <div className="flex h-16 items-center px-6 border-b border-[#E6EAF0]">
          <Link to="/" className="flex items-center gap-2">
            <Logo size="sm" />
          </Link>
        </div>

        <nav className="flex-1 space-y-1.5 px-4 py-6 overflow-y-auto">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const active = isActive(item);
            return (
              <button
                key={item.key}
                onClick={() => navigate(item.path)}
                className={`group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${active
                  ? 'bg-[#F5F7FA] text-[#0055A4] font-semibold'
                  : 'text-[#1A1A1A]/70 hover:bg-[#F5F7FA] hover:text-[#1A1A1A]'
                  }`}
              >
                <Icon className={`h-5 w-5 transition-colors ${active ? 'text-[#0055A4]' : 'text-[#1A1A1A]/50'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Bottom User Snippet */}
        <div className="p-4 border-t border-[#E6EAF0]">
          <div className="bg-[#F5F7FA] rounded-2xl p-4 flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-[#0055A4]/10 text-[#0055A4] flex items-center justify-center font-bold text-lg">
                {displayName.charAt(0).toUpperCase()}
              </div>
              <div className="flex flex-col text-left">
                <span className="text-sm font-bold text-[#1A1A1A] truncate max-w-[120px]">{displayName}</span>
                <span className="text-xs font-semibold text-[#EF4135] uppercase tracking-wider">{tierLabels[tier] || 'Liberté'}</span>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-[11px] font-medium text-[#1A1A1A]/70 mb-1.5 uppercase tracking-wide">
                <span>Progression vers réussite</span>
                <span>{progressPercent}%</span>
              </div>
              <div className="h-2 w-full bg-[#E6EAF0] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#22C55E] rounded-full"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            <button
              onClick={async () => {
                await supabase.auth.signOut();
                navigate('/');
              }}
              className="mt-2 flex items-center justify-center gap-2 w-full py-1.5 text-xs font-semibold text-[#1A1A1A]/60 hover:text-[#1A1A1A] transition-colors"
            >
              <LogOut className="h-3.5 w-3.5" />
              Déconnexion
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile bottom navigation */}
      <nav className="fixed bottom-0 inset-x-0 z-50 md:hidden border-t border-[#E6EAF0] bg-white safe-area-bottom shadow-[0_-4px_24px_rgba(0,0,0,0.04)]">
        <div className="flex items-center justify-around px-2 py-2">
          {MOBILE_NAV.map((item) => {
            const Icon = item.icon;
            const active = isActive(item);
            return (
              <button
                key={item.key}
                onClick={() => navigate(item.path)}
                className={`flex flex-col items-center gap-1 rounded-lg px-3 py-1.5 text-[10px] font-medium transition-all ${active
                  ? 'text-[#0055A4]'
                  : 'text-[#1A1A1A]/50'
                  }`}
              >
                <Icon className={`h-5 w-5 ${active ? 'text-[#0055A4]' : ''}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
}
