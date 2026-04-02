import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SEOHead from '@/components/SEOHead';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import Logo from '@/components/Logo';
import { Eye, EyeOff, Lock, CheckCircle2, AlertCircle, Sparkles, Shield, BarChart3, ArrowRight } from 'lucide-react';

const AVATARS = Array.from({ length: 8 }, (_, i) => `/examen-civique-avatar-${i + 1}.webp`);

type PageState = 'waiting' | 'ready' | 'success' | 'invalid';

export default function UpdatePassword() {
  const [pageState, setPageState] = useState<PageState>('waiting');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Detect the PASSWORD_RECOVERY event from Supabase
  useEffect(() => {
    // Supabase v2 fires PASSWORD_RECOVERY when it sees type=recovery in the URL hash
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') {
        setPageState('ready');
      }
    });

    // Fallback: if already in a recovery session (page reload), check immediately
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setPageState('ready');
      }
    });

    // If no recovery event fires within 4 seconds, show invalid state
    const timeout = setTimeout(() => {
      setPageState(prev => prev === 'waiting' ? 'invalid' : prev);
    }, 4000);

    return () => {
      subscription.unsubscribe();
      clearTimeout(timeout);
    };
  }, []);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirm) {
      toast({ title: 'Erreur', description: 'Les mots de passe ne correspondent pas.', variant: 'destructive' });
      return;
    }
    if (password.length < 6) {
      toast({ title: 'Erreur', description: 'Le mot de passe doit contenir au moins 6 caractères.', variant: 'destructive' });
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      setPageState('success');
      toast({ title: 'Mot de passe mis à jour !', description: 'Vous allez être redirigé vers votre tableau de bord.' });
      setTimeout(() => navigate('/learn'), 2000);
    } catch (err: any) {
      toast({ title: 'Erreur', description: err.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const mismatch = confirm.length > 0 && password !== confirm;

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-white">
      <SEOHead noindex />

      {/* ─── Left Column: Hero ─── */}
      <div className="relative hidden lg:flex lg:w-[48%] bg-gradient-to-br from-[#0055A4] via-[#1B6ED6] to-[#4D94E0] p-12 flex-col justify-between overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-20 -right-20 w-96 h-96 rounded-full bg-white/5" style={{ animation: 'float 12s ease-in-out infinite' }} />
          <div className="absolute bottom-20 -left-32 w-80 h-80 rounded-full bg-white/5" style={{ animation: 'float 15s ease-in-out infinite reverse' }} />
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <Logo size="sm" />
          </div>
        </div>

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
                    left: `${x}%`, top: `${y}%`,
                    transform: 'translate(-50%, -50%)',
                    animation: `floatAvatar ${6 + i * 0.8}s ease-in-out infinite`,
                    animationDelay: `${i * 0.4}s`,
                  }}
                >
                  <img src={src} alt="" className="w-full h-full object-cover" loading="lazy" />
                </div>
              );
            })}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-28 h-28 rounded-3xl bg-white/10 backdrop-blur-lg border border-white/20 flex flex-col items-center justify-center shadow-2xl">
              <Lock className="w-10 h-10 text-white mb-1" />
              <span className="text-white text-xs font-bold tracking-wide">Sécurisé</span>
            </div>
          </div>
        </div>

        <div className="relative z-10 space-y-4">
          {[
            { icon: Sparkles, title: '+7 000 questions', sub: 'Questions officielles actualisées' },
            { icon: BarChart3, title: 'Suivi personnalisé', sub: 'Parcours adapté à votre objectif' },
            { icon: Shield, title: 'Conforme programme 2026', sub: "Ministère de l'Intérieur" },
          ].map(({ icon: Icon, title, sub }) => (
            <div key={title} className="flex items-center gap-3 text-white/90">
              <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center">
                <Icon className="w-5 h-5" />
              </div>
              <div>
                <p className="font-semibold text-sm">{title}</p>
                <p className="text-xs text-white/60">{sub}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ─── Right Column: Form ─── */}
      <div className="flex-1 flex flex-col min-h-screen lg:min-h-0">
        {/* Mobile header */}
        <div className="lg:hidden flex items-center justify-between p-4 border-b border-[#E6EAF0] bg-white">
          <Logo size="sm" />
          <div className="flex -space-x-2">
            {AVATARS.slice(0, 4).map((src, i) => (
              <img key={i} src={src} alt="" className="w-8 h-8 rounded-full border-2 border-white object-cover shadow-sm" />
            ))}
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center px-5 py-8 sm:px-8 lg:px-16">
          <div className="w-full max-w-md">

            {/* ── Waiting: detecting recovery session ── */}
            {pageState === 'waiting' && (
              <div className="text-center">
                <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center mx-auto mb-5">
                  <div className="h-7 w-7 animate-spin rounded-full border-3 border-[#0055A4] border-t-transparent" />
                </div>
                <h1 className="text-2xl font-bold text-[#1A1A1A] mb-2">Vérification du lien…</h1>
                <p className="text-[#1A1A1A]/60 text-sm">Merci de patienter quelques secondes.</p>
              </div>
            )}

            {/* ── Invalid: no token found ── */}
            {pageState === 'invalid' && (
              <div className="text-center">
                <div className="w-16 h-16 rounded-2xl bg-red-50 flex items-center justify-center mx-auto mb-5">
                  <AlertCircle className="w-8 h-8 text-red-500" />
                </div>
                <h1 className="text-2xl font-bold text-[#1A1A1A] mb-2">Lien invalide ou expiré</h1>
                <p className="text-[#1A1A1A]/60 text-sm mb-6">
                  Ce lien de réinitialisation est invalide ou a expiré (durée de validité : 1 heure).<br />
                  Veuillez faire une nouvelle demande.
                </p>
                <Button
                  onClick={() => navigate('/auth')}
                  className="w-full h-12 rounded-xl bg-[#0055A4] hover:bg-[#1B6ED6] text-white font-bold text-base gap-2"
                >
                  Retourner à la connexion
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            )}

            {/* ── Success ── */}
            {pageState === 'success' && (
              <div className="text-center">
                <div className="w-16 h-16 rounded-2xl bg-emerald-50 flex items-center justify-center mx-auto mb-5">
                  <CheckCircle2 className="w-8 h-8 text-emerald-500" />
                </div>
                <h1 className="text-2xl font-bold text-[#1A1A1A] mb-2">Mot de passe mis à jour !</h1>
                <p className="text-[#1A1A1A]/60 text-sm">Vous allez être redirigé vers votre tableau de bord…</p>
              </div>
            )}

            {/* ── Ready: show form ── */}
            {pageState === 'ready' && (
              <>
                <div className="mb-8">
                  <h1 className="text-2xl sm:text-3xl font-bold text-[#1A1A1A] tracking-tight">
                    Nouveau mot de passe
                  </h1>
                  <p className="text-[#1A1A1A]/60 mt-2">
                    Choisissez un mot de passe sécurisé pour votre compte.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* New password */}
                  <div className="space-y-2">
                    <Label htmlFor="new-password" className="text-sm font-medium text-[#1A1A1A]">
                      Nouveau mot de passe
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#1A1A1A]/30" />
                      <Input
                        id="new-password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Au moins 6 caractères"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
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

                    {/* Strength indicator */}
                    {password.length > 0 && (
                      <div className="flex items-center gap-2 mt-1">
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

                  {/* Confirm password */}
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password" className="text-sm font-medium text-[#1A1A1A]">
                      Confirmer le mot de passe
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#1A1A1A]/30" />
                      <Input
                        id="confirm-password"
                        type={showConfirm ? 'text' : 'password'}
                        placeholder="Répétez le mot de passe"
                        value={confirm}
                        onChange={e => setConfirm(e.target.value)}
                        required
                        className={`pl-10 pr-10 h-12 rounded-xl border-[#E6EAF0] bg-[#F5F7FA] hover:border-[#0055A4]/30 focus:bg-white transition-all ${
                          mismatch
                            ? 'border-red-400 focus:border-red-400 focus:shadow-[0_0_0_3px_rgba(239,68,68,0.1)]'
                            : 'focus:border-[#0055A4] focus:shadow-[0_0_0_3px_rgba(0,85,164,0.1)]'
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirm(!showConfirm)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#1A1A1A]/30 hover:text-[#1A1A1A]/60 transition-colors"
                      >
                        {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {mismatch && (
                      <p className="text-xs text-red-500 font-medium flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        Les mots de passe ne correspondent pas
                      </p>
                    )}
                    {!mismatch && confirm.length > 0 && password === confirm && (
                      <p className="text-xs text-emerald-600 font-medium flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        Les mots de passe correspondent
                      </p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    disabled={loading || mismatch || password.length < 6}
                    className="w-full h-12 rounded-xl bg-[#0055A4] hover:bg-[#1B6ED6] text-white font-bold text-base gap-2 transition-all hover:scale-[1.01] active:scale-[0.99] mt-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                  >
                    {loading ? (
                      <span className="animate-pulse">Mise à jour…</span>
                    ) : (
                      <>
                        Enregistrer le nouveau mot de passe
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </Button>
                </form>

                <p className="text-center text-sm text-[#1A1A1A]/50 mt-6">
                  <button
                    onClick={() => navigate('/auth')}
                    className="font-semibold text-[#0055A4] hover:underline underline-offset-2"
                  >
                    ← Retour à la connexion
                  </button>
                </p>
              </>
            )}
          </div>
        </div>

        {/* Mobile footer */}
        <div className="lg:hidden border-t border-[#E6EAF0] p-4 flex items-center justify-center gap-4 text-xs text-[#1A1A1A]/40">
          <span className="flex items-center gap-1"><Shield className="w-3 h-3" /> Données sécurisées</span>
          <span>•</span>
          <span>+7 000 questions</span>
          <span>•</span>
          <span>Conforme 2026</span>
        </div>
      </div>

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
      `}</style>
    </div>
  );
}
