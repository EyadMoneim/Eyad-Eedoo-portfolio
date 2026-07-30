import { useRef, useLayoutEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import rightSideImg from '../assets/right-side.avif';
import leftSideImg from '../assets/left-side.avif';

gsap.registerPlugin(ScrollTrigger);

import CurvedArrowIcon from '../components/icons/CurvedArrowIcon';
import BackgroundBlobs from '../components/background/BackgroundBlobs';
import arrowLeft from '../assets/arrow-left.svg';
import arrowRight from '../assets/arrow-right.svg';

const SplitSection = ({ sectionRef, triggerRef }) => {
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
          trigger: triggerRef ? triggerRef.current : sectionRef.current,
          start: 'top 50%',
          end: 'bottom bottom',
          scrub: 1,
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
        position: 'fixed',
        inset: 0,
        width: '100%',
        height: '100vh',
        display: 'flex',
        overflow: 'hidden',
        zIndex: 30, // Behind quote-section (35) so quote can slide up over it
        backgroundColor: '#f4f4ec',
        opacity: 0, // Hidden until crossfade
        pointerEvents: 'none',
      }}
    >
      {/* Background blobs for Phase 4 */}
      <BackgroundBlobs 
        style={{ position: 'absolute', inset: 0, opacity: 0.2, pointerEvents: 'none' }} 
        imgStyle={{ width: '100%', height: '100%', objectFit: 'cover' }} 
      />

      {/* LEFT SIDE: "EEDOO" and right-side.avif */}
      <div style={{ 
        position: 'relative', 
        width: '50%', 
        height: '100%', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'flex-end', // Push text towards the center line
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

        <div 
          ref={leftContentRef} 
          className="split-left-content"
          style={{ 
            position: 'relative', 
            zIndex: 5, 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'flex-start', // Left-aligned internal content
            marginRight: '5%', // Closer to center line
            textAlign: 'left',
          }}
        >
          {/* Fixed height wrapper for title to align paragraphs horizontally */}
          <div style={{ minHeight: '260px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
          {/* Eedoo stacked title */}
          <div style={{ position: 'relative', lineHeight: 0.85 }}>
            {/* Background "EEDOO" – big black letters */}
            <div className="split-title-bg" style={{ 
              position: 'relative',
              fontSize: 'clamp(4rem, 7.7vw, 10rem)',
              fontWeight: 900,
              color: '#1f231f', // Match reference dark color
              textTransform: 'uppercase',
              letterSpacing: '-0.05em', // Tight letter spacing like TRACK
              fontFamily: "'Inter', sans-serif",
              lineHeight: 0.85,
            }}>
              Eedoo
            </div>
            {/* Overlapping "Eedoo" in lime like "ON" overlay in reference */}
            <div className="split-title-fg" style={{ 
              position: 'absolute',
              top: '40%',
              left: '45%',
              transform: 'translate(-50%, -50%) rotate(-15deg)',
              fontSize: 'clamp(2.5rem, 5vw, 6rem)', // Scaled down to prevent massive overflow
              fontWeight: 900,
              color: '#a58ed9',
              textTransform: 'uppercase',
              letterSpacing: '0.02em',
              fontFamily: "'Playfair Display', serif",
              fontStyle: 'italic',
              lineHeight: 0.85,
              pointerEvents: 'none',
              whiteSpace: 'nowrap',
            }}>
              tech-guy
            </div>
          </div>
          </div>

          <p style={{ 
            marginTop: '2rem',
            maxWidth: '280px',
            fontSize: '1.125rem',
            fontWeight: 500,
            color: '#222',
            lineHeight: 1.4,
            fontFamily: "'Inter', sans-serif",
          }}>
            Innovative projects, robust architectures, and deep-dives into modern tech stacks.
          </p>

          <button className="split-button" style={{ alignSelf: 'flex-end', marginTop: '2.5rem' }}>
            <img src={arrowLeft} alt="Left Arrow" style={{ width: '24px', height: '24px' }} />
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
        justifyContent: 'flex-start', // Push text towards center line
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
            alignItems: 'flex-start', // Match reference: left-aligned content
            marginLeft: '5%', // Closer to center line
            textAlign: 'left',
          }}
        >
          {/* Fixed height wrapper for title to align paragraphs horizontally */}
          <div style={{ minHeight: '260px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
          {/* OFF / Eyad Moneim stacked title */}
          <div style={{ lineHeight: 0.85 }}>
            <div className="split-title-sub" style={{ 
              fontSize: 'clamp(2.5rem, 5vw, 6rem)',
              fontWeight: 500,
              color: '#1f231f', // Match dark color
              textTransform: 'uppercase',
              letterSpacing: '-0.02em', // Tight spacing
              fontFamily: "'Playfair Display', serif",
              lineHeight: 0.85,
            }}>
              Eyad
            </div>
            <div className="split-title-main" style={{ 
              fontSize: 'clamp(3.5rem, 6.5vw, 8.5rem)',
              fontWeight: 900,
              color: '#1f231f', // Match dark color
              textTransform: 'uppercase',
              letterSpacing: '-0.05em', // Very tight like TRACK
              fontFamily: "'Inter', sans-serif",
              lineHeight: 0.85,
            }}>
              Moneim
            </div>
          </div>
          </div>

          <p style={{ 
            marginTop: '2rem',
            maxWidth: '280px',
            fontSize: '1.125rem',
            fontWeight: 500,
            color: '#222',
            lineHeight: 1.4,
            fontFamily: "'Inter', sans-serif",
          }}>
            Creative campaigns, UI/UX designs, and engaging digital experiences.
          </p>

          <button className="split-button" style={{ alignSelf: 'flex-start', marginTop: '2.5rem' }}>
            <img src={arrowRight} alt="Right Arrow" style={{ width: '24px', height: '24px' }} />
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
