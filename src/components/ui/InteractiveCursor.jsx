import React, { useEffect, useRef, useMemo } from 'react';
import { useReducedMotion } from 'framer-motion';
import gsap from 'gsap';

const InteractiveCursor = () => {
  const canvasRef = useRef(null);
  const dotRef = useRef(null);
  const glowRef = useRef(null);
  const prefersReducedMotion = useReducedMotion();

  // Position refs for path interpolation
  const lastMouse = useRef({ x: -100, y: -100 });

  // Palette: Cyan, Electric Blue, Purple, Pink, White
  const colors = useMemo(() => [
    '#00f0ff', // cyan
    '#0055ff', // electric blue
    '#a855f7', // purple
    '#f43f5e', // pink
    '#ffffff'  // white
  ], []);

  // Pre-allocate particle pool to prevent GC overhead and memory allocations
  const particlePool = useMemo(() => {
    return Array.from({ length: 15 }, () => ({
      active: false,
      x: 0,
      y: 0,
      vx: 0,
      vy: 0,
      size: 0,
      color: '',
      startTime: 0,
      duration: 0
    }));
  }, []);

  // Detect mobile/touch-only environments
  const isTouchDevice = useMemo(() => {
    if (typeof window === 'undefined') return false;
    return ('ontouchstart' in window) || (navigator.maxTouchPoints > 0) || (window.innerWidth < 768);
  }, []);

  useEffect(() => {
    // Disable completely on touch devices or if user prefers reduced motion
    if (prefersReducedMotion || isTouchDevice) {
      return;
    }

    const canvas = canvasRef.current;
    const dot = dotRef.current;
    const glow = glowRef.current;
    if (!canvas || !dot || !glow) return;
    const ctx = canvas.getContext('2d', { alpha: true });

    // Setup GSAP quickTo for smooth spring-like trailing glow
    const xTo = gsap.quickTo(glow, "x", { duration: 0.18, ease: "power3.out" });
    const yTo = gsap.quickTo(glow, "y", { duration: 0.18, ease: "power3.out" });

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    handleResize();
    window.addEventListener('resize', handleResize, { passive: true });

    const handleMouseMove = (e) => {
      const x = e.clientX;
      const y = e.clientY;

      // Direct style update for dot (fastest, near-zero delay)
      dot.style.transform = `translate3d(${x}px, ${y}px, 0)`;

      // GSAP quickTo update for smooth trailing glow
      xTo(x);
      yTo(y);

      const dx = x - lastMouse.current.x;
      const dy = y - lastMouse.current.y;
      const distance = Math.hypot(dx, dy);

      // Generate sparkles close to cursor path while moving
      if (distance > 1.0) {
        const spawnCount = Math.max(1, Math.min(3, Math.floor(distance / 15)));
        const now = performance.now();

        for (let i = 0; i < spawnCount; i++) {
          // Find an inactive particle in the pool
          let p = particlePool.find(item => !item.active);
          if (!p) {
            // Re-use the oldest particle if the pool is full
            p = particlePool.reduce((oldest, current) => {
              return current.startTime < oldest.startTime ? current : oldest;
            }, particlePool[0]);
          }

          // Interpolate along the path
          const t = spawnCount > 1 ? i / (spawnCount - 1) : 1;
          const pathX = lastMouse.current.x + dx * t;
          const pathY = lastMouse.current.y + dy * t;

          // Spread offsets close to the path
          const angle = Math.random() * Math.PI * 2;
          const spread = Math.random() * 20; 
          const particleX = pathX + Math.cos(angle) * spread;
          const particleY = pathY + Math.sin(angle) * spread;

          p.active = true;
          p.x = particleX;
          p.y = particleY;
          p.vx = (Math.random() - 0.5) * 0.4 + dx * 0.02;
          p.vy = (Math.random() - 0.5) * 0.4 + dy * 0.02 - 0.1;
          p.size = Math.random() * 1.5 + 0.8;
          p.color = colors[Math.floor(Math.random() * colors.length)];
          p.startTime = now;
          p.duration = 500;
        }
      }

      lastMouse.current = { x: x, y: y };
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    // Ticking loop for particle drawing (paused when tab is inactive)
    let animId;
    const tick = () => {
      if (document.hidden) {
        animId = requestAnimationFrame(tick);
        return;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.globalCompositeOperation = 'lighter';
      
      const now = performance.now();

      for (let i = 0; i < particlePool.length; i++) {
        const p = particlePool[i];
        if (!p.active) continue;

        const elapsed = now - p.startTime;
        const alpha = 1 - elapsed / p.duration;

        // Deactivate particle if expired
        if (elapsed >= p.duration || alpha <= 0) {
          p.active = false;
          continue;
        }

        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.96;
        p.vy *= 0.96;

        ctx.shadowBlur = 4;
        ctx.shadowColor = p.color;
        ctx.fillStyle = p.color;
        ctx.globalAlpha = alpha;
        
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * alpha, 0, Math.PI * 2);
        ctx.fill();
      }

      animId = requestAnimationFrame(tick);
    };

    animId = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animId);
    };
  }, [prefersReducedMotion, isTouchDevice, colors, particlePool]);

  if (prefersReducedMotion || isTouchDevice) return null;

  return (
    <>
      {/* 1. Canvas particle overlay (z-index override) */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none"
        style={{ mixBlendMode: 'screen', zIndex: 999999 }}
      />

      {/* 2. Primary core cyan dot (instant tracking) */}
      <div
        ref={dotRef}
        className="fixed bg-[#00f0ff] rounded-full pointer-events-none"
        style={{
          zIndex: 999999,
          boxShadow: '0 0 6px #00f0ff',
          width: '6px',
          height: '6px',
          left: '-3px',
          top: '-3px',
          transform: 'translate3d(-100px, -100px, 0)'
        }}
      />

      {/* 3. Soft outer glow */}
      <div
        ref={glowRef}
        className="fixed rounded-full pointer-events-none border border-[#00f0ff]/30 bg-[#00f0ff]/5 shadow-[0_0_15px_rgba(0,240,255,0.15)]"
        style={{
          zIndex: 999998,
          width: '32px',
          height: '32px',
          left: '-16px',
          top: '-16px',
          transform: 'translate3d(-100px, -100px, 0)'
        }}
      />
    </>
  );
};

export default React.memo(InteractiveCursor);
