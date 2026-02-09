import { useEffect, useState } from 'react';

interface PassProbabilityRingProps {
  probability: number; // 0-100
  size?: number;
  strokeWidth?: number;
  animated?: boolean;
  startAnimation?: boolean;
}

export default function PassProbabilityRing({
  probability,
  size = 120,
  strokeWidth = 10,
  animated = true,
  startAnimation = true,
}: PassProbabilityRingProps) {
  const [animatedValue, setAnimatedValue] = useState(0);
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (animatedValue / 100) * circumference;

  useEffect(() => {
    if (!startAnimation) {
      setAnimatedValue(0);
      return;
    }

    if (!animated) {
      setAnimatedValue(probability);
      return;
    }

    let frame: number;
    const duration = 1200;
    const start = performance.now();

    const animate = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setAnimatedValue(Math.round(eased * probability));
      if (progress < 1) frame = requestAnimationFrame(animate);
    };

    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [probability, animated, startAnimation]);

  const getColor = () => {
    if (probability >= 80) return 'hsl(var(--success))';
    if (probability >= 50) return 'hsl(var(--warning))';
    return 'hsl(var(--destructive))';
  };

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="hsl(var(--border))"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={getColor()}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-300"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-bold text-foreground">{animatedValue}%</span>
      </div>
    </div>
  );
}
