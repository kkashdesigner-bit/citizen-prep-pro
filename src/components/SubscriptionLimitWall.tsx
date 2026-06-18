import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/contexts/LanguageContext';
import { useSubscription } from '@/hooks/useSubscription';
import { startCheckout } from '@/lib/checkout';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Lock, Crown, Sparkles, Infinity, Check, ArrowRight, Loader2, LogOut, CheckCircle2 } from 'lucide-react';

const plans = {
  standard: {
    nameKey: 'standardName',
    icon: <Sparkles className="w-4 h-4" />,
    price: '6,99',
    period: '/mois',
    color: '#0055A4',
    badge: null as string | null,
    features: [
      'Examens illimités',
      'Parcours complet 1→100',
      'Mode entraînement',
      'Accès aux leçons',
      'Suivi de progression',
    ],
  },
  premium: {
    nameKey: 'premiumName',
    icon: <Crown className="w-4 h-4" />,
    price: '10,99',
    period: '/mois',
    color: '#D97706',
    badge: null as string | null,
    features: [
      'Tout dans Standard',
      'Entraînement ciblé par catégorie',
      'Traduction instantanée (5 langues)',
      'Accès libre entre les classes',
      'Guides vidéo',
    ],
  },
  lifetime: {
    nameKey: 'lifetimeName',
    icon: <Infinity className="w-4 h-4" />,
    price: '99',
    period: ' à vie',
    color: '#7C3AED',
    badgeKey: 'bestValue',
    features: [
      'Tout dans Premium',
      'Accès Premium complet à vie',
      'Accès anticipé aux nouvelles fonctionnalités',
      'Badge exclusif Membre Fondateur',
    ],
  },
} as const;

type PlanKey = keyof typeof plans;

const localizedText: Record<string, Record<string, string>> = {
  fr: {
    title: "Limite de questions atteinte",
    desc: "Vous avez répondu à 220 questions uniques. Le forfait gratuit est limité à 220 questions uniques pour vous permettre de tester l'application.",
    subDesc: "Abonnez-vous pour débloquer l'accès complet et continuer à préparer votre examen de naturalisation.",
    logout: "Se déconnecter",
    freeTierInfo: "Forfait Gratuit",
    limitReached: "Limite de 220 questions atteinte",
    processing: "Traitement en cours...",
    secPayment: "Paiement sécurisé Stripe",
    noCommitment: "Sans engagement · Annulation en 1 clic",
    oneTimePay: "Paiement unique · Accès à vie",
    standardName: "Standard",
    premiumName: "Premium",
    lifetimeName: "Accès à Vie",
    bestValue: "Meilleur rapport",
    trialPrefix: "Commencer l'essai gratuit — ",
    lifetimePrefix: "Obtenir l'accès à vie — ",
  },
  en: {
    title: "Question Limit Reached",
    desc: "You have answered 220 unique questions. The free tier is limited to 220 unique questions to let you test the application.",
    subDesc: "Subscribe to unlock full access and continue preparing for your citizenship exam.",
    logout: "Log Out",
    freeTierInfo: "Free Plan",
    limitReached: "Limit of 220 questions reached",
    processing: "Processing...",
    secPayment: "Secure Stripe Payment",
    noCommitment: "No commitment · 1-click cancel",
    oneTimePay: "One-time payment · Lifetime access",
    standardName: "Standard",
    premiumName: "Premium",
    lifetimeName: "Lifetime Access",
    bestValue: "Best Value",
    trialPrefix: "Start free trial — ",
    lifetimePrefix: "Get lifetime access — ",
  },
  ar: {
    title: "تم الوصول إلى حد الأسئلة",
    desc: "لقد أجبت على 220 سؤالاً فريدًا. الفئة المجانية محدودة بـ 220 سؤالاً فريدًا لتتيح لك تجربة التطبيق.",
    subDesc: "اشترك لفتح الوصول الكامل ومواصلة الاستعداد لامتحان المواطنة الخاص بك.",
    logout: "تسجيل الخروج",
    freeTierInfo: "الخطة المجانية",
    limitReached: "تم الوصول إلى حد 220 سؤالاً",
    processing: "جاري المعالجة...",
    secPayment: "دفع آمن عبر Stripe",
    noCommitment: "بدون التزام · إلغاء بنقرة واحدة",
    oneTimePay: "دفع لمرة واحدة · وصول مدى الحياة",
    standardName: "ستاندرد",
    premiumName: "بريميوم",
    lifetimeName: "وصول مدى الحياة",
    bestValue: "أفضل قيمة",
    trialPrefix: "ابدأ الفترة التجريبية المجانية — ",
    lifetimePrefix: "احصل على وصول مدى الحياة — ",
  },
  es: {
    title: "Límite de preguntas alcanzado",
    desc: "Has respondido a 220 preguntas únicas. El plan gratuito está limitado a 220 preguntas únicas para que puedas probar la aplicación.",
    subDesc: "Suscríbete para desbloquear el acceso completo y continuar preparando tu examen de ciudadanía.",
    logout: "Cerrar sesión",
    freeTierInfo: "Plan Gratuito",
    limitReached: "Límite de 220 preguntas alcanzado",
    processing: "Procesando...",
    secPayment: "Pago seguro con Stripe",
    noCommitment: "Sin compromiso · Cancelación en 1 clic",
    oneTimePay: "Pago único · Acceso de por vida",
    standardName: "Estándar",
    premiumName: "Premium",
    lifetimeName: "Acceso de por Vida",
    bestValue: "Mejor valor",
    trialPrefix: "Comenzar prueba gratuita — ",
    lifetimePrefix: "Obtener acceso de por vida — ",
  },
  pt: {
    title: "Limite de perguntas atingido",
    desc: "Você respondeu a 220 perguntas exclusivas. O plano gratuito é limitado a 220 perguntas exclusivas para você testar o aplicativo.",
    subDesc: "Assine para desbloquear o acesso total e continuar se preparando para o exame de cidadania.",
    logout: "Sair",
    freeTierInfo: "Plano Gratuito",
    limitReached: "Limite de 220 perguntas atingido",
    processing: "Processando...",
    secPayment: "Pagamento seguro Stripe",
    noCommitment: "Sem compromisso · Cancelamento em 1 clique",
    oneTimePay: "Pagamento único · Acesso vitalício",
    standardName: "Padrão",
    premiumName: "Premium",
    lifetimeName: "Acesso Vitalício",
    bestValue: "Melhor valor",
    trialPrefix: "Iniciar teste gratuito — ",
    lifetimePrefix: "Obter acesso vitalício — ",
  },
  zh: {
    title: "已达到问题上限",
    desc: "您已回答了 220 道独立问题。免费版限制为 220 道独立问题，以便您测试应用程序。",
    subDesc: "订阅以解锁完整访问权限，并继续准备您的入籍考试。",
    logout: "退出登录",
    freeTierInfo: "免费方案",
    limitReached: "已达到 220 道问题上限",
    processing: "处理中...",
    secPayment: "Stripe 安全支付",
    noCommitment: "无合约限制 · 一键取消",
    oneTimePay: "一次性支付 · 终身使用",
    standardName: "标准版",
    premiumName: "专业版",
    lifetimeName: "终身版",
    bestValue: "最划算",
    trialPrefix: "开始免费试用 — ",
    lifetimePrefix: "获得终身访问权限 — ",
  }
};

export default function SubscriptionLimitWall() {
  const { user, signOut } = useAuth();
  const { language } = useLanguage();
  const { uniqueQuestionsAnswered } = useSubscription();
  const [selectedPlan, setSelectedPlan] = useState<PlanKey>('lifetime');
  const [isProcessing, setIsProcessing] = useState(false);

  const currentLang = localizedText[language] ? language : 'fr';
  const text = localizedText[currentLang];
  const plan = plans[selectedPlan];

  const handleSubscribe = async () => {
    if (!user) return;
    setIsProcessing(true);
    try {
      await startCheckout(selectedPlan, { id: user.id, email: user.email });
    } catch (err) {
      toast.error("Erreur lors de l'activation de l'abonnement");
      console.error(err);
      setIsProcessing(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (err) {
      toast.error("Erreur lors de la déconnexion");
      console.error(err);
    }
  };

  const isRtl = language === 'ar';

  return (
    <div 
      className="fixed inset-0 z-[9999] bg-slate-950 flex flex-col items-center justify-center p-4 md:p-6 text-slate-100 font-sans overflow-y-auto animate-fade-in"
      dir={isRtl ? 'rtl' : 'ltr'}
    >
      {/* Background meshes for French premium style */}
      <div className="absolute top-0 left-0 w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-blue-900/10 rounded-full blur-[100px] md:blur-[150px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-red-900/10 rounded-full blur-[100px] md:blur-[150px] pointer-events-none" />

      {/* Main Glass Panel */}
      <div className="w-full max-w-[520px] bg-slate-900/80 border border-slate-800 rounded-[2rem] shadow-2xl overflow-hidden backdrop-blur-xl relative my-auto">
        
        {/* French Tricolore Header */}
        <div className="relative bg-gradient-to-br from-[#0055A4] via-[#1B6ED6] to-[#7C3AED] px-6 py-8 text-center overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1.5 flex">
            <div className="w-1/3 bg-[#0055A4]" />
            <div className="w-1/3 bg-white" />
            <div className="w-1/3 bg-[#EF4135]" />
          </div>

          <div className="mx-auto mb-3.5 w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/20 shadow-inner">
            <Lock className="w-6 h-6 text-white animate-pulse" />
          </div>

          <h2 className="text-xl md:text-2xl font-black tracking-tight text-white mb-2">
            {text.title}
          </h2>
          <p className="text-white/80 text-xs md:text-sm font-medium max-w-sm mx-auto">
            {text.subDesc}
          </p>
        </div>

        {/* Content Body */}
        <div className="p-6 md:p-8">

          {/* Progress Bar Gating Info */}
          <div className="bg-slate-950/50 border border-slate-800/80 rounded-2xl p-4 mb-6">
            <div className="flex justify-between items-center mb-2 font-display">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                {text.freeTierInfo}
              </span>
              <span className="text-xs font-bold text-red-400">
                {uniqueQuestionsAnswered} / 220
              </span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-red-500 to-red-600 h-full rounded-full transition-all duration-500" 
                style={{ width: `${Math.min((uniqueQuestionsAnswered / 220) * 100, 100)}%` }}
              />
            </div>
            <p className="text-[11px] text-slate-400 mt-2.5 leading-relaxed">
              {text.desc}
            </p>
          </div>

          {/* Plan Toggle Selector */}
          <div className="flex gap-2 p-1 bg-slate-950/80 border border-slate-800/60 rounded-xl mb-6">
            {(Object.keys(plans) as PlanKey[]).map((id) => {
              const p = plans[id];
              const isActive = selectedPlan === id;
              const badgeLabel = p.badgeKey ? text[p.badgeKey] : null;

              return (
                <button
                  key={id}
                  onClick={() => setSelectedPlan(id)}
                  className={`
                    relative flex-1 flex flex-col items-center justify-center py-2.5 rounded-lg text-xs font-bold transition-all duration-200 cursor-pointer
                    ${isActive ? 'bg-slate-800 text-white shadow-lg border border-slate-700/50' : 'text-slate-400 hover:text-slate-300'}
                  `}
                >
                  {badgeLabel && (
                    <span className="absolute -top-2 bg-violet-600 text-white text-[8px] font-black px-1.5 py-0.5 rounded-full uppercase tracking-wide border border-violet-500">
                      {badgeLabel}
                    </span>
                  )}
                  <span className="flex items-center gap-1">
                    <span className={isActive ? 'text-white' : 'opacity-60'}>{p.icon}</span>
                    {text[p.nameKey]}
                  </span>
                  <span className="text-[10px] opacity-70 mt-0.5">
                    {p.price}€{p.period}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Feature Lists */}
          <div className="space-y-3 mb-6 bg-slate-900/40 p-4 border border-slate-800/40 rounded-2xl">
            {plan.features.map((feat, i) => (
              <div key={i} className="flex items-start gap-3">
                <div 
                  className="flex-shrink-0 w-4.5 h-4.5 rounded-full flex items-center justify-center mt-0.5"
                  style={{ backgroundColor: `${plan.color}25` }}
                >
                  <Check className="w-3 h-3" style={{ color: plan.color }} />
                </div>
                <span className="text-xs text-slate-300 leading-snug">{feat}</span>
              </div>
            ))}
          </div>

          {/* Trust Guarantees */}
          <div className="flex items-center gap-3 rounded-xl bg-emerald-950/20 border border-emerald-900/30 px-4 py-3 mb-6">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-emerald-900/30 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            </div>
            <p className="text-[11px] text-emerald-300/95 leading-normal">
              {selectedPlan === 'lifetime' ? (
                <><strong>{text.oneTimePay}</strong>. Aucun frais récurrent — jamais.</>
              ) : (
                <><strong>{text.noCommitment}</strong>. {text.trialPrefix} {plan.price}€{plan.period}.</>
              )}
            </p>
          </div>

          {/* Subscription Action Button */}
          <Button
            disabled={isProcessing}
            onClick={handleSubscribe}
            className="w-full text-white rounded-xl font-bold text-sm h-12 shadow-xl hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer"
            style={{
              background: selectedPlan === 'lifetime'
                ? 'linear-gradient(135deg, #7C3AED, #4F46E5)'
                : `linear-gradient(135deg, ${plan.color}, #3a7cc7)`,
            }}
          >
            {isProcessing ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : selectedPlan === 'lifetime' ? (
              <>
                <Infinity className="w-4 h-4 mr-2" />
                {text.lifetimePrefix} {plan.price}€
                <ArrowRight className="w-4 h-4 ml-2" />
              </>
            ) : (
              <>
                {text.trialPrefix} {plan.price}€{plan.period}
                <ArrowRight className="w-4 h-4 ml-2" />
              </>
            )}
          </Button>

          {/* Divider */}
          <div className="flex items-center my-5">
            <div className="flex-grow border-t border-slate-800" />
            <span className="px-3 text-[10px] text-slate-500 uppercase tracking-widest font-semibold">Stripe</span>
            <div className="flex-grow border-t border-slate-800" />
          </div>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="w-full py-2.5 flex items-center justify-center gap-2 text-slate-400 hover:text-slate-200 text-xs font-bold transition-all border border-slate-800 hover:border-slate-700 bg-slate-950/20 hover:bg-slate-900 rounded-xl cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            {text.logout}
          </button>
        </div>
      </div>
    </div>
  );
}
