import React, { useState, useEffect, useRef } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Terminal, Github, Linkedin, ExternalLink, Mail, CheckCircle, Send, Copy, Check } from 'lucide-react';

const Contact = () => {
  const prefersReducedMotion = useReducedMotion();
  const [terminalText, setTerminalText] = useState('');
  const [hasStartedTyping, setHasStartedTyping] = useState(false);
  const [typingStage, setTypingStage] = useState(0); // 0: typing, 1: access granted, 2: show form
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStage, setSubmitStage] = useState(0); // 0: idle, 1: packaging, 2: sending, 3: success
  const [copiedEmail, setCopiedEmail] = useState(false);

  const sectionRef = useRef(null);
  const targetCommand = 'hire --developer Nirbhay';

  // Intersection Observer to trigger typing animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasStartedTyping) {
          setHasStartedTyping(true);
        }
      },
      { threshold: 0.15 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, [hasStartedTyping]);

  // Typing effect loop
  useEffect(() => {
    if (!hasStartedTyping) return;

    if (prefersReducedMotion) {
      setTerminalText(targetCommand);
      setTypingStage(2);
      return;
    }

    let index = 0;
    const interval = setInterval(() => {
      setTerminalText((prev) => prev + targetCommand[index]);
      index++;
      if (index >= targetCommand.length) {
        clearInterval(interval);
        
        // Pause then print output
        setTimeout(() => {
          setTypingStage(1);
          
          // Pause then show form
          setTimeout(() => {
            setTypingStage(2);
          }, 1000);
        }, 500);
      }
    }, 60);

    return () => clearInterval(interval);
  }, [hasStartedTyping, prefersReducedMotion]);

  // Copy email clip
  const handleCopyEmail = () => {
    navigator.clipboard.writeText('jakharnirbhay0000@gmail.com');
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  // Submit Handler
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    setIsSubmitting(true);
    setSubmitStage(1);

    // Multi-stage logging simulation
    setTimeout(() => {
      setSubmitStage(2); // sending
      setTimeout(() => {
        setSubmitStage(3); // success
        setIsSubmitting(false);
        setFormData({ name: '', email: '', message: '' });
      }, 1500);
    }, 1200);
  };

  const socialLinks = [
    { name: 'GitHub', url: 'https://github.com', icon: Github, color: 'hover:text-cyber-cyan hover:border-cyber-cyan' },
    { name: 'LinkedIn', url: 'https://linkedin.com', icon: Linkedin, color: 'hover:text-cyber-blue hover:border-cyber-blue' },
    { name: 'LeetCode', url: 'https://leetcode.com', icon: Terminal, color: 'hover:text-cyber-yellow hover:border-cyber-yellow' }
  ];

  return (
    <section id="contact" ref={sectionRef} className="relative w-full pt-10 md:pt-16 pb-10 md:pb-16 bg-[#05050c] overflow-hidden flex flex-col justify-center">
      {/* Background dense grid */}
      <div className="absolute inset-0 cyber-grid-dense opacity-20 pointer-events-none"></div>

      <div className="max-w-4xl mx-auto px-6 w-full relative z-10">
        
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 px-3 py-1 bg-cyber-cyan/10 border border-cyber-cyan/30 rounded text-[10px] tracking-[0.25em] font-display text-cyber-cyan font-bold uppercase mb-4">
            <span className="w-1.5 h-1.5 bg-cyber-cyan rounded-full animate-ping"></span>
            <span>SEC_CONNECT_PORTAL</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-black uppercase text-white tracking-widest">
            CONTACT <span className="text-cyber-cyan glow-text-cyan">TERMINAL</span>
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-cyber-cyan to-transparent mx-auto mt-4"></div>
        </div>

        {/* Terminal Container */}
        <div className="glass-panel rounded-xl border-cyber-cyan/20 overflow-hidden shadow-2xl relative scanlines">
          <div className="absolute inset-0 scanline-overlay"></div>

          {/* Terminal Window Header */}
          <div className="bg-[#0b0b14] px-4 py-3 flex justify-between items-center border-b border-slate-800/80">
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500/80"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-green-500/80"></span>
              <span className="text-[10px] font-mono text-slate-400 font-bold tracking-widest pl-2">
                LET'S BUILD SOMETHING AMAZING
              </span>
            </div>
            <span className="text-[8px] font-mono text-cyber-cyan opacity-80">STATION_NJ.DLL</span>
          </div>

          {/* Terminal Body */}
          <div className="p-6 md:p-8 font-mono text-xs md:text-sm text-slate-300 min-h-[380px] flex flex-col">
            
            {/* 1. Prompt Command entry */}
            <div className="flex items-center space-x-1.5 mb-3 select-none">
              <span className="text-cyber-magenta font-bold">guest@nirbhay-dev:~$</span>
              <span className="text-white font-bold">&gt;</span>
              <span className="text-cyber-cyan font-bold">{terminalText}</span>
              {typingStage === 0 && <span className="w-2 h-4 bg-cyber-cyan animate-pulse"></span>}
            </div>

            {/* 2. Output status lines */}
            {typingStage >= 1 && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-1 text-[11px] mb-6 text-cyber-green select-none"
              >
                <div>[SYS] Checking credentials... OK</div>
                <div>[SYS] Access Level: RECRUITER_READONLY</div>
                <div className="font-bold glow-text-green">ACCESS GRANTED: LOADING_CONTACT_SHELL...</div>
              </motion.div>
            )}

            {/* 3. Interactive Form loading */}
            {typingStage === 2 && submitStage !== 3 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex-1 flex flex-col"
              >
                <form onSubmit={handleSubmit} className="space-y-5 flex-1">
                  
                  {/* Name Input */}
                  <div className="flex flex-col md:flex-row md:items-center gap-2">
                    <label className="text-cyber-cyan font-semibold w-full md:w-32 flex-shrink-0 select-none">
                      guest_name:
                    </label>
                    <input
                      type="text"
                      required
                      disabled={isSubmitting}
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="ENTER_YOUR_NAME"
                      className="flex-1 bg-black/40 border border-slate-800 rounded px-3 py-2 text-white placeholder-slate-600 focus:outline-none focus:border-cyber-cyan focus:shadow-[0_0_10px_rgba(0,240,255,0.15)] transition-all font-mono"
                    />
                  </div>

                  {/* Email Input */}
                  <div className="flex flex-col md:flex-row md:items-center gap-2">
                    <label className="text-cyber-cyan font-semibold w-full md:w-32 flex-shrink-0 select-none">
                      guest_email:
                    </label>
                    <input
                      type="email"
                      required
                      disabled={isSubmitting}
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="ENTER_YOUR_EMAIL"
                      className="flex-1 bg-black/40 border border-slate-800 rounded px-3 py-2 text-white placeholder-slate-600 focus:outline-none focus:border-cyber-cyan focus:shadow-[0_0_10px_rgba(0,240,255,0.15)] transition-all font-mono"
                    />
                  </div>

                  {/* Message Area */}
                  <div className="flex flex-col md:flex-row md:items-start gap-2">
                    <label className="text-cyber-cyan font-semibold w-full md:w-32 flex-shrink-0 mt-2 select-none">
                      payload_msg:
                    </label>
                    <textarea
                      required
                      rows="4"
                      disabled={isSubmitting}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="TYPE_YOUR_MESSAGE_OBJECT_HERE"
                      className="flex-1 bg-black/40 border border-slate-800 rounded px-3 py-2 text-white placeholder-slate-600 focus:outline-none focus:border-cyber-cyan focus:shadow-[0_0_10px_rgba(0,240,255,0.15)] transition-all font-mono resize-none"
                    />
                  </div>

                  {/* Form Submission controls */}
                  <div className="border-t border-slate-800/80 pt-6 mt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
                    {/* Social links */}
                    <div className="flex space-x-3.5">
                      {socialLinks.map((link, idx) => {
                        const Icon = link.icon;
                        return (
                          <a
                            key={idx}
                            href={link.url}
                            target="_blank"
                            rel="noreferrer"
                            className={`p-2 border border-slate-800 bg-black/20 rounded-lg text-slate-400 transition-all duration-300 ${link.color}`}
                          >
                            <Icon size={16} />
                          </a>
                        );
                      })}
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full sm:w-auto px-6 py-2.5 bg-cyber-cyan text-black hover:bg-black hover:text-cyber-cyan border border-cyber-cyan font-display text-xs tracking-widest font-black rounded flex items-center justify-center space-x-2 transition-all duration-300 disabled:opacity-40 cursor-pointer"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-3.5 h-3.5 border border-black border-t-transparent rounded-full animate-spin"></div>
                          <span>TRANSMITTING...</span>
                        </>
                      ) : (
                        <>
                          <Send size={12} />
                          <span>SEND_PAYLOAD</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>

                {/* Submitting Log Readout */}
                {isSubmitting && (
                  <div className="text-[10px] text-slate-500 font-mono mt-4 space-y-0.5 border-t border-slate-900 pt-4">
                    {submitStage >= 1 && <div>&gt; compile_payload --data=name,email,msg [OK]</div>}
                    {submitStage >= 2 && <div className="text-cyber-magenta animate-pulse">&gt; encrypting SSL packet... routing SMTP proxy tunnel... [IN_PROGRESS]</div>}
                  </div>
                )}

              </motion.div>
            )}

            {/* 4. Submission Success Overlay */}
            {submitStage === 3 && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex-1 flex flex-col items-center justify-center text-center space-y-6"
              >
                <div className="p-4 border-2 border-cyber-green rounded-full bg-cyber-green/5 text-cyber-green shadow-[0_0_20px_rgba(57,255,20,0.3)]">
                  <CheckCircle size={36} className="animate-bounce" />
                </div>
                
                <div>
                  <h4 className="text-base font-display font-black text-cyber-green tracking-widest uppercase mb-1">
                    TRANSMISSION_COMPLETE
                  </h4>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto font-sans leading-relaxed">
                    Packet payload has been encrypted and sent to Nirbhay's system inbox. Response logs will trigger shortly.
                  </p>
                </div>

                <div className="border border-cyber-green/30 bg-cyber-green/5 px-4 py-2.5 rounded font-mono text-[10px] text-cyber-green">
                  STATUS: SUCCESS [CODE_200_OK] // PAYLOAD_SHIPPED
                </div>

                <button
                  onClick={() => setSubmitStage(0)}
                  className="px-4 py-1.5 border border-slate-800 text-slate-500 hover:text-white hover:border-slate-600 transition-colors text-[10px] font-mono tracking-widest uppercase rounded cursor-pointer"
                >
                  SEND_ANOTHER_PACKET
                </button>
              </motion.div>
            )}

          </div>
        </div>

        {/* Email Copy HUD panel */}
        <div className="mt-8 flex flex-col md:flex-row justify-between items-center gap-4 p-4 glass-panel rounded-lg border-cyber-cyan/10">
          <div className="flex items-center space-x-3">
            <div className="p-2 border border-cyber-cyan/40 bg-cyber-cyan/5 rounded text-cyber-cyan shrink-0">
              <Mail size={16} />
            </div>
            <div className="text-left font-mono">
              <div className="text-[9px] text-slate-500 tracking-wider">SECURE_DIRECT_EMAIL</div>
              <div className="text-xs text-white font-bold select-all">jakharnirbhay0000@gmail.com</div>
            </div>
          </div>
          
          <button
            onClick={handleCopyEmail}
            className="flex items-center space-x-1.5 px-3 py-1.5 border border-slate-800 hover:border-cyber-cyan/50 hover:text-cyber-cyan rounded font-mono text-[10px] transition-colors cursor-pointer shrink-0"
          >
            {copiedEmail ? (
              <>
                <Check size={10} className="text-cyber-green" />
                <span className="text-cyber-green font-bold">COPIED_OK</span>
              </>
            ) : (
              <>
                <Copy size={10} />
                <span>COPY_EMAIL</span>
              </>
            )}
          </button>
        </div>

        {/* Footer */}
        <footer className="mt-20 border-t border-slate-900 pt-8 text-center text-[10px] font-mono text-slate-600 space-y-2 select-none">
          <div>
            DESIGNED & DEVELOPED BY <span className="text-cyber-cyan font-bold">NIRBHAY JAKHAR</span>.
          </div>
          <div className="text-[8px] opacity-60">
            BUILT WITH REACT + VITE + TAILWIND_V4 + R3F + FRAMER_MOTION. ALL RIGHTS RESERVED.
          </div>
        </footer>

      </div>
    </section>
  );
};

export default Contact;
