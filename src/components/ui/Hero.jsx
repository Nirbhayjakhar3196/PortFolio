import React, { Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, Shield, Github, Linkedin, Code2, Mail } from 'lucide-react';
import { useLenis } from 'lenis/react';
import * as THREE from 'three';
import CyberParticles from '../canvas/CyberParticles';

const RobotWorkstation = React.lazy(() => import('../canvas/RobotWorkstation'));

// A custom cyberpunk loading screen inside the canvas
const CanvasLoader = () => {
  return (
    <Html center>
      <div className="flex flex-col items-center justify-center font-mono text-cyber-cyan text-xs">
        <div className="w-12 h-12 border-2 border-cyber-cyan border-t-transparent rounded-full animate-spin mb-4"></div>
        <div className="animate-pulse tracking-widest font-cyber">INIT_CYBER_ENV...</div>
      </div>
    </Html>
  );
};

// Import Drei helpers inside Hero to support performance and loader fallbacks
import { Html, AdaptiveDpr, AdaptiveEvents } from '@react-three/drei';

const Hero = () => {
  const prefersReducedMotion = useReducedMotion();

  const lenis = useLenis();

  const handleScrollTo = (id) => {
    if (lenis) {
      lenis.scrollTo(`#${id}`);
    } else {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  // Scene controller that handles camera zoom on scroll
  const CameraController = () => {
    useFrame((state) => {
      if (prefersReducedMotion) {
        // Static camera for accessibility
        state.camera.position.set(0, 0.5, 4.5);
        state.camera.lookAt(0, 0, 0);
        return;
      }
      
      const currentScrollY = typeof window !== 'undefined' ? window.scrollY : 0;
      // Starting camera position: [0, 0.5, 4.5]
      // Zoom in deeper based on scroll (camera moves closer, Z decreases)
      const targetZ = Math.max(1.8, 4.5 - currentScrollY * 0.0045);
      const targetY = 0.5 - currentScrollY * 0.0008;
      
      state.camera.position.z = THREE.MathUtils.lerp(state.camera.position.z, targetZ, 0.05);
      state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, targetY, 0.05);
      
      // Look slightly down as camera zooms
      state.camera.lookAt(0, -0.3, -0.5);
    });
    return null;
  };


  // Text Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { y: prefersReducedMotion ? 0 : 30, opacity: 0, filter: prefersReducedMotion ? 'none' : 'blur(10px)' },
    visible: { 
      y: 0, 
      opacity: 1, 
      filter: 'none',
      transition: { type: 'spring', stiffness: 100, damping: 15 }
    }
  };

  return (
    <section id="home" className="relative w-full h-screen flex items-center justify-center overflow-hidden bg-[#030308]">
      {/* Background Cyber Grid */}
      <div className="absolute inset-0 cyber-grid opacity-30 pointer-events-none"></div>
      
      {/* Neon ambient gradients */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-cyber-cyan/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-cyber-magenta/10 rounded-full blur-[120px] pointer-events-none"></div>

      {/* 3D Canvas Background */}
      <div className="absolute inset-0 z-0">
        <Canvas
          camera={{ position: [0, 0.5, 4.5], fov: 60 }}
          gl={{ antialias: true, powerPreference: "high-performance" }}
        >
          <color attach="background" args={['#030308']} />
          <ambientLight intensity={0.2} />
          
          {/* Cyberpunk Neon Lighting */}
          <pointLight position={[-4, 3, 2]} color="#00f0ff" intensity={1.5} distance={15} />
          <pointLight position={[4, 3, 2]} color="#ff007f" intensity={1.5} distance={15} />
          <pointLight position={[0, 4, -2]} color="#39ff14" intensity={0.8} distance={10} />
          
          <Suspense fallback={<CanvasLoader />}>
            <RobotWorkstation />
            <CyberParticles count={120} />
            <CameraController />
            <AdaptiveDpr pixelated />
            <AdaptiveEvents />
          </Suspense>
        </Canvas>
      </div>

      {/* UI Content Overlay */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center select-none pointer-events-none mt-12">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="glass-panel p-8 md:p-12 rounded-lg border-cyber-cyan/20 pointer-events-auto shadow-[0_0_50px_rgba(0,0,0,0.8)] relative overflow-hidden"
        >
          {/* Futuristic corners */}
          <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-cyber-cyan"></div>
          <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-cyber-cyan"></div>
          <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-cyber-cyan"></div>
          <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-cyber-cyan"></div>

          {/* Subtitle tag */}
          <motion.div 
            variants={itemVariants} 
            className="inline-flex items-center space-x-1.5 px-3 py-1 bg-cyber-cyan/10 border border-cyber-cyan/30 rounded text-[10px] md:text-xs tracking-[0.25em] font-display text-cyber-cyan font-bold glow-text-cyan uppercase mb-6"
          >
            <Shield size={10} className="animate-pulse" />
            <span>SOFTWARE ENGINEERING INTERN // FULL-STACK & BACKEND</span>
          </motion.div>

          {/* Main Title */}
          <motion.h1 
            variants={itemVariants}
            className="text-4xl md:text-7xl font-extrabold tracking-wider text-white mb-4 uppercase drop-shadow-[0_0_15px_rgba(0,240,255,0.2)]"
          >
            Nirbhay <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyber-cyan to-cyber-magenta">Jakhar</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.h2 
            variants={itemVariants}
            className="text-xs md:text-sm tracking-[0.15em] font-display font-semibold text-cyber-yellow glow-text-yellow mb-6 uppercase"
          >
            Full-Stack Developer • Backend Architect • AI Applications
          </motion.h2>

          {/* Description */}
          <motion.p 
            variants={itemVariants}
            className="text-slate-300 text-sm md:text-base max-w-2xl mx-auto leading-relaxed mb-8 font-sans"
          >
            Computer Science student specializing in full-stack development and AI applications. Hands-on experience building scalable web platforms, layered REST APIs, Redis-backed systems, and document-grounded RAG pipelines.
          </motion.p>

          {/* Primary & Secondary Action Buttons */}
          <motion.div 
            variants={itemVariants}
            className="flex flex-col sm:flex-row items-center justify-center gap-3 font-display mb-6"
          >
            <button
              onClick={() => handleScrollTo('projects')}
              className="w-full sm:w-auto flex items-center justify-center space-x-2 px-6 py-3 bg-cyber-cyan text-black hover:bg-black hover:text-cyber-cyan border border-cyber-cyan rounded text-xs tracking-widest font-black transition-all duration-300 hover:shadow-[0_0_20px_rgba(0,240,255,0.4)] cursor-pointer"
            >
              <span>VIEW_PROJECTS</span>
              <ArrowRight size={14} />
            </button>

            <button
              onClick={() => handleScrollTo('contact')}
              className="w-full sm:w-auto flex items-center justify-center space-x-2 px-6 py-3 bg-transparent text-white border border-slate-700 hover:border-cyber-magenta hover:text-cyber-magenta rounded text-xs tracking-widest font-bold transition-all duration-300 hover:shadow-[0_0_15px_rgba(255,0,127,0.3)] cursor-pointer"
            >
              <Mail size={14} />
              <span>CONNECT_ME</span>
            </button>
          </motion.div>

          {/* Direct Profile Links Strip */}
          <motion.div
            variants={itemVariants}
            className="flex flex-wrap items-center justify-center gap-2 pt-2 border-t border-slate-800/80 font-mono text-[11px]"
          >
            <a
              href="https://github.com/Nirbhayjakhar3196"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded bg-black/40 border border-slate-800 text-slate-300 hover:text-cyber-cyan hover:border-cyber-cyan transition-all"
            >
              <Github size={13} />
              <span>GitHub</span>
            </a>

            <a
              href="https://www.linkedin.com/in/nirbhay-jakhar-0b52103b2/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded bg-black/40 border border-slate-800 text-slate-300 hover:text-cyber-cyan hover:border-cyber-cyan transition-all"
            >
              <Linkedin size={13} />
              <span>LinkedIn</span>
            </a>

            <a
              href="https://leetcode.com/u/Nirbhayjakhar000"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded bg-black/40 border border-slate-800 text-slate-300 hover:text-cyber-yellow hover:border-cyber-yellow transition-all"
            >
              <Code2 size={13} />
              <span>LeetCode (210+)</span>
            </a>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center pointer-events-none">
        <span className="text-[10px] text-slate-400 font-display tracking-widest mb-1.5 opacity-75">SCROLL</span>
        <div className="w-4 h-7 border border-cyber-cyan/30 rounded-full flex justify-center p-1">
          <div className="w-1.5 h-1.5 bg-cyber-cyan rounded-full animate-bounce"></div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
