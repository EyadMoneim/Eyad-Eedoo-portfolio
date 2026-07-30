# EM Logo Project Cleanup Implementation Plan

## Goal

Clean and restructure the current React + Vite project without redesigning it or breaking the existing visual experience.

The project is still unfinished, so the cleanup must preserve the current direction:

- Scroll-driven hero sequence
- GSAP ScrollTrigger phases
- Three.js dissolve portrait
- Framer Motion menu and loading interactions
- Split Eedoo / Eyad section
- Existing assets and visual identity

The target outcome is a codebase that is easier to continue building:

- `npm run lint` passes
- `npm run build` passes
- Dead code is removed
- Empty/useless files are removed
- `src/App.jsx` is split into smaller, understandable modules
- Placeholder/debug code is cleaned
- README describes the real project instead of the default Vite template

## Current Verified State

Checked on 2026-07-30.

### Build

`npm run build` passes.

Current production output includes a large JS bundle:

- `dist/assets/index-*.js`: about `1.41 MB`
- gzip size: about `413 KB`

Vite warns that some chunks are larger than `500 KB`.

Likely causes:

- `three`
- `@react-three/fiber`
- `@react-three/drei`
- `framer-motion`
- `gsap`

This is not currently a blocking bug, but it is a performance cleanup target.

### Lint

`npm run lint` currently fails with 16 errors.

Known lint errors:

- `src/App.jsx`
  - unused default `React` import
  - unused `EASE_SMOOTH`
  - unused `HelmetIcon`
  - unused `LandoBrand`
  - unused `sigLayerEl`
  - unused event argument `e`
  - unused `sigLayer`

- `src/ThreeDissolveHero.jsx`
  - unused default `React` import
  - React hooks immutability errors caused by mutating textures returned from `useTexture`

- `src/components/ScrollVelocity.jsx`
  - unused `velocityFactor`
  - unused `directionFactor`

- `src/components/SmoothScroll.jsx`
  - unused default `React` import

- `src/sections/HeroSection.jsx`
  - unused default `React` import
  - unused `HelmetIcon`

- `src/sections/SplitSection.jsx`
  - unused default `React` import

### Git

Current branch:

- `main`

Current branch is tracking:

- `origin/main`

Current local modified files:

- `src/App.jsx`
- `src/App.css`
- `src/sections/SplitSection.jsx`

Do not revert these changes. Treat them as intentional user work.

### Project Structure Concerns

`src/App.jsx` is too large and currently contains too many responsibilities:

- app layout
- navigation
- menu overlay
- icons
- constants
- signature SVG parsing
- scroll phase orchestration
- quote section markup
- developer badge
- phase background layers

This makes future work risky because small changes can affect unrelated behavior.

### Known Dead or Suspicious Items

- `src/sections/EedooSection.jsx` is empty.
- `README.md` is still the default Vite README.
- Several comments and names reference the Lando Norris inspiration directly. Keep only useful implementation notes and remove misleading reference labels.
- Some text in `SplitSection.jsx` still sounds like placeholder copy:
  - "Most recent results, career stats and photos from trackside."
  - "Campaigns, shoots and other such promotional materials for fans."
- `HeroSection.jsx` contains debug `console.log` calls on hover.
- Remote menu images are loaded from Webflow CDN. Keep them if the menu still depends on them, but document that they are external dependencies.

## Safety Rules

Follow these rules for every cleanup step:

1. Do not redesign the website.
2. Do not change the intended scroll flow.
3. Do not remove an asset unless a project-wide search proves it is unused.
4. Do not delete unfinished but intentional sections unless they are empty and unused.
5. Preserve all GSAP refs and CSS class names used by animations.
6. Keep changes small and test after each meaningful step.
7. Never revert user changes.
8. Prefer moving code over rewriting behavior.
9. Avoid adding new dependencies.
10. Do not convert the project to TypeScript during this cleanup.

## Required Verification Commands

Run these after every major phase:

```bash
npm run lint
npm run build
```

If visual behavior may have changed, also run:

```bash
npm run dev
```

Then manually check:

- loading screen
- first hero viewport
- hover dissolve interaction
- next project card hover
- scroll shrink phase
- signature reveal
- quote reveal
- transition into white background
- split section entrance
- fullscreen menu open/close
- desktop width
- mobile width

## Phase 1: Fix Lint Without Restructuring

Purpose: make the existing code clean before moving files around.

### 1.1 Remove Unused React Imports

With modern Vite/React JSX transform, default `React` import is not required in most files.

Remove unused default imports from:

- `src/App.jsx`
- `src/ThreeDissolveHero.jsx`
- `src/components/SmoothScroll.jsx`
- `src/sections/HeroSection.jsx`
- `src/sections/SplitSection.jsx`

Keep named hook imports where needed.

Example:

```js
import { useState, useEffect, useRef, useLayoutEffect } from "react";
```

### 1.2 Remove Unused Constants and Components

In `src/App.jsx`, remove or relocate only if truly unused:

- `EASE_SMOOTH`
- local `HelmetIcon`
- local `LandoBrand`
- `sigLayerEl`
- unused event argument `e`
- `sigLayer`

Before deleting, search the file and whole project to confirm no usage:

```bash
rg "EASE_SMOOTH|HelmetIcon|LandoBrand|sigLayerEl|sigLayer" src
```

### 1.3 Remove Hero Debug Logging

In `src/sections/HeroSection.jsx`, remove:

```js
console.log("CARD ENTER");
console.log("CARD LEAVE");
```

Keep the hover behavior:

```js
setIsRobotActive(true);
setIsRobotActive(false);
```

### 1.4 Fix `ScrollVelocity.jsx`

Current unused values:

- `velocityFactor`
- `directionFactor`

Choose one of these safe options:

Option A, simplest cleanup:

- remove `velocityFactor`
- remove `directionFactor`
- remove unused imports if any become unused

Option B, better behavior if intended:

- use scroll velocity to affect marquee speed
- use direction factor to reverse/enhance movement based on scroll

Use Option A unless the current visual needs scroll-reactive velocity.

### 1.5 Fix Texture Immutability in `ThreeDissolveHero.jsx`

Current lint issue:

```js
humanTexture.colorSpace = THREE.SRGBColorSpace;
robotTexture.colorSpace = THREE.SRGBColorSpace;
humanTexture.needsUpdate = true;
robotTexture.needsUpdate = true;
```

Problem:

The React hooks lint rule reports this as mutating values returned from a hook.

Goal:

Preserve correct sRGB color without violating lint.

Preferred implementation:

- Configure color space at load time if possible.
- Or derive cloned textures with `useMemo`, set color space on the clones, and use the clones in uniforms.
- Dispose cloned textures on cleanup if clones are created.

Suggested approach:

```js
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
```

Then make sure all aspect and uniforms use the cloned `humanTexture` and `robotTexture`.

Verify:

- lint passes for this file
- portrait still renders
- human / robot dissolve still works
- colors still look correct

### 1.6 Run Verification

Run:

```bash
npm run lint
npm run build
```

Do not continue to restructuring until lint and build pass.

## Phase 2: Remove Empty or Proven-Dead Files

Purpose: remove obvious noise with low risk.

### 2.1 Empty Section File

Check if this file is imported:

```bash
rg "EedooSection" src
```

If no imports exist, delete:

- `src/sections/EedooSection.jsx`

### 2.2 Asset Usage Audit

List all assets:

```bash
Get-ChildItem src/assets -File
Get-ChildItem public -File
```

Search references:

```bash
rg "EM.svg|favicon.svg|icons.svg|wallpaper.svg|signature.svg|Laurel_Wreath.svg|react.svg|eyad-small|eyad-human|eyad-robot|left-side|right-side" .
```

Only remove assets with zero references in:

- `src`
- `public`
- `index.html`
- CSS files

Be careful:

- public files can be referenced by URL at runtime
- files can be referenced inside generated HTML or favicon tags
- do not remove likely future brand assets unless obviously duplicated and unused

### 2.3 Run Verification

Run:

```bash
npm run lint
npm run build
```

## Phase 3: Extract Constants and Data

Purpose: reduce `App.jsx` size without touching behavior.

Create:

```text
src/constants/colors.js
src/constants/animation.js
src/constants/menuData.js
```

Move:

- `COLORS` to `src/constants/colors.js`
- `EASE_DEFAULT` to `src/constants/animation.js`
- `MENU_IMAGES` to `src/constants/menuData.js`

Do not change values.

Update imports.

Run:

```bash
npm run lint
npm run build
```

## Phase 4: Extract Icons and Small Pure Components

Purpose: move low-risk UI pieces out of `App.jsx`.

Create:

```text
src/components/icons/StoreIcon.jsx
src/components/icons/CurvedArrowIcon.jsx
src/components/badges/DeveloperBadge.jsx
src/components/nav/HoverSplitText.jsx
src/components/nav/CurrentLinkSVG.jsx
src/components/nav/HamburgerButton.jsx
src/components/nav/StoreButton.jsx
src/components/nav/TextLogo.jsx
src/components/nav/HeaderLogo.jsx
src/components/nav/MenuImage.jsx
```

Move components one by one.

Important:

- `DeveloperBadge` is currently imported by `HeroSection.jsx` from `../App`.
- This creates an unhealthy dependency.
- After extraction, update `HeroSection.jsx` to import it from:

```js
import DeveloperBadge from "../components/badges/DeveloperBadge";
```

or:

```js
import { DeveloperBadge } from "../components/badges/DeveloperBadge";
```

Choose one export style and keep it consistent.

After each group of moves:

```bash
npm run lint
npm run build
```

## Phase 5: Extract Fullscreen Menu

Purpose: isolate the navigation overlay from app orchestration.

Create:

```text
src/components/nav/FullscreenMenu.jsx
```

Move:

- `FullscreenMenu`
- its local use of `MenuImage`
- nav links rendering
- social links rendering

Keep all class names unchanged:

- `nav-menu-overlay`
- `nav-menu-bg-blobs`
- `nav-menu-content`
- `nav-menu-images`
- `nav-menu-images-track`
- `nav-menu-images-col`
- `nav-menu-links-section`
- `nav-menu-links-col`
- `nav-menu-links-list`
- `nav-menu-link`
- `nav-social-section`

Run:

```bash
npm run lint
npm run build
```

## Phase 6: Extract Navbar

Purpose: remove nav layout noise from `App.jsx`.

Create:

```text
src/components/nav/Navbar.jsx
```

Move navbar markup into `Navbar`.

Props needed:

```js
{
  isMenuOpen,
  setIsMenuOpen,
  isScrolled,
  isPhase3,
  isPhase4
}
```

Preserve:

- desktop/mobile logo behavior
- center monogram behavior
- mobile scrolled behavior
- store button visibility
- hamburger open/close behavior

Keep class names:

- `nav-bar`
- `nav-inner`
- `desktop-logo`
- `mobile-logo`
- `nav-btns`
- `mobile-hide-scrolled`

Run:

```bash
npm run lint
npm run build
```

## Phase 7: Extract Signature Path Parsing

Purpose: remove parsing logic from `App.jsx`.

Create:

```text
src/utils/signaturePaths.js
```

Move:

- `DOMParser` logic
- signature path grouping
- `SIG_PATHS` export

Current logic parses:

- main path
- underline path
- six path
- dots
- highlights

Keep behavior identical.

Potential issue:

`DOMParser` is browser-only. This is acceptable because Vite client code runs in the browser, but be careful if moving it into a module that might be evaluated during SSR. This project does not currently use SSR.

Run:

```bash
npm run lint
npm run build
```

## Phase 8: Extract Quote Section Markup

Purpose: simplify `App.jsx` while preserving GSAP refs.

Create:

```text
src/sections/QuoteSection.jsx
```

This component should receive refs as props:

```js
{
  quoteSectionRef,
  quoteRow1Ref,
  quoteRow2Ref,
  quoteRow3Ref,
  quoteRow4Ref
}
```

Keep exact class names:

- `quote-section`
- `quote-row`
- `quote-row-content`
- `message-text`
- `quote-text`
- `block-revealer`

Keep corrected text:

- `TO GET SOMETHING YOU,`
- `NEVER HAD`
- `YOU HAD TO DO SOMETHING YOU,`
- `NEVER DID`

Run:

```bash
npm run lint
npm run build
```

## Phase 9: Extract Signature Layer and Background Layers

Purpose: separate rendering layers from scroll orchestration.

Create:

```text
src/effects/SignatureLayer.jsx
src/effects/PhaseBackgrounds.jsx
src/effects/DeveloperSignaturePhase.jsx
```

### SignatureLayer

Props:

```js
{
  signatureLayerRef,
  signatureRef,
  sigPaths
}
```

Keep class names:

- `signature-layer`
- `signature-overlay`
- `sig-main`
- `sig-underline`
- `sig-six`
- `sig-main-rect`
- `sig-underline-rect`
- `sig-six-rect`

### PhaseBackgrounds

Can render:

- dark green `scroll-reveal-bg`
- animated wallpaper blobs
- phase 4 white overlay

Be cautious:

- `phase4BgRef` is used by GSAP.
- The dark background contains `ScrollVelocity`.

Props likely needed:

```js
{
  phase4BgRef,
  blobsBg
}
```

### DeveloperSignaturePhase

Props:

```js
{
  developerSignaturePhase3Ref,
  laurelWreathSrc,
  reactLogoSrc
}
```

Keep class:

- `developer-signature-phase3`

Run:

```bash
npm run lint
npm run build
```

## Phase 10: Keep Scroll Orchestration in App Initially

Do not aggressively extract the GSAP timelines until the rendering components are stable.

`App.jsx` should still own:

- top-level loading state
- menu state
- scroll state
- refs
- GSAP setup and cleanup
- communication between hero card hover and `ThreeDissolveHero`

This reduces the risk of breaking:

- `ScrollTrigger.refresh()`
- timeline cleanup
- resize/orientation behavior
- quote reveal timeline
- phase transitions

After previous phases, `App.jsx` should be much smaller even if it still owns the animation orchestration.

Run:

```bash
npm run lint
npm run build
```

## Phase 11: CSS Cleanup

Purpose: improve maintainability without changing design.

Safe first pass:

- keep `src/App.css`
- reorganize comment headings
- remove obsolete comments
- remove rules for deleted components
- ensure all class names still exist in source

Search CSS class usage:

```bash
rg "className=\"|className=\\{|className='" src
```

Optional second pass, only if safe:

```text
src/styles/base.css
src/styles/nav.css
src/styles/hero.css
src/styles/quote.css
src/styles/split.css
```

If splitting CSS:

- preserve import order
- keep Tailwind directives in one clear entry CSS file
- do not duplicate `@tailwind` directives

Important:

- Do not change colors, spacing, font sizes, or animation timings unless fixing a clear bug.
- Do not remove mobile media queries.

Run:

```bash
npm run lint
npm run build
```

## Phase 12: Placeholder Copy Cleanup

Purpose: remove misleading reference text while keeping unfinished areas editable.

Review:

- `src/sections/SplitSection.jsx`
- fullscreen menu labels
- comments in `App.jsx`
- comments in CSS

Replace clearly wrong placeholder copy with neutral project copy.

Suggested temporary copy:

For Eedoo side:

```text
Digital products, experiments, and tools shaped under the Eedoo name.
```

For Eyad side:

```text
Selected work, identity pieces, and creative development by Eyad Moneim.
```

Do not over-polish all content. This project is unfinished.

Run:

```bash
npm run lint
npm run build
```

## Phase 13: Performance Cleanup

Purpose: reduce initial bundle weight if it can be done safely.

First measure:

```bash
npm run build
```

If bundle warning remains, consider lazy loading:

```js
const ThreeDissolveHero = lazy(() => import("./ThreeDissolveHero"));
```

or after moving:

```js
const ThreeDissolveHero = lazy(() => import("./three/ThreeDissolveHero"));
```

Requirements:

- Do not introduce visible flicker.
- Do not break loading sequence.
- Use a minimal fallback, preferably `null`, if the loading screen already covers initial load.
- Verify that the hero still appears when loading completes.

If lazy loading causes layout shift or visual delay, revert this optimization and leave it as a documented future task.

Run:

```bash
npm run lint
npm run build
```

## Phase 14: README Cleanup

Replace default Vite README with real project documentation.

Include:

- Project name
- Short description
- Tech stack
- Run commands
- Build/lint commands
- Project structure
- Notes about animation systems
- External dependencies such as remote menu images if still used

Suggested README sections:

```md
# Eyad / Eedoo Portfolio Frontend

## Overview

## Tech Stack

## Getting Started

## Scripts

## Project Structure

## Animation Notes

## Asset Notes
```

Run:

```bash
npm run lint
npm run build
```

## Target Folder Structure

Aim for this structure after cleanup:

```text
src/
  App.jsx
  App.css
  index.css
  main.jsx
  LoadingScreen.jsx
  Logo.jsx
  assets/
  components/
    badges/
      DeveloperBadge.jsx
    icons/
      CurvedArrowIcon.jsx
      StoreIcon.jsx
    nav/
      CurrentLinkSVG.jsx
      FullscreenMenu.jsx
      HamburgerButton.jsx
      HeaderLogo.jsx
      HoverSplitText.jsx
      MenuImage.jsx
      Navbar.jsx
      StoreButton.jsx
      TextLogo.jsx
    ScrollVelocity.jsx
    ScrollVelocity.css
    SmoothScroll.jsx
  constants/
    animation.js
    colors.js
    menuData.js
  effects/
    DeveloperSignaturePhase.jsx
    PhaseBackgrounds.jsx
    SignatureLayer.jsx
  sections/
    HeroSection.jsx
    QuoteSection.jsx
    SplitSection.jsx
  three/
    ThreeDissolveHero.jsx
  utils/
    signaturePaths.js
```

This exact structure can be adjusted if the implementation discovers a simpler shape, but keep the intent:

- constants separate from components
- nav components grouped together
- animation/effect layers separated
- 3D code isolated
- sections isolated
- App controls orchestration

## Final Acceptance Criteria

The cleanup is complete only when all of these are true:

- `npm run lint` passes with 0 errors.
- `npm run build` passes.
- No empty source files remain.
- No debug `console.log` remains in UI interactions.
- `src/App.jsx` is substantially smaller and mostly orchestrates the app.
- `HeroSection.jsx` no longer imports from `App.jsx`.
- Unused components/constants are removed.
- Asset deletions are backed by search evidence.
- README describes the real project.
- The current visual experience is preserved.

## Final Report Required

At the end, provide a concise report:

- files changed
- files added
- files deleted
- lint result
- build result
- bundle warning status
- any manual visual QA still needed
- any intentionally deferred cleanup

