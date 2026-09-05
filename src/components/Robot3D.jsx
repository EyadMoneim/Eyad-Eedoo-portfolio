import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, Float, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';

const RobotHead = () => {
  const headRef = useRef();
  
  useFrame((state) => {
    // Get mouse coordinates from -1 to 1
    const { pointer } = state;
    
    // Target rotation based on mouse position
    const targetX = (pointer.y * Math.PI) / 4; // Up/down rotation
    const targetY = (pointer.x * Math.PI) / 3; // Left/right rotation
    
    // Smoothly interpolate current rotation to target rotation
    if (headRef.current) {
      headRef.current.rotation.x = THREE.MathUtils.lerp(headRef.current.rotation.x, -targetX, 0.1);
      headRef.current.rotation.y = THREE.MathUtils.lerp(headRef.current.rotation.y, targetY, 0.1);
    }
  });

  return (
    <group ref={headRef}>
      {/* Helmet / Main Head */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[1.5, 1.5, 1.5]} />
        <meshStandardMaterial 
          color="#111111" 
          roughness={0.2} 
          metalness={0.8} 
        />
      </mesh>
      
      {/* Visor (Face) */}
      <mesh position={[0, 0.2, 0.76]}>
        <boxGeometry args={[1.6, 0.6, 0.1]} />
        <meshPhysicalMaterial 
          color="#000000" 
          transmission={1} 
          opacity={1} 
          metalness={0} 
          roughness={0} 
          ior={1.5} 
          thickness={0.5} 
        />
      </mesh>
      
      {/* Glowing Eyes inside Visor */}
      <mesh position={[-0.3, 0.2, 0.8]} >
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>
      <mesh position={[0.3, 0.2, 0.8]} >
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>
    </group>
  );
};

const RobotBody = () => {
  return (
    <group position={[0, -2.2, 0]}>
      {/* Neck */}
      <mesh position={[0, 1.2, 0]}>
        <cylinderGeometry args={[0.4, 0.4, 0.8, 32]} />
        <meshStandardMaterial color="#222" roughness={0.5} metalness={0.8} />
      </mesh>
      
      {/* Torso */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[2.5, 2, 1.2]} />
        <meshStandardMaterial color="#111111" roughness={0.3} metalness={0.7} />
      </mesh>
      
      {/* Shoulders */}
      <mesh position={[-1.5, 0.5, 0]} castShadow>
        <sphereGeometry args={[0.6, 32, 32]} />
        <meshStandardMaterial color="#222" roughness={0.4} metalness={0.6} />
      </mesh>
      <mesh position={[1.5, 0.5, 0]} castShadow>
        <sphereGeometry args={[0.6, 32, 32]} />
        <meshStandardMaterial color="#222" roughness={0.4} metalness={0.6} />
      </mesh>
      
      {/* Arms (Upper) */}
      <mesh position={[-1.8, -0.5, 0]} rotation={[0, 0, -0.2]} castShadow>
        <cylinderGeometry args={[0.3, 0.3, 1.5, 32]} />
        <meshStandardMaterial color="#111" roughness={0.3} metalness={0.7} />
      </mesh>
      <mesh position={[1.8, -0.5, 0]} rotation={[0, 0, 0.2]} castShadow>
        <cylinderGeometry args={[0.3, 0.3, 1.5, 32]} />
        <meshStandardMaterial color="#111" roughness={0.3} metalness={0.7} />
      </mesh>
    </group>
  );
};

const Robot = () => {
  return (
    <group position={[0, 0, 0]}>
      <Float speed={2} rotationIntensity={0.1} floatIntensity={0.5}>
        <RobotHead />
        <RobotBody />
      </Float>
    </group>
  );
};

export default function RobotHero() {
  return (
    <div className="w-full h-screen relative overflow-hidden flex items-center justify-center">
      {/* Background Text */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-0">
        <h1 
          className="text-[25vw] font-black text-white"
          style={{ 
            lineHeight: 1,
            letterSpacing: '-0.02em',
          }}
        >
          EEDOO
        </h1>
      </div>
      
      {/* 3D Canvas */}
      <div className="absolute inset-0 z-10">
        <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>
          <ambientLight intensity={0.5} />
          <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
          <pointLight position={[-10, -10, -10]} intensity={0.5} />
          
          <Robot />
          
          <ContactShadows position={[0, -3.5, 0]} opacity={0.4} scale={10} blur={2} far={4} />
          <Environment preset="city" />
        </Canvas>
      </div>
      
      {/* Overlay Instruction */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 pointer-events-none">
        <div className="px-6 py-2 rounded-full bg-black/40 backdrop-blur-md text-white/80 text-sm font-medium tracking-wide">
          Move cursor to interact
        </div>
      </div>
    </div>
  );
}
