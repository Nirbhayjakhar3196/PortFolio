import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useMotionValue, useSpring, useReducedMotion } from 'framer-motion';
import { Terminal, Github, ExternalLink, X, Server, ShieldCheck, Sparkles, ArrowRight, CheckCircle2, GitBranch } from 'lucide-react';

// A single 3D interactive holographic monitor card
const ProjectCard = ({ project, index, onSelect }) => {
  const cardRef = useRef(null);
  const prefersReducedMotion = useReducedMotion();
  
  // Track cursor position for 3D tilt effect and hover lift
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const yValue = useMotionValue(0);

  // Set up spring animations for smooth tilt and lift transitions
  const springConfig = { stiffness: 150, damping: 20 };
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [10, -10]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-10, 10]), springConfig);
  const y = useSpring(yValue, springConfig);
  
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
    yValue.set(-8); // Lift card
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
    yValue.set(0); // Reset lift
  };

  const borderColors = [
    'border-cyber-cyan/30 hover:border-cyber-cyan',
    'border-cyber-magenta/30 hover:border-cyber-magenta',
    'border-purple-400/30 hover:border-purple-400'
  ];

  const glows = [
    'hover:shadow-[0_0_30px_rgba(0,240,255,0.25)]',
    'hover:shadow-[0_0_30px_rgba(255,0,127,0.25)]',
    'hover:shadow-[0_0_30px_rgba(168,85,247,0.25)]'
  ];

  const tagColors = [
    'text-cyber-cyan bg-cyber-cyan/10 border-cyber-cyan/35',
    'text-cyber-magenta bg-cyber-magenta/10 border-cyber-magenta/35',
    'text-purple-300 bg-purple-500/10 border-purple-500/35'
  ];

  const activeGlow = borderColors[index % 3];
  const cardGlow = glows[index % 3];
  const tagColor = tagColors[index % 3];

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={() => onSelect(project)}
      style={{
        rotateX: prefersReducedMotion ? 0 : rotateX,
        rotateY: prefersReducedMotion ? 0 : rotateY,
        y: prefersReducedMotion ? 0 : y,
        transformStyle: 'preserve-3d',
        perspective: 1000
      }}
      className={`w-[320px] sm:w-[380px] h-[450px] flex-shrink-0 glass-panel p-6 rounded-xl border ${activeGlow} ${cardGlow} transition-all duration-300 relative cursor-pointer flex flex-col justify-between select-none scanlines group`}
    >
      <div className="absolute inset-0 scanline-overlay pointer-events-none"></div>
      
      {/* 3D Depth Elements */}
      <div 
        style={{ transform: prefersReducedMotion ? 'none' : 'translateZ(25px)' }}
        className="w-full"
      >
        {/* Card HUD Head */}
        <div className="flex justify-between items-center border-b border-slate-800 pb-3 mb-3">
          <div className="flex items-center space-x-1.5 font-mono text-[10px] text-slate-300 font-semibold">
            <span className="text-cyber-yellow">{project.date}</span>
          </div>
          {project.live ? (
            <span className="px-2 py-0.5 rounded bg-cyber-green/10 border border-cyber-green/40 text-cyber-green text-[9px] font-bold font-mono animate-pulse">
              LIVE DEMO
            </span>
          ) : (
            <span className="px-2 py-0.5 rounded bg-cyber-cyan/10 border border-cyber-cyan/30 text-cyber-cyan text-[9px] font-mono font-bold">
              OPEN SOURCE
            </span>
          )}
        </div>

        {/* Project Header & Category Icon */}
        <div className="flex items-center space-x-3 mb-3">
          <div className="w-10 h-10 border border-slate-800 rounded-lg bg-black/60 flex items-center justify-center text-slate-200 shrink-0">
            {project.type === 'backend' ? (
              <Server size={18} className="text-cyber-cyan" />
            ) : project.type === 'system' ? (
              <ShieldCheck size={18} className="text-cyber-magenta" />
            ) : (
              <Sparkles size={18} className="text-purple-400" />
            )}
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-display font-black tracking-wider text-white uppercase group-hover:text-cyber-cyan transition-colors line-clamp-1">
              {project.title}
            </h3>
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block">
              {project.categoryLabel}
            </span>
          </div>
        </div>
        
        {/* Problem Statement / Description */}
        <p className="text-xs text-slate-300 font-sans leading-relaxed mb-4 line-clamp-3">
          {project.problem}
        </p>

        {/* Architectural Highlight Snippet */}
        <div className="p-2.5 rounded bg-black/50 border border-slate-800/80 mb-4 text-[11px] font-mono text-slate-400">
          <span className="text-cyber-cyan font-bold">Highlight: </span>
          <span className="text-slate-300">{project.architectureHighlight}</span>
        </div>
      </div>

      <div 
        style={{ transform: prefersReducedMotion ? 'none' : 'translateZ(15px)' }}
        className="w-full mt-auto"
      >
        {/* Tech Stack Chips */}
        <div className="flex flex-wrap gap-1.5 mb-3.5">
          {project.tech.slice(0, 4).map((t, idx) => (
            <span 
              key={idx} 
              className={`px-2 py-0.5 border text-[9px] font-mono tracking-wider font-semibold rounded ${tagColor}`}
            >
              {t}
            </span>
          ))}
          {project.tech.length > 4 && (
            <span className="px-2 py-0.5 border border-slate-800 text-slate-400 text-[9px] font-mono rounded">
              +{project.tech.length - 4}
            </span>
          )}
        </div>

        {/* Card Footer CTAs with direct links */}
        <div className="pt-3 border-t border-slate-800/80 flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="flex-1 flex items-center justify-center space-x-1.5 py-1.5 px-2.5 rounded bg-slate-900 border border-cyber-cyan/40 text-cyber-cyan hover:bg-cyber-cyan hover:text-black transition-all text-[11px] font-mono font-bold tracking-wide"
              title="Open GitHub Repository"
            >
              <Github size={13} />
              <span>GitHub Repo</span>
            </a>

            {project.live ? (
              <a
                href={project.live}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="flex-1 flex items-center justify-center space-x-1.5 py-1.5 px-2.5 rounded bg-cyber-magenta/10 border border-cyber-magenta/60 text-cyber-magenta hover:bg-cyber-magenta hover:text-white transition-all text-[11px] font-mono font-bold tracking-wide shadow-[0_0_10px_rgba(255,0,127,0.25)]"
                title="Open Live Production Demo"
              >
                <ExternalLink size={13} />
                <span>Live Demo</span>
              </a>
            ) : (
              <button
                type="button"
                onClick={() => onSelect(project)}
                className="flex-1 flex items-center justify-center space-x-1 py-1.5 px-2 rounded bg-black/40 border border-slate-700 text-slate-300 hover:text-white hover:border-slate-500 transition-all text-[11px] font-mono font-medium"
              >
                <span>Architecture</span>
                <ArrowRight size={11} />
              </button>
            )}
          </div>
          
          {project.live && (
            <button
              type="button"
              onClick={() => onSelect(project)}
              className="text-[10px] font-mono text-slate-400 hover:text-cyber-cyan flex items-center justify-center space-x-1 transition-colors pt-0.5"
            >
              <span>Click card for detailed architecture specs</span>
              <ArrowRight size={10} />
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

const ProjectShowcase = () => {
  const containerRef = useRef(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const prefersReducedMotion = useReducedMotion();
  const [translationLimit, setTranslationLimit] = useState("-30%");

  useEffect(() => {
    const handleResize = () => {
      const w = window.innerWidth;
      if (w >= 1440) {
        setTranslationLimit("-10%");
      } else if (w >= 1200) {
        setTranslationLimit("-18%");
      } else if (w >= 1024) {
        setTranslationLimit("-25%");
      } else if (w >= 768) {
        setTranslationLimit("-38%");
      } else {
        setTranslationLimit("-55%");
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Close modal on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setSelectedProject(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Scroll tracking to map vertical scroll to horizontal transformation
  const { scrollYProgress } = useScroll({
    target: containerRef
  });

  const xTranslation = useTransform(scrollYProgress, [0, 1], ["0%", translationLimit]);

  const projects = [
    {
      title: "BOAT Warranty Hub",
      date: "Jul 2026 – Aug 2026",
      type: "backend",
      categoryLabel: "Full-Stack & Layered Backend Platform",
      problem: "Enables users to register products, verify warranty status using unique serial numbers, track purchase and expiry dates, and maintain repair records through a centralized platform.",
      architectureHighlight: "Layered API, Service & Repository architecture with PostgreSQL & Docker.",
      extendedDesc: "A robust full-stack warranty management platform designed with modular separation between controllers, business logic service layers, and Prisma repository operations. Features serial-number based warranty lookup, automatic expiry calculation, and repair-history tracking.",
      tech: ["Next.js", "PostgreSQL", "Prisma", "JWT", "bcrypt", "Zod", "Docker"],
      features: [
        "Product Registration: Secure onboarding with serial-number uniqueness checks and purchase logging.",
        "Warranty Lookup Engine: Serial-number based query verification for instant warranty validity & expiry tracking.",
        "Repair History Management: Centralized audit records of past service and maintenance requests.",
        "Layered Architecture: Clean separation of API routes, business logic services, and database repository layers.",
        "Validation & Security: Strict request payload validation via Zod schemas and password encryption with bcrypt.",
        "Search, Pagination & Sorting: Optimized server-side database querying for record catalogs.",
        "Containerized Deployment: Reproducible environment setup using Docker and PostgreSQL."
      ],
      engineeringHighlights: [
        { label: "Backend Pattern", value: "Layered Controller-Service-Repository" },
        { label: "Data Integrity", value: "Zod Schema Validation & Prisma Type Safety" },
        { label: "Containerization", value: "Dockerized PostgreSQL & Application" }
      ],
      github: "https://github.com/Nirbhayjakhar3196/boat-warranty",
      live: null
    },
    {
      title: "URL Shortener",
      date: "Sep 2026",
      type: "system",
      categoryLabel: "High-Performance Distributed & Caching System",
      problem: "Provides users with short, shareable URLs while maintaining ownership controls, secure authentication, and real-time usage analytics for created links.",
      architectureHighlight: "Redis token-bucket rate limiter with atomic Lua scripting & auth caching.",
      extendedDesc: "A high-performance full-stack URL shortening platform engineered for low-latency redirection and resilient API security. Leverages Redis Lua scripting for atomic token-bucket rate limiting and session state caching.",
      tech: ["React", "Node.js", "Express", "MongoDB", "Mongoose", "NanoID", "JWT", "bcrypt", "Zod", "Redis", "Docker", "Docker Compose"],
      features: [
        "Token-Bucket Rate Limiter: Custom Redis Lua scripting executing atomic token consumption to prevent API abuse.",
        "Redis Auth State: Cached session state and fast user verification reducing database read load.",
        "Ownership Controls & Analytics: Authenticated link ownership, total click counting, and last-click tracking.",
        "Authentication Suite: Google OAuth integration, protected REST endpoints, and OTP-based password recovery.",
        "High-Speed Redirection: NanoID slug generation with fast key lookup and HTTP 302 redirection.",
        "Multi-Container Architecture: Orchestrated with Docker & Docker Compose for service isolation."
      ],
      engineeringHighlights: [
        { label: "Rate Limiting", value: "Redis Token-Bucket via Atomic Lua Scripts" },
        { label: "Auth Infrastructure", value: "Google OAuth, JWT & OTP Password Recovery" },
        { label: "Orchestration", value: "Multi-service Docker Compose Pipeline" }
      ],
      github: "https://github.com/Nirbhayjakhar3196/url-shortner",
      live: "https://url-shortner-ekul.vercel.app/"
    },
    {
      title: "AI Study Assistant",
      date: "Aug 2026",
      type: "ai",
      categoryLabel: "Document-Grounded RAG & GenAI Pipeline",
      problem: "Enables students to query their own study material and receive responses grounded strictly in relevant sections of uploaded documents rather than relying only on general model knowledge.",
      architectureHighlight: "Full RAG pipeline with 300-word overlapping chunks, cosine similarity & Web Streams.",
      extendedDesc: "An AI-powered academic assistant implementing a full Retrieval-Augmented Generation (RAG) pipeline. Extracts and chunks PDF text, generates vector embeddings, retrieves top-3 relevant context chunks using cosine similarity, and streams Gemini 2.5 Flash responses.",
      tech: ["Next.js", "React", "Gemini 2.5 Flash", "PDF Parsing", "Embeddings", "Vector Storage", "Cosine Similarity", "Web Streams API"],
      features: [
        "PDF Text Extraction & Cleaning: Automated parsing of raw document files into clean structured text.",
        "Overlapping Chunking: 300-word text windows with 50-word overlaps to preserve semantic continuity across chunk boundaries.",
        "Vector Embeddings: High-dimensional semantic vector representations for document chunks and user queries.",
        "Cosine-Similarity Search: Top-3 most relevant context retrieval via mathematical cosine similarity scores.",
        "Prompt Augmentation: Context-grounded prompt construction preventing hallucination.",
        "Real-Time Streaming: Instant token-by-token response rendering using the Web Streams API."
      ],
      engineeringHighlights: [
        { label: "RAG Pipeline", value: "PDF → Text Extraction → 300-word Chunks (50 overlap) → Embeddings → Top-3 Retrieval" },
        { label: "Model & Streaming", value: "Gemini 2.5 Flash with Web Streams API" },
        { label: "Context Grounding", value: "Cosine Similarity Vector Matching" }
      ],
      github: "https://github.com/Nirbhayjakhar3196/ai-study-assistance",
      live: null
    }
  ];

  return (
    <div id="projects" ref={containerRef} className="relative w-full h-[125vh] md:h-[125vh] bg-[#030308]">
      
      {/* Sticky viewport frame */}
      <div className="sticky top-0 w-full h-screen overflow-hidden flex flex-col justify-center">
        
        {/* Background Grid */}
        <div className="absolute inset-0 cyber-grid opacity-20 pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-6 w-full relative z-10 select-none">
          {/* Header */}
          <div className="mb-8">
            <h2 className="text-3xl md:text-5xl font-black uppercase text-white tracking-widest leading-none">
              FEATURED <span className="text-cyber-cyan glow-text-cyan">PROJECTS</span>
            </h2>
            <div className="w-20 h-1 bg-gradient-to-r from-cyber-cyan to-transparent mt-4"></div>
          </div>
        </div>

        {/* Cinematic Horizontal Scroll Strip */}
        <div className="relative w-full overflow-hidden mt-2">
          <motion.div
            style={{ x: prefersReducedMotion ? 0 : xTranslation }}
            className="flex space-x-6 px-6 md:px-24 w-max pointer-events-auto items-center"
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
            <div className="w-[240px] h-[450px] flex-shrink-0 flex flex-col justify-center items-center text-center p-6 rounded-xl border border-dashed border-slate-800 bg-slate-900/20 glass-panel">
              <div className="p-3 rounded-full bg-cyber-cyan/10 border border-cyber-cyan/30 text-cyber-cyan mb-3">
                <GitBranch size={20} />
              </div>
              <span className="text-xs text-cyber-cyan font-mono mb-2 font-bold">ALL REPOSITORIES</span>
              <h4 className="text-xs font-display font-black text-slate-300 uppercase tracking-widest mb-4">
                Explore More on GitHub
              </h4>
              <a
                href="https://github.com/Nirbhayjakhar3196"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-cyber-cyan text-black rounded text-[11px] font-mono font-bold tracking-wider hover:bg-white transition-all flex items-center space-x-1.5 cursor-pointer"
              >
                <Github size={13} />
                <span>GitHub Profile</span>
              </a>
            </div>
          </motion.div>
        </div>

      </div>

      {/* Modal Detailed Architectural View overlay */}
      {selectedProject && (
        <div 
          onClick={() => setSelectedProject(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto cursor-pointer"
        >
          <motion.div 
            onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="w-full max-w-2xl bg-[#0c0c17] border border-cyber-cyan/50 p-6 md:p-8 rounded-xl relative shadow-[0_0_60px_rgba(0,240,255,0.25)] scanlines max-h-[90vh] overflow-y-auto cursor-default"
          >
            <div className="absolute inset-0 scanline-overlay pointer-events-none"></div>

            {/* Close Button */}
            <button
              onClick={() => setSelectedProject(null)}
              className="absolute top-4 right-4 p-1.5 rounded-full border border-slate-700 bg-black/60 text-slate-300 hover:text-cyber-cyan hover:border-cyber-cyan transition-colors cursor-pointer z-20"
              title="Close (or click anywhere outside)"
            >
              <X size={18} />
            </button>

            {/* Header */}
            <div className="border-b border-slate-800 pb-5 mb-6">
              <div className="flex items-center space-x-2 text-[11px] font-mono text-cyber-cyan tracking-wider font-semibold mb-1">
                <span>{selectedProject.date}</span>
                {selectedProject.live && (
                  <span className="px-2 py-0.5 rounded bg-cyber-green/10 border border-cyber-green/40 text-cyber-green text-[9px] font-bold animate-pulse">
                    LIVE DEMO AVAILABLE
                  </span>
                )}
              </div>
              <h3 className="text-xl md:text-2xl font-display font-black text-white uppercase tracking-wider">
                {selectedProject.title}
              </h3>
              <p className="text-xs text-cyber-yellow font-mono mt-1 mb-4">
                {selectedProject.categoryLabel}
              </p>

              {/* Quick Action Link Badges at top of modal */}
              <div className="flex flex-wrap items-center gap-2.5 pt-2">
                <a
                  href={selectedProject.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-md bg-slate-900 border border-cyber-cyan/50 text-cyber-cyan hover:bg-cyber-cyan hover:text-black transition-all text-xs font-mono font-bold tracking-wide"
                >
                  <Github size={14} />
                  <span>Repo: {selectedProject.github.replace('https://github.com/', '')}</span>
                  <ExternalLink size={11} />
                </a>

                {selectedProject.live && (
                  <a
                    href={selectedProject.live}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-md bg-cyber-magenta/15 border border-cyber-magenta text-white hover:bg-cyber-magenta hover:text-white transition-all text-xs font-mono font-bold tracking-wide shadow-[0_0_12px_rgba(255,0,127,0.3)]"
                  >
                    <ExternalLink size={14} className="text-cyber-magenta" />
                    <span>Live Demo Link</span>
                    <ExternalLink size={11} />
                  </a>
                )}
              </div>
            </div>

            {/* Body */}
            <div className="space-y-6 mb-8 text-slate-300 font-sans">
              
              {/* Problem / Overview */}
              <div>
                <h4 className="text-xs font-display font-bold text-white tracking-wider uppercase mb-2 flex items-center space-x-1.5">
                  <span className="w-1.5 h-1.5 bg-cyber-cyan rounded-full"></span>
                  <span>Problem & Use Case:</span>
                </h4>
                <p className="text-xs md:text-sm text-slate-300 leading-relaxed bg-black/40 p-3.5 rounded border border-slate-800/80">
                  {selectedProject.problem}
                </p>
              </div>

              {/* Engineering Highlights Table / Cards */}
              <div>
                <h4 className="text-xs font-display font-bold text-cyber-cyan tracking-wider uppercase mb-2.5 flex items-center space-x-1.5">
                  <span className="w-1.5 h-1.5 bg-cyber-cyan rounded-full"></span>
                  <span>Engineering Highlights & Architecture:</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {selectedProject.engineeringHighlights.map((hl, hIdx) => (
                    <div key={hIdx} className="p-3 rounded bg-slate-900/60 border border-slate-800">
                      <div className="text-[10px] font-mono text-slate-400 uppercase">{hl.label}</div>
                      <div className="text-xs font-mono font-bold text-white mt-0.5">{hl.value}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* System Specifications / Implementation Points */}
              <div>
                <h4 className="text-xs font-display font-bold text-cyber-yellow tracking-wider uppercase mb-2.5 flex items-center space-x-1.5">
                  <span className="w-1.5 h-1.5 bg-cyber-yellow rounded-full"></span>
                  <span>Key Implementation Specifications:</span>
                </h4>
                <ul className="space-y-2 text-xs text-slate-300 font-sans">
                  {selectedProject.features.map((feat, idx) => (
                    <li key={idx} className="flex items-start">
                      <CheckCircle2 size={13} className="text-cyber-cyan mr-2 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Tech Stack Badges */}
              <div>
                <h4 className="text-xs font-display font-bold text-slate-400 tracking-wider uppercase mb-2">
                  Technologies & Frameworks:
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {selectedProject.tech.map((t, idx) => (
                    <span 
                      key={idx} 
                      className="px-2.5 py-1 border border-cyber-cyan/35 text-cyber-cyan bg-cyber-cyan/5 text-[10px] font-mono tracking-wider font-semibold rounded"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>

            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 font-display pt-5 border-t border-slate-800">
              <a
                href={selectedProject.github}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center space-x-2 px-5 py-3.5 bg-cyber-cyan text-black hover:bg-white border border-cyber-cyan rounded-lg text-xs tracking-wider font-black transition-all cursor-pointer shadow-[0_0_20px_rgba(0,240,255,0.3)]"
              >
                <Github size={16} />
                <span>View GitHub Repository</span>
              </a>
              
              {selectedProject.live && (
                <a
                  href={selectedProject.live}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center space-x-2 px-5 py-3.5 bg-cyber-magenta/20 border-2 border-cyber-magenta text-white hover:bg-cyber-magenta hover:text-white rounded-lg text-xs tracking-wider font-black transition-all cursor-pointer shadow-[0_0_25px_rgba(255,0,127,0.4)]"
                >
                  <ExternalLink size={16} />
                  <span>Open Live Demo</span>
                </a>
              )}
            </div>

          </motion.div>
        </div>
      )}

    </div>
  );
};

export default ProjectShowcase;

