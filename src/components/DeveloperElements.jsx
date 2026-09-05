import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, Text3D, Center, Box, Cylinder, Sphere } from '@react-three/drei';
import * as THREE from 'three';

const material = new THREE.MeshStandardMaterial({
  color: new THREE.Color('#8b67c3'),
  emissive: new THREE.Color('#8b67c3').multiplyScalar(0.15),
  roughness: 0.3,
  metalness: 0.6,
});

const FONT_URL = '/fonts/helvetiker_regular.typeface.json';

function AnimatedEntrance({ children, delay = 0 }) {
  const groupRef = useRef();

  useFrame((state, delta) => {
    if (groupRef.current) {
      if (state.clock.elapsedTime > delay) {
        groupRef.current.scale.lerp(new THREE.Vector3(1, 1, 1), delta * 8);
      } else {
        groupRef.current.scale.set(0, 0, 0);
      }
    }
  });

  return (
    <group ref={groupRef} scale={0}>
      {children}
    </group>
  );
}

function FloatingText({ text, position, rotation, scale = 1, floatSpeed = 2 }) {
  return (
    <Float speed={floatSpeed} rotationIntensity={1} floatIntensity={2} position={position}>
      <Center>
        <Text3D font={FONT_URL} size={0.4 * scale} height={0.1 * scale} curveSegments={12} material={material} rotation={rotation}>
          {text}
        </Text3D>
      </Center>
    </Float>
  );
}

function FloatingCube({ text, position, rotation, scale = 1 }) {
  return (
    <Float speed={2.5} rotationIntensity={1.5} floatIntensity={2} position={position}>
      <group rotation={rotation} scale={scale}>
        <Box args={[1, 1, 1]} material={material} />
        {text && (
          <Center position={[0, 0, 0.51]}>
            <Text3D font={FONT_URL} size={0.25} height={0.02} material={new THREE.MeshBasicMaterial({ color: '#ffffff' })}>
              {text}
            </Text3D>
          </Center>
        )}
      </group>
    </Float>
  );
}

function FloatingDatabase({ position, rotation, scale = 1 }) {
  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={1.5} position={position}>
      <group rotation={rotation} scale={scale}>
        <Cylinder args={[0.5, 0.5, 1.2, 32]} material={material} />
        <Cylinder args={[0.55, 0.55, 0.1, 32]} position={[0, 0.6, 0]} material={material} />
        <Cylinder args={[0.55, 0.55, 0.1, 32]} position={[0, 0, 0]} material={material} />
        <Cylinder args={[0.55, 0.55, 0.1, 32]} position={[0, -0.6, 0]} material={material} />
      </group>
    </Float>
  );
}

function FloatingGitBranch({ position, rotation, scale = 1 }) {
  return (
    <Float speed={3} rotationIntensity={1.2} floatIntensity={2} position={position}>
      <group rotation={rotation} scale={scale}>
        <Cylinder args={[0.1, 0.1, 1.5]} material={material} />
        <Sphere args={[0.2]} position={[0, 0.75, 0]} material={material} />
        <Sphere args={[0.2]} position={[0, -0.75, 0]} material={material} />
        
        <group position={[0.3, 0, 0]} rotation={[0, 0, -Math.PI / 4]}>
          <Cylinder args={[0.1, 0.1, 0.8]} material={material} position={[0, 0.4, 0]} />
          <Sphere args={[0.2]} position={[0, 0.8, 0]} material={material} />
        </group>
      </group>
    </Float>
  );
}

function FloatingAPINodes({ position, rotation, scale = 1 }) {
  return (
    <Float speed={2.2} rotationIntensity={2} floatIntensity={1.8} position={position}>
      <group rotation={rotation} scale={scale}>
        <Sphere args={[0.15]} position={[0, 0, 0]} material={material} />
        <Sphere args={[0.15]} position={[0.6, 0.5, 0]} material={material} />
        <Sphere args={[0.15]} position={[-0.5, 0.6, 0]} material={material} />
        
        <Cylinder args={[0.03, 0.03, 0.8]} position={[0.3, 0.25, 0]} rotation={[0, 0, -Math.PI/4]} material={material} />
        <Cylinder args={[0.03, 0.03, 0.8]} position={[-0.25, 0.3, 0]} rotation={[0, 0, Math.PI/4]} material={material} />
      </group>
    </Float>
  );
}

export default function DeveloperElements() {
  return (
    <group>
      {/* Top Left: { } */}
      <AnimatedEntrance delay={0.4}>
        <FloatingText text="{ }" position={[-2.4, 2.2, -1]} rotation={[0.2, 0.4, -0.1]} scale={1.2} />
      </AnimatedEntrance>
      
      {/* Top Right: </> */}
      <AnimatedEntrance delay={0.5}>
        <FloatingText text="</>" position={[2.4, 2.2, -1]} rotation={[0.1, -0.3, 0.2]} scale={1.2} />
      </AnimatedEntrance>

      {/* Center Left: < */}
      <AnimatedEntrance delay={0.6}>
        <FloatingText text="<" position={[-2.8, 0.3, 0]} rotation={[0, 0.5, 0]} scale={1.6} />
      </AnimatedEntrance>

      {/* Center Right: > */}
      <AnimatedEntrance delay={0.7}>
        <FloatingText text=">" position={[2.8, 0.3, 0]} rotation={[0, -0.5, 0]} scale={1.6} />
      </AnimatedEntrance>

      {/* Bottom Left: npm cube */}
      <AnimatedEntrance delay={0.8}>
        <FloatingCube text="npm" position={[-2.4, -2.2, -0.5]} rotation={[0.4, 0.6, 0.2]} scale={0.7} />
      </AnimatedEntrance>

      {/* Bottom Right: >_ */}
      <AnimatedEntrance delay={0.9}>
        <FloatingText text=">_" position={[2.4, -2.2, 0]} rotation={[-0.2, -0.4, -0.1]} scale={1} />
      </AnimatedEntrance>

      {/* Extra floating items around */}
      <AnimatedEntrance delay={1.0}>
        <FloatingDatabase position={[-1.2, -2.6, -2]} rotation={[0.2, 0, 0.2]} scale={0.6} />
      </AnimatedEntrance>

      <AnimatedEntrance delay={1.1}>
        <FloatingGitBranch position={[1.4, -2.6, -1]} rotation={[0.1, 0.3, 0]} scale={0.5} />
      </AnimatedEntrance>

      <AnimatedEntrance delay={1.2}>
        <FloatingAPINodes position={[1.5, 2.8, -2]} rotation={[0, 0, 0]} scale={1} />
      </AnimatedEntrance>
      
      {/* Small cubes */}
      <AnimatedEntrance delay={1.3}>
        <FloatingCube text="JS" position={[-1, -2.2, 1]} rotation={[0.1, 0.8, 0.3]} scale={0.4} />
      </AnimatedEntrance>

      <AnimatedEntrance delay={1.4}>
        <FloatingCube text="TS" position={[1.2, -1.8, 1.5]} rotation={[0.5, 0.2, 0.1]} scale={0.35} />
      </AnimatedEntrance>

      <AnimatedEntrance delay={1.5}>
        <FloatingCube text="const" position={[-2.8, 1.2, 1]} rotation={[0.3, -0.4, 0.5]} scale={0.5} />
      </AnimatedEntrance>

      <AnimatedEntrance delay={1.6}>
        <FloatingCube text="import" position={[2.8, 1.2, -0.5]} rotation={[0.7, 0.1, -0.2]} scale={0.5} />
      </AnimatedEntrance>
    </group>
  );
}
