import React, { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * Lazy-loaded WebGL background for the Hero section: a wireframe
 * icosahedron with an inner solid core plus an orbiting particle
 * shell, all gently steering toward the cursor. Monochrome so it
 * works with both the light and dark theme.
 */

const Particles = ({ color, count }) => {
  const ref = useRef();

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r = 2.4 + Math.random() * 2.2;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      arr[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      arr[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      arr[i * 3 + 2] = r * Math.cos(phi);
    }
    return arr;
  }, [count]);

  useFrame((_, delta) => {
    if (!ref.current) return;
    ref.current.rotation.y += delta * 0.04;
    ref.current.rotation.x += delta * 0.01;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.025}
        color={color}
        transparent
        opacity={0.45}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
};

const CoreShape = ({ wireColor, coreColor }) => {
  const outer = useRef();
  const inner = useRef();

  useFrame((_, delta) => {
    if (outer.current) {
      outer.current.rotation.x += delta * 0.1;
      outer.current.rotation.y += delta * 0.16;
    }
    if (inner.current) {
      inner.current.rotation.x -= delta * 0.14;
      inner.current.rotation.y -= delta * 0.1;
    }
  });

  return (
    <group>
      <mesh ref={outer}>
        <icosahedronGeometry args={[1.7, 1]} />
        <meshBasicMaterial color={wireColor} wireframe transparent opacity={0.35} />
      </mesh>
      <mesh ref={inner}>
        <icosahedronGeometry args={[0.95, 0]} />
        <meshStandardMaterial
          color={coreColor}
          flatShading
          transparent
          opacity={0.22}
          roughness={0.4}
          metalness={0.6}
        />
      </mesh>
    </group>
  );
};

// Steers the whole scene toward the cursor with a soft lag.
const MouseRig = ({ children }) => {
  const ref = useRef();
  const pointer = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const onMove = (e) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  useFrame(() => {
    if (!ref.current) return;
    ref.current.rotation.x = THREE.MathUtils.lerp(
      ref.current.rotation.x, pointer.current.y * 0.3, 0.04
    );
    ref.current.rotation.y = THREE.MathUtils.lerp(
      ref.current.rotation.y, pointer.current.x * 0.45, 0.04
    );
    ref.current.position.x = THREE.MathUtils.lerp(
      ref.current.position.x, pointer.current.x * 0.3, 0.04
    );
  });

  return <group ref={ref}>{children}</group>;
};

const Hero3D = ({ isDark }) => {
  const wireColor = isDark ? '#e8e8e8' : '#1a1a1a';
  const coreColor = isDark ? '#ffffff' : '#333333';
  const particleColor = isDark ? '#bbbbbb' : '#444444';
  // Fewer particles on small screens to keep mobile smooth
  const count = useMemo(
    () => (typeof window !== 'undefined' && window.innerWidth < 768 ? 350 : 900),
    []
  );

  return (
    <Canvas
      dpr={[1, 1.75]}
      camera={{ position: [0, 0, 6], fov: 45 }}
      gl={{ antialias: true, alpha: true, powerPreference: 'low-power' }}
      style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}
      aria-hidden="true"
    >
      <ambientLight intensity={0.7} />
      <directionalLight position={[4, 6, 5]} intensity={0.8} />
      <MouseRig>
        <CoreShape wireColor={wireColor} coreColor={coreColor} />
        <Particles color={particleColor} count={count} />
      </MouseRig>
    </Canvas>
  );
};

export default Hero3D;
