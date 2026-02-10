import { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
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
    let cachedW = canvas.offsetWidth;
    let cachedH = canvas.offsetHeight;
    const COUNT = 70;
    const CONNECT_DIST = 120;
    const MOUSE_RADIUS = 180;
    let needsResize = true;

    const applySize = () => {
      canvas.width = cachedW * devicePixelRatio;
      canvas.height = cachedH * devicePixelRatio;
      ctx.scale(devicePixelRatio, devicePixelRatio);
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

    for (let i = 0; i < COUNT; i++) {
      particles.push({
        x: Math.random() * cachedW,
        y: Math.random() * cachedH,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        size: Math.random() * 1.5 + 0.5,
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
            const alpha = (1 - dist / CONNECT_DIST) * 0.15;
            ctx.strokeStyle = `hsla(217, 91%, 60%, ${alpha})`;
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
        const brightness = mDist < MOUSE_RADIUS ? 1 : 0.4;

        ctx.fillStyle = `hsla(217, 91%, 60%, ${brightness * 0.7})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * (mDist < MOUSE_RADIUS ? 1.8 : 1), 0, Math.PI * 2);
        ctx.fill();

        // Extra glow lines to mouse
        if (mDist < MOUSE_RADIUS) {
          const alpha = (1 - mDist / MOUSE_RADIUS) * 0.2;
          ctx.strokeStyle = `hsla(217, 91%, 60%, ${alpha})`;
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
      className="absolute inset-0 h-full w-full"
      style={{ pointerEvents: 'auto' }}
    />
  );
}
