import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useUserProfile } from '@/hooks/useUserProfile';
import Logo from '@/components/Logo';
import { ArrowRight, Eye, EyeOff, Mail, Lock, User, ChevronLeft, Sparkles, Shield, BarChart3 } from 'lucide-react';

const AVATARS = Array.from({ length: 8 }, (_, i) => `/avatar-${i + 1}.webp`);

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [isForgot, setIsForgot] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formState, setFormState] = useState<'idle' | 'switching'>('idle');
  const { t } = useLanguage();
  const { signInWithEmail, signUpWithEmail, signInWithGoogle } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { profile } = useUserProfile();

  const switchMode = (toLogin: boolean) => {
    setFormState('switching');
    setTimeout(() => {
      setIsLogin(toLogin);
      setIsForgot(false);
      setFormState('idle');
    }, 200);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isLogin) {
        await signInWithEmail(email, password);
        navigate(profile?.onboarding_completed ? '/learn' : '/onboarding');
      } else {
        await signUpWithEmail(email, password);
        // Save display name to profiles
        if (displayName.trim()) {
          const { data: { user } } = await supabase.auth.getUser();
          if (user) {
            await supabase.from('profiles').update({ display_name: displayName.trim() }).eq('id', user.id);
          }
        }
        toast({
          title: 'Compte créé !',
          description: 'Vérifiez votre email pour confirmer votre compte.',
        });
        navigate('/onboarding');
      }
    } catch (error: any) {
      toast({
        title: 'Erreur',
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
      toast({ title: 'Email envoyé ! Vérifiez votre boîte de réception.' });
      setIsForgot(false);
    } catch (error: any) {
      toast({
        title: 'Erreur',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  // Password strength
  const getPasswordStrength = (pwd: string) => {
    let score = 0;
    if (pwd.length >= 6) score++;
    if (pwd.length >= 8) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^a-zA-Z0-9]/.test(pwd)) score++;
    return score;
  };

  const strength = getPasswordStrength(password);
  const strengthLabels = ['', 'Faible', 'Moyen', 'Bon', 'Fort', 'Excellent'];
  const strengthColors = ['', '#EF4135', '#F59E0B', '#3B82F6', '#10B981', '#059669'];

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-white">
      {/* ─── Left Column: Hero Illustration ─── */}
      <div className="relative hidden lg:flex lg:w-[48%] bg-gradient-to-br from-[#0055A4] via-[#1B6ED6] to-[#4D94E0] p-12 flex-col justify-between overflow-hidden">
        {/* Animated background shapes */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-20 -right-20 w-96 h-96 rounded-full bg-white/5" style={{ animation: 'float 12s ease-in-out infinite' }} />
          <div className="absolute bottom-20 -left-32 w-80 h-80 rounded-full bg-white/5" style={{ animation: 'float 15s ease-in-out infinite reverse' }} />
          <div className="absolute top-1/2 right-1/4 w-48 h-48 rounded-full bg-white/3" style={{ animation: 'float 10s ease-in-out infinite' }} />
        </div>

        {/* Logo */}
        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <Logo size="sm" />
            <span className="text-white font-bold text-xl tracking-tight">GoCivique</span>
          </div>
        </div>

        {/* Floating Avatars Grid */}
        <div className="relative z-10 flex-1 flex items-center justify-center my-12">
          <div className="relative w-full max-w-md aspect-square">
            {AVATARS.map((src, i) => {
              const angle = (i / AVATARS.length) * 2 * Math.PI - Math.PI / 2;
              const radius = 42;
              const x = 50 + radius * Math.cos(angle);
              const y = 50 + radius * Math.sin(angle);
              const size = i % 3 === 0 ? 'w-16 h-16' : i % 2 === 0 ? 'w-14 h-14' : 'w-12 h-12';

              return (
                <div
                  key={i}
                  className={`absolute ${size} rounded-2xl overflow-hidden border-2 border-white/30 shadow-xl`}
                  style={{
                    left: `${x}%`,
                    top: `${y}%`,
                    transform: 'translate(-50%, -50%)',
                    animation: `floatAvatar ${6 + i * 0.8}s ease-in-out infinite`,
                    animationDelay: `${i * 0.4}s`,
                  }}
                >
                  <img src={src} alt="" className="w-full h-full object-cover" loading="lazy" />
                </div>
              );
            })}

            {/* Center badge */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-28 h-28 rounded-3xl bg-white/10 backdrop-blur-lg border border-white/20 flex flex-col items-center justify-center shadow-2xl">
              <span className="text-4xl mb-1">🇫🇷</span>
              <span className="text-white text-xs font-bold tracking-wide">Examen 2026</span>
            </div>
          </div>
        </div>

        {/* Value propositions */}
        <div className="relative z-10 space-y-4">
          <div className="flex items-center gap-3 text-white/90">
            <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <p className="font-semibold text-sm">+7 000 questions</p>
              <p className="text-xs text-white/60">Questions officielles actualisées</p>
            </div>
          </div>
          <div className="flex items-center gap-3 text-white/90">
            <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center">
              <BarChart3 className="w-5 h-5" />
            </div>
            <div>
              <p className="font-semibold text-sm">Suivi personnalisé</p>
              <p className="text-xs text-white/60">Parcours adapté à votre objectif</p>
            </div>
          </div>
          <div className="flex items-center gap-3 text-white/90">
            <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <p className="font-semibold text-sm">Conforme programme 2026</p>
              <p className="text-xs text-white/60">Ministère de l'Intérieur</p>
            </div>
          </div>
        </div>
      </div>

      {/* ─── Right Column: Auth Form ─── */}
      <div className="flex-1 flex flex-col min-h-screen lg:min-h-0">
        {/* Mobile header */}
        <div className="lg:hidden flex items-center justify-between p-4 border-b border-[#E6EAF0] bg-white">
          <div className="flex items-center gap-3">
            <Logo size="sm" />
            <span className="text-[#1A1A1A] font-bold text-lg">GoCivique</span>
          </div>
          <div className="flex -space-x-2">
            {AVATARS.slice(0, 4).map((src, i) => (
              <img
                key={i}
                src={src}
                alt=""
                className="w-8 h-8 rounded-full border-2 border-white object-cover shadow-sm"
              />
            ))}
          </div>
        </div>

        {/* Form container */}
        <div className="flex-1 flex items-center justify-center px-5 py-8 sm:px-8 lg:px-16">
          <div
            className={`w-full max-w-md transition-all duration-200 ${formState === 'switching' ? 'opacity-0 translate-y-3' : 'opacity-100 translate-y-0'
              }`}
          >
            {/* Title area */}
            <div className="mb-8">
              {isForgot ? (
                <>
                  <button
                    onClick={() => setIsForgot(false)}
                    className="flex items-center gap-1 text-sm text-[#0055A4] font-medium mb-4 hover:gap-2 transition-all"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Retour
                  </button>
                  <h1 className="text-2xl sm:text-3xl font-bold text-[#1A1A1A] tracking-tight">Mot de passe oublié ?</h1>
                  <p className="text-[#1A1A1A]/60 mt-2">Entrez votre email pour réinitialiser votre mot de passe.</p>
                </>
              ) : (
                <>
                  <h1 className="text-2xl sm:text-3xl font-bold text-[#1A1A1A] tracking-tight">
                    {isLogin ? 'Bon retour !' : 'Créez votre compte'}
                  </h1>
                  <p className="text-[#1A1A1A]/60 mt-2">
                    {isLogin
                      ? 'Connectez-vous pour continuer votre préparation.'
                      : 'Rejoignez des milliers de candidats qui préparent leur examen civique.'}
                  </p>
                </>
              )}
            </div>

            {/* ─── Reset Password Form ─── */}
            {isForgot ? (
              <form onSubmit={handleResetPassword} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="reset-email" className="text-sm font-medium text-[#1A1A1A]">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#1A1A1A]/30" />
                    <Input
                      id="reset-email"
                      type="email"
                      placeholder="votre@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="pl-10 h-12 rounded-xl border-[#E6EAF0] bg-[#F5F7FA] hover:border-[#0055A4]/30 focus:border-[#0055A4] focus:bg-white focus:shadow-[0_0_0_3px_rgba(0,85,164,0.1)] transition-all"
                    />
                  </div>
                </div>
                <Button type="submit" disabled={loading} className="w-full h-12 rounded-xl bg-[#0055A4] hover:bg-[#1B6ED6] text-white font-bold text-base transition-all hover:scale-[1.01] active:scale-[0.99]">
                  {loading ? <span className="animate-pulse">Envoi en cours...</span> : 'Réinitialiser le mot de passe'}
                </Button>
              </form>
            ) : (
              <>
                {/* ─── Google Button ─── */}
                <Button
                  variant="outline"
                  className="w-full h-12 rounded-xl gap-3 font-semibold text-[#1A1A1A] border-[#E6EAF0] hover:border-[#0055A4]/30 hover:bg-[#F5F7FA] transition-all hover:scale-[1.01] active:scale-[0.99]"
                  onClick={signInWithGoogle}
                >
                  <svg className="h-5 w-5" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                  </svg>
                  Continuer avec Google
                </Button>

                {/* Divider */}
                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-[#E6EAF0]" />
                  </div>
                  <div className="relative flex justify-center">
                    <span className="bg-white px-4 text-sm text-[#1A1A1A]/40 font-medium">ou</span>
                  </div>
                </div>

                {/* ─── Email Form ─── */}
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Name (sign-up only) */}
                  {!isLogin && (
                    <div className="space-y-2" style={{ animation: 'slideDown 0.3s ease-out' }}>
                      <Label htmlFor="name" className="text-sm font-medium text-[#1A1A1A]">Prénom</Label>
                      <div className="relative">
                        <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#1A1A1A]/30" />
                        <Input
                          id="name"
                          type="text"
                          placeholder="Votre prénom"
                          value={displayName}
                          onChange={(e) => setDisplayName(e.target.value)}
                          className="pl-10 h-12 rounded-xl border-[#E6EAF0] bg-[#F5F7FA] hover:border-[#0055A4]/30 focus:border-[#0055A4] focus:bg-white focus:shadow-[0_0_0_3px_rgba(0,85,164,0.1)] transition-all"
                        />
                      </div>
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium text-[#1A1A1A]">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#1A1A1A]/30" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="votre@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="pl-10 h-12 rounded-xl border-[#E6EAF0] bg-[#F5F7FA] hover:border-[#0055A4]/30 focus:border-[#0055A4] focus:bg-white focus:shadow-[0_0_0_3px_rgba(0,85,164,0.1)] transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password" className="text-sm font-medium text-[#1A1A1A]">Mot de passe</Label>
                      {isLogin && (
                        <button
                          type="button"
                          onClick={() => setIsForgot(true)}
                          className="text-xs text-[#0055A4] font-medium hover:underline underline-offset-2"
                        >
                          Mot de passe oublié ?
                        </button>
                      )}
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#1A1A1A]/30" />
                      <Input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder={isLogin ? '••••••••' : 'Au moins 6 caractères'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        minLength={6}
                        className="pl-10 pr-10 h-12 rounded-xl border-[#E6EAF0] bg-[#F5F7FA] hover:border-[#0055A4]/30 focus:border-[#0055A4] focus:bg-white focus:shadow-[0_0_0_3px_rgba(0,85,164,0.1)] transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#1A1A1A]/30 hover:text-[#1A1A1A]/60 transition-colors"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>

                    {/* Password strength indicator (sign-up only) */}
                    {!isLogin && password.length > 0 && (
                      <div className="flex items-center gap-2 mt-1" style={{ animation: 'slideDown 0.2s ease-out' }}>
                        <div className="flex-1 flex gap-1">
                          {[1, 2, 3, 4, 5].map(i => (
                            <div
                              key={i}
                              className="h-1 flex-1 rounded-full transition-all duration-300"
                              style={{ backgroundColor: i <= strength ? strengthColors[strength] : '#E6EAF0' }}
                            />
                          ))}
                        </div>
                        <span className="text-xs font-medium" style={{ color: strengthColors[strength] }}>
                          {strengthLabels[strength]}
                        </span>
                      </div>
                    )}
                  </div>

                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full h-12 rounded-xl bg-[#0055A4] hover:bg-[#1B6ED6] text-white font-bold text-base gap-2 transition-all hover:scale-[1.01] active:scale-[0.99] mt-2"
                  >
                    {loading ? (
                      <span className="animate-pulse">{isLogin ? 'Connexion...' : 'Création du compte...'}</span>
                    ) : (
                      <>
                        {isLogin ? 'Se connecter' : 'Créer mon compte'}
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </Button>
                </form>

                {/* Toggle login/signup */}
                <p className="text-center text-sm text-[#1A1A1A]/50 mt-6">
                  {isLogin ? "Pas encore de compte ?" : 'Déjà un compte ?'}{' '}
                  <button
                    onClick={() => switchMode(!isLogin)}
                    className="font-semibold text-[#0055A4] hover:underline underline-offset-2"
                  >
                    {isLogin ? "S'inscrire" : 'Se connecter'}
                  </button>
                </p>
              </>
            )}
          </div>
        </div>

        {/* Mobile footer trust badge */}
        <div className="lg:hidden border-t border-[#E6EAF0] p-4 flex items-center justify-center gap-4 text-xs text-[#1A1A1A]/40">
          <span className="flex items-center gap-1"><Shield className="w-3 h-3" /> Données sécurisées</span>
          <span>•</span>
          <span>+7 000 questions</span>
          <span>•</span>
          <span>Conforme 2026</span>
        </div>
      </div>

      {/* Keyframe animations */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translate(0, 0); }
          33% { transform: translate(20px, -30px); }
          66% { transform: translate(-15px, 20px); }
        }
        @keyframes floatAvatar {
          0%, 100% { transform: translate(-50%, -50%) translateY(0px); }
          50% { transform: translate(-50%, -50%) translateY(-8px); }
        }
        @keyframes slideDown {
          0% { opacity: 0; transform: translateY(-8px); }
          100% { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
