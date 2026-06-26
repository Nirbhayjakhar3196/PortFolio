import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';

const TerminalWindow = ({ title, content, color = '#00f0ff' }) => {
  return (
    <div 
      className="w-[280px] h-[180px] rounded border bg-black/85 font-mono text-[9px] leading-tight p-2.5 overflow-hidden flex flex-col scanlines relative shadow-2xlSelectNone pointer-events-none select-none"
      style={{ borderColor: color, color: color, boxShadow: `0 0 15px ${color}30` }}
    >
      <div className="absolute inset-0 scanline-overlay"></div>
      
      {/* HUD Header */}
      <div className="flex justify-between items-center border-b pb-1 mb-1.5" style={{ borderColor: `${color}40` }}>
        <div className="flex items-center space-x-1">
          <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
          <span className="w-1.5 h-1.5 rounded-full bg-yellow-500"></span>
          <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
          <span className="pl-1.5 font-bold tracking-wider">{title}</span>
        </div>
        <span className="text-[7px] opacity-60">SYS_OK</span>
      </div>

      {/* Terminal Content */}
      <div className="flex-1 overflow-hidden space-y-1">
        {content.map((line, idx) => (
          <div key={idx} className="flex space-x-1">
            <span className="opacity-50">&gt;</span>
            <span className="break-all">{line}</span>
          </div>
        ))}
      </div>
      
      {/* Grid Overlay */}
      <div className="absolute right-1 bottom-1 text-[7px] opacity-40 font-bold">
        GRID_01_SEC
      </div>
    </div>
  );
};

const CyberDesk = () => {
  const deskGroupRef = useRef();
  
  // Terminal log simulation states
  const [logs1, setLogs1] = useState([
    'Initializing kernel...',
    'Loading server_configs.json...',
    'db.connect("mongodb://nirbhay_db")...',
    'status: CONNECTED_SUCCESSFULLY',
    'auth_service listening on port 5000'
  ]);
  const [logs2, setLogs2] = useState([
    'yarn dev --host --port 3000',
    'VITE v5.2.11  ready in 254 ms',
    '➜  Local:   http://localhost:3000/',
    '➜  Network: use --host to expose',
    'hmr update: /src/components/canvas/CyberDesk.jsx'
  ]);

  // Keep terminal logs rotating
  useFrame((state) => {
    // Floating movement (sine waves)
    if (deskGroupRef.current) {
      const elapsed = state.clock.getElapsedTime();
      deskGroupRef.current.position.y = Math.sin(elapsed * 1.2) * 0.15 - 1.2;
      deskGroupRef.current.rotation.z = Math.sin(elapsed * 0.8) * 0.015;
      
      // Cursor tracking parallax
      const targetRotationY = state.pointer.x * 0.25;
      const targetRotationX = -state.pointer.y * 0.15;
      
      deskGroupRef.current.rotation.y = THREE.MathUtils.lerp(
        deskGroupRef.current.rotation.y,
        targetRotationY,
        0.05
      );
      deskGroupRef.current.rotation.x = THREE.MathUtils.lerp(
        deskGroupRef.current.rotation.x,
        targetRotationX,
        0.05
      );
    }

    // Rotate simulated terminal lines periodically
    const elapsedSeconds = Math.floor(state.clock.getElapsedTime());
    if (elapsedSeconds > 0 && elapsedSeconds % 3 === 0) {
      if (Math.random() > 0.5) {
        setLogs1(prev => {
          const updated = [...prev.slice(1)];
          const items = [
            `api_fetch: GET /api/v1/auth/session [200 OK]`,
            `jwt_check: verified payload hash_${Math.floor(Math.random() * 9999)}`,
            `server_load: cpu usage ${Math.floor(25 + Math.random() * 45)}%`,
            `db_pool: active_connections = ${Math.floor(5 + Math.random() * 15)}`,
            `cache_hit: redis session keys verified`
          ];
          updated.push(items[Math.floor(Math.random() * items.length)]);
          return updated;
        });
      } else {
        setLogs2(prev => {
          const updated = [...prev.slice(1)];
          const items = [
            `[HMR] update /src/components/Navbar.jsx`,
            `re-rendering ReactThreeFiber scene nodes`,
            `GSAP timeline triggered scroll_pos_${window.scrollY}`,
            `rendering shaders with WebGL2 context`,
            `compilation finished in ${Math.floor(10 + Math.random() * 50)}ms`
          ];
          updated.push(items[Math.floor(Math.random() * items.length)]);
          return updated;
        });
      }
    }
  });

  return (
    <group ref={deskGroupRef} position={[0, -1.2, 0]}>
      {/* 1. Main Desk Top */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[6.5, 0.1, 3]} />
        <meshStandardMaterial 
          color="#0c0c16" 
          roughness={0.2} 
          metalness={0.8} 
        />
      </mesh>
      
      {/* Desk Neon Border Outline */}
      <mesh position={[0, 0.055, 0]}>
        <boxGeometry args={[6.55, 0.02, 3.05]} />
        <meshBasicMaterial color="#00f0ff" wireframe={true} />
      </mesh>

      {/* 2. Main Center Monitor */}
      <group position={[0, 1.3, -0.6]}>
        {/* Stand */}
        <mesh position={[0, -0.7, 0]}>
          <cylinderGeometry args={[0.08, 0.12, 0.6, 8]} />
          <meshStandardMaterial color="#1a1a2e" metalness={0.9} />
        </mesh>
        <mesh position={[0, -1.0, 0]}>
          <boxGeometry args={[0.8, 0.05, 0.6]} />
          <meshStandardMaterial color="#0c0c16" metalness={0.9} />
        </mesh>

        {/* Screen Frame */}
        <mesh>
          <boxGeometry args={[3.2, 1.8, 0.15]} />
          <meshStandardMaterial color="#141424" roughness={0.4} />
        </mesh>
        {/* Glow Border */}
        <mesh position={[0, 0, 0.01]}>
          <boxGeometry args={[3.22, 1.82, 0.13]} />
          <meshBasicMaterial color="#00f0ff" wireframe={true} />
        </mesh>

        {/* Embedded Terminal 1 (Left Half of Center Monitor) */}
        <group position={[-0.75, 0, 0.09]}>
          <Html transform distanceFactor={2.4} pointerEvents="none">
            <TerminalWindow title="BACKEND_CORE" content={logs1} color="#00f0ff" />
          </Html>
        </group>

        {/* Embedded Terminal 2 (Right Half of Center Monitor) */}
        <group position={[0.75, 0, 0.09]}>
          <Html transform distanceFactor={2.4} pointerEvents="none">
            <TerminalWindow title="VITE_DEV_SERVER" content={logs2} color="#ff007f" />
          </Html>
        </group>
      </group>

      {/* 3. Left Monitor (Angled inward) */}
      <group position={[-2.4, 1.2, -0.1]} rotation={[0, 0.45, 0]}>
        {/* Stand */}
        <mesh position={[0, -0.6, 0]}>
          <cylinderGeometry args={[0.08, 0.12, 0.6, 8]} />
          <meshStandardMaterial color="#1a1a2e" metalness={0.9} />
        </mesh>
        {/* Screen Frame */}
        <mesh>
          <boxGeometry args={[1.8, 1.3, 0.15]} />
          <meshStandardMaterial color="#141424" roughness={0.4} />
        </mesh>
        <mesh position={[0, 0, 0.01]}>
          <boxGeometry args={[1.82, 1.32, 0.13]} />
          <meshBasicMaterial color="#ff007f" wireframe={true} />
        </mesh>
        {/* Left Monitor Stats Display */}
        <group position={[0, 0, 0.09]}>
          <Html transform distanceFactor={2.4} pointerEvents="none">
            <div className="w-[150px] h-[110px] rounded border border-cyber-magenta bg-black/90 p-2 font-mono text-[8px] text-cyber-magenta select-none pointer-events-none relative overflow-hidden scanlines">
              <div className="absolute inset-0 scanline-overlay"></div>
              <div className="text-center font-bold border-b border-cyber-magenta/30 pb-1 mb-1 font-cyber tracking-wider">HOST_METRICS</div>
              <div className="space-y-1">
                <div className="flex justify-between"><span>CPU_TEMP</span><span className="font-bold">48°C</span></div>
                <div className="flex justify-between"><span>RAM_LOAD</span><span className="font-bold">58%</span></div>
                <div className="flex justify-between"><span>NET_PING</span><span className="font-bold">12ms</span></div>
                <div className="h-2 w-full bg-cyber-magenta/10 rounded border border-cyber-magenta/30 overflow-hidden relative mt-1">
                  <div className="h-full bg-cyber-magenta animate-pulse" style={{ width: '60%' }}></div>
                </div>
                <div className="text-[6px] text-slate-500 mt-1 animate-pulse">DISK_WRITE: OK [124MB/s]</div>
              </div>
            </div>
          </Html>
        </group>
      </group>

      {/* 4. Right Monitor (Angled inward) */}
      <group position={[2.4, 1.2, -0.1]} rotation={[0, -0.45, 0]}>
        {/* Stand */}
        <mesh position={[0, -0.6, 0]}>
          <cylinderGeometry args={[0.08, 0.12, 0.6, 8]} />
          <meshStandardMaterial color="#1a1a2e" metalness={0.9} />
        </mesh>
        {/* Screen Frame */}
        <mesh>
          <boxGeometry args={[1.8, 1.3, 0.15]} />
          <meshStandardMaterial color="#141424" roughness={0.4} />
        </mesh>
        <mesh position={[0, 0, 0.01]}>
          <boxGeometry args={[1.82, 1.32, 0.13]} />
          <meshBasicMaterial color="#39ff14" wireframe={true} />
        </mesh>
        {/* Right Monitor AI/System Log Display */}
        <group position={[0, 0, 0.09]}>
          <Html transform distanceFactor={2.4} pointerEvents="none">
            <div className="w-[150px] h-[110px] rounded border border-cyber-green bg-black/90 p-2 font-mono text-[8px] text-cyber-green select-none pointer-events-none relative overflow-hidden scanlines">
              <div className="absolute inset-0 scanline-overlay"></div>
              <div className="text-center font-bold border-b border-cyber-green/30 pb-1 mb-1 font-cyber tracking-wider">AI_AGENT</div>
              <div className="space-y-1">
                <div className="animate-pulse flex items-center space-x-1">
                  <span className="w-1 h-1 bg-cyber-green rounded-full"></span>
                  <span>LISTENING ON PORT...</span>
                </div>
                <div className="text-[6px] leading-tight opacity-75">
                  &gt; model: Gemini_3.5_Flash<br/>
                  &gt; latency: 0.18s<br/>
                  &gt; tokens: 4.8k/s<br/>
                  &gt; status: waiting_request...<br/>
                </div>
                <div className="flex space-x-0.5 mt-1">
                  <span className="w-1.5 h-1.5 bg-cyber-green/30 rounded-sm"></span>
                  <span className="w-1.5 h-1.5 bg-cyber-green/80 rounded-sm"></span>
                  <span className="w-1.5 h-1.5 bg-cyber-green/10 rounded-sm"></span>
                  <span className="w-1.5 h-1.5 bg-cyber-green/90 rounded-sm"></span>
                  <span className="w-1.5 h-1.5 bg-cyber-green/40 rounded-sm"></span>
                </div>
              </div>
            </div>
          </Html>
        </group>
      </group>

      {/* 5. Mechanical Keyboard */}
      <group position={[0, 0.1, 0.6]}>
        {/* Keyboard Base */}
        <mesh>
          <boxGeometry args={[1.5, 0.06, 0.55]} />
          <meshStandardMaterial color="#1a1a2e" metalness={0.9} />
        </mesh>
        
        {/* Glowing Keyboard Base outline */}
        <mesh position={[0, 0.02, 0]}>
          <boxGeometry args={[1.52, 0.03, 0.57]} />
          <meshBasicMaterial color="#00f0ff" wireframe={true} />
        </mesh>

        {/* Emissive Keycaps Matrix (simulated with standard geometry) */}
        <mesh position={[0, 0.04, 0]}>
          <boxGeometry args={[1.4, 0.02, 0.45]} />
          <meshStandardMaterial 
            color="#ff007f" 
            emissive="#ff007f" 
            emissiveIntensity={0.6} 
            roughness={0.5} 
          />
        </mesh>
      </group>

      {/* 6. Desk Accents (Coffee Mug / Cyber Gadget) */}
      <group position={[-1.2, 0.2, 0.5]}>
        <mesh>
          <cylinderGeometry args={[0.1, 0.1, 0.25, 12]} />
          <meshStandardMaterial color="#ff007f" roughness={0.1} />
        </mesh>
        <pointLight color="#ff007f" intensity={0.4} distance={0.8} position={[0, 0.2, 0]} />
      </group>
      
      <group position={[1.4, 0.15, 0.4]}>
        {/* Futuristic glowing data drive */}
        <mesh>
          <boxGeometry args={[0.3, 0.1, 0.4]} />
          <meshStandardMaterial color="#00f0ff" roughness={0.4} />
        </mesh>
        <mesh position={[0, 0.055, 0]}>
          <boxGeometry args={[0.2, 0.02, 0.3]} />
          <meshBasicMaterial color="#00f0ff" />
        </mesh>
        <pointLight color="#00f0ff" intensity={0.5} distance={1.0} position={[0, 0.1, 0]} />
      </group>
    </group>
  );
};

export default CyberDesk;
