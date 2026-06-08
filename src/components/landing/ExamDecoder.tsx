import AnimatedSection from '@/components/AnimatedSection';
import { Badge } from '@/components/ui/badge';
import { CircleCheckBig } from 'lucide-react';

const checklist = [
  '28 QCM (choix multiples)',
  '12 Mises en situation',
  'Sur ordinateur, en centre agréé',
  'Résultat valable à vie',
];

const goals = [
  {
    badge: 'CSP',
    color: '#0055A4',
    title: 'Carte de Séjour Pluriannuelle',
    desc: 'Pour tout premier renouvellement dépassant 1 an.',
  },
  {
    badge: 'CR',
    color: '#4F46E5',
    title: 'Carte de Résident',
    desc: 'Pour une installation durable en France (10 ans).',
  },
  {
    badge: 'NAT',
    color: '#059669',
    title: 'Naturalisation',
    desc: 'Pour devenir citoyen français à part entière.',
  },
];

export default function ExamDecoder() {
  return (
    <section id="exam-decoder" className="bg-secondary/30 py-16 md:py-24">
      {/* Hidden SVG liquid glass filter */}
      <svg style={{ display: 'none' }} aria-hidden="true">
        <filter id="glass-distortion" x="0%" y="0%" width="100%" height="100%" filterUnits="objectBoundingBox">
          <feTurbulence type="fractalNoise" baseFrequency="0.001 0.005" numOctaves="1" seed="17" result="turbulence" />
          <feComponentTransfer in="turbulence" result="mapped">
            <feFuncR type="gamma" amplitude="1" exponent="10" offset="0.5" />
            <feFuncG type="gamma" amplitude="0" exponent="1" offset="0" />
            <feFuncB type="gamma" amplitude="0" exponent="1" offset="0.5" />
          </feComponentTransfer>
          <feGaussianBlur in="turbulence" stdDeviation="3" result="softMap" />
          <feDisplacementMap in="SourceGraphic" in2="softMap" scale="60" xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </svg>

      <div className="container">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="inline-block px-3 py-1 rounded-full bg-[#0055A4]/10 text-[#0055A4] text-xs font-bold uppercase tracking-widest mb-4">
            L'examen, en clair
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-black text-foreground mb-3">
            Ce que vous devez savoir
            <br />
            <span className="gradient-text">avant de commencer</span>
          </h2>
          <p className="text-slate-500 text-base max-w-md mx-auto">
            L'examen civique 2026 est structuré, prévisible et largement réussable avec une bonne préparation.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Left — Exam Format Card */}
          <AnimatedSection direction="left" delay={100}>
            <div className="glass-card p-6 sm:p-8 relative overflow-hidden">
              {/* Subtle glass shimmer layer */}
              <div
                className="absolute inset-0 rounded-2xl opacity-30 pointer-events-none"
                style={{ filter: 'url(#glass-distortion)' }}
              />
              <div className="relative z-10">
                {/* Title row */}
                <div className="flex items-center justify-between mb-5">
                  <span className="font-bold text-slate-900 text-lg">Examen civique 2026</span>
                  <Badge className="bg-[#0055A4]/10 text-[#0055A4] border-[#0055A4]/20 text-xs font-bold">
                    Conforme 2026
                  </Badge>
                </div>

                {/* Big stats row */}
                <div className="flex items-center gap-3 mb-6 flex-wrap">
                  {['40 questions', '45 min', '4 choix'].map((s) => (
                    <span
                      key={s}
                      className="px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700 text-sm font-bold"
                    >
                      {s}
                    </span>
                  ))}
                </div>

                {/* Progress bar */}
                <div className="mb-6">
                  <div className="flex justify-between text-xs font-semibold text-slate-500 mb-2">
                    <span>Score de réussite</span>
                    <span className="text-[#0055A4] font-bold">32/40 pour réussir</span>
                  </div>
                  <div className="h-3 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: '80%',
                        background: 'linear-gradient(90deg, #0055A4, #EF4135)',
                      }}
                    />
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1.5 text-right">80% de bonnes réponses</p>
                </div>

                {/* Checklist */}
                <ul className="space-y-3">
                  {checklist.map((item) => (
                    <li key={item} className="flex items-center gap-3 text-sm text-slate-700">
                      <CircleCheckBig className="h-4 w-4 text-[#059669] flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </AnimatedSection>

          {/* Right — Qui est concerné? */}
          <AnimatedSection direction="right" delay={250}>
            <div className="flex flex-col gap-4 h-full">
              <h3 className="font-bold text-slate-900 text-lg">Qui est concerné ?</h3>
              {goals.map((goal) => (
                <div
                  key={goal.badge}
                  className="rounded-xl border border-slate-200 p-4 flex items-start gap-4 bg-white/60 hover:bg-white/90 transition-colors shadow-sm"
                >
                  <div
                    className="mt-0.5 w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 text-white text-xs font-black shadow-sm"
                    style={{ background: goal.color }}
                  >
                    {goal.badge}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-slate-900 text-sm leading-snug">{goal.title}</p>
                    <p className="text-xs text-slate-500 mt-1">{goal.desc}</p>
                  </div>
                </div>
              ))}

              <div className="mt-auto pt-4 border-t border-slate-200">
                <p className="text-xs text-slate-400 leading-relaxed">
                  Obligatoire depuis le 1er janvier 2026 · Organisé par la CCI Paris Île-de-France
                </p>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
}
