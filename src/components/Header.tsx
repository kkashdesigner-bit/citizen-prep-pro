import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/hooks/useAuth';
import { LANGUAGES, Language } from '@/lib/types';
import { Globe, LogOut, User, LayoutDashboard } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import ThemeToggle from '@/components/ThemeToggle';
import { useEffect, useState } from 'react';

interface HeaderProps {
  animate?: boolean;
}

export default function Header({ animate = false }: HeaderProps) {
  const { language, setLanguage, t } = useLanguage();
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [loaded, setLoaded] = useState(!animate);

  useEffect(() => {
    if (animate) {
      const timer = setTimeout(() => setLoaded(true), 50);
      return () => clearTimeout(timer);
    }
  }, [animate]);

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
  };

  return (
    <header
      className={`sticky top-0 z-50 border-b border-border/50 bg-background/60 backdrop-blur-xl transition-all duration-500 ${
        loaded ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-3'
      }`}
    >
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2 glow-hover rounded-lg p-1">
          <div className="flex h-9 w-9 items-center justify-center rounded-md bg-primary shadow-[0_0_12px_hsl(var(--primary)/0.4)]">
            <span className="text-sm font-bold text-primary-foreground">EC</span>
          </div>
          <span className="hidden font-serif text-lg font-bold text-foreground sm:inline-block">
            Examen Civique
          </span>
        </Link>

        <nav className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            className="hidden glow-hover sm:inline-flex"
            onClick={handlePricingClick}
          >
            {t('nav.pricing')}
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className="hidden glow-hover sm:inline-flex"
            onClick={() => navigate('/about')}
          >
            {t('nav.about')}
          </Button>

          <ThemeToggle />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="gap-2 glow-hover">
                <Globe className="h-4 w-4" />
                <span className="hidden sm:inline">{LANGUAGES[language]}</span>
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
              <Button variant="ghost" size="sm" className="glow-hover" onClick={() => navigate('/quiz?mode=exam')}>
                {t('nav.demo')}
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="glow-hover">
                    <User className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="glass-card">
                  <DropdownMenuItem onClick={() => navigate('/dashboard')}>
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    {t('nav.dashboard')}
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
              <Button variant="default" size="sm" className="btn-glow" onClick={() => navigate('/auth')}>
                {t('nav.login')}
              </Button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
