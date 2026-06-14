import React from 'react';
import { motion } from 'framer-motion';

// =========================================
// Helmet SVG Icon
// =========================================
const HelmetIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 97 50.1"
    style={{ width: "2rem", height: "auto" }}
    fill="currentColor"
  >
    <path d="M68.4 33.8c.1-.7.3-1.4.4-2.3 1.1-6.1.4-11.8-2-17-2.9-6.2-9.3-12.9-18.3-13.1-9.1 0-15.6 6.4-18.7 12.6-2.6 5.1-3.4 10.8-2.4 17 .1.9.3 1.6.4 2.3 0 .5.1.9.3 1.4.1.6.3 1.2.4 1.7v.2c.1.5.3 1 .4 1.5.3 1 .5 1.5.8 1.9 0 .2.2.4.3.7l.3.9v.3c0 .3.1.5.2.8 0 1.4.7 2.2 1.5 3.3.9 1.1 1.6 1.3 2.9 1.5.9.1 1.4.2 3 .6l2 .4c2.3.8 4.6 1.3 7.9 1.3h.4c3.1 0 5.2-.4 7.5-1.1s1.9-.4 1.9-.4c1.6-.3 2.2-.4 3.1-.5 1.3-.2 2-.3 3-1.5.9-1 1.5-1.8 1.6-3.2.1-.3.2-.5.3-.8V42c0-.4.2-.7.3-.9.1-.3.2-.5.3-.7.3-.5.5-.9.8-1.9.1-.5.3-1 .4-1.5v-.2c.1-.5.3-1.1.4-1.7.2-.4.3-.9.3-1.4Z" />
  </svg>
);

export default function HeroSection() {
  return (
    <main
      id="hero-section"
      className="hero-section"
      style={{
        position: 'relative',
        width: '100%',
        height: 'calc(100vh - 8rem)', // fill screen minus hero-inner padding
        display: 'flex',
        alignItems: 'flex-end', // push the canvas to the absolute bottom
        justifyContent: 'center',
      }}
    >
      {/* 
        This is an invisible placeholder that reserves space where the canvas 
        visually appears on load. The actual canvas lives in EedooSection and 
        is translated here via GSAP on mount.
      */}
      <div
        id="hero-canvas-placeholder"
        style={{
          width: 'min(1100px, 100vw)',
          height: '100%', 
          maxHeight: '100%', // remove 650px restriction so it can be truly responsive
          margin: '0 auto',
          pointerEvents: 'none',
        }}
      />

      {/* Left Card: Next Project */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.6 }}
        className="absolute left-4 lg:left-12 bottom-4 lg:bottom-12 hidden md:flex flex-col w-[140px]"
        style={{ zIndex: 20 }}
      >
        <div style={{ position: 'relative', width: '100%', padding: '1.25rem 0.75rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          {/* Card Background and Border SVG */}
          <svg 
            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: -1 }}
            preserveAspectRatio="none"
            viewBox="0 0 100 100"
          >
            <path 
              d="M0,4 Q0,0 4,0 L75,0 L100,15 L100,96 Q100,100 96,100 L4,100 Q0,100 0,96 Z" 
              fill="rgba(250, 250, 245, 0.7)" 
              stroke="rgba(45,49,38,0.15)" 
              strokeWidth="1"
              vectorEffect="non-scaling-stroke"
            />
          </svg>

          <div
            style={{
              fontSize: '0.55rem',
              fontWeight: 800,
              textTransform: 'uppercase',
              letterSpacing: '1px',
              marginBottom: '0.75rem',
              textAlign: 'center',
              color: '#888',
            }}
          >
            Next Project
          </div>
          <div
            style={{
              borderBottom: '1px solid rgba(45,49,38,0.15)',
              paddingBottom: '0.75rem',
              marginBottom: '0.75rem',
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <svg viewBox="0 0 100 20" className="w-10 h-3 mb-2 text-gray-400">
              <path d="M0 10 Q 25 0, 50 10 T 100 10" fill="none" stroke="currentColor" strokeWidth="2" />
            </svg>
            <div
              style={{
                fontSize: '0.65rem',
                fontWeight: 900,
                textTransform: 'uppercase',
                textAlign: 'center',
                color: '#2d3126',
              }}
            >
              LDI SYSTEM
            </div>
          </div>
          <div
            style={{
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <div style={{ width: '1.25rem', height: '1.5rem', backgroundColor: '#888', borderRadius: '40% 40% 50% 50%' }} />
            <div
              style={{
                fontSize: '0.45rem',
                fontWeight: 700,
                marginTop: '0.5rem',
                textTransform: 'uppercase',
                color: '#888',
                lineHeight: 1.2
              }}
            >
              Building<br />Since 2021
            </div>
          </div>
        </div>
      </motion.div>

    </main>
  );
}
