import { useRef, useState, useMemo, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial, OrbitControls, Points, PointMaterial, Environment, Sphere, Torus } from '@react-three/drei';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import { useLayoutStore } from '@/lib/store';

gsap.registerPlugin(ScrollTrigger);

function ParticleSwarm() {
  const ref = useRef<THREE.Points>(null);
  const { theme } = useLayoutStore();
  
  const particleColor = useMemo(() => {
    if (theme === 'yellow') return '#d97706';
    if (theme === 'light') return '#3b82f6';
    return '#8b5cf6';
  }, [theme]);

  const sphereCount = 2000;
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
  }, []);

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
          color={particleColor} 
          size={0.03}
          sizeAttenuation={true}
          depthWrite={false}
          opacity={0.6}
          blending={THREE.AdditiveBlending}
        />
      </Points>
    </group>
  );
}

function OrbitRings() {
  const ring1Ref = useRef<THREE.Mesh>(null);
  const ring2Ref = useRef<THREE.Mesh>(null);
  const { theme } = useLayoutStore();

  const ringColor = useMemo(() => {
    if (theme === 'yellow') return '#fbbf24';
    return '#6366f1';
  }, [theme]);

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
      <Torus ref={ring1Ref} args={[1.5, 0.01, 16, 100]}>
        <meshBasicMaterial color={ringColor} transparent opacity={0.3} />
      </Torus>
      <Torus ref={ring2Ref} args={[1.8, 0.005, 16, 100]}>
        <meshBasicMaterial color={ringColor} transparent opacity={0.2} />
      </Torus>
    </group>
  );
}

function CoreShape() {
  const coreRef = useRef<THREE.Mesh>(null);
  const { theme } = useLayoutStore();

  const coreColor = useMemo(() => {
    if (theme === 'yellow') return '#d97706';
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
    <Float floatIntensity={1.5} speed={3}>
      <mesh ref={coreRef}>
        <icosahedronGeometry args={[1.2, 0]} />
        <meshPhysicalMaterial 
          color={coreColor} 
          wireframe={true} 
          emissive={coreColor}
          emissiveIntensity={0.5}
          roughness={0}
          transmission={1}
          thickness={0.5}
        />
      </mesh>
    </Float>
  );
}

function InnerCore() {
  const [hovered, setHover] = useState(false);
  const { theme } = useLayoutStore();
  
  const colors = useMemo(() => {
    if (theme === 'yellow') return { default: new THREE.Color('#fbbf24'), hover: new THREE.Color('#f59e0b') };
    return {
      default: new THREE.Color('#ec4899'),
      hover: new THREE.Color('#f43f5e')
    }
  }, [theme]);

  return (
    <Sphere 
      args={[0.6, 64, 64]} 
      onPointerOver={() => setHover(true)}
      onPointerOut={() => setHover(false)}
    >
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
    </Sphere>
  );
}

export default function Hero3D() {
  const groupRef = useRef<THREE.Group>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);
  const { theme } = useLayoutStore();

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (!groupRef.current) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top center',
        end: 'bottom top',
        scrub: 1,
      }
    });

    tl.to(groupRef.current.rotation, {
      y: Math.PI * 1.5,
      x: Math.PI / 6,
      ease: 'none'
    })
    .to(groupRef.current.scale, {
      x: isMobile ? 0.5 : 0.7,
      y: isMobile ? 0.5 : 0.7,
      z: isMobile ? 0.5 : 0.7,
      ease: 'none'
    }, 0);

    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, [isMobile]);

  return (
    <div ref={containerRef} className="w-full h-[350px] sm:h-[400px] md:h-[500px] relative pointer-events-auto interactive-element cursor-grab active:cursor-grabbing">
      <Canvas
        camera={{ position: [0, 0, isMobile ? 7 : 5], fov: isMobile ? 55 : 45 }}
        className="w-full h-full !absolute inset-0 focus:outline-none"
        dpr={[1, 2]}
      >
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 10]} intensity={2} />
        <pointLight position={[-10, -10, -10]} intensity={1} color={theme === 'yellow' ? '#fbbf24' : '#8b5cf6'} />
        <pointLight position={[0, 0, 0]} intensity={2} color={theme === 'yellow' ? '#f59e0b' : '#ec4899'} />
        
        <Environment preset="city" />

        <group ref={groupRef} position={[0, 0, 0]} scale={isMobile ? 0.8 : 1}>
          <ParticleSwarm />
          <OrbitRings />
          <CoreShape />
          <InnerCore />
        </group>

        <OrbitControls 
          enableZoom={false} 
          enablePan={false}
          maxPolarAngle={Math.PI / 2 + 0.4}
          minPolarAngle={Math.PI / 2 - 0.4}
        />
      </Canvas>
    </div>
  );
}
