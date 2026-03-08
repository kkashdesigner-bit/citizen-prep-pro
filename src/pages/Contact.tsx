import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Mail, Send, MessageSquare, AlertCircle } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SEOHead from '@/components/SEOHead';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export default function Contact() {
    const { t } = useLanguage();
    const { user } = useAuth();

    const [formData, setFormData] = useState({
        name: '',
        email: user?.email || '',
        subject: '',
        message: ''
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.name || !formData.email || !formData.message) {
            toast.error('Veuillez remplir tous les champs obligatoires.');
            return;
        }

        setIsSubmitting(true);

        try {
            // Call the Supabase Edge Function to send the email
            const { data, error } = await supabase.functions.invoke('send-email', {
                body: {
                    type: 'contact',
                    data: {
                        name: formData.name,
                        email: formData.email,
                        subject: formData.subject || 'Nouveau message de contact',
                        message: formData.message,
                        userId: user?.id
                    }
                }
            });

            if (error) throw error;

            toast.success('Votre message a bien été envoyé ! Nous vous répondrons dans les plus brefs délais.');

            // Reset form
            setFormData({
                name: '',
                email: user?.email || '',
                subject: '',
                message: ''
            });

        } catch (error) {
            console.error('Error sending message:', error);
            toast.error('Une erreur est survenue lors de l\'envoi du message. Veuillez réessayer plus tard.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <SEOHead
                path="/contact"
                titleKey="Contact — GoCivique"
                descriptionKey="Contactez l'équipe GoCivique pour toute question, remarque ou demande d'assistance concernant votre préparation à l'évaluation civique."
            />

            <Header />

            <main className="flex-1 pt-24 pb-16">
                <div className="container px-4 max-w-4xl mx-auto">

                    <div className="text-center mb-12 animate-fade-in-up">
                        <h1 className="text-3xl md:text-5xl font-black font-serif text-slate-900 mb-4 tracking-tight">
                            Contactez-<span className="text-[#135bec]">nous</span>
                        </h1>
                        <p className="text-lg text-slate-500 max-w-2xl mx-auto">
                            Une question ? Un problème technique ? Une suggestion ? N'hésitez pas à nous écrire, notre équipe vous répondra dans les meilleurs délais.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8 md:gap-12">

                        {/* Contact Info Column */}
                        <div className="space-y-8 md:col-span-1 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
                            <div className="glass-card rounded-2xl p-6 border-l-4 border-[#135bec]">
                                <div className="flex items-center gap-4 mb-3">
                                    <div className="bg-[#135bec]/10 p-3 rounded-full">
                                        <Mail className="h-6 w-6 text-[#135bec]" />
                                    </div>
                                    <h3 className="font-bold text-lg text-slate-800">Email</h3>
                                </div>
                                <p className="text-slate-500 text-sm mb-1">Notre équipe de support</p>
                                <a href="mailto:gocivique@gmail.com" className="text-[#135bec] font-semibold hover:underline">
                                    gocivique@gmail.com
                                </a>
                            </div>

                            <div className="glass-card rounded-2xl p-6 border-l-4 border-emerald-500">
                                <div className="flex items-center gap-4 mb-3">
                                    <div className="bg-emerald-500/10 p-3 rounded-full">
                                        <MessageSquare className="h-6 w-6 text-emerald-600" />
                                    </div>
                                    <h3 className="font-bold text-lg text-slate-800">Support Client</h3>
                                </div>
                                <p className="text-slate-500 text-sm">
                                    Nous répondons généralement en moins de 24 heures les jours ouvrés.
                                </p>
                            </div>
                        </div>

                        {/* Contact Form Column */}
                        <div className="md:col-span-2 glass-card rounded-3xl p-6 md:p-8 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="name" className="text-slate-700 font-semibold">
                                            Nom complet <span className="text-red-500">*</span>
                                        </Label>
                                        <Input
                                            id="name"
                                            name="name"
                                            placeholder="Jean Dupont"
                                            value={formData.name}
                                            onChange={handleChange}
                                            className="border-slate-200 bg-white/50 focus-visible:ring-[#135bec]"
                                            required
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="email" className="text-slate-700 font-semibold">
                                            Adresse email <span className="text-red-500">*</span>
                                        </Label>
                                        <Input
                                            id="email"
                                            name="email"
                                            type="email"
                                            placeholder="jean.dupont@email.com"
                                            value={formData.email}
                                            onChange={handleChange}
                                            className="border-slate-200 bg-white/50 focus-visible:ring-[#135bec]"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="subject" className="text-slate-700 font-semibold">
                                        Sujet Optionnel
                                    </Label>
                                    <Input
                                        id="subject"
                                        name="subject"
                                        placeholder="Ex: Problème de facturation, Question sur une leçon..."
                                        value={formData.subject}
                                        onChange={handleChange}
                                        className="border-slate-200 bg-white/50 focus-visible:ring-[#135bec]"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="message" className="text-slate-700 font-semibold">
                                        Votre message <span className="text-red-500">*</span>
                                    </Label>
                                    <Textarea
                                        id="message"
                                        name="message"
                                        placeholder="Comment pouvons-nous vous aider ?"
                                        rows={6}
                                        value={formData.message}
                                        onChange={handleChange}
                                        className="border-slate-200 bg-white/50 focus-visible:ring-[#135bec] resize-none"
                                        required
                                    />
                                </div>

                                <Button
                                    type="submit"
                                    className="w-full bg-[#135bec] hover:bg-[#135bec]/90 text-white font-bold h-12 rounded-xl text-lg flex items-center gap-2"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? (
                                        'Envoi en cours...'
                                    ) : (
                                        <>
                                            Envoyer le message <Send className="h-5 w-5" />
                                        </>
                                    )}
                                </Button>

                                <p className="text-xs text-center text-slate-400 mt-4 flex items-center justify-center gap-1">
                                    <AlertCircle className="h-3 w-3" /> Vos données sont protégées et ne seront utilisées que pour vous répondre.
                                </p>
                            </form>
                        </div>

                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
