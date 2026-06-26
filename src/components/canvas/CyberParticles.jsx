import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const CyberParticles = ({ count = 120 }) => {
  const pointsRef = useRef();

  // Create random position coordinates and velocities
  const [positions, velocities] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const vels = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      // Spread particles across a wide 3D space
      pos[i * 3] = (Math.random() - 0.5) * 30; // X
      pos[i * 3 + 1] = (Math.random() - 0.5) * 20; // Y
      pos[i * 3 + 2] = (Math.random() - 0.5) * 30; // Z
      vels[i] = 0.02 + Math.random() * 0.05; // Fall velocity
    }
    return [pos, vels];
  }, [count]);

  useFrame((state) => {
    if (!pointsRef.current) return;
    
    const geo = pointsRef.current.geometry;
    const positionsAttr = geo.attributes.position;
    
    // Slow mouse influence
    const mouseX = state.pointer.x * 2;
    const mouseY = state.pointer.y * 2;

    for (let i = 0; i < count; i++) {
      let y = positionsAttr.getY(i);
      let x = positionsAttr.getX(i);
      
      // Fall downward
      y -= velocities[i];
      
      // Gentle drift based on mouse
      x += (mouseX - x) * 0.001;

      // Wrap around when particle falls too low
      if (y < -10) {
        y = 10;
        x = (Math.random() - 0.5) * 30;
      }
      
      positionsAttr.setY(i, y);
      positionsAttr.setX(i, x);
    }
    
    positionsAttr.needsUpdate = true;
    pointsRef.current.rotation.y += 0.0005;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        color="#00f0ff"
        size={0.08}
        sizeAttenuation={true}
        transparent={true}
        opacity={0.6}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
};

export default React.memo(CyberParticles);
