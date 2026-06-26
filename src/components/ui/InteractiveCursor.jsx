import React, { useEffect, useRef } from 'react';
import { useReducedMotion } from 'framer-motion';

const InteractiveCursor = () => {
  const canvasRef = useRef(null);
  const dotRef = useRef(null);
  const glowRef = useRef(null);
  const prefersReducedMotion = useReducedMotion();

  // Position refs for path interpolation
  const lastMouse = useRef({ x: -100, y: -100 });
  const particles = useRef([]);

  // Palette: Cyan, Electric Blue, Purple, Pink, White
  const colors = [
    '#00f0ff', // cyan
    '#0055ff', // electric blue
    '#a855f7', // purple
    '#f43f5e', // pink
    '#ffffff'  // white
  ];

  useEffect(() => {
    // Falls back to native browser cursor completely if prefers-reduced-motion is active
    if (prefersReducedMotion) {
      return;
    }

    const canvas = canvasRef.current;
    const dot = dotRef.current;
    const glow = glowRef.current;
    if (!canvas || !dot || !glow) return;
    const ctx = canvas.getContext('2d');

    // DO NOT hide the default browser cursor (no cursor: none style applied)
    // This satisfies the "Do not hide the cursor under any circumstance" rule.

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    handleResize();
    window.addEventListener('resize', handleResize);

    const handleMouseMove = (e) => {
      const x = e.clientX;
      const y = e.clientY;

      // Direct style updates for instant, lag-free coordination (0ms delay)
      dot.style.transform = `translate3d(${x}px, ${y}px, 0) translate3d(-50%, -50%, 0)`;
      glow.style.transform = `translate3d(${x}px, ${y}px, 0) translate3d(-50%, -50%, 0)`;

      const dx = x - lastMouse.current.x;
      const dy = y - lastMouse.current.y;
      const distance = Math.hypot(dx, dy);

      // Generate sparkles close to cursor path while moving
      if (distance > 1.0) {
        const spawnCount = Math.max(1, Math.min(3, Math.floor(distance / 15)));
        const now = performance.now();

        for (let i = 0; i < spawnCount; i++) {
          if (particles.current.length >= 15) {
            particles.current.shift(); // Strictly cap active particles at 15
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

          particles.current.push({
            x: particleX,
            y: particleY,
            vx: (Math.random() - 0.5) * 0.4 + dx * 0.02,
            vy: (Math.random() - 0.5) * 0.4 + dy * 0.02 - 0.1,
            size: Math.random() * 1.5 + 0.8,
            color: colors[Math.floor(Math.random() * colors.length)],
            startTime: now,
            duration: 500 // Particles fade out smoothly within exactly 500ms
          });
        }
      }

      lastMouse.current = { x: x, y: y };
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Ticking loop for particle drawing
    let animId;
    const tick = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.globalCompositeOperation = 'lighter';
      
      const now = performance.now();

      for (let i = particles.current.length - 1; i >= 0; i--) {
        const p = particles.current[i];
        const elapsed = now - p.startTime;
        const alpha = 1 - elapsed / p.duration;

        // Remove dead particles
        if (elapsed >= p.duration || alpha <= 0) {
          particles.current.splice(i, 1);
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
  }, [prefersReducedMotion]);

  if (prefersReducedMotion) return null;

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
        className="fixed top-0 left-0 w-1.5 h-1.5 bg-[#00f0ff] rounded-full pointer-events-none"
        style={{
          zIndex: 999999,
          boxShadow: '0 0 6px #00f0ff'
        }}
      />

      {/* 3. Soft outer glow */}
      <div
        ref={glowRef}
        className="fixed top-0 left-0 w-8 h-8 rounded-full pointer-events-none border border-[#00f0ff]/30 bg-[#00f0ff]/5 shadow-[0_0_15px_rgba(0,240,255,0.15)]"
        style={{
          zIndex: 999998
        }}
      />
    </>
  );
};

export default InteractiveCursor;
