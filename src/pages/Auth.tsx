import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import Header from '@/components/Header';
import logoImg from '@/assets/logo.png';

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [isForgot, setIsForgot] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { t } = useLanguage();
  const { signInWithEmail, signUpWithEmail, signInWithGoogle } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isLogin) {
        await signInWithEmail(email, password);
        navigate('/dashboard');
      } else {
        await signUpWithEmail(email, password);
        toast({
          title: t('auth.resetSent').split('!')[0] + '!',
          description: t('auth.resetSent'),
        });
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin,
      });
      if (error) throw error;
      toast({ title: t('auth.resetSent') });
      setIsForgot(false);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container flex items-center justify-center py-20">
        <div className="w-full max-w-md glass-card p-8">
          <div className="text-center mb-6">
            <img src={logoImg} alt="GoCivique" className="mx-auto mb-4 h-14 w-14 rounded-lg object-contain" />
            <h1 className="font-serif text-2xl font-bold text-foreground">
              {isForgot ? t('auth.resetPassword') : isLogin ? t('auth.login') : t('auth.signup')}
            </h1>
          </div>

          {isForgot ? (
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="reset-email">{t('auth.email')}</Label>
                <Input
                  id="reset-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-secondary/50 border-border/50 focus:border-primary focus:shadow-[0_0_12px_hsl(var(--primary)/0.2)]"
                />
              </div>
              <Button type="submit" className="w-full btn-glow" disabled={loading}>
                {loading ? '...' : t('auth.resetPassword')}
              </Button>
              <button
                type="button"
                onClick={() => setIsForgot(false)}
                className="block w-full text-center text-sm font-medium text-primary underline-offset-4 hover:underline"
              >
                {t('auth.backToLogin')}
              </button>
            </form>
          ) : (
            <div className="space-y-4">
              <Button
                variant="outline"
                className="w-full gap-2 glow-hover"
                onClick={signInWithGoogle}
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                </svg>
                {t('auth.google')}
              </Button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-border/50" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">{t('auth.or')}</span>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">{t('auth.email')}</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="bg-secondary/50 border-border/50 focus:border-primary focus:shadow-[0_0_12px_hsl(var(--primary)/0.2)]"
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">{t('auth.password')}</Label>
                    {isLogin && (
                      <button
                        type="button"
                        onClick={() => setIsForgot(true)}
                        className="text-xs text-primary underline-offset-4 hover:underline"
                      >
                        {t('auth.forgotPassword')}
                      </button>
                    )}
                  </div>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                    className="bg-secondary/50 border-border/50 focus:border-primary focus:shadow-[0_0_12px_hsl(var(--primary)/0.2)]"
                  />
                </div>
                <Button type="submit" className="w-full btn-glow" disabled={loading}>
                  {loading ? '...' : isLogin ? t('auth.login') : t('auth.signup')}
                </Button>
              </form>

              <p className="text-center text-sm text-muted-foreground">
                {isLogin ? t('auth.noAccount') : t('auth.hasAccount')}{' '}
                <button
                  onClick={() => setIsLogin(!isLogin)}
                  className="font-medium text-primary underline-offset-4 hover:underline"
                >
                  {isLogin ? t('auth.signup') : t('auth.login')}
                </button>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
