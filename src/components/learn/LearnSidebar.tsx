import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useUserProfile } from '@/hooks/useUserProfile';
import { useSubscription } from '@/hooks/useSubscription';
import { useDashboardStats } from '@/hooks/useDashboardStats';
import Logo from '@/components/Logo';
import {
  LayoutDashboard, FileText, Route,
  Settings, HelpCircle, UserCircle, LogOut
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { motion } from 'framer-motion';


const NAV_ITEMS = [
  { key: 'dashboard', icon: LayoutDashboard, path: '/learn', label: 'Tableau de bord' },
  { key: 'exams', icon: FileText, path: '/exams', label: 'Examens' },
  { key: 'path', icon: Route, path: '/parcours', label: 'Parcours 1→100' },
  { key: 'settings', icon: Settings, path: '/settings', label: 'Paramètres' },
  { key: 'help', icon: HelpCircle, path: '/about', label: 'Aide' },
];

const MOBILE_NAV = [
  { key: 'dashboard', icon: LayoutDashboard, path: '/learn', label: 'Accueil' },
  { key: 'exams', icon: FileText, path: '/exams', label: 'Examens' },
  { key: 'path', icon: Route, path: '/parcours', label: 'Parcours' },
  { key: 'profile', icon: UserCircle, path: '/settings', label: 'Profil' },
];

export default function LearnSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { profile } = useUserProfile();
  const { tier } = useSubscription();

  const isActive = (item: { path: string; key: string }) => {
    if (item.path === '/learn' && item.key === 'dashboard') {
      return location.pathname === '/learn' && !location.search;
    }
    return location.pathname === item.path;
  };

  const { domainMastery, successRate } = useDashboardStats();

  const displayName = profile?.first_name || user?.email?.split('@')[0] || 'Étudiant';
  const tierLabels: Record<string, string> = { free: 'Gratuit', standard: 'Standard', premium: 'Premium' };

  // Combined progression: average of category mastery (weighted 70%) + exam pass rate (30%)
  const activeDomains = domainMastery.filter(d => d.total > 0);
  const avgMastery = activeDomains.length > 0
    ? Math.round(activeDomains.reduce((sum, d) => sum + d.percent, 0) / activeDomains.length)
    : 0;
  const progressPercent = activeDomains.length > 0
    ? Math.round(avgMastery * 0.7 + successRate * 0.3)
    : 0;

  return (
    <>
      {/* Desktop sidebar */}
      <motion.aside
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
        className="hidden md:flex md:w-[260px] md:flex-col md:fixed md:inset-y-0 z-50 bg-[var(--dash-card)] border-r border-[var(--dash-card-border)]"
      >
        {/* Logo */}
        <div className="flex h-16 items-center justify-between px-5 border-b border-[var(--dash-card-border)]">
          <Link to="/" className="flex items-center gap-2">
            <Logo size="sm" />
          </Link>

        </div>

        {/* Nav */}
        <motion.nav
          initial="hidden" animate="visible"
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.04, delayChildren: 0.1 } } }}
          className="flex-1 space-y-1 px-3 py-5 overflow-y-auto"
        >
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const active = isActive(item);
            return (
              <motion.button
                variants={{ hidden: { x: -16, opacity: 0 }, visible: { x: 0, opacity: 1 } }}
                key={item.key}
                onClick={() => navigate(item.path)}
                className={`group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all relative ${active
                  ? 'bg-blue-500/10 text-[#0055A4] font-semibold'
                  : 'text-[var(--dash-text-muted)] hover:bg-[var(--dash-surface)] hover:text-[var(--dash-text)]'
                  }`}
              >
                {active && (
                  <motion.div
                    layoutId="sidebarActive"
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-[#0055A4] rounded-r-full"
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                  />
                )}
                <Icon className={`h-5 w-5 transition-colors ${active ? 'text-[#0055A4]' : 'text-[var(--dash-text-muted)] group-hover:text-[var(--dash-text)]'}`} />
                <span>{item.label}</span>
              </motion.button>
            );
          })}
        </motion.nav>

        {/* User snippet */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
          className="p-3 border-t border-[var(--dash-card-border)]"
        >
          <div className="bg-[var(--dash-surface)] rounded-2xl p-4 flex flex-col gap-3 border border-[var(--dash-card-border)] shadow-sm">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-full bg-[#0055A4] text-white flex items-center justify-center font-bold text-sm">
                {displayName.charAt(0).toUpperCase()}
              </div>
              <div className="flex flex-col text-left">
                <span className="text-sm font-bold text-[var(--dash-text)] truncate max-w-[120px]">{displayName}</span>
                <span className="text-[10px] font-semibold text-[#EF4135] uppercase tracking-wider">{tierLabels[tier] || 'Gratuit'}</span>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-[10px] font-medium text-[var(--dash-text-muted)] mb-1 uppercase tracking-wide">
                <span>Progression</span>
                <span className="text-[#0055A4] font-bold">{progressPercent}%</span>
              </div>
              <div className="h-1.5 w-full bg-[var(--dash-card-border)] rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercent}%` }}
                  transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
                  className="h-full bg-gradient-to-r from-[#0055A4] to-[#3B82F6] rounded-full"
                />
              </div>
            </div>

            <button
              onClick={async () => { await supabase.auth.signOut(); navigate('/'); }}
              className="mt-1 flex items-center justify-center gap-2 w-full py-1.5 rounded-lg text-[11px] font-bold text-[var(--dash-text-muted)] hover:text-white hover:bg-[#EF4135] transition-all"
            >
              <LogOut className="h-3.5 w-3.5" />
              Déconnexion
            </button>
          </div>
        </motion.div>
      </motion.aside>

      {/* Mobile bottom navigation */}
      <motion.nav
        initial={{ y: 100 }} animate={{ y: 0 }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="fixed bottom-0 inset-x-0 z-50 md:hidden border-t border-[var(--dash-card-border)] bg-[var(--dash-card)] safe-area-bottom shadow-[0_-4px_24px_rgba(0,0,0,0.08)]"
      >
        <div className="flex items-center justify-around px-2 py-2">
          {MOBILE_NAV.map((item) => {
            const Icon = item.icon;
            const active = isActive(item);
            return (
              <button
                key={item.key}
                onClick={() => navigate(item.path)}
                className={`relative flex flex-col items-center gap-1 rounded-xl px-3 py-2 text-[10px] font-bold transition-all ${active
                  ? 'text-[#0055A4]'
                  : 'text-[var(--dash-text-muted)] hover:text-[var(--dash-text)]'
                  }`}
              >
                {active && (
                  <motion.div layoutId="mobileNavActive" className="absolute inset-0 bg-blue-500/10 rounded-xl" />
                )}
                <Icon className={`h-5 w-5 relative z-10 transition-transform ${active ? 'scale-110' : ''}`} />
                <span className="relative z-10">{item.label}</span>
              </button>
            );
          })}
        </div>
      </motion.nav>
    </>
  );
}
