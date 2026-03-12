import { forwardRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { AlertTriangle, ShieldCheck, Mail, MapPin } from 'lucide-react';
import Logo from '@/components/Logo';

const Footer = forwardRef<HTMLElement>(function Footer(_, ref) {
  const { t } = useLanguage();
  const location = useLocation();

  const handlePricingClick = (e: React.MouseEvent) => {
    if (location.pathname === '/') {
      e.preventDefault();
      document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="border-t border-border/50 bg-white pt-16 pb-8">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand & Trust */}
          <div className="flex flex-col gap-4">
            <Link to="/" className="flex items-center gap-1 mb-2">
              <Logo size="sm" />
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {t('footer.desc')}
            </p>
            <div className="flex items-center gap-2 mt-2">
              <ShieldCheck className="w-5 h-5 text-[hsl(var(--success))]" />
              <span className="text-sm font-medium text-foreground">{t('footer.securePayment')}</span>
            </div>
            {/* Payment Icons — inline SVGs to avoid hotlink issues */}
            <div className="flex flex-wrap items-center gap-3 mt-1 opacity-70">
              <span className="text-[10px] font-bold text-foreground/60 border border-foreground/20 rounded px-2 py-0.5 tracking-wider">VISA</span>
              <span className="text-[10px] font-bold text-foreground/60 border border-foreground/20 rounded px-2 py-0.5 tracking-wider">MASTERCARD</span>
              <span className="text-[10px] font-bold text-foreground/60 border border-foreground/20 rounded px-2 py-0.5 tracking-wider">APPLE PAY</span>
              <span className="text-[10px] font-bold text-foreground/60 border border-foreground/20 rounded px-2 py-0.5 tracking-wider">GOOGLE PAY</span>
              <span className="text-[10px] font-bold text-foreground/60 border border-foreground/20 rounded px-2 py-0.5 tracking-wider">PAYPAL</span>
            </div>
          </div>

          {/* Resources / Préparation */}
          <div className="flex flex-col gap-3">
            <h4 className="font-bold text-foreground mb-2 uppercase tracking-wider text-xs">{t('footer.preparation')}</h4>
            <Link to="/exams" className="text-sm text-muted-foreground hover:text-primary transition-colors">{t('footer.exams')}</Link>
            <Link to="/quiz" className="text-sm text-muted-foreground hover:text-primary transition-colors">{t('footer.quiz')}</Link>
            <Link to="/about" className="text-sm text-muted-foreground hover:text-primary transition-colors">{t('footer.understand')}</Link>
            <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">{t('footer.booklet')}</a>
          </div>

          {/* Navigation / GoCivique */}
          <div className="flex flex-col gap-3">
            <h4 className="font-bold text-foreground mb-2 uppercase tracking-wider text-xs">{t('footer.nav')}</h4>
            <Link to="/#pricing" onClick={handlePricingClick} className="text-sm text-muted-foreground hover:text-primary transition-colors">{t('footer.offers')}</Link>
            <Link to="/auth" className="text-sm text-muted-foreground hover:text-primary transition-colors">{t('footer.memberSpace')}</Link>
            <Link to="/contact" className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-2">
              <Mail className="w-4 h-4" /> {t('footer.support')}
            </Link>
          </div>

          {/* Legal */}
          <div className="flex flex-col gap-3">
            <h4 className="font-bold text-foreground mb-2 uppercase tracking-wider text-xs">{t('footer.legal')}</h4>
            <Link to="/terms" className="text-sm text-muted-foreground hover:text-primary transition-colors">{t('footer.terms')}</Link>
            <Link to="/privacy" className="text-sm text-muted-foreground hover:text-primary transition-colors">{t('footer.privacy')}</Link>
            <Link to="/refunds" className="text-sm text-muted-foreground hover:text-primary transition-colors">{t('footer.refunds')}</Link>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="bg-[#F5F7FA] rounded-2xl p-5 mb-8 border border-[#E6EAF0]">
          <div className="flex items-start gap-3">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-500" />
            <p className="text-xs text-muted-foreground leading-relaxed">
              <strong>{t('footer.warning')}</strong> {t('footer.disclaimerFull')}
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-border/50 pt-8 flex flex-col items-center justify-center text-center gap-2">
          <p className="text-xs text-muted-foreground">
            {t('footer.rights')}
          </p>
          <p className="text-xs text-muted-foreground/60 flex items-center gap-1">
            <MapPin className="w-3 h-3" /> {t('footer.madeWith')}
          </p>
        </div>
      </div>
    </footer>
  );
});

Footer.displayName = 'Footer';
export default Footer;
