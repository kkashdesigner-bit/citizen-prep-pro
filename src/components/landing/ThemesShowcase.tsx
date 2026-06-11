import { useState } from 'react';
import { motion } from 'framer-motion';
import AnimatedSection from '@/components/AnimatedSection';
import { Badge } from '@/components/ui/badge';
import { EXAM_THEMES } from '@/lib/landingData';
import { useLanguage } from '@/contexts/LanguageContext';

export default function ThemesShowcase() {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = EXAM_THEMES[activeIndex];
  const { t } = useLanguage();

  return (
    <section id="themes" className="bg-secondary/30 py-16 md:py-24">
      <div className="container">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="font-serif text-3xl sm:text-4xl font-black text-foreground mb-3">
            {t('landing.themes.title1')}
            <br />
            <span className="gradient-text">{t('landing.themes.title2')}</span>
          </h2>
          <p className="text-slate-500 text-base">{t('landing.themes.subtitle')}</p>
        </div>

        {/* Desktop layout */}
        <div className="hidden md:grid md:grid-cols-5 gap-6 max-w-5xl mx-auto">
          {/* Tab list */}
          <div className="md:col-span-2 flex flex-col gap-2">
            {EXAM_THEMES.map((theme, i) => (
              <button
                key={theme.id}
                onClick={() => setActiveIndex(i)}
                className={`relative text-left rounded-xl px-4 py-3.5 transition-all duration-200 ${
                  activeIndex === i
                    ? 'bg-white shadow-md border border-[#0055A4]/20'
                    : 'hover:bg-white/60 border border-transparent'
                }`}
              >
                {/* Active indicator — breathing pulse */}
                {activeIndex === i && (
                  <motion.div
                    className="absolute right-0 top-0 bottom-0 w-1 rounded-l-full"
                    style={{ background: theme.color }}
                    animate={{ scaleY: [1, 1.08, 1] }}
                    transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
                  />
                )}
                <div className="flex items-center gap-3">
                  <span className="text-xl">{theme.icon}</span>
                  <div>
                    <p className="text-sm font-bold text-slate-900 leading-snug">{t(`theme.${theme.id}.label`)}</p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {theme.examQuestions} {t('landing.themes.questionsAtExam')}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Content panel */}
          <div className="md:col-span-3">
            <AnimatedSection key={activeIndex} direction="right">
              <div className="glass-card p-6 h-full">
                <img
                  src={active.image}
                  alt={`${t(`theme.${active.id}.label`)} — GoCivique`}
                  className="w-full h-52 object-cover rounded-2xl border border-slate-200 mb-5"
                  loading="lazy"
                />
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-2xl">{active.icon}</span>
                  <h3 className="font-bold text-slate-900 text-lg leading-snug">{t(`theme.${active.id}.label`)}</h3>
                  <Badge
                    className="ml-auto text-xs font-bold border"
                    style={{
                      background: active.color + '15',
                      color: active.color,
                      borderColor: active.color + '30',
                    }}
                  >
                    {active.examQuestions} {t('landing.themes.questions')}
                  </Badge>
                </div>
                <p className="text-slate-600 text-sm leading-relaxed">{t(`theme.${active.id}.desc`)}</p>
                <p className="text-xs text-slate-400 mt-3">
                  {t('landing.themes.represents')}{' '}
                  <strong style={{ color: active.color }}>
                    {Math.round((active.examQuestions / 40) * 100)}%
                  </strong>{' '}
                  {t('landing.themes.ofExam')}
                </p>
              </div>
            </AnimatedSection>
          </div>
        </div>

        {/* Mobile fallback — stacked cards */}
        <div className="md:hidden flex flex-col gap-4 max-w-lg mx-auto">
          {EXAM_THEMES.map((theme) => (
            <AnimatedSection key={theme.id}>
              <div className="glass-card p-4 flex items-start gap-4">
                <img
                  src={theme.image}
                  alt={`${t(`theme.${theme.id}.label`)} — GoCivique`}
                  className="w-20 h-20 object-cover rounded-xl border border-slate-200 flex-shrink-0"
                  loading="lazy"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-lg">{theme.icon}</span>
                    <p className="font-bold text-slate-900 text-sm leading-snug truncate">
                      {t(`theme.${theme.id}.label`)}
                    </p>
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed">{t(`theme.${theme.id}.desc`)}</p>
                  <span
                    className="inline-block mt-2 px-2 py-0.5 rounded-full text-xs font-bold"
                    style={{ background: theme.color + '15', color: theme.color }}
                  >
                    {theme.examQuestions} {t('landing.themes.questions')}
                  </span>
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}
