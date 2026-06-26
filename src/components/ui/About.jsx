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
    { name: 'Backend Engineering', desc: 'Designing robust server architectures and APIs', icon: Cpu, color: 'text-cyber-cyan border-cyber-cyan/35 bg-cyber-cyan/5' },
    { name: 'Scalable Systems', desc: 'Developing high-throughput, low-latency microservices', icon: Layers, color: 'text-cyber-magenta border-cyber-magenta/35 bg-cyber-magenta/5' },
    { name: 'Modern Web Tech', desc: 'Building responsive, real-time client-facing systems', icon: Target, color: 'text-cyber-yellow border-cyber-yellow/35 bg-cyber-yellow/5' }
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
          <div className="inline-flex items-center space-x-2 px-3 py-1 bg-cyber-cyan/10 border border-cyber-cyan/30 rounded text-[10px] tracking-[0.25em] font-display text-cyber-cyan font-bold uppercase mb-3">
            <span className="w-1.5 h-1.5 bg-cyber-cyan rounded-full animate-ping"></span>
            <span>SEC_ACCESS_BIOMETRICS</span>
          </div>
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
            {/* Holographic monitor lines */}
            <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-cyber-cyan"></div>
            <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-cyber-cyan"></div>
            <div className="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-cyber-cyan"></div>
            <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-cyber-cyan"></div>
            <div className="absolute top-0 left-0 w-full h-[1px] bg-cyber-cyan/10"></div>
            
            <div>
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-2 border border-cyber-cyan/40 bg-cyber-cyan/5 rounded text-cyber-cyan">
                  <User size={18} />
                </div>
                <h3 className="font-display font-bold text-sm tracking-wider text-white uppercase">
                  BIOMETRIC_DATA // PROFILE
                </h3>
              </div>
              
              <div className="space-y-4 text-slate-300 text-sm md:text-base leading-relaxed font-sans">
                <p>
                  I am a second-year Computer Science Engineering student specializing in full-stack software development with a deep interest in backend engineering and complex database architectures.
                </p>
                <p>
                  My developer journey is focused on creating highly optimized systems that resolve real-world problems. I combine robust problem-solving frameworks (Data Structures & Algorithms) with cutting-edge javascript/node stacks to build web services that scale cleanly.
                </p>
                <p>
                  As an engineering student, I constantly explore system designs, caching mechanisms, and performance-critical development. My goal is to secure an impactful backend developer internship where I can apply my skills and contribute to production-grade products.
                </p>
              </div>
            </div>

            <div className="border-t border-slate-800/60 pt-6 mt-8 flex flex-col sm:flex-row justify-between text-xs font-mono text-slate-500 gap-2">
              <div>HOST: Nirbhay_Jakhar</div>
              <div>ROLES: ['Full_Stack_Dev', 'Backend_Enthusiast']</div>
              <div>STATUS: Open_To_Internships</div>
            </div>
          </motion.div>

          {/* Right Block: Education & Core Interests */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            
            {/* Education Panel */}
            <motion.div 
              variants={panelVariants}
              className="glass-panel p-6 rounded-lg relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-cyber-cyan"></div>
              <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-cyber-cyan"></div>
              
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 border border-cyber-cyan/40 bg-cyber-cyan/5 rounded text-cyber-cyan">
                  <GraduationCap size={18} />
                </div>
                <h3 className="font-display font-bold text-sm tracking-wider text-white uppercase">
                  ACADEMIC_PATHWAY
                </h3>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="text-base font-bold text-white tracking-wider">
                    B.Tech Computer Science Engineering
                  </h4>
                  <p className="text-xs text-cyber-cyan font-mono mt-0.5">
                    SGT University | 2025 - 2029
                  </p>
                </div>

                <div className="flex items-center space-x-4 bg-cyber-cyan/5 border border-cyber-cyan/20 p-3 rounded">
                  <div className="font-display text-2xl font-black text-cyber-cyan glow-text-cyan">
                    9.6
                  </div>
                  <div className="text-xs text-slate-400 font-mono">
                    <div className="text-white font-bold">CGPA OVERALL</div>
                    <div>Scale: 10.0 Standard</div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Core Interest Areas */}
            <motion.div 
              variants={panelVariants}
              className="glass-panel p-6 rounded-lg relative overflow-hidden flex-1"
            >
              <div className="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-cyber-cyan"></div>
              <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-cyber-cyan"></div>

              <h3 className="font-display font-bold text-xs tracking-wider text-white uppercase mb-4">
                AREAS_OF_INTEREST
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
