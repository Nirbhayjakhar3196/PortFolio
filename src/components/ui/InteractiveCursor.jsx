import React, { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'framer-motion';
import gsap from 'gsap';

const InteractiveCursor = () => {
  const canvasRef = useRef(null);
  const dotRef = useRef(null);
  const glowRef = useRef(null);
  const prefersReducedMotion = useReducedMotion();

  // Position refs for sparkles path interpolation
  const lastMouse = useRef({ x: -100, y: -100 });
  
  // Interactive state
  const [cursorState, setCursorState] = useState('default'); // 'default', 'button', 'card', 'link', 'nav'
  const [clicked, setClicked] = useState(false);

  // Particles array
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
    // Falls back to native cursor completely on prefers-reduced-motion
    if (prefersReducedMotion) {
      return;
    }

    const canvas = canvasRef.current;
    const dot = dotRef.current;
    const glow = glowRef.current;
    if (!canvas || !dot || !glow) return;
    const ctx = canvas.getContext('2d');

    // Hide native browser cursor
    document.body.style.cursor = 'none';

    // Set initial centering offsets
    gsap.set(dot, { xPercent: -50, yPercent: -50 });
    gsap.set(glow, { xPercent: -50, yPercent: -50 });

    // GSAP quickTo setup for instant tracking (duration 0.01 for dot <= 10ms delay)
    const xToDot = gsap.quickTo(dot, "x", { duration: 0.01, ease: "none" });
    const yToDot = gsap.quickTo(dot, "y", { duration: 0.01, ease: "none" });

    // Slightly delayed tracker glow for secondary layer
    const xToGlow = gsap.quickTo(glow, "x", { duration: 0.1, ease: "power2.out" });
    const yToGlow = gsap.quickTo(glow, "y", { duration: 0.1, ease: "power2.out" });

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    handleResize();
    window.addEventListener('resize', handleResize);

    const handleMouseMove = (e) => {
      const x = e.clientX;
      const y = e.clientY;

      // Update GSAP cursor coordinates
      xToDot(x);
      yToDot(y);
      xToGlow(x);
      yToGlow(y);

      const dx = x - lastMouse.current.x;
      const dy = y - lastMouse.current.y;
      const distance = Math.hypot(dx, dy);

      // Generate sparkles close to cursor path
      if (distance > 1.0) {
        // Fast movement = more particles, slow movement = fewer particles
        const spawnCount = Math.max(1, Math.min(4, Math.floor(distance / 15)));
        const now = performance.now();
        
        for (let i = 0; i < spawnCount; i++) {
          if (particles.current.length >= 15) {
            particles.current.shift(); // Strictly cap particles at 15
          }

          // Interpolate coordinates along the path
          const t = spawnCount > 1 ? i / (spawnCount - 1) : 1;
          const pathX = lastMouse.current.x + dx * t;
          const pathY = lastMouse.current.y + dy * t;

          // Spread restricted within 25px radius of cursor path
          const angle = Math.random() * Math.PI * 2;
          const spread = Math.random() * 25; 
          const particleX = pathX + Math.cos(angle) * spread;
          const particleY = pathY + Math.sin(angle) * spread;

          const pType = Math.random() < 0.3 ? 'star' : (Math.random() < 0.65 ? 'dust' : 'fragment');

          particles.current.push({
            x: particleX,
            y: particleY,
            vx: (Math.random() - 0.5) * 0.5 + dx * 0.01,
            vy: (Math.random() - 0.5) * 0.5 + dy * 0.01 - 0.08,
            size: Math.random() * 1.8 + 1.0,
            color: colors[Math.floor(Math.random() * colors.length)],
            startTime: now,
            duration: 400 + Math.random() * 300, // 400ms to 700ms lifetime
            type: pType,
            rotation: Math.random() * Math.PI * 2,
            rotSpeed: (Math.random() - 0.5) * 0.08
          });
        }
      }

      lastMouse.current = { x: x, y: y };
    };

    const handleMouseDown = () => setClicked(true);
    const handleMouseUp = () => setClicked(false);

    // Global Hover Event Delegation
    const handleMouseOver = (e) => {
      const target = e.target.closest('a, button, [role="button"], .project-card, .clickable');
      if (target) {
        if (target.closest('nav') || target.classList.contains('hud-nav')) {
          setCursorState('nav');
        } else if (target.closest('.project-card') || target.classList.contains('project-card')) {
          setCursorState('card');
        } else if (target.tagName === 'A' || target.classList.contains('link-item')) {
          setCursorState('link');
        } else {
          setCursorState('button');
        }
      }
    };

    const handleMouseOut = (e) => {
      const target = e.target.closest('a, button, [role="button"], .project-card, .clickable');
      if (target) {
        setCursorState('default');
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('mouseout', handleMouseOut);

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
        p.vx *= 0.98;
        p.vy *= 0.98;
        p.rotation += p.rotSpeed;

        ctx.shadowBlur = 5;
        ctx.shadowColor = p.color;
        ctx.fillStyle = p.color;
        ctx.strokeStyle = p.color;
        ctx.globalAlpha = alpha;
        
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);

        const currentSize = p.size * alpha; // Fade and shrink smoothly

        if (p.type === 'star') {
          // Draw a tiny 4-pointed star
          ctx.beginPath();
          ctx.moveTo(0, -currentSize * 2.0);
          ctx.quadraticCurveTo(0, 0, currentSize * 2.0, 0);
          ctx.quadraticCurveTo(0, 0, 0, currentSize * 2.0);
          ctx.quadraticCurveTo(0, 0, -currentSize * 2.0, 0);
          ctx.quadraticCurveTo(0, 0, 0, -currentSize * 2.0);
          ctx.closePath();
          ctx.fill();
        } else if (p.type === 'fragment') {
          // Draw a small diamond/fragment
          ctx.beginPath();
          ctx.moveTo(0, -currentSize * 1.3);
          ctx.lineTo(currentSize * 0.9, 0);
          ctx.lineTo(0, currentSize * 1.3);
          ctx.lineTo(-currentSize * 0.9, 0);
          ctx.closePath();
          ctx.fill();
        } else {
          // energy dust
          ctx.beginPath();
          ctx.arc(0, 0, currentSize, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();
      }

      animId = requestAnimationFrame(tick);
    };

    animId = requestAnimationFrame(tick);

    return () => {
      document.body.style.cursor = 'auto'; // Restore cursor on exit
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseout', handleMouseOut);
      cancelAnimationFrame(animId);
    };
  }, [prefersReducedMotion]);

  if (prefersReducedMotion) return null;

  // Determine state-based classes for custom outer ring
  let ringClasses = 'w-6 h-6 border-cyber-cyan bg-transparent shadow-[0_0_8px_rgba(0,240,255,0.15)]';

  if (clicked) {
    ringClasses = 'w-4 h-4 border-cyber-magenta bg-cyber-magenta/25';
  } else {
    switch (cursorState) {
      case 'button':
        ringClasses = 'w-10 h-10 border-cyber-magenta bg-cyber-magenta/5 shadow-[0_0_12px_rgba(255,0,127,0.3)]';
        break;
      case 'card':
        ringClasses = 'w-12 h-12 border border-dashed border-cyber-yellow animate-[spin_5s_linear_infinite] shadow-[0_0_10px_rgba(254,231,21,0.2)]';
        break;
      case 'link':
        ringClasses = 'w-3 h-3 border-cyber-cyan bg-cyber-cyan/15 shadow-[0_0_8px_#00f0ff]';
        break;
      case 'nav':
        ringClasses = 'w-8 h-8 border-double border-2 border-cyber-cyan bg-cyber-cyan/10 shadow-[0_0_12px_rgba(0,240,255,0.35)]';
        break;
      default:
        break;
    }
  }

  return (
    <>
      {/* 1. Canvas particle overlay (z-index override) */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none"
        style={{ mixBlendMode: 'screen', zIndex: 999999 }}
      />

      {/* 2. Primary core dot (instant tracking) */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 w-1.5 h-1.5 bg-cyber-cyan rounded-full pointer-events-none"
        style={{
          zIndex: 999999,
          boxShadow: '0 0 6px #00f0ff'
        }}
      />

      {/* 3. Soft glow layer (smooth spring tracking) */}
      <div
        ref={glowRef}
        className={`fixed top-0 left-0 rounded-full pointer-events-none transition-all duration-150 ease-out border ${ringClasses}`}
        style={{
          transitionProperty: 'width, height, border-color, border-style, background-color, box-shadow',
          zIndex: 999999
        }}
      />
    </>
  );
};

export default InteractiveCursor;
