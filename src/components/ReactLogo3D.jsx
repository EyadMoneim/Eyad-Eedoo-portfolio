import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, Environment, OrbitControls, Float } from '@react-three/drei';
import * as THREE from 'three';

function Model({ url, color = '#8b67c3' }) {
  const { scene } = useGLTF(url);
  const modelRef = useRef();

  const clonedScene = useMemo(() => {
    const clone = scene.clone();
    clone.traverse((child) => {
      if (child.isMesh && child.material) {
        child.material = child.material.clone();
        child.material.color = new THREE.Color(color);
        if (child.material.emissive) {
          child.material.emissive = new THREE.Color(color).multiplyScalar(0.15);
        }
      }
    });
    return clone;
  }, [scene, color]);

  useFrame((state, delta) => {
    if (modelRef.current) {
      // Base rotation + Fast initial spin that decays over time
      const t = state.clock.elapsedTime;
      modelRef.current.rotation.y = (t * 0.5) + (1 - Math.exp(-t * 3.5)) * 8;
      
      if (modelRef.current.scale.x < 0.799) {
        modelRef.current.scale.lerp(new THREE.Vector3(0.8, 0.8, 0.8), delta * 6);
      }
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
      <primitive ref={modelRef} object={clonedScene} scale={0} position={[0, 0, 0]} />
    </Float>
  );
}

import DeveloperElements from './DeveloperElements';

export default function ReactLogo3D({ color = '#8b67c3' }) {
  return (
    <div style={{ width: '100%', height: '100%', minHeight: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Canvas camera={{ position: [0, 0, 8.5], fov: 45 }}>
        <ambientLight intensity={0.7} />
        <directionalLight position={[10, 10, 10]} intensity={1.2} />
        <Model url="/react_logo.glb" color={color} />
        <DeveloperElements />
        <Environment preset="city" />
        <OrbitControls enableZoom={false} enablePan={false} />
      </Canvas>
    </div>
  );
}

useGLTF.preload('/react_logo.glb');

