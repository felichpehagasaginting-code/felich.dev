'use client';

import { useRef, useState, useMemo, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial, OrbitControls, Points, PointMaterial, Environment, Sphere, Torus } from '@react-three/drei';
import * as THREE from 'three';
import { useLayoutStore } from '@/lib/store';

function ParticleSwarm({ isMobile, activeColor }: { isMobile: boolean; activeColor: string }) {
  const ref = useRef<THREE.Points>(null);
  
  const sphereCount = isMobile ? 600 : 2000;
  const spherePositions = useMemo(() => {
    const positions = new Float32Array(sphereCount * 3);
    for (let i = 0; i < sphereCount; i++) {
        const r = 2.5 * Math.cbrt(Math.random());
        const theta = Math.random() * 2 * Math.PI;
        const phi = Math.acos(2 * Math.random() - 1);
        
        positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
        positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
        positions[i * 3 + 2] = r * Math.cos(phi);
    }
    return positions;
  }, [sphereCount]);

  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.x -= delta / 15;
      ref.current.rotation.y -= delta / 20;
      
      const targetX = (state.pointer.x * Math.PI) / 8;
      const targetY = (state.pointer.y * Math.PI) / 8;
      
      ref.current.rotation.y += 0.05 * (targetX - ref.current.rotation.y);
      ref.current.rotation.x += 0.05 * (targetY - ref.current.rotation.x);
    }
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={spherePositions} stride={3} frustumCulled={false}>
        <PointMaterial
          transparent
          color={activeColor} 
          size={0.03}
          sizeAttenuation={true}
          depthWrite={false}
          opacity={0.5}
          blending={THREE.AdditiveBlending}
        />
      </Points>
    </group>
  );
}

function OrbitRings({ isMobile, activeColor }: { isMobile: boolean; activeColor: string }) {
  const ring1Ref = useRef<THREE.Mesh>(null);
  const ring2Ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (ring1Ref.current) {
      ring1Ref.current.rotation.z = time * 0.5;
      ring1Ref.current.rotation.x = Math.PI / 2 + Math.sin(time * 0.3) * 0.2;
    }
    if (ring2Ref.current) {
      ring2Ref.current.rotation.z = -time * 0.3;
      ring2Ref.current.rotation.y = Math.PI / 2 + Math.cos(time * 0.2) * 0.2;
    }
  });

  return (
    <group>
      <Torus ref={ring1Ref} args={[1.5, 0.01, isMobile ? 8 : 16, isMobile ? 40 : 100]}>
        <meshBasicMaterial color={activeColor} transparent opacity={0.25} />
      </Torus>
      <Torus ref={ring2Ref} args={[1.8, 0.005, isMobile ? 8 : 16, isMobile ? 40 : 100]}>
        <meshBasicMaterial color={activeColor} transparent opacity={0.15} />
      </Torus>
    </group>
  );
}

function CoreShape({ isMobile }: { isMobile: boolean }) {
  const coreRef = useRef<THREE.Mesh>(null);
  const { theme } = useLayoutStore();

  const coreColor = useMemo(() => {
    if (theme === 'yellow') return '#d97706';
    if (theme === 'apple') return '#ffffff';
    return '#3b82f6';
  }, [theme]);
  
  useFrame((state) => {
    if (!coreRef.current) return;
    const time = state.clock.getElapsedTime();
    coreRef.current.position.y = Math.sin(time * 2) * 0.05;
    coreRef.current.rotation.y += 0.005;
    coreRef.current.rotation.x += 0.002;
  });

  return (
    <Float floatIntensity={isMobile ? 0.8 : 1.5} speed={isMobile ? 1.5 : 3}>
      <mesh ref={coreRef}>
        <icosahedronGeometry args={[1.3, 0]} />
        {theme === 'apple' ? (
          isMobile ? (
            <meshStandardMaterial
              color="#ffffff"
              roughness={0.1}
              metalness={0.1}
              transparent={true}
              opacity={0.8}
              flatShading={true}
            />
          ) : (
            <MeshDistortMaterial
              color="#ffffff"
              speed={2}
              distort={0.2}
              radius={1}
              transmission={1}
              thickness={2}
              ior={1.4}
              reflectivity={0.5}
              roughness={0}
              metalness={0.05}
              transparent={true}
              opacity={1}
              clearcoat={1}
              clearcoatRoughness={0}
              attenuationDistance={0.5}
              attenuationColor="#ffffff"
              flatShading={true}
            />
          )
        ) : (
          isMobile ? (
            <meshStandardMaterial
              color={coreColor}
              roughness={0.1}
              metalness={0.1}
              transparent={true}
              opacity={0.25}
              flatShading={true}
            />
          ) : (
            <meshPhysicalMaterial 
              color={coreColor} 
              emissive={coreColor}
              emissiveIntensity={0.15}
              roughness={0.15}
              metalness={0.1}
              transmission={0.85}
              thickness={1.2}
              ior={1.3}
              reflectivity={0.8}
              clearcoat={1}
              clearcoatRoughness={0.05}
              opacity={0.9}
              transparent={true}
              flatShading={true}
            />
          )
        )}
      </mesh>
    </Float>
  );
}

function InnerCore({ isMobile }: { isMobile: boolean }) {
  const [hovered, setHover] = useState(false);
  const { theme } = useLayoutStore();
  
  const colors = useMemo(() => {
    if (theme === 'yellow') return { default: new THREE.Color('#fbbf24'), hover: new THREE.Color('#f59e0b') };
    if (theme === 'apple') return { default: new THREE.Color('#0A84FF'), hover: new THREE.Color('#ffffff') };
    return {
      default: new THREE.Color('#ec4899'),
      hover: new THREE.Color('#f43f5e')
    }
  }, [theme]);

  return (
    <Sphere 
      args={[0.5, isMobile ? 20 : 64, isMobile ? 20 : 64]} 
      onPointerOver={() => setHover(true)}
      onPointerOut={() => setHover(false)}
    >
      {isMobile ? (
        <meshStandardMaterial
          color={hovered ? colors.hover : colors.default}
          metalness={0.8}
          roughness={0.2}
        />
      ) : (
        <MeshDistortMaterial
          color={hovered ? colors.hover : colors.default}
          envMapIntensity={2}
          clearcoat={1}
          clearcoatRoughness={0}
          metalness={0.9}
          roughness={0.1}
          distort={hovered ? 0.6 : 0.4}
          speed={hovered ? 6 : 4}
        />
      )}
    </Sphere>
  );
}

function ReactShape({ isMobile, color }: { isMobile: boolean; color: string }) {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (!groupRef.current) return;
    const time = state.clock.getElapsedTime();
    groupRef.current.rotation.y = time * 0.3;
    groupRef.current.rotation.x = Math.sin(time * 0.2) * 0.15;
  });

  return (
    <Float floatIntensity={1.5} speed={3}>
      <group ref={groupRef}>
        <Sphere args={[0.35, isMobile ? 16 : 32, isMobile ? 16 : 32]}>
          <meshStandardMaterial 
            color={color} 
            emissive={color} 
            emissiveIntensity={0.6} 
            roughness={0.1} 
          />
        </Sphere>
        <Torus args={[1.2, 0.015, 8, isMobile ? 32 : 64]} rotation={[Math.PI / 3, 0, 0]}>
          <meshBasicMaterial color={color} transparent opacity={0.4} />
        </Torus>
        <Torus args={[1.2, 0.015, 8, isMobile ? 32 : 64]} rotation={[-Math.PI / 3, Math.PI / 3, 0]}>
          <meshBasicMaterial color={color} transparent opacity={0.4} />
        </Torus>
        <Torus args={[1.2, 0.015, 8, isMobile ? 32 : 64]} rotation={[-Math.PI / 3, -Math.PI / 3, 0]}>
          <meshBasicMaterial color={color} transparent opacity={0.4} />
        </Torus>
      </group>
    </Float>
  );
}

function TypeScriptShape({ isMobile, color }: { isMobile: boolean; color: string }) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (!meshRef.current) return;
    const time = state.clock.getElapsedTime();
    meshRef.current.rotation.y = time * 0.4;
    meshRef.current.rotation.x = time * 0.2;
    meshRef.current.position.y = Math.sin(time * 2) * 0.05;
  });

  return (
    <Float floatIntensity={1} speed={2}>
      <mesh ref={meshRef}>
        <boxGeometry args={[1.2, 1.2, 1.2]} />
        {isMobile ? (
          <meshStandardMaterial
            color={color}
            roughness={0.2}
            metalness={0.8}
            transparent
            opacity={0.8}
          />
        ) : (
          <meshPhysicalMaterial
            color={color}
            emissive={color}
            emissiveIntensity={0.2}
            transmission={0.8}
            thickness={0.8}
            roughness={0.1}
            clearcoat={1}
            clearcoatRoughness={0.05}
            transparent
            opacity={0.9}
          />
        )}
      </mesh>
    </Float>
  );
}

function NextJsShape({ isMobile, color }: { isMobile: boolean; color: string }) {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (!groupRef.current) return;
    const time = state.clock.getElapsedTime();
    groupRef.current.rotation.y = -time * 0.25;
    groupRef.current.rotation.x = Math.PI / 8 + Math.cos(time * 0.15) * 0.05;
  });

  return (
    <Float floatIntensity={1.2} speed={2.5}>
      <group ref={groupRef}>
        <Sphere args={[0.8, isMobile ? 16 : 48, isMobile ? 16 : 48]}>
          <meshPhysicalMaterial
            color={color === '#000000' ? '#111111' : '#000000'}
            emissive={color}
            emissiveIntensity={0.05}
            roughness={0.15}
            metalness={0.9}
            clearcoat={1}
            clearcoatRoughness={0.1}
          />
        </Sphere>
        <Torus args={[1.2, 0.04, 8, isMobile ? 32 : 80]} rotation={[Math.PI / 2.2, 0, Math.PI / 6]}>
          <meshPhysicalMaterial 
            color={color} 
            emissive={color} 
            emissiveIntensity={0.5} 
            roughness={0.1} 
            metalness={0.9}
          />
        </Torus>
      </group>
    </Float>
  );
}

function PythonShape({ isMobile, color }: { isMobile: boolean; color: string }) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (!meshRef.current) return;
    const time = state.clock.getElapsedTime();
    meshRef.current.rotation.y = time * 0.3;
    meshRef.current.rotation.x = Math.sin(time * 0.3) * 0.2;
  });

  return (
    <Float floatIntensity={1.5} speed={3}>
      <mesh ref={meshRef}>
        <torusKnotGeometry args={[0.7, 0.22, isMobile ? 40 : 100, 16, 2, 3]} />
        {isMobile ? (
          <meshStandardMaterial
            color={color}
            roughness={0.3}
            metalness={0.7}
          />
        ) : (
          <meshPhysicalMaterial
            color={color}
            emissive="#ffd43b"
            emissiveIntensity={0.15}
            roughness={0.2}
            metalness={0.5}
            transmission={0.4}
            thickness={1}
            clearcoat={0.8}
            clearcoatRoughness={0.1}
          />
        )}
      </mesh>
    </Float>
  );
}

function SvelteShape({ isMobile, color }: { isMobile: boolean; color: string }) {
  const meshRef = useRef<THREE.Mesh>(null);

  const curve = useMemo(() => {
    const points = [];
    const count = 64;
    for (let i = 0; i < count; i++) {
      const t = i / count;
      const angle = t * Math.PI * 2;
      const x = Math.sin(angle) * 0.6;
      const y = Math.sin(angle * 2) * 0.45;
      const z = Math.cos(angle) * 0.2;
      points.push(new THREE.Vector3(x, y, z));
    }
    return new THREE.CatmullRomCurve3(points, true);
  }, []);

  useFrame((state) => {
    if (!meshRef.current) return;
    const time = state.clock.getElapsedTime();
    meshRef.current.rotation.y = time * 0.4;
    meshRef.current.rotation.z = Math.sin(time * 0.2) * 0.1;
  });

  return (
    <Float floatIntensity={1.3} speed={2.5}>
      <mesh ref={meshRef}>
        <tubeGeometry args={[curve, 64, 0.08, 12, true]} />
        <meshPhysicalMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.5}
          roughness={0.1}
          metalness={0.2}
          transmission={0.4}
          thickness={0.5}
          clearcoat={1}
        />
      </mesh>
    </Float>
  );
}

function ViteShape({ isMobile, color }: { isMobile: boolean; color: string }) {
  const groupRef = useRef<THREE.Group>(null);

  const vShape = useMemo(() => {
    const s = new THREE.Shape();
    s.moveTo(-0.55, 0.6);
    s.lineTo(-0.28, 0.6);
    s.lineTo(0, -0.05);
    s.lineTo(0.28, 0.6);
    s.lineTo(0.55, 0.6);
    s.lineTo(0.12, -0.55);
    s.lineTo(-0.12, -0.55);
    s.closePath();
    return s;
  }, []);

  const boltShape = useMemo(() => {
    const s = new THREE.Shape();
    s.moveTo(-0.1, 0.35);
    s.lineTo(0.18, 0.35);
    s.lineTo(0.04, 0.08);
    s.lineTo(0.2, 0.08);
    s.lineTo(-0.12, -0.35);
    s.lineTo(-0.02, -0.05);
    s.lineTo(-0.18, -0.05);
    s.closePath();
    return s;
  }, []);

  const extrudeV = useMemo(() => ({
    depth: 0.12,
    bevelEnabled: true,
    bevelSegments: 3,
    steps: 1,
    bevelSize: 0.02,
    bevelThickness: 0.02,
  }), []);

  const extrudeBolt = useMemo(() => ({
    depth: 0.08,
    bevelEnabled: true,
    bevelSegments: 2,
    steps: 1,
    bevelSize: 0.015,
    bevelThickness: 0.015,
  }), []);

  useFrame((state) => {
    if (!groupRef.current) return;
    const time = state.clock.getElapsedTime();
    groupRef.current.rotation.y = time * 0.35;
    groupRef.current.rotation.x = Math.sin(time * 0.18) * 0.12;
  });

  return (
    <Float floatIntensity={1.3} speed={2.6}>
      <group ref={groupRef}>
        {/* Purple 'V' */}
        <mesh position={[0, 0, -0.05]}>
          <extrudeGeometry args={[vShape, extrudeV]} />
          <meshPhysicalMaterial
            color={color}
            emissive={color}
            emissiveIntensity={0.2}
            roughness={0.15}
            metalness={0.4}
            transmission={0.4}
            thickness={0.5}
            clearcoat={1}
          />
        </mesh>
        
        {/* Yellow Lightning Bolt */}
        <mesh position={[0, 0.05, 0.08]}>
          <extrudeGeometry args={[boltShape, extrudeBolt]} />
          <meshPhysicalMaterial
            color="#ffd43b"
            emissive="#ffd43b"
            emissiveIntensity={0.8}
            roughness={0.1}
            metalness={0.1}
            transmission={0.1}
            thickness={0.2}
          />
        </mesh>
      </group>
    </Float>
  );
}

function DockerShape({ isMobile, color }: { isMobile: boolean; color: string }) {
  const groupRef = useRef<THREE.Group>(null);

  const containerData = useMemo(() => [
    { pos: [-0.45, -0.25, 0], scale: 1 },
    { pos: [0.15, -0.25, 0], scale: 1 },
    { pos: [-0.3, 0.15, 0], scale: 1 },
    { pos: [0.3, 0.15, 0], scale: 1 },
    { pos: [0, 0.55, 0], scale: 1 }
  ], []);

  useFrame((state) => {
    if (!groupRef.current) return;
    const time = state.clock.getElapsedTime();
    groupRef.current.rotation.y = time * 0.3;
    groupRef.current.rotation.x = Math.sin(time * 0.2) * 0.12;
  });

  return (
    <Float floatIntensity={1.2} speed={2.4}>
      <group ref={groupRef}>
        {containerData.map((c, i) => (
          <group key={i} position={c.pos as [number, number, number]}>
            {/* Solid Container Body */}
            <mesh>
              <boxGeometry args={[0.55, 0.32, 0.5]} />
              <meshPhysicalMaterial
                color={color}
                emissive={color}
                emissiveIntensity={0.2}
                roughness={0.15}
                metalness={0.5}
                transmission={0.4}
                thickness={0.3}
              />
            </mesh>
            
            {/* Glowing Wireframe Edges */}
            <lineSegments>
              <edgesGeometry args={[new THREE.BoxGeometry(0.55, 0.32, 0.5)]} />
              <lineBasicMaterial color="#ffffff" transparent opacity={0.6} />
            </lineSegments>
          </group>
        ))}
      </group>
    </Float>
  );
}

function RedisShape({ isMobile, color }: { isMobile: boolean; color: string }) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!groupRef.current) return;
    const time = state.clock.getElapsedTime();
    groupRef.current.rotation.y = time * 0.3;
    groupRef.current.rotation.x = Math.PI / 8 + Math.sin(time * 0.2) * 0.1;
  });

  return (
    <Float floatIntensity={1.2} speed={2.2}>
      <group ref={groupRef}>
        {/* Layer 1 (Top) */}
        <mesh position={[0, 0.32, 0]}>
          <boxGeometry args={[0.9, 0.16, 0.9]} />
          <meshPhysicalMaterial
            color={color}
            emissive={color}
            emissiveIntensity={0.2}
            roughness={0.1}
            metalness={0.1}
            transmission={0.6}
            thickness={0.4}
            clearcoat={1}
          />
        </mesh>

        {/* Glow Spacer 1 */}
        <mesh position={[0, 0.16, 0]}>
          <cylinderGeometry args={[0.35, 0.35, 0.16, 16]} />
          <meshBasicMaterial color="#ff7300" transparent opacity={0.8} />
        </mesh>

        {/* Layer 2 (Middle) */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[0.9, 0.16, 0.9]} />
          <meshPhysicalMaterial
            color={color}
            emissive={color}
            emissiveIntensity={0.2}
            roughness={0.1}
            metalness={0.1}
            transmission={0.6}
            thickness={0.4}
            clearcoat={1}
          />
        </mesh>

        {/* Glow Spacer 2 */}
        <mesh position={[0, -0.16, 0]}>
          <cylinderGeometry args={[0.35, 0.35, 0.16, 16]} />
          <meshBasicMaterial color="#ff7300" transparent opacity={0.8} />
        </mesh>

        {/* Layer 3 (Bottom) */}
        <mesh position={[0, -0.32, 0]}>
          <boxGeometry args={[0.9, 0.16, 0.9]} />
          <meshPhysicalMaterial
            color={color}
            emissive={color}
            emissiveIntensity={0.2}
            roughness={0.1}
            metalness={0.1}
            transmission={0.6}
            thickness={0.4}
            clearcoat={1}
          />
        </mesh>
      </group>
    </Float>
  );
}

function NodeJsShape({ isMobile, color }: { isMobile: boolean; color: string }) {
  const groupRef = useRef<THREE.Group>(null);

  const hexShape = useMemo(() => {
    const s = new THREE.Shape();
    const radius = 0.85;
    for (let i = 0; i < 6; i++) {
      const angle = (i / 6) * Math.PI * 2;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;
      if (i === 0) s.moveTo(x, y);
      else s.lineTo(x, y);
    }
    s.closePath();
    return s;
  }, []);

  const extrudeSettings = useMemo(() => ({
    depth: 0.2,
    bevelEnabled: true,
    bevelSegments: 3,
    steps: 1,
    bevelSize: 0.03,
    bevelThickness: 0.03,
  }), []);

  useFrame((state) => {
    if (!groupRef.current) return;
    const time = state.clock.getElapsedTime();
    groupRef.current.rotation.y = time * 0.3;
    groupRef.current.rotation.x = Math.sin(time * 0.2) * 0.15;
  });

  return (
    <Float floatIntensity={1.2} speed={2.5}>
      <group ref={groupRef}>
        {/* Outer Hexagon */}
        <mesh position={[0, 0, -0.1]}>
          <extrudeGeometry args={[hexShape, extrudeSettings]} />
          <meshPhysicalMaterial
            color={color}
            emissive={color}
            emissiveIntensity={0.3}
            roughness={0.1}
            metalness={0.2}
            transmission={0.6}
            thickness={0.5}
            clearcoat={1}
          />
        </mesh>

        {/* Inner Core Sphere */}
        <mesh position={[0, 0, 0.05]}>
          <sphereGeometry args={[0.25, 32, 32]} />
          <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.5} roughness={0.1} />
        </mesh>
      </group>
    </Float>
  );
}

function PrismaShape({ isMobile, color }: { isMobile: boolean; color: string }) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!groupRef.current) return;
    const time = state.clock.getElapsedTime();
    groupRef.current.rotation.y = time * 0.4;
    groupRef.current.rotation.x = time * 0.2;
  });

  return (
    <Float floatIntensity={1.4} speed={3}>
      <group ref={groupRef}>
        {/* Top Pyramidal Half */}
        <mesh position={[0, 0.3, 0]}>
          <coneGeometry args={[0.55, 0.6, 3]} />
          <meshPhysicalMaterial
            color={color === '#2d3748' ? '#0f172a' : color}
            emissive={color}
            emissiveIntensity={0.15}
            roughness={0.05}
            metalness={0.1}
            transmission={0.85}
            thickness={1}
            clearcoat={1}
            clearcoatRoughness={0}
          />
        </mesh>

        {/* Bottom Pyramidal Half */}
        <mesh position={[0, -0.3, 0]} rotation={[Math.PI, 0, 0]}>
          <coneGeometry args={[0.55, 0.6, 3]} />
          <meshPhysicalMaterial
            color={color === '#2d3748' ? '#0f172a' : color}
            emissive={color}
            emissiveIntensity={0.15}
            roughness={0.05}
            metalness={0.1}
            transmission={0.85}
            thickness={1}
            clearcoat={1}
            clearcoatRoughness={0}
          />
        </mesh>
      </group>
    </Float>
  );
}

function TailwindShape({ isMobile, color }: { isMobile: boolean; color: string }) {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (!groupRef.current) return;
    const time = state.clock.getElapsedTime();
    groupRef.current.rotation.y = time * 0.35;
    groupRef.current.rotation.x = Math.sin(time * 0.25) * 0.12;
  });

  return (
    <Float floatIntensity={1.3} speed={2.5}>
      <group ref={groupRef}>
        {/* Wave 1 */}
        <mesh position={[-0.18, 0.12, -0.06]} rotation={[0, 0, -Math.PI / 6]} scale={[1.4, 0.45, 1]}>
          <torusGeometry args={[0.7, 0.08, 12, 64]} />
          <meshPhysicalMaterial 
            color={color} 
            emissive={color}
            emissiveIntensity={0.4}
            roughness={0.1} 
            metalness={0.2}
            transmission={0.6}
            thickness={0.4}
            clearcoat={1}
          />
        </mesh>
        {/* Wave 2 */}
        <mesh position={[0.18, -0.12, 0.06]} rotation={[0, 0, -Math.PI / 6]} scale={[1.4, 0.45, 1]}>
          <torusGeometry args={[0.7, 0.08, 12, 64]} />
          <meshPhysicalMaterial 
            color={color} 
            emissive={color}
            emissiveIntensity={0.4}
            roughness={0.1} 
            metalness={0.2}
            transmission={0.6}
            thickness={0.4}
            clearcoat={1}
          />
        </mesh>
      </group>
    </Float>
  );
}

function GitShape({ isMobile, color }: { isMobile: boolean; color: string }) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!groupRef.current) return;
    const time = state.clock.getElapsedTime();
    groupRef.current.rotation.y = time * 0.4;
    groupRef.current.rotation.x = Math.sin(time * 0.2) * 0.15;
  });

  return (
    <Float floatIntensity={1.2} speed={2.5}>
      <group ref={groupRef} rotation={[0, 0, Math.PI / 4]}>
        {/* Main Trunk */}
        <mesh position={[0, 0, 0]}>
          <cylinderGeometry args={[0.07, 0.07, 1.6, 16]} />
          <meshStandardMaterial color={color} metalness={0.8} roughness={0.2} />
        </mesh>
        {/* Branch */}
        <mesh position={[0.25, 0.15, 0]} rotation={[0, 0, -Math.PI / 4]}>
          <cylinderGeometry args={[0.07, 0.07, 0.707, 16]} />
          <meshStandardMaterial color={color} metalness={0.8} roughness={0.2} />
        </mesh>
        {/* Bottom Node */}
        <mesh position={[0, -0.8, 0]}>
          <sphereGeometry args={[0.18, 32, 32]} />
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.3} metalness={0.8} roughness={0.2} />
        </mesh>
        {/* Top Node */}
        <mesh position={[0, 0.8, 0]}>
          <sphereGeometry args={[0.18, 32, 32]} />
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.3} metalness={0.8} roughness={0.2} />
        </mesh>
        {/* Branch Node */}
        <mesh position={[0.5, 0.4, 0]}>
          <sphereGeometry args={[0.18, 32, 32]} />
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.3} metalness={0.8} roughness={0.2} />
        </mesh>
      </group>
    </Float>
  );
}

function FirebaseShape({ isMobile, color }: { isMobile: boolean; color: string }) {
  const groupRef = useRef<THREE.Group>(null);

  const orangeShape = useMemo(() => {
    const s = new THREE.Shape();
    s.moveTo(0, 0.85);
    s.lineTo(-0.65, -0.4);
    s.lineTo(0, -0.6);
    s.lineTo(0.65, -0.4);
    s.closePath();
    return s;
  }, []);

  const redShape = useMemo(() => {
    const s = new THREE.Shape();
    s.moveTo(0, 0.85);
    s.lineTo(-0.65, -0.4);
    s.lineTo(0, -0.2);
    s.closePath();
    return s;
  }, []);

  const yellowShape = useMemo(() => {
    const s = new THREE.Shape();
    s.moveTo(0, 0.85);
    s.lineTo(0.65, -0.4);
    s.lineTo(-0.3, -0.15);
    s.closePath();
    return s;
  }, []);

  const extrudeSettings = useMemo(() => ({
    depth: 0.08,
    bevelEnabled: true,
    bevelSegments: 3,
    steps: 1,
    bevelSize: 0.02,
    bevelThickness: 0.02,
  }), []);

  useFrame((state) => {
    if (!groupRef.current) return;
    const time = state.clock.getElapsedTime();
    groupRef.current.rotation.y = time * 0.35;
    groupRef.current.rotation.x = Math.sin(time * 0.15) * 0.2;
  });

  return (
    <Float floatIntensity={1.5} speed={2.5}>
      <group ref={groupRef}>
        {/* Orange base sheet */}
        <mesh position={[0, 0, -0.06]}>
          <extrudeGeometry args={[orangeShape, extrudeSettings]} />
          <meshPhysicalMaterial
            color="#ff9100"
            roughness={0.1}
            metalness={0.1}
            transmission={0.6}
            thickness={0.5}
            clearcoat={1}
            emissive="#ff9100"
            emissiveIntensity={0.2}
          />
        </mesh>
        
        {/* Red left wing */}
        <mesh position={[0, 0, 0]}>
          <extrudeGeometry args={[redShape, extrudeSettings]} />
          <meshPhysicalMaterial
            color="#dd2c00"
            roughness={0.2}
            metalness={0.3}
            transmission={0.3}
            thickness={0.2}
            clearcoat={0.8}
            emissive="#dd2c00"
            emissiveIntensity={0.2}
          />
        </mesh>

        {/* Yellow top/right wing */}
        <mesh position={[0, 0, 0.06]}>
          <extrudeGeometry args={[yellowShape, extrudeSettings]} />
          <meshPhysicalMaterial
            color="#ffca28"
            roughness={0.15}
            metalness={0.2}
            transmission={0.4}
            thickness={0.3}
            clearcoat={1}
            emissive="#ffca28"
            emissiveIntensity={0.3}
          />
        </mesh>
      </group>
    </Float>
  );
}

function SupabaseShape({ isMobile, color }: { isMobile: boolean; color: string }) {
  const groupRef = useRef<THREE.Group>(null);

  const boltShape = useMemo(() => {
    const s = new THREE.Shape();
    s.moveTo(-0.35, 0.3);
    s.lineTo(0.35, 0.3);
    s.lineTo(0.1, -0.1);
    s.lineTo(0.35, -0.1);
    s.lineTo(-0.1, -0.7);
    s.lineTo(-0.02, -0.2);
    s.lineTo(-0.25, -0.2);
    s.closePath();
    return s;
  }, []);

  const extrudeSettings = useMemo(() => ({
    depth: 0.15,
    bevelEnabled: true,
    bevelSegments: 3,
    steps: 1,
    bevelSize: 0.02,
    bevelThickness: 0.03,
  }), []);

  useFrame((state) => {
    if (!groupRef.current) return;
    const time = state.clock.getElapsedTime();
    groupRef.current.rotation.y = time * 0.4;
    groupRef.current.rotation.x = Math.sin(time * 0.2) * 0.15;
  });

  return (
    <Float floatIntensity={1.4} speed={2.8}>
      <group ref={groupRef} position={[-0.1, 0.15, 0]}>
        {/* Bolt 1 */}
        <mesh position={[-0.12, 0.15, -0.05]} rotation={[0, 0, 0.1]}>
          <extrudeGeometry args={[boltShape, extrudeSettings]} />
          <meshPhysicalMaterial
            color="#3ecf8e"
            emissive="#3ecf8e"
            emissiveIntensity={0.3}
            roughness={0.1}
            metalness={0.1}
            transmission={0.5}
            thickness={0.5}
            clearcoat={1}
          />
        </mesh>
        
        {/* Bolt 2 */}
        <mesh position={[0.12, -0.15, 0.05]} rotation={[0, 0, 0.1]} scale={[1, 1, 1]}>
          <extrudeGeometry args={[boltShape, extrudeSettings]} />
          <meshPhysicalMaterial
            color="#3ecf8e"
            emissive="#3ecf8e"
            emissiveIntensity={0.5}
            roughness={0.1}
            metalness={0.3}
            transmission={0.3}
            thickness={0.5}
            clearcoat={1}
          />
        </mesh>
      </group>
    </Float>
  );
}

function RustShape({ isMobile, color }: { isMobile: boolean; color: string }) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (!meshRef.current) return;
    const time = state.clock.getElapsedTime();
    meshRef.current.rotation.z = time * 0.45;
    meshRef.current.rotation.x = Math.PI / 6 + Math.sin(time * 0.15) * 0.1;
    meshRef.current.rotation.y = Math.cos(time * 0.1) * 0.15;
  });

  const teeth = useMemo(() => {
    const t = [];
    const count = 12;
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      t.push(
        <mesh 
          key={i} 
          position={[Math.cos(angle) * 0.72, Math.sin(angle) * 0.72, 0]} 
          rotation={[0, 0, angle]}
        >
          <boxGeometry args={[0.14, 0.12, 0.15]} />
          <meshStandardMaterial color={color} metalness={0.9} roughness={0.15} />
        </mesh>
      );
    }
    return t;
  }, [color]);

  return (
    <Float floatIntensity={1.2} speed={2}>
      <mesh ref={meshRef}>
        {/* Outer Ring */}
        <mesh>
          <torusGeometry args={[0.68, 0.09, 16, 64]} />
          <meshStandardMaterial color={color} metalness={0.9} roughness={0.15} />
        </mesh>
        
        {/* Inner Hub */}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.18, 0.18, 0.16, 32]} />
          <meshStandardMaterial color={color} metalness={0.9} roughness={0.15} />
        </mesh>

        {/* Spokes */}
        <mesh>
          <boxGeometry args={[1.2, 0.08, 0.12]} />
          <meshStandardMaterial color={color} metalness={0.9} roughness={0.15} />
        </mesh>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <boxGeometry args={[1.2, 0.08, 0.12]} />
          <meshStandardMaterial color={color} metalness={0.9} roughness={0.15} />
        </mesh>

        {/* Teeth */}
        {teeth}
      </mesh>
    </Float>
  );
}

function GeminiShape({ isMobile, color }: { isMobile: boolean; color: string }) {
  const groupRef = useRef<THREE.Group>(null);
  const star1Ref = useRef<THREE.Mesh>(null);
  const star2Ref = useRef<THREE.Mesh>(null);

  const starShape = useMemo(() => {
    const s = new THREE.Shape();
    s.moveTo(0, 0.95);
    s.quadraticCurveTo(0, 0, 0.95, 0);
    s.quadraticCurveTo(0, 0, 0, -0.95);
    s.quadraticCurveTo(0, 0, -0.95, 0);
    s.quadraticCurveTo(0, 0, 0, 0.95);
    s.closePath();
    return s;
  }, []);

  const extrudeSettings = useMemo(() => ({
    depth: 0.15,
    bevelEnabled: true,
    bevelSegments: 4,
    steps: 1,
    bevelSize: 0.04,
    bevelThickness: 0.04,
  }), []);

  useFrame((state) => {
    if (!groupRef.current) return;
    const time = state.clock.getElapsedTime();
    groupRef.current.rotation.y = time * 0.3;
    
    if (star1Ref.current) {
      star1Ref.current.rotation.z = Math.sin(time * 0.3) * 0.15;
    }
    if (star2Ref.current) {
      star2Ref.current.rotation.z = -time * 0.45;
      star2Ref.current.scale.setScalar(0.45 + Math.sin(time * 2.5) * 0.05);
    }
  });

  return (
    <Float floatIntensity={1.5} speed={3}>
      <group ref={groupRef}>
        {/* Outer Large Star */}
        <mesh ref={star1Ref} position={[0, 0, -0.075]}>
          <extrudeGeometry args={[starShape, extrudeSettings]} />
          <meshPhysicalMaterial
            color={color}
            emissive={color}
            emissiveIntensity={0.4}
            roughness={0.05}
            metalness={0.2}
            transmission={0.7}
            thickness={0.6}
            clearcoat={1}
            clearcoatRoughness={0}
          />
        </mesh>
        
        {/* Inner Small Glowing Star */}
        <mesh ref={star2Ref} position={[0, 0, 0.05]} rotation={[0, 0, Math.PI / 4]}>
          <extrudeGeometry args={[starShape, extrudeSettings]} />
          <meshPhysicalMaterial
            color="#ff69b4"
            emissive="#ff1493"
            emissiveIntensity={0.8}
            roughness={0.1}
            metalness={0.1}
            transmission={0.2}
            thickness={0.3}
          />
        </mesh>
      </group>
    </Float>
  );
}

function TechShape({ activeTech, isMobile, color }: { activeTech: string; isMobile: boolean; color: string }) {
  switch (activeTech) {
    case 'React':
      return <ReactShape isMobile={isMobile} color={color} />;
    case 'TypeScript':
      return <TypeScriptShape isMobile={isMobile} color={color} />;
    case 'Next.js':
      return <NextJsShape isMobile={isMobile} color={color} />;
    case 'Python':
      return <PythonShape isMobile={isMobile} color={color} />;
    case 'Svelte':
      return <SvelteShape isMobile={isMobile} color={color} />;
    case 'Vite':
      return <ViteShape isMobile={isMobile} color={color} />;
    case 'Docker':
      return <DockerShape isMobile={isMobile} color={color} />;
    case 'Redis':
      return <RedisShape isMobile={isMobile} color={color} />;
    case 'Node.js':
      return <NodeJsShape isMobile={isMobile} color={color} />;
    case 'Prisma':
      return <PrismaShape isMobile={isMobile} color={color} />;
    case 'Tailwind CSS':
      return <TailwindShape isMobile={isMobile} color={color} />;
    case 'Git':
      return <GitShape isMobile={isMobile} color={color} />;
    case 'Firebase':
      return <FirebaseShape isMobile={isMobile} color={color} />;
    case 'Supabase':
      return <SupabaseShape isMobile={isMobile} color={color} />;
    case 'Rust':
      return <RustShape isMobile={isMobile} color={color} />;
    case 'Gemini AI':
      return <GeminiShape isMobile={isMobile} color={color} />;
    default:
      return (
        <>
          <CoreShape isMobile={isMobile} />
          <InnerCore isMobile={isMobile} />
        </>
      );
  }
}

export default function Hero3D() {
  const groupRef = useRef<THREE.Group>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [activeTechIndex, setActiveTechIndex] = useState(0);
  const { theme } = useLayoutStore();

  const themeColor = useMemo(() => {
    if (theme === 'yellow') return '#fbbf24';
    if (theme === 'apple') return '#ffffff';
    return '#6366f1';
  }, [theme]);

  const techStack = useMemo(() => [
    { name: 'Interactive Core', color: themeColor, description: 'Faceted crystal & liquid energy core' },
    { name: 'React', color: '#61dafb', description: 'Frontend development & component architecture' },
    { name: 'TypeScript', color: '#3178c6', description: 'Type-safe systems & robust applications' },
    { name: 'Next.js', color: theme === 'light' ? '#111111' : '#ffffff', description: 'Server-side rendering & full-stack architecture' },
    { name: 'Python', color: '#3776ab', description: 'Machine learning, AI & backend data analytics' },
    { name: 'Svelte', color: '#ff3e00', description: 'Cybernetic reactive user interfaces & compilation' },
    { name: 'Vite', color: '#646cff', description: 'Lightning-fast frontend tooling & hot module replacement' },
    { name: 'Docker', color: '#2496ed', description: 'App containerization & seamless environment deployment' },
    { name: 'Redis', color: '#dc382d', description: 'In-memory caching, message brokerage & fast databases' },
    { name: 'Node.js', color: '#339933', description: 'Event-driven, asynchronous JavaScript runtime environment' },
    { name: 'Prisma', color: '#2d3748', description: 'Next-generation Node.js & TypeScript ORM for databases' },
    { name: 'Tailwind CSS', color: '#06b6d4', description: 'Utility-first CSS styling & fluid design systems' },
    { name: 'Git', color: '#f05032', description: 'Distributed version control & collaborative workflow' },
    { name: 'Firebase', color: '#ffca28', description: 'Serverless authentication, hosting & real-time databases' },
    { name: 'Supabase', color: '#3ecf8e', description: 'Open-source backend & real-time PostgreSQL database' },
    { name: 'Rust', color: '#dea584', description: 'High-performance systems programming & memory safety' },
    { name: 'Gemini AI', color: '#1a73e8', description: 'Advanced generative AI, LLMs & cognitive computing' }
  ], [themeColor, theme]);

  const prevTech = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveTechIndex((prev) => (prev - 1 + techStack.length) % techStack.length);
  };

  const nextTech = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveTechIndex((prev) => (prev + 1) % techStack.length);
  };

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Pause rendering when canvas is off-screen to save GPU
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    let current = 0;
    let target = 0;
    let rafId: number;

    const onScroll = () => {
      const rect = el.getBoundingClientRect();
      const winH = window.innerHeight;
      const total = rect.height + winH;
      target = Math.max(0, Math.min(1, (winH - rect.top) / total));
    };

    const tick = () => {
      current += (target - current) * 0.08;
      if (Math.abs(current - target) < 0.001) current = target;
      if (groupRef.current) {
        groupRef.current.rotation.y = current * Math.PI * 1.5;
        groupRef.current.rotation.x = current * Math.PI / 6;
        const s = isMobile ? 0.6 - current * 0.2 : 0.85 - current * 0.3;
        groupRef.current.scale.set(s, s, s);
      }
      rafId = requestAnimationFrame(tick);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    rafId = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(rafId);
    };
  }, [isMobile]);

  return (
    <div ref={containerRef} className="w-full h-[360px] sm:h-[420px] md:h-[520px] relative pointer-events-auto interactive-element cursor-grab active:cursor-grabbing">
      <Canvas
        camera={{ position: [0, 0, isMobile ? 7 : 5], fov: isMobile ? 55 : 45 }}
        className="w-full h-full !absolute inset-0 focus:outline-none"
        dpr={isMobile ? 1 : [1, 1.5]}
        frameloop={isVisible ? 'always' : 'never'}
        gl={{ 
          antialias: !isMobile, 
          powerPreference: "high-performance",
          alpha: true 
        }}
      >
        <ambientLight intensity={theme === 'apple' ? 0.8 : 0.5} />
        <directionalLight position={[10, 10, 10]} intensity={theme === 'apple' ? 3 : 2} />
        <pointLight 
          position={[-10, -10, -10]} 
          intensity={1} 
          color={techStack[activeTechIndex].color} 
        />
        <pointLight 
          position={[0, 0, 0]} 
          intensity={2} 
          color={techStack[activeTechIndex].color} 
        />
        
        <Environment preset="city" />

        <group ref={groupRef} position={[0, 0, 0]} scale={isMobile ? 0.6 : 0.85}>
          <ParticleSwarm isMobile={isMobile} activeColor={techStack[activeTechIndex].color} />
          <OrbitRings isMobile={isMobile} activeColor={techStack[activeTechIndex].color} />
          <TechShape 
            activeTech={techStack[activeTechIndex].name} 
            isMobile={isMobile} 
            color={techStack[activeTechIndex].color} 
          />
        </group>

        <OrbitControls 
          enableZoom={false} 
          enablePan={false}
          maxPolarAngle={Math.PI / 2 + 0.4}
          minPolarAngle={Math.PI / 2 - 0.4}
        />
      </Canvas>

      {/* Modern Floating Tech Switcher Dashboard */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-1.5 w-full max-w-[320px] px-4 pointer-events-auto">
        <div className="flex items-center justify-between w-full p-1 rounded-full bg-white/40 dark:bg-neutral-900/40 backdrop-blur-md border border-neutral-200/50 dark:border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.06)]">
          <button 
            onClick={prevTech} 
            className="flex items-center justify-center w-7 h-7 rounded-full text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200/50 dark:hover:bg-white/5 active:scale-95 transition-all"
            aria-label="Previous technology"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          <div className="flex items-center gap-2 select-none px-2">
            <span 
              className="w-2 h-2 rounded-full transition-colors duration-500 shadow-sm bg-[var(--tech-color)] [box-shadow:0_0_8px_var(--tech-color)]"
              style={{ '--tech-color': techStack[activeTechIndex].color } as React.CSSProperties}
            />
            <span className="text-xs font-extrabold text-neutral-800 dark:text-neutral-100 tracking-wider">
              {techStack[activeTechIndex].name}
            </span>
          </div>

          <button 
            onClick={nextTech} 
            className="flex items-center justify-center w-7 h-7 rounded-full text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200/50 dark:hover:bg-white/5 active:scale-95 transition-all"
            aria-label="Next technology"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
        
        <p className="text-[10px] text-neutral-500 dark:text-neutral-400 text-center font-medium select-none min-h-[14px]">
          {techStack[activeTechIndex].description}
        </p>
      </div>
    </div>
  );
}
