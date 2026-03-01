import { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
}

export default function ParticleMesh() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -1000, y: -1000 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    const particles: Particle[] = [];
    const rect = canvas.getBoundingClientRect();
    let cachedW = rect.width;
    let cachedH = rect.height;
    const COUNT = 70;
    const CONNECT_DIST = 120;
    const MOUSE_RADIUS = 180;
    let needsResize = true;

    const applySize = () => {
      const dpr = devicePixelRatio || 1;
      canvas.width = cachedW * dpr;
      canvas.height = cachedH * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      needsResize = false;
    };
    applySize();

    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const cr = entry.contentRect;
        cachedW = cr.width;
        cachedH = cr.height;
        needsResize = true;
      }
    });
    ro.observe(canvas);

    const FLAG_COLORS = ['#0055A4', '#FFFFFF', '#EF4135']; // Blue, White, Red

    for (let i = 0; i < COUNT; i++) {
      particles.push({
        x: Math.random() * cachedW,
        y: Math.random() * cachedH,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        size: Math.random() * 1.5 + 0.5,
        color: FLAG_COLORS[Math.floor(Math.random() * FLAG_COLORS.length)]
      });
    }

    const handleMouse = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };
    canvas.addEventListener('mousemove', handleMouse);

    const draw = () => {
      if (needsResize) applySize();
      const w = cachedW;
      const h = cachedH;
      ctx.clearRect(0, 0, w, h);

      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;
      }

      // Lines 
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < CONNECT_DIST) {
            const alpha = (1 - dist / CONNECT_DIST) * 0.2;

            // Generate a subtle gradient between the two connected particles
            const grad = ctx.createLinearGradient(particles[i].x, particles[i].y, particles[j].x, particles[j].y);
            const rgbPrimary = hexToRgb(particles[i].color);
            const rgbSecondary = hexToRgb(particles[j].color);
            grad.addColorStop(0, `rgba(${rgbPrimary}, ${alpha})`);
            grad.addColorStop(1, `rgba(${rgbSecondary}, ${alpha})`);

            ctx.strokeStyle = grad;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      // Dots + mouse glow
      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;
      for (const p of particles) {
        const mdx = p.x - mx;
        const mdy = p.y - my;
        const mDist = Math.sqrt(mdx * mdx + mdy * mdy);
        const brightness = mDist < MOUSE_RADIUS ? 1 : 0.6;
        const rgbColor = hexToRgb(p.color);

        ctx.fillStyle = `rgba(${rgbColor}, ${brightness})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * (mDist < MOUSE_RADIUS ? 1.8 : 1.2), 0, Math.PI * 2);
        ctx.fill();

        // Extra glow lines to mouse
        if (mDist < MOUSE_RADIUS) {
          const alpha = (1 - mDist / MOUSE_RADIUS) * 0.25;
          ctx.strokeStyle = `rgba(${rgbColor}, ${alpha})`;
          ctx.lineWidth = 0.5;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(mx, my);
          ctx.stroke();
        }
      }

      animId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animId);
      ro.disconnect();
      canvas.removeEventListener('mousemove', handleMouse);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 h-full w-full opacity-80"
      style={{ pointerEvents: 'auto' }}
    />
  );
}

// Helper to convert hex to rgb string for rgba interpolation
function hexToRgb(hex: string) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ?
    `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`
    : '255, 255, 255';
}
