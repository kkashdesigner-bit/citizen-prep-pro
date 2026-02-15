import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/hooks/useAuth';
import { LANGUAGES, Language } from '@/lib/types';
import { Globe, LogOut, User, LayoutDashboard, Menu, X, BarChart3, Settings } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import ThemeToggle from '@/components/ThemeToggle';
import { useEffect, useState } from 'react';
import Logo from '@/components/Logo';
import { useIsMobile } from '@/hooks/use-mobile';

interface HeaderProps {
  animate?: boolean;
}

export default function Header({ animate = false }: HeaderProps) {
  const { language, setLanguage, t } = useLanguage();
  const { user, displayName, avatarUrl, signOut } = useAuth();
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

  const initials = displayName
    ? displayName.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
    : user?.email?.slice(0, 2).toUpperCase() || '??';

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
          <Button variant="ghost" size="sm" className="glow-hover" onClick={handlePricingClick}>
            {t('nav.pricing')}
          </Button>
          <Button variant="ghost" size="sm" className="glow-hover" onClick={() => navigate('/about')}>
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
                <LayoutDashboard className="mr-1.5 h-4 w-4" />
                {t('nav.learn') || 'Tableau de bord'}
              </Button>
              <Button variant="ghost" size="sm" className="glow-hover" onClick={() => navigate('/quiz?mode=exam')}>
                {t('nav.demo')}
              </Button>

              {/* Avatar dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="ml-1 rounded-full ring-2 ring-primary/20 hover:ring-primary/40 transition-all focus:outline-none">
                    <Avatar className="h-8 w-8">
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
                  <DropdownMenuItem onClick={() => navigate('/dashboard')}>
                    <User className="mr-2 h-4 w-4" />
                    Profil
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/progress')}>
                    <BarChart3 className="mr-2 h-4 w-4" />
                    Progression
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/dashboard')}>
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
          {user && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="rounded-full ring-2 ring-primary/20 hover:ring-primary/40 transition-all focus:outline-none">
                  <Avatar className="h-7 w-7">
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
                <DropdownMenuItem onClick={() => navigate('/dashboard')}>
                  <User className="mr-2 h-4 w-4" />
                  Profil
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/progress')}>
                  <BarChart3 className="mr-2 h-4 w-4" />
                  Progression
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
            {user && (
              <Button
                variant="ghost"
                size="sm"
                className="justify-start glow-hover"
                onClick={() => { navigate('/learn'); setMobileMenuOpen(false); }}
              >
                <LayoutDashboard className="mr-2 h-4 w-4" />
                Tableau de bord
              </Button>
            )}
            <Button variant="ghost" size="sm" className="justify-start glow-hover" onClick={handlePricingClick}>
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

            {!user && (
              <Button
                variant="gradient"
                size="sm"
                className="btn-glow mt-1"
                onClick={() => { navigate('/auth'); setMobileMenuOpen(false); }}
              >
                {t('nav.login')}
              </Button>
            )}

            {/* Language selector */}
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
