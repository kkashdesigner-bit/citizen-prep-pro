import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/hooks/useAuth';
import { useSubscription } from '@/hooks/useSubscription';
import { LANGUAGES, Language } from '@/lib/types';
import { Globe, LogOut, User, LayoutDashboard, Menu, X, Settings, ArrowRight } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';

import { useEffect, useState } from 'react';
import Logo from '@/components/Logo';
import { useIsMobile } from '@/hooks/use-mobile';
import NotificationBell from '@/components/notifications/NotificationBell';

interface HeaderProps {
  animate?: boolean;
}

/** Nav link with sliding gradient underline (presentation only). */
function NavLinkButton({ children, onClick }: { children: React.ReactNode; onClick: (e: React.MouseEvent) => void }) {
  return (
    <button
      onClick={onClick}
      className="group relative px-3 py-2 text-sm font-semibold text-foreground/70 hover:text-foreground transition-colors rounded-lg"
    >
      {children}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-3 -bottom-px h-[2px] origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out rounded-full bg-gradient-to-r from-[#0055A4] via-[#1B6ED6] to-[#EF4135]"
      />
    </button>
  );
}

export default function Header({ animate = false }: HeaderProps) {
  const { language, setLanguage, t } = useLanguage();
  const { user, displayName, avatarUrl, signOut } = useAuth();
  const { isStandardOrAbove } = useSubscription();
  const navigate = useNavigate();
  const location = useLocation();
  const [loaded, setLoaded] = useState(!animate);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const isMobile = useIsMobile();
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (animate) {
      const timer = setTimeout(() => setLoaded(true), 50);
      return () => clearTimeout(timer);
    }
  }, [animate]);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // Scroll-aware glass: stronger blur/shadow + compact height once scrolled
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const handlePricingClick = (e: React.MouseEvent) => {
    if (location.pathname === '/') {
      e.preventDefault();
      document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate('/#pricing');
    }
    setMobileMenuOpen(false);
  };

  const initials = displayName
    ? displayName.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
    : user?.email?.slice(0, 2).toUpperCase() || '??';

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-500 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-3'}
        ${scrolled
          ? 'bg-background/75 backdrop-blur-2xl border-b border-primary/10 shadow-[0_8px_30px_-12px_rgba(0,85,164,0.18)]'
          : 'bg-background/40 backdrop-blur-xl border-b border-transparent'
        }`}
    >
      {/* Tricolor hairline — French identity */}
      <div
        aria-hidden
        className={`h-[2px] w-full bg-gradient-to-r from-[#0055A4] via-white to-[#EF4135] transition-opacity duration-500 ${scrolled ? 'opacity-90' : 'opacity-60'}`}
      />

      <div className={`container flex items-center justify-between transition-all duration-300 ${scrolled ? 'h-12 sm:h-14' : 'h-14 sm:h-16'}`}>
        <Link to="/" className="flex items-center glow-hover rounded-lg p-1 transition-transform duration-300 hover:scale-[1.03] active:scale-[0.98]">
          <Logo size="sm" />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden sm:flex items-center gap-0.5">
          <NavLinkButton onClick={handlePricingClick}>{t('nav.pricing')}</NavLinkButton>
          <NavLinkButton onClick={() => navigate('/about')}>{t('nav.about')}</NavLinkButton>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="gap-2 glow-hover text-foreground/70 hover:text-foreground" aria-label="Select language">
                <Globe className="h-4 w-4" />
                <span className="hidden md:inline">{LANGUAGES[language]}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="glass-card">
              {(Object.entries(LANGUAGES) as [Language, string][]).map(([code, name]) => (
                <DropdownMenuItem
                  key={code}
                  onClick={() => setLanguage(code)}
                  className={language === code ? 'bg-primary/10' : ''}
                >
                  {name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {user ? (
            <>
              <NavLinkButton onClick={() => navigate('/learn')}>
                <span className="inline-flex items-center">
                  <LayoutDashboard className="mr-1.5 h-4 w-4" />
                  {t('nav.learn') || 'Tableau de bord'}
                </span>
              </NavLinkButton>

              {!isStandardOrAbove && (
                <NavLinkButton onClick={() => navigate('/quiz?mode=exam')}>{t('nav.demo')}</NavLinkButton>
              )}

              {/* Notification bell */}
              <NotificationBell />

              {/* Avatar dropdown — conic gradient ring */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    className="ml-1.5 rounded-full p-[2px] bg-[conic-gradient(from_140deg,#0055A4,#1B6ED6,#EF4135,#0055A4)] transition-transform duration-200 hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
                    aria-label="Mon compte"
                  >
                    <Avatar className="h-8 w-8 ring-2 ring-background">
                      {avatarUrl && <AvatarImage src={avatarUrl} alt={displayName || ''} />}
                      <AvatarFallback className="bg-primary/15 text-primary text-xs font-semibold">
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="glass-card w-48">
                  <div className="px-3 py-2">
                    <p className="text-sm font-medium text-foreground truncate">{displayName}</p>
                    <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate('/learn')}>
                    <User className="mr-2 h-4 w-4" />
                    Profil
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/learn')}>
                    <Settings className="mr-2 h-4 w-4" />
                    Paramètres
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut} className="text-destructive focus:text-destructive">
                    <LogOut className="mr-2 h-4 w-4" />
                    Déconnexion
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <NavLinkButton onClick={() => navigate('/quiz?mode=exam')}>{t('nav.demo')}</NavLinkButton>
              {/* CTA — gradient + shimmer sweep */}
              <button
                onClick={() => navigate('/auth')}
                className="group relative ml-2 inline-flex h-9 items-center gap-1.5 overflow-hidden rounded-xl bg-gradient-to-r from-[#0055A4] to-[#1B6ED6] px-4 text-sm font-bold text-white shadow-[0_4px_14px_rgba(0,85,164,0.35)] transition-all duration-300 hover:shadow-[0_6px_20px_rgba(0,85,164,0.45)] hover:-translate-y-0.5 active:translate-y-0"
              >
                <span className="relative z-10">{t('nav.login')}</span>
                <ArrowRight className="relative z-10 h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
                {!reducedMotion && (
                  <span
                    aria-hidden
                    className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full"
                  />
                )}
              </button>
            </>
          )}
        </nav>

        {/* Mobile nav controls */}
        <div className="flex sm:hidden items-center gap-1">

          {user && <NotificationBell />}

          {user && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className="rounded-full p-[2px] bg-[conic-gradient(from_140deg,#0055A4,#1B6ED6,#EF4135,#0055A4)] transition-transform duration-200 hover:scale-105 focus:outline-none"
                  aria-label="Mon compte"
                >
                  <Avatar className="h-7 w-7 ring-2 ring-background">
                    {avatarUrl && <AvatarImage src={avatarUrl} alt={displayName || ''} />}
                    <AvatarFallback className="bg-primary/15 text-primary text-[10px] font-semibold">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="glass-card w-48">
                <div className="px-3 py-2">
                  <p className="text-sm font-medium text-foreground truncate">{displayName}</p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate('/learn')}>
                  <User className="mr-2 h-4 w-4" />
                  Profil
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut} className="text-destructive focus:text-destructive">
                  <LogOut className="mr-2 h-4 w-4" />
                  Déconnexion
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
          <Button
            variant="ghost"
            size="sm"
            className="glow-hover relative"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
            aria-expanded={mobileMenuOpen}
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={mobileMenuOpen ? 'x' : 'menu'}
                initial={reducedMotion ? false : { rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={reducedMotion ? undefined : { rotate: 90, opacity: 0 }}
                transition={{ duration: 0.18 }}
                className="block"
              >
                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </motion.span>
            </AnimatePresence>
          </Button>
        </div>
      </div>

      {/* Mobile menu — animated glass sheet */}
      <AnimatePresence>
        {mobileMenuOpen && isMobile && (
          <motion.div
            initial={reducedMotion ? false : { height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={reducedMotion ? undefined : { height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
            className="sm:hidden overflow-hidden border-t border-primary/10 bg-background/95 backdrop-blur-2xl shadow-[0_16px_32px_-16px_rgba(0,85,164,0.25)]"
          >
            <motion.nav
              initial="hidden"
              animate="visible"
              variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.045, delayChildren: 0.05 } } }}
              className="container flex flex-col gap-1 py-3"
            >
              {[
                ...(user ? [{
                  key: 'dash',
                  el: (
                    <Button variant="ghost" size="sm" className="justify-start glow-hover w-full"
                      onClick={() => { navigate('/learn'); setMobileMenuOpen(false); }}>
                      <LayoutDashboard className="mr-2 h-4 w-4" />
                      Tableau de bord
                    </Button>
                  ),
                }] : []),
                {
                  key: 'pricing',
                  el: (
                    <Button variant="ghost" size="sm" className="justify-start glow-hover w-full" onClick={handlePricingClick}>
                      {t('nav.pricing')}
                    </Button>
                  ),
                },
                {
                  key: 'about',
                  el: (
                    <Button variant="ghost" size="sm" className="justify-start glow-hover w-full"
                      onClick={() => { navigate('/about'); setMobileMenuOpen(false); }}>
                      {t('nav.about')}
                    </Button>
                  ),
                },
                ...((!user || !isStandardOrAbove) ? [{
                  key: 'demo',
                  el: (
                    <Button variant="ghost" size="sm" className="justify-start glow-hover w-full"
                      onClick={() => { navigate('/quiz?mode=exam'); setMobileMenuOpen(false); }}>
                      {t('nav.demo')}
                    </Button>
                  ),
                }] : []),
                ...(!user ? [{
                  key: 'login',
                  el: (
                    <button
                      onClick={() => { navigate('/auth'); setMobileMenuOpen(false); }}
                      className="mt-1 inline-flex h-10 w-full items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-[#0055A4] to-[#1B6ED6] text-sm font-bold text-white shadow-[0_4px_14px_rgba(0,85,164,0.35)] active:scale-[0.99] transition-transform"
                    >
                      {t('nav.login')}
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  ),
                }] : []),
              ].map(item => (
                <motion.div
                  key={item.key}
                  variants={{ hidden: { opacity: 0, x: -12 }, visible: { opacity: 1, x: 0 } }}
                  transition={{ duration: 0.25, ease: 'easeOut' }}
                >
                  {item.el}
                </motion.div>
              ))}

              {/* Language selector */}
              <motion.div
                variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
                className="flex flex-wrap gap-1.5 pt-2 border-t border-border/50 mt-2"
              >
                {(Object.entries(LANGUAGES) as [Language, string][]).map(([code, name]) => (
                  <Button
                    key={code}
                    variant={language === code ? 'secondary' : 'ghost'}
                    size="sm"
                    className="text-xs"
                    onClick={() => { setLanguage(code); setMobileMenuOpen(false); }}
                  >
                    {name}
                  </Button>
                ))}
              </motion.div>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
