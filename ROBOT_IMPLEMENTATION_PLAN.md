# Robot implementation plan

## Goal

Rebuild the Eedoo hero robot so it stops looking like a stack of simple boxes and starts reading as a polished, believable, stylized 3D robot mascot.

The result should keep the current Eedoo identity:

- dark near-black background
- purple `EEDOO` hero word
- animated contour/wallpaper pattern
- fixed navbar above the hero
- interactive Three.js robot in front of the text
- premium black/purple/yellow-lime lighting language

The task is not a full Eedoo page redesign. The main work belongs in `src/components/Robot3D.jsx`, with only small supporting changes in `src/pages/EedooPage.jsx` and `src/App.css` if needed for framing/responsiveness.

## Current Verified Project Context

Project path:

- `D:\FrontEnd Projects\em-logo`

Main route:

- `/eedoo`

Relevant files:

- `src/pages/EedooPage.jsx`
- `src/components/Robot3D.jsx`
- `src/App.css`
- `src/components/nav/Navbar.jsx`
- `src/components/nav/TextLogo.jsx`
- `src/assets/wallpaper.svg`
- `public/robot.glb`
- `public/xbot.glb`

Tech stack:

- React `19.2.6`
- Vite `8.0.12`
- Three `0.184.0`
- `@react-three/fiber` `9.6.1`
- `@react-three/drei` `10.7.7`
- Framer Motion `12.40.0`
- GSAP `3.15.0`
- Tailwind CSS `3.4.19`

Important available 3D helpers:

- `Canvas` from `@react-three/fiber`
- `useFrame` from `@react-three/fiber`
- `Environment`, `Float`, `ContactShadows`, `RoundedBox` from `@react-three/drei`
- `THREE.MathUtils.lerp`
- native Three primitives
- existing GLB files in `public`

Build status:

- `npm run build` currently passes.
- Vite warns that the JS bundle is larger than 500 kB. This is not blocking for this robot task.

Lint status:

- `npm run lint` currently fails with 16 errors and 1 warning.
- Robot-related lint issue:
  - `src/components/Robot3D.jsx`: default `React` import is unused.
- Eedoo-related lint issue:
  - `src/pages/EedooPage.jsx`: default `React` import is unused.
  - `src/pages/EedooPage.jsx`: `navigateWithTransition` is assigned but never used.
- Other lint failures exist in footer, transition, Home, Eyad, and SplitSection files. Do not fix those unless explicitly asked, because they are outside this robot task.

## Current Eedoo Page Structure

`src/pages/EedooPage.jsx` currently does this:

- renders `Navbar`
- renders `FullscreenMenu`
- sets page background to `#0B0A10`
- creates a full-height hero wrapper
- renders an animated `motion.div` with `wallpaper.svg`
- renders `<RobotHero />`

Current background layer:

- class name: `.eedoo-pattern-bg`
- defined in `src/App.css`
- positioned from `top: -10%`, `left: -10%`
- size: `120% x 120%`
- opacity: `0.3`
- z-index: `1`

Current hero layering:

- wallpaper pattern lives in `EedooPage.jsx`
- `RobotHero` contains the large `EEDOO` text and 3D canvas
- `EEDOO` text has `z-0`
- Canvas wrapper has `z-10`
- Navbar has high fixed z-index from existing nav CSS

Do not change this hierarchy unless a visual overlap bug appears during verification.

## Current Robot Structure

`src/components/Robot3D.jsx` currently contains:

- `RobotHead`
- `RobotBody`
- `Robot`
- default export `RobotHero`

Current `RobotHead`:

- has mouse-follow head rotation
- has separate mouse-follow eye refs
- uses one `RoundedBox` for the cranium
- uses a plain `boxGeometry` for jaw/cheeks
- uses cylinders for ear/sensor modules
- uses plain boxes for visor base and visor glass
- uses cylinders for circular eyes
- uses tiny boxes for mouth grille

Current `RobotBody`:

- uses one cylinder for neck
- uses one `RoundedBox` for torso base
- uses one `RoundedBox` for chest plate
- uses a plain box for core screen
- uses tiny boxes for equalizer bars
- uses a circle for status dot
- uses spheres for shoulders
- uses single cylinders for arms

Current scene:

- camera: `[0, 0, 8]`, `fov: 45`
- ambient light: `0.4`
- spot light from `[5, 10, 5]`
- directional purple edge light
- purple point rim light
- front fill point light
- `ContactShadows`
- `Environment preset="city"`
- `Float` around the entire robot

## Diagnosis

The current implementation already improved the first blocky version, but it still looks artificial for these reasons:

1. The jaw, visor, face glass, chest screen, mouth bars, and arms still use visibly flat primitive boxes/cylinders.
2. The robot has no real mechanical hierarchy in the arms: shoulder sphere plus one cylinder is too simple.
3. The head reads as a rounded cube with a flat rectangular slab on the front, not a designed casing.
4. The torso has no believable assembled layers: no side panels, bevel seams, screws, sockets, waist connection, or armor segmentation.
5. The neck is one plain cylinder, so the head/body connection feels temporary.
6. Materials are close in value, so the shape gets visually compressed into black masses.
7. The eyes are round cylinders; they feel like parts, but not expressive character eyes.
8. The glass material uses `transmission` on a dark material in a scene where reflection/clearcoat may be more useful than real transparency.
9. There is no reusable material system, so future tuning will be repetitive.
10. The model is built as separate meshes, but not organized into enough semantic subcomponents for safe iteration.

## Recommended Implementation Strategy

Use a procedural robot built inside `Robot3D.jsx`, not an imported full GLB as the primary solution.

Reason:

- The current page needs a custom mascot that sits exactly in front of the `EEDOO` word.
- Procedural geometry is easier to art-direct for this hero section.
- The project already uses React Three Fiber and Drei primitives for this component.
- The existing `public/robot.glb` can be used as anatomy reference, but using it directly risks a generic look and may require animation/material cleanup.

Use `public/robot.glb` only as optional reference or fallback.

Known GLB details:

- `public/robot.glb`
  - 74 nodes
  - 14 meshes
  - 3 materials
  - 14 animations
  - includes names such as `RobotArmature`, `Body`, `Torso`, `Neck`, `Head`, `Shoulder.L`, `UpperArm.L`, `LowerArm.L`
- `public/xbot.glb`
  - humanoid Mixamo-style rig
  - not visually suitable as the Eedoo mascot unless heavily restyled

## Non-Goals

Do not:

- redesign the whole Eedoo page
- change route structure
- replace the navbar
- remove `wallpaper.svg`
- replace the large `EEDOO` text
- add heavy texture files unless absolutely necessary
- import a large new 3D model from the internet
- add new dependencies unless the existing stack cannot achieve the target
- fix unrelated lint errors in footer/Home/Eyad/SplitSection
- change global CSS variables for the whole site just to tune this robot

## Target Visual Direction

The robot should feel like:

- premium tech mascot
- friendly but not childish
- compact mechanical assistant
- black/purple polished casing
- soft glass face
- expressive glowing eyes
- physically assembled from believable panels, sockets, rings, and joints

The robot should not feel like:

- Minecraft/block toy
- generic humanoid imported asset
- flat cardboard cutout
- over-detailed sci-fi machine
- bright cartoon robot
- completely black unreadable silhouette

## High-Level Component Plan

Refactor `Robot3D.jsx` into these internal pieces:

- `ROBOT_COLORS`
- `RobotMaterials`
- `RoundedPanel`
- `Bolt`
- `PanelSeam`
- `RobotHead`
- `RobotEyes`
- `RobotEarModule`
- `RobotNeck`
- `RobotTorso`
- `RobotChestDisplay`
- `RobotShoulder`
- `RobotArm`
- `Robot`
- `RobotLighting`
- `RobotHero`

Keep them in the same file for this task unless the file becomes too hard to scan. If splitting is needed, create:

- `src/components/robot/Robot3D.jsx`
- `src/components/robot/RobotParts.jsx`
- `src/components/robot/RobotMaterials.js`

But the first pass should stay in the current file to keep the change scoped.

## Step 1: Pre-Flight Cleanup

In `src/components/Robot3D.jsx`:

- Remove unused default `React` import.
- Change:
  - `import React, { useRef } from 'react';`
- To:
  - `import { useMemo, useRef } from 'react';`
- Add `useMemo` because materials should be reused.

In `src/pages/EedooPage.jsx`:

- Remove unused default `React` import.
- Decide what to do with `navigateWithTransition`.
- Since it is currently unused, either:
  - remove `const { navigateWithTransition } = useEedooTransition();`, or
  - remove the `useEedooTransition` import entirely if not needed by this page.

Recommended for this task:

- Remove the unused transition hook from `EedooPage.jsx` only if it is truly unused after checking navigation behavior.
- Do not edit transition provider files.

Verification:

- Run `npm run build`.
- Do not require full lint to pass because unrelated lint errors exist.
- Confirm robot-specific lint errors are gone if using targeted lint output or by checking the listed files manually.

## Step 2: Build A Reusable Material System

Inside `Robot3D.jsx`, define a stable color palette:

- `voidBlack`: `#07070B`
- `panelBlack`: `#0B0A10`
- `deepPurple`: `#14111E`
- `armorPurple`: `#29203A`
- `eedooPurple`: `#8D76C9`
- `rimPurple`: `#B19AE8`
- `jointPurple`: `#59447F`
- `glowLime`: `#D5E86B`
- `softWhite`: `#F4F4ED`

Create a `RobotMaterials` hook or function:

- Use `useMemo`.
- Return reusable material prop objects or material elements.
- Keep values in one place.

Recommended material definitions:

- outer armor:
  - `meshPhysicalMaterial`
  - color `#14111E`
  - metalness `0.65`
  - roughness `0.28`
  - clearcoat `0.55`
  - clearcoatRoughness `0.22`

- inner mechanical black:
  - `meshStandardMaterial`
  - color `#07070B`
  - metalness `0.75`
  - roughness `0.42`

- purple armor:
  - `meshPhysicalMaterial`
  - color `#59447F`
  - metalness `0.42`
  - roughness `0.26`
  - clearcoat `0.45`

- glass:
  - `meshPhysicalMaterial`
  - color `#020207`
  - metalness `0`
  - roughness `0.08`
  - clearcoat `1`
  - clearcoatRoughness `0.05`
  - reflectivity `0.8`
  - transmission optional; avoid relying on it for a black visor

- glow:
  - `meshStandardMaterial`
  - color `#D5E86B`
  - emissive `#D5E86B`
  - emissiveIntensity between `1.2` and `2.2`

- lavender glow:
  - `meshStandardMaterial`
  - color `#B19AE8`
  - emissive `#8D76C9`
  - emissiveIntensity between `0.8` and `1.5`

Acceptance criteria:

- No repeated long material definitions on every mesh.
- Tuning robot colors should be possible from one small section.
- Black parts should still reveal edges under current lights.

## Step 3: Replace Flat Head With Layered Head Assembly

Current issue:

- `RobotHead` has a rounded cube plus flat box jaw and flat visor.

Target:

- Head should be a rounded helmet/casing with layered front glass, side sensors, brow, jaw, and back shell.

Implementation details:

1. Keep `headRef` and mouse-follow behavior.
2. Wrap all head parts in:
   - `<group ref={headRef} position={[0, 0.15, 0]}>`
3. Use `RoundedBox` for the main head shell:
   - args: `[1.55, 1.25, 1.25]`
   - radius: `0.18`
   - smoothness: `8`
   - position: `[0, 0, 0]`
4. Add a slightly larger rear/top casing shell:
   - `RoundedBox`
   - args: `[1.62, 1.28, 1.05]`
   - position: `[0, 0.03, -0.08]`
   - darker material
   - this creates depth behind the face.
5. Replace the jaw `boxGeometry` with a rounded lower face plate:
   - `RoundedBox`
   - args: `[1.42, 0.42, 0.22]`
   - radius: `0.08`
   - position: `[0, -0.38, 0.56]`
6. Add a subtle brow plate above the visor:
   - `RoundedBox`
   - args: `[1.28, 0.14, 0.14]`
   - radius: `0.05`
   - position: `[0, 0.36, 0.64]`
7. Replace visor base and visor glass boxes with rounded/inset panels:
   - outer visor frame:
     - `RoundedBox`
     - args: `[1.28, 0.56, 0.11]`
     - radius: `0.08`
     - position: `[0, 0.12, 0.65]`
   - inner glass:
     - `RoundedBox`
     - args: `[1.14, 0.43, 0.08]`
     - radius: `0.06`
     - position: `[0, 0.12, 0.72]`
8. Add tiny seam strips on head sides:
   - thin cylinders or tiny rounded boxes
   - color slightly lighter than body
   - positions near `x: +/-0.78`
9. Add two small top/back detail vents:
   - tiny dark rounded boxes
   - do not make them too visible from the front.

Acceptance criteria:

- No visible plain `boxGeometry` remains on main head, jaw, visor, or face.
- The head has at least three visible layers:
  - outer shell
  - visor frame/glass
  - jaw/brow detail
- From the screenshot angle, the face reads as inset glass, not a flat rectangle pasted on a cube.

## Step 4: Make Eyes Expressive

Current issue:

- Circular eyes look like small mechanical dots.

Target:

- Eyes should feel like a character expression inside a visor.

Implementation options:

Preferred:

- Use small rounded capsule-like eye slits.
- Build each eye with `RoundedBox`:
  - args: `[0.22, 0.055, 0.018]`
  - radius: `0.025`
  - rotate each slightly:
    - left eye: `rotation={[0, 0, 0.28]}`
    - right eye: `rotation={[0, 0, -0.28]}`
  - color/emissive: `#D5E86B`

Alternative:

- Use `planeGeometry` or `circleGeometry` scaled into ovals.
- Only use if `RoundedBox` slits look too chunky.

Animation:

- Keep pointer tracking, but apply it to the eye group position, not eye mesh rotation.
- Add subtle pulse:
  - use `useFrame`
  - calculate `pulse = 1 + Math.sin(state.clock.elapsedTime * 2.2) * 0.08`
  - set emissive intensity or scale very subtly

Important:

- Do not make the eyes move outside the visor.
- Clamp eye offset:
  - x between `-0.05` and `0.05` relative to each eye base
  - y between `-0.035` and `0.035`

Acceptance criteria:

- Eyes look alive and intentional.
- Eyes remain inside the glass panel at all pointer positions.
- The robot should not look angry unless the brand intentionally wants that. Slight confident/cute focus is better.

## Step 5: Replace Neck Cylinder With Mechanical Rings

Current issue:

- Neck is one simple cylinder.

Target:

- Neck should feel like a rotating joint connecting head to torso.

Implementation:

Create `RobotNeck`:

- root position around `[0, -1.1, 0]` relative to head/body layout, or keep inside body group if easier.
- central cylinder:
  - radius top/bottom: `0.24`
  - height: `0.45`
  - segments: `32`
  - material: inner mechanical black
- three ring collars:
  - cylinders with height `0.055`
  - radius `0.34`
  - positions:
    - y `0.22`
    - y `0.02`
    - y `-0.18`
  - material alternating:
    - deep purple
    - black
    - deep purple

Optional detail:

- Add a small front glowing neck status line:
  - tiny rounded box
  - `args={[0.12, 0.025, 0.012]}`
  - position `[0, 0.05, 0.35]`

Acceptance criteria:

- Neck visibly connects head and torso.
- Head no longer appears to float above a plain tube.

## Step 6: Rebuild Torso As A Layered Armor Body

Current issue:

- Torso is one rounded box plus a centered plate.
- It still reads as a softened rectangle.

Target:

- Torso should look like a compact robotic chest with front armor, side bevels, shoulder sockets, chest screen, and waist connector.

Implementation:

1. Keep torso root approximately at `[0, -2.1, 0]`.
2. Main torso shell:
   - `RoundedBox`
   - args: `[2.22, 1.78, 1.05]`
   - radius: `0.18`
   - smoothness: `8`
   - position: `[0, 0, 0]`
   - material: armor purple/dark body
3. Add upper chest cap:
   - `RoundedBox`
   - args: `[2.0, 0.28, 1.02]`
   - radius: `0.12`
   - position: `[0, 0.83, 0.03]`
   - material: darker armor
4. Add lower abdomen/waist part:
   - `RoundedBox`
   - args: `[1.55, 0.34, 0.82]`
   - radius: `0.12`
   - position: `[0, -0.98, 0]`
   - material: inner black/deep purple
5. Add left/right side bevel panels:
   - small rounded boxes
   - args: `[0.18, 1.25, 0.76]`
   - positions:
     - `[-1.08, -0.05, 0.14]`
     - `[1.08, -0.05, 0.14]`
   - slightly darker material
6. Add front armor plate:
   - `RoundedBox`
   - args: `[1.62, 1.05, 0.18]`
   - radius: `0.11`
   - position: `[0, 0.05, 0.56]`
   - material: deep purple
7. Add four small bolt heads on front armor:
   - cylinders facing front
   - radius `0.035`
   - depth `0.018`
   - positions:
     - `[-0.72, 0.48, 0.66]`
     - `[0.72, 0.48, 0.66]`
     - `[-0.72, -0.42, 0.66]`
     - `[0.72, -0.42, 0.66]`
8. Add two subtle diagonal/vertical panel seams:
   - thin rounded boxes
   - low contrast
   - avoid drawing too much attention.

Acceptance criteria:

- Torso looks assembled from multiple layers.
- Main body no longer reads as one basic rounded rectangle.
- Chest details remain visible in front of the huge Eedoo text.

## Step 7: Upgrade Chest Display

Current issue:

- Chest screen is a small flat box with basic bars.

Target:

- Chest display should feel like a real inset black-glass interface.

Implementation:

Create `RobotChestDisplay`:

- outer display frame:
  - `RoundedBox`
  - args: `[0.95, 0.48, 0.08]`
  - radius: `0.06`
  - position: `[0, 0.08, 0.68]`
  - material: inner black
- glass display:
  - `RoundedBox`
  - args: `[0.78, 0.34, 0.04]`
  - radius: `0.04`
  - position: `[0, 0.08, 0.73]`
  - material: glass
- equalizer bars:
  - 4 to 5 small rounded boxes
  - use lavender + lime mix
  - animate heights subtly with sine waves.
- status dot:
  - use small emissive circle or sphere
  - position on right side of display
  - animate faint pulse.
- optional thin line:
  - one horizontal separator line above the bars
  - color `#F4F4ED` with low opacity/material brightness.

Animation:

- Use refs for bars.
- In `useFrame`, update `scale.y`.
- Keep animation slow and subtle:
  - `bar.scale.y = 0.75 + Math.sin(time * 2 + index) * 0.22`

Acceptance criteria:

- Chest display looks inset.
- Bars animate softly.
- Display remains readable but does not overpower the face.

## Step 8: Build Real Shoulder Socket Assemblies

Current issue:

- Shoulder spheres are visible but disconnected from a real mechanical socket.

Target:

- Shoulders should look like ball joints captured by torso-side sockets.

Implementation:

Create `RobotShoulder({ side })`:

- `side` is `-1` for left, `1` for right.
- root position:
  - `[side * 1.28, 0.45, 0]`
- inner socket ring:
  - cylinder
  - radius `0.38`
  - height `0.16`
  - rotate so the cylinder axis points along X
  - material: inner black
- purple ball:
  - sphere
  - radius `0.46`
  - position `[side * 0.24, 0, 0]`
  - material: purple armor
- outer cap:
  - sphere or short cylinder cap
  - radius `0.38`
  - position `[side * 0.34, 0.02, 0.03]`
  - material: brighter purple
- small highlight band:
  - thin torus if using `torusGeometry`
  - or thin cylinder ring

Acceptance criteria:

- Shoulders look physically mounted into the torso.
- Shoulder proportions do not hide the chest display.
- Purple highlight remains consistent with the Eedoo word.

## Step 9: Replace Single-Tube Arms With Segmented Arms

Current issue:

- Arms are currently one cylinder per side.

Target:

- Arms should be made of upper arm, elbow joint, forearm, and optional small claw/hand silhouette.

Implementation:

Create `RobotArm({ side })`:

- root starts near shoulder.
- upper arm:
  - cylinder or capsule-like segment
  - radius top/bottom around `0.18`
  - length `0.78`
  - position `[side * 1.58, -0.28, 0]`
  - rotation `[0, 0, side * 0.22]`
  - material: inner black
- upper arm armor strip:
  - small rounded box on front side
  - purple/dark purple
- elbow joint:
  - sphere
  - radius `0.24`
  - position `[side * 1.72, -0.88, 0]`
  - material: joint purple
- forearm:
  - slightly thicker tapered cylinder if possible
  - radius top `0.18`, radius bottom `0.23`
  - length `0.85`
  - position `[side * 1.82, -1.35, 0]`
  - rotation `[0, 0, side * 0.08]`
  - material: inner black
- wrist cap:
  - small cylinder/sphere
  - position `[side * 1.88, -1.78, 0]`
- optional hand:
  - do not overbuild unless visible in current framing
  - if added, use simple mitten/claw made from 2 or 3 rounded boxes
  - place partly below the fold if the hero framing crops it.

Animation:

- Put each arm under an `armRef`.
- In `useFrame`, add gentle sway:
  - shoulder group rotation z changes by `Math.sin(time * 1.2) * 0.025`
  - right and left arms should not mirror too mechanically; offset by `Math.PI`.

Acceptance criteria:

- Arms have at least three visible mechanical parts.
- The robot stops looking like it has pipes attached to spheres.
- Arms remain secondary to face/chest.

## Step 10: Add Small Mechanical Details

Add details only where visible from the current camera.

Recommended visible details:

- head side seam strips
- head side circular sensor rings
- tiny screws/bolts on head and torso
- chest frame bolts
- neck ring segments
- shoulder socket rings
- small casing lines on forearms
- small top head vents

Avoid:

- many tiny invisible decorative pieces
- heavy particle effects
- large glowing outlines
- pure SVG overlays inside the canvas

Implementation helper components:

`Bolt`:

- cylinder facing camera
- small radius
- dark metal or dim purple
- reusable for head/torso.

`PanelSeam`:

- thin rounded box
- very subtle material
- used on head/torso panels.

Acceptance criteria:

- Details improve realism without cluttering the silhouette.
- There should be no dense noise at mobile size.

## Step 11: Improve Robot Animation Structure

Current animation:

- head tracks pointer
- eyes track pointer
- entire robot floats through Drei `Float`

Target:

- keep interaction, but make movement feel physically plausible.

Implementation:

1. Keep `Float`, but reduce if the robot feels bouncy:
   - `speed={1.4}`
   - `rotationIntensity={0.055}`
   - `floatIntensity={0.28}`
2. Create separate refs for:
   - head
   - eyes group
   - chest bars
   - left arm
   - right arm
3. Pointer head movement:
   - x target: `(pointer.y * Math.PI) / 10`
   - y target: `(pointer.x * Math.PI) / 8`
   - lerp factor: `0.08`
4. Eye movement:
   - do not rotate eyes aggressively.
   - move eye group slightly:
     - x: `pointer.x * 0.035`
     - y: `pointer.y * 0.025`
   - lerp factor: `0.12`
5. Chest bars:
   - subtle independent sine scaling.
6. Arms:
   - very small idle rotations.

Acceptance criteria:

- Robot feels alive even when the mouse is idle.
- Pointer motion feels like attention/focus, not a detached puppet.
- No part jitters.
- No part clips through another during idle animation.

## Step 12: Tune Lighting For Shape Readability

Current lighting is close but should be tuned after the model is rebuilt.

Target:

- readable black robot on black background
- purple rim on edges
- face/chest glow visible
- no washed-out Eedoo text

Recommended lighting:

- ambient:
  - intensity `0.25` to `0.35`
- key spot:
  - position `[4, 7, 5]`
  - intensity `1.6` to `2.2`
  - angle `0.45`
  - penumbra `0.8`
  - color `#F4F4ED`
- front soft fill:
  - point light `[0, 1, 4]`
  - intensity `0.35` to `0.7`
  - color `#B19AE8`
- purple rim:
  - point or directional from `[-4, 2, -4]` or `[4, 2, -5]`
  - intensity `2` to `4`
  - color `#8D76C9`
- low underglow optional:
  - very subtle point light `[0, -2.5, 2]`
  - intensity `0.25`
  - color `#D5E86B`

Keep:

- `Environment preset="city"` unless it causes too much reflection.
- `ContactShadows`, but adjust position after the new body height is final.

Acceptance criteria:

- Robot silhouette is clear at a glance.
- Edge highlights reveal curves and bevels.
- Face does not become a black rectangle with two dots.

## Step 13: Fix Hero Framing And Responsiveness

Current hero:

- `RobotHero` wrapper is full screen.
- camera position is fixed.
- `EEDOO` text is `25vw`.
- robot appears centered over the word.

Potential issue:

- As the robot becomes more detailed and taller/wider, current camera/framing may crop badly on mobile or overlap navbar.

Implementation:

1. Add responsive camera/scale logic inside `RobotHero`.
2. Option A:
   - use CSS classes and media queries for wrapper only.
3. Option B, preferred:
   - use a small `ResponsiveRobot` component with `useThree`.
   - determine viewport width.
   - set robot scale and position.

Recommended responsive values:

- desktop:
  - robot group position `[0, -0.15, 0]`
  - scale `1`
  - camera `[0, 0, 8]`
  - fov `45`
- tablet:
  - robot scale `0.88`
  - position `[0, -0.1, 0]`
  - Eedoo text may remain `25vw`
- mobile:
  - robot scale `0.72`
  - position `[0, -0.35, 0]`
  - camera may move to `[0, 0, 8.8]`
  - reduce `EEDOO` text if it overflows awkwardly.

Navbar constraints:

- desktop nav buttons sit top-right.
- desktop text logo sits top-left.
- robot head must not overlap the navbar at common viewport heights.
- keep top of robot below roughly `96px` on desktop.

Acceptance criteria:

- At `1920x900`, robot is centered and hero looks like the provided screenshot but with better robot structure.
- At `1440x900`, face and chest are visible.
- At `1024x768`, robot does not collide with navbar.
- At `390x844`, robot remains readable and not clipped in a broken way.

## Step 14: Decide Whether To Use The Existing GLB

Default:

- Do not use `public/robot.glb` for the final hero.

Use GLB only if:

- procedural robot still looks weak after the rebuild, or
- the user specifically wants a more humanoid real model, or
- time is more important than exact brand control.

If using `robot.glb`:

1. Import `useGLTF` from `@react-three/drei`.
2. Load `/robot.glb`.
3. Clone and traverse materials.
4. Replace original materials with Eedoo palette.
5. Disable or selectively play animations.
6. Position and scale it to match current hero.
7. Add custom face/chest glow if the model lacks brand personality.

Risks:

- imported robot may not match current design language
- rig animations may look generic
- material names are only `Grey`, `Main`, `Black`
- extra complexity if the asset is not optimized for this exact shot

Recommendation:

- Keep GLB as a reference, not the main implementation.

## Step 15: CSS And Page-Level Adjustments

Only adjust `src/App.css` and `src/pages/EedooPage.jsx` if the rebuilt robot needs better framing.

Possible CSS improvements:

- Add a dedicated class for the Eedoo hero wrapper instead of inline styles if the file starts accumulating more layout rules.
- Keep `.eedoo-pattern-bg` behind the robot and text.
- Consider reducing pattern opacity from `0.3` to `0.22` if it competes with new robot detail.

Possible `RobotHero` improvements:

- Add class names:
  - `eedoo-robot-hero`
  - `eedoo-hero-word`
  - `eedoo-robot-canvas`
- Move text styling out of inline style only if it helps responsive control.

Do not:

- change navbar CSS for this task unless a verified overlap bug is caused by the robot.

## Step 16: Performance Requirements

The model should remain procedural and lightweight.

Guidelines:

- Reuse materials with `useMemo`.
- Use `RoundedBox` smoothness around `6` to `8`, not extreme values.
- Use sphere/cylinder segments around `24` to `32`.
- Keep bolts and seams low cost.
- Avoid dozens of invisible decorative meshes.
- Avoid real-time expensive effects such as bloom unless already configured.
- Do not add postprocessing for this task.

Suggested mesh budget:

- head assembly: 12 to 18 meshes
- torso assembly: 12 to 20 meshes
- shoulders and arms: 14 to 24 meshes total
- details: 12 to 24 small meshes
- total: roughly 50 to 85 meshes

This is acceptable for a single hero robot if materials are reused and geometry is not over-subdivided.

## Step 17: Verification Plan

Run:

- `npm run build`

Expected:

- build passes.
- existing large bundle warning may remain.

Run:

- `npm run lint`

Expected:

- full lint may still fail because unrelated files already fail.
- robot/Eedoo-specific lint errors should be removed:
  - no unused `React` in `Robot3D.jsx`
  - no unused `React` in `EedooPage.jsx`
  - no unused `navigateWithTransition` in `EedooPage.jsx`

Manual browser QA:

1. Start dev server:
   - `npm run dev`
2. Open:
   - `/eedoo`
3. Check desktop:
   - 1920x900
   - 1440x900
   - 1366x768
4. Check mobile:
   - 390x844
   - 430x932
5. Move cursor across screen:
   - head follows subtly
   - eyes stay in visor
   - no jitter
6. Open/close menu:
   - navbar/menu still renders above hero
   - robot does not block menu interactions
7. Scroll if page allows:
   - no broken body overflow after menu closes.

Visual QA checklist:

- robot no longer looks like simple cubes stacked together
- face screen feels inset and glassy
- eyes are expressive and glowing
- head has rounded casing, jaw, visor frame, brow, and side modules
- neck looks mechanical
- torso has layered front armor
- chest screen is inset and animated
- shoulders look socketed
- arms are segmented
- black materials still show shape
- purple highlights match Eedoo identity
- robot is not washed out by lights
- robot does not collide with navbar
- EEDOO word remains the dominant brand backdrop

## Suggested Implementation Order For The AI Agent

1. Read `src/components/Robot3D.jsx`, `src/pages/EedooPage.jsx`, and `src/App.css`.
2. Run `npm run build` to confirm starting point.
3. Remove robot/Eedoo unused imports.
4. Add color constants and reusable material setup in `Robot3D.jsx`.
5. Refactor current head into a layered head assembly.
6. Replace eye geometry with expressive glowing slits and clamped pointer tracking.
7. Replace neck cylinder with stacked mechanical rings.
8. Rebuild torso with layered shell, side panels, front armor, bolts, and waist connector.
9. Replace chest display with inset glass display and animated bars.
10. Replace shoulders with socket assemblies.
11. Replace single-cylinder arms with segmented arm assemblies.
12. Tune `Float`, head tracking, eye tracking, arm idle, and chest animation.
13. Tune lights and `ContactShadows`.
14. Test desktop and mobile framing.
15. Run `npm run build`.
16. Run `npm run lint` and document any remaining unrelated lint failures.
17. Provide before/after notes listing changed files and verification results.

## Concrete Acceptance Criteria

The AI Agent should stop only when all of these are true:

- `src/components/Robot3D.jsx` contains a materially more detailed robot structure.
- Main visible robot parts do not rely on plain box geometry.
- Head, torso, shoulders, and arms have clear mechanical hierarchy.
- Face and chest displays feel inset, glossy, and lit.
- Eyes have personality and stay within the visor.
- Arms are segmented, not single tubes.
- Neck is made of stacked/ring-like mechanical parts.
- Materials are centralized and reusable.
- Eedoo page route still renders the hero.
- `npm run build` passes.
- Any remaining lint failures are unrelated to this robot implementation.
- The final visual keeps the current dark/purple Eedoo brand direction.

## Files Expected To Change

Primary:

- `src/components/Robot3D.jsx`

Possible small supporting changes:

- `src/pages/EedooPage.jsx`
- `src/App.css`

Files that should not change for this task:

- `src/components/nav/Navbar.jsx`
- `src/components/nav/TextLogo.jsx`
- `src/components/nav/HeaderLogo.jsx`
- `src/components/nav/StoreButton.jsx`
- `src/components/nav/HamburgerButton.jsx`
- `src/components/footer/*`
- `src/pages/HomePage.jsx`
- `src/pages/EyadPage.jsx`
- route setup in `src/App.jsx`

## Final Deliverable Expected From The AI Agent

The agent should return:

- changed file list
- short explanation of the robot rebuild
- build result
- lint result, clearly separating unrelated lint failures
- notes about desktop/mobile visual checks
- screenshots if the environment supports them

