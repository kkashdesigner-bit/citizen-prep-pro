import { useRef, useEffect } from 'react';
import { motion, useInView, useSpring, useTransform } from 'framer-motion';

interface AnimatedNumberProps {
  value: number;
  suffix?: string;
  color: string;
}

function AnimatedNumber({ value, suffix = '', color }: AnimatedNumberProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const spring = useSpring(0, { damping: 50, stiffness: 200 });
  const display = useTransform(spring, (v) =>
    Math.round(v).toLocaleString('fr-FR') + suffix
  );

  useEffect(() => {
    if (inView) spring.set(value);
  }, [inView, value, spring]);

  return (
    <motion.span ref={ref} style={{ color }}>
      {display}
    </motion.span>
  );
}

const stats = [
  { label: 'questions officielles', color: '#0055A4', animated: true, value: 7034, suffix: '' },
  { label: 'mises en situation', color: '#0055A4', animated: true, value: 200, suffix: '+' },
  { label: 'cours structurés', color: '#EF4135', animated: true, value: 100, suffix: '' },
  { label: 'score pour réussir', color: '#EF4135', animated: false, display: '80%' },
] as const;

export default function StatsBar() {
  return (
    <section className="bg-white border-y border-slate-100 py-6">
      <div className="container max-w-4xl">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {stats.map((stat) => (
            <div key={stat.label} className="flex flex-col items-center">
              <p className="font-serif text-3xl sm:text-4xl font-black">
                {'animated' in stat && stat.animated ? (
                  <AnimatedNumber value={stat.value} suffix={stat.suffix} color={stat.color} />
                ) : (
                  <span style={{ color: stat.color }}>{stat.display}</span>
                )}
              </p>
              <p className="text-xs font-semibold text-slate-500 mt-1 uppercase tracking-wide">
                {stat.label}
              </p>
              <div
                className="mx-auto mt-2 w-8 h-0.5 rounded-full"
                style={{ background: stat.color }}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
