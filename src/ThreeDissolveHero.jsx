import React, { useRef, useMemo, useCallback, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";
import gsap from "gsap";

import eyadHumanSrc from "./assets/eyad-human.avif";
import eyadRobotSrc from "./assets/eyad-robot.avif";

// ================================================
// Simplex 2D noise GLSL (Ashima Arts)
// ================================================
const simplexNoiseGLSL = /* glsl */ `
vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }

float snoise(vec2 v) {
  const vec4 C = vec4(0.211324865405187, 0.366025403784439,
                      -0.577350269189626, 0.024390243902439);
  vec2 i  = floor(v + dot(v, C.yy));
  vec2 x0 = v -   i + dot(i, C.xx);
  vec2 i1;
  i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod289(i);
  vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0))
                           + i.x + vec3(0.0, i1.x, 1.0));
  vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy),
                           dot(x12.zw,x12.zw)), 0.0);
  m = m*m;
  m = m*m;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
  vec3 g;
  g.x = a0.x * x0.x + h.x * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}
`;

const dissolveVertexShader = /* glsl */ `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const dissolveFragmentShader = /* glsl */ `
${simplexNoiseGLSL}

uniform sampler2D uTexture;
uniform sampler2D uRobotTexture;
uniform float uHover;
uniform vec2 uMouse;
uniform float uTime;
uniform float uAspect;
uniform float uFullTransform;

varying vec2 vUv;

void main() {
  vec4 humanColor = texture2D(uTexture, vUv);
  vec4 robotColor = texture2D(uRobotTexture, vUv);
  
  // ============================================
  // MODE 1: Cursor Reveal (circular, mouse-follow)
  // Original premium hover effect — robot appears
  // locally around the cursor with a noisy edge.
  // ============================================
  float n1 = snoise(vUv * 4.0 + uTime * 0.1);
  float n2 = snoise(vUv * 8.0 - uTime * 0.05) * 0.5;
  float cursorNoise = (n1 + n2) * 0.5 + 0.5; // 0..1
  
  // Aspect-corrected distance from pixel to mouse
  vec2 aspectUv = vec2(vUv.x * uAspect, vUv.y);
  vec2 aspectMouse = vec2(uMouse.x * uAspect, uMouse.y);
  float dist = distance(aspectUv, aspectMouse);
  
  // Max radius for the hover reveal
  float maxRadius = 0.35;
  
  // Idle pulsing tease (only active when NOT hovering)
  // Pulses between 0.0 and 0.015 radius to hint at the hidden layer
  float idlePulse = (sin(uTime * 3.0) * 0.5 + 0.5) * 0.015;
  float currentRadius = maxRadius * uHover + idlePulse * (1.0 - uHover);
  
  // Add noise to the edge so it's not a perfect circle, mimicking a sand/dust edge
  float noisyBoundary = currentRadius + (cursorNoise - 0.5) * 0.15;
  
  // effectAlpha is 0 inside the radius (dissolved), 1 outside
  float effectAlpha = smoothstep(noisyBoundary - 0.05, noisyBoundary + 0.05, dist);
  
  // cursorMix is 1 inside the radius (show robot), 0 outside (show human)
  float cursorMix = 1.0 - effectAlpha;
  
  // ============================================
  // MODE 2: Full Surface Transformation (badge hover)
  // Entire portrait dissolves from Human → Robot
  // using multi-octave noise threshold.
  // ============================================
  float fn1 = snoise(vUv * 3.0 + uTime * 0.08);
  float fn2 = snoise(vUv * 6.0 - uTime * 0.04) * 0.5;
  float fn3 = snoise(vUv * 12.0 + uTime * 0.12) * 0.25;
  float fullNoise = (fn1 + fn2 + fn3) / 1.75; // approx -1..1
  fullNoise = fullNoise * 0.5 + 0.5;           // normalize to 0..1
  
  // Threshold mapping — corrected direction:
  //   uFullTransform = 0 → threshold = 1.2 → noise(0..1) always below → fullMix = 0 → 100% Human
  //   uFullTransform = 1 → threshold = -0.2 → noise(0..1) always above → fullMix = 1 → 100% Robot
  float threshold = (1.0 - uFullTransform) * 1.4 - 0.2;
  float edge = 0.08; // softness of dissolve boundary
  float fullMix = smoothstep(threshold - edge, threshold + edge, fullNoise);
  
  // ============================================
  // Combine both modes: full transform takes
  // natural priority via max(). When badge is
  // active (fullMix→1), it overrides cursorMix
  // everywhere. When badge is idle (fullMix=0),
  // only cursor reveal matters.
  // ============================================
  float mixAmount = max(cursorMix, fullMix);
  
  vec4 finalColor = mix(humanColor, robotColor, mixAmount);
  
  if (finalColor.a < 0.01) discard;
  
  gl_FragColor = finalColor;
  
  // Convert linear color to sRGB for correct natural skin tones
  #include <colorspace_fragment>
}
`;

// ================================================
// Scene Content
// ================================================
function SceneContent({ hoverProgress, fullTransformProgress, globalMouse, mouseNDC }) {
  const dissolveMaterialRef = useRef();
  const groupRef = useRef();
  const meshRef = useRef();
  const { viewport, camera } = useThree();

  // Create a dedicated raycaster (not from R3F's event system)
  const raycaster = useMemo(() => new THREE.Raycaster(), []);

  const [humanTexture, robotTexture] = useTexture([eyadHumanSrc, eyadRobotSrc]);

  useEffect(() => {
    humanTexture.colorSpace = THREE.SRGBColorSpace;
    robotTexture.colorSpace = THREE.SRGBColorSpace;
    humanTexture.needsUpdate = true;
    robotTexture.needsUpdate = true;
  }, [humanTexture, robotTexture]);

  const aspect = humanTexture.image.width / humanTexture.image.height;

  const [scale, baseY] = useMemo(() => {
    const isPortrait = viewport.width < viewport.height;
    
    // On mobile (portrait), we want the image to be much larger to focus on the face, 
    // because the PNG might have a lot of transparent padding.
    // On desktop (landscape), we keep it nicely contained.
    const maxH = isPortrait ? viewport.height * 0.85 : viewport.height * 0.85; 
    const maxW = isPortrait ? viewport.width * 2.2 : viewport.width * 0.90;

    let targetH = maxH;
    let targetW = targetH * aspect;

    if (targetW > maxW) {
      targetW = maxW;
      targetH = targetW / aspect;
    }

    // Anchor to bottom: bottom of plane (-targetH / 2) touches bottom of viewport (-viewport.height / 2)
    // Subtract viewport.height * 0.02 so the max upward float and parallax (1% + 1%) never reveal a gap
    const yPos = (targetH - viewport.height) / 2 - (viewport.height * 0.02);

    return [[targetW, targetH, 1], yPos];
  }, [aspect, viewport.width, viewport.height]);

  const dissolveUniforms = useMemo(
    () => ({
      uTexture: { value: humanTexture },
      uRobotTexture: { value: robotTexture },
      uHover: { value: 0 },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
      uTime: { value: 0 },
      uAspect: { value: aspect },
      uFullTransform: { value: 0 },
    }),
    [humanTexture, robotTexture, aspect]
  );

  useFrame((state) => {
    if (dissolveMaterialRef.current) {
      dissolveMaterialRef.current.uniforms.uHover.value = hoverProgress.current;
      dissolveMaterialRef.current.uniforms.uFullTransform.value = fullTransformProgress.current;
      dissolveMaterialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
    }

    // Raycast from mouse NDC to get UV on the plane
    if (meshRef.current && dissolveMaterialRef.current && mouseNDC.current) {
      raycaster.setFromCamera(mouseNDC.current, camera);
      const intersects = raycaster.intersectObject(meshRef.current, false);
      if (intersects.length > 0 && intersects[0].uv) {
        dissolveMaterialRef.current.uniforms.uMouse.value.set(
          intersects[0].uv.x,
          intersects[0].uv.y
        );
      }
    }

    if (groupRef.current && globalMouse) {
      // 1. Continuous breathing / floating effect (1% of viewport height)
      const t = state.clock.elapsedTime;
      const floatY = Math.sin(t * 1.5) * (viewport.height * 0.01);

      // 2. Subtle premium mouse-follow parallax on both axes
      const parallaxX = globalMouse.current.x * (viewport.width * 0.010);
      const parallaxY = globalMouse.current.y * (viewport.height * 0.000);

      // Smooth dampening: X follows mouse horizontally, Y follows mouse + float around baseY
      const targetX = parallaxX;
      const targetY = baseY + parallaxY + floatY;
      
      groupRef.current.position.x += (targetX - groupRef.current.position.x) * 0.04;
      groupRef.current.position.y += (targetY - groupRef.current.position.y) * 0.03;
    }
  });

  return (
    <group
      ref={groupRef}
      scale={scale}
      position={[0, baseY, 0]}
    >
      {/* Single Layer: Human and Robot mixed dynamically */}
      <mesh ref={meshRef} position={[0, 0, 0]}>
        <planeGeometry args={[1, 1]} />
        <shaderMaterial
          ref={dissolveMaterialRef}
          vertexShader={dissolveVertexShader}
          fragmentShader={dissolveFragmentShader}
          uniforms={dissolveUniforms}
          transparent={true}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}

// ================================================
// Main Component
// ================================================
export default function ThreeDissolveHero({ isInteractive = true, isRobotActive = false }) {
  const hoverProgress = useRef(0);           // Cursor reveal mode (0..1)
  const fullTransformProgress = useRef(0);    // Full surface dissolve mode (0..1)
  const hoverTweenRef = useRef(null);
  const fullTransformTweenRef = useRef(null);
  const containerRef = useRef(null);
  
  // Track hover states
  const isHeroHoveredRef = useRef(false);
  const isRobotActiveRef = useRef(false);     // Synced ref for use inside event handlers

  // --- Cursor Reveal: Hero Canvas Hover ---
  const handleHeroHoverEnter = useCallback(() => {
    if (isRobotActiveRef.current) return; // Badge has priority — suppress cursor reveal
    if (hoverTweenRef.current) hoverTweenRef.current.kill();
    hoverTweenRef.current = gsap.to(hoverProgress, {
      current: 1,
      duration: 0.8,
      ease: "power2.out",
    });
  }, []);

  const handleHeroHoverLeave = useCallback(() => {
    if (hoverTweenRef.current) hoverTweenRef.current.kill();
    hoverTweenRef.current = gsap.to(hoverProgress, {
      current: 0,
      duration: 0.8,
      ease: "power2.inOut",
    });
  }, []);

  // --- Full Transformation: Developer Badge Hover ---
  useEffect(() => {
    isRobotActiveRef.current = isRobotActive;
    
    if (isRobotActive) {
      // 1. Kill cursor reveal — badge takes full priority
      if (hoverTweenRef.current) hoverTweenRef.current.kill();
      hoverTweenRef.current = gsap.to(hoverProgress, {
        current: 0,
        duration: 0.3,
        ease: "power2.inOut",
      });
      
      // 2. Animate full surface transformation: Human → Robot
      if (fullTransformTweenRef.current) fullTransformTweenRef.current.kill();
      fullTransformTweenRef.current = gsap.to(fullTransformProgress, {
        current: 1,
        duration: 1.0,
        ease: "power2.out",
      });
    } else {
      // Reverse full surface transformation: Robot → Human
      if (fullTransformTweenRef.current) fullTransformTweenRef.current.kill();
      fullTransformTweenRef.current = gsap.to(fullTransformProgress, {
        current: 0,
        duration: 1.0,
        ease: "power2.inOut",
      });
      
      // Re-enable cursor reveal if mouse is still over the hero canvas
      if (isHeroHoveredRef.current && isInteractive) {
        handleHeroHoverEnter();
      }
    }
  }, [isRobotActive, isInteractive, handleHeroHoverEnter]);

  // When interactivity is disabled (scrolled past hero), smoothly reverse everything
  useEffect(() => {
    if (!isInteractive) {
      isHeroHoveredRef.current = false;
      handleHeroHoverLeave();
    }
  }, [isInteractive, handleHeroHoverLeave]);
  
  // Track global mouse position for parallax (-1 to +1)
  const globalMouse = useRef(new THREE.Vector2(0, 0));
  
  // Track mouse in NDC space (-1 to +1) for raycasting, relative to canvas
  const mouseNDC = useRef(new THREE.Vector2(0, 0));

  useEffect(() => {
    // Listen on WINDOW so pointer-events:none on parents doesn't matter
    const handleMouseMove = (e) => {
      // Update global parallax
      globalMouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      globalMouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1;

      const container = containerRef.current;
      if (!container) return;

      const rect = container.getBoundingClientRect();
      const isInside =
        e.clientX >= rect.left &&
        e.clientX <= rect.right &&
        e.clientY >= rect.top &&
        e.clientY <= rect.bottom;

      // Convert screen position to NDC for the canvas (-1 to +1)
      const ndcX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const ndcY = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      mouseNDC.current.set(ndcX, ndcY);

      if (isInside && isInteractive) {
        if (!isHeroHoveredRef.current) {
          isHeroHoveredRef.current = true;
          if (!isRobotActiveRef.current) {
            handleHeroHoverEnter();
          }
        }
      } else {
        if (isHeroHoveredRef.current) {
          isHeroHoveredRef.current = false;
          handleHeroHoverLeave();
        }
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [isInteractive, handleHeroHoverEnter, handleHeroHoverLeave]);

  useEffect(() => {
    return () => {
      if (hoverTweenRef.current) hoverTweenRef.current.kill();
      if (fullTransformTweenRef.current) fullTransformTweenRef.current.kill();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        width: "100%",
        height: "100%",
      }}
    >
      <Canvas
        // removed outputColorSpace and toneMapping to preserve natural skin colors
        gl={{ alpha: true, antialias: true }}
        dpr={[1, 2]}
        orthographic
        camera={{ zoom: 1, position: [0, 0, 5], near: 0.1, far: 100 }}
        style={{ background: "transparent" }}
      >
        <SceneContent
          hoverProgress={hoverProgress}
          fullTransformProgress={fullTransformProgress}
          globalMouse={globalMouse}
          mouseNDC={mouseNDC}
        />
      </Canvas>
    </div>
  );
}
