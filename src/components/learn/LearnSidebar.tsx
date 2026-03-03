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
import { motion } from 'framer-motion';

const NAV_ITEMS = [
  { key: 'dashboard', icon: LayoutDashboard, path: '/learn', label: 'Tableau de bord' },
  { key: 'exams', icon: FileText, path: '/exams', label: 'Examens' },
  { key: 'path', icon: Route, path: '/parcours', label: 'Parcours 1→100' },
  { key: 'progress', icon: BarChart3, path: '/progress', label: 'Progression' },
  { key: 'settings', icon: Settings, path: '/dashboard', label: 'Paramètres' },
  { key: 'help', icon: HelpCircle, path: '/about', label: 'Aide' },
];

const MOBILE_NAV = [
  { key: 'dashboard', icon: LayoutDashboard, path: '/learn', label: 'Accueil' },
  { key: 'exams', icon: FileText, path: '/exams', label: 'Examens' },
  { key: 'path', icon: Route, path: '/parcours', label: 'Parcours' },
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

  const displayName = profile?.first_name || user?.email?.split('@')[0] || 'Étudiant';

  // French tier labels
  const tierLabels = {
    free: 'Gratuit',
    standard: 'Standard',
    premium: 'Premium',
  };

  // Mock progress percentage (could be fetched later)
  const progressPercent = 35;

  return (
    <>
      {/* Desktop sidebar */}
      <motion.aside
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
        className="hidden md:flex md:w-[260px] md:flex-col md:fixed md:inset-y-0 z-50 bg-white border-r border-[#E6EAF0]"
      >
        <div className="flex h-16 items-center px-6 border-b border-[#E6EAF0]">
          <Link to="/" className="flex items-center gap-2">
            <Logo size="sm" />
          </Link>
        </div>

        <motion.nav
          initial="hidden" animate="visible" variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.05, delayChildren: 0.1 } } }}
          className="flex-1 space-y-1.5 px-4 py-6 overflow-y-auto"
        >
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const active = isActive(item);
            return (
              <motion.button
                variants={{ hidden: { x: -20, opacity: 0 }, visible: { x: 0, opacity: 1 } }}
                key={item.key}
                onClick={() => navigate(item.path)}
                className={`group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${active
                  ? 'bg-[#F5F7FA] text-[#0055A4] font-semibold shadow-sm'
                  : 'text-[#1A1A1A]/70 hover:bg-[#F5F7FA] hover:text-[#1A1A1A]'
                  }`}
              >
                <Icon className={`h-5 w-5 transition-colors ${active ? 'text-[#0055A4]' : 'text-[#1A1A1A]/50 group-hover:text-[#1A1A1A]/70'}`} />
                <span>{item.label}</span>
              </motion.button>
            );
          })}
        </motion.nav>

        {/* Bottom User Snippet */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
          className="p-4 border-t border-[#E6EAF0]"
        >
          <div className="bg-[#F5F7FA] rounded-2xl p-4 flex flex-col gap-3 border border-[#E6EAF0]/50 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-white text-[#0055A4] shadow-sm border border-[#E6EAF0] flex items-center justify-center font-bold text-lg">
                {displayName.charAt(0).toUpperCase()}
              </div>
              <div className="flex flex-col text-left">
                <span className="text-sm font-bold text-[#1A1A1A] truncate max-w-[120px]">{displayName}</span>
                <span className="text-xs font-semibold text-[#EF4135] uppercase tracking-wider">{tierLabels[tier] || 'Gratuit'}</span>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-[11px] font-medium text-[#1A1A1A]/70 mb-1.5 uppercase tracking-wide">
                <span>Progression totale</span>
                <span className="text-[#0055A4] font-bold">{progressPercent}%</span>
              </div>
              <div className="h-2 w-full bg-[#E6EAF0] rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercent}%` }}
                  transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
                  className="h-full bg-gradient-to-r from-[#0055A4] to-[#1B6ED6] rounded-full relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-white/20 w-full h-full" style={{ animation: 'shimmer 2s infinite linear' }} />
                </motion.div>
              </div>
            </div>

            <button
              onClick={async () => {
                await supabase.auth.signOut();
                navigate('/');
              }}
              className="mt-2 flex items-center justify-center gap-2 w-full py-1.5 rounded-lg text-xs font-bold text-[#1A1A1A]/50 hover:text-white hover:bg-[#EF4135] transition-all"
            >
              <LogOut className="h-3.5 w-3.5" />
              Déconnexion
            </button>
          </div>
        </motion.div>
      </motion.aside>

      {/* Mobile bottom navigation */}
      <motion.nav
        initial={{ y: 100 }} animate={{ y: 0 }} transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="fixed bottom-0 inset-x-0 z-50 md:hidden border-t border-[#E6EAF0] bg-white safe-area-bottom shadow-[0_-4px_24px_rgba(0,0,0,0.06)]"
      >
        <div className="flex items-center justify-around px-2 py-2">
          {MOBILE_NAV.map((item) => {
            const Icon = item.icon;
            const active = isActive(item);
            return (
              <button
                key={item.key}
                onClick={() => navigate(item.path)}
                className={`relative flex flex-col items-center gap-1.5 rounded-xl px-4 py-2 text-[10px] font-bold transition-all ${active
                  ? 'text-[#0055A4]'
                  : 'text-[#1A1A1A]/50 hover:text-[#1A1A1A]/70 hover:bg-[#F5F7FA]'
                  }`}
              >
                {active && (
                  <motion.div layoutId="mobileNavActive" className="absolute inset-0 bg-[#0055A4]/10 rounded-xl" />
                )}
                <Icon className={`h-5 w-5 relative z-10 transition-transform ${active ? 'scale-110 mb-0.5' : ''}`} />
                <span className="relative z-10">{item.label}</span>
              </button>
            );
          })}
        </div>
      </motion.nav>
    </>
  );
}
