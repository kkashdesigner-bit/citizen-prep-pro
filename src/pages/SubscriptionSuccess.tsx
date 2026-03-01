import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { CheckCircle, Route, Users, GraduationCap, PartyPopper, Star, ShieldCheck } from 'lucide-react';
import Logo from '@/components/Logo';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useLanguage } from '@/contexts/LanguageContext';

export default function SubscriptionSuccess() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { language } = useLanguage();
    const [isUpdating, setIsUpdating] = useState(true);

    useEffect(() => {
        const updateSubscription = async () => {
            if (!user) return;

            const pendingTier = localStorage.getItem('pending_subscription_tier');
            if (pendingTier) {
                try {
                    const { error } = await supabase
                        .from('profiles')
                        .update({
                            subscription_tier: pendingTier,
                            is_subscribed: true
                        })
                        .eq('id', user.id);

                    if (error) throw error;

                    toast.success(language === 'en' ? `Subscribed to ${pendingTier} successfully!` : `Abonnement ${pendingTier} activé avec succès !`);
                    localStorage.removeItem('pending_subscription_tier');
                } catch (err) {
                    console.error('Error updating subscription:', err);
                    toast.error(language === 'en' ? "Failed to activate subscription" : "Erreur lors de l'activation de l'abonnement");
                }
            }
            setIsUpdating(false);
        };

        updateSubscription();
    }, [user, language]);

    return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
            {/* Decorative header */}
            <div className="absolute top-6 left-6">
                <Logo />
            </div>

            <div className="w-full max-w-4xl mx-auto flex flex-col items-center text-center">
                {/* Floating Confetti / Icons */}
                <div className="relative w-48 h-48 mb-8">
                    <PartyPopper className="absolute -top-4 -right-12 h-8 w-8 text-destructive animate-bounce" style={{ animationDelay: '0.2s' }} />
                    <Star className="absolute top-12 -left-16 h-6 w-6 text-secondary animate-bounce" style={{ animationDelay: '0.4s' }} />
                    <div className="absolute -bottom-4 right-0 h-4 w-4 bg-primary/20 rounded-full animate-ping" />

                    <div className="w-48 h-48 rounded-full bg-secondary/20 p-2 relative overflow-visible flex items-center justify-center shadow-xl">
                        <img
                            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.email || 'Leo'}&backgroundColor=b6e3f4`}
                            alt="Avatar"
                            className="w-full h-full rounded-full object-cover"
                        />
                        <div className="absolute -bottom-2 -right-2 h-12 w-12 bg-white rounded-xl shadow-lg flex items-center justify-center border border-border">
                            <ShieldCheck className="h-6 w-6 text-[hsl(var(--success))]" />
                        </div>
                    </div>
                </div>

                <h1 className="text-4xl md:text-5xl font-bold font-serif text-foreground mb-4">
                    Bienvenue à bord !
                </h1>
                <p className="text-muted-foreground text-lg md:text-xl max-w-lg mb-10">
                    Votre voyage vers la citoyenneté française commence maintenant. Vous avez débloqué un accès illimité à tous les cours et examens.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
                    <Button
                        size="lg"
                        className="rounded-full px-8 py-6 text-base shadow-[0_8px_30px_hsl(var(--primary)/0.3)] hover:-translate-y-1 transition-all gap-2"
                        onClick={() => navigate('/learn')}
                    >
                        Start My First Lesson
                        <span className="font-sans">→</span>
                    </Button>
                    <Button variant="ghost" className="text-muted-foreground gap-2" onClick={() => toast.success("Receipt will be emailed to you shortly.")}>
                        <Route className="h-4 w-4" />
                        View Receipt
                    </Button>
                </div>

                {/* Feature Cards bottom row */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-3xl">
                    <div className="bg-card border border-border/40 rounded-2xl p-6 shadow-sm flex flex-col items-center">
                        <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                            <GraduationCap className="h-5 w-5 text-primary" />
                        </div>
                        <h3 className="font-bold text-foreground">Full Access</h3>
                        <p className="text-sm text-muted-foreground mt-2">Unlimited lessons & cultural modules</p>
                    </div>

                    <div className="bg-card border border-border/40 rounded-2xl p-6 shadow-sm flex flex-col items-center">
                        <div className="h-10 w-10 bg-secondary/10 rounded-full flex items-center justify-center mb-4">
                            <CheckCircle className="h-5 w-5 text-secondary" />
                        </div>
                        <h3 className="font-bold text-foreground">Mock Exams</h3>
                        <p className="text-sm text-muted-foreground mt-2">Real exam simulations included</p>
                    </div>

                    <div className="bg-card border border-border/40 rounded-2xl p-6 shadow-sm flex flex-col items-center">
                        <div className="h-10 w-10 bg-[hsl(var(--success))]/10 rounded-full flex items-center justify-center mb-4">
                            <Users className="h-5 w-5 text-[hsl(var(--success))]" />
                        </div>
                        <h3 className="font-bold text-foreground">Community</h3>
                        <p className="text-sm text-muted-foreground mt-2">Join 10k+ future citizens</p>
                    </div>
                </div>

            </div>
        </div>
    );
}
