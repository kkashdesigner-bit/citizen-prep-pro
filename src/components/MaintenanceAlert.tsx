import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, RotateCw, Hammer } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function MaintenanceAlert() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Show after a short delay so the page loads smoothly
    const timer = setTimeout(() => {
      const isDismissed = sessionStorage.getItem('maintenance_alert_dismissed');
      if (!isDismissed) {
        setIsVisible(true);
      }
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const handleDismiss = () => {
    sessionStorage.setItem('maintenance_alert_dismissed', 'true');
    setIsVisible(false);
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="fixed bottom-4 right-4 z-[9999] max-w-sm w-[calc(100vw-2rem)] rounded-2xl border border-amber-200/80 bg-white/90 p-4 shadow-xl backdrop-blur-md dark:border-amber-900/50 dark:bg-slate-900/90 text-slate-800 dark:text-slate-100 flex flex-col gap-3"
        >
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400">
              <Hammer className="h-5 w-5 animate-pulse" />
              <span className="font-bold text-sm">Maintenance en cours</span>
            </div>
            <button
              onClick={handleDismiss}
              className="rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Description */}
          <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-300">
            Nous effectuons des opérations de maintenance. Si certaines pages s'affichent vides ou si vous rencontrez un problème, veuillez rafraîchir la page.
          </p>

          {/* Actions */}
          <div className="flex items-center gap-2 justify-end pt-1">
            <button
              onClick={handleDismiss}
              className="text-xs font-semibold px-3 py-1.5 rounded-full text-slate-500 hover:text-slate-800 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-slate-800 transition-colors"
            >
              Fermer
            </button>
            <Button
              size="sm"
              onClick={handleRefresh}
              className="bg-amber-500 hover:bg-amber-600 text-white text-xs h-8 gap-1.5 rounded-full px-4"
            >
              <RotateCw className="h-3.5 w-3.5" />
              Rafraîchir
            </Button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
