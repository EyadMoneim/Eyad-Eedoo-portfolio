import { useMemo, useRef, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Environment, Float, ContactShadows, RoundedBox, Text, Html } from '@react-three/drei';
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
          <mesh position={[-0.27, -0.02, 0]} rotation={[0, 0, 0]}>
            <boxGeometry args={[0.22, 0.02, 0.018]} />
            <meshStandardMaterial {...mats.glow} />
          </mesh>
          <mesh position={[0.27, -0.02, 0]} rotation={[0, 0, 0]}>
            <boxGeometry args={[0.22, 0.02, 0.018]} />
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
const RobotHead = ({ headRef, eyesRef, expression, onChestClick, activePanel, tooltipState, setActivePanel, setTooltipState }) => {
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

        {/* Tooltip emitted from mouth */}
        {!activePanel && (
          <Html position={[0, -0.05, 0]} zIndexRange={[100, 0]}>
            <style>{`
              .robot-tooltip::before, .robot-tooltip::after { display: none !important; }
            `}</style>
            
            {/* SVG line from mouth (0,0) to tooltip (200, -190) */}
            <svg style={{ position: 'absolute', top: 0, left: 0, width: '1px', height: '1px', overflow: 'visible', pointerEvents: 'none', zIndex: -1 }}>
              <path d="M 0,0 C 80,-20 80,-150 200,-150" fill="none" stroke="rgba(177, 154, 232, 0.8)" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="6,6" className="animated-robot-line" style={{ filter: 'drop-shadow(0 0 5px rgba(177, 154, 232, 0.8))' }} />
              <circle cx="0" cy="0" r="2" fill="#D5E86B" style={{ filter: 'drop-shadow(0 0 5px #D5E86B)' }} />
            </svg>

            <div className="robot-tooltip float-anim-1" style={{ position: 'absolute', left: '150px', top: '-180px', minWidth: 'max-content' }}>
              {tooltipState === 'initial' ? (
                <div key="initial" className="flex items-center gap-4">
                  <div className="tooltip-content anim-slide-up-1">
                    <div className="tooltip-title" style={{ color: '#F4F4ED' }}>Hey there!</div>
                    <div className="tooltip-subtitle">Click to start</div>
                  </div>
                  <div className="tooltip-btn anim-slide-up-2" onClick={(e) => { e.stopPropagation(); setTooltipState('options'); }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#F4F4ED" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                      <polyline points="12 5 19 12 12 19"></polyline>
                    </svg>
                  </div>
                </div>
              ) : (
                <div className="flex gap-2 p-0 items-center">
                  <button
                    onClick={(e) => { e.stopPropagation(); setTooltipState('initial'); }}
                    className="p-2 rounded-xl hover:bg-[#29203A]/50 text-[#B19AE8] hover:text-[#F4F4ED] transition-colors cursor-pointer anim-slide-up-1"
                    title="Go Back"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="19" y1="12" x2="5" y2="12"></line>
                      <polyline points="12 19 5 12 12 5"></polyline>
                    </svg>
                  </button>
                  <button 
                    onClick={(e) => { e.stopPropagation(); setActivePanel('chat'); setTooltipState('initial'); }}
                    className="tech-btn-primary anim-slide-up-1 px-4 py-2 rounded-xl font-bold text-sm flex items-center gap-2 cursor-pointer"
                  >
                    <div className="bg-[#07070B]/20 p-1 rounded-md flex items-center justify-center">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                      </svg>
                    </div>
                    <span className="tracking-wide">Chat</span>
                  </button>
                  <button 
                    onClick={(e) => { e.stopPropagation(); setActivePanel('expressions'); setTooltipState('initial'); }}
                    className="tech-btn-secondary anim-slide-up-2 px-4 py-2 rounded-xl font-bold text-sm flex items-center gap-2 cursor-pointer"
                  >
                    <div className="bg-[#29203A]/50 p-1 rounded-md flex items-center justify-center transition-colors">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                        <circle cx="12" cy="12" r="3"></circle>
                      </svg>
                    </div>
                    <span className="tracking-wide">Expressions</span>
                  </button>
                </div>
              )}
            </div>
          </Html>
        )}
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
          color={ROBOT_COLORS.eedooPurple}
          font="https://fonts.gstatic.com/s/play/v21/6aez4K2oVqwIjtI.ttf"
          anchorX="center"
          anchorY="middle"
          letterSpacing={0.1}
        >
          {expression.toUpperCase()}
          <meshBasicMaterial color={ROBOT_COLORS.eedooPurple} toneMapped={false} />
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
const ResponsiveRobot = ({ children, activePanel }) => {
  const groupRef = useRef();
  const { viewport } = useThree();

  useFrame(() => {
    if (!groupRef.current) return;
    const w = viewport.width;
    let s = 1;
    let py = -0.15;
    let px = 0;
    let rotY = 0;

    if (w < 5) {
      // mobile
      s = 0.72;
      py = -0.35;
    } else if (w < 8) {
      // tablet
      s = 0.88;
      py = -0.1;
    }

    if (activePanel) {
      if (w < 5) px = -0.5;
      else if (w < 8) px = -1.2;
      else px = -2.5;
      rotY = Math.PI / 8; // Tilt body to face the panel on the right
    }

    groupRef.current.scale.setScalar(THREE.MathUtils.lerp(groupRef.current.scale.x, s, 0.05));
    groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, py, 0.05);
    groupRef.current.position.x = THREE.MathUtils.lerp(groupRef.current.position.x, px, 0.05);
    groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, rotY, 0.05);
  });

  return <group ref={groupRef}>{children}</group>;
};

/* ================================================
   MAIN ROBOT ASSEMBLY  (Steps 3-11)
   ================================================ */
const Robot = ({ expression, onChestClick, activePanel, tooltipState, setActivePanel, setTooltipState }) => {
  const headRef = useRef();
  const eyesRef = useRef();
  const leftArmRef = useRef();
  const rightArmRef = useRef();
  const barRefs = useRef([]);

  const globalMouse = useRef({ x: 0, y: 0 });
  useEffect(() => {
    const handleMouseMove = (e) => {
      globalMouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      globalMouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useFrame((state) => {
    const time = state.clock.elapsedTime;

    /* -- Head tracking (Step 11) -- */
    if (headRef.current) {
      const headTargetX = (globalMouse.current.y * Math.PI) / 10;
      const headTargetY = (globalMouse.current.x * Math.PI) / 8;
      headRef.current.rotation.x = THREE.MathUtils.lerp(
        headRef.current.rotation.x, -headTargetX, 0.08
      );
      headRef.current.rotation.y = THREE.MathUtils.lerp(
        headRef.current.rotation.y, headTargetY, 0.08
      );
    }

    /* -- Eye tracking – position based, clamped (Step 4 + 11) -- */
    if (eyesRef.current) {
      const eyeTargetX = THREE.MathUtils.clamp(globalMouse.current.x * 0.035, -0.05, 0.05);
      const eyeTargetY = THREE.MathUtils.clamp(globalMouse.current.y * 0.025, -0.035, 0.035);
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
    <ResponsiveRobot activePanel={activePanel}>
      <Float speed={1.4} rotationIntensity={0.055} floatIntensity={0.28}>
        <group position={[0, 0, 0]}>
          {/* Head */}
          <RobotHead 
            headRef={headRef} 
            eyesRef={eyesRef} 
            expression={expression} 
            onChestClick={onChestClick} 
            activePanel={activePanel}
            tooltipState={tooltipState}
            setActivePanel={setActivePanel}
            setTooltipState={setTooltipState}
          />

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
  const [isTyping, setIsTyping] = useState(false);
  const [activePanel, setActivePanel] = useState(null);
  const [tooltipState, setTooltipState] = useState('initial');
  const [inputValue, setInputValue] = useState('');
  const [showShortcuts, setShowShortcuts] = useState(true);
  const [chatHistory, setChatHistory] = useState([
    { sender: 'bot', text: 'Hey there! I am Eedoo, Eyad\'s digital assistant. How can I help you today?' }
  ]);
  const chatContainerRef = useRef(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatHistory, isTyping]);

  const expressions = [
    'default', 'happy', 'focused', 'sleepy', 
    'surprised', 'error', 'processing', 'wink', 
    'playful', 'curious'
  ];

  const handleQuestionClick = (question, answer, botExpression) => {
    if (isTyping) return;
    
    setChatHistory(prev => [...prev, { sender: 'user', text: question }]);
    setIsTyping(true);
    setExpression(botExpression || 'processing');
    
    setTimeout(() => {
      setChatHistory(prev => [...prev, { sender: 'bot', text: answer }]);
      setIsTyping(false);
      setExpression('default');
    }, 1500);
  };

  const handleInputSubmit = (e) => {
    e.preventDefault();
    if (!inputValue.trim() || isTyping) return;
    
    const userQuestion = inputValue.trim();
    setInputValue('');
    setChatHistory(prev => [...prev, { sender: 'user', text: userQuestion }]);
    setIsTyping(true);
    setExpression('processing');

    setTimeout(() => {
      const matched = predefinedQuestions.find(q => 
        userQuestion.toLowerCase().includes(q.q.toLowerCase().replace('?', '')) || 
        q.q.toLowerCase().includes(userQuestion.toLowerCase().replace('?', ''))
      );
      
      if (matched) {
        setChatHistory(prev => [...prev, { sender: 'bot', text: matched.a }]);
        setExpression(matched.exp);
      } else {
        setChatHistory(prev => [...prev, { sender: 'bot', text: "That is outside my current directives. However, I am more than happy to discuss Eyad's exceptional skills, his projects, or how to contact him." }]);
        setExpression('curious');
      }
      
      setIsTyping(false);
      setTimeout(() => setExpression('default'), 2000);
    }, 1500);
  };

  const predefinedQuestions = [
    {
      q: 'About Eedoo?',
      a: 'I am Eedoo. Eyad built me to be the most sophisticated digital assistant on the web. I manage his portfolio so he can focus on writing flawless code.',
      exp: 'focused'
    },
    {
      q: 'What are Eyad\'s skills?',
      a: 'He is exceptionally gifted in React and Three.js. While others build static pages, Eyad architects dynamic 3D experiences that elevate the standard of modern web design.',
      exp: 'curious'
    },
    {
      q: 'Can you show me projects?',
      a: 'Of course. Scroll down to view a curated selection of his finest work. Prepare to be impressed by his attention to detail and interactive mastery.',
      exp: 'playful'
    },
    {
      q: 'How to contact Eyad?',
      a: 'Eyad is highly sought after, but he always makes time for interesting opportunities. Use the contact form below or reach out via his professional networks in the navigation bar.',
      exp: 'happy'
    },
    {
      q: 'What is this site built with?',
      a: 'A refined blend of React, Tailwind CSS, and React Three Fiber. It takes a certain level of expertise to make complex 3D rendering perform this elegantly in a browser.',
      exp: 'wink'
    },
    {
      q: 'Why a 3D Robot?',
      a: 'Because an ordinary text box simply wouldn\'t do justice to his capabilities. He needed a masterpiece to greet his guests, and well, here I am.',
      exp: 'playful'
    }
  ];

  return (
    <div className="eedoo-robot-hero w-full h-screen relative overflow-hidden flex items-center justify-center group/hero">
      {/* Background Text */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-0">
        <h1
          className="eedoo-hero-word text-[25vw] font-black text-[#8D76C9] opacity-30"
          style={{ lineHeight: 1, letterSpacing: '-0.02em' }}
        >
          EEDOO
        </h1>
      </div>

      {/* 3D Canvas */}
      <div className="eedoo-robot-canvas absolute inset-0 z-10 pointer-events-none">
        <Canvas camera={{ position: [0, 0, 8], fov: 45 }} style={{ pointerEvents: 'auto' }}>
          <RobotLighting />
          <Robot 
            expression={expression} 
            onChestClick={() => setActivePanel(prev => prev ? null : 'expressions')} 
            activePanel={activePanel}
            tooltipState={tooltipState}
            setActivePanel={setActivePanel}
            setTooltipState={setTooltipState}
          />
          <ContactShadows position={[0, -4.2, 0]} opacity={0.35} scale={12} blur={2.5} far={5} />
          <Environment preset="city" />
        </Canvas>
      </div>

      {/* Expressions Panel (Right Side) */}
      <div 
        className={`absolute top-1/2 right-[5%] md:right-[10%] -translate-y-1/2 w-[90%] md:w-[350px] z-50 flex flex-col gap-4 bg-[#0B0A10]/80 p-6 rounded-3xl border border-[#29203A] backdrop-blur-xl shadow-[0_0_50px_rgba(141,118,201,0.2)] transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${activePanel === 'expressions' ? 'translate-x-0 opacity-100 pointer-events-auto' : 'translate-x-20 opacity-0 pointer-events-none'}`}
      >
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-[#8D76C9] font-bold text-sm uppercase tracking-widest flex items-center gap-2">
            <span>Expressions</span>
          </h3>
          <button onClick={() => setActivePanel(null)} className="text-[#B19AE8] hover:text-[#F4F4ED] p-2 rounded-full hover:bg-[#29203A] transition-colors">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {expressions.map(exp => (
            <button
              key={exp}
              onClick={() => setExpression(exp)}
              className={`px-3 py-2 text-[10px] font-bold rounded-lg uppercase tracking-wider transition-all duration-200 cursor-pointer ${
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

      {/* Chat Window Overlay (Right Side) */}
      <div 
        className={`absolute top-1/2 right-[5%] md:right-[10%] -translate-y-1/2 w-[90%] md:w-[450px] h-[75vh] max-h-[700px] z-40 bg-gradient-to-br from-[#1A1726]/80 to-[#07070B]/90 backdrop-blur-2xl border border-[#382c4d]/50 rounded-3xl shadow-[0_8px_32px_rgba(141,118,201,0.15)] flex flex-col overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${activePanel === 'chat' ? 'translate-x-0 opacity-100 pointer-events-auto' : 'translate-x-20 opacity-0 pointer-events-none'}`}
      >
        {/* Chat Header */}
        <div className="px-6 py-5 border-b border-[#382c4d]/50 bg-white/5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-[#8D76C9] flex items-center justify-center text-[#07070B]">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a10 10 0 0 1 10 10c0 5.523-4.477 10-10 10-1.742 0-3.38-.445-4.81-1.226L2 22l1.226-5.19A9.953 9.953 0 0 1 2 12C2 6.477 6.477 2 12 2z"></path></svg>
            </div>
            <div>
              <h2 className="text-[#F4F4ED] font-bold text-lg leading-tight">Meet Eedoo</h2>
              <p className="text-[#8D76C9] text-xs font-semibold tracking-wider">AI ASSISTANT</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button 
              onClick={() => {
                setChatHistory([{ sender: 'bot', text: 'Hey there! I am Eedoo, Eyad\'s digital assistant. How can I help you today?' }]);
                setExpression('default');
              }} 
              className="text-[#B19AE8] hover:text-[#F4F4ED] p-2 rounded-full hover:bg-[#29203A]/60 transition-colors"
              title="Reset Chat"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path>
                <polyline points="3 3 3 8 8 8"></polyline>
              </svg>
            </button>
            <button 
              onClick={() => setActivePanel(null)} 
              className="text-[#B19AE8] hover:text-[#F4F4ED] p-2 rounded-full hover:bg-[#29203A]/60 transition-colors"
              title="Close"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
          </div>
        </div>

        {/* Chat Messages Area */}
        <div 
          ref={chatContainerRef}
          data-lenis-prevent="true"
          className="flex-1 p-6 overflow-y-auto flex flex-col gap-4 custom-scrollbar"
        >
          {chatHistory.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] p-4 text-sm leading-relaxed ${msg.sender === 'user' ? 'bg-gradient-to-r from-[#a088dd] to-[#8D76C9] text-[#07070B] rounded-2xl rounded-br-sm shadow-md font-medium' : 'bg-[#14111E]/80 backdrop-blur-sm border border-[#382c4d]/50 text-[#F4F4ED] rounded-2xl rounded-bl-sm shadow-sm'}`}>
                {msg.text}
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-[#1A1726] border border-[#29203A] rounded-2xl rounded-bl-none p-4 flex items-center justify-center h-12 w-20">
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-[#8D76C9] animate-[bounce_1s_infinite]" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 rounded-full bg-[#8D76C9] animate-[bounce_1s_infinite]" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 rounded-full bg-[#8D76C9] animate-[bounce_1s_infinite]" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Chat Input/Questions Area */}
        <div className="p-4 border-t border-[#382c4d]/50 bg-[#07070B]/40 backdrop-blur-md flex flex-col gap-2">
          
          {/* Shortcuts Header & Toggle */}
          <div className="flex justify-between items-center px-1">
            <span className="text-[10px] uppercase tracking-widest text-[#59447F] font-bold">Suggested Questions</span>
            <button 
              onClick={() => setShowShortcuts(!showShortcuts)}
              className="text-[#8D76C9] hover:text-[#B19AE8] transition-colors focus:outline-none flex items-center justify-center p-1 rounded-full hover:bg-[#29203A]/50"
              title={showShortcuts ? "Hide Shortcuts" : "Show Shortcuts"}
            >
              {showShortcuts ? (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="18 15 12 9 6 15"></polyline></svg>
              ) : (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
              )}
            </button>
          </div>

          {/* Suggestion Chips */}
          <div className={`transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] overflow-hidden ${showShortcuts ? 'max-h-[300px] opacity-100 pb-2' : 'max-h-0 opacity-0 pb-0'}`}>
            <div className="flex gap-2 flex-wrap">
              {predefinedQuestions.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => handleQuestionClick(q.q, q.a, q.exp)}
                  disabled={isTyping}
                  className="px-4 py-2 bg-[#1A1726]/60 hover:bg-[#8D76C9]/20 border border-[#382c4d]/80 hover:border-[#8D76C9]/60 text-[#B19AE8] hover:text-[#F4F4ED] rounded-full transition-all duration-300 text-xs font-semibold tracking-wide disabled:opacity-40 disabled:cursor-not-allowed shadow-sm"
                >
                  {q.q}
                </button>
              ))}
            </div>
          </div>
          
          {/* Input Field (Upcoming Feature) */}
          <div className="relative flex items-center group/input mt-1">
            <div className="absolute left-4 text-[#59447F] opacity-80 group-hover/input:text-[#8D76C9] transition-colors">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
            </div>
            <input 
              type="text" 
              readOnly
              placeholder="Typing feature coming soon..." 
              className="w-full bg-[#0B0A10]/40 border border-[#382c4d]/50 text-[#F4F4ED] text-sm rounded-full py-3.5 pl-11 pr-14 transition-all shadow-inner placeholder:text-[#59447F]/80 cursor-not-allowed"
            />
            <button 
              type="button" 
              disabled
              className="absolute right-1.5 p-2 bg-[#29203A]/50 text-[#59447F] rounded-full cursor-not-allowed transition-all duration-300"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
            </button>
            
            {/* Hover Tooltip for Upcoming Feature */}
            <div className="absolute top-[-35px] left-1/2 -translate-x-1/2 bg-[#8D76C9] text-[#07070B] text-[10px] font-bold px-3 py-1.5 rounded-lg shadow-lg opacity-0 group-hover/input:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
              Upcoming Feature!
              <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-[#8D76C9] rotate-45"></div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
