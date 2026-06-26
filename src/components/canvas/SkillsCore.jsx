import React, { useRef, useState, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';

// Map of categories and descriptions for tooltips
const skillProficiency = {
  'React': { category: 'Frontend Framework', tag: 'Expert', desc: 'Hooks, context state trees' },
  'Node.js': { category: 'Backend Runtime', tag: 'Advanced', desc: 'Asynchronous API runtimes' },
  'MongoDB': { category: 'Database', tag: 'Advanced', desc: 'Aggregation pipelines & index schemas' },
  'JavaScript': { category: 'Programming Language', tag: 'Expert', desc: 'ES6 scripts & async event loops' },
  'Express': { category: 'Backend Framework', tag: 'Advanced', desc: 'API endpoints & middleware auth' },
  'Tailwind': { category: 'CSS Framework', tag: 'Expert', desc: 'Utility classes & v4 design systems' },
  'Git': { category: 'Version Control', tag: 'Advanced', desc: 'Branch checkouts, commits & merges' },
  'Docker': { category: 'Containerization', tag: 'Intermediate', desc: 'Image builds & container instances' },
  
  // CS cores
  'DSA': { category: 'CS Foundations', tag: 'Advanced', desc: 'Complexity algorithms & data structures' },
  'OOP': { category: 'CS Foundations', tag: 'Advanced', desc: 'Objects, polymorphism & interfaces' },
  'DBMS': { category: 'CS Foundations', tag: 'Advanced', desc: 'Schema models & query index optimization' },
  'OS': { category: 'CS Foundations', tag: 'Advanced', desc: 'Memory pages & CPU task scheduling' },
  
  // Others
  'Java': { category: 'Programming Language', tag: 'Expert', desc: 'Object architecture & data platforms' },
  'Python': { category: 'Programming Language', tag: 'Advanced', desc: 'Script parsing & simple automation tools' },
  'HTML5': { category: 'Markup Language', tag: 'Expert', desc: 'Semantic layouts & DOM accessibility' },
  'CSS3': { category: 'Stylesheet Language', tag: 'Expert', desc: 'Flexbox templates & custom transitions' },
  'REST APIs': { category: 'API Architecture', tag: 'Advanced', desc: 'Resource request & payload payloads' },
  'GitHub': { category: 'Dev Platform', tag: 'Advanced', desc: 'Remote repositories & pull branches' },
  'Postman': { category: 'API Client', tag: 'Advanced', desc: 'HTTP request testing & mock servers' },
  'VS Code': { category: 'Code Editor', tag: 'Expert', desc: 'Extension scripts & debugging workspace' },
  'Figma': { category: 'Design Tool', tag: 'Advanced', desc: 'UI canvas mocks & asset exports' }
};

// Helper for dynamic colors and glows based on category
const getCategoryColor = (cat) => {
  switch (cat) {
    case 'languages': return '#fee715'; // Yellow
    case 'frontend': return '#00f0ff'; // Cyan
    case 'backend': return '#ff007f'; // Magenta
    case 'database': return '#39ff14'; // Green
    case 'tools': return '#e2e8f0'; // White
    case 'core': return '#a855f7'; // Purple
    default: return '#00f0ff';
  }
};

const getCategoryGlow = (cat, intensity = 0.25) => {
  switch (cat) {
    case 'languages': return `rgba(254, 231, 21, ${intensity})`;
    case 'frontend': return `rgba(0, 240, 255, ${intensity})`;
    case 'backend': return `rgba(255, 0, 127, ${intensity})`;
    case 'database': return `rgba(57, 255, 20, ${intensity})`;
    case 'tools': return `rgba(226, 232, 240, ${intensity * 0.8})`;
    case 'core': return `rgba(168, 85, 247, ${intensity})`;
    default: return `rgba(0, 240, 255, ${intensity})`;
  }
};

// An individual orbiting skill chip
const SkillChip = React.memo(({ name, category, orbitRadius, initialAngle, speed, activeCategory, hoveredChip, setHoveredChip, isVisibleRef, highlightedSkillName }) => {
  const meshRef = useRef();
  const [localHovered, setLocalHovered] = useState(false);

  const angleRef = useRef(initialAngle);
  const currentSpeedRef = useRef(speed);
  const offsetRef = useRef(0);
  const scaleRef = useRef(1.0);

  const isHighlighted = activeCategory === 'all' || category === activeCategory;
  const isDimmed = !isHighlighted;

  // Active status checks
  const isHovered = localHovered || hoveredChip === name;
  const isCoreHighlighted = highlightedSkillName === name;
  const showTooltip = isHovered || isCoreHighlighted;

  // Orbit loop (paused/slowed when hovered or highlighted)
  useFrame((state, delta) => {
    if (document.hidden) return;
    if (!isVisibleRef.current) return;
    if (!meshRef.current) return;
    
    // Orbit speed transitions smoothly to 0 on focus
    const targetSpeed = (isHovered || isCoreHighlighted) ? 0 : speed;
    currentSpeedRef.current = THREE.MathUtils.lerp(currentSpeedRef.current, targetSpeed, 0.12);
    
    angleRef.current += delta * currentSpeedRef.current;
    
    // Slow float animation for natural galaxy look
    const floatY = Math.sin(state.clock.getElapsedTime() * 1.8 + initialAngle) * 0.05;
    
    const x = Math.cos(angleRef.current) * orbitRadius;
    const z = Math.sin(angleRef.current) * orbitRadius;
    const y = Math.sin(angleRef.current * 1.5) * (orbitRadius * 0.08) + floatY;

    // Vector math to move toward the user/camera coordinates
    const cameraDir = new THREE.Vector3()
      .copy(state.camera.position)
      .sub(meshRef.current.position)
      .normalize();

    const targetOffset = (isHovered || isCoreHighlighted) ? 0.7 : 0;
    offsetRef.current = THREE.MathUtils.lerp(offsetRef.current, targetOffset, 0.12);

    meshRef.current.position.set(x, y, z).addScaledVector(cameraDir, offsetRef.current);
    meshRef.current.quaternion.copy(state.camera.quaternion);

    // Scale mesh up by 15% (1.15) on focus
    const targetScale = (isHovered || isCoreHighlighted) ? 1.15 : 1.0;
    scaleRef.current = THREE.MathUtils.lerp(scaleRef.current, targetScale, 0.12);
    meshRef.current.scale.set(scaleRef.current, scaleRef.current, scaleRef.current);
  });

  const details = skillProficiency[name] || { category: 'Module', tag: 'Active', desc: 'NJ development module' };
  const chipColor = getCategoryColor(category);

  return (
    <group ref={meshRef}>
      <mesh>
        <sphereGeometry args={[0.06, 8, 8]} />
        <meshBasicMaterial 
          color={isDimmed ? '#1e293b' : chipColor} 
          transparent
          opacity={isDimmed ? 0.15 : 0.75}
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
          className={`px-3 py-1.5 rounded-full border text-[10px] font-mono tracking-wider font-bold transition-all duration-300 select-none cursor-pointer flex items-center space-x-1.5 ${
            isDimmed 
              ? 'bg-slate-900/30 border-slate-800/30 text-slate-600 opacity-20 scale-90' 
              : isHovered || isCoreHighlighted
                ? 'bg-black/95 scale-110 z-30'
                : 'bg-black/80 backdrop-blur-sm shadow-md'
          }`}
          style={{
            borderColor: isDimmed ? 'rgba(30,41,59,0.2)' : chipColor,
            color: isDimmed ? '#475569' : chipColor,
            boxShadow: (!isDimmed && (isHovered || isCoreHighlighted)) 
              ? `0 0 15px ${getCategoryGlow(category, 0.55)}, inset 0 0 8px ${getCategoryGlow(category, 0.3)}`
              : 'none'
          }}
        >
          <span 
            className="w-1.5 h-1.5 rounded-full bg-current animate-pulse-slow"
            style={{
              boxShadow: `0 0 4px ${chipColor}`
            }}
          ></span>
          <span>{name}</span>

          {showTooltip && (
            <div 
              className="absolute bottom-10 left-1/2 -translate-x-1/2 w-44 p-3 rounded-lg border bg-black/95 text-[10px] font-sans shadow-[0_0_25px_rgba(0,240,255,0.25)] pointer-events-none transition-all duration-200"
              style={{
                borderColor: chipColor,
                boxShadow: `0 0 20px ${getCategoryGlow(category, 0.35)}, inset 0 0 10px rgba(0, 0, 0, 0.8)`,
                animation: 'fadeInUp 0.2s cubic-bezier(0.215, 0.61, 0.355, 1) forwards',
                zIndex: 9999
              }}
            >
              <div className="font-display font-black text-white text-[11px] mb-1 uppercase tracking-wider">{name}</div>
              <div className="flex justify-between items-center text-slate-400 font-mono text-[8px] mb-1.5 pb-1.5 border-b border-slate-800/80">
                <span className="uppercase">{details.category}</span>
                <span 
                  className="font-bold px-1.5 py-0.5 rounded text-[7px]"
                  style={{
                    backgroundColor: getCategoryGlow(category, 0.12),
                    color: chipColor
                  }}
                >
                  {details.tag}
                </span>
              </div>
              <div className="text-[9px] leading-relaxed text-slate-300 font-sans">{details.desc}</div>
            </div>
          )}
        </div>
      </Html>
    </group>
  );
});

const SkillsCore = ({ activeCategory = 'all' }) => {
  const groupRef = useRef();
  const coreRef = useRef();
  const coreParticlesRef = useRef();
  const ringsRef1 = useRef();
  const ringsRef2 = useRef();
  const ringsRef3 = useRef();

  const [hoveredChip, setHoveredChip] = useState(null);
  const isVisible = useRef(true);

  // Central Core highlight states
  const [coreHovered, setCoreHovered] = useState(false);
  const [activeHighlightIndex, setActiveHighlightIndex] = useState(null);

  const highlightList = useMemo(() => [
    'React',
    'Node.js',
    'MongoDB',
    'JavaScript',
    'Express',
    'Tailwind',
    'Git',
    'Docker'
  ], []);

  // Highlight sequence loop trigger
  useEffect(() => {
    if (!coreHovered) {
      setActiveHighlightIndex(null);
      return;
    }

    const startTimeout = setTimeout(() => {
      setActiveHighlightIndex(0);
    }, 1000);

    return () => clearTimeout(startTimeout);
  }, [coreHovered]);

  useEffect(() => {
    if (activeHighlightIndex === null) return;

    const interval = setInterval(() => {
      setActiveHighlightIndex((prev) => {
        const nextIndex = prev + 1;
        // Highlight list has 8 skills (index 0 to 7)
        // At index 8, it returns to normal state for one cycle (1.5 seconds)
        if (nextIndex > highlightList.length) {
          return 0; // restart loop
        }
        return nextIndex;
      });
    }, 1500);

    return () => clearInterval(interval);
  }, [activeHighlightIndex, highlightList]);

  // Load fadeInUp keyframes for tooltip dynamically
  useEffect(() => {
    const styleEl = document.createElement('style');
    styleEl.innerHTML = `
      @keyframes fadeInUp {
        0% {
          opacity: 0;
          transform: translate(-50%, 8px);
        }
        100% {
          opacity: 1;
          transform: translate(-50%, 0);
        }
      }
    `;
    document.head.appendChild(styleEl);
    return () => {
      document.head.removeChild(styleEl);
    };
  }, []);

  // Monitor visibility
  useEffect(() => {
    const el = document.getElementById('skills');
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => {
      isVisible.current = entry.isIntersecting;
    }, { rootMargin: '100px' });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Detect touch/mobile environments for adaptive performance scaling
  const isTouchMobile = useMemo(() => {
    if (typeof window === 'undefined') return false;
    return window.innerWidth < 768 || navigator.maxTouchPoints > 0;
  }, []);

  const coreParticleCount = isTouchMobile ? 15 : 40;
  const torusRadial = isTouchMobile ? 4 : 8;
  const torusTubular = isTouchMobile ? 24 : 48;

  // Static points around core
  const [particlePositions] = useMemo(() => {
    const pos = new Float32Array(coreParticleCount * 3);
    for (let i = 0; i < coreParticleCount; i++) {
      const u = Math.random();
      const v = Math.random();
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0);
      const r = 0.52 + Math.random() * 0.35;
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);
    }
    return [pos];
  }, [coreParticleCount]);

  const skills = [
    // Languages
    { name: 'Java', category: 'languages', r: 1.5, speed: 0.15 },
    { name: 'JavaScript', category: 'languages', r: 1.6, speed: 0.18 },
    { name: 'Python', category: 'languages', r: 1.7, speed: 0.12 },
    
    // Frontend
    { name: 'React', category: 'frontend', r: 2.2, speed: 0.1 },
    { name: 'HTML5', category: 'frontend', r: 2.3, speed: 0.14 },
    { name: 'CSS3', category: 'frontend', r: 2.4, speed: 0.11 },
    { name: 'Tailwind', category: 'frontend', r: 2.5, speed: 0.08 },
    
    // Backend
    { name: 'Node.js', category: 'backend', r: 2.9, speed: 0.07 },
    { name: 'Express', category: 'backend', r: 3.0, speed: 0.09 },
    { name: 'REST APIs', category: 'backend', r: 3.1, speed: 0.06 },
    
    // Database
    { name: 'MongoDB', category: 'database', r: 3.4, speed: 0.05 },
    
    // Tools
    { name: 'Git', category: 'tools', r: 3.8, speed: 0.04 },
    { name: 'GitHub', category: 'tools', r: 3.9, speed: 0.045 },
    { name: 'Docker', category: 'tools', r: 4.0, speed: 0.038 },
    { name: 'Postman', category: 'tools', r: 4.1, speed: 0.042 },
    { name: 'VS Code', category: 'tools', r: 4.2, speed: 0.03 },
    { name: 'Figma', category: 'tools', r: 4.3, speed: 0.035 },
    
    // Core
    { name: 'DSA', category: 'core', r: 1.1, speed: 0.22 },
    { name: 'OOP', category: 'core', r: 1.2, speed: 0.2 },
    { name: 'DBMS', category: 'core', r: 1.3, speed: 0.25 },
    { name: 'OS', category: 'core', r: 1.4, speed: 0.23 }
  ];

  const skillsWithAngles = useMemo(() => {
    return skills.map((skill, index) => ({
      ...skill,
      initialAngle: (index * Math.PI * 2) / 6 + Math.random()
    }));
  }, []);

  const highlightedSkillName = activeHighlightIndex !== null && activeHighlightIndex < highlightList.length
    ? highlightList[activeHighlightIndex]
    : null;

  useFrame((state) => {
    if (document.hidden) return;
    if (!isVisible.current) return;
    const elapsed = state.clock.getElapsedTime();

    // Pulse core scale (breathing effect)
    if (coreRef.current) {
      const isSequenceHighlight = highlightedSkillName !== null;
      const scaleMultiplier = (coreHovered || isSequenceHighlight) ? 1.08 : 1.0;
      const pulse = (1 + Math.sin(elapsed * 2.2) * 0.04) * scaleMultiplier;
      coreRef.current.scale.set(pulse, pulse, pulse);
      coreRef.current.rotation.y += 0.003;
    }

    // Rotate Concentric energy rings
    if (ringsRef1.current) ringsRef1.current.rotation.y += 0.010;
    if (ringsRef2.current) ringsRef2.current.rotation.x += 0.014;
    if (ringsRef3.current) ringsRef3.current.rotation.z -= 0.018;

    // Rotate point cloud particles and breathe
    if (coreParticlesRef.current) {
      coreParticlesRef.current.rotation.y += 0.006;
      coreParticlesRef.current.rotation.x += 0.002;
      const pPulse = 1 + Math.sin(elapsed * 2.8) * 0.06;
      coreParticlesRef.current.scale.set(pPulse, pPulse, pPulse);
    }

    // Parallax rotation
    if (groupRef.current) {
      const targetRotX = state.pointer.y * 0.3;
      const targetRotY = state.pointer.x * 0.3;
      groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, targetRotX, 0.05);
      groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetRotY, 0.05);
    }
  });

  const activeHighlightColor = highlightedSkillName !== null ? "#ff007f" : "#00f0ff";
  const activeInnerColor = highlightedSkillName !== null ? "#fee715" : "#ff007f";

  return (
    <group ref={groupRef}>
      {/* 1. Pulsing central Holographic Core */}
      <group ref={coreRef}>
        {/* Solid invisible raycast target for reliable hover */}
        <mesh
          onPointerOver={() => setCoreHovered(true)}
          onPointerOut={() => setCoreHovered(false)}
        >
          <sphereGeometry args={[0.55, 16, 16]} />
          <meshBasicMaterial transparent opacity={0} depthWrite={false} />
        </mesh>

        {/* Holographic Wireframe sphere */}
        <mesh>
          <sphereGeometry args={[0.5, 24, 24]} />
          <meshBasicMaterial 
            color={coreHovered ? "#ff007f" : activeHighlightColor} 
            wireframe 
            transparent 
            opacity={coreHovered ? 0.45 : 0.3}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
        
        {/* Glowing inner core */}
        <mesh>
          <sphereGeometry args={[0.22, 16, 16]} />
          <meshBasicMaterial 
            color={coreHovered ? "#fee715" : activeInnerColor} 
            transparent 
            opacity={coreHovered ? 0.95 : 0.7}
            blending={THREE.AdditiveBlending}
          />
        </mesh>

        {/* Soft atmospheric glow sphere */}
        <mesh>
          <sphereGeometry args={[0.49, 16, 16]} />
          <meshBasicMaterial
            color={coreHovered ? "#00f0ff" : "#ff007f"}
            transparent
            opacity={coreHovered ? 0.15 : 0.08}
            blending={THREE.AdditiveBlending}
          />
        </mesh>

        {/* Dynamic Point Cloud particles */}
        <points ref={coreParticlesRef}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              args={[particlePositions, 3]}
            />
          </bufferGeometry>
          <pointsMaterial
            color={coreHovered ? "#fee715" : "#00f0ff"}
            size={0.055}
            sizeAttenuation={true}
            transparent={true}
            opacity={coreHovered ? 0.8 : 0.65}
            blending={THREE.AdditiveBlending}
          />
        </points>
        
        <pointLight 
          color={coreHovered ? "#fee715" : "#00f0ff"} 
          intensity={coreHovered ? 3.0 : highlightedSkillName !== null ? 2.5 : 1.5} 
          distance={5} 
        />
      </group>

      {/* 2. Rotating Gyroscope energy rings */}
      <group ref={ringsRef1} rotation={[Math.PI / 4, 0, 0]}>
        <mesh>
          <torusGeometry args={[0.65, 0.015, torusRadial, torusTubular]} />
          <meshBasicMaterial color="#00f0ff" transparent opacity={coreHovered ? 0.6 : 0.4} blending={THREE.AdditiveBlending} />
        </mesh>
      </group>
      <group ref={ringsRef2} rotation={[0, Math.PI / 4, 0]}>
        <mesh>
          <torusGeometry args={[0.72, 0.012, torusRadial, torusTubular]} />
          <meshBasicMaterial color="#ff007f" transparent opacity={coreHovered ? 0.55 : 0.35} blending={THREE.AdditiveBlending} />
        </mesh>
      </group>
      <group ref={ringsRef3} rotation={[Math.PI / 2, 0, Math.PI / 4]}>
        <mesh>
          <torusGeometry args={[0.8, 0.01, torusRadial, torusTubular]} />
          <meshBasicMaterial color="#fee715" transparent opacity={coreHovered ? 0.5 : 0.3} blending={THREE.AdditiveBlending} />
        </mesh>
      </group>

      {/* Orbit Rings / Lanes */}
      {[1.3, 2.35, 3.1, 4.05].map((radius, idx) => (
        <mesh key={idx} rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[radius - 0.005, radius + 0.005, 64]} />
          <meshBasicMaterial 
            color={idx % 2 === 0 ? "#00f0ff" : "#ff007f"} 
            transparent 
            opacity={activeCategory === 'all' ? 0.06 : 0.015} 
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      ))}

      {/* Render All Orbiting Skills */}
      {skillsWithAngles.map((skill, idx) => (
        <SkillChip
          key={idx}
          name={skill.name}
          category={skill.category}
          orbitRadius={skill.r}
          initialAngle={skill.initialAngle}
          speed={skill.speed}
          activeCategory={activeCategory}
          hoveredChip={hoveredChip}
          setHoveredChip={setHoveredChip}
          isVisibleRef={isVisible}
          highlightedSkillName={highlightedSkillName}
        />
      ))}
    </group>
  );
};

export default SkillsCore;
