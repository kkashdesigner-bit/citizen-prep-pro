import { useEffect, useState } from 'react';

interface HeroIllustrationProps {
  visible: boolean;
}

export default function HeroIllustration({ visible }: HeroIllustrationProps) {
  const [barsVisible, setBarsVisible] = useState(false);
  const [arrowVisible, setArrowVisible] = useState(false);

  useEffect(() => {
    if (visible) {
      const barsTimer = setTimeout(() => setBarsVisible(true), 300);
      const arrowTimer = setTimeout(() => setArrowVisible(true), 800);
      return () => {
        clearTimeout(barsTimer);
        clearTimeout(arrowTimer);
      };
    }
  }, [visible]);

  return (
    <div
      className={`transition-all duration-700 ${
        visible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-12'
      }`}
    >
      <div className={`${visible ? 'animate-float' : ''}`} style={{ animationDelay: '1.5s' }}>
        <svg
          viewBox="0 0 200 180"
          fill="none"
          className="w-48 h-44 md:w-64 md:h-56"
          aria-hidden="true"
        >
          {/* Book base */}
          <rect
            x="30"
            y="120"
            width="140"
            height="20"
            rx="4"
            fill="hsl(var(--primary-foreground))"
            opacity="0.2"
          />
          <rect
            x="35"
            y="115"
            width="130"
            height="20"
            rx="4"
            fill="hsl(var(--primary-foreground))"
            opacity="0.3"
          />
          <rect
            x="40"
            y="110"
            width="120"
            height="20"
            rx="4"
            fill="hsl(var(--primary-foreground))"
            opacity="0.15"
          />

          {/* Rising bars */}
          {[
            { x: 55, h: 50, delay: 0 },
            { x: 80, h: 70, delay: 0.15 },
            { x: 105, h: 45, delay: 0.3 },
            { x: 130, h: 85, delay: 0.45 },
          ].map((bar, i) => (
            <rect
              key={i}
              x={bar.x}
              y={110 - bar.h}
              width="18"
              height={bar.h}
              rx="3"
              fill="hsl(var(--primary-foreground))"
              opacity={barsVisible ? 0.6 : 0}
              style={{
                transformOrigin: `${bar.x + 9}px 110px`,
                transform: barsVisible ? 'scaleY(1)' : 'scaleY(0)',
                transition: `transform 0.6s ease-out ${bar.delay + 0.2}s, opacity 0.4s ease-out ${bar.delay + 0.2}s`,
              }}
            />
          ))}

          {/* Upward arrow */}
          <path
            d="M155 90 L165 20 L175 90"
            stroke="hsl(var(--primary-foreground))"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
            opacity={arrowVisible ? 0.8 : 0}
            style={{
              transition: 'opacity 0.5s ease-out',
            }}
          />
          <polygon
            points="165,12 158,28 172,28"
            fill="hsl(var(--primary-foreground))"
            opacity={arrowVisible ? 0.8 : 0}
            style={{
              transition: 'opacity 0.5s ease-out 0.2s',
            }}
          />
        </svg>
      </div>
    </div>
  );
}
