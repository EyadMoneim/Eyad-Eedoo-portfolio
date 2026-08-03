import { useRef, useMemo, useCallback, useEffect } from "react";
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

// Function to draw a perfect rounded capsule (pill shape) scratch with blur
float drawScratch(vec2 uv, vec2 center, float angle, float halfLen, float radius, float blur) {
    vec2 p = uv - center;
    float s = sin(angle);
    float c = cos(angle);
    vec2 rp = vec2(p.x * c - p.y * s, p.x * s + p.y * c);
    
    // Distance field for a line segment
    float dX = abs(rp.x) - halfLen;
    float dist = length(vec2(max(dX, 0.0), abs(rp.y)));
    
    // Smoothstep for blurred edge
    return smoothstep(radius + blur, max(0.0, radius - blur), dist);
}

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
  
  // Phase 8: Shader Enhancement - Improve existing idle pulse
  // Pulses between 0.0 and 0.025 radius to hint at the hidden layer (slightly increased visibility)
  float idlePulse = (sin(uTime * 2.5) * 0.5 + 0.5) * 0.025;
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
  // MODE 3: Auto Shoulder Reveal
  // Shoulders automatically pulse the robot texture
  // ============================================
  vec2 aspectShoulder1 = vec2(0.25 * uAspect, 0.15);
  vec2 aspectShoulder2 = vec2(0.75 * uAspect, 0.15);
  
  float distS1 = distance(aspectUv, aspectShoulder1);
  float distS2 = distance(aspectUv, aspectShoulder2);
  
  // Smooth breathing pulse for the shoulders
  float sPulse1 = (sin(uTime * 1.5) * 0.5 + 0.5);
  float sPulse2 = (sin(uTime * 1.5 + 3.1415) * 0.5 + 0.5); // Alternating
  
  // Make it medium strength
  float shoulderMaxRadius = 0.16; // slightly larger radius
  float currentShoulderRad1 = shoulderMaxRadius * sPulse1;
  float currentShoulderRad2 = shoulderMaxRadius * sPulse2;
  
  // Moderate noise influence for a bit more cohesion
  float noisyBoundaryS1 = currentShoulderRad1 + (cursorNoise - 0.5) * 0.2;
  float noisyBoundaryS2 = currentShoulderRad2 + (cursorNoise - 0.5) * 0.2;
  
  // Medium soft edges
  float shoulderMix1 = 1.0 - smoothstep(noisyBoundaryS1 - 0.12, noisyBoundaryS1 + 0.08, distS1);
  float shoulderMix2 = 1.0 - smoothstep(noisyBoundaryS2 - 0.12, noisyBoundaryS2 + 0.08, distS2);
  
  // Cap the maximum intensity higher (80%) so it's more visible
  float autoShoulderMix = max(shoulderMix1, shoulderMix2) * 0.8;

  // ============================================
  // Combine all modes: full transform takes
  // natural priority via max(). When badge is
  // active (fullMix→1), it overrides everything.
  // ============================================
  float mixAmount = max(cursorMix, fullMix);
  mixAmount = max(mixAmount, autoShoulderMix);
  
  // ============================================
  // Permanent Cyber Scratches (Explicit Rounded Geometry)
  // ============================================
  // using drawScratch(uv, center, angle, halfLen, radius)
  
  // 1. Neck
  float breath1 = (sin(uTime * 1.5 + 0.0) * 0.5 + 0.5) * 0.85 + 0.15;
  vec2 off1 = vec2(sin(uTime * 0.4 + 0.0), cos(uTime * 0.5 + 1.0)) * 0.015;
  float mask1 = drawScratch(vUv, vec2(0.5, 0.36) + off1, 0.5, 0.16, 0.012, 0.020) * breath1;

  // 2. Face (Viewer Right Cheek)
  float breath2 = (sin(uTime * 1.5 + 2.0) * 0.5 + 0.5) * 0.85 + 0.15;
  vec2 off2 = vec2(cos(uTime * 0.6 + 2.0), sin(uTime * 0.3 + 3.0)) * 0.015;
  float mask2 = drawScratch(vUv, vec2(0.62, 0.52) + off2, -0.4, 0.14, 0.010, 0.018) * breath2;

  // 3. Right Shoulder (Viewer Left)
  float breath3 = (sin(uTime * 1.5 + 4.0) * 0.5 + 0.5) * 0.85 + 0.15;
  vec2 off3 = vec2(sin(uTime * 0.5 + 4.0), cos(uTime * 0.4 + 5.0)) * 0.015;
  float mask3 = drawScratch(vUv, vec2(0.28, 0.20) + off3, 0.8, 0.18, 0.015, 0.022) * breath3;

  // 4. Left Shoulder (Viewer Right)
  float breath4 = (sin(uTime * 1.5 + 1.0) * 0.5 + 0.5) * 0.85 + 0.15;
  vec2 off4 = vec2(cos(uTime * 0.4 + 6.0), sin(uTime * 0.7 + 7.0)) * 0.015;
  float mask4 = drawScratch(vUv, vec2(0.72, 0.22) + off4, -0.7, 0.18, 0.014, 0.020) * breath4;

  // Combine the prominent rounded slashes
  float staticScratches = max(mask1, max(mask2, max(mask3, mask4)));
  
  // Make the scratch 100% opaque robot texture where the mask is active
  mixAmount = max(mixAmount, staticScratches);
  
  vec4 finalColor = mix(humanColor, robotColor, mixAmount);
  
  if (finalColor.a < 0.01) discard;
  
  gl_FragColor = finalColor;
  
  // Convert linear color to sRGB for correct natural skin tones
  #include <colorspace_fragment>
}
`;

// ================================================
// HUD Halo Component (Phase 3)
// ================================================
const hudVertexShader = /* glsl */ `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const hudFragmentShader = /* glsl */ `
uniform float uTime;
uniform float uOpacity;
varying vec2 vUv;

// Function to draw a perfect rounded capsule (pill shape) scratch
float drawScratch(vec2 uv, vec2 center, float angle, float halfLen, float radius) {
    vec2 p = uv - center;
    float s = sin(angle);
    float c = cos(angle);
    vec2 rp = vec2(p.x * c - p.y * s, p.x * s + p.y * c);
    
    // Distance field for a line segment
    float dX = abs(rp.x) - halfLen;
    float dist = length(vec2(max(dX, 0.0), abs(rp.y)));
    
    // Smoothstep for anti-aliasing (sharp but smooth edge)
    return smoothstep(radius + 0.003, radius - 0.001, dist);
}

void main() {
  vec2 centered = vUv - 0.5;
  float dist = length(centered);
  
  // Create a futuristic wireframe/HUD scan ring
  // Multiple thin rings and dashed segments
  float ring1 = smoothstep(0.48, 0.49, dist) - smoothstep(0.49, 0.5, dist);
  float ring2 = smoothstep(0.42, 0.425, dist) - smoothstep(0.425, 0.43, dist);
  
  // Dashed effect based on angle
  float angle = atan(centered.y, centered.x);
  float dashes = sin(angle * 40.0 + uTime * 2.0);
  float dashedRing = ring1 * step(0.0, dashes);
  
  // Inner scanning circle
  float scan = (sin(dist * 50.0 - uTime * 4.0) * 0.5 + 0.5) * 0.2;
  float innerFill = smoothstep(0.4, 0.38, dist) * scan;
  
  float alpha = (dashedRing + ring2 * 0.5 + innerFill) * uOpacity;
  if (alpha < 0.01) discard;
  
  // Use a dark, premium color (dark green from theme) since background is off-white
  gl_FragColor = vec4(vec3(0.176, 0.192, 0.149), alpha);
}
`;

function HudHalo({ targetX, targetY, targetScale, targetOpacity, baseScale }) {
  const meshRef = useRef();
  const materialRef = useRef();
  
  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uOpacity: { value: 0.15 } // base opacity
  }), []);

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
      // Smoothly interpolate opacity
      materialRef.current.uniforms.uOpacity.value += (targetOpacity - materialRef.current.uniforms.uOpacity.value) * 0.05;
    }
    if (meshRef.current) {
      // Smoothly interpolate position and scale (Phase 4 layered movement)
      meshRef.current.position.x += (targetX - meshRef.current.position.x) * 0.04;
      meshRef.current.position.y += (targetY - meshRef.current.position.y) * 0.04;
      meshRef.current.scale.x += (targetScale * baseScale - meshRef.current.scale.x) * 0.05;
      meshRef.current.scale.y += (targetScale * baseScale - meshRef.current.scale.y) * 0.05;
    }
  });

  return (
    <mesh ref={meshRef} position={[0, 0, -0.2]}>
      <planeGeometry args={[1, 1]} />
      <shaderMaterial 
        ref={materialRef}
        vertexShader={hudVertexShader}
        fragmentShader={hudFragmentShader}
        uniforms={uniforms}
        transparent={true}
        depthWrite={false}
      />
    </mesh>
  );
}

// ================================================
// Rim Light Component (Phase 7)
// ================================================
const rimFragmentShader = /* glsl */ `
varying vec2 vUv;
void main() {
  vec2 centered = vUv - 0.5;
  float dist = length(centered);
  // Soft radial gradient - increased opacity so it can slightly brighten the #fcfcfa background
  float alpha = smoothstep(0.5, 0.0, dist) * 0.3; 
  if (alpha < 0.01) discard;
  gl_FragColor = vec4(1.0, 1.0, 1.0, alpha);
}
`;

function RimLight({ targetX, targetY, baseScale }) {
  const meshRef = useRef();
  
  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.position.x += (targetX - meshRef.current.position.x) * 0.035;
      meshRef.current.position.y += (targetY - meshRef.current.position.y) * 0.035;
    }
  });

  return (
    <mesh ref={meshRef} position={[0, 0, -0.1]} scale={baseScale * 1.2}>
      <planeGeometry args={[1, 1]} />
      <shaderMaterial 
        vertexShader={hudVertexShader} // reuse vertex shader
        fragmentShader={rimFragmentShader}
        transparent={true}
        depthWrite={false}
      />
    </mesh>
  );
}

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

  const [rawHumanTexture, rawRobotTexture] = useTexture([eyadHumanSrc, eyadRobotSrc]);

  const humanTexture = useMemo(() => {
    const texture = rawHumanTexture.clone();
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.needsUpdate = true;
    return texture;
  }, [rawHumanTexture]);

  const robotTexture = useMemo(() => {
    const texture = rawRobotTexture.clone();
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.needsUpdate = true;
    return texture;
  }, [rawRobotTexture]);

  useEffect(() => {
    return () => {
      humanTexture.dispose();
      robotTexture.dispose();
    };
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
      // Phase 1: Hero Idle State (Float & Rotation)
      // Amplitude: 5-7px, Duration: 7-9s (freq ~0.785)
      const t = state.clock.elapsedTime;
      const floatFreq = 0.785; // 8 seconds
      const floatY = Math.sin(t * floatFreq) * (viewport.height * 0.015); // Increased to 1.5% for perceptibility
      const floatRot = Math.sin(t * floatFreq * 0.8) * 0.006; // max ~0.35 degrees

      // Phase 4: Hero Parallax layered movement
      // Portrait moves ~5px
      const px5 = viewport.height * 0.005;
      const parallaxX = globalMouse.current.x * px5;
      const parallaxY = globalMouse.current.y * px5;

      const targetX = parallaxX;
      const targetY = baseY + parallaxY + floatY;
      
      groupRef.current.position.x += (targetX - groupRef.current.position.x) * 0.04;
      groupRef.current.position.y += (targetY - groupRef.current.position.y) * 0.03;
      groupRef.current.rotation.z += (floatRot - groupRef.current.rotation.z) * 0.05;
    }
  });

  // Calculate parameters for background layers
  // HUD moves 8px, which is 1.6x the portrait movement
  const px8 = viewport.height * 0.008;
  const hudTargetX = globalMouse.current.x * px8;
  const hudTargetY = baseY + (globalMouse.current.y * px8) + (Math.sin(0 * 0.785) * viewport.height * 0.007); // Approximation for hud Y
  
  // Head offset (HUD sits behind head)
  const headOffsetY = scale[1] * 0.25; 
  
  // Hover interpolations for HUD (15% idle, 35% hover)
  const hudScale = 1.0 + (hoverProgress.current * 0.06);
  const hudOpacity = 0.15 + (hoverProgress.current * 0.20);

  return (
    <>
      {/* Background Layers */}
      <RimLight 
        targetX={hudTargetX} 
        targetY={hudTargetY + headOffsetY} 
        baseScale={scale[0]} 
      />
      <HudHalo 
        targetX={hudTargetX} 
        targetY={hudTargetY + headOffsetY} 
        targetScale={hudScale}
        targetOpacity={hudOpacity}
        baseScale={scale[0] * 0.60}
      />

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
    </>
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
    });
  }, []);

  const handleHeroHoverLeave = useCallback(() => {
    if (hoverTweenRef.current) hoverTweenRef.current.kill();
    hoverTweenRef.current = gsap.to(hoverProgress, {
      current: 0,
      duration: 0.8,
    });
  }, []);

  // Phase 2: Interactive Discovery Teaser
  const hasTeased = useRef(false);
  useEffect(() => {
    if (isInteractive && !hasTeased.current) {
      const teaserDelay = setTimeout(() => {
        hasTeased.current = true; // Set here to bypass StrictMode double-mount issues
        
        // Only tease if user hasn't hovered or interacted yet
        if (isRobotActiveRef.current || isHeroHoveredRef.current) return;
        
        if (hoverTweenRef.current) hoverTweenRef.current.kill();
        
        // Human -> Robot -> Human (subtle opacity)
        const tl = gsap.timeline();
        hoverTweenRef.current = tl;
        
        tl.to(hoverProgress, {
          current: 0.45, // slightly more visible
          duration: 0.4,
          ease: "power2.out"
        }).to(hoverProgress, {
          current: 0,
          duration: 0.4,
          ease: "power2.in"
        });
        
      }, 1800);
      
      return () => clearTimeout(teaserDelay);
    }
  }, [isInteractive]);

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
