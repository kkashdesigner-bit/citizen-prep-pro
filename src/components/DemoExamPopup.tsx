import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { BookOpen, Crown, ArrowRight, Sparkles, X } from 'lucide-react';

interface DemoExamPopupProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

const childVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring' as const, stiffness: 300, damping: 25 },
  },
};

const progressVariants = {
  hidden: { width: 0 },
  visible: {
    width: '4%', // 300/7500 = 4%
    transition: { duration: 1, ease: 'easeOut' as const, delay: 0.5 },
  },
};

export default function DemoExamPopup({ open, onOpenChange }: DemoExamPopupProps) {
  const navigate = useNavigate();

  const handleContinueDemo = () => {
    onOpenChange(false);
    navigate('/auth?redirect=/quiz?mode=demo');
  };

  const handleSubscribe = () => {
    onOpenChange(false);
    navigate('/auth');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="p-0 sm:max-w-[460px] bg-transparent border-0 shadow-none [&>button]:hidden">
        <AnimatePresence>
          {open && (
            <motion.div
              className="relative overflow-hidden rounded-3xl bg-white/90 backdrop-blur-2xl border border-white/40 shadow-[0_32px_64px_-12px_rgba(0,0,0,0.15),0_0_0_1px_rgba(0,85,164,0.08)]"
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            >
              {/* Gradient background overlay */}
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute -top-20 -right-20 w-48 h-48 rounded-full bg-[#0055A4]/8 blur-3xl" />
                <div className="absolute -bottom-20 -left-20 w-48 h-48 rounded-full bg-[#EF4135]/8 blur-3xl" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-amber-400/5 blur-3xl" />
              </div>

              {/* Close button */}
              <button
                onClick={() => onOpenChange(false)}
                className="absolute top-4 right-4 z-20 h-8 w-8 rounded-full bg-slate-100/80 hover:bg-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-all duration-200 cursor-pointer"
                aria-label="Fermer"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Content */}
              <motion.div
                className="relative z-10 p-7 sm:p-8"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {/* Badge */}
                <motion.div variants={childVariants} className="flex items-center gap-2 mb-5">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-[#0055A4]/10 to-[#0055A4]/5 border border-[#0055A4]/15 text-[#0055A4] text-xs font-semibold">
                    <BookOpen className="w-3 h-3" />
                    Version Démo
                  </span>
                </motion.div>

                {/* Title */}
                <motion.h2 variants={childVariants} className="text-2xl font-bold text-slate-900 mb-2">
                  Examen d'essai gratuit
                </motion.h2>

                {/* Description */}
                <motion.p variants={childVariants} className="text-sm text-slate-500 leading-relaxed mb-6">
                  Découvrez le format de l'examen civique avec un aperçu de nos questions.
                </motion.p>

                {/* Progress card */}
                <motion.div
                  variants={childVariants}
                  className="rounded-2xl bg-gradient-to-br from-slate-50 to-white border border-slate-100 p-5 mb-6"
                >
                  {/* Question count comparison */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl bg-[#0055A4]/10 flex items-center justify-center">
                        <BookOpen className="w-5 h-5 text-[#0055A4]" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900">300 questions</p>
                        <p className="text-xs text-slate-400">Incluses dans la démo</p>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-300" />
                    <div className="flex items-center gap-3">
                      <div>
                        <p className="text-sm font-bold text-[#0055A4] text-right">7 500 questions</p>
                        <p className="text-xs text-slate-400 text-right">Banque complète</p>
                      </div>
                      <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-[#0055A4] to-[#3a7cc7] flex items-center justify-center">
                        <Crown className="w-5 h-5 text-white" />
                      </div>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="relative h-2.5 rounded-full bg-slate-100 overflow-hidden">
                    <motion.div
                      className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-[#0055A4] to-[#3a7cc7]"
                      variants={progressVariants}
                      initial="hidden"
                      animate="visible"
                    />
                    {/* Full bar ghost */}
                    <div className="absolute inset-y-0 left-0 w-full rounded-full bg-gradient-to-r from-[#0055A4]/5 to-[#EF4135]/5" />
                  </div>
                  <div className="flex justify-between mt-2">
                    <span className="text-[10px] font-medium text-slate-400">4% de la banque</span>
                    <span className="text-[10px] font-medium text-[#0055A4]">100% avec abonnement</span>
                  </div>
                </motion.div>

                {/* What you unlock box */}
                <motion.div
                  variants={childVariants}
                  className="rounded-2xl bg-gradient-to-r from-[#0055A4]/5 via-transparent to-[#EF4135]/5 border border-[#0055A4]/10 p-4 mb-6"
                >
                  <div className="flex items-center gap-2 mb-2.5">
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    <p className="text-xs font-bold text-slate-700 uppercase tracking-wide">En vous abonnant</p>
                  </div>
                  <ul className="space-y-1.5">
                    {[
                      '7 500 questions officielles',
                      'Examens blancs illimités',
                      '100 classes avec parcours guidé',
                    ].map((feat) => (
                      <li key={feat} className="flex items-center gap-2 text-xs text-slate-600">
                        <div className="h-1 w-1 rounded-full bg-[#0055A4]" />
                        {feat}
                      </li>
                    ))}
                  </ul>
                </motion.div>

                {/* CTA buttons */}
                <motion.div variants={childVariants} className="flex flex-col gap-2.5">
                  <Button
                    onClick={handleSubscribe}
                    className="w-full rounded-xl font-bold text-sm py-5 text-white shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] bg-gradient-to-r from-[#0055A4] to-[#3a7cc7] hover:from-[#003d7a] hover:to-[#2f6aad] cursor-pointer"
                  >
                    <Crown className="w-4 h-4 mr-2" />
                    S'abonner — Débloquer tout
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleContinueDemo}
                    className="w-full rounded-xl font-medium text-sm py-5 border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-all duration-200 cursor-pointer"
                  >
                    Continuer avec la démo (300 questions)
                  </Button>
                </motion.div>

                {/* Footer */}
                <motion.p variants={childVariants} className="text-[10px] text-slate-400 text-center mt-4">
                  À partir de 6,99€/mois · Sans engagement · Annulation libre
                </motion.p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}
