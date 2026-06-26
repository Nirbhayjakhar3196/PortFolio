import React, { useRef, useState, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';

// An individual orbiting skill chip
const SkillChip = ({ name, category, experience, orbitRadius, initialAngle, speed, activeCategory, hoveredChip, setHoveredChip, isVisibleRef }) => {
  const meshRef = useRef();
  const [localHovered, setLocalHovered] = useState(false);

  const isHighlighted = activeCategory === 'all' || category === activeCategory;
  const isDimmed = !isHighlighted;

  // Orbit loop (paused when off-screen)
  useFrame((state) => {
    if (!isVisibleRef.current) return;
    if (!meshRef.current) return;
    
    const time = state.clock.getElapsedTime();
    const activeSpeed = hoveredChip ? speed * 0.1 : speed;
    const angle = time * activeSpeed + initialAngle;
    
    const x = Math.cos(angle) * orbitRadius;
    const z = Math.sin(angle) * orbitRadius;
    const y = Math.sin(angle * 2) * (orbitRadius * 0.15); // gentle 3D wave

    meshRef.current.position.set(x, y, z);
    meshRef.current.quaternion.copy(state.camera.quaternion);
  });

  return (
    <group ref={meshRef}>
      <mesh>
        <sphereGeometry args={[0.08, 8, 8]} />
        <meshBasicMaterial 
          color={isDimmed ? '#334155' : category === 'languages' ? '#fee715' : category === 'frontend' ? '#00f0ff' : '#ff007f'} 
          transparent
          opacity={isDimmed ? 0.3 : 0.8}
        />
      </mesh>

      <Html distanceFactor={3.2} center>
        <div 
          onPointerOver={() => {
            setLocalHovered(true);
            setHoveredChip(name);
          }}
          onPointerOut={() => {
            setLocalHovered(false);
            setHoveredChip(null);
          }}
          className={`px-3 py-1.5 rounded-full border text-[10px] font-mono tracking-wider font-bold transition-all duration-300 select-none cursor-pointer flex items-center space-x-1 ${
            isDimmed 
              ? 'bg-slate-900/40 border-slate-800/40 text-slate-600 opacity-25 scale-90' 
              : localHovered 
                ? 'bg-black/90 scale-110 shadow-[0_0_20px_rgba(0,240,255,0.6)] z-30'
                : 'bg-black/75 backdrop-blur-sm shadow-md'
          }`}
          style={{
            borderColor: isDimmed 
              ? 'rgba(30,41,59,0.2)' 
              : category === 'languages' 
                ? '#fee715' 
                : category === 'frontend' 
                  ? '#00f0ff' 
                  : category === 'backend' 
                    ? '#ff007f'
                    : category === 'database'
                      ? '#39ff14'
                      : category === 'tools'
                        ? '#e2e8f0'
                        : '#a855f7',
            color: isDimmed 
              ? '#475569' 
              : category === 'languages' 
                ? '#fee715' 
                : category === 'frontend' 
                  ? '#00f0ff' 
                  : category === 'backend' 
                    ? '#ff007f'
                    : category === 'database'
                      ? '#39ff14'
                      : category === 'tools'
                        ? '#e2e8f0'
                        : '#a855f7',
          }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse-slow"></span>
          <span>{name}</span>

          {localHovered && !isDimmed && (
            <div className="absolute top-8 left-1/2 -translate-x-1/2 w-36 p-2 rounded border border-cyber-cyan bg-black/95 text-[8px] text-white tracking-normal font-sans shadow-2xl z-40 text-center pointer-events-none">
              <div className="font-mono font-bold text-cyber-cyan mb-0.5">{name}</div>
              <div className="text-slate-400 font-mono text-[7px] mb-1">CAT: {category.toUpperCase()}</div>
              <div className="text-[8px] leading-tight text-slate-200">{experience}</div>
            </div>
          )}
        </div>
      </Html>
    </group>
  );
};

const SkillsCore = ({ activeCategory = 'all' }) => {
  const groupRef = useRef();
  const coreRef = useRef();
  const [hoveredChip, setHoveredChip] = useState(null);
  const isVisible = useRef(true);

  // Asynchronously monitor section visibility to pause updates
  useEffect(() => {
    const el = document.getElementById('skills');
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => {
      isVisible.current = entry.isIntersecting;
    }, { rootMargin: '100px' });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const skills = [
    // Languages
    { name: 'Java', category: 'languages', exp: 'DSA platform, Core structures, OOP models', r: 1.5, speed: 0.15 },
    { name: 'JavaScript', category: 'languages', exp: 'ES6 scripting, Async loops, Web engines', r: 1.6, speed: 0.18 },
    { name: 'Python', category: 'languages', exp: 'Scripting tools, Simple automations', r: 1.7, speed: 0.12 },
    
    // Frontend
    { name: 'React.js', category: 'frontend', exp: 'State trees, hooks, custom performance hooks', r: 2.2, speed: 0.1 },
    { name: 'HTML5', category: 'frontend', exp: 'Semantic document flows, SEO structuring', r: 2.3, speed: 0.14 },
    { name: 'CSS3', category: 'frontend', exp: 'Layout design, flexbox grid, styles', r: 2.4, speed: 0.11 },
    { name: 'Tailwind CSS', category: 'frontend', exp: 'Adaptive v4 CSS variables layout templates', r: 2.5, speed: 0.08 },
    
    // Backend
    { name: 'Node.js', category: 'backend', exp: 'Event loops, async APIs, performance routes', r: 2.9, speed: 0.07 },
    { name: 'Express.js', category: 'backend', exp: 'Auth check middlewares, modular routers', r: 3.0, speed: 0.09 },
    { name: 'REST APIs', category: 'backend', exp: 'Resource payloads design, JSON formatting', r: 3.1, speed: 0.06 },
    
    // Database
    { name: 'MongoDB', category: 'database', exp: 'Mongoose models schema indexing aggregation', r: 3.4, speed: 0.05 },
    
    // Tools
    { name: 'Git', category: 'tools', exp: 'VCS commit logs, diff branches checkout merge', r: 3.8, speed: 0.04 },
    { name: 'GitHub', category: 'tools', exp: 'Code remote management, web hooks triggers', r: 3.9, speed: 0.045 },
    { name: 'Docker', category: 'tools', exp: 'Virtual containers setups, dockerfiles builds', r: 4.0, speed: 0.038 },
    { name: 'Postman', category: 'tools', exp: 'HTTP requests tests, environment variables', r: 4.1, speed: 0.042 },
    { name: 'VS Code', category: 'tools', exp: 'Primary workspace editor coding hacks', r: 4.2, speed: 0.03 },
    { name: 'Figma', category: 'tools', exp: 'UI mockups inspects spacing assets extract', r: 4.3, speed: 0.035 },
    
    // Core
    { name: 'DSA', category: 'core', exp: 'LeetCode arrays, trees, search graphs complexity', r: 1.1, speed: 0.22 },
    { name: 'OOP', category: 'core', exp: 'Objects abstraction inheritance polymorphism', r: 1.2, speed: 0.2 },
    { name: 'DBMS', category: 'core', exp: 'Database indexing, schema designs, transaction models', r: 1.3, speed: 0.25 },
    { name: 'OS', category: 'core', exp: 'Multi threads processing, CPU scheduling memory logs', r: 1.4, speed: 0.23 }
  ];

  const skillsWithAngles = useMemo(() => {
    return skills.map((skill, index) => ({
      ...skill,
      initialAngle: (index * Math.PI * 2) / 6 + Math.random()
    }));
  }, []);

  useFrame((state) => {
    if (!isVisible.current) return;
    const elapsed = state.clock.getElapsedTime();

    // Pulse core
    if (coreRef.current) {
      const pulse = 1 + Math.sin(elapsed * 2.5) * 0.08;
      coreRef.current.scale.set(pulse, pulse, pulse);
      coreRef.current.rotation.y += 0.01;
      coreRef.current.rotation.x += 0.005;
    }

    // Parallax rotation
    if (groupRef.current) {
      const targetRotX = state.pointer.y * 0.35;
      const targetRotY = state.pointer.x * 0.35;
      
      groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, targetRotX, 0.05);
      groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetRotY, 0.05);
    }
  });

  return (
    <group ref={groupRef}>
      {/* 1. Pulsing central AI Core Sphere */}
      <group ref={coreRef}>
        <mesh>
          <sphereGeometry args={[0.5, 16, 16]} />
          <meshBasicMaterial 
            color="#00f0ff" 
            wireframe 
            transparent 
            opacity={0.3} 
          />
        </mesh>
        
        <mesh>
          <sphereGeometry args={[0.25, 8, 8]} />
          <meshBasicMaterial 
            color="#ff007f" 
            transparent 
            opacity={0.6} 
          />
        </mesh>
        
        <pointLight color="#00f0ff" intensity={1.5} distance={5} />
      </group>

      {/* Orbit Rings */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.5, 1.51, 64]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={activeCategory === 'all' ? 0.03 : 0.005} />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[2.5, 2.51, 64]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={activeCategory === 'all' ? 0.03 : 0.005} />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[3.8, 3.81, 64]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={activeCategory === 'all' ? 0.03 : 0.005} />
      </mesh>

      {/* Render All Orbiting Skills */}
      {skillsWithAngles.map((skill, idx) => (
        <SkillChip
          key={idx}
          name={skill.name}
          category={skill.category}
          experience={skill.exp}
          orbitRadius={skill.r}
          initialAngle={skill.initialAngle}
          speed={skill.speed}
          activeCategory={activeCategory}
          hoveredChip={hoveredChip}
          setHoveredChip={setHoveredChip}
          isVisibleRef={isVisible}
        />
      ))}
    </group>
  );
};

export default SkillsCore;
