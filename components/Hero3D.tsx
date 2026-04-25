import { useRef, useState, useMemo, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial, OrbitControls, Points, PointMaterial, Environment, Sphere } from '@react-three/drei';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

function ParticleSwarm(props: any) {
  const ref = useRef<THREE.Points>(null);
  
  // Generate a spherical distribution of points manually
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
      ref.current.rotation.x -= delta / 10;
      ref.current.rotation.y -= delta / 15;
      
      // Interpolate against pointer position
      const targetX = (state.pointer.x * Math.PI) / 4;
      const targetY = (state.pointer.y * Math.PI) / 4;
      
      ref.current.rotation.y += 0.02 * (targetX - ref.current.rotation.y);
      ref.current.rotation.x += 0.02 * (targetY - ref.current.rotation.x);
    }
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={spherePositions} stride={3} frustumCulled={false} {...props}>
        <PointMaterial
          transparent
          color="#8b5cf6" 
          size={0.025}
          sizeAttenuation={true}
          depthWrite={false}
          opacity={0.7}
          blending={THREE.AdditiveBlending}
        />
      </Points>
    </group>
  );
}

function CoreShape() {
  const coreRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (!coreRef.current) return;
    const time = state.clock.getElapsedTime();
    coreRef.current.position.y = Math.sin(time * 2) * 0.05;
    coreRef.current.rotation.y += 0.01;
    coreRef.current.rotation.x += 0.005;
  });

  return (
    <Float floatIntensity={1.5} speed={3}>
      <mesh ref={coreRef}>
        <icosahedronGeometry args={[1.2, 0]} />
        <meshPhysicalMaterial 
          color="#3b82f6" 
          wireframe={true} 
          emissive="#1d4ed8"
          emissiveIntensity={1}
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
  
  const colors = useMemo(() => {
    return {
      default: new THREE.Color('#ec4899'), // pink-500
      hover: new THREE.Color('#f43f5e')    // rose-500
    }
  }, []);

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
      x: isMobile ? 0.4 : 0.6,
      y: isMobile ? 0.4 : 0.6,
      z: isMobile ? 0.4 : 0.6,
      ease: 'none'
    }, 0);

    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, [isMobile]);

  return (
    <div ref={containerRef} className="w-full h-[300px] sm:h-[350px] md:h-[450px] lg:h-[500px] relative pointer-events-auto interactive-element cursor-grab active:cursor-grabbing">
      <Canvas
        camera={{ position: [0, 0, isMobile ? 6 : 5], fov: isMobile ? 50 : 45 }}
        className="w-full h-full !absolute inset-0 focus:outline-none"
        dpr={[1, 2]}
      >
        <ambientLight intensity={0.2} />
        <directionalLight position={[10, 10, 10]} intensity={2} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} />
        <pointLight position={[0, 0, 0]} intensity={2} color="#ec4899" />
        
        <Environment preset="city" />

        <group ref={groupRef} position={[0, 0, 0]} scale={isMobile ? 0.8 : 1}>
          <ParticleSwarm />
          <CoreShape />
          <InnerCore />
        </group>

        <OrbitControls 
          enableZoom={false} 
          enablePan={false}
          maxPolarAngle={Math.PI / 2 + 0.3}
          minPolarAngle={Math.PI / 2 - 0.3}
          autoRotate={false}
        />
      </Canvas>
    </div>
  );
}
