/**
 * Lightweight dependency-free confetti burst (GoCivique tricolore).
 * Spawns absolutely-positioned divs and animates them with WAAPI; cleans up after itself.
 */
const COLORS = ['#0055A4', '#FFFFFF', '#EF4135', '#F59E0B', '#059669'];

export function fireConfetti(durationMs = 2600, count = 120): void {
  if (typeof document === 'undefined') return;
  // Respect reduced-motion preferences
  if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;

  const container = document.createElement('div');
  container.setAttribute('aria-hidden', 'true');
  container.style.cssText =
    'position:fixed;inset:0;pointer-events:none;z-index:9999;overflow:hidden';
  document.body.appendChild(container);

  const w = window.innerWidth;

  for (let i = 0; i < count; i++) {
    const piece = document.createElement('div');
    const size = 6 + Math.random() * 7;
    const color = COLORS[i % COLORS.length];
    const startX = Math.random() * w;
    const drift = (Math.random() - 0.5) * 240;
    const rotate = (Math.random() - 0.5) * 720;
    const fall = window.innerHeight + 40;
    const delay = Math.random() * 350;
    const duration = 1600 + Math.random() * (durationMs - 1600);

    piece.style.cssText = `position:absolute;top:-20px;left:${startX}px;width:${size}px;height:${size * (0.6 + Math.random() * 0.8)}px;background:${color};border-radius:${Math.random() > 0.5 ? '50%' : '2px'};opacity:0.95`;
    container.appendChild(piece);

    piece.animate(
      [
        { transform: 'translate3d(0,0,0) rotate(0deg)', opacity: 1 },
        { transform: `translate3d(${drift}px,${fall}px,0) rotate(${rotate}deg)`, opacity: 0.7 },
      ],
      { duration, delay, easing: 'cubic-bezier(0.25, 0.8, 0.6, 1)', fill: 'forwards' },
    );
  }

  window.setTimeout(() => container.remove(), durationMs + 600);
}
