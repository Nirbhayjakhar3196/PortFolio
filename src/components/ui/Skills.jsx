import React, { useState, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Html, AdaptiveDpr, AdaptiveEvents } from '@react-three/drei';
import { Layers, HelpCircle, Eye, Code, Layout, Server, Database, Sparkles, Wrench } from 'lucide-react';

const SkillsCore = React.lazy(() => import('../canvas/SkillsCore'));

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

  const categories = [
    { id: 'all', name: 'All Skills' },
    { id: 'languages', name: 'Languages' },
    { id: 'frontend', name: 'Frontend' },
    { id: 'backend', name: 'Backend' },
    { id: 'databases', name: 'Databases' },
    { id: 'ai', name: 'AI / GenAI' },
    { id: 'tools', name: 'Tools & DevOps' }
  ];

  const skillGroups = [
    {
      category: 'Languages',
      icon: Code,
      color: 'border-cyber-yellow/30 text-cyber-yellow',
      skills: ['Java', 'JavaScript', 'Python', 'SQL']
    },
    {
      category: 'Frontend',
      icon: Layout,
      color: 'border-cyber-cyan/30 text-cyber-cyan',
      skills: ['React.js', 'Next.js', 'HTML5', 'CSS3', 'Tailwind CSS']
    },
    {
      category: 'Backend',
      icon: Server,
      color: 'border-cyber-magenta/30 text-cyber-magenta',
      skills: ['Node.js', 'Express.js', 'REST APIs', 'JWT Authentication', 'Middleware', 'MVC Architecture']
    },
    {
      category: 'Databases',
      icon: Database,
      color: 'border-cyber-green/30 text-cyber-green',
      skills: ['MongoDB', 'PostgreSQL', 'Prisma ORM']
    },
    {
      category: 'AI / GenAI',
      icon: Sparkles,
      color: 'border-purple-400/30 text-purple-400',
      skills: ['Gemini 2.5 Flash', 'RAG Pipelines', 'PDF Parsing', 'Embeddings', 'Cosine Similarity Search']
    },
    {
      category: 'Tools & DevOps',
      icon: Wrench,
      color: 'border-sky-400/30 text-sky-400',
      skills: ['Redis', 'Docker', 'Git', 'GitHub', 'Postman', 'Vercel', 'Render', 'Zod Validation', 'bcryptjs', 'Socket.io']
    }
  ];

  return (
    <section id="skills" className="relative w-full pt-10 md:pt-16 pb-0 bg-[#030308] overflow-hidden flex flex-col justify-center">
      {/* Background grid */}
      <div className="absolute inset-0 cyber-grid opacity-20 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-6 w-full relative z-10 flex flex-col space-y-12">
        
        {/* Top 3D Interactive Orbit & Category HUD */}
        <div className="flex flex-col lg:flex-row items-center gap-10">
          {/* Left Side: Category Filters HUD */}
          <div className="w-full lg:w-5/12 flex flex-col space-y-6">
            
            <div>
              <h2 className="text-3xl md:text-5xl font-black uppercase text-white tracking-widest leading-tight">
                TECHNICAL <span className="text-cyber-cyan glow-text-cyan">SKILLS</span>
              </h2>
              <div className="w-20 h-1 bg-gradient-to-r from-cyber-cyan to-transparent mt-4"></div>
            </div>

            <div className="glass-panel p-6 rounded-lg relative overflow-hidden">
              <div className="flex items-center space-x-2 text-white font-display font-bold text-xs tracking-wider uppercase mb-3">
                <Layers size={14} className="text-cyber-cyan" />
                <span>Interactive Skill Cluster</span>
              </div>

              <p className="text-xs text-slate-300 font-sans leading-relaxed mb-6">
                Explore technologies across full-stack development, backend architectures, databases, and AI pipelines. Click any category to highlight orbital clusters in 3D, or review the complete technical registry below.
              </p>

              {/* Filter Buttons */}
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => {
                  const isActive = activeCategory === cat.id;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => setActiveCategory(cat.id)}
                      className={`px-3.5 py-1.5 rounded text-xs font-mono font-bold tracking-wide transition-all duration-200 border cursor-pointer ${
                        isActive 
                          ? 'bg-cyber-cyan text-black border-cyber-cyan shadow-[0_0_12px_rgba(0,240,255,0.35)]' 
                          : 'bg-black/50 text-slate-300 border-slate-800 hover:border-cyber-cyan/50 hover:text-white'
                      }`}
                    >
                      {cat.name}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex items-center space-x-2 text-[11px] font-mono text-slate-400 bg-slate-900/40 p-3 border border-slate-800 rounded">
              <HelpCircle size={13} className="text-cyber-cyan shrink-0" />
              <span>Drag to rotate 3D orbit, scroll to zoom, hover chips for details.</span>
            </div>

          </div>

          {/* Right Side: Interactive Orbiting Core Canvas */}
          <div className="w-full lg:w-7/12 h-[420px] md:h-[500px] relative glass-panel rounded-lg border-cyber-cyan/20 overflow-hidden shadow-2xl">
            {/* Clean UI indicator */}
            <div className="absolute top-4 left-4 z-20 flex items-center space-x-1.5 text-[10px] font-mono text-cyber-cyan/90 tracking-wider select-none bg-black/60 px-2.5 py-1 rounded border border-cyber-cyan/30">
              <Eye size={12} />
              <span>Interactive 3D View</span>
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

              <OrbitControls 
                enableZoom={true} 
                enablePan={false}
                maxDistance={7}
                minDistance={3.5}
                makeDefault
              />
            </Canvas>
          </div>
        </div>

        {/* Structured Technical Skills Matrix / Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-4">
          {skillGroups.map((group, idx) => {
            const Icon = group.icon;
            return (
              <div 
                key={idx} 
                className="glass-panel p-5 rounded-lg border border-slate-800/80 hover:border-cyber-cyan/30 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center space-x-2.5 mb-3.5">
                    <div className={`p-1.5 rounded border ${group.color} bg-black/40`}>
                      <Icon size={14} />
                    </div>
                    <h3 className="font-display font-bold text-xs tracking-wider uppercase text-white">
                      {group.category}
                    </h3>
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {group.skills.map((skill, sIdx) => (
                      <span 
                        key={sIdx}
                        className="px-2.5 py-1 rounded bg-slate-900/60 border border-slate-800 text-[11px] font-mono text-slate-300 hover:text-white hover:border-slate-600 transition-colors"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default Skills;

