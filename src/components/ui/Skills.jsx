import React, { useState, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Html, AdaptiveDpr, AdaptiveEvents } from '@react-three/drei';
import { motion, useReducedMotion } from 'framer-motion';
import { Layers, HelpCircle, Eye } from 'lucide-react';
import SkillsCore from '../canvas/SkillsCore';

const SkillsLoader = () => {
  return (
    <Html center>
      <div className="flex flex-col items-center justify-center font-mono text-cyber-cyan text-xs">
        <div className="w-8 h-8 border-2 border-cyber-cyan border-t-transparent rounded-full animate-spin mb-2"></div>
        <div className="animate-pulse tracking-wider">SYNCING_AI_CORE...</div>
      </div>
    </Html>
  );
};

const Skills = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const prefersReducedMotion = useReducedMotion();

  const categories = [
    { id: 'all', name: 'ALL_MODULES' },
    { id: 'languages', name: 'LANGUAGES' },
    { id: 'frontend', name: 'FRONTEND_UI' },
    { id: 'backend', name: 'BACKEND_CORE' },
    { id: 'database', name: 'DATABASES' },
    { id: 'tools', name: 'DEV_TOOLS' },
    { id: 'core', name: 'CS_FOUNDATIONS' }
  ];

  return (
    <section id="skills" className="relative w-full pt-10 md:pt-16 pb-0 bg-[#030308] overflow-hidden flex flex-col justify-center">
      {/* Background grid */}
      <div className="absolute inset-0 cyber-grid opacity-20 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-6 w-full relative z-10 flex flex-col lg:flex-row items-center gap-12">
        
        {/* Left Side: Category Filters HUD */}
        <div className="w-full lg:w-5/12 flex flex-col space-y-6">
          
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 bg-cyber-cyan/10 border border-cyber-cyan/30 rounded text-[10px] tracking-[0.25em] font-display text-cyber-cyan font-bold uppercase mb-4">
              <span className="w-1.5 h-1.5 bg-cyber-cyan rounded-full animate-pulse"></span>
              <span>SEC_CORE_SKILLS</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-black uppercase text-white tracking-widest leading-tight">
              SKILLS <span className="text-cyber-cyan glow-text-cyan">CORE</span>
            </h2>
            <div className="w-20 h-1 bg-gradient-to-r from-cyber-cyan to-transparent mt-4"></div>
          </div>

          <div className="glass-panel p-6 rounded-lg relative overflow-hidden">
            {/* Tech accents */}
            <div className="absolute top-0 left-0 w-3.5 h-3.5 border-t-2 border-l-2 border-cyber-cyan"></div>
            <div className="absolute bottom-0 right-0 w-3.5 h-3.5 border-b-2 border-r-2 border-cyber-cyan"></div>

            <div className="flex items-center space-x-2 text-white font-display font-bold text-xs tracking-widest uppercase mb-4">
              <Layers size={14} className="text-cyber-cyan" />
              <span>ORBITAL_HUD_CONTROL</span>
            </div>

            <p className="text-xs text-slate-400 font-sans leading-relaxed mb-6">
              Technologies are loaded into orbital trajectories around a central AI core. Filter the modules below to highlight specific skill clusters in 3D space. Hover over node chips for database records.
            </p>

            {/* Filter Buttons */}
            <div className="flex flex-wrap gap-2.5">
              {categories.map((cat) => {
                const isActive = activeCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className={`px-3.5 py-2 rounded text-[10px] font-display font-bold tracking-wider transition-all duration-300 border cursor-pointer ${
                      isActive 
                        ? 'bg-cyber-cyan text-black border-cyber-cyan shadow-[0_0_15px_rgba(0,240,255,0.4)]' 
                        : 'bg-black/50 text-slate-400 border-slate-800 hover:border-cyber-cyan/50 hover:text-white'
                    }`}
                  >
                    {cat.name}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex items-center space-x-2 text-[10px] font-mono text-slate-500 bg-slate-900/30 p-3 border border-slate-800/40 rounded">
            <HelpCircle size={12} className="text-cyber-yellow shrink-0" />
            <span>Interactive: Drag space to rotate orbit, scroll to zoom.</span>
          </div>

        </div>

        {/* Right Side: Interactive Orbiting Core Canvas */}
        <div className="w-full lg:w-7/12 h-[450px] md:h-[550px] relative glass-panel rounded-lg border-cyber-cyan/10 overflow-hidden shadow-2xl">
          {/* Tech accents */}
          <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-cyber-cyan"></div>
          <div className="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-cyber-cyan"></div>

          {/* Floating UI indicators */}
          <div className="absolute top-4 left-4 z-20 flex items-center space-x-1.5 text-[9px] font-mono text-cyber-cyan/70 tracking-widest select-none">
            <Eye size={10} />
            <span>ORBITAL_VIEW_ACTIVE</span>
          </div>
          <div className="absolute top-4 right-4 z-20 text-[9px] font-mono text-slate-500 select-none">
            ROT_X: DYNAMIC | ROT_Y: DYNAMIC
          </div>

          <Canvas 
            camera={{ position: [0, 0, 5], fov: 65 }}
            gl={{ antialias: true, powerPreference: "high-performance" }}
            className="canvas-interactive"
          >
            <ambientLight intensity={0.3} />
            <pointLight position={[5, 5, 5]} color="#00f0ff" intensity={1.5} />
            <pointLight position={[-5, -5, -5]} color="#ff007f" intensity={1.0} />
            
            <Suspense fallback={<SkillsLoader />}>
              <SkillsCore activeCategory={activeCategory} />
              <AdaptiveDpr pixelated />
              <AdaptiveEvents />
            </Suspense>

            {/* Enable Orbit Controls for full user inspection */}
            <OrbitControls 
              enableZoom={true} 
              enablePan={false}
              maxDistance={7}
              minDistance={3.5}
              autoRotate={hovered => false}
              makeDefault
            />
          </Canvas>
        </div>

      </div>
    </section>
  );
};

export default Skills;
