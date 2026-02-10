import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { AlertTriangle } from 'lucide-react';
import logoImg from '@/assets/logo.png';

export default function Footer() {
  const { t } = useLanguage();
  const location = useLocation();

  const handlePricingClick = (e: React.MouseEvent) => {
    if (location.pathname === '/') {
      e.preventDefault();
      document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="border-t border-border/50 bg-background/60 backdrop-blur-xl">
      {/* Legal disclaimer */}
      <div className="container py-6">
        <div className="mx-auto max-w-3xl glass-card p-4 border-destructive/30">
          <div className="flex items-start gap-3">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-destructive" />
            <p className="text-sm text-foreground">
              {t('footer.disclaimer')}
            </p>
          </div>
        </div>
      </div>

      {/* Footer links */}
      <div className="container border-t border-border/50 py-6">
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
          <Link to="/" className="flex items-center gap-1">
            <img src={logoImg} alt="GoCivique logo" className="h-8 w-8 rounded-md object-contain" />
          </Link>

          <nav className="flex flex-wrap items-center justify-center gap-4 text-sm">
            <Link to="/about" className="text-muted-foreground transition-colors hover:text-primary">
              {t('nav.about')}
            </Link>
            <Link
              to="/#pricing"
              onClick={handlePricingClick}
              className="text-muted-foreground transition-colors hover:text-primary"
            >
              {t('nav.pricing')}
            </Link>
          </nav>

          <p className="text-xs text-muted-foreground">
            {t('footer.rights')}
          </p>
        </div>
      </div>
    </footer>
  );
}
