import AnimatedSection from '@/components/AnimatedSection';
import { Badge } from '@/components/ui/badge';

const trustStats = [
  { value: '+ 2 000', label: 'apprenants actifs' },
  { value: '85%', label: 'taux de réussite moyen' },
  { value: '7 jours', label: 'pour atteindre 80%' },
];

const testimonials = [
  {
    name: 'Mariam B.',
    origin: 'Maroc',
    goal: 'Naturalisation',
    score: '36/40',
    initial: 'M',
    color: '#0055A4',
    text: "En une semaine, j'étais prête. Les examens blancs m'ont donné confiance. J'ai obtenu 36/40 le jour J.",
  },
  {
    name: 'Yusuf K.',
    origin: 'Turquie',
    goal: 'Carte de Résident',
    score: '34/40',
    initial: 'Y',
    color: '#4F46E5',
    text: "Je ne comprenais pas le système français. Les cours m'ont tout expliqué clairement, dans ma langue.",
  },
  {
    name: 'Ana P.',
    origin: 'Brésil',
    goal: 'CSP',
    score: '34/40',
    initial: 'A',
    color: '#059669',
    text: "15 minutes par jour pendant 10 jours. Le score prédit indiquait 88% — j'ai eu 85%. Incroyable.",
  },
];

function getScoreColor(score: string): string {
  const num = parseInt(score);
  if (num >= 35) return '#059669';
  if (num >= 32) return '#0055A4';
  return '#D97706';
}

export default function SocialProof() {
  return (
    <section className="bg-secondary/30 py-16 md:py-24">
      <div className="container">
        {/* Header */}
        <AnimatedSection>
          <div className="text-center mb-10">
            <h2 className="font-serif text-3xl sm:text-4xl font-black text-foreground mb-3">
              Ils ont réussi leur examen
            </h2>
            <p className="text-slate-500 text-base">
              Des candidats comme vous, préparés en quelques jours.
            </p>
          </div>
        </AnimatedSection>

        {/* Trust numbers row */}
        <AnimatedSection delay={100}>
          <div className="flex flex-wrap items-center justify-center gap-8 mb-12">
            {trustStats.map((stat, i) => (
              <div key={stat.label} className="flex items-center gap-3">
                {/* Avatars only next to first stat */}
                {i === 0 && (
                  <div className="flex -space-x-2 mr-1">
                    {[1, 2, 3, 4].map((n) => (
                      <img
                        key={n}
                        src={`/examen-civique-avatar-${n}.webp`}
                        alt={`examen-civique apprenant ${n}`}
                        width={28}
                        height={28}
                        loading="lazy"
                        className="h-7 w-7 rounded-full border-2 border-white object-cover"
                      />
                    ))}
                  </div>
                )}
                <div className="text-center">
                  <p className="font-serif text-2xl font-black text-[#0055A4]">{stat.value}</p>
                  <p className="text-xs text-slate-500 font-medium">{stat.label}</p>
                </div>
                {i < trustStats.length - 1 && (
                  <div className="hidden sm:block w-px h-8 bg-slate-200 ml-8" />
                )}
              </div>
            ))}
          </div>
        </AnimatedSection>

        {/* Testimonials */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-5xl mx-auto">
          {testimonials.map((t, i) => {
            const scoreColor = getScoreColor(t.score);
            return (
              <AnimatedSection key={t.name} delay={i * 120}>
                <div className="glass-card p-5 flex flex-col gap-3 h-full">
                  {/* Header row */}
                  <div className="flex items-center gap-3">
                    <div
                      className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-black flex-shrink-0"
                      style={{ background: t.color }}
                    >
                      {t.initial}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-slate-900 text-sm">{t.name}</p>
                      <Badge
                        variant="outline"
                        className="text-[10px] font-semibold px-2 py-0 mt-0.5"
                        style={{ borderColor: t.color + '40', color: t.color }}
                      >
                        {t.origin}
                      </Badge>
                    </div>
                    <span
                      className="text-xs font-bold rounded-full px-2.5 py-1 flex-shrink-0"
                      style={{
                        background: scoreColor + '15',
                        color: scoreColor,
                      }}
                    >
                      {t.score}
                    </span>
                  </div>

                  {/* Goal */}
                  <p className="text-xs text-slate-400 font-medium">{t.goal}</p>

                  {/* Quote */}
                  <p className="text-sm italic text-slate-600 leading-relaxed flex-1">"{t.text}"</p>
                </div>
              </AnimatedSection>
            );
          })}
        </div>

        <p className="text-center text-xs text-slate-400 mt-6">
          *Résultats représentatifs. Les résultats individuels peuvent varier.
        </p>
      </div>
    </section>
  );
}
