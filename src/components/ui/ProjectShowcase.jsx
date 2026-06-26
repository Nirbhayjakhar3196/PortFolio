import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useMotionValue, useSpring, useReducedMotion } from 'framer-motion';
import { Terminal, Github, ExternalLink, Cpu, X, Server, Layout, ShieldCheck } from 'lucide-react';

// A single 3D interactive holographic monitor card
const ProjectCard = ({ project, index, onSelect }) => {
  const cardRef = useRef(null);
  const prefersReducedMotion = useReducedMotion();
  
  // Track cursor position for 3D tilt effect
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Set up spring animations for smooth tilt transitions
  const springConfig = { stiffness: 150, damping: 20 };
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [12, -12]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-12, 12]), springConfig);
  
  const handleMouseMove = (e) => {
    if (prefersReducedMotion) return;
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    
    // Normalize coordinates from -0.5 to 0.5
    const normalizedX = (e.clientX - rect.left) / width - 0.5;
    const normalizedY = (e.clientY - rect.top) / height - 0.5;
    
    mouseX.set(normalizedX);
    mouseY.set(normalizedY);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  const borderColors = [
    'border-cyber-cyan/30 hover:border-cyber-cyan',
    'border-cyber-magenta/30 hover:border-cyber-magenta',
    'border-cyber-yellow/30 hover:border-cyber-yellow',
    'border-cyber-green/30 hover:border-cyber-green'
  ];

  const glows = [
    'hover:shadow-[0_0_30px_rgba(0,240,255,0.25)]',
    'hover:shadow-[0_0_30px_rgba(255,0,127,0.25)]',
    'hover:shadow-[0_0_30px_rgba(254,231,21,0.25)]',
    'hover:shadow-[0_0_30px_rgba(57,255,20,0.25)]'
  ];

  const tagColors = [
    'text-cyber-cyan bg-cyber-cyan/10 border-cyber-cyan/35',
    'text-cyber-magenta bg-cyber-magenta/10 border-cyber-magenta/35',
    'text-cyber-yellow bg-cyber-yellow/10 border-cyber-yellow/35',
    'text-cyber-green bg-cyber-green/10 border-cyber-green/35'
  ];

  const activeGlow = borderColors[index % 4];
  const cardGlow = glows[index % 4];
  const tagColor = tagColors[index % 4];

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={() => onSelect(project)}
      style={{
        rotateX: prefersReducedMotion ? 0 : rotateX,
        rotateY: prefersReducedMotion ? 0 : rotateY,
        transformStyle: 'preserve-3d',
        perspective: 1000
      }}
      className={`w-[290px] sm:w-[350px] h-[400px] flex-shrink-0 glass-panel p-6 rounded-xl border ${activeGlow} ${cardGlow} transition-all duration-300 relative cursor-pointer flex flex-col justify-between select-none scanlines`}
    >
      <div className="absolute inset-0 scanline-overlay"></div>
      
      {/* 3D Depth Elements */}
      <div 
        style={{ transform: prefersReducedMotion ? 'none' : 'translateZ(30px)' }}
        className="w-full"
      >
        {/* Card HUD Head */}
        <div className="flex justify-between items-center border-b border-slate-800 pb-3 mb-4">
          <div className="flex items-center space-x-1.5 font-mono text-[9px] text-slate-500">
            <Terminal size={10} className="text-current" />
            <span>PROJECT_0{index + 1}.SYS</span>
          </div>
          <span className="w-1.5 h-1.5 rounded-full bg-cyber-cyan animate-pulse"></span>
        </div>

        {/* Project Type Icon */}
        <div className="mb-4">
          <div className={`w-10 h-10 border border-slate-800 rounded-lg bg-black/40 flex items-center justify-center text-slate-300`}>
            {project.type === 'backend' ? <Server size={18} /> : project.type === 'auth' ? <ShieldCheck size={18} /> : <Layout size={18} />}
          </div>
        </div>

        <h3 className="text-lg font-display font-black tracking-wider text-white uppercase mb-2">
          {project.title}
        </h3>
        
        <p className="text-xs text-slate-400 font-sans leading-relaxed mb-4 h-[72px] overflow-hidden line-clamp-3">
          {project.description}
        </p>
      </div>

      <div 
        style={{ transform: prefersReducedMotion ? 'none' : 'translateZ(15px)' }}
        className="w-full mt-auto"
      >
        {/* Tech Stack Chips */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {project.tech.slice(0, 3).map((t, idx) => (
            <span 
              key={idx} 
              className={`px-2 py-0.5 border text-[9px] font-mono tracking-wider font-semibold rounded ${tagColor}`}
            >
              {t}
            </span>
          ))}
          {project.tech.length > 3 && (
            <span className="px-2 py-0.5 border border-slate-800 text-slate-500 text-[9px] font-mono rounded">
              +{project.tech.length - 3}
            </span>
          )}
        </div>

        <div className="text-[10px] font-mono text-cyber-cyan hover:underline mt-2 flex items-center space-x-1 select-none">
          <span>RUN_INSPECT_MODE()</span>
        </div>
      </div>
    </motion.div>
  );
};

const ProjectShowcase = () => {
  const containerRef = useRef(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const prefersReducedMotion = useReducedMotion();
  const [translationLimit, setTranslationLimit] = useState("-55%");

  useEffect(() => {
    const handleResize = () => {
      const w = window.innerWidth;
      if (w >= 1440) {
        setTranslationLimit("-12%");
      } else if (w >= 1200) {
        setTranslationLimit("-22%");
      } else if (w >= 1024) {
        setTranslationLimit("-32%");
      } else if (w >= 768) {
        setTranslationLimit("-45%");
      } else {
        setTranslationLimit("-65%");
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Scroll tracking to map vertical scroll to horizontal transformation
  const { scrollYProgress } = useScroll({
    target: containerRef
  });

  // Scale scroll percentage to move horizontal container dynamically based on display size
  const xTranslation = useTransform(scrollYProgress, [0, 1], ["0%", translationLimit]);

  const projects = [
    {
      title: "Authentication System",
      type: "auth",
      description: "A secure industry-grade user access authentication and authorization database system built with Node and MongoDB.",
      extendedDesc: "A complete backend solution managing secure token-based user sessions, password encryptions, and route protections. Implements secure access keys and session storage following modern security benchmarks.",
      tech: ["Node.js", "Express.js", "MongoDB", "JWT", "Bcrypt"],
      features: [
        "Secure cookie-based and header JWT verification.",
        "Automatic password hashing via Bcrypt salt algorithms.",
        "Protected resource routing for secure user environments.",
        "Mongoose db integration and schema design optimization."
      ],
      github: "https://github.com",
      live: "https://github.com"
    },
    {
      title: "Holographic Note App",
      type: "frontend",
      description: "A clean, component-focused markdown note compiler allowing users to structure quick records.",
      extendedDesc: "Created to practices modular component structures and component status updates in React. Includes rich text notes, quick tags, and search index filtering.",
      tech: ["React.js", "JavaScript", "HTML5", "CSS3"],
      features: [
        "Create, read, update, and delete note records.",
        "Responsive grid alignment scaling.",
        "Search filtering by custom keywords.",
        "Local browser persistence modules."
      ],
      github: "https://github.com",
      live: "https://github.com"
    },
    {
      title: "Password Generator",
      type: "frontend",
      description: "An interactive cyber-utility generating cryptographically secure combinations in real-time.",
      extendedDesc: "A custom UI dashboard tool built to demonstrate clean state reactivity and accessibility in Tailwind. Features length controls, character toggle blocks, and clipboard copies.",
      tech: ["React.js", "Tailwind CSS", "JavaScript"],
      features: [
        "Custom password length (8-32 characters) configurations.",
        "Regex filters for Numbers, Symbols, and Mixed characters.",
        "One-click direct clipboard copies.",
        "Fully accessible dark UI responsive interfaces."
      ],
      github: "https://github.com",
      live: "https://github.com"
    },
    {
      title: "Random User Generator",
      type: "frontend",
      description: "A dynamic developer tool calling external REST APIs to fetch and render synthetic profiles.",
      extendedDesc: "Designed to explore asynchronous fetch methods, error states, and skeleton UI loading architectures. Displays user avatars, contact cards, and locations.",
      tech: ["React.js", "REST API", "JavaScript", "CSS3"],
      features: [
        "Asynchronous JSON fetching from third-party APIs.",
        "Skeleton loader indicators for network latency.",
        "Multi-profile dashboard card arrangements.",
        "Location mapping coordinates parse logs."
      ],
      github: "https://github.com",
      live: "https://github.com"
    }
  ];

  return (
    <div id="projects" ref={containerRef} className="relative w-full h-[170vh] md:h-[180vh] bg-[#030308]">
      
      {/* Sticky viewport frame */}
      <div className="sticky top-0 w-full h-screen overflow-hidden flex flex-col justify-center">
        
        {/* Background Grid */}
        <div className="absolute inset-0 cyber-grid opacity-20 pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-6 w-full relative z-10 select-none">
          {/* Header */}
          <div className="mb-12">
            <div className="inline-flex items-center space-x-2 px-3 py-1 bg-cyber-cyan/10 border border-cyber-cyan/30 rounded text-[10px] tracking-[0.25em] font-display text-cyber-cyan font-bold uppercase mb-4">
              <span className="w-1.5 h-1.5 bg-cyber-cyan rounded-full animate-pulse"></span>
              <span>SEC_PROJECT_ARCHIVE</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-black uppercase text-white tracking-widest leading-none">
              PROJECTS <span className="text-cyber-cyan glow-text-cyan">SHOWCASE</span>
            </h2>
            <div className="w-20 h-1 bg-gradient-to-r from-cyber-cyan to-transparent mt-4"></div>
          </div>
        </div>

        {/* Cinematic Horizontal Scroll Strip */}
        <div className="relative w-full overflow-hidden mt-4">
          <motion.div
            style={{ x: prefersReducedMotion ? 0 : xTranslation }}
            className="flex space-x-6 px-6 md:px-24 w-max pointer-events-auto"
          >
            {projects.map((project, idx) => (
              <ProjectCard
                key={idx}
                project={project}
                index={idx}
                onSelect={setSelectedProject}
              />
            ))}

            {/* End Card CTA */}
            <div className="w-[200px] flex-shrink-0 flex flex-col justify-center items-center text-center p-6 rounded-xl border border-dashed border-slate-800 bg-slate-900/10">
              <span className="text-xs text-slate-500 font-mono mb-2">END_OF_ARRAY</span>
              <h4 className="text-xs font-display font-black text-slate-400 uppercase tracking-widest">
                More projects on GitHub
              </h4>
            </div>
          </motion.div>
        </div>

        {/* Floating Indicator */}
        <div className="absolute bottom-12 right-12 z-20 text-[9px] font-mono text-slate-500 flex items-center space-x-2">
          <span className="w-2 h-2 rounded-full bg-cyber-cyan animate-pulse"></span>
          <span>TRACKER_POS: {prefersReducedMotion ? 'STATIC' : 'HORIZONTAL_STREAM'}</span>
        </div>

      </div>

      {/* Modal Detailed View overlay */}
      {selectedProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="w-full max-w-xl bg-[#0c0c17] border border-cyber-cyan p-6 md:p-8 rounded-xl relative shadow-[0_0_50px_rgba(0,240,255,0.3)] scanlines"
          >
            <div className="absolute inset-0 scanline-overlay"></div>
            
            {/* Corner Tech Highlights */}
            <div className="absolute top-0 left-0 w-4.5 h-4.5 border-t-2 border-l-2 border-cyber-cyan"></div>
            <div className="absolute top-0 right-0 w-4.5 h-4.5 border-t-2 border-r-2 border-cyber-cyan"></div>
            <div className="absolute bottom-0 left-0 w-4.5 h-4.5 border-b-2 border-l-2 border-cyber-cyan"></div>
            <div className="absolute bottom-0 right-0 w-4.5 h-4.5 border-b-2 border-r-2 border-cyber-cyan"></div>

            {/* Close Button */}
            <button
              onClick={() => setSelectedProject(null)}
              className="absolute top-4 right-4 p-1 rounded-full border border-slate-800 text-slate-400 hover:text-cyber-cyan hover:border-cyber-cyan transition-colors cursor-pointer"
            >
              <X size={16} />
            </button>

            {/* Header */}
            <div className="border-b border-slate-800 pb-4 mb-6">
              <span className="text-[9px] font-mono text-cyber-cyan tracking-widest font-bold block mb-1">
                SYSTEM_RECORD // DETAIL_VIEW
              </span>
              <h3 className="text-xl md:text-2xl font-display font-black text-white uppercase tracking-wider">
                {selectedProject.title}
              </h3>
            </div>

            {/* Description */}
            <div className="space-y-4 mb-6">
              <p className="text-xs md:text-sm text-slate-300 font-sans leading-relaxed">
                {selectedProject.extendedDesc}
              </p>
              
              <div>
                <h4 className="text-xs font-display font-bold text-cyber-yellow tracking-widest uppercase mb-2.5">
                  SYSTEM_SPECIFICATIONS:
                </h4>
                <ul className="space-y-2 text-xs text-slate-400 font-sans">
                  {selectedProject.features.map((feat, idx) => (
                    <li key={idx} className="flex items-start">
                      <span className="text-cyber-cyan font-mono mr-2 shrink-0">&gt;</span>
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Tech chips */}
            <div className="flex flex-wrap gap-1.5 mb-8">
              {selectedProject.tech.map((t, idx) => (
                <span 
                  key={idx} 
                  className="px-2.5 py-1 border border-cyber-cyan/35 text-cyber-cyan bg-cyber-cyan/5 text-[10px] font-mono tracking-wider font-semibold rounded"
                >
                  {t}
                </span>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex space-x-4 font-display">
              <a
                href={selectedProject.github}
                target="_blank"
                rel="noreferrer"
                className="flex-1 flex items-center justify-center space-x-2 px-4 py-2.5 bg-cyber-cyan text-black hover:bg-black hover:text-cyber-cyan border border-cyber-cyan rounded text-xs tracking-widest font-black transition-all cursor-pointer"
              >
                <Github size={14} />
                <span>GITHUB_SRC</span>
              </a>
              
              <a
                href={selectedProject.live}
                target="_blank"
                rel="noreferrer"
                className="flex-1 flex items-center justify-center space-x-2 px-4 py-2.5 border border-slate-700 text-white hover:border-cyber-magenta hover:text-cyber-magenta rounded text-xs tracking-widest font-bold transition-all cursor-pointer"
              >
                <ExternalLink size={14} />
                <span>LIVE_DEPLOY</span>
              </a>
            </div>

          </motion.div>
        </div>
      )}

    </div>
  );
};

export default ProjectShowcase;
