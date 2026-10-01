import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import { Calendar, Code, ShieldCheck, Flag, Cpu } from 'lucide-react';

const TimelineItem = ({ year, title, desc, icon: Icon, isLeft, index }) => {
  const prefersReducedMotion = useReducedMotion();
  
  const cardVariants = {
    hidden: { 
      opacity: 0, 
      x: prefersReducedMotion ? 0 : (isLeft ? -40 : 40),
      filter: prefersReducedMotion ? 'none' : 'blur(8px)'
    },
    visible: { 
      opacity: 1, 
      x: 0,
      filter: 'none',
      transition: { type: 'spring', stiffness: 85, damping: 16, delay: index * 0.08 }
    }
  };

  return (
    <div className={`flex flex-col md:flex-row items-center w-full mb-8 ${
      isLeft ? 'md:flex-row-reverse' : ''
    }`}>
      {/* Spacer */}
      <div className="hidden md:block w-1/2"></div>
      
      {/* Bullet */}
      <div className="z-20 flex items-center justify-center w-9 h-9 rounded-full border-2 border-cyber-cyan bg-cyber-bg shadow-[0_0_12px_rgba(0,240,255,0.3)] my-2 md:my-0">
        <Icon size={12} className="text-cyber-cyan animate-pulse" />
      </div>

      {/* Card Content */}
      <motion.div 
        variants={cardVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        className="w-full md:w-1/2 px-0 md:px-6 text-left"
      >
        <div className="glass-panel p-4.5 rounded-lg border-cyber-cyan/15 hover:border-cyber-cyan/40 transition-all duration-300 relative overflow-hidden group hover:shadow-[0_0_15px_rgba(0,240,255,0.08)]">
          <div className="absolute top-0 left-0 w-full h-[1.5px] bg-cyber-cyan/30 group-hover:bg-cyber-cyan transition-colors"></div>
          
          <div className="flex justify-between items-center mb-1.5">
            <span className="text-[9px] font-mono tracking-widest text-cyber-cyan font-bold bg-cyber-cyan/10 border border-cyber-cyan/30 px-2 py-0.5 rounded">
              {year}
            </span>
            <span className="text-[7px] font-mono text-slate-600">STG_{index + 1}</span>
          </div>

          <h3 className="text-xs md:text-sm font-display font-bold text-white tracking-wider mb-1.5">
            {title}
          </h3>
          
          <p className="text-[11px] text-slate-400 font-sans leading-relaxed">
            {desc}
          </p>
        </div>
      </motion.div>
    </div>
  );
};

const Timeline = () => {
  const containerRef = useRef(null);
  const prefersReducedMotion = useReducedMotion();

  // Scroll tracking to fill timeline path
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"]
  });

  const lineHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  const milestones = [
    {
      year: '2025',
      title: "Kalvium's UG Program in CS (Software Product Engineering)",
      desc: "Matriculated at SGT University (Gurugram campus) with a focus on Software Product Engineering, establishing rigorous foundations in Data Structures, Algorithms, and system development.",
      icon: Calendar,
    },
    {
      year: '2025 – 2026',
      title: 'Full-Stack & REST API Foundations',
      desc: 'Mastered modern JavaScript and Node.js ecosystems, engineering secure REST APIs, database schemas, and responsive client-side interfaces.',
      icon: Code,
    },
    {
      year: 'JUL – AUG 2026',
      title: 'BOAT Warranty Hub Platform',
      desc: 'Engineered a full-stack warranty tracking and lookup system using Next.js, PostgreSQL, Prisma ORM, JWT authentication, Zod validation, and Docker containerization with layered API architecture.',
      icon: ShieldCheck,
    },
    {
      year: 'AUG 2026',
      title: 'AI Study Assistant & 36-Hour Hackathon',
      desc: 'Built a document-grounded RAG assistant with Gemini 2.5 Flash, PDF parsing, vector embeddings, and Web Streams. Participated in the 36-hour SarvHit CodeSphere Hackathon in a 5-member technical team.',
      icon: Cpu,
    },
    {
      year: 'SEP 2026',
      title: 'High-Performance URL Shortener',
      desc: 'Developed a URL shortening and analytics platform with Redis token-bucket rate limiting (Lua scripting), Redis-backed authentication state, Google OAuth, and Docker Compose.',
      icon: Flag,
    },
    {
      year: 'CURRENT',
      title: 'Target: Software Engineering Internship',
      desc: 'Seeking a Software Engineering Internship in Full-Stack & Backend Development to build production-grade systems and scale web services.',
      icon: Flag,
    }
  ];

  return (
    <div ref={containerRef} className="relative w-full py-6 bg-transparent overflow-hidden">
      <div className="max-w-6xl mx-auto px-6 relative z-10">
        
        {/* Timeline wrapper */}
        <div className="relative w-full max-w-4xl mx-auto flex flex-col items-center">
          
          {/* Vertical Track (Inactive) */}
          <div className="absolute left-[18px] md:left-1/2 top-0 bottom-0 w-[2px] bg-slate-800 -translate-x-[1px] z-0"></div>

          {/* Vertical Progress (Active) */}
          <motion.div 
            style={{ 
              height: prefersReducedMotion ? '100%' : lineHeight,
              boxShadow: '0 0 10px rgba(0, 240, 255, 0.5)'
            }}
            className="absolute left-[18px] md:left-1/2 top-0 w-[2px] bg-cyber-cyan origin-top -translate-x-[1px] z-10"
          ></motion.div>

          {/* Milestones */}
          <div className="w-full relative z-20 pl-6 md:pl-0">
            {milestones.map((milestone, idx) => (
              <TimelineItem
                key={idx}
                year={milestone.year}
                title={milestone.title}
                desc={milestone.desc}
                icon={milestone.icon}
                isLeft={idx % 2 === 0}
                index={idx}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Timeline;
