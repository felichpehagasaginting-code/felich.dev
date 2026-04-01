'use client';

import { useRef, useState, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial, useCursor } from '@react-three/drei';
import * as THREE from 'three';

function AnimatedShape() {
  const mesh = useRef<THREE.Mesh>(null);
  const [hovered, setHover] = useState(false);
  const [active, setActive] = useState(false);
  
  useCursor(hovered);

  const colors = useMemo(() => {
    return {
      default: new THREE.Color('#3b82f6'), // blue-500
      hover: new THREE.Color('#8b5cf6')    // violet-500
    }
  }, []);

  useFrame((state) => {
    if (!mesh.current) return;
    
    // Smooth auto-rotation
    mesh.current.rotation.x += 0.005;
    mesh.current.rotation.y += 0.01;
    
    // Interactive mouse tracking
    const targetX = (state.pointer.x * Math.PI) / 8;
    const targetY = (state.pointer.y * Math.PI) / 8;
    
    mesh.current.rotation.y += 0.05 * (targetX - mesh.current.rotation.y);
    mesh.current.rotation.x += 0.05 * (targetY - mesh.current.rotation.x);

    // Manual scale interpolation
    const targetScale = active ? 1.2 : 1;
    mesh.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
  });

  return (
    <Float scale={1.2} speed={2} rotationIntensity={1.5} floatIntensity={2}>
      <mesh
        ref={mesh}
        onClick={() => setActive(!active)}
        onPointerOver={() => setHover(true)}
        onPointerOut={() => setHover(false)}
      >
        <sphereGeometry args={[1, 64, 64]} />
        <MeshDistortMaterial
          color={hovered ? colors.hover : colors.default}
          envMapIntensity={1}
          clearcoat={1}
          clearcoatRoughness={0.1}
          metalness={0.8}
          roughness={0.2}
          distort={hovered ? 0.6 : 0.3}
          speed={hovered ? 5 : 2}
        />
      </mesh>
    </Float>
  );
}

export default function Hero3D() {
  return (
    <div className="w-full h-[300px] md:h-[400px] lg:h-[450px] relative">
      <Canvas
        camera={{ position: [0, 0, 4], fov: 45 }}
        className="w-full h-full !absolute inset-0 focus:outline-none"
        dpr={[1, 2]}
      >
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 10]} intensity={1.5} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} />
        
        <AnimatedShape />
      </Canvas>
    </div>
  );
}
