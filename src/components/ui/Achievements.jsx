import React, { useState, useEffect, useRef } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Award, Zap, BookOpen, Layers, BarChart, Code2 } from 'lucide-react';

const AnimatedCounter = ({ target, duration = 1500, suffix = "" }) => {
  const [count, setCount] = useState(0);
  const elementRef = useRef(null);
  const [hasStarted, setHasStarted] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) {
      setCount(target);
      return;
    }
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasStarted(true);
        }
      },
      { threshold: 0.1 }
    );
    
    if (elementRef.current) {
      observer.observe(elementRef.current);
    }
    
    return () => observer.disconnect();
  }, [target, prefersReducedMotion]);

  useEffect(() => {
    if (!hasStarted) return;
    
    let startTimestamp = null;
    const isFloat = target.toString().includes('.');
    const endVal = parseFloat(target);
    
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      
      // Easing function: easeOutQuad
      const easedProgress = progress * (2 - progress);
      const currentVal = easedProgress * endVal;
      
      if (isFloat) {
        setCount(currentVal.toFixed(1));
      } else {
        setCount(Math.floor(currentVal));
      }
      
      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        setCount(target);
      }
    };
    
    window.requestAnimationFrame(step);
  }, [hasStarted, target, duration]);

  return <span ref={elementRef}>{count}{suffix}</span>;
};

const Achievements = () => {
  const prefersReducedMotion = useReducedMotion();

  const achievementsData = [
    {
      title: "LeetCode DSA Solved",
      value: "210",
      suffix: "+",
      description: "Active competitive programmer with 210+ Data Structures & Algorithms problems solved across arrays, trees, graphs, and dynamic programming.",
      icon: Code2,
      color: "border-cyber-cyan/20 text-cyber-cyan bg-cyber-cyan/5 hover:border-cyber-cyan/50",
      glowColor: "rgba(0,240,255,0.1)",
      link: "https://leetcode.com/u/Nirbhayjakhar000",
      linkText: "View LeetCode Profile"
    },
    {
      title: "SarvHit CodeSphere Hackathon",
      value: "36",
      suffix: "h",
      description: "Collaborated in a 36-hour technical hackathon in a 5-member engineering team, building functional full-stack software.",
      icon: Zap,
      color: "border-cyber-magenta/20 text-cyber-magenta bg-cyber-magenta/5 hover:border-cyber-magenta/50",
      glowColor: "rgba(255,0,127,0.1)"
    },
    {
      title: "Academic CGPA",
      value: "9.6",
      suffix: "/10",
      description: "Top-tier academic performance in Kalvium's UG Program in CS (Software Product Engineering) at SGT University.",
      icon: BarChart,
      color: "border-cyber-yellow/20 text-cyber-yellow bg-cyber-yellow/5 hover:border-cyber-yellow/50",
      glowColor: "rgba(254,231,21,0.1)"
    },
    {
      title: "Production Software Systems",
      value: "3",
      suffix: " Systems",
      description: "Engineered full-stack platforms across Next.js/PostgreSQL, Redis Lua caching, and Gemini RAG pipelines.",
      icon: Layers,
      color: "border-cyber-green/20 text-cyber-green bg-cyber-green/5 hover:border-cyber-green/50",
      glowColor: "rgba(57,255,20,0.1)"
    },
    {
      title: "API Security & Rate Limiting",
      value: "100",
      suffix: "%",
      description: "Implemented atomic token-bucket rate limiting via Redis Lua scripting and Redis-backed session auth caching.",
      icon: Award,
      color: "border-cyber-cyan/20 text-cyber-cyan bg-cyber-cyan/5 hover:border-cyber-cyan/50",
      glowColor: "rgba(0,240,255,0.1)"
    },
    {
      title: "RAG & Vector Retrieval",
      value: "300",
      suffix: "w Chunks",
      description: "Document-grounded RAG with 50-word chunk overlaps, cosine similarity search, and real-time Web Streams.",
      icon: BookOpen,
      color: "border-purple-400/20 text-purple-400 bg-purple-500/5 hover:border-purple-400/50",
      glowColor: "rgba(168,85,247,0.1)"
    }
  ];

  const gridVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1
      }
    }
  };

  const cardVariants = {
    hidden: { 
      opacity: 0, 
      scale: prefersReducedMotion ? 1 : 0.95,
      y: prefersReducedMotion ? 0 : 20
    },
    visible: { 
      opacity: 1, 
      scale: 1,
      y: 0,
      transition: { type: 'spring', stiffness: 100, damping: 15 }
    }
  };

  return (
    <section id="achievements" className="relative w-full pt-10 md:pt-16 pb-0 bg-[#05050c] overflow-hidden">
      {/* background dense grid */}
      <div className="absolute inset-0 cyber-grid-dense opacity-20 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-black uppercase text-white tracking-widest">
            ACHIEVEMENTS & <span className="text-cyber-yellow glow-text-yellow">METRICS</span>
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-cyber-yellow to-transparent mx-auto mt-4"></div>
        </div>

        {/* Dashboard Grid */}
        <motion.div 
          variants={gridVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {achievementsData.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={idx}
                variants={cardVariants}
                className={`glass-panel p-6 rounded-lg border transition-all duration-300 relative overflow-hidden group ${stat.color}`}
                style={{
                  '--glow-hover': stat.glowColor
                }}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2.5 border border-current/30 rounded bg-black/40">
                    <Icon size={20} className="animate-pulse-slow" />
                  </div>
                </div>

                <div className="font-display text-3xl md:text-4xl font-black text-white mb-2 flex items-baseline tracking-wider">
                  <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                </div>

                <div className="text-xs font-display font-bold tracking-widest text-slate-200 uppercase mb-2">
                  {stat.title}
                </div>

                <p className="text-xs text-slate-300 font-sans leading-relaxed mb-3">
                  {stat.description}
                </p>

                {stat.link && (
                  <div className="pt-2 border-t border-slate-800/60">
                    <a
                      href={stat.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-1.5 text-xs font-mono font-bold text-cyber-cyan hover:underline"
                    >
                      <span>{stat.linkText || 'View Record'}</span>
                      <span>&rarr;</span>
                    </a>
                  </div>
                )}
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};

export default Achievements;
