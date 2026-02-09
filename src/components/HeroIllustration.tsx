import { useEffect, useState, useMemo } from 'react';
import heroCelebration from '@/assets/hero-celebration.png';

interface HeroIllustrationProps {
  visible: boolean;
}

interface ConfettiPiece {
  id: number;
  x: number;
  delay: number;
  duration: number;
  size: number;
  color: string;
  rotation: number;
  drift: number;
}

const CONFETTI_COLORS = ['#002395', '#ED2939', '#FFFFFF']; // Blue, Red, White

function generateConfetti(count: number): ConfettiPiece[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    delay: Math.random() * 4,
    duration: 3 + Math.random() * 3,
    size: 4 + Math.random() * 6,
    color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
    rotation: Math.random() * 360,
    drift: (Math.random() - 0.5) * 40,
  }));
}

export default function HeroIllustration({ visible }: HeroIllustrationProps) {
  const [showConfetti, setShowConfetti] = useState(false);
  const confettiPieces = useMemo(() => generateConfetti(24), []);

  useEffect(() => {
    if (visible) {
      const timer = setTimeout(() => setShowConfetti(true), 600);
      return () => clearTimeout(timer);
    }
  }, [visible]);

  return (
    <div
      className={`relative transition-all duration-700 ${
        visible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-12'
      }`}
    >
      {/* Confetti layer (behind + in front) */}
      {showConfetti && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
          {confettiPieces.map((piece) => (
            <span
              key={piece.id}
              className="absolute animate-confetti-fall"
              style={{
                left: `${piece.x}%`,
                top: '-10%',
                width: piece.size,
                height: piece.size * 1.6,
                backgroundColor: piece.color,
                borderRadius: '1px',
                opacity: 0.85,
                animationDelay: `${piece.delay}s`,
                animationDuration: `${piece.duration}s`,
                // @ts-ignore -- CSS custom properties for the animation
                '--confetti-drift': `${piece.drift}px`,
                '--confetti-rotation': `${piece.rotation}deg`,
                zIndex: piece.id % 3 === 0 ? 10 : 0,
              } as React.CSSProperties}
            />
          ))}
        </div>
      )}

      {/* Celebrating man image with gentle sway */}
      <div className={`relative z-[5] ${visible ? 'animate-hero-sway' : ''}`}>
        <img
          src={heroCelebration}
          alt="Man celebrating French citizenship"
          className="w-56 h-auto md:w-72 lg:w-80 drop-shadow-lg"
          loading="lazy"
        />
      </div>
    </div>
  );
}
