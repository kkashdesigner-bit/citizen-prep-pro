import { useState } from 'react';
import { motion } from 'framer-motion';
import { Zap, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSubscription } from '@/hooks/useSubscription';
import FlashQuizModal from './FlashQuizModal';
import SubscriptionGate from '@/components/SubscriptionGate';

export default function FlashQuizCard() {
  const { isStandardOrAbove } = useSubscription();
  const [showQuiz, setShowQuiz] = useState(false);
  const [showGate, setShowGate] = useState(false);

  const handleLaunch = () => {
    if (!isStandardOrAbove) {
      setShowGate(true);
      return;
    }
    setShowQuiz(true);
  };

  return (
    <>
      <motion.div
        whileHover={{ y: -2 }}
        className="bg-gradient-to-br from-violet-50 via-purple-50 to-white rounded-2xl border border-violet-100 shadow-[0_2px_10px_rgba(0,0,0,0.03)] p-4 relative overflow-hidden"
      >
        <div className="absolute -top-4 -right-4 w-16 h-16 bg-violet-200/20 rounded-full blur-xl pointer-events-none" />

        <div className="flex items-center gap-2 mb-2">
          <div className="w-8 h-8 rounded-xl bg-violet-100 flex items-center justify-center">
            <Zap className="w-4 h-4 text-violet-600" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900">Quiz Flash</h4>
            <p className="text-[10px] text-slate-500 font-medium">5 questions en 2 min</p>
          </div>
        </div>

        <Button
          onClick={handleLaunch}
          className="w-full mt-2 bg-violet-600 hover:bg-violet-700 text-white font-bold rounded-xl h-9 text-sm shadow-[0_4px_12px_rgba(139,92,246,0.25)] transition-all gap-1.5"
        >
          {!isStandardOrAbove && <Lock className="w-3.5 h-3.5" />}
          Lancer
        </Button>
      </motion.div>

      <FlashQuizModal open={showQuiz} onOpenChange={setShowQuiz} />
      <SubscriptionGate open={showGate} onOpenChange={setShowGate} requiredTier="standard" featureLabel="Quiz Flash" />
    </>
  );
}
