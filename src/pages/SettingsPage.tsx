import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useUserProfile, GOAL_LABELS, type GoalType } from '@/hooks/useUserProfile';
import { useSubscription } from '@/hooks/useSubscription';
import { supabase } from '@/integrations/supabase/client';
import LearnSidebar from '@/components/learn/LearnSidebar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    AlertDialog, AlertDialogAction, AlertDialogCancel,
    AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
    AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import {
    User, Shield, CreditCard, Loader2, Save, Crown, Sparkles, Eye, EyeOff,
    ExternalLink, XCircle, Check, ChevronRight
} from 'lucide-react';
import SubscriptionGate from '@/components/SubscriptionGate';

/* ─────────────── tier display config ─────────────── */
const TIER_CONFIG = {
    free: { label: 'Gratuit', color: 'slate', icon: null, price: 'Gratuit' },
    standard: { label: 'Standard', color: 'red', icon: Sparkles, price: '6,99€/mois' },
    premium: { label: 'Premium', color: 'amber', icon: Crown, price: '10,99€/mois' },
} as const;

const TIER_FEATURES: Record<string, string[]> = {
    free: ['3 classes gratuites', 'Mode Démo (20 questions)', 'Quiz limité'],
    standard: ['Parcours complet 1→100', 'Toutes les catégories', 'Examens blancs illimités'],
    premium: ['Tout dans Standard', 'Traduction instantanée', 'Catégories ciblées', 'Support prioritaire'],
};

export default function SettingsPage() {
    const navigate = useNavigate();
    const { user, displayName, avatarUrl } = useAuth();
    const { profile, loading: profileLoading, saveProfile } = useUserProfile();
    const { tier, isPremium, isStandardOrAbove, loading: subLoading } = useSubscription();

    /* ── Profile state ── */
    const [firstName, setFirstName] = useState('');
    const [goal, setGoal] = useState<GoalType | ''>('');
    const [profileDirty, setProfileDirty] = useState(false);
    const [savingProfile, setSavingProfile] = useState(false);
    const [profileInitialized, setProfileInitialized] = useState(false);

    // Initialize form state once profile loads
    if (profile && !profileInitialized) {
        setFirstName(profile.first_name || '');
        setGoal(profile.goal_type || '');
        setProfileInitialized(true);
    }

    /* ── Security state ── */
    const [currentPw, setCurrentPw] = useState('');
    const [newPw, setNewPw] = useState('');
    const [confirmPw, setConfirmPw] = useState('');
    const [showCurrent, setShowCurrent] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [savingPw, setSavingPw] = useState(false);
    const isGoogleUser = user?.app_metadata?.provider === 'google';

    /* ── Subscription gate state ── */
    const [showSubGate, setShowSubGate] = useState(false);

    /* ── Billing state ── */
    const [billingLoading, setBillingLoading] = useState(false);
    const [showCancelDialog, setShowCancelDialog] = useState(false);
    const [cancelling, setCancelling] = useState(false);

    /* ═══════ Handlers ═══════ */

    const handleSaveProfile = async () => {
        setSavingProfile(true);
        try {
            await saveProfile({
                first_name: firstName || null,
                goal_type: (goal as GoalType) || null,
            });
            setProfileDirty(false);
            toast.success('Profil mis à jour !');
        } catch {
            toast.error('Erreur lors de la sauvegarde');
        } finally {
            setSavingProfile(false);
        }
    };

    const handleChangePassword = async () => {
        if (!currentPw) {
            toast.error('Veuillez entrer votre mot de passe actuel');
            return;
        }
        if (newPw.length < 6) {
            toast.error('Le nouveau mot de passe doit contenir au moins 6 caractères');
            return;
        }
        if (newPw !== confirmPw) {
            toast.error('Les nouveaux mots de passe ne correspondent pas');
            return;
        }
        setSavingPw(true);
        try {
            // Verify current password first
            const { error: signInError } = await supabase.auth.signInWithPassword({
                email: user?.email || '',
                password: currentPw,
            });
            if (signInError) {
                toast.error('Mot de passe actuel incorrect');
                setSavingPw(false);
                return;
            }
            const { error } = await supabase.auth.updateUser({ password: newPw });
            if (error) throw error;
            toast.success('Mot de passe modifié avec succès !');
            setCurrentPw('');
            setNewPw('');
            setConfirmPw('');
        } catch (err: any) {
            toast.error(err.message || 'Erreur lors du changement de mot de passe');
        } finally {
            setSavingPw(false);
        }
    };

    const handleManageBilling = async () => {
        setBillingLoading(true);
        try {
            const { data: { session } } = await supabase.auth.getSession();
            const resp = await fetch(
                `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/stripe-portal`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${session?.access_token}`,
                    },
                    body: JSON.stringify({ action: 'portal', return_url: window.location.href }),
                }
            );
            const data = await resp.json();
            if (data.url) {
                window.location.href = data.url;
            } else {
                toast.error(data.error || 'Impossible d\'ouvrir le portail de facturation');
            }
        } catch {
            toast.error('Erreur de connexion au service de paiement');
        } finally {
            setBillingLoading(false);
        }
    };

    const handleCancelSubscription = async () => {
        setCancelling(true);
        try {
            const { data: { session } } = await supabase.auth.getSession();
            const resp = await fetch(
                `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/stripe-portal`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${session?.access_token}`,
                    },
                    body: JSON.stringify({ action: 'cancel' }),
                }
            );
            const data = await resp.json();
            if (data.success) {
                toast.success('Votre abonnement sera annulé à la fin de la période de facturation');
                setShowCancelDialog(false);
            } else {
                toast.error(data.error || 'Erreur lors de l\'annulation');
            }
        } catch {
            toast.error('Erreur de connexion');
        } finally {
            setCancelling(false);
        }
    };

    /* ── Redirect if not authenticated ── */
    if (!user && !profileLoading && !subLoading) {
        navigate('/auth');
        return null;
    }

    const userInitial = (profile?.first_name || displayName || user?.email || 'U').charAt(0).toUpperCase();
    const tierConf = TIER_CONFIG[tier] || TIER_CONFIG.free;
    const TierIcon = tierConf.icon;

    return (
        <div className="flex min-h-screen bg-[var(--dash-bg)] transition-colors duration-300 overflow-x-hidden">
            <LearnSidebar />

            <main className="flex-1 md:ml-[260px] pb-24 md:pb-8 flex justify-center overflow-x-hidden">
                <div className="w-full max-w-[800px] px-4 md:px-6 lg:px-8 py-6 md:py-8 overflow-x-hidden">

                    {/* Header */}
                    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                        className="mb-6"
                    >
                        <h1 className="text-2xl md:text-3xl font-bold text-[var(--dash-text)] tracking-tight">
                            Paramètres
                        </h1>
                        <p className="text-sm text-[var(--dash-text-muted)] mt-1">
                            Gérez votre profil, sécurité et abonnement
                        </p>
                    </motion.div>

                    {/* Tabs */}
                    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
                        <Tabs defaultValue="profile" className="w-full">
                            <TabsList className="w-full grid grid-cols-3 bg-[var(--dash-surface)] border border-[var(--dash-card-border)] rounded-xl h-11 p-1">
                                <TabsTrigger value="profile" className="rounded-lg text-xs sm:text-sm font-bold gap-1.5 data-[state=active]:bg-[var(--dash-card)] data-[state=active]:text-[#0055A4] data-[state=active]:shadow-sm">
                                    <User className="h-4 w-4 hidden sm:block" /> Profil
                                </TabsTrigger>
                                <TabsTrigger value="security" className="rounded-lg text-xs sm:text-sm font-bold gap-1.5 data-[state=active]:bg-[var(--dash-card)] data-[state=active]:text-[#0055A4] data-[state=active]:shadow-sm">
                                    <Shield className="h-4 w-4 hidden sm:block" /> Sécurité
                                </TabsTrigger>
                                <TabsTrigger value="billing" className="rounded-lg text-xs sm:text-sm font-bold gap-1.5 data-[state=active]:bg-[var(--dash-card)] data-[state=active]:text-[#0055A4] data-[state=active]:shadow-sm">
                                    <CreditCard className="h-4 w-4 hidden sm:block" /> Abonnement
                                </TabsTrigger>
                            </TabsList>

                            {/* ═══════════════ PROFILE TAB ═══════════════ */}
                            <TabsContent value="profile" className="mt-6 space-y-6">
                                {/* Avatar + Name Card */}
                                <div className="bg-[var(--dash-card)] rounded-2xl border border-[var(--dash-card-border)] p-5 md:p-6 shadow-[0_2px_10px_rgba(0,0,0,0.03)]">
                                    <h2 className="text-lg font-bold text-[var(--dash-text)] mb-5">Informations personnelles</h2>

                                    {/* Avatar */}
                                    <div className="flex items-center gap-4 mb-6">
                                        {avatarUrl || profile?.avatar_url ? (
                                            <img src={avatarUrl || profile?.avatar_url || ''} alt="Avatar"
                                                className="w-16 h-16 rounded-full border-4 border-white shadow-lg object-cover" />
                                        ) : (
                                            <div className="w-16 h-16 rounded-full border-4 border-white bg-[#0055A4] text-white flex items-center justify-center font-bold text-2xl shadow-lg">
                                                {userInitial}
                                            </div>
                                        )}
                                        <div>
                                            <p className="text-sm font-bold text-[var(--dash-text)]">{profile?.first_name || displayName || 'Utilisateur'}</p>
                                            <p className="text-xs text-[var(--dash-text-muted)]">{user?.email}</p>
                                        </div>
                                    </div>

                                    {/* Form Fields */}
                                    <div className="space-y-4">
                                        <div>
                                            <Label htmlFor="firstName" className="text-xs font-bold text-[var(--dash-text-muted)] uppercase tracking-wider">Prénom</Label>
                                            <Input id="firstName" value={firstName} onChange={(e) => { setFirstName(e.target.value); setProfileDirty(true); }}
                                                placeholder="Votre prénom"
                                                className="mt-1.5 bg-[var(--dash-surface)] border-[var(--dash-card-border)] text-[var(--dash-text)] focus:border-[#0055A4] focus:ring-[#0055A4]/20 rounded-xl h-11" />
                                        </div>

                                        <div>
                                            <Label htmlFor="email" className="text-xs font-bold text-[var(--dash-text-muted)] uppercase tracking-wider">Email</Label>
                                            <Input id="email" value={user?.email || ''} disabled
                                                className="mt-1.5 bg-[var(--dash-surface)] border-[var(--dash-card-border)] text-[var(--dash-text-muted)] rounded-xl h-11 cursor-not-allowed opacity-60" />
                                        </div>

                                        <div>
                                            <Label className="text-xs font-bold text-[var(--dash-text-muted)] uppercase tracking-wider">Objectif d'examen</Label>
                                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-1.5">
                                                {(Object.entries(GOAL_LABELS) as [GoalType, string][]).map(([key, label]) => (
                                                    <button key={key} onClick={() => { setGoal(key); setProfileDirty(true); }}
                                                        className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border text-sm font-medium transition-all ${goal === key
                                                            ? 'border-[#0055A4] bg-blue-500/10 text-[#0055A4]'
                                                            : 'border-[var(--dash-card-border)] bg-[var(--dash-surface)] text-[var(--dash-text-muted)] hover:border-[#0055A4]/40'
                                                            }`}
                                                    >
                                                        {goal === key && <Check className="h-4 w-4 text-[#0055A4] shrink-0" />}
                                                        <span className="truncate">{label}</span>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Save Button */}
                                    <Button disabled={!profileDirty || savingProfile} onClick={handleSaveProfile}
                                        className="mt-6 w-full sm:w-auto bg-[#0055A4] hover:bg-[#1B6ED6] text-white font-bold rounded-xl h-11 px-8 shadow-[0_4px_14px_rgba(0,85,164,0.25)] hover:-translate-y-0.5 transition-all"
                                    >
                                        {savingProfile ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
                                        Enregistrer
                                    </Button>
                                </div>
                            </TabsContent>

                            {/* ═══════════════ SECURITY TAB ═══════════════ */}
                            <TabsContent value="security" className="mt-6 space-y-6">
                                <div className="bg-[var(--dash-card)] rounded-2xl border border-[var(--dash-card-border)] p-5 md:p-6 shadow-[0_2px_10px_rgba(0,0,0,0.03)]">
                                    <h2 className="text-lg font-bold text-[var(--dash-text)] mb-2">Changer le mot de passe</h2>

                                    {isGoogleUser ? (
                                        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mt-4">
                                            <p className="text-sm text-blue-800 font-medium">
                                                🔒 Votre compte utilise la connexion Google. Le mot de passe est géré par Google.
                                            </p>
                                        </div>
                                    ) : (
                                        <div className="space-y-4 mt-4">

                                            <div>
                                                <Label htmlFor="currentPw" className="text-xs font-bold text-[var(--dash-text-muted)] uppercase tracking-wider">Mot de passe actuel</Label>
                                                <div className="relative mt-1.5">
                                                    <Input id="currentPw" type={showCurrent ? 'text' : 'password'} value={currentPw}
                                                        onChange={(e) => setCurrentPw(e.target.value)} placeholder="Votre mot de passe actuel"
                                                        className="bg-[var(--dash-surface)] border-[var(--dash-card-border)] text-[var(--dash-text)] focus:border-[#0055A4] focus:ring-[#0055A4]/20 rounded-xl h-11 pr-10" />
                                                    <button type="button" onClick={() => setShowCurrent(!showCurrent)}
                                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--dash-text-muted)] hover:text-[var(--dash-text)]">
                                                        {showCurrent ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                                    </button>
                                                </div>
                                            </div>

                                            <div>
                                                <Label htmlFor="newPw" className="text-xs font-bold text-[var(--dash-text-muted)] uppercase tracking-wider">Nouveau mot de passe</Label>
                                                <div className="relative mt-1.5">
                                                    <Input id="newPw" type={showNew ? 'text' : 'password'} value={newPw}
                                                        onChange={(e) => setNewPw(e.target.value)} placeholder="Min. 6 caractères"
                                                        className="bg-[var(--dash-surface)] border-[var(--dash-card-border)] text-[var(--dash-text)] focus:border-[#0055A4] focus:ring-[#0055A4]/20 rounded-xl h-11 pr-10" />
                                                    <button type="button" onClick={() => setShowNew(!showNew)}
                                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--dash-text-muted)] hover:text-[var(--dash-text)]">
                                                        {showNew ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                                    </button>
                                                </div>
                                            </div>

                                            <div>
                                                <Label htmlFor="confirmPw" className="text-xs font-bold text-[var(--dash-text-muted)] uppercase tracking-wider">Confirmer le nouveau mot de passe</Label>
                                                <div className="relative mt-1.5">
                                                    <Input id="confirmPw" type={showConfirm ? 'text' : 'password'} value={confirmPw}
                                                        onChange={(e) => setConfirmPw(e.target.value)} placeholder="Retapez le nouveau mot de passe"
                                                        className="bg-[var(--dash-surface)] border-[var(--dash-card-border)] text-[var(--dash-text)] focus:border-[#0055A4] focus:ring-[#0055A4]/20 rounded-xl h-11 pr-10" />
                                                    <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--dash-text-muted)] hover:text-[var(--dash-text)]">
                                                        {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                                    </button>
                                                </div>
                                                {confirmPw && confirmPw !== newPw && (
                                                    <p className="text-xs text-red-500 mt-1">Les mots de passe ne correspondent pas</p>
                                                )}
                                            </div>

                                            <Button disabled={!currentPw || !newPw || newPw !== confirmPw || savingPw} onClick={handleChangePassword}
                                                className="w-full sm:w-auto bg-[#0055A4] hover:bg-[#1B6ED6] text-white font-bold rounded-xl h-11 px-8 shadow-[0_4px_14px_rgba(0,85,164,0.25)] hover:-translate-y-0.5 transition-all"
                                            >
                                                {savingPw ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Shield className="h-4 w-4 mr-2" />}
                                                Modifier le mot de passe
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            </TabsContent>

                            {/* ═══════════════ BILLING TAB ═══════════════ */}
                            <TabsContent value="billing" className="mt-6 space-y-6">
                                {/* Current Plan Card */}
                                <div className="bg-[var(--dash-card)] rounded-2xl border border-[var(--dash-card-border)] p-5 md:p-6 shadow-[0_2px_10px_rgba(0,0,0,0.03)]">
                                    <h2 className="text-lg font-bold text-[var(--dash-text)] mb-5">Votre abonnement</h2>

                                    {/* Plan display */}
                                    <div className={`rounded-xl border-2 p-5 transition-colors ${tier === 'premium' ? 'border-amber-300 bg-amber-50/50' :
                                        tier === 'standard' ? 'border-blue-300 bg-blue-50/50' :
                                            'border-[#1764ac]/30 bg-[#1764ac]/5'
                                        }`}>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                {TierIcon && <TierIcon className={`h-6 w-6 ${tier === 'premium' ? 'text-amber-600' : 'text-blue-600'}`} />}
                                                <div>
                                                    <span className="text-lg font-bold text-[var(--dash-text)]">Forfait {tierConf.label}</span>
                                                    <p className="text-sm text-[var(--dash-text-muted)]">{tierConf.price}</p>
                                                </div>
                                            </div>
                                            <span className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full ${tier === 'premium' ? 'bg-amber-100 text-amber-700' :
                                                tier === 'standard' ? 'bg-blue-100 text-blue-700' :
                                                    'bg-[#1764ac]/10 text-[#1764ac]'
                                                }`}>Actif</span>
                                        </div>

                                        {/* Features */}
                                        <ul className="mt-4 space-y-2">
                                            {(TIER_FEATURES[tier] || TIER_FEATURES.free).map((f, i) => (
                                                <li key={i} className="flex items-center gap-2 text-sm text-[var(--dash-text)]">
                                                    <Check className="h-4 w-4 text-green-500 shrink-0" /> {f}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="mt-6 flex flex-col sm:flex-row gap-3">
                                        {!isStandardOrAbove ? (
                                            /* Free user → upgrade */
                                            <Button onClick={() => setShowSubGate(true)}
                                                className="flex-1 bg-gradient-to-r from-[#0055A4] to-[#1B6ED6] hover:from-[#1B6ED6] hover:to-[#0055A4] text-white font-bold rounded-xl h-11 shadow-[0_4px_14px_rgba(0,85,164,0.25)] transition-all gap-2"
                                            >
                                                <Crown className="h-4 w-4" /> Passer au Premium <ChevronRight className="h-4 w-4" />
                                            </Button>
                                        ) : (
                                            /* Paying user → manage + cancel */
                                            <>
                                                <Button onClick={handleManageBilling} disabled={billingLoading}
                                                    className="flex-1 bg-[#0055A4] hover:bg-[#1B6ED6] text-white font-bold rounded-xl h-11 shadow-[0_4px_14px_rgba(0,85,164,0.25)] transition-all gap-2"
                                                >
                                                    {billingLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ExternalLink className="h-4 w-4" />}
                                                    Gérer la facturation
                                                </Button>
                                                <Button onClick={() => setShowCancelDialog(true)} variant="outline"
                                                    className="flex-1 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 font-bold rounded-xl h-11 transition-all gap-2"
                                                >
                                                    <XCircle className="h-4 w-4" /> Annuler l'abonnement
                                                </Button>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </TabsContent>
                        </Tabs>
                    </motion.div>
                </div>
            </main>

            {/* Subscription upgrade gate */}
            <SubscriptionGate open={showSubGate} onOpenChange={setShowSubGate} requiredTier="standard" />

            {/* Cancel Subscription Confirmation Dialog */}
            <AlertDialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
                <AlertDialogContent className="bg-[var(--dash-card)] border-[var(--dash-card-border)] rounded-2xl max-w-md">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-[var(--dash-text)] text-lg">
                            Annuler votre abonnement ?
                        </AlertDialogTitle>
                        <AlertDialogDescription className="text-[var(--dash-text-muted)] text-sm space-y-2">
                            <p>En annulant, vous perdrez l'accès à :</p>
                            <ul className="list-disc pl-5 space-y-1">
                                <li>Le parcours complet 1→100</li>
                                <li>Les examens blancs illimités</li>
                                {isPremium && <li>La traduction instantanée</li>}
                                {isPremium && <li>Les catégories ciblées</li>}
                            </ul>
                            <p className="font-medium pt-2">
                                Votre accès sera maintenu jusqu'à la fin de votre période de facturation actuelle.
                            </p>
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="gap-2">
                        <AlertDialogCancel className="border-[var(--dash-card-border)] text-[var(--dash-text)] rounded-xl font-bold">
                            Garder mon abonnement
                        </AlertDialogCancel>
                        <AlertDialogAction onClick={handleCancelSubscription} disabled={cancelling}
                            className="bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold gap-2"
                        >
                            {cancelling && <Loader2 className="h-4 w-4 animate-spin" />}
                            Confirmer l'annulation
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
