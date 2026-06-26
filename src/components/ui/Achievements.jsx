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
      title: "LeetCode Solved",
      value: "100",
      suffix: "+",
      description: "Data Structures & Algorithms problem solving proficiency.",
      icon: Code2,
      color: "border-cyber-cyan/20 text-cyber-cyan bg-cyber-cyan/5 hover:border-cyber-cyan/50",
      glowColor: "rgba(0,240,255,0.1)"
    },
    {
      title: "Hackathon Endurance",
      value: "36",
      suffix: "h",
      description: "Collaborated, designed, and coded a working system in 36 hours.",
      icon: Zap,
      color: "border-cyber-magenta/20 text-cyber-magenta bg-cyber-magenta/5 hover:border-cyber-magenta/50",
      glowColor: "rgba(255,0,127,0.1)"
    },
    {
      title: "Academic Excellence",
      value: "9.6",
      suffix: "/10",
      description: "Maintained a top-tier CGPA in Computer Science B.Tech curriculum.",
      icon: BarChart,
      color: "border-cyber-yellow/20 text-cyber-yellow bg-cyber-yellow/5 hover:border-cyber-yellow/50",
      glowColor: "rgba(254,231,21,0.1)"
    },
    {
      title: "LeetCode consistency",
      value: "50",
      suffix: " Days",
      description: "Awarded LeetCode active coder streak badge for system practice.",
      icon: Award,
      color: "border-cyber-green/20 text-cyber-green bg-cyber-green/5 hover:border-cyber-green/50",
      glowColor: "rgba(57,255,20,0.1)"
    },
    {
      title: "Python Dojo Belts",
      value: "6",
      suffix: " Belts",
      description: "Achieved intermediate coding belts in platform dojos.",
      icon: BookOpen,
      color: "border-cyber-cyan/20 text-cyber-cyan bg-cyber-cyan/5 hover:border-cyber-cyan/50",
      glowColor: "rgba(0,240,255,0.1)"
    },
    {
      title: "Java Dojo Belts",
      value: "4",
      suffix: " Belts",
      description: "Acquired Java core object-oriented structures belts.",
      icon: Layers,
      color: "border-cyber-magenta/20 text-cyber-magenta bg-cyber-magenta/5 hover:border-cyber-magenta/50",
      glowColor: "rgba(255,0,127,0.1)"
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
          <div className="inline-flex items-center space-x-2 px-3 py-1 bg-cyber-yellow/10 border border-cyber-yellow/30 rounded text-[10px] tracking-[0.25em] font-display text-cyber-yellow font-bold uppercase mb-4">
            <span className="w-1.5 h-1.5 bg-cyber-yellow rounded-full animate-ping"></span>
            <span>SEC_BIOSTAT_READOUT</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-black uppercase text-white tracking-widest">
            BIOSTAT <span className="text-cyber-yellow glow-text-yellow">DASHBOARD</span>
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
                {/* Tech corner accents */}
                <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-current opacity-40"></div>
                <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-current opacity-40"></div>

                <div className="flex items-center justify-between mb-4">
                  <div className="p-2.5 border border-current/30 rounded bg-black/40">
                    <Icon size={20} className="animate-pulse-slow" />
                  </div>
                  <span className="text-[8px] font-mono text-slate-500">STAT_NODE_{idx + 1}</span>
                </div>

                <div className="font-display text-3xl md:text-4xl font-black text-white mb-2 flex items-baseline tracking-wider">
                  <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                </div>

                <div className="text-xs font-display font-bold tracking-widest text-slate-300 uppercase mb-2">
                  {stat.title}
                </div>

                <p className="text-xs text-slate-400 font-sans leading-relaxed">
                  {stat.description}
                </p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};

export default Achievements;
