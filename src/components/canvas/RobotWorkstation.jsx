import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';

const HolographicMenuPanel = ({ label, index, targetId }) => {
  const handleScrollTo = () => {
    const el = document.getElementById(targetId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <button
      onClick={handleScrollTo}
      className="px-4 py-2 border border-cyber-cyan/30 hover:border-cyber-cyan bg-black/85 text-cyber-cyan font-mono text-[9px] font-bold tracking-widest rounded hover:shadow-[0_0_15px_rgba(0,240,255,0.4)] hover:bg-cyber-cyan hover:text-black transition-all duration-300 w-36 select-none cursor-pointer flex items-center justify-between"
    >
      <span>0{index + 1}. {label}</span>
      <span className="w-1.5 h-1.5 rounded-full bg-current animate-ping"></span>
    </button>
  );
};

const RobotWorkstation = () => {
  const robotGroupRef = useRef();
  const headRef = useRef();
  const torsoRef = useRef();
  const leftArmRef = useRef();
  const rightArmRef = useRef();

  // Simulated typing / tapping states
  useFrame((state) => {
    // Viewport optimization: skip frame calculations when scrolled offscreen
    if (window.scrollY > window.innerHeight + 100) return;
    
    const time = state.clock.getElapsedTime();

    // 1. Subtle breathing animation (torso moves slightly up and down)
    if (torsoRef.current) {
      const breathing = Math.sin(time * 1.6) * 0.012;
      torsoRef.current.position.y = breathing;
      
      // Arm movement matches breathing
      if (leftArmRef.current && rightArmRef.current) {
        leftArmRef.current.rotation.x = -Math.PI / 6 + breathing * 0.8;
        rightArmRef.current.rotation.x = -Math.PI / 6 - breathing * 0.8;
      }
    }

    // 2. Cursor tracking (Head turns to follow screen pointer)
    if (headRef.current) {
      // Horizontal angle range
      const targetRotationY = state.pointer.x * 0.45;
      
      // Vertical angle range. Adjust slightly downwards based on scroll position.
      const scrollY = window.scrollY;
      const scrollInfluence = Math.min(0.25, scrollY * 0.0008);
      const targetRotationX = -state.pointer.y * 0.25 + scrollInfluence - 0.15; // slightly look down at console

      headRef.current.rotation.y = THREE.MathUtils.lerp(
        headRef.current.rotation.y,
        targetRotationY,
        0.05
      );
      headRef.current.rotation.x = THREE.MathUtils.lerp(
        headRef.current.rotation.x,
        targetRotationX,
        0.05
      );
    }

    // 3. Hand typing simulation (rapid finger shuffles)
    if (leftArmRef.current && rightArmRef.current) {
      const typeSpeed = time * 8;
      leftArmRef.current.position.z = -0.1 + Math.sin(typeSpeed) * 0.015;
      rightArmRef.current.position.z = -0.1 + Math.cos(typeSpeed * 1.2) * 0.015;
    }

    // 4. Subtle camera coordinate parallax in whole workstation
    if (robotGroupRef.current) {
      robotGroupRef.current.rotation.y = THREE.MathUtils.lerp(
        robotGroupRef.current.rotation.y,
        state.pointer.x * 0.08,
        0.05
      );
      robotGroupRef.current.rotation.x = THREE.MathUtils.lerp(
        robotGroupRef.current.rotation.x,
        -state.pointer.y * 0.04,
        0.05
      );
    }
  });

  return (
    <group ref={robotGroupRef} position={[0, -0.6, -0.2]}>
      
      {/* 1. Ergonomic Command Chair */}
      <group position={[0, 0, -1.3]}>
        {/* Base stand */}
        <mesh position={[0, -0.6, 0]}>
          <cylinderGeometry args={[0.15, 0.2, 0.7, 12]} />
          <meshStandardMaterial color="#11111e" metalness={0.9} roughness={0.3} />
        </mesh>
        {/* Seat cushion */}
        <mesh position={[0, -0.2, 0]}>
          <boxGeometry args={[1.3, 0.15, 1.2]} />
          <meshStandardMaterial color="#0a0a0f" roughness={0.4} />
        </mesh>
        {/* Backrest support */}
        <mesh position={[0, 0.4, -0.5]}>
          <boxGeometry args={[1.1, 1.3, 0.15]} />
          <meshStandardMaterial color="#161625" roughness={0.5} />
        </mesh>
        {/* Glowing chair outline */}
        <mesh position={[0, 0.4, -0.58]}>
          <boxGeometry args={[1.12, 1.32, 0.13]} />
          <meshBasicMaterial color="#ff007f" wireframe />
        </mesh>
        {/* Armrests */}
        <mesh position={[-0.7, 0.1, 0.1]}>
          <boxGeometry args={[0.15, 0.1, 0.8]} />
          <meshStandardMaterial color="#0c0c16" />
        </mesh>
        <mesh position={[0.7, 0.1, 0.1]}>
          <boxGeometry args={[0.15, 0.1, 0.8]} />
          <meshStandardMaterial color="#0c0c16" />
        </mesh>
      </group>

      {/* 2. AI Humanoid Robot */}
      <group position={[0, 0, -1.1]}>
        
        {/* Torso / Chest Plate */}
        <group ref={torsoRef}>
          <mesh>
            <capsuleGeometry args={[0.42, 0.7, 8, 8]} />
            <meshStandardMaterial color="#27273a" metalness={0.8} roughness={0.1} />
          </mesh>
          {/* Internal glowing power core */}
          <mesh position={[0, 0.1, 0.38]}>
            <sphereGeometry args={[0.12, 12, 12]} />
            <meshBasicMaterial color="#00f0ff" />
          </mesh>
          
          {/* Shoulders */}
          <mesh position={[-0.55, 0.35, 0]}>
            <sphereGeometry args={[0.15, 12, 12]} />
            <meshStandardMaterial color="#0e0e18" metalness={0.9} />
          </mesh>
          <mesh position={[0.55, 0.35, 0]}>
            <sphereGeometry args={[0.15, 12, 12]} />
            <meshStandardMaterial color="#0e0e18" metalness={0.9} />
          </mesh>

          {/* Left Arm Segment */}
          <group ref={leftArmRef} position={[-0.55, 0.35, 0.1]}>
            <mesh position={[0, -0.3, 0.15]}>
              <cylinderGeometry args={[0.08, 0.06, 0.6, 8]} />
              <meshStandardMaterial color="#1a1a2e" metalness={0.9} />
            </mesh>
            {/* Elbow joint */}
            <mesh position={[0, -0.6, 0.3]}>
              <sphereGeometry args={[0.08, 8, 8]} />
              <meshBasicMaterial color="#ff007f" />
            </mesh>
            {/* Forearm */}
            <mesh position={[0, -0.8, 0.45]}>
              <cylinderGeometry args={[0.06, 0.05, 0.5, 8]} />
              <meshStandardMaterial color="#1a1a2e" metalness={0.9} />
            </mesh>
            {/* Glowing Hand node */}
            <mesh position={[0, -1.0, 0.6]}>
              <sphereGeometry args={[0.07, 8, 8]} />
              <meshBasicMaterial color="#00f0ff" />
            </mesh>
          </group>

          {/* Right Arm Segment */}
          <group ref={rightArmRef} position={[0.55, 0.35, 0.1]}>
            <mesh position={[0, -0.3, 0.15]}>
              <cylinderGeometry args={[0.08, 0.06, 0.6, 8]} />
              <meshStandardMaterial color="#1a1a2e" metalness={0.9} />
            </mesh>
            {/* Elbow joint */}
            <mesh position={[0, -0.6, 0.3]}>
              <sphereGeometry args={[0.08, 8, 8]} />
              <meshBasicMaterial color="#ff007f" />
            </mesh>
            {/* Forearm */}
            <mesh position={[0, -0.8, 0.45]}>
              <cylinderGeometry args={[0.06, 0.05, 0.5, 8]} />
              <meshStandardMaterial color="#1a1a2e" metalness={0.9} />
            </mesh>
            {/* Glowing Hand node */}
            <mesh position={[0, -1.0, 0.6]}>
              <sphereGeometry args={[0.07, 8, 8]} />
              <meshBasicMaterial color="#00f0ff" />
            </mesh>
          </group>
        </group>

        {/* Neck */}
        <mesh position={[0, 0.55, 0]}>
          <cylinderGeometry args={[0.07, 0.09, 0.2, 8]} />
          <meshStandardMaterial color="#0f0f18" metalness={0.8} />
        </mesh>

        {/* Head tracking unit */}
        <group ref={headRef} position={[0, 0.75, 0.05]}>
          <mesh>
            <sphereGeometry args={[0.3, 16, 16]} />
            <meshStandardMaterial color="#2d2d42" metalness={0.8} roughness={0.1} />
          </mesh>
          {/* Cyber glowing visor screen */}
          <mesh position={[0, 0.05, 0.24]}>
            <boxGeometry args={[0.38, 0.1, 0.15]} />
            <meshBasicMaterial color="#00f0ff" />
          </mesh>
          {/* Tech antenna rods */}
          <mesh position={[0.2, 0.28, -0.1]} rotation={[0, 0, -0.3]}>
            <cylinderGeometry args={[0.015, 0.015, 0.3, 6]} />
            <meshStandardMaterial color="#ff007f" />
          </mesh>
          <mesh position={[-0.2, 0.28, -0.1]} rotation={[0, 0, 0.3]}>
            <cylinderGeometry args={[0.015, 0.015, 0.3, 6]} />
            <meshStandardMaterial color="#ff007f" />
          </mesh>
        </group>
      </group>

      {/* 3. Cyberpunk Console Workstation */}
      <group position={[0, 0, 0.2]}>
        
        {/* Holographic Console Desk outline */}
        <mesh position={[0, -0.05, 0]}>
          <boxGeometry args={[5.8, 0.06, 2.2]} />
          <meshStandardMaterial color="#07070d" metalness={0.9} roughness={0.2} />
        </mesh>
        {/* Glowing border neon frame */}
        <mesh position={[0, -0.02, 0]}>
          <boxGeometry args={[5.84, 0.02, 2.24]} />
          <meshBasicMaterial color="#00f0ff" wireframe />
        </mesh>
        
        {/* Mechanical Keyboard matrix grid */}
        <mesh position={[0, 0.03, 0.4]}>
          <boxGeometry args={[1.5, 0.04, 0.5]} />
          <meshStandardMaterial color="#1a1a2e" metalness={0.9} />
        </mesh>
        <mesh position={[0, 0.05, 0.4]}>
          <boxGeometry args={[1.4, 0.01, 0.4]} />
          <meshStandardMaterial color="#ff007f" emissive="#ff007f" emissiveIntensity={0.6} />
        </mesh>

        {/* Holographic Desk Panel - Translucent Screen Layer */}
        <mesh rotation={[-Math.PI / 6, 0, 0]} position={[0, 0.6, -0.3]}>
          <planeGeometry args={[4.2, 1.2]} />
          <meshBasicMaterial color="#00f0ff" transparent opacity={0.06} side={THREE.DoubleSide} />
        </mesh>
        {/* Neon screen outline */}
        <mesh rotation={[-Math.PI / 6, 0, 0]} position={[0, 0.6, -0.3]}>
          <planeGeometry args={[4.22, 1.22]} />
          <meshBasicMaterial color="#00f0ff" wireframe side={THREE.DoubleSide} />
        </mesh>

        {/* Interactive Holographic Menus (Mapped directly on the screen) */}
        <group position={[0, 0.6, -0.27]} rotation={[-Math.PI / 6, 0, 0]}>
          
          {/* Row of Buttons */}
          <group position={[-1.7, 0.25, 0]}>
            <Html transform distanceFactor={2.4}>
              <HolographicMenuPanel label="ABOUT_ME" index={0} targetId="about" />
            </Html>
          </group>
          
          <group position={[-0.85, 0.25, 0]}>
            <Html transform distanceFactor={2.4}>
              <HolographicMenuPanel label="CORE_SKILLS" index={1} targetId="skills" />
            </Html>
          </group>

          <group position={[0, 0.25, 0]}>
            <Html transform distanceFactor={2.4}>
              <HolographicMenuPanel label="PROJECTS" index={2} targetId="projects" />
            </Html>
          </group>

          <group position={[0.85, 0.25, 0]}>
            <Html transform distanceFactor={2.4}>
              <HolographicMenuPanel label="DASHBOARD" index={3} targetId="achievements" />
            </Html>
          </group>

          <group position={[1.7, 0.25, 0]}>
            <Html transform distanceFactor={2.4}>
              <HolographicMenuPanel label="CONTACT_ME" index={4} targetId="contact" />
            </Html>
          </group>

          {/* Matrix code lines overlay on screen */}
          <group position={[-1.5, -0.2, 0.01]}>
            <Html transform distanceFactor={2.8}>
              <div className="w-[300px] h-[50px] font-mono text-[7px] text-cyber-cyan/50 leading-none overflow-hidden select-none pointer-events-none">
                SYS_BOOT: OK // RAM: 58% // NODE: 0x8F<br/>
                &gt; compiling packages... done (0.12s)<br/>
                &gt; active socket: connection_established_port_5000<br/>
                &gt; monitoring interface: ACTIVE
              </div>
            </Html>
          </group>

        </group>
        
        {/* Coffee Mug Accent (Neon glow) */}
        <mesh position={[-1.8, 0.12, 0.3]}>
          <cylinderGeometry args={[0.09, 0.09, 0.25, 12]} />
          <meshStandardMaterial color="#ff007f" roughness={0.1} />
        </mesh>
        <pointLight color="#ff007f" intensity={0.4} distance={0.8} position={[-1.8, 0.3, 0.3]} />

      </group>
    </group>
  );
};

export default RobotWorkstation;
