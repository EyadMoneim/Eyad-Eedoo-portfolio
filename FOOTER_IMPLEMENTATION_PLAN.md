# Footer Implementation Plan

## Goal

Build the site footer to match the provided Lando Norris inspired references:

- Full viewport dark footer section.
- Soft lime outer frame / bottom dock.
- Organic contour-line background.
- Large centered headline: `ALWAYS BRINGING THE FIGHT.`
- Lime script signature above the headline.
- Central portrait/helmet-style visual rising from the bottom.
- Left page navigation and right social links.
- Sponsor/logo strip near the bottom.
- Bottom lime legal bar with copyright, business enquiries button, privacy policy, and terms.
- Responsive layout that keeps the same visual identity on tablet and mobile.

## Current Project Context

Existing footer files:

- `src/components/footer/Footer.jsx`
- `src/components/footer/Footer.css`
- `src/components/footer/Magnetic.jsx`

Reusable project pieces:

- `src/components/background/BackgroundBlobs.jsx`
- `src/assets/wallpaper.svg`
- `src/assets/signature.svg`
- `src/components/nav/StoreButton.jsx`
- `src/components/nav/HamburgerButton.jsx`
- `src/components/nav/TextLogo.jsx`
- CSS variables in `src/App.css`

Current gaps:

- Footer already has a similar structure, but the center visual is only a placeholder.
- Footer copy uses portfolio labels instead of the target reference labels.
- Bottom bar colors and layout are close, but the lime frame/docked shape needs more accurate styling.
- Sponsor strip is missing.
- Desktop/mobile layout needs to be designed around the screenshot instead of generic column stacking.
- There are encoding issues in `Footer.jsx` for copyright and arrow characters.

## Visual Targets

### Desktop

- Footer height: `100vh` minimum.
- Outer page background: lime accent, visible as a frame around the footer.
- Inner footer panel: dark green/near-black with large rounded top/bottom cutouts.
- Header/nav can remain fixed above it, but footer must visually sit beneath it cleanly.
- Left column:
  - Label: `PAGES`
  - Links: `HOME`, `ON TRACK`, `OFF TRACK`, `CALENDAR`
  - Lime link: `STORE`
- Right column:
  - Label: `FOLLOW ON`
  - Links: `TIKTOK`, `INSTAGRAM`, `YOUTUBE`, `TWITCH`
- Center:
  - Signature image/SVG positioned above headline.
  - Headline split over two rows:
    - `ALWAYS` white + `BRINGING` lime serif
    - `THE` white + `FIGHT.` lime serif
  - Central person/helmet image layered in front of the headline and cropped at the footer bottom.
- Bottom:
  - Sponsor/logo row above the lime bar.
  - Lime legal bar with:
    - `© 2026 Eyad Moneim. All rights reserved`
    - centered `BUSINESS ENQUIRIES` button
    - `PRIVACY POLICY`
    - `TERMS`

### Mobile / Tablet

- Keep footer tall and immersive.
- Center headline becomes the primary element.
- Side nav/social columns stack below or around center content without overlap.
- Central image scales down and remains anchored to the bottom.
- Bottom legal bar stacks into readable rows.
- Sponsor strip becomes horizontally scrollable or wraps into compact rows.

## Asset Plan

### Required Assets

Add these if exact visuals are needed:

- `src/assets/footer-person.avif` or `.png`
  - Transparent or cleanly cut-out portrait/helmet replacement.
  - This is the biggest missing piece for matching the screenshot.
- Optional sponsor logos:
  - `src/assets/sponsors/google.svg`
  - `src/assets/sponsors/ralph-lauren.svg`
  - `src/assets/sponsors/android.svg`
  - `src/assets/sponsors/uber.svg`
  - `src/assets/sponsors/quadrant.svg`
  - Or replace with real portfolio/brand logos if this is not a Lando clone.

### Reuse Existing Assets

- Use `src/assets/wallpaper.svg` through `BackgroundBlobs` for the contour pattern.
- Use `src/assets/signature.svg` if it visually matches the desired script mark.

## Implementation Steps

### 1. Normalize Footer Data

Create structured data inside `Footer.jsx`:

- `pageLinks`
- `socialLinks`
- `sponsorLogos`
- `legalLinks`

This keeps JSX clean and makes future text/link changes easy.

### 2. Update Footer JSX Structure

Recommended structure:

```jsx
<footer className="footer">
  <div className="footer-shell">
    <BackgroundBlobs className="footer-contours" />

    <div className="footer-brand-lockup">...</div>

    <div className="footer-content-grid">
      <FooterLinkColumn />
      <FooterHero />
      <FooterLinkColumn />
    </div>

    <SponsorStrip />
  </div>

  <div className="footer-legal-bar">...</div>
</footer>
```

Keep it in one file first. Split into subcomponents only if the JSX becomes noisy.

### 3. Build the Center Hero

Center hero layers:

1. Signature layer:
   - Absolute positioned above headline.
   - Lime color/filter.
   - Slight rotation.
2. Headline layer:
   - Big uppercase sans for white words.
   - Serif display for lime words.
3. Person image layer:
   - Absolute bottom center.
   - Higher z-index than the headline.
   - `object-fit: contain`.
   - Use `pointer-events: none`.

Fallback if no portrait asset exists:

- Use the existing abstract placeholder temporarily.
- Add a clear TODO comment in the plan only, not inside code unless needed.

### 4. Style the Footer Shell

In `Footer.css`:

- Rename current classes only if needed; otherwise update existing names to reduce churn.
- Set the outer footer background to lime.
- Add a dark inner `.footer-shell`.
- Use `border-radius` / pseudo-elements to create the top center dip shown in reference image #2.
- Use `overflow: hidden` on the shell so the image crop is controlled.

Suggested CSS direction:

```css
.footer-container {
  position: relative;
  min-height: 100vh;
  background: var(--color-lime);
  padding: clamp(0.75rem, 1.2vw, 1.4rem);
}

.footer-shell {
  position: relative;
  min-height: calc(100vh - 2rem);
  overflow: hidden;
  background: var(--color-dark-green);
  border-radius: 0 0 2rem 2rem;
}
```

Use pseudo-elements for the top-center notch if the screenshot #2 style is required.

### 5. Add Sponsor Strip

Add a row pinned near the lower part of `.footer-shell`, above the legal bar:

- Desktop: spaced evenly across full width.
- Mobile: horizontal scroll with hidden scrollbar or two-row wrap.
- Logos should be monochrome lime/off-white.
- If using text placeholders, style them as sponsor marks until real SVGs are added.

### 6. Refine Bottom Legal Bar

Target behavior:

- Lime background.
- Dark text.
- Left copyright.
- Center business button.
- Right legal links.
- On mobile, stack into three rows.

Fix encoding:

- Replace `Â©` with `©` or `&copy;`.
- Replace `â†—` with a plain text arrow, SVG icon, or `↗`.

If keeping ASCII only:

- Use `(c)` and `->`.

### 7. Responsive Rules

Breakpoints:

- Desktop: `min-width: 1025px`
- Tablet: `768px - 1024px`
- Mobile: `< 768px`

Desktop:

- Three-column layout.
- Center column dominates.
- Side columns sit around vertical middle.

Tablet:

- Headline scales down.
- Person image width around `min(58vw, 520px)`.
- Side columns remain left/right if space allows.

Mobile:

- Footer shell minimum height can become `110vh` or `120vh`.
- Headline uses tighter `clamp`.
- Nav/social columns move below headline or into a two-column row.
- Sponsor strip becomes scrollable.
- Legal bar stacks.

### 8. Animation / Interaction

Optional, after static match is good:

- Use existing `Magnetic.jsx` for `BUSINESS ENQUIRIES`.
- Add hover split text only if it matches the rest of the site.
- Keep background motion via `BackgroundBlobs`.
- Add subtle image parallax only after layout is stable.

### 9. Accessibility

- Use real links with descriptive `aria-label` where needed.
- Decorative background and person image can use empty alt text if not meaningful.
- Keep footer navigation inside `<nav aria-label="Footer pages">`.
- Keep social links inside `<nav aria-label="Social links">`.
- Business enquiry link should use a real `mailto:` or route.

### 10. Verification Checklist

Run:

```bash
npm run lint
npm run build
npm run dev
```

Manual QA:

- Check footer at desktop width: `1920x1080`.
- Check laptop width: `1440x900`.
- Check tablet width: `768x1024`.
- Check mobile width: `390x844`.
- Confirm no text overlaps the center visual.
- Confirm footer does not hide behind fixed navbar.
- Confirm bottom bar is visible and readable.
- Confirm sponsor strip does not collide with the person image.
- Confirm links have hover states.

## Suggested Work Order

1. Add or choose the center footer visual asset.
2. Rewrite footer markup around the target layout.
3. Rebuild desktop CSS until it matches the screenshots.
4. Add sponsor strip.
5. Add tablet/mobile responsive rules.
6. Add hover/interactions.
7. Run lint/build and visual QA.

## Acceptance Criteria

- Footer visually matches the two provided references in composition and spacing.
- Existing app sections still scroll into the footer correctly.
- No broken imports or missing assets.
- Footer is responsive across desktop, tablet, and mobile.
- The implementation uses existing project fonts, color variables, and background component.
- `npm run build` completes successfully.

