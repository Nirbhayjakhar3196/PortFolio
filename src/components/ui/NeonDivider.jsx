import React from 'react';

const NeonDivider = ({ color = 'cyan' }) => {
  const glowColor = color === 'cyan' 
    ? 'via-cyber-cyan/60' 
    : color === 'magenta' 
      ? 'via-cyber-magenta/60' 
      : 'via-cyber-yellow/60';
  
  const blurColor = color === 'cyan' 
    ? 'bg-cyber-cyan/40 shadow-[0_0_12px_#00f0ff]' 
    : color === 'magenta' 
      ? 'bg-cyber-magenta/40 shadow-[0_0_12px_#ff007f]' 
      : 'bg-cyber-yellow/40 shadow-[0_0_12px_#fee715]';

  return (
    <div className="w-full relative py-2 flex items-center justify-center select-none pointer-events-none">
      <div className={`w-full h-[1px] bg-gradient-to-r from-transparent ${glowColor} to-transparent relative`}>
        <div className={`absolute inset-0 w-full h-[1px] blur-[3px] ${blurColor}`}></div>
      </div>
      {/* Central decorative HUD node */}
      <div 
        className="absolute w-1.5 h-1.5 rounded-sm rotate-45 border bg-black transition-all duration-300"
        style={{
          borderColor: color === 'cyan' ? '#00f0ff' : color === 'magenta' ? '#ff007f' : '#fee715',
          boxShadow: color === 'cyan' ? '0 0 8px #00f0ff' : color === 'magenta' ? '0 0 8px #ff007f' : '0 0 8px #fee715'
        }}
      />
    </div>
  );
};

export default NeonDivider;
