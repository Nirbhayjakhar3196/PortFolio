import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { User, GraduationCap, Cpu, Layers, Target } from 'lucide-react';
import Timeline from './Timeline';
import NeonDivider from './NeonDivider';

const About = () => {
  const prefersReducedMotion = useReducedMotion();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.05
      }
    }
  };

  const panelVariants = {
    hidden: { 
      opacity: 0, 
      y: prefersReducedMotion ? 0 : 40, 
      filter: prefersReducedMotion ? 'none' : 'blur(8px)' 
    },
    visible: { 
      opacity: 1, 
      y: 0, 
      filter: 'none',
      transition: { type: 'spring', stiffness: 85, damping: 16 }
    }
  };

  const interests = [
    { name: 'Full-Stack & Backend Systems', desc: 'Layered REST APIs, Next.js, Node.js, Express, and structured service/repository architectures', icon: Cpu, color: 'text-cyber-cyan border-cyber-cyan/35 bg-cyber-cyan/5' },
    { name: 'Databases & Caching Infrastructure', desc: 'PostgreSQL, MongoDB, Prisma ORM, and Redis token-bucket rate limiting with Lua scripting', icon: Layers, color: 'text-cyber-magenta border-cyber-magenta/35 bg-cyber-magenta/5' },
    { name: 'AI & Document RAG Pipelines', desc: 'Gemini 2.5 Flash, PDF text chunking, vector embeddings, cosine similarity search, and Web Streams', icon: Target, color: 'text-cyber-yellow border-cyber-yellow/35 bg-cyber-yellow/5' }
  ];

  return (
    <section id="about" className="relative w-full pt-10 md:pt-16 pb-0 bg-[#05050c] overflow-hidden">
      {/* Dense background grid */}
      <div className="absolute inset-0 cyber-grid-dense opacity-20 pointer-events-none"></div>
      
      {/* Glow Effects */}
      <div className="absolute top-1/3 left-10 w-[300px] h-[300px] bg-cyber-cyan/5 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-1/3 right-10 w-[300px] h-[300px] bg-cyber-magenta/5 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-5xl font-black uppercase text-white tracking-widest">
            ABOUT <span className="text-cyber-cyan glow-text-cyan">ME</span>
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-cyber-cyan to-transparent mx-auto mt-3"></div>
        </div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch"
        >
          {/* Left Block: Bio Details */}
          <motion.div 
            variants={panelVariants}
            className="lg:col-span-7 glass-panel p-6 md:p-8 rounded-lg relative overflow-hidden flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-2 border border-cyber-cyan/40 bg-cyber-cyan/5 rounded text-cyber-cyan">
                  <User size={18} />
                </div>
                <h3 className="font-display font-bold text-sm tracking-wider text-white uppercase">
                  Profile & Background
                </h3>
              </div>
              
              <div className="space-y-4 text-slate-300 text-sm md:text-base leading-relaxed font-sans">
                <p>
                  Computer Science student specializing in full-stack development and AI applications, with hands-on experience building web platforms, REST APIs, authentication systems, and document-grounded AI applications.
                </p>
                <p>
                  Experienced in React, Next.js, Node.js, Express, PostgreSQL, MongoDB, Redis, and Gemini, with projects involving backend architecture, security, data processing, and RAG pipelines.
                </p>
                <p>
                  Seeking a software engineering internship to contribute to real-world products while strengthening my full-stack and backend engineering skills.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Right Block: Education & Core Interests */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            
            {/* Education Panel */}
            <motion.div 
              variants={panelVariants}
              className="glass-panel p-6 rounded-lg relative overflow-hidden"
            >
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 border border-cyber-cyan/40 bg-cyber-cyan/5 rounded text-cyber-cyan">
                  <GraduationCap size={18} />
                </div>
                <h3 className="font-display font-bold text-sm tracking-wider text-white uppercase">
                  Education
                </h3>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="text-base font-bold text-white tracking-wider">
                    Kalvium's UG Program in CS (Software Product Engineering)
                  </h4>
                  <p className="text-xs text-cyber-cyan font-mono mt-1">
                    Campus: Gurugram | Bachelor's enrollment: B.Tech, SGT University
                  </p>
                  <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                    Duration: 2025 – 2029 (Expected Graduation: 2029)
                  </p>
                </div>

                <div className="flex items-center space-x-4 bg-cyber-cyan/5 border border-cyber-cyan/20 p-3 rounded">
                  <div className="font-display text-2xl font-black text-cyber-cyan glow-text-cyan">
                    9.6
                  </div>
                  <div className="text-xs text-slate-400 font-mono">
                    <div className="text-white font-bold">CGPA: 9.60 / 10.00</div>
                    <div>Academic Excellence in CS Core</div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Core Interest Areas */}
            <motion.div 
              variants={panelVariants}
              className="glass-panel p-6 rounded-lg relative overflow-hidden flex-1"
            >
              <h3 className="font-display font-bold text-xs tracking-wider text-white uppercase mb-4">
                Core Competencies & Focus
              </h3>

              <div className="space-y-3.5">
                {interests.map((interest, idx) => {
                  const Icon = interest.icon;
                  return (
                    <div 
                      key={idx}
                      className={`flex items-start space-x-3 p-2.5 rounded border transition-all duration-300 hover:bg-black/40 ${interest.color}`}
                    >
                      <div className="p-1.5 border border-current rounded mt-0.5">
                        <Icon size={14} />
                      </div>
                      <div>
                        <div className="text-xs font-display font-black tracking-wider uppercase text-white">
                          {interest.name}
                        </div>
                        <div className="text-[11px] text-slate-400 font-sans mt-0.5">
                          {interest.desc}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
            
          </div>
        </motion.div>

        {/* Nested Timeline Separator */}
        <div className="mt-16 mb-4">
          <NeonDivider color="magenta" />
        </div>

        {/* Embedded career timeline */}
        <Timeline />

      </div>
    </section>
  );
};

export default About;
