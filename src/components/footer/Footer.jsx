import React, { useRef, useLayoutEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import BackgroundBlobs from '../background/BackgroundBlobs';
import Magnetic from './Magnetic';
import HoverSplitText from '../nav/HoverSplitText';
import signatureSvg from '../../assets/signature.svg';
import personImg from '../../assets/eyad-human.avif';
import './Footer.css';

import angularLogo from '../../assets/tech-logos/angular.svg';
import animedotjsLogo from '../../assets/tech-logos/animedotjs.svg';
import cppLogo from '../../assets/tech-logos/c++.svg';
import cssLogo from '../../assets/tech-logos/css.svg';
import gsapLogo from '../../assets/tech-logos/gsap.svg';
import htmlLogo from '../../assets/tech-logos/html.svg';
import huggingFaceLogo from '../../assets/tech-logos/hugging-face.svg';
import javaLogo from '../../assets/tech-logos/java.svg';
import javascriptLogo from '../../assets/tech-logos/javascript.svg';
import neonLogo from '../../assets/tech-logos/neon.svg';
import nextjsLogo from '../../assets/tech-logos/nextjs.svg';
import nodeJsLogo from '../../assets/tech-logos/node-js.svg';
import pythonLogo from '../../assets/tech-logos/python.svg';
import reactLogo from '../../assets/tech-logos/react.svg';
import restApiIconLogo from '../../assets/tech-logos/rest-api-icon.svg';
import tailwindCssLogo from '../../assets/tech-logos/tailwind-css.svg';
import threejsLogo from '../../assets/tech-logos/threejs.svg';
import typescriptLogo from '../../assets/tech-logos/typescript.svg';
import { useEedooTransition } from '../transitions/EedooTransition';
import { useEyadTransition } from '../transitions/EyadTransition';

gsap.registerPlugin(ScrollTrigger);

/* ── Structured data ────────────────────────────────── */
const pageLinks = [
  { label: 'HOME', href: '/' },
  { label: 'EYAD MONEIM', href: '/eyad' },
  { label: 'EEDOO', href: '/eedoo' },
];

const socialLinks = [
  { label: 'GITHUB', href: 'https://github.com/EyadMoneim' },
  { label: 'LINKEDIN', href: 'https://www.linkedin.com/in/eyad-moneim-3041bb256/' },
  { label: 'INSTAGRAM', href: 'https://www.instagram.com/eyadmoneim/' },
];

const sponsorLogos = [
  angularLogo, animedotjsLogo, cppLogo, cssLogo, gsapLogo, htmlLogo,
  huggingFaceLogo, javaLogo, javascriptLogo, neonLogo, nextjsLogo,
  nodeJsLogo, pythonLogo, reactLogo, restApiIconLogo, tailwindCssLogo,
  threejsLogo, typescriptLogo
];

/* ── Component ──────────────────────────────────────── */
const Footer = () => {
  const footerRef = useRef(null);
  const { navigateWithTransition: navigateToEedoo } = useEedooTransition();
  const { navigateWithTransition: navigateToEyad } = useEyadTransition();

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const revealGroups = gsap.utils.toArray('.footer-reveal-group');
      if (!revealGroups.length) return;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: footerRef.current,
          start: 'top 75%',
          once: true,
        }
      });

      revealGroups.forEach((group, index) => {
        const content = group.querySelector('.footer-reveal-content');
        const block = group.querySelector('.footer-block-revealer');
        if (!content || !block) return;
        
        gsap.set(content, { opacity: 0 });
        gsap.set(block, { scaleX: 0, transformOrigin: 'left center' });
        
        const delay = index * 0.15;
        
        tl.to(block, { scaleX: 1, duration: 0.45, ease: "power4.inOut" }, delay);
        tl.set(content, { opacity: 1 }, delay + 0.45);
        tl.set(block, { transformOrigin: 'right center' }, delay + 0.45);
        tl.to(block, { scaleX: 0, duration: 0.45, ease: "power4.inOut" }, delay + 0.45);
      });
    }, footerRef);

    return () => ctx.revert();
  }, []);

  return (
    <footer className="footer-container" id="footer" ref={footerRef}>

      {/* ─ Inner dark shell ─ */}
      <div className="footer-shell">

        {/* Contour background */}
        <div className="footer-bg">
          <BackgroundBlobs className="footer-contours" />
        </div>

        {/* ─ Brand lockup (optional top signature) ─ */}
        <div className="footer-brand-lockup" aria-hidden="true">
          <img src={signatureSvg} alt="" className="footer-signature-top" />
        </div>

        {/* ─ Three-column grid ─ */}
        <div className="footer-content-grid">

          {/* Left — pages */}
          <nav className="footer-col footer-col--left" aria-label="Footer pages">
            <span className="col-header">PAGES</span>
            <ul className="footer-link-list">
              {pageLinks.map((l) => (
                <li key={l.label} className="footer-reveal-group" style={{ position: 'relative', width: 'max-content' }}>
                  <div className="footer-block-revealer" style={{ position: 'absolute', top: 0, bottom: 0, left: '-4px', right: '-4px', backgroundColor: '#b084ff', zIndex: 10 }} />
                  <div className="footer-reveal-content">
                    <a 
                      href={l.href}
                      onClick={(e) => {
                        if (l.href.startsWith('/')) {
                          e.preventDefault();
                          if (l.href === '/eedoo' || l.href === '/') {
                            navigateToEedoo(l.href);
                          } else if (l.href === '/eyad') {
                            navigateToEyad(l.href);
                          }
                        }
                      }}
                    >
                      <HoverSplitText text={l.label} />
                    </a>
                  </div>
                </li>
              ))}
              
            </ul>
          </nav>

          {/* Center — hero */}
          <div className="footer-col footer-col--center">
            <div className="footer-hero">
              {/* Removed signature as requested */}

              {/* Headline */}
              <h2 className="footer-hero-heading">
                <span className="hw">ALWAYS</span>{' '}
                <span className="hl serif-italic">BRINGING</span>
                <br />
                <span className="hw">THE</span>{' '}
                <span className="hl serif-italic">FIGHT.</span>
              </h2>

              {/* Removed Person / helmet as requested */}
            </div>
          </div>

          {/* Right — socials */}
          <nav className="footer-col footer-col--right" aria-label="Social links">
            <span className="col-header">LET'S CONNECT</span>
            <ul className="footer-link-list">
              {socialLinks.map((l) => (
                <li key={l.label} className="footer-reveal-group" style={{ position: 'relative', width: 'max-content' }}>
                  <div className="footer-block-revealer" style={{ position: 'absolute', top: 0, bottom: 0, left: '-4px', right: '-4px', backgroundColor: '#b084ff', zIndex: 10 }} />
                  <div className="footer-reveal-content">
                    <a href={l.href} target="_blank" rel="noopener noreferrer"><HoverSplitText text={l.label} /></a>
                  </div>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* ─ Sponsor strip ─ */}
        <div className="footer-sponsor-strip" aria-label="Sponsors">
          <div className="footer-sponsor-track">
            {sponsorLogos.map((logo, idx) => (
              <div className="sponsor-mark" key={`logo-1-${idx}`}>
                <img src={logo} alt="Tech Logo" />
              </div>
            ))}
            {sponsorLogos.map((logo, idx) => (
              <div className="sponsor-mark" key={`logo-2-${idx}`}>
                <img src={logo} alt="Tech Logo" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ─ Bottom lime legal bar ─ */}
      <div className="footer-legal-bar">
        <span className="legal-left">
          &copy; {new Date().getFullYear()} Eyad Moneim. All rights reserved
        </span>

        <Magnetic>
          <a href="mailto:eyad.moneim@gmail.com" className="business-btn">
            BUSINESS ENQUIRIES
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
              <path d="M1 11L11 1M11 1H3M11 1V9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </a>
        </Magnetic>

        <span className="legal-right">
        </span>
      </div>
    </footer>
  );
};

export default Footer;
