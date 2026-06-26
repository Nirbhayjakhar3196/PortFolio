import React, { useState, useEffect } from 'react';
import { Menu, X, Terminal, Cpu, Layers, User, Award, Mail } from 'lucide-react';
import { useLenis } from 'lenis/react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }

      // Track active section for scroll highlights
      const sections = ['home', 'about', 'skills', 'projects', 'achievements', 'contact'];
      const scrollPosition = window.scrollY + 100;

      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(section);
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'SYSTEM', id: 'home', icon: Cpu },
    { name: 'BIOMETRICS', id: 'about', icon: User },
    { name: 'CORE_SKILLS', id: 'skills', icon: Layers },
    { name: 'PROJECTS', id: 'projects', icon: Terminal },
    { name: 'ACHIEVEMENTS', id: 'achievements', icon: Award },
    { name: 'CONNECT', id: 'contact', icon: Mail }
  ];

  const lenis = useLenis();

  const handleLinkClick = (id) => {
    setIsOpen(false);
    if (lenis) {
      lenis.scrollTo(`#${id}`);
    } else {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
      scrolled 
        ? 'py-3 bg-cyber-bg/85 backdrop-blur-md border-b border-cyber-cyan/20 box-shadow' 
        : 'py-5 bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        {/* Logo */}
        <div 
          onClick={() => handleLinkClick('home')}
          className="flex items-center space-x-2 cursor-pointer font-display text-lg md:text-xl font-black text-cyber-cyan hover:scale-105 transition-transform"
        >
          <span className="inline-block w-2.5 h-2.5 bg-cyber-cyan animate-pulse rounded-sm"></span>
          <span>NIRBHAY.SYS</span>
          <span className="text-xs text-cyber-magenta font-mono">[v1.0.4]</span>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center space-x-1">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = activeSection === link.id;
            return (
              <button
                key={link.id}
                onClick={() => handleLinkClick(link.id)}
                className={`flex items-center space-x-1.5 px-4 py-2 rounded font-display text-xs tracking-widest font-semibold transition-all duration-200 ${
                  isActive
                    ? 'text-cyber-cyan border-b-2 border-cyber-cyan glow-text-cyan bg-cyber-cyan/5'
                    : 'text-slate-400 hover:text-cyber-cyan hover:bg-cyber-cyan/5 border-b-2 border-transparent'
                }`}
              >
                <Icon size={12} className={isActive ? 'animate-pulse' : ''} />
                <span>{link.name}</span>
              </button>
            );
          })}

          <button 
            onClick={() => handleLinkClick('contact')}
            className="ml-4 px-4 py-2 border border-cyber-magenta text-cyber-magenta rounded font-display text-xs tracking-widest hover:bg-cyber-magenta hover:text-white transition-all duration-300 hover:shadow-[0_0_15px_rgba(255,0,127,0.4)]"
          >
            PING_AGENT
          </button>
        </div>

        {/* Mobile Menu Button */}
        <div className="lg:hidden">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-1 text-slate-400 hover:text-cyber-cyan focus:outline-none transition-colors"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <div className={`lg:hidden fixed inset-y-0 right-0 z-40 w-72 max-w-full bg-[#07070f] border-l border-cyber-cyan/20 p-6 flex flex-col justify-between shadow-[0_0_50px_rgba(0,0,0,0.9)] transform transition-transform duration-300 ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        <div className="flex flex-col space-y-6 pt-12">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = activeSection === link.id;
            return (
              <button
                key={link.id}
                onClick={() => handleLinkClick(link.id)}
                className={`flex items-center space-x-3 px-4 py-3 rounded font-display text-sm tracking-widest text-left transition-all ${
                  isActive
                    ? 'text-cyber-cyan bg-cyber-cyan/10 border-l-2 border-cyber-cyan glow-text-cyan'
                    : 'text-slate-400 hover:text-cyber-cyan hover:bg-cyber-cyan/5'
                }`}
              >
                <Icon size={16} />
                <span>{link.name}</span>
              </button>
            );
          })}
        </div>

        <div className="flex flex-col space-y-4">
          <button 
            onClick={() => handleLinkClick('contact')}
            className="w-full py-3 border border-cyber-magenta text-cyber-magenta rounded font-display text-xs tracking-widest hover:bg-cyber-magenta hover:text-white transition-all text-center"
          >
            PING_AGENT
          </button>
          
          <div className="text-[10px] text-slate-500 font-mono text-center">
            LOC_LAT: 28.6139 | LOC_LONG: 77.2090
          </div>
        </div>
      </div>

      {/* Overlay backdrop when mobile drawer is open */}
      {isOpen && (
        <div 
          onClick={() => setIsOpen(false)}
          className="lg:hidden fixed inset-0 z-30 bg-black/60 backdrop-blur-sm"
        ></div>
      )}
    </nav>
  );
};

export default Navbar;
