import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { AlertTriangle } from 'lucide-react';

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
    <footer className="border-t border-border bg-card">
      {/* Legal disclaimer */}
      <div className="container py-6">
        <div className="mx-auto max-w-3xl rounded-lg border-2 border-destructive/30 bg-destructive/5 p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-destructive" />
            <p className="text-sm text-foreground">
              {t('footer.disclaimer')}
            </p>
          </div>
        </div>
      </div>

      {/* Footer links */}
      <div className="container border-t border-border py-6">
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
          <div className="flex items-center gap-1">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary">
              <span className="text-xs font-bold text-primary-foreground">EC</span>
            </div>
            <span className="font-serif text-sm font-bold text-foreground">Examen Civique</span>
          </div>

          <nav className="flex flex-wrap items-center justify-center gap-4 text-sm">
            <Link to="/about" className="text-muted-foreground transition-colors hover:text-foreground">
              {t('nav.about')}
            </Link>
            <Link
              to="/#pricing"
              onClick={handlePricingClick}
              className="text-muted-foreground transition-colors hover:text-foreground"
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
