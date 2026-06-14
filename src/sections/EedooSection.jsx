import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import signatureSrc from '../assets/signature.svg';

gsap.registerPlugin(ScrollTrigger);

export default function EedooSection() {
  const sectionRef = useRef(null);
  const marqueeRef = useRef(null);
  const clipRectRef = useRef(null);

  useEffect(() => {
    const section = sectionRef.current;
    const marquee = marqueeRef.current;
    const clipRect = clipRectRef.current;

    if (!section || !marquee || !clipRect) return;

    let pinnedSt = null;

    // Wait TWO animation frames to guarantee layout is complete
    const rafId = requestAnimationFrame(() => {
      requestAnimationFrame(() => {

        // ─── Pinned sequence (marquee + signature) ───
        pinnedSt = ScrollTrigger.create({
          trigger: section,
          start: 'top top',
          end: '+=200%',
          pin: true,
          pinType: 'transform',
          scrub: 1,
          animation: gsap
            .timeline()
            // Marquee crawls to the left
            .to(marquee, { xPercent: -30, ease: 'none', duration: 1 }, 0)
            // Signature wipes in from left to right
            .to(
              clipRect,
              { attr: { width: 1 }, ease: 'power2.inOut', duration: 0.5 },
              0.2
            ),
        });
      });
    });

    return () => {
      cancelAnimationFrame(rafId);
      if (pinnedSt) pinnedSt.kill();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="signature-section"
      style={{
        position: 'relative',
        width: '100%',
        height: '100vh',
        backgroundColor: '#282c20',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {/* ============================================
          Z: 0 | Deep Background Marquee Typography
          ============================================ */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          pointerEvents: 'none',
        }}
      >
        <h1
          ref={marqueeRef}
          style={{
            fontSize: '18vw',
            fontFamily: "'Playfair Display', serif",
            fontWeight: 900,
            whiteSpace: 'nowrap',
            color: '#dde1d2',
            opacity: 0.12,
            willChange: 'transform',
            userSelect: 'none',
            lineHeight: 1,
          }}
        >
          CREATIVE DEVELOPER &nbsp;&nbsp;&nbsp; CREATIVE DEVELOPER
        </h1>
      </div>

      {/* ============================================
          Z: 5 | Canvas Target (position anchor only)
          ============================================ */}
      <div
        id="eedoo-canvas-target"
        className="eedoo-canvas-target"
      />

      {/* ============================================
          Z: 10 | Stable Signature Reveal (Wiped)
          ============================================ */}
      <div
        style={{
          position: 'absolute',
          zIndex: 10,
          width: '90vw',
          maxWidth: '800px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          pointerEvents: 'none',
        }}
      >
        <svg style={{ position: 'absolute', width: 0, height: 0 }}>
          <defs>
            <clipPath
              id="signature-reveal-clip"
              clipPathUnits="objectBoundingBox"
            >
              <rect ref={clipRectRef} x="0" y="0" width="0" height="1" />
            </clipPath>
          </defs>
        </svg>

        <img
          src={signatureSrc}
          alt="Eedoo Signature"
          style={{
            width: '100%',
            height: 'auto',
            objectFit: 'contain',
            clipPath: 'url(#signature-reveal-clip)',
            WebkitClipPath: 'url(#signature-reveal-clip)',
          }}
        />
      </div>
    </section>
  );
}
