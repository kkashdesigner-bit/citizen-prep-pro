import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/hooks/useAuth';
import { LANGUAGES, Language } from '@/lib/types';
import { Globe, LogOut, User, LayoutDashboard, Menu, X } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import ThemeToggle from '@/components/ThemeToggle';
import { useEffect, useState } from 'react';
import Logo from '@/components/Logo';
import { useIsMobile } from '@/hooks/use-mobile';

interface HeaderProps {
  animate?: boolean;
}

export default function Header({ animate = false }: HeaderProps) {
  const { language, setLanguage, t } = useLanguage();
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [loaded, setLoaded] = useState(!animate);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    if (animate) {
      const timer = setTimeout(() => setLoaded(true), 50);
      return () => clearTimeout(timer);
    }
  }, [animate]);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

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

  return (
    <header
      className={`sticky top-0 z-50 border-b border-primary/10 bg-background/60 backdrop-blur-xl transition-all duration-500 ${
        loaded ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-3'
      }`}
    >
      <div className="container flex h-14 sm:h-16 items-center justify-between">
        <Link to="/" className="flex items-center glow-hover rounded-lg p-1">
          <Logo size="sm" />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden sm:flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            className="glow-hover"
            onClick={handlePricingClick}
          >
            {t('nav.pricing')}
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className="glow-hover"
            onClick={() => navigate('/about')}
          >
            {t('nav.about')}
          </Button>

          <ThemeToggle />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="gap-2 glow-hover" aria-label="Select language">
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
              <Button variant="ghost" size="sm" className="glow-hover" onClick={() => navigate('/learn')}>
                {t('nav.learn') || 'Learn'}
              </Button>
              <Button variant="ghost" size="sm" className="glow-hover" onClick={() => navigate('/quiz?mode=exam')}>
                {t('nav.demo')}
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="glow-hover" aria-label="User menu">
                    <User className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="glass-card">
                  <DropdownMenuItem onClick={() => navigate('/learn')}>
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    {t('nav.learn')}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/dashboard')}>
                    <User className="mr-2 h-4 w-4" />
                    {t('nav.account') || 'Account'}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    {t('nav.logout')}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Button variant="ghost" size="sm" className="glow-hover" onClick={() => navigate('/quiz?mode=exam')}>
                {t('nav.demo')}
              </Button>
              <Button variant="gradient" size="sm" className="btn-glow" onClick={() => navigate('/auth')}>
                {t('nav.login')}
              </Button>
            </>
          )}
        </nav>

        {/* Mobile nav controls */}
        <div className="flex sm:hidden items-center gap-1">
          <ThemeToggle />
          <Button
            variant="ghost"
            size="sm"
            className="glow-hover"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile menu dropdown */}
      {mobileMenuOpen && isMobile && (
        <div className="sm:hidden border-t border-primary/10 bg-background/95 backdrop-blur-xl animate-fade-in">
          <nav className="container flex flex-col gap-1 py-3">
            <Button
              variant="ghost"
              size="sm"
              className="justify-start glow-hover"
              onClick={handlePricingClick}
            >
              {t('nav.pricing')}
            </Button>

            <Button
              variant="ghost"
              size="sm"
              className="justify-start glow-hover"
              onClick={() => { navigate('/about'); setMobileMenuOpen(false); }}
            >
              {t('nav.about')}
            </Button>

            <Button
              variant="ghost"
              size="sm"
              className="justify-start glow-hover"
              onClick={() => { navigate('/quiz?mode=exam'); setMobileMenuOpen(false); }}
            >
              {t('nav.demo')}
            </Button>

            {user ? (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  className="justify-start glow-hover"
                  onClick={() => { navigate('/learn'); setMobileMenuOpen(false); }}
                >
                  <LayoutDashboard className="mr-2 h-4 w-4" />
                  {t('nav.learn') || 'Learn'}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="justify-start glow-hover"
                  onClick={() => { navigate('/dashboard'); setMobileMenuOpen(false); }}
                >
                  <User className="mr-2 h-4 w-4" />
                  {t('nav.account') || 'Account'}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="justify-start text-destructive glow-hover"
                  onClick={() => { handleSignOut(); setMobileMenuOpen(false); }}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  {t('nav.logout')}
                </Button>
              </>
            ) : (
              <Button
                variant="gradient"
                size="sm"
                className="btn-glow mt-1"
                onClick={() => { navigate('/auth'); setMobileMenuOpen(false); }}
              >
                {t('nav.login')}
              </Button>
            )}

            {/* Language selector in mobile menu */}
            <div className="flex flex-wrap gap-1.5 pt-2 border-t border-border/50 mt-2">
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
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
