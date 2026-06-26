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
