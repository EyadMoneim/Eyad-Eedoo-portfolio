import { useMemo, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Environment, Float, ContactShadows, RoundedBox, Text } from '@react-three/drei';
import * as THREE from 'three';

/* ================================================
   COLOR PALETTE  (Step 2)
   ================================================ */
const ROBOT_COLORS = {
  voidBlack:   '#07070B',
  panelBlack:  '#0B0A10',
  armBlack:    '#1A1726',
  deepPurple:  '#14111E',
  armorPurple: '#29203A',
  eedooPurple: '#8D76C9',
  rimPurple:   '#B19AE8',
  jointPurple: '#59447F',
  glowLime:    '#D5E86B',
  softWhite:   '#F4F4ED',
};

/* ================================================
   REUSABLE MATERIALS  (Step 2)
   ================================================ */
function useRobotMaterials() {
  return useMemo(() => ({
    outerArmor: {
      color: ROBOT_COLORS.deepPurple,
      metalness: 0.65,
      roughness: 0.28,
      clearcoat: 0.55,
      clearcoatRoughness: 0.22,
    },
    innerBlack: {
      color: ROBOT_COLORS.voidBlack,
      metalness: 0.75,
      roughness: 0.42,
    },
    armBlack: {
      color: ROBOT_COLORS.armBlack,
      metalness: 0.65,
      roughness: 0.45,
    },
    purpleArmor: {
      color: ROBOT_COLORS.jointPurple,
      metalness: 0.42,
      roughness: 0.26,
      clearcoat: 0.45,
      clearcoatRoughness: 0.2,
    },
    darkArmor: {
      color: ROBOT_COLORS.armorPurple,
      metalness: 0.6,
      roughness: 0.3,
      clearcoat: 0.4,
      clearcoatRoughness: 0.2,
    },
    glass: {
      color: '#020207',
      metalness: 0,
      roughness: 0.08,
      clearcoat: 1,
      clearcoatRoughness: 0.05,
      reflectivity: 0.8,
    },
    glow: {
      color: ROBOT_COLORS.glowLime,
      emissive: ROBOT_COLORS.glowLime,
      emissiveIntensity: 1.8,
    },
    lavenderGlow: {
      color: ROBOT_COLORS.rimPurple,
      emissive: ROBOT_COLORS.eedooPurple,
      emissiveIntensity: 1.0,
    },
    deepPurpleMat: {
      color: ROBOT_COLORS.deepPurple,
      metalness: 0.7,
      roughness: 0.3,
    },
    panelBlackMat: {
      color: ROBOT_COLORS.panelBlack,
      metalness: 0.8,
      roughness: 0.35,
    },
  }), []);
}

/* ================================================
   DETAIL HELPERS  (Step 10)
   ================================================ */
const Bolt = ({ position, rotation = [Math.PI / 2, 0, 0] }) => (
  <mesh position={position} rotation={rotation}>
    <cylinderGeometry args={[0.035, 0.035, 0.018, 16]} />
    <meshStandardMaterial color={ROBOT_COLORS.armorPurple} metalness={0.8} roughness={0.3} />
  </mesh>
);

const PanelSeam = ({ position, args = [0.6, 0.015, 0.012], rotation = [0, 0, 0] }) => (
  <mesh position={position} rotation={rotation}>
    <boxGeometry args={args} />
    <meshStandardMaterial color={ROBOT_COLORS.armorPurple} metalness={0.5} roughness={0.5} opacity={0.6} transparent />
  </mesh>
);

/* ================================================
   ROBOT EYES  (Step 4 + Expressions)
   ================================================ */
const RobotEyes = ({ eyesRef, expression = 'default' }) => {
  const mats = useRobotMaterials();

  let content = null;
  switch (expression) {
    case 'happy':
      content = (
        <>
          <mesh position={[-0.25, 0, 0]} rotation={[0, 0, 0]}>
            <torusGeometry args={[0.08, 0.025, 16, 32, Math.PI]} />
            <meshStandardMaterial {...mats.glow} />
          </mesh>
          <mesh position={[0.25, 0, 0]} rotation={[0, 0, 0]}>
            <torusGeometry args={[0.08, 0.025, 16, 32, Math.PI]} />
            <meshStandardMaterial {...mats.glow} />
          </mesh>
        </>
      );
      break;
    case 'focused':
      content = (
        <>
          <mesh position={[-0.25, 0, 0]}>
            <boxGeometry args={[0.22, 0.04, 0.02]} />
            <meshStandardMaterial {...mats.glow} />
          </mesh>
          <mesh position={[0.25, 0, 0]}>
            <boxGeometry args={[0.22, 0.04, 0.02]} />
            <meshStandardMaterial {...mats.glow} />
          </mesh>
        </>
      );
      break;
    case 'sleepy':
      content = (
        <>
          <mesh position={[-0.25, -0.05, 0]}>
            <boxGeometry args={[0.18, 0.04, 0.02]} />
            <meshStandardMaterial {...mats.glow} />
          </mesh>
          <mesh position={[0.25, -0.05, 0]}>
            <boxGeometry args={[0.18, 0.04, 0.02]} />
            <meshStandardMaterial {...mats.glow} />
          </mesh>
        </>
      );
      break;
    case 'surprised':
      content = (
        <>
          <mesh position={[-0.25, 0, 0]}>
            <boxGeometry args={[0.12, 0.12, 0.02]} />
            <meshStandardMaterial {...mats.glow} />
          </mesh>
          <mesh position={[0.25, 0, 0]}>
            <boxGeometry args={[0.12, 0.12, 0.02]} />
            <meshStandardMaterial {...mats.glow} />
          </mesh>
        </>
      );
      break;
    case 'error':
      content = (
        <>
          <group position={[-0.25, 0, 0]}>
            <mesh rotation={[0, 0, Math.PI/4]}>
              <boxGeometry args={[0.18, 0.04, 0.02]} />
              <meshStandardMaterial {...mats.glow} />
            </mesh>
            <mesh rotation={[0, 0, -Math.PI/4]}>
              <boxGeometry args={[0.18, 0.04, 0.02]} />
              <meshStandardMaterial {...mats.glow} />
            </mesh>
          </group>
          <group position={[0.25, 0, 0]}>
            <mesh rotation={[0, 0, Math.PI/4]}>
              <boxGeometry args={[0.18, 0.04, 0.02]} />
              <meshStandardMaterial {...mats.glow} />
            </mesh>
            <mesh rotation={[0, 0, -Math.PI/4]}>
              <boxGeometry args={[0.18, 0.04, 0.02]} />
              <meshStandardMaterial {...mats.glow} />
            </mesh>
          </group>
        </>
      );
      break;
    case 'processing':
      content = (
        <>
          <mesh position={[-0.22, 0, 0]}>
            <boxGeometry args={[0.06, 0.06, 0.02]} />
            <meshStandardMaterial {...mats.glow} />
          </mesh>
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[0.06, 0.06, 0.02]} />
            <meshStandardMaterial {...mats.glow} />
          </mesh>
          <mesh position={[0.22, 0, 0]}>
            <boxGeometry args={[0.06, 0.06, 0.02]} />
            <meshStandardMaterial {...mats.glow} />
          </mesh>
        </>
      );
      break;
    case 'wink':
      content = (
        <>
          <mesh position={[-0.25, 0, 0]} rotation={[0, 0, 0]}>
            <torusGeometry args={[0.08, 0.025, 16, 32, Math.PI]} />
            <meshStandardMaterial {...mats.glow} />
          </mesh>
          <mesh position={[0.25, 0, 0]}>
            <boxGeometry args={[0.2, 0.04, 0.02]} />
            <meshStandardMaterial {...mats.glow} />
          </mesh>
        </>
      );
      break;
    case 'playful':
      content = (
        <>
          <group position={[-0.25, 0, 0]}>
            <mesh position={[0, 0.05, 0]} rotation={[0, 0, -Math.PI/5]}>
              <boxGeometry args={[0.16, 0.035, 0.02]} />
              <meshStandardMaterial {...mats.glow} />
            </mesh>
            <mesh position={[0, -0.05, 0]} rotation={[0, 0, Math.PI/5]}>
              <boxGeometry args={[0.16, 0.035, 0.02]} />
              <meshStandardMaterial {...mats.glow} />
            </mesh>
          </group>
          <group position={[0.25, 0, 0]}>
            <mesh position={[0, 0.05, 0]} rotation={[0, 0, Math.PI/5]}>
              <boxGeometry args={[0.16, 0.035, 0.02]} />
              <meshStandardMaterial {...mats.glow} />
            </mesh>
            <mesh position={[0, -0.05, 0]} rotation={[0, 0, -Math.PI/5]}>
              <boxGeometry args={[0.16, 0.035, 0.02]} />
              <meshStandardMaterial {...mats.glow} />
            </mesh>
          </group>
        </>
      );
      break;
    case 'curious':
      content = (
        <>
          <mesh position={[-0.25, 0, 0]}>
            <boxGeometry args={[0.12, 0.12, 0.02]} />
            <meshStandardMaterial {...mats.glow} />
          </mesh>
          <mesh position={[0.25, 0, 0]}>
            <boxGeometry args={[0.15, 0.04, 0.02]} />
            <meshStandardMaterial {...mats.glow} />
          </mesh>
        </>
      );
      break;
    case 'default':
    default:
      content = (
        <>
          <mesh position={[-0.28, 0, 0]} rotation={[0, 0, 0.28]}>
            <boxGeometry args={[0.22, 0.055, 0.018]} />
            <meshStandardMaterial {...mats.glow} />
          </mesh>
          <mesh position={[0.28, 0, 0]} rotation={[0, 0, -0.28]}>
            <boxGeometry args={[0.22, 0.055, 0.018]} />
            <meshStandardMaterial {...mats.glow} />
          </mesh>
        </>
      );
      break;
  }

  return (
    <group ref={eyesRef} position={[0, 0.12, 0.761]}>
      {content}
    </group>
  );
};

/* ================================================
   EAR / SENSOR MODULES
   ================================================ */
const RobotEarModule = ({ side }) => {
  const mats = useRobotMaterials();
  return (
    <group position={[side * 0.78, 0.05, 0]} rotation={[0, 0, Math.PI / 2]}>
      {/* Outer ring */}
      <mesh>
        <cylinderGeometry args={[0.32, 0.32, 0.1, 32]} />
        <meshStandardMaterial color={ROBOT_COLORS.armorPurple} metalness={0.7} roughness={0.25} />
      </mesh>
      {/* Inner glowing disc */}
      <mesh position={[0, 0.06, 0]}>
        <cylinderGeometry args={[0.18, 0.18, 0.08, 32]} />
        <meshStandardMaterial {...mats.glow} emissiveIntensity={0.8} />
      </mesh>
      {/* Outer thin ring detail */}
      <mesh position={[0, -0.02, 0]}>
        <cylinderGeometry args={[0.36, 0.36, 0.02, 32]} />
        <meshStandardMaterial color={ROBOT_COLORS.deepPurple} metalness={0.8} roughness={0.3} />
      </mesh>
    </group>
  );
};

/* ================================================
   ROBOT HEAD  (Step 3)
   ================================================ */
const RobotHead = ({ headRef, eyesRef, expression }) => {
  const mats = useRobotMaterials();

  return (
    <group ref={headRef} position={[0, 0.15, 0]}>
      {/* 1. Main head shell */}
      <RoundedBox args={[1.55, 1.25, 1.25]} radius={0.18} smoothness={8} castShadow receiveShadow>
        <meshPhysicalMaterial {...mats.outerArmor} />
      </RoundedBox>

      {/* 2. Rear/top casing shell (depth) */}
      <RoundedBox args={[1.62, 1.28, 1.05]} radius={0.16} smoothness={6}
        position={[0, 0.03, -0.08]}>
        <meshStandardMaterial {...mats.innerBlack} />
      </RoundedBox>

      {/* 3. Jaw / lower face plate */}
      <RoundedBox args={[1.42, 0.42, 0.22]} radius={0.08} smoothness={6}
        position={[0, -0.38, 0.56]} castShadow>
        <meshPhysicalMaterial {...mats.darkArmor} />
      </RoundedBox>

      {/* 4. Brow plate */}
      <RoundedBox args={[1.28, 0.14, 0.14]} radius={0.05} smoothness={4}
        position={[0, 0.36, 0.64]}>
        <meshPhysicalMaterial {...mats.purpleArmor} />
      </RoundedBox>

      {/* 5. Visor frame (outer) */}
      <RoundedBox args={[1.28, 0.56, 0.11]} radius={0.08} smoothness={6}
        position={[0, 0.12, 0.65]}>
        <meshStandardMaterial {...mats.panelBlackMat} />
      </RoundedBox>

      {/* 6. Visor glass (inner) */}
      <RoundedBox args={[1.14, 0.43, 0.08]} radius={0.06} smoothness={6}
        position={[0, 0.12, 0.72]}>
        <meshPhysicalMaterial {...mats.glass} />
      </RoundedBox>

      {/* 7. Eyes */}
      <RobotEyes eyesRef={eyesRef} expression={expression} />

      {/* 8. Ear / Sensor Modules */}
      <RobotEarModule side={-1} />
      <RobotEarModule side={1} />

      {/* 9. Mouth / voice grill */}
      <group position={[0, -0.4, 0.68]}>
        {[-0.18, -0.08, 0.02, 0.12, 0.22].map((x, i) => (
          <RoundedBox key={i} args={[0.025, 0.12, 0.04]} radius={0.008} smoothness={2}
            position={[x, 0, 0]}>
            <meshStandardMaterial {...mats.glow} emissiveIntensity={0.6} />
          </RoundedBox>
        ))}
      </group>

      {/* 10. Head side seam strips */}
      <PanelSeam position={[-0.78, 0.05, 0.2]} args={[0.02, 0.8, 0.04]} />
      <PanelSeam position={[0.78, 0.05, 0.2]} args={[0.02, 0.8, 0.04]} />

      {/* 11. Top/back detail vents */}
      <RoundedBox args={[0.4, 0.06, 0.15]} radius={0.02} smoothness={2}
        position={[0.18, 0.6, -0.35]}>
        <meshStandardMaterial {...mats.innerBlack} />
      </RoundedBox>
      <RoundedBox args={[0.4, 0.06, 0.15]} radius={0.02} smoothness={2}
        position={[-0.18, 0.6, -0.35]}>
        <meshStandardMaterial {...mats.innerBlack} />
      </RoundedBox>

      {/* 12. Small bolts on head */}
      <Bolt position={[-0.65, 0.42, 0.58]} />
      <Bolt position={[0.65, 0.42, 0.58]} />
      <Bolt position={[-0.65, -0.18, 0.58]} />
      <Bolt position={[0.65, -0.18, 0.58]} />
    </group>
  );
};

/* ================================================
   ROBOT NECK  (Step 5)
   ================================================ */
const RobotNeck = () => {
  const mats = useRobotMaterials();

  return (
    <group position={[0, -0.75, 0]}>
      {/* Central cylinder */}
      <mesh>
        <cylinderGeometry args={[0.24, 0.24, 0.45, 32]} />
        <meshStandardMaterial {...mats.innerBlack} />
      </mesh>

      {/* Ring collars */}
      {[0.22, 0.02, -0.18].map((y, i) => (
        <mesh key={i} position={[0, y, 0]}>
          <cylinderGeometry args={[0.34, 0.34, 0.055, 32]} />
          <meshStandardMaterial
            color={i % 2 === 0 ? ROBOT_COLORS.deepPurple : ROBOT_COLORS.voidBlack}
            metalness={0.7} roughness={0.35} />
        </mesh>
      ))}

      {/* Front glowing neck status line */}
      <RoundedBox args={[0.12, 0.025, 0.012]} radius={0.005} smoothness={2}
        position={[0, 0.05, 0.35]}>
        <meshStandardMaterial {...mats.glow} emissiveIntensity={1.2} />
      </RoundedBox>
    </group>
  );
};

/* ================================================
   CHEST DISPLAY  (Step 7)
   ================================================ */
const RobotChestDisplay = ({ barRefs, onChestClick, expression }) => {
  const mats = useRobotMaterials();
  const groupRef = useRef();

  useFrame((state) => {
    if (groupRef.current) {
      // Gentle breathing animation to encourage clicking
      const s = 1 + Math.sin(state.clock.elapsedTime * 3) * 0.03;
      groupRef.current.scale.setScalar(s);
    }
  });

  return (
    <group 
      ref={groupRef}
      position={[0, 0.08, 0.56]}
      onClick={(e) => {
        e.stopPropagation();
        if (onChestClick) onChestClick();
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={(e) => {
        e.stopPropagation();
        document.body.style.cursor = 'auto';
      }}
    >
      {/* Outer display frame */}
      <RoundedBox args={[0.95, 0.48, 0.08]} radius={0.06} smoothness={4}
        position={[0, 0, 0.12]}>
        <meshStandardMaterial {...mats.innerBlack} />
      </RoundedBox>

      {/* Glass display */}
      <RoundedBox args={[0.78, 0.34, 0.04]} radius={0.04} smoothness={4}
        position={[0, 0, 0.17]}>
        <meshPhysicalMaterial {...mats.glass} />
      </RoundedBox>

      {/* Horizontal separator line */}
      <mesh position={[0, 0.08, 0.2]}>
        <boxGeometry args={[0.6, 0.008, 0.005]} />
        <meshStandardMaterial color={ROBOT_COLORS.softWhite} opacity={0.25} transparent />
      </mesh>

      {/* Dynamic Screen Content */}
      {expression && expression !== 'default' ? (
        <Text
          position={[0, -0.04, 0.2]}
          fontSize={0.11}
          color={ROBOT_COLORS.glowLime}
          font="https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hjp-Ek-_EeA.woff"
          anchorX="center"
          anchorY="middle"
          letterSpacing={0.1}
        >
          {expression.toUpperCase()}
          <meshBasicMaterial color={ROBOT_COLORS.glowLime} toneMapped={false} />
        </Text>
      ) : (
        <group position={[0, -0.04, 0.2]}>
          {[-0.2, -0.1, 0, 0.1, 0.2].map((x, i) => (
            <mesh key={i} position={[x, 0, 0]} ref={el => { if (barRefs) barRefs.current[i] = el; }}>
              <boxGeometry args={[0.04, 0.12, 0.015]} />
              <meshStandardMaterial
                color={i % 2 === 0 ? ROBOT_COLORS.glowLime : ROBOT_COLORS.rimPurple}
                emissive={i % 2 === 0 ? ROBOT_COLORS.glowLime : ROBOT_COLORS.eedooPurple}
                emissiveIntensity={0.9} />
            </mesh>
          ))}
        </group>
      )}

      {/* Status dot */}
      <mesh position={[0.32, 0.08, 0.2]}>
        <sphereGeometry args={[0.022, 16, 16]} />
        <meshStandardMaterial {...mats.glow} emissiveIntensity={1.5} />
      </mesh>
    </group>
  );
};

/* ================================================
   ROBOT TORSO  (Step 6)
   ================================================ */
const RobotTorso = ({ barRefs, onChestClick, expression }) => {
  const mats = useRobotMaterials();

  return (
    <group position={[0, -2.1, 0]}>
      {/* 1. Main torso shell */}
      <RoundedBox args={[2.22, 1.78, 1.05]} radius={0.18} smoothness={8} castShadow receiveShadow>
        <meshPhysicalMaterial {...mats.darkArmor} />
      </RoundedBox>

      {/* 2. Upper chest cap */}
      <RoundedBox args={[2.0, 0.28, 1.02]} radius={0.12} smoothness={6}
        position={[0, 0.83, 0.03]}>
        <meshPhysicalMaterial {...mats.outerArmor} />
      </RoundedBox>

      {/* 3. Lower abdomen / waist */}
      <RoundedBox args={[1.55, 0.34, 0.82]} radius={0.12} smoothness={6}
        position={[0, -0.98, 0]}>
        <meshStandardMaterial {...mats.innerBlack} />
      </RoundedBox>

      {/* 4. Side bevel panels */}
      {[-1, 1].map(side => (
        <RoundedBox key={side} args={[0.18, 1.25, 0.76]} radius={0.06} smoothness={4}
          position={[side * 1.08, -0.05, 0.14]}>
          <meshStandardMaterial {...mats.deepPurpleMat} />
        </RoundedBox>
      ))}

      {/* 5. Front armor plate */}
      <RoundedBox args={[1.62, 1.05, 0.18]} radius={0.11} smoothness={6}
        position={[0, 0.05, 0.56]} castShadow>
        <meshPhysicalMaterial {...mats.outerArmor} />
      </RoundedBox>

      {/* 6. Front armor bolts */}
      <Bolt position={[-0.72, 0.48, 0.66]} />
      <Bolt position={[0.72, 0.48, 0.66]} />
      <Bolt position={[-0.72, -0.42, 0.66]} />
      <Bolt position={[0.72, -0.42, 0.66]} />

      {/* 7. Panel seams */}
      <PanelSeam position={[-0.5, 0.05, 0.66]} args={[0.008, 0.85, 0.01]} />
      <PanelSeam position={[0.5, 0.05, 0.66]} args={[0.008, 0.85, 0.01]} />

      {/* 8. Chest display */}
      <RobotChestDisplay barRefs={barRefs} onChestClick={onChestClick} expression={expression} />
    </group>
  );
};

/* ================================================
   SHOULDER SOCKET  (Step 8)
   ================================================ */
const RobotShoulder = ({ side }) => {
  const mats = useRobotMaterials();

  return (
    <group position={[side * 1.28, 0.45, 0]}>
      {/* Inner socket ring */}
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.38, 0.38, 0.16, 32]} />
        <meshStandardMaterial {...mats.innerBlack} />
      </mesh>

      {/* Purple ball */}
      <mesh position={[side * 0.24, 0, 0]}>
        <sphereGeometry args={[0.46, 32, 32]} />
        <meshPhysicalMaterial {...mats.purpleArmor} />
      </mesh>

      {/* Outer cap */}
      <mesh position={[side * 0.34, 0.02, 0.03]}>
        <sphereGeometry args={[0.33, 24, 24]} />
        <meshStandardMaterial color={ROBOT_COLORS.eedooPurple} metalness={0.5} roughness={0.3} />
      </mesh>

      {/* Highlight ring band */}
      <mesh position={[side * 0.12, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <torusGeometry args={[0.38, 0.02, 8, 32]} />
        <meshStandardMaterial color={ROBOT_COLORS.rimPurple} metalness={0.6} roughness={0.3} />
      </mesh>
    </group>
  );
};

/* ================================================
   SEGMENTED ARM  (Step 9)
   ================================================ */
const RobotArm = ({ side, armRef }) => {
  const mats = useRobotMaterials();

  return (
    <group ref={armRef}>
      {/* Upper arm */}
      <mesh position={[side * 1.58, -0.28, 0]} rotation={[0, 0, side * 0.22]} castShadow>
        <cylinderGeometry args={[0.18, 0.18, 0.78, 24]} />
        <meshStandardMaterial {...mats.armBlack} />
      </mesh>

      {/* Upper arm armor strip */}
      <RoundedBox args={[0.1, 0.55, 0.12]} radius={0.03} smoothness={3}
        position={[side * 1.58, -0.28, 0.14]} rotation={[0, 0, side * 0.22]}>
        <meshPhysicalMaterial {...mats.purpleArmor} />
      </RoundedBox>

      {/* Elbow joint */}
      <mesh position={[side * 1.72, -0.88, 0]}>
        <sphereGeometry args={[0.24, 24, 24]} />
        <meshPhysicalMaterial color={ROBOT_COLORS.jointPurple} metalness={0.5} roughness={0.28}
          clearcoat={0.3} />
      </mesh>

      {/* Forearm */}
      <mesh position={[side * 1.82, -1.35, 0]} rotation={[0, 0, side * 0.08]} castShadow>
        <cylinderGeometry args={[0.18, 0.23, 0.85, 24]} />
        <meshStandardMaterial {...mats.armBlack} />
      </mesh>

      {/* Forearm armor strip */}
      <RoundedBox args={[0.08, 0.6, 0.1]} radius={0.008} smoothness={3}
        position={[side * 1.82, -1.35, 0.18]} rotation={[0, 0, side * 0.08]}>
        <meshStandardMaterial {...mats.deepPurpleMat} />
      </RoundedBox>

      {/* Wrist cap */}
      <mesh position={[side * 1.88, -1.78, 0]}>
        <sphereGeometry args={[0.16, 16, 16]} />
        <meshStandardMaterial color={ROBOT_COLORS.armorPurple} metalness={0.6} roughness={0.35} />
      </mesh>

      {/* Simple hand / mitten */}
      <group position={[side * 1.9, -2.02, 0]}>
        <RoundedBox args={[0.22, 0.2, 0.16]} radius={0.06} smoothness={3}>
          <meshStandardMaterial {...mats.armBlack} />
        </RoundedBox>
        {/* Thumb nub */}
        <RoundedBox args={[0.08, 0.12, 0.1]} radius={0.03} smoothness={2}
          position={[side * 0.12, -0.02, 0.06]}>
          <meshStandardMaterial {...mats.armBlack} />
        </RoundedBox>
      </group>
    </group>
  );
};

/* ================================================
   ROBOT LIGHTING  (Step 12)
   ================================================ */
const RobotLighting = () => (
  <>
    {/* Ambient */}
    <ambientLight intensity={0.3} />

    {/* Key spot */}
    <spotLight
      position={[4, 7, 5]}
      intensity={1.8}
      angle={0.45}
      penumbra={0.8}
      color={ROBOT_COLORS.softWhite}
      castShadow
    />

    {/* Front soft fill */}
    <pointLight position={[0, 1, 4]} intensity={0.5} color={ROBOT_COLORS.rimPurple} />

    {/* Purple rim (back left) */}
    <pointLight position={[-4, 2, -4]} intensity={3} color={ROBOT_COLORS.eedooPurple} />

    {/* Purple rim (back right) */}
    <pointLight position={[4, 2, -5]} intensity={2} color={ROBOT_COLORS.eedooPurple} />

    {/* Low underglow */}
    <pointLight position={[0, -2.5, 2]} intensity={0.25} color={ROBOT_COLORS.glowLime} />
  </>
);

/* ================================================
   RESPONSIVE ROBOT  (Step 13)
   ================================================ */
const ResponsiveRobot = ({ children }) => {
  const groupRef = useRef();
  const { viewport } = useThree();

  useFrame(() => {
    if (!groupRef.current) return;
    const w = viewport.width;
    let s = 1;
    let py = -0.15;

    if (w < 5) {
      // mobile
      s = 0.72;
      py = -0.35;
    } else if (w < 8) {
      // tablet
      s = 0.88;
      py = -0.1;
    }

    groupRef.current.scale.setScalar(THREE.MathUtils.lerp(groupRef.current.scale.x, s, 0.05));
    groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, py, 0.05);
  });

  return <group ref={groupRef}>{children}</group>;
};

/* ================================================
   MAIN ROBOT ASSEMBLY  (Steps 3-11)
   ================================================ */
const Robot = ({ expression, onChestClick }) => {
  const headRef = useRef();
  const eyesRef = useRef();
  const leftArmRef = useRef();
  const rightArmRef = useRef();
  const barRefs = useRef([]);

  useFrame((state) => {
    const { pointer } = state;
    const time = state.clock.elapsedTime;

    /* -- Head tracking (Step 11) -- */
    if (headRef.current) {
      const headTargetX = (pointer.y * Math.PI) / 10;
      const headTargetY = (pointer.x * Math.PI) / 8;
      headRef.current.rotation.x = THREE.MathUtils.lerp(
        headRef.current.rotation.x, -headTargetX, 0.08
      );
      headRef.current.rotation.y = THREE.MathUtils.lerp(
        headRef.current.rotation.y, headTargetY, 0.08
      );
    }

    /* -- Eye tracking – position based, clamped (Step 4 + 11) -- */
    if (eyesRef.current) {
      const eyeTargetX = THREE.MathUtils.clamp(pointer.x * 0.035, -0.05, 0.05);
      const eyeTargetY = THREE.MathUtils.clamp(pointer.y * 0.025, -0.035, 0.035);
      eyesRef.current.position.x = THREE.MathUtils.lerp(eyesRef.current.position.x, eyeTargetX, 0.12);
      eyesRef.current.position.y = THREE.MathUtils.lerp(
        eyesRef.current.position.y, 0.12 + eyeTargetY, 0.12
      );

      // Pulse glow
      const pulse = 1 + Math.sin(time * 2.2) * 0.08;
      eyesRef.current.traverse(child => {
        if (child.isMesh && child.material) {
          child.material.emissiveIntensity = 1.8 * pulse;
        }
      });
    }

    /* -- Chest bar animation (Step 7 + 11) -- */
    barRefs.current.forEach((bar, i) => {
      if (bar) {
        bar.scale.y = 0.75 + Math.sin(time * 2 + i) * 0.22;
      }
    });

    /* -- Arm idle sway (Step 9 + 11) -- */
    if (leftArmRef.current) {
      leftArmRef.current.rotation.z = Math.sin(time * 1.2) * 0.025;
    }
    if (rightArmRef.current) {
      rightArmRef.current.rotation.z = Math.sin(time * 1.2 + Math.PI) * 0.025;
    }
  });

  return (
    <ResponsiveRobot>
      <Float speed={1.4} rotationIntensity={0.055} floatIntensity={0.28}>
        <group position={[0, 0, 0]}>
          {/* Head */}
          <RobotHead headRef={headRef} eyesRef={eyesRef} expression={expression} />

          {/* Neck */}
          <RobotNeck />

          {/* Torso */}
          <RobotTorso barRefs={barRefs} onChestClick={onChestClick} expression={expression} />

          {/* Shoulders (inside torso position context) */}
          <group position={[0, -2.1, 0]}>
            <RobotShoulder side={-1} />
            <RobotShoulder side={1} />

            {/* Arms */}
            <RobotArm side={-1} armRef={leftArmRef} />
            <RobotArm side={1} armRef={rightArmRef} />
          </group>
        </group>
      </Float>
    </ResponsiveRobot>
  );
};

/* ================================================
   HERO WRAPPER  (Steps 12-13)
   ================================================ */
export default function RobotHero() {
  const [expression, setExpression] = useState('default');
  const [showExpressionsMenu, setShowExpressionsMenu] = useState(false);
  const expressions = [
    'default', 'happy', 'focused', 'sleepy', 
    'surprised', 'error', 'processing', 'wink', 
    'playful', 'curious'
  ];

  return (
    <div className="eedoo-robot-hero w-full h-screen relative overflow-hidden flex items-center justify-center">
      {/* Background Text */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-0">
        <h1
          className="eedoo-hero-word text-[25vw] font-black text-[#8D76C9]"
          style={{
            lineHeight: 1,
            letterSpacing: '-0.02em',
          }}
        >
          EEDOO
        </h1>
      </div>

      {/* Expression UI Overlay */}
      <div 
        className={`absolute bottom-6 right-6 z-50 flex flex-col gap-3 bg-[#0B0A10]/90 p-5 rounded-2xl border border-[#29203A] backdrop-blur-md shadow-2xl transition-all duration-300 transform ${showExpressionsMenu ? 'translate-y-0 opacity-100 pointer-events-auto' : 'translate-y-8 opacity-0 pointer-events-none'}`}
      >
        <div className="flex justify-between items-center mb-1">
          <h3 className="text-[#8D76C9] font-bold text-xs uppercase tracking-widest flex items-center gap-2 flex-1">
            <span>Eye Expressions</span>
            <span className="h-px bg-[#29203A] flex-1"></span>
          </h3>
          <button 
            onClick={() => setShowExpressionsMenu(false)}
            className="text-[#8D76C9] hover:text-[#D5E86B] ml-4 text-xl leading-none font-bold cursor-pointer"
          >
            &times;
          </button>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {expressions.map(exp => (
            <button
              key={exp}
              onClick={() => setExpression(exp)}
              className={`px-4 py-2 text-[10px] font-bold rounded-lg uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                expression === exp 
                  ? 'bg-[#8D76C9] text-[#07070B] shadow-[0_0_15px_rgba(141,118,201,0.4)]' 
                  : 'bg-[#14111E] text-[#B19AE8] hover:bg-[#29203A] hover:text-[#D5E86B]'
              }`}
            >
              {exp}
            </button>
          ))}
        </div>
      </div>

      {/* 3D Canvas */}
      <div className="eedoo-robot-canvas absolute inset-0 z-10">
        <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>
          <RobotLighting />
          <Robot expression={expression} onChestClick={() => setShowExpressionsMenu(prev => !prev)} />
          <ContactShadows position={[0, -4.2, 0]} opacity={0.35} scale={12} blur={2.5} far={5} />
          <Environment preset="city" />
        </Canvas>
      </div>
    </div>
  );
}
