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
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    const sections = ['home', 'about', 'skills', 'projects', 'achievements', 'contact'];
    
    const observerOptions = {
      root: null,
      rootMargin: '-30% 0px -30% 0px',
      threshold: 0
    };

    const observerCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) {
        observer.observe(el);
      }
    });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      observer.disconnect();
    };
  }, []);

  const navLinks = [
    { name: 'Home', id: 'home', icon: Cpu },
    { name: 'About Me', id: 'about', icon: User },
    { name: 'Skills', id: 'skills', icon: Layers },
    { name: 'Projects', id: 'projects', icon: Terminal },
    { name: 'Achievements', id: 'achievements', icon: Award },
    { name: 'Contact', id: 'contact', icon: Mail }
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
        ? 'py-3 bg-[#05050a]/90 backdrop-blur-md border-b border-cyber-cyan/20 shadow-lg' 
        : 'py-5 bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        {/* Logo */}
        <div 
          onClick={() => handleLinkClick('home')}
          className="flex items-center space-x-2 cursor-pointer font-display text-lg md:text-xl font-black text-white hover:text-cyber-cyan transition-colors"
        >
          <span className="inline-block w-2.5 h-2.5 bg-cyber-cyan rounded-full animate-pulse"></span>
          <span className="tracking-wider">NIRBHAY JAKHAR</span>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center space-x-2">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = activeSection === link.id;
            return (
              <button
                key={link.id}
                onClick={() => handleLinkClick(link.id)}
                className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded font-display text-xs tracking-wider font-semibold transition-all duration-200 cursor-pointer ${
                  isActive
                    ? 'text-cyber-cyan bg-cyber-cyan/10 border-b-2 border-cyber-cyan'
                    : 'text-slate-300 hover:text-cyber-cyan hover:bg-white/5 border-b-2 border-transparent'
                }`}
              >
                <Icon size={13} className={isActive ? 'text-cyber-cyan' : 'text-slate-400'} />
                <span>{link.name}</span>
              </button>
            );
          })}
        </div>

        {/* Mobile Menu Button */}
        <div className="lg:hidden">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-1.5 text-slate-300 hover:text-cyber-cyan focus:outline-none transition-colors"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <div className={`lg:hidden fixed inset-y-0 right-0 z-40 w-72 max-w-full bg-[#090913] border-l border-cyber-cyan/20 p-6 flex flex-col justify-between shadow-2xl transform transition-transform duration-300 ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        <div className="flex flex-col space-y-4 pt-10">
          <div className="flex justify-between items-center pb-4 border-b border-slate-800">
            <span className="font-display font-bold text-sm text-white">NIRBHAY JAKHAR</span>
            <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white">
              <X size={20} />
            </button>
          </div>
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = activeSection === link.id;
            return (
              <button
                key={link.id}
                onClick={() => handleLinkClick(link.id)}
                className={`flex items-center space-x-3 px-4 py-3 rounded font-display text-sm tracking-wider text-left transition-all ${
                  isActive
                    ? 'text-cyber-cyan bg-cyber-cyan/10 border-l-2 border-cyber-cyan font-bold'
                    : 'text-slate-300 hover:text-cyber-cyan hover:bg-white/5'
                }`}
              >
                <Icon size={16} />
                <span>{link.name}</span>
              </button>
            );
          })}
        </div>

        <div className="text-xs text-slate-500 font-mono text-center pt-6 border-t border-slate-800">
          Software Engineering Intern
        </div>
      </div>

      {/* Overlay backdrop when mobile drawer is open */}
      {isOpen && (
        <div 
          onClick={() => setIsOpen(false)}
          className="lg:hidden fixed inset-0 z-30 bg-black/70 backdrop-blur-sm"
        ></div>
      )}
    </nav>
  );
};

export default Navbar;
