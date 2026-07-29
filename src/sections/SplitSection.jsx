import React, { useRef, useLayoutEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import rightSideImg from '../assets/right-side.avif';
import leftSideImg from '../assets/left-side.avif';

gsap.registerPlugin(ScrollTrigger);

const CurvedArrowIcon = () => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    width="20" 
    height="20" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2.5" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <path d="M5 12h14"></path>
    <path d="M12 5l7 7-7 7"></path>
  </svg>
);

const SplitSection = ({ sectionRef }) => {
  const leftImgRef = useRef(null);
  const rightImgRef = useRef(null);
  const leftContentRef = useRef(null);
  const rightContentRef = useRef(null);

  useLayoutEffect(() => {
    if (!sectionRef?.current) return;

    const ctx = gsap.context(() => {
      // Initial states
      gsap.set(leftImgRef.current, { x: '-60%', opacity: 0 });
      gsap.set(rightImgRef.current, { x: '60%', opacity: 0 });
      gsap.set(leftContentRef.current, { y: 40, opacity: 0 });
      gsap.set(rightContentRef.current, { y: 40, opacity: 0 });

      // Images slide in from sides
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 60%',
          end: 'top 10%',
          toggleActions: 'play none none reverse',
        }
      });

      tl.to([leftImgRef.current, rightImgRef.current], {
        x: '0%',
        opacity: 1,
        duration: 1.4,
        ease: 'power3.out',
        stagger: 0.05,
      })
      .to([leftContentRef.current, rightContentRef.current], {
        y: 0,
        opacity: 1,
        duration: 0.9,
        ease: 'power2.out',
        stagger: 0.15,
      }, '-=0.8');

    }, sectionRef);

    return () => ctx.revert();
  }, [sectionRef]);

  return (
    <section 
      ref={sectionRef} 
      style={{
        position: 'relative',
        width: '100%',
        height: '100vh',
        display: 'flex',
        overflow: 'hidden',
        zIndex: 50, // Above the white overlay (40) and quote-section (35)
        backgroundColor: 'transparent',
      }}
    >
      {/* LEFT SIDE: "EEDOO" and right-side.avif */}
      <div style={{ 
        position: 'relative', 
        width: '50%', 
        height: '100%', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        borderRight: '1px solid rgba(45,49,38,0.12)',
        overflow: 'hidden',
      }}>
        
        {/* Left Image: peeks out from the left wall */}
        <div 
          ref={leftImgRef}
          style={{ 
            position: 'absolute', 
            left: 0, 
            bottom: 0, 
            height: '85vh', 
            width: '45vw',
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'flex-start',
            pointerEvents: 'none',
          }}
        >
          <img 
            className="split-left-img"
            src={rightSideImg} 
            alt="Eedoo"
            style={{ 
              height: '100%', 
              width: '100%', 
              objectFit: 'contain',
              objectPosition: 'left bottom',
              marginLeft: '-15%', // Pushed further left
            }}
          />
        </div>

        {/* Left Content */}
        <div 
          ref={leftContentRef} 
          className="split-left-content"
          style={{ 
            position: 'relative', 
            zIndex: 5, 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center',
            marginLeft: '30%', 
            textAlign: 'center',
          }}
        >
          {/* ON / Eedoo stacked title */}
          <div style={{ position: 'relative', lineHeight: 1 }}>
            {/* Background "EEDOO" – big black letters */}
            <div className="split-title-bg" style={{ 
              position: 'relative',
              fontSize: 'clamp(3rem, 5vw, 6.5rem)',
              fontWeight: 900,
              color: '#111112',
              textTransform: 'uppercase',
              letterSpacing: '-0.04em',
              fontFamily: "'Inter', sans-serif",
              lineHeight: 0.85,
            }}>
              Eedoo
            </div>
            {/* Overlapping "Eedoo" in lime like "ON" overlay in reference */}
            <div className="split-title-fg" style={{ 
              position: 'absolute',
              top: '30%',
              left: '50%',
              transform: 'translate(-50%, -50%) rotate(-12deg)',
              fontSize: 'clamp(3.5rem, 6vw, 7.5rem)',
              fontWeight: 900,
              color: '#d2ff00',
              textTransform: 'uppercase',
              letterSpacing: '-0.04em',
              fontFamily: "'Playfair Display', serif",
              fontStyle: 'italic',
              lineHeight: 0.85,
              pointerEvents: 'none',
              whiteSpace: 'nowrap',
            }}>
              Eedoo
            </div>
          </div>

          <p style={{ 
            marginTop: '3rem',
            maxWidth: '220px',
            fontSize: '0.875rem',
            fontWeight: 500,
            color: '#555',
            lineHeight: 1.5,
            fontFamily: "'Inter', sans-serif",
          }}>
            Most recent results, career stats and photos from trackside.
          </p>

          <button style={{ 
            marginTop: '1.5rem',
            width: '3.5rem',
            height: '3.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#d2ff00',
            border: 'none',
            cursor: 'pointer',
            transition: 'background-color 0.3s ease',
          }}
          onMouseEnter={e => e.currentTarget.style.backgroundColor = '#b2c73a'}
          onMouseLeave={e => e.currentTarget.style.backgroundColor = '#d2ff00'}
          >
            <CurvedArrowIcon />
          </button>
        </div>
      </div>

      {/* RIGHT SIDE: "EYAD MONEIM" and left-side.avif */}
      <div style={{ 
        position: 'relative', 
        width: '50%', 
        height: '100%', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        overflow: 'hidden',
      }}>

        {/* Right Content */}
        <div 
          ref={rightContentRef}
          className="split-right-content"
          style={{ 
            position: 'relative', 
            zIndex: 5, 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center',
            marginRight: '30%',
            textAlign: 'center',
          }}
        >
          {/* OFF / Eyad Moneim stacked title — matching reference */}
          <div style={{ lineHeight: 0.85 }}>
            <div className="split-title-sub" style={{ 
              fontSize: 'clamp(2.5rem, 4.5vw, 5rem)',
              fontWeight: 500,
              color: '#111112',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              fontFamily: "'Playfair Display', serif",
              lineHeight: 0.9,
            }}>
              Eyad
            </div>
            <div className="split-title-main" style={{ 
              fontSize: 'clamp(3rem, 5vw, 6.5rem)',
              fontWeight: 900,
              color: '#111112',
              textTransform: 'uppercase',
              letterSpacing: '-0.04em',
              fontFamily: "'Inter', sans-serif",
              lineHeight: 0.85,
            }}>
              Moneim
            </div>
          </div>

          <p style={{ 
            marginTop: '3rem',
            maxWidth: '220px',
            fontSize: '0.875rem',
            fontWeight: 500,
            color: '#555',
            lineHeight: 1.5,
            fontFamily: "'Inter', sans-serif",
          }}>
            Campaigns, shoots and other such promotional materials for fans.
          </p>

          <button style={{ 
            marginTop: '1.5rem',
            width: '3.5rem',
            height: '3.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#d2ff00',
            border: 'none',
            cursor: 'pointer',
            transition: 'background-color 0.3s ease',
          }}
          onMouseEnter={e => e.currentTarget.style.backgroundColor = '#b2c73a'}
          onMouseLeave={e => e.currentTarget.style.backgroundColor = '#d2ff00'}
          >
            <CurvedArrowIcon />
          </button>
        </div>

        {/* Right Image: peeks out from the right wall */}
        <div 
          ref={rightImgRef}
          style={{ 
            position: 'absolute', 
            right: 0, 
            bottom: 0, 
            height: '85vh', 
            width: '45vw',
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'flex-end',
            pointerEvents: 'none',
          }}
        >
          <img 
            className="split-right-img"
            src={leftSideImg} 
            alt="Eyad Moneim"
            style={{ 
              height: '100%', 
              width: '100%', 
              objectFit: 'contain',
              objectPosition: 'right bottom',
              marginRight: '-15%', // Symmetrical cut off
            }}
          />
        </div>
      </div>
    </section>
  );
};

export default SplitSection;
