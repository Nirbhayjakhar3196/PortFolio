import React, { useState, useEffect } from 'react';
import { ReactLenis } from 'lenis/react';
import Navbar from './components/ui/Navbar';
import Hero from './components/ui/Hero';
import About from './components/ui/About';
import Skills from './components/ui/Skills';
import ProjectShowcase from './components/ui/ProjectShowcase';
import Achievements from './components/ui/Achievements';
import Contact from './components/ui/Contact';
import InteractiveCursor from './components/ui/InteractiveCursor';
import NeonDivider from './components/ui/NeonDivider';

// Futuristic Startup Console Loader
const BootLoader = ({ onComplete }) => {
  const [percent, setPercent] = useState(0);
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const startupLogs = [
      'BOOTING_SEQUENCE_START...',
      'LOADING_KERNEL_MODULES... [OK]',
      'INSPECTING_WEBGL2_CONTEXT... [OK]',
      'SYNC_ORBITAL_TRAJECTORIES... [OK]',
      'COMPILING_SHADERS_LIBRARY... [OK]',
      'DECRYPTING_SECURE_PAYLOAD... [OK]',
      'ESTABLISHING_SMTP_PORTAL... [OK]',
      'SYSTEM_BOOT_SUCCESSFUL [NJ_SYS_V1]'
    ];

    let currentLogIndex = 0;
    const logInterval = setInterval(() => {
      if (currentLogIndex < startupLogs.length) {
        setLogs(prev => [...prev, startupLogs[currentLogIndex]]);
        currentLogIndex++;
      }
    }, 220);

    const speed = 15; // ms per percent
    const progress = setInterval(() => {
      setPercent((prev) => {
        if (prev >= 100) {
          clearInterval(progress);
          clearInterval(logInterval);
          setTimeout(onComplete, 500); // fade delay
          return 100;
        }
        return prev + 1;
      });
    }, speed);

    return () => {
      clearInterval(progress);
      clearInterval(logInterval);
    };
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-50 bg-[#030308] flex flex-col justify-between p-8 font-mono select-none scanlines text-cyber-cyan">
      <div className="absolute inset-0 scanline-overlay"></div>
      
      {/* HUD Header */}
      <div className="flex justify-between items-center border-b border-cyber-cyan/30 pb-4">
        <div className="flex items-center space-x-2 text-[10px] md:text-xs">
          <span className="w-2.5 h-2.5 rounded bg-cyber-cyan animate-pulse"></span>
          <span className="font-bold tracking-widest">NIRBHAY_JAKHAR // DEV_LAB</span>
        </div>
        <div className="text-[9px] text-slate-500">BOOT_NODE_01</div>
      </div>

      {/* Boot Logs */}
      <div className="flex-1 flex flex-col justify-end py-10 space-y-1.5 text-[9px] md:text-xs max-w-xl">
        {logs.map((log, idx) => (
          <div key={idx} className="flex space-x-2">
            <span className="opacity-50">&gt;</span>
            <span className={idx === logs.length - 1 ? "text-cyber-green font-bold" : ""}>{log}</span>
          </div>
        ))}
      </div>

      {/* Loading Progress */}
      <div className="space-y-4 border-t border-cyber-cyan/30 pt-6">
        <div className="flex justify-between items-center text-xs">
          <span className="font-bold tracking-widest animate-pulse font-cyber text-cyber-cyan">BOOTING_ENVIRONMENT</span>
          <span className="font-bold text-cyber-yellow">{percent}%</span>
        </div>
        
        {/* Progress Bar Track */}
        <div className="w-full h-1 bg-slate-950 border border-cyber-cyan/20 rounded overflow-hidden relative">
          <div 
            className="h-full bg-gradient-to-r from-cyber-cyan to-cyber-magenta transition-all duration-75 shadow-[0_0_10px_rgba(0,240,255,0.6)]"
            style={{ width: `${percent}%` }}
          ></div>
        </div>
        
        <div className="flex justify-between text-[8px] text-slate-500 font-mono">
          <div>LAT: 28.6139 | LNG: 77.2090</div>
          <div>MEM_LOAD: 2.14GB / 8.00GB</div>
        </div>
      </div>
    </div>
  );
};

function App() {
  const [booting, setBooting] = useState(true);

  // Global premium 3D tilt and lift interaction for all cards (About, Achievements, Contact, Skills HUD, Hero)
  useEffect(() => {
    if (booting) return;

    let activeCard = null;

    const handleMouseMove = (e) => {
      const card = e.target.closest('.glass-panel, .glass-panel-magenta, .glass-panel-blue');
      if (!card) {
        if (activeCard) {
          resetCard(activeCard);
          activeCard = null;
        }
        return;
      }

      // Skip project cards (they use custom Framer Motion springs for tilt/lift)
      // and skip any containers housing canvases or explicit no-tilt instructions
      if (card.closest('#projects') || card.querySelector('canvas') || card.classList.contains('no-tilt')) {
        return;
      }

      if (activeCard && activeCard !== card) {
        resetCard(activeCard);
      }

      activeCard = card;
      updateCardTilt(card, e);
    };

    const handleMouseLeave = () => {
      if (activeCard) {
        resetCard(activeCard);
        activeCard = null;
      }
    };

    const updateCardTilt = (card, e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const px = (x / rect.width) - 0.5;
      const py = (y / rect.height) - 0.5;

      // Premium subtle 3D tilt (max 8 degrees rotation)
      const tiltX = -py * 8;
      const tiltY = px * 8;

      card.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateY(-8px) scale(1.015)`;
      card.style.transition = 'transform 0.12s cubic-bezier(0.215, 0.61, 0.355, 1)';
      card.style.transformStyle = 'preserve-3d';
      
      card.style.setProperty('--mouse-x', `${(x / rect.width) * 100}%`);
      card.style.setProperty('--mouse-y', `${(y / rect.height) * 100}%`);
    };

    const resetCard = (card) => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px) scale(1)';
      card.style.transition = 'transform 0.35s cubic-bezier(0.215, 0.61, 0.355, 1)';
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [booting]);

  return (
    <>
      {booting ? (
        <BootLoader onComplete={() => setBooting(false)} />
      ) : (
        <ReactLenis root>
          <div className="relative min-h-screen text-slate-100 overflow-x-hidden select-none bg-[#030308]">
            <InteractiveCursor />
            <Navbar />
            
            <main className="w-full">
              <Hero />
              <NeonDivider color="cyan" />
              <About />
              <NeonDivider color="magenta" />
              <Skills />
              <NeonDivider color="cyan" />
              <ProjectShowcase />
              <NeonDivider color="yellow" />
              <Achievements />
              <NeonDivider color="magenta" />
              <Contact />
            </main>
          </div>
        </ReactLenis>
      )}
    </>
  );
}

export default App;
