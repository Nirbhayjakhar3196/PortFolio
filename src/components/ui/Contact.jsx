import React, { useState } from 'react';
import { motion } from 'framer-motion';
import emailjs from '@emailjs/browser';
import { Github, Linkedin, Mail, CheckCircle, Send, Copy, Check, Code2, AlertCircle } from 'lucide-react';

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [copiedEmail, setCopiedEmail] = useState(false);

  const recipientEmail = 'jakharnirbhay0000@gmail.com';
  const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
  const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
  const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

  // Copy email to clipboard
  const handleCopyEmail = () => {
    navigator.clipboard.writeText(recipientEmail);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  // Submit Handler using EmailJS
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setErrorMessage('Please fill out all fields before sending.');
      return;
    }

    setIsSubmitting(true);

    try {
      // If EmailJS credentials are provided in .env
      if (serviceId && templateId && publicKey) {
        const templateParams = {
          from_name: formData.name,
          from_email: formData.email,
          reply_to: formData.email,
          message: formData.message,
          to_email: recipientEmail
        };

        const response = await emailjs.send(
          serviceId,
          templateId,
          templateParams,
          publicKey
        );

        if (response.status === 200 || response.text === 'OK') {
          setIsSuccess(true);
          setFormData({ name: '', email: '', message: '' });
        } else {
          throw new Error('Email service returned non-200 status.');
        }
      } else {
        // Fallback when EmailJS keys are not yet configured: Open default email client with prefilled details
        const mailtoUrl = `mailto:${recipientEmail}?subject=${encodeURIComponent(
          `Portfolio Inquiry from ${formData.name}`
        )}&body=${encodeURIComponent(
          `Name: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`
        )}`;
        
        window.open(mailtoUrl, '_blank');
        setIsSuccess(true);
        setFormData({ name: '', email: '', message: '' });
      }
    } catch (err) {
      console.error('EmailJS submission error:', err);
      setErrorMessage(
        'Direct delivery encountered an issue. Opening your email app instead...'
      );
      const mailtoUrl = `mailto:${recipientEmail}?subject=${encodeURIComponent(
        `Portfolio Inquiry from ${formData.name}`
      )}&body=${encodeURIComponent(
        `Name: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`
      )}`;
      window.open(mailtoUrl, '_blank');
      setIsSuccess(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const socialLinks = [
    { name: 'GitHub', url: 'https://github.com/Nirbhayjakhar3196', icon: Github, color: 'hover:text-cyber-cyan hover:border-cyber-cyan' },
    { name: 'LinkedIn', url: 'https://www.linkedin.com/in/nirbhay-jakhar-0b52103b2/', icon: Linkedin, color: 'hover:text-cyber-cyan hover:border-cyber-cyan' },
    { name: 'LeetCode', url: 'https://leetcode.com/u/Nirbhayjakhar000', icon: Code2, color: 'hover:text-cyber-yellow hover:border-cyber-yellow' }
  ];

  return (
    <section id="contact" className="relative w-full pt-10 md:pt-16 pb-12 bg-[#05050c] overflow-hidden flex flex-col justify-center">
      {/* Background dense grid */}
      <div className="absolute inset-0 cyber-grid-dense opacity-20 pointer-events-none"></div>

      <div className="max-w-4xl mx-auto px-6 w-full relative z-10">
        
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-5xl font-black uppercase text-white tracking-widest">
            GET IN <span className="text-cyber-cyan glow-text-cyan">TOUCH</span>
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-cyber-cyan to-transparent mx-auto mt-4"></div>
          <p className="text-slate-400 text-sm mt-4 max-w-lg mx-auto">
            Interested in working together or discussing software engineering opportunities? Send a message or reach out directly.
          </p>
        </div>

        {/* Form Container */}
        <div className="glass-panel rounded-xl border-cyber-cyan/20 overflow-hidden shadow-2xl relative">
          <div className="p-6 md:p-8 flex flex-col">
            
            {!isSuccess ? (
              <form onSubmit={handleSubmit} className="space-y-5">
                
                {/* Name Input */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-slate-200 font-semibold text-xs tracking-wide">
                    Your Name
                  </label>
                  <input
                    type="text"
                    required
                    disabled={isSubmitting}
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter your name"
                    className="w-full bg-black/50 border border-slate-800 rounded px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-cyber-cyan focus:shadow-[0_0_12px_rgba(0,240,255,0.2)] transition-all font-sans text-sm"
                  />
                </div>

                {/* Email Input */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-slate-200 font-semibold text-xs tracking-wide">
                    Your Email
                  </label>
                  <input
                    type="email"
                    required
                    disabled={isSubmitting}
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="Enter your email address"
                    className="w-full bg-black/50 border border-slate-800 rounded px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-cyber-cyan focus:shadow-[0_0_12px_rgba(0,240,255,0.2)] transition-all font-sans text-sm"
                  />
                </div>

                {/* Message Area */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-slate-200 font-semibold text-xs tracking-wide">
                    Your Message
                  </label>
                  <textarea
                    required
                    rows="4"
                    disabled={isSubmitting}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Write your message here..."
                    className="w-full bg-black/50 border border-slate-800 rounded px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-cyber-cyan focus:shadow-[0_0_12px_rgba(0,240,255,0.2)] transition-all font-sans text-sm resize-none"
                  />
                </div>

                {/* Error Alert if any */}
                {errorMessage && (
                  <div className="p-3 rounded bg-red-500/10 border border-red-500/40 text-red-400 text-xs font-mono flex items-center space-x-2">
                    <AlertCircle size={15} className="shrink-0" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                {/* Controls */}
                <div className="border-t border-slate-800/80 pt-6 mt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
                  {/* Social links */}
                  <div className="flex space-x-3">
                    {socialLinks.map((link, idx) => {
                      const Icon = link.icon;
                      return (
                        <a
                          key={idx}
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`p-2.5 border border-slate-800 bg-black/40 rounded-lg text-slate-300 transition-all duration-200 ${link.color}`}
                          title={link.name}
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
                    className="w-full sm:w-auto px-7 py-3 bg-cyber-cyan text-black hover:bg-white border border-cyber-cyan font-display text-xs tracking-wider font-black rounded flex items-center justify-center space-x-2 transition-all duration-200 disabled:opacity-40 cursor-pointer shadow-[0_0_15px_rgba(0,240,255,0.25)]"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-3.5 h-3.5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                        <span>Sending Message...</span>
                      </>
                    ) : (
                      <>
                        <Send size={13} />
                        <span>Send Message</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            ) : (
              <motion.div 
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-10 flex flex-col items-center justify-center text-center space-y-5"
              >
                <div className="p-4 border-2 border-cyber-green rounded-full bg-cyber-green/10 text-cyber-green shadow-[0_0_20px_rgba(57,255,20,0.3)]">
                  <CheckCircle size={36} />
                </div>
                
                <div>
                  <h4 className="text-lg font-display font-black text-cyber-green tracking-wider uppercase mb-1">
                    Message Sent Successfully!
                  </h4>
                  <p className="text-xs text-slate-300 max-w-sm mx-auto font-sans leading-relaxed">
                    Thank you for reaching out. I have received your message and will reply promptly.
                  </p>
                </div>

                <button
                  onClick={() => setIsSuccess(false)}
                  className="px-5 py-2 border border-slate-700 text-slate-300 hover:text-white hover:border-cyber-cyan transition-colors text-xs font-mono tracking-wider rounded cursor-pointer"
                >
                  Send Another Message
                </button>
              </motion.div>
            )}

          </div>
        </div>

        {/* Email Direct Copy Panel */}
        <div className="mt-6 flex flex-col md:flex-row justify-between items-center gap-4 p-4 glass-panel rounded-lg border-cyber-cyan/15">
          <div className="flex items-center space-x-3">
            <div className="p-2 border border-cyber-cyan/40 bg-cyber-cyan/5 rounded text-cyber-cyan shrink-0">
              <Mail size={16} />
            </div>
            <div className="text-left font-mono">
              <div className="text-[10px] text-slate-400">Direct Email</div>
              <div className="text-xs text-white font-bold select-all">jakharnirbhay0000@gmail.com</div>
            </div>
          </div>
          
          <button
            onClick={handleCopyEmail}
            className="flex items-center space-x-1.5 px-3 py-1.5 border border-slate-700 hover:border-cyber-cyan/50 hover:text-cyber-cyan rounded font-mono text-xs transition-colors cursor-pointer shrink-0"
          >
            {copiedEmail ? (
              <>
                <Check size={12} className="text-cyber-green" />
                <span className="text-cyber-green font-bold">Email Copied!</span>
              </>
            ) : (
              <>
                <Copy size={12} />
                <span>Copy Email</span>
              </>
            )}
          </button>
        </div>

        {/* Footer */}
        <footer className="mt-16 border-t border-slate-900 pt-6 text-center text-xs font-mono text-slate-500 space-y-1.5 select-none">
          <div>
            Designed & Developed by <span className="text-slate-200 font-bold">Nirbhay Jakhar</span>.
          </div>
          <div className="text-[11px] text-slate-600">
            Software Engineering Intern | Full-Stack & Backend Development
          </div>
        </footer>

      </div>
    </section>
  );
};

export default Contact;
