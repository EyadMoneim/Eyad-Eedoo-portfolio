import React, { useRef, useState, useLayoutEffect, useCallback } from 'react';
import { OrbitalSphereBackground } from '../../shaders/orbital-sphere/OrbitalSphereBackground';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './EedooAboutSection.css';

// Tech logos
import reactLogo from '../../assets/tech-logos/react.svg';
import javascriptLogo from '../../assets/tech-logos/javascript.svg';
import threejsLogo from '../../assets/tech-logos/threejs.svg';
import gsapLogo from '../../assets/tech-logos/gsap.svg';
import nextjsLogo from '../../assets/tech-logos/nextjs.svg';
import typescriptLogo from '../../assets/tech-logos/typescript.svg';
import pythonLogo from '../../assets/tech-logos/python.svg';
import nodeJsLogo from '../../assets/tech-logos/node-js.svg';
import tailwindCssLogo from '../../assets/tech-logos/tailwind-css.svg';
import cppLogo from '../../assets/tech-logos/c++.svg';
import figmaLogo from '../../assets/tech-logos/figma.svg';
import swaggerLogo from '../../assets/tech-logos/rest-api-icon.svg';
import javaLogo from '../../assets/tech-logos/java.svg';
import animeJsLogo from '../../assets/tech-logos/animedotjs.svg';
import angularLogo from '../../assets/tech-logos/angular.svg';
import cssLogo from '../../assets/tech-logos/css.svg';
import htmlLogo from '../../assets/tech-logos/html.svg';
import neonLogo from '../../assets/tech-logos/neon.svg';
import huggingFaceLogo from '../../assets/tech-logos/hugging-face.svg';

gsap.registerPlugin(ScrollTrigger);

/* ── Data ──────────────────────────────────────────────── */
const TECH_ORBITS = [
  { category: 'Tools', size: 'inner', direction: 'cw', duration: 42, technologies: [
    { name: 'Figma', icon: figmaLogo },
    { name: 'Swagger', icon: swaggerLogo },
    { name: 'GSAP', icon: gsapLogo },
    { name: 'Anime.js', icon: animeJsLogo },
    { name: 'Hugging Face', icon: huggingFaceLogo },
  ] },
  { category: 'Back-end', size: 'middle', direction: 'ccw', duration: 34, technologies: [
    { name: 'Node.js', icon: nodeJsLogo },
    { name: 'Python', icon: pythonLogo },
    { name: 'Java', icon: javaLogo },
    { name: 'C++', icon: cppLogo },
    { name: 'Neon', icon: neonLogo },
  ] },
  { category: 'Front-end', size: 'outer', direction: 'cw', duration: 26, technologies: [
    { name: 'React', icon: reactLogo },
    { name: 'JavaScript', icon: javascriptLogo },
    { name: 'TypeScript', icon: typescriptLogo },
    { name: 'Next.js', icon: nextjsLogo },
    { name: 'Three.js', icon: threejsLogo },
    { name: 'Tailwind CSS', icon: tailwindCssLogo },
    { name: 'Angular', icon: angularLogo },
    { name: 'HTML', icon: htmlLogo },
    { name: 'CSS', icon: cssLogo },
  ] },
];

const PROJECTS = [
  {
    title: 'Eedoo — AI Assistant',
    desc: 'An interactive 3D robot assistant built with React Three Fiber, complete with facial expressions, drag-to-spin interaction, and a conversational chat interface.',
    href: '/eedoo',
    kind: 'AI / INTERACTIVE',
  },
  {
    title: 'Eedoo — 3D Robot',
    desc: 'A character-led 3D experience with expressive reactions, an orbiting view, and a playful interface built around the Eedoo robot.',
    href: '/eedoo',
    kind: '3D / REACT THREE FIBER',
  },
  {
    title: 'Eyad Moneim — Portfolio',
    desc: 'A creative developer portfolio featuring scroll-driven GSAP animations, split-panel layouts, custom transitions, and cinematic hero sections.',
    href: '/eyad',
    kind: 'PORTFOLIO / CREATIVE CODE',
  },
  {
    title: 'Scroll-driven Stories',
    desc: 'A motion-focused portfolio experience where scroll reveals, layered scenes, and custom transitions bring the work to life.',
    href: '/eyad',
    kind: 'MOTION / GSAP',
  },
];

/* ── Component ─────────────────────────────────────────── */
const EedooAboutSection = () => {
  const sectionRef = useRef(null);
  const pinWrapRef = useRef(null);
  const orbitLogosRef = useRef(null);
  const orbitTransformRef = useRef({ x: 0, y: 0, scale: 0.57 });
  const orbitFadeRef = useRef(null);
  const content1Ref = useRef(null);
  const content3Ref = useRef(null);
  const aboutHighlightRef = useRef(null);
  const projectConnectionsRef = useRef(null);

  const [activeStage, setActiveStage] = useState(0);
  const [activeProject, setActiveProject] = useState(0);

  // Scroll-to-stage on button click
  const scrollToStage = useCallback((index) => {
    const section = sectionRef.current;
    if (!section) return;
    const sectionTop = section.getBoundingClientRect().top + window.pageYOffset;
    const sectionHeight = section.offsetHeight;
    // Each stage occupies ~1/3 of the pin duration.
    const stageOffset = (sectionHeight - window.innerHeight) * (index / 3);
    window.scrollTo({
      top: sectionTop + stageOffset + 50,
      behavior: 'smooth',
    });
  }, []);

  // GSAP ScrollTrigger — pin the orbit, animate content in/out
  useLayoutEffect(() => {
    const section = sectionRef.current;
    const pinWrap = pinWrapRef.current;
    if (!section || !pinWrap) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const moveY = prefersReduced ? 0 : 36;

    const isWideDesktop = window.innerWidth >= 1440;
    const isDesktop = window.innerWidth >= 1024;
    const isTablet = window.innerWidth >= 768;
    const startX = prefersReduced
      ? 0
      : window.innerWidth * (isWideDesktop ? 0.25 : (isDesktop ? 0.23 : (isTablet ? 0.14 : 0)));

    const ctx = gsap.context(() => {
      // Initial states: all content hidden with autoAlpha (sets visibility: hidden)
      gsap.set(content1Ref.current, { autoAlpha: 0, y: moveY });
      gsap.set(content3Ref.current, { autoAlpha: 0, y: moveY });
      gsap.set(orbitFadeRef.current, { autoAlpha: 0 });
      gsap.set(projectConnectionsRef.current, { autoAlpha: 0 });
      if (aboutHighlightRef.current) gsap.set(aboutHighlightRef.current, { strokeDashoffset: 1 });
      gsap.set(content3Ref.current?.querySelectorAll('.eedoo-about__project-card'), { autoAlpha: 0 });
      const orbitLogoItems = section.querySelectorAll('.eedoo-about__tech-orbit-position');
      gsap.set(orbitLogoItems, { autoAlpha: 0 });

      // Start beside the About copy, reveal the cropped stack orbit, then
      // return the clean sphere to center behind the project grid.
      gsap.set(orbitTransformRef.current, { x: startX, y: 0, scale: 0.57 });
      gsap.set(orbitLogosRef.current, { x: startX, y: 0, scale: 0.57 });

      // Master timeline pinned to section, scrubbed by scroll
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: '+=300%',
          pin: pinWrap,
          scrub: true,
          anticipatePin: 1,
          onUpdate: (self) => {
            const p = self.progress;
            if (p < 0.31) setActiveStage(0);
            else if (p < 0.70) setActiveStage(1);
            else setActiveStage(2);
          },
        },
      });

      tl.to(orbitTransformRef.current, {
        x: 0,
        y: window.innerHeight * 0.37,
        scale: 1.15,
        duration: 0.16,
        ease: 'power1.inOut',
      }, 0.27);
      tl.to(orbitLogosRef.current, {
        x: 0,
        y: '37vh',
        scale: 1.15,
        autoAlpha: 1,
        duration: 0.16,
        ease: 'power1.inOut',
      }, 0.27);
      tl.to(orbitLogoItems, {
        autoAlpha: 1,
        duration: 0.1,
        stagger: 0.002,
        ease: 'power1.out',
      }, 0.34);
      tl.to(orbitFadeRef.current, {
        autoAlpha: 1,
        duration: 0.16,
        ease: 'power1.out',
      }, 0.34);

      // ── Stage 1: About Me ──────────────────────────
      // Fade in (0% → 5%)
      tl.to(content1Ref.current, {
        autoAlpha: 1, y: 0, duration: 0.05, ease: 'power2.out',
      }, 0);
      tl.to(content1Ref.current, {
        autoAlpha: 0, y: -moveY * 0.6, duration: 0.08, ease: 'power2.in',
      }, 0.25);

      // Let the About copy settle after scroll begins, then draw its underline
      // independently so it has a deliberate pause and a slower left-to-right reveal.
      if (aboutHighlightRef.current) {
        ScrollTrigger.create({
          trigger: section,
          start: 'top top',
          onEnter: () => {
            gsap.killTweensOf(aboutHighlightRef.current);
            gsap.set(aboutHighlightRef.current, { strokeDashoffset: 1 });
            gsap.to(aboutHighlightRef.current, {
              strokeDashoffset: 0,
              delay: 2,
              duration: 2.8,
              ease: 'none',
              overwrite: true,
            });
          },
          onEnterBack: () => {
            gsap.killTweensOf(aboutHighlightRef.current);
            gsap.set(aboutHighlightRef.current, { strokeDashoffset: 1 });
            gsap.to(aboutHighlightRef.current, {
              strokeDashoffset: 0,
              delay: 2,
              duration: 2.8,
              ease: 'none',
              overwrite: true,
            });
          },
          onLeaveBack: () => {
            gsap.killTweensOf(aboutHighlightRef.current);
            gsap.set(aboutHighlightRef.current, { strokeDashoffset: 1 });
          },
        });
      }

      // ── Stage 3: clean, reduced orbital sphere ──────
      tl.to(orbitTransformRef.current, {
        x: 0, y: 0, scale: window.innerWidth < 768 ? 0.56 : 0.72,
        duration: 0.13, ease: 'power1.inOut',
      }, 0.73);
      tl.to(orbitLogosRef.current, {
        x: 0, y: 0, scale: 0.72, autoAlpha: 0,
        duration: 0.11, ease: 'power1.inOut',
      }, 0.73);

      // ── Projects ───────────────────────────────────
      tl.to(content3Ref.current, {
        autoAlpha: 1, y: 0, duration: 0.07, ease: 'power2.out',
      }, 0.78);
      tl.to(projectConnectionsRef.current, { autoAlpha: 1, duration: 0.04 }, 0.80);
      tl.to(content3Ref.current?.querySelectorAll('.eedoo-about__project-card'), {
        autoAlpha: 1,
        duration: 0.09,
        stagger: 0.025,
        ease: 'power2.out',
      }, 0.84);
      tl.to(content3Ref.current, {
        autoAlpha: 0, y: -moveY * 0.4, duration: 0.05, ease: 'power2.in',
      }, 0.98);

    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="eedoo-about"
      aria-label="About Eyad Moneim"
    >
      {/* Pinned wrapper — this entire viewport-sized container stays pinned */}
      <div ref={pinWrapRef} className="eedoo-about__pin-wrap">

        {/* Persistent Orbit Background */}
        <div className="eedoo-about__orbit-layer">
          <OrbitalSphereBackground
            transformRef={orbitTransformRef}
            speed={2.16}
            particleSize={0.019}
            particleOpacity={0.80}
            orbitOpacity={0.25}
            hue={-23}
            scale={1.05}
            haloOpacity={0.18}
          />
          <div ref={orbitLogosRef} className="eedoo-about__orbit-tracks" aria-label="Orbiting technology logos">
            {TECH_ORBITS.map((orbit) => (
              <div
                key={orbit.category}
                className={`eedoo-about__tech-orbit eedoo-about__tech-orbit--${orbit.size} eedoo-about__tech-orbit--${orbit.direction}`}
                style={{ '--orbit-duration': `${orbit.duration}s` }}
                aria-label={orbit.category}
              >
                {orbit.technologies.map((tech, index) => {
                  const angle = (360 / orbit.technologies.length) * index;
                  return (
                    <div
                      key={tech.name}
                      className="eedoo-about__tech-orbit-position"
                      style={{ '--logo-angle': `${angle}deg`, '--counter-angle': `${-angle}deg` }}
                      title={tech.name}
                    >
                      <div className="eedoo-about__tech-orbit-badge">
                        <img
                          src={tech.icon}
                          alt={tech.name}
                          className={tech.name === 'Figma' ? 'eedoo-about__tech-orbit-logo--figma' : ''}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        <div ref={orbitFadeRef} className="eedoo-about__orbit-fade" aria-hidden="true" />

        <svg ref={projectConnectionsRef} className="eedoo-about__project-connections" viewBox="0 0 1000 1000" preserveAspectRatio="none" aria-hidden="true">
          <path className="eedoo-about__connector-line animated-robot-line" d="M 470 470 C 420 405, 355 340, 300 300" />
          <path className="eedoo-about__connector-line animated-robot-line" d="M 530 470 C 580 405, 645 340, 700 300" />
          <path className="eedoo-about__connector-line animated-robot-line" d="M 470 530 C 415 595, 350 665, 300 700" />
          <path className="eedoo-about__connector-line animated-robot-line" d="M 530 530 C 585 595, 650 665, 700 700" />
          <circle className="eedoo-about__connector-origin" cx="470" cy="470" r="3" />
          <circle className="eedoo-about__connector-origin" cx="530" cy="470" r="3" />
          <circle className="eedoo-about__connector-origin" cx="470" cy="530" r="3" />
          <circle className="eedoo-about__connector-origin" cx="530" cy="530" r="3" />
        </svg>

        {/* Content layers — only one visible at a time */}
        <div className="eedoo-about__content-layer">

          {/* Stage 01 — About Me (left side) */}
          <div
            ref={content1Ref}
            className="eedoo-about__panel eedoo-about__panel--left"
          >
            <div 
              className="eedoo-about__panel-inner"
              style={{ pointerEvents: activeStage === 0 ? 'auto' : 'none' }}
            >
              <div className="eedoo-about__stage-label">01 — About</div>
              <h2 className="eedoo-about__heading">
                Human with <span className="eedoo-about__highlight-word"><em>ideas.</em><svg viewBox="0 0 150 20" preserveAspectRatio="none" aria-hidden="true"><path ref={aboutHighlightRef} pathLength="1" d="M3 15 C39 5 88 4 146 12" /></svg></span><br />
                AI with <em>attitude.</em>
              </h2>
              <p className="eedoo-about__body">
                I'm <strong>Eyad</strong>. The human behind the screen, the questionable ideas, and the occasional <strong>3 AM experiments</strong>.
              </p>
              <p className="eedoo-about__body">
                I build <strong>interactive experiences</strong>, play with <strong>3D</strong>, and make the browser do things it probably wasn't designed for.
              </p>
              <p className="eedoo-about__body">
                <strong>Frontend?</strong> That's my playground.<br />
                <strong>Creative coding?</strong> That's where things get interesting.<br />
                <strong>AI?</strong> Let's just say we get along pretty well.
              </p>
              <p className="eedoo-about__body">
                I like turning random <em>&ldquo;what if?&rdquo;</em> moments into things you can actually <strong>click, explore, and experience</strong>.
              </p>
              <p className="eedoo-about__body">
                I bring the ideas. I handle the execution. <strong>EEDOO</strong> takes the credit.
              </p>
              <button
                className="eedoo-about__link"
                onClick={() => scrollToStage(1)}
                type="button"
              >
                Explore my stack
                <svg viewBox="0 0 12 12" fill="none" aria-hidden="true">
                  <path d="M1 6h10M7 2l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
          </div>

          {/* Stage 03 — Projects connected to the orbital hub */}
          <div
            ref={content3Ref}
            className="eedoo-about__projects-stage"
          >
            <div className="eedoo-about__projects-heading">
              <div className="eedoo-about__stage-label">03 — Work</div>
              <h2 className="eedoo-about__heading">
                Featured <em>Projects</em>
              </h2>
            </div>

            <div className="eedoo-about__projects-grid" style={{ pointerEvents: activeStage === 2 ? 'auto' : 'none' }}>
              {PROJECTS.map((project, i) => (
                <article
                  key={project.title}
                  className={`eedoo-about__project-card robot-tooltip ${i % 2 === 0 ? 'float-anim-1' : 'float-anim-2'} ${i === activeProject ? 'eedoo-about__project-card--active' : ''}`}
                  onMouseEnter={() => setActiveProject(i)}
                  onFocusCapture={() => setActiveProject(i)}
                >
                  <div className="tooltip-content eedoo-about__project-card-copy">
                    <span className="eedoo-about__project-index">0{i + 1} — {project.kind}</span>
                    <div className="tooltip-title">{project.title}</div>
                    <div className="tooltip-subtitle eedoo-about__project-desc">{project.desc}</div>
                  </div>
                  <a href={project.href} className="tooltip-btn" aria-label={`View ${project.title}`}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#F4F4ED" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <line x1="5" y1="12" x2="19" y2="12" />
                      <polyline points="12 5 19 12 12 19" />
                    </svg>
                  </a>
                </article>
              ))}
            </div>

            <nav className="eedoo-about__project-nav" aria-label="Choose a featured project">
              <button type="button" onClick={() => setActiveProject((activeProject + PROJECTS.length - 1) % PROJECTS.length)} aria-label="Previous project">
                <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M19 12H5m0 0 6-6m-6 6 6 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </button>
              <span>0{activeProject + 1} <i /> 0{PROJECTS.length}</span>
              <button type="button" onClick={() => setActiveProject((activeProject + 1) % PROJECTS.length)} aria-label="Next project">
                <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 12h14m0 0-6-6m6 6-6 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </button>
            </nav>
          </div>

        </div>
      </div>
    </section>
  );
};

export default EedooAboutSection;
