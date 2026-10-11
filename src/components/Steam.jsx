import { useEffect, useRef } from 'react';

/** One soft puff, pre-rendered once and scaled per particle. */
function makePuff() {
  const size = 128;
  const c = document.createElement('canvas');
  c.width = c.height = size;
  const g = c.getContext('2d');
  const grad = g.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  grad.addColorStop(0, 'rgba(255,255,255,0.55)');
  grad.addColorStop(0.45, 'rgba(255,255,255,0.18)');
  grad.addColorStop(1, 'rgba(255,255,255,0)');
  g.fillStyle = grad;
  g.fillRect(0, 0, size, size);
  return c;
}

/**
 * Rising steam drawn on a canvas. `origin` is where wisps start, as fractions
 * of the canvas ({ x, y, spread }). Pauses when off-screen or the tab is hidden,
 * and renders nothing for people who prefer reduced motion.
 */
export default function Steam({ origin = { x: 0.5, y: 0.42, spread: 0.32 }, intensity = 1, className = '' }) {
  const ref = useRef(null);
  const originRef = useRef(origin);
  originRef.current = origin;

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    const ctx = canvas.getContext('2d');
    const puff = makePuff();
    const particles = [];
    let w = 0;
    let h = 0;
    let raf = 0;
    let running = false;
    let last = performance.now();
    let spawnClock = 0;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const spawn = () => {
      const o = originRef.current;
      particles.push({
        x: w * (o.x + (Math.random() - 0.5) * o.spread),
        y: h * o.y + Math.random() * 10,
        r: 14 + Math.random() * 14,
        grow: 0.022 + Math.random() * 0.02,
        vy: 0.028 + Math.random() * 0.022,
        sway: 10 + Math.random() * 18,
        phase: Math.random() * Math.PI * 2,
        life: 0,
        max: 2600 + Math.random() * 1800,
      });
    };

    const frame = (now) => {
      const dt = Math.min(48, now - last);
      last = now;
      spawnClock += dt;
      const every = 150 / intensity;
      while (spawnClock > every) {
        spawnClock -= every;
        if (particles.length < 48) spawn();
      }

      ctx.clearRect(0, 0, w, h);
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.life += dt;
        const t = p.life / p.max;
        if (t >= 1) {
          particles.splice(i, 1);
          continue;
        }
        p.y -= p.vy * dt;
        p.r += p.grow * dt;
        const x = p.x + Math.sin(p.phase + t * 3.2) * p.sway * t;
        // Fade in quickly, linger, fade out.
        ctx.globalAlpha = Math.sin(Math.PI * Math.min(1, t * 1.15)) * 0.32 * intensity;
        ctx.drawImage(puff, x - p.r, p.y - p.r, p.r * 2, p.r * 2);
      }
      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(frame);
    };

    const start = () => {
      if (running) return;
      running = true;
      last = performance.now();
      raf = requestAnimationFrame(frame);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    let onScreen = true;
    const io = new IntersectionObserver(([e]) => {
      onScreen = e.isIntersecting;
      if (onScreen && !document.hidden) start();
      else stop();
    });
    io.observe(canvas);
    const onVis = () => (document.hidden || !onScreen ? stop() : start());
    document.addEventListener('visibilitychange', onVis);

    return () => {
      stop();
      ro.disconnect();
      io.disconnect();
      document.removeEventListener('visibilitychange', onVis);
    };
  }, [intensity]);

  return <canvas ref={ref} className={`steam ${className}`} aria-hidden="true" />;
}
