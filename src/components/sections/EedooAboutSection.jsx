import React, { useRef, useState, useLayoutEffect, useCallback, useEffect } from 'react';
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

// Project images
import eyadRobot from '../../assets/eyad-robot.avif';
import leftSide from '../../assets/left-side.avif';

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
    image: eyadRobot,
    href: '/eedoo',
  },
  {
    title: 'Eyad Moneim — Portfolio',
    desc: 'A creative developer portfolio featuring scroll-driven GSAP animations, split-panel layouts, custom transitions, and cinematic hero sections.',
    image: leftSide,
    href: '/eyad',
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

  const [activeStage, setActiveStage] = useState(0);
  const [activeProject, setActiveProject] = useState(0);

  // Scroll-to-stage on button click
  const scrollToStage = useCallback((index) => {
    const section = sectionRef.current;
    if (!section) return;
    const sectionTop = section.getBoundingClientRect().top + window.pageYOffset;
    const sectionHeight = section.offsetHeight;
    // Each stage occupies ~1/3 of the pin duration
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
    const moveY = prefersReduced ? 0 : 50;

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
      const orbitLogoItems = section.querySelectorAll('.eedoo-about__tech-orbit-position');
      gsap.set(orbitLogoItems, { autoAlpha: 0 });

      // Keep the globe beside the About copy, then bring it to the bottom-center
      // as the visitor scrolls into the stack section.
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
            if (p < 0.33) setActiveStage(0);
            else if (p < 0.66) setActiveStage(1);
            else setActiveStage(2);
          },
        },
      });

      tl.to(orbitTransformRef.current, {
        x: 0,
        y: window.innerHeight * 0.37,
        scale: 1.15,
        duration: 0.21,
        ease: 'power1.inOut',
      }, 0.12);
      tl.to(orbitLogosRef.current, {
        x: 0,
        y: '37vh',
        scale: 1.15,
        autoAlpha: 1,
        duration: 0.21,
        ease: 'power1.inOut',
      }, 0.12);
      tl.to(orbitLogoItems, {
        autoAlpha: 1,
        duration: 0.14,
        stagger: 0.006,
        ease: 'power1.out',
      }, 0.12);
      tl.to(orbitFadeRef.current, {
        autoAlpha: 1,
        duration: 0.2,
        ease: 'power1.out',
      }, 0.12);

      // ── Stage 1: About Me ──────────────────────────
      // Fade in (0% → 5%)
      tl.to(content1Ref.current, {
        autoAlpha: 1, y: 0, duration: 0.05, ease: 'power2.out',
      }, 0);
      // Start fading the About copy almost immediately after scroll begins.
      tl.to(content1Ref.current, {
        autoAlpha: 0, y: -moveY * 0.6, duration: 0.08, ease: 'power2.in',
      }, 0.15);

      // ── Stage 3: Projects ──────────────────────────
      // Fade in (66% → 73%)
      tl.to(content3Ref.current, {
        autoAlpha: 1, y: 0, duration: 0.07, ease: 'power2.out',
      }, 0.66);
      // Hold (73% → 95%)
      // Fade out (95% → 100%)
      tl.to(content3Ref.current, {
        autoAlpha: 0, y: -moveY * 0.4, duration: 0.05, ease: 'power2.in',
      }, 0.95);

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
                Creative <em>Developer</em><br />
                & CS Student
              </h2>
              <p className="eedoo-about__body">
                I'm <strong>Eyad Moneim</strong>, a Computer Science student 
                passionate about building experiences that live at the intersection 
                of <strong>design and engineering</strong>. I specialize in crafting 
                interactive web experiences, 3D visualizations, and AI-powered 
                interfaces that push the boundaries of what's possible in the browser.
              </p>
              <p className="eedoo-about__body">
                Every project is an opportunity to blend <strong>creative vision</strong> with 
                technical precision — from real-time WebGL rendering to scroll-driven 
                narratives that feel alive.
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

          {/* Stage 03 — Projects (left side) */}
          <div
            ref={content3Ref}
            className="eedoo-about__panel eedoo-about__panel--left"
          >
            <div 
              className="eedoo-about__panel-inner"
              style={{ pointerEvents: activeStage === 2 ? 'auto' : 'none' }}
            >
              <div className="eedoo-about__stage-label">03 — Work</div>
              <h2 className="eedoo-about__heading">
                Featured <em>Projects</em>
              </h2>

              {/* Project dots */}
              <div className="eedoo-about__project-dots">
                {PROJECTS.map((_, i) => (
                  <button
                    key={i}
                    className={`eedoo-about__project-dot ${i === activeProject ? 'eedoo-about__project-dot--active' : ''}`}
                    onClick={() => setActiveProject(i)}
                    aria-label={`View project ${i + 1}`}
                    type="button"
                  />
                ))}
              </div>

              <div className="eedoo-about__project">
                <div className="eedoo-about__project-preview">
                  <img
                    src={PROJECTS[activeProject].image}
                    alt={PROJECTS[activeProject].title}
                    loading="lazy"
                  />
                </div>
                <h3 className="eedoo-about__project-title">
                  {PROJECTS[activeProject].title}
                </h3>
                <p className="eedoo-about__project-desc">
                  {PROJECTS[activeProject].desc}
                </p>
                {PROJECTS[activeProject].href && (
                  <a
                    href={PROJECTS[activeProject].href}
                    className="eedoo-about__link"
                  >
                    View Project
                    <svg viewBox="0 0 12 12" fill="none" aria-hidden="true">
                      <path d="M1 11L11 1M11 1H3M11 1V9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </a>
                )}
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default EedooAboutSection;
