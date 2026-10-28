import * as THREE from "three";

export const ORBITAL_SPHERE_DEFAULTS = { speed: 1, particleSize: 0.015, particleOpacity: 0.8, orbitOpacity: 0.25, scale: 1, haloOpacity: 0.2, hue: 0, positionX: 0, positionY: 0, positionZ: -2 };

export function createOrbitalSphereRenderer(canvas, getOptions) {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  const networkGroup = new THREE.Group();
  scene.add(networkGroup);

  const radius = 2.2, particleCount = 15000;
  const positions = new Float32Array(particleCount * 3), colors = new Float32Array(particleCount * 3);
  const colorBright = new THREE.Color(0xa78bfa), colorDim = new THREE.Color(0x701a75);
  let validIndex = 0;

  for (let index = 0; index < particleCount; index += 1) {
    const phi = Math.acos(-1 + (2 * index) / particleCount), theta = Math.sqrt(particleCount * Math.PI) * phi;
    const x = radius * Math.cos(theta) * Math.sin(phi), y = radius * Math.sin(theta) * Math.sin(phi), z = radius * Math.cos(phi);
    const noise = Math.sin(x * 3.5) * Math.cos(y * 3.5) * Math.sin(z * 3.5) + Math.cos(x * 6) * 0.4;
    if (noise <= -0.1) continue;
    const distortion = 1 + noise * 0.1;
    positions[validIndex * 3] = x * distortion;
    positions[validIndex * 3 + 1] = y * distortion;
    positions[validIndex * 3 + 2] = z * distortion;
    const mixedColor = colorDim.clone().lerp(colorBright, noise > 0.5 ? 1 : 0.3);
    colors[validIndex * 3] = mixedColor.r;
    colors[validIndex * 3 + 1] = mixedColor.g;
    colors[validIndex * 3 + 2] = mixedColor.b;
    validIndex += 1;
  }

  const particleGeometry = new THREE.BufferGeometry();
  particleGeometry.setAttribute("position", new THREE.BufferAttribute(positions.slice(0, validIndex * 3), 3));
  particleGeometry.setAttribute("color", new THREE.BufferAttribute(colors.slice(0, validIndex * 3), 3));
  const particleMaterial = new THREE.PointsMaterial({ size: 0.015, vertexColors: true, transparent: true, opacity: 0.8, blending: THREE.AdditiveBlending, depthWrite: false });
  networkGroup.add(new THREE.Points(particleGeometry, particleMaterial));

  const orbitMaterial = new THREE.LineBasicMaterial({ color: 0x8b5cf6, transparent: true, opacity: 0.25, blending: THREE.AdditiveBlending });
  const orbitGeometries = [], nodeGeometries = [], nodeMaterials = [], haloMaterials = [];
  let responsiveScale = 1;
  let viewportHeight = 1;

  for (let index = 0; index < 6; index += 1) {
    const geometry = new THREE.BufferGeometry(), points = [], orbitRadius = radius * (1.08 + Math.random() * 0.2);
    for (let point = 0; point <= 90; point += 1) {
      const angle = (point / 90) * Math.PI * 2;
      points.push(Math.cos(angle) * orbitRadius, Math.sin(angle) * orbitRadius, Math.sin(angle * 4) * 0.1);
    }
    geometry.setAttribute("position", new THREE.Float32BufferAttribute(points, 3));
    orbitGeometries.push(geometry);

    const line = new THREE.Line(geometry, orbitMaterial);
    line.rotation.x = Math.random() * Math.PI * 2;
    line.rotation.y = Math.random() * Math.PI * 2;
    networkGroup.add(line);

    if (index % 2 !== 0) {
      const nodeGeometry = new THREE.SphereGeometry(0.025, 16, 16), nodeMaterial = new THREE.MeshBasicMaterial({ color: 0xd946ef }), node = new THREE.Mesh(nodeGeometry, nodeMaterial);
      const angle = Math.random() * Math.PI * 2;
      node.position.set(Math.cos(angle) * orbitRadius, Math.sin(angle) * orbitRadius, 0);
      line.add(node);

      const haloGeometry = new THREE.SphereGeometry(0.08, 16, 16), haloMaterial = new THREE.MeshBasicMaterial({ color: 0xc084fc, transparent: true, opacity: 0.2, blending: THREE.AdditiveBlending }), halo = new THREE.Mesh(haloGeometry, haloMaterial);
      node.add(halo);

      nodeGeometries.push(nodeGeometry, haloGeometry);
      nodeMaterials.push(nodeMaterial, haloMaterial);
      haloMaterials.push(haloMaterial);
    }
  }

  // ---------------------------------------------------------------------------
  // Two Outer Concentric Orbits with Vertices (as seen above/around main orbit)
  // ---------------------------------------------------------------------------
  const outerOrbitsGroup = new THREE.Group();
  scene.add(outerOrbitsGroup);

  const outerOrbitMaterials = [];
  const outerHaloMaterials = [];
  const outerOrbitGeometries = [];
  const outerNodeGeometries = [];
  const outerNodeMaterials = [];

  // Helper to build a smooth circular orbit line
  const createOrbitCircle = (orbitR, segments, colorHex, opacityMultiplier) => {
    const pts = [];
    for (let i = 0; i <= segments; i += 1) {
      const a = (i / segments) * Math.PI * 2;
      pts.push(new THREE.Vector3(Math.cos(a) * orbitR, Math.sin(a) * orbitR, 0));
    }
    const geom = new THREE.BufferGeometry().setFromPoints(pts);
    const mat = new THREE.LineBasicMaterial({
      color: colorHex,
      transparent: true,
      opacity: 0.25 * opacityMultiplier,
      blending: THREE.AdditiveBlending,
    });
    mat.userData = { opacityMultiplier };
    const lineMesh = new THREE.Line(geom, mat);
    outerOrbitGeometries.push(geom);
    outerOrbitMaterials.push(mat);
    return { lineMesh, mat };
  };

  // Helper to create a glowing vertex node on an outer orbit
  let targetRingMesh = null;
  const createVertexNode = (orbitR, angleRad, options = {}) => {
    const {
      coreRadius = 0.032,
      haloRadius = 0.085,
      coreColor = 0xf5f3ff,
      haloColor = 0xc084fc,
      haloOpacityMul = 1.4,
      hasTargetRing = false,
    } = options;

    const nodeGroup = new THREE.Group();
    const x = Math.cos(angleRad) * orbitR;
    const y = Math.sin(angleRad) * orbitR;
    nodeGroup.position.set(x, y, 0);

    // Core bright node
    const coreGeo = new THREE.SphereGeometry(coreRadius, 16, 16);
    const coreMat = new THREE.MeshBasicMaterial({ color: coreColor });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    nodeGroup.add(coreMesh);

    // Glowing halo
    const haloGeo = new THREE.SphereGeometry(haloRadius, 16, 16);
    const haloMat = new THREE.MeshBasicMaterial({
      color: haloColor,
      transparent: true,
      opacity: 0.25 * haloOpacityMul,
      blending: THREE.AdditiveBlending,
    });
    haloMat.userData = { baseMul: haloOpacityMul };
    const haloMesh = new THREE.Mesh(haloGeo, haloMat);
    nodeGroup.add(haloMesh);

    outerNodeGeometries.push(coreGeo, haloGeo);
    outerNodeMaterials.push(coreMat, haloMat);
    outerHaloMaterials.push(haloMat);

    // Distinctive target ring (like in the reference photo top-left vertex)
    if (hasTargetRing) {
      const ringPts = [];
      const ringSegments = 40;
      const ringR = 0.115;
      for (let j = 0; j <= ringSegments; j += 1) {
        const ra = (j / ringSegments) * Math.PI * 2;
        ringPts.push(new THREE.Vector3(Math.cos(ra) * ringR, Math.sin(ra) * ringR, 0));
      }
      const ringGeo = new THREE.BufferGeometry().setFromPoints(ringPts);
      const ringMat = new THREE.LineBasicMaterial({
        color: 0xe9d5ff,
        transparent: true,
        opacity: 0.85,
        blending: THREE.AdditiveBlending,
      });
      targetRingMesh = new THREE.Line(ringGeo, ringMat);
      nodeGroup.add(targetRingMesh);
      outerOrbitGeometries.push(ringGeo);
      outerOrbitMaterials.push(ringMat);
    }

    return nodeGroup;
  };

  const outerOrbitNodes = [];

  // Outer Orbit 1 (Mid outer orbit, radius ~1.46x of sphere)
  const orbit1Radius = radius * 1.46;
  const { lineMesh: orbit1Line } = createOrbitCircle(orbit1Radius, 144, 0xa78bfa, 1.4);
  outerOrbitsGroup.add(orbit1Line);

  // Vertices on Orbit 1:
  // 1. Top-left vertex with target ring (~135° / 10:30 o'clock)
  const node1_1 = createVertexNode(orbit1Radius, (135 * Math.PI) / 180, {
    coreRadius: 0.040,
    haloRadius: 0.11,
    coreColor: 0xffffff,
    haloColor: 0xc084fc,
    haloOpacityMul: 1.8,
    hasTargetRing: true,
  });
  outerOrbitsGroup.add(node1_1);
  outerOrbitNodes.push({ group: node1_1, radius: orbit1Radius, angle: (135 * Math.PI) / 180, speed: 0.0005 });

  // 2. Top-right vertex (~55° / 1:00 o'clock)
  const node1_2 = createVertexNode(orbit1Radius, (55 * Math.PI) / 180, {
    coreRadius: 0.034,
    haloRadius: 0.09,
    coreColor: 0xffffff,
    haloColor: 0xa855f7,
    haloOpacityMul: 1.4,
  });
  outerOrbitsGroup.add(node1_2);
  outerOrbitNodes.push({ group: node1_2, radius: orbit1Radius, angle: (55 * Math.PI) / 180, speed: 0.0005 });

  // 3. Bottom vertex (~270° / 6:00 o'clock)
  const node1_3 = createVertexNode(orbit1Radius, (270 * Math.PI) / 180, {
    coreRadius: 0.030,
    haloRadius: 0.08,
    coreColor: 0xf5f3ff,
    haloColor: 0xa855f7,
    haloOpacityMul: 1.25,
  });
  outerOrbitsGroup.add(node1_3);
  outerOrbitNodes.push({ group: node1_3, radius: orbit1Radius, angle: (270 * Math.PI) / 180, speed: 0.0005 });

  // Outer Orbit 2 (Outermost orbit, radius ~1.92x of sphere)
  const orbit2Radius = radius * 1.92;
  const { lineMesh: orbit2Line } = createOrbitCircle(orbit2Radius, 180, 0x8b5cf6, 1.1);
  outerOrbitsGroup.add(orbit2Line);

  // Vertices on Orbit 2:
  // 1. Top vertex (~105° / 11:30 o'clock)
  const node2_1 = createVertexNode(orbit2Radius, (105 * Math.PI) / 180, {
    coreRadius: 0.036,
    haloRadius: 0.095,
    coreColor: 0xffffff,
    haloColor: 0xc084fc,
    haloOpacityMul: 1.6,
  });
  outerOrbitsGroup.add(node2_1);
  outerOrbitNodes.push({ group: node2_1, radius: orbit2Radius, angle: (105 * Math.PI) / 180, speed: -0.00035 });

  // 2. Bottom-right vertex (~315° / 5:00 o'clock)
  const node2_2 = createVertexNode(orbit2Radius, (315 * Math.PI) / 180, {
    coreRadius: 0.032,
    haloRadius: 0.085,
    coreColor: 0xf5f3ff,
    haloColor: 0xa855f7,
    haloOpacityMul: 1.35,
  });
  outerOrbitsGroup.add(node2_2);
  outerOrbitNodes.push({ group: node2_2, radius: orbit2Radius, angle: (315 * Math.PI) / 180, speed: -0.00035 });

  // 3. Bottom-left vertex (~205° / 7:30 o'clock)
  const node2_3 = createVertexNode(orbit2Radius, (205 * Math.PI) / 180, {
    coreRadius: 0.028,
    haloRadius: 0.075,
    coreColor: 0xede9fe,
    haloColor: 0xa855f7,
    haloOpacityMul: 1.15,
  });
  outerOrbitsGroup.add(node2_3);
  outerOrbitNodes.push({ group: node2_3, radius: orbit2Radius, angle: (205 * Math.PI) / 180, speed: -0.00035 });

  // Interaction Logic (Drag to Spin)
  let isDragging = false;
  let previousMousePosition = { x: 0, y: 0 };
  let targetRotation = { x: 0, y: 0 };
  let currentRotation = { x: 0, y: 0 };
  let velocity = { x: 0, y: 0 };

  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();

  // Invisible bounding sphere matching the orbit bounds to detect interaction only on the orbit itself
  const boundingSphereGeometry = new THREE.SphereGeometry(4.25, 24, 24);
  const boundingSphereMaterial = new THREE.MeshBasicMaterial({ visible: false });
  const boundingSphere = new THREE.Mesh(boundingSphereGeometry, boundingSphereMaterial);
  networkGroup.add(boundingSphere);

  canvas.style.cursor = 'default';

  const checkIntersection = (e) => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObject(boundingSphere);
    return intersects.length > 0;
  };

  const handlePointerDown = (e) => {
    // Only drag if clicking on the orbit itself
    if (!checkIntersection(e)) return;
    isDragging = true;
    previousMousePosition = { x: e.clientX, y: e.clientY };
    canvas.style.cursor = 'grabbing';
    try {
      canvas.setPointerCapture(e.pointerId);
    } catch (_) { }
  };

  const handlePointerMove = (e) => {
    if (isDragging) {
      const deltaMove = {
        x: e.clientX - previousMousePosition.x,
        y: e.clientY - previousMousePosition.y
      };

      // Increase velocity based on mouse movement
      velocity.x = deltaMove.x * 0.005;
      velocity.y = deltaMove.y * 0.005;

      previousMousePosition = { x: e.clientX, y: e.clientY };
    } else {
      // Dynamic cursor: grab when hovering over the orbit, default outside
      if (checkIntersection(e)) {
        canvas.style.cursor = 'grab';
      } else {
        canvas.style.cursor = 'default';
      }
    }
  };

  const handlePointerUp = (e) => {
    if (isDragging) {
      isDragging = false;
      try {
        if (canvas.hasPointerCapture(e.pointerId)) {
          canvas.releasePointerCapture(e.pointerId);
        }
      } catch (_) { }
      canvas.style.cursor = checkIntersection(e) ? 'grab' : 'default';
    }
  };

  const handlePointerLeave = () => {
    if (!isDragging) {
      canvas.style.cursor = 'default';
    }
  };

  canvas.addEventListener('pointerdown', handlePointerDown);
  canvas.addEventListener('pointermove', handlePointerMove);
  canvas.addEventListener('pointerup', handlePointerUp);
  canvas.addEventListener('pointercancel', handlePointerUp);
  canvas.addEventListener('pointerleave', handlePointerLeave);
  canvas.style.touchAction = 'none'; // Prevent scrolling on mobile while dragging

  return {
    resize(width, height) {
      viewportHeight = Math.max(1, height);
      camera.aspect = width / Math.max(1, height);
      camera.updateProjectionMatrix();
      renderer.setSize(width, height, false);
      const options = getOptions();
      const posX = options.positionX !== undefined ? options.positionX : 0;
      const posY = options.positionY !== undefined ? options.positionY : 0;
      const posZ = options.positionZ !== undefined ? options.positionZ : -2;
      networkGroup.position.set(posX, posY, posZ);
      outerOrbitsGroup.position.set(posX, posY, posZ);

      if (width >= 1024) {
        responsiveScale = 0.85;
        // Leave enough camera headroom for the outermost rings at their full
        // scroll-grown scale so they don't clip at the top of the WebGL canvas.
        camera.position.z = 7.5;
      }
      else {
        responsiveScale = 0.75;
        camera.position.z = 7.5;
      }
      networkGroup.scale.setScalar(responsiveScale * options.scale);
      outerOrbitsGroup.scale.setScalar(responsiveScale * options.scale);
    },
    render(transform = {}) {
      const options = getOptions();
      particleMaterial.size = options.particleSize;
      particleMaterial.opacity = options.particleOpacity;
      orbitMaterial.opacity = options.orbitOpacity;
      haloMaterials.forEach((material) => material.opacity = options.haloOpacity);
      const posX = options.positionX ?? 0;
      const posY = options.positionY ?? 0;
      const posZ = options.positionZ ?? -2;
      const viewHeight = 2 * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * (camera.position.z - posZ);
      const pixelsToWorld = viewHeight / viewportHeight;
      const groupX = posX + (transform.x ?? 0) * pixelsToWorld;
      const groupY = posY - (transform.y ?? 0) * pixelsToWorld;
      const groupScale = responsiveScale * options.scale * (transform.scale ?? 1);

      // Move the scene inside its fixed canvas. Translating the canvas itself
      // clips the top of the orbits before the viewport fade can soften them.
      networkGroup.position.set(groupX, groupY, posZ);
      outerOrbitsGroup.position.set(groupX, groupY, posZ);
      networkGroup.scale.setScalar(groupScale);
      outerOrbitsGroup.scale.setScalar(groupScale);

      // Outer orbit opacities & subtle halo pulse
      outerOrbitMaterials.forEach((mat) => {
        const mul = mat.userData?.opacityMultiplier ?? 1;
        mat.opacity = Math.min(0.85, options.orbitOpacity * mul * 1.5);
      });
      const haloPulse = 1 + Math.sin(Date.now() * 0.0025) * 0.15;
      outerHaloMaterials.forEach((mat) => {
        const mul = mat.userData?.baseMul ?? 1;
        mat.opacity = Math.min(0.9, options.haloOpacity * mul * haloPulse * 2.2);
      });

      // Outer orbit lines remain completely static; the dots move smoothly along their lines
      outerOrbitNodes.forEach((nodeItem) => {
        nodeItem.angle += nodeItem.speed * options.speed;
        nodeItem.group.position.x = Math.cos(nodeItem.angle) * nodeItem.radius;
        nodeItem.group.position.y = Math.sin(nodeItem.angle) * nodeItem.radius;
      });

      // Target ring spins on its center as it travels with its node
      if (targetRingMesh) {
        targetRingMesh.rotation.z += 0.006 * options.speed;
      }
      // Auto rotation + Interactive velocity
      if (!isDragging) {
        // Apply friction
        velocity.x *= 0.95;
        velocity.y *= 0.95;

        // Base auto rotation when not interacting
        if (Math.abs(velocity.x) < 0.001) velocity.x += 0.0008 * options.speed * 0.05;
        if (Math.abs(velocity.y) < 0.001) velocity.y += 0.0003 * options.speed * 0.05;
      }

      // Add velocity to target rotation
      targetRotation.x -= velocity.y;
      targetRotation.y -= velocity.x;

      // Smooth interpolation
      currentRotation.x += (targetRotation.x - currentRotation.x) * 0.1;
      currentRotation.y += (targetRotation.y - currentRotation.y) * 0.1;

      networkGroup.rotation.x = currentRotation.x;
      networkGroup.rotation.y = currentRotation.y;

      networkGroup.children.forEach((child, index) => {
        if (child.type === "Line") child.rotation.z += 0.0004 * options.speed * (index % 2 === 0 ? 1 : -1);
      });

      renderer.render(scene, camera);
    },
    dispose() {
      canvas.removeEventListener('pointerdown', handlePointerDown);
      canvas.removeEventListener('pointermove', handlePointerMove);
      canvas.removeEventListener('pointerup', handlePointerUp);
      canvas.removeEventListener('pointercancel', handlePointerUp);
      canvas.removeEventListener('pointerleave', handlePointerLeave);

      boundingSphereGeometry.dispose();
      boundingSphereMaterial.dispose();
      particleGeometry.dispose();
      particleMaterial.dispose();
      orbitMaterial.dispose();
      orbitGeometries.forEach((item) => item.dispose());
      nodeGeometries.forEach((item) => item.dispose());
      nodeMaterials.forEach((item) => item.dispose());
      outerOrbitGeometries.forEach((item) => item.dispose());
      outerOrbitMaterials.forEach((item) => item.dispose());
      outerNodeGeometries.forEach((item) => item.dispose());
      outerNodeMaterials.forEach((item) => item.dispose());
      renderer.dispose();
    },
  };
}
