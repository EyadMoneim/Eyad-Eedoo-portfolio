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

      // Add Block-Reveal for titles
      const leftRevealGroups = gsap.utils.toArray('.split-left-content .split-reveal-group');
      const rightRevealGroups = gsap.utils.toArray('.split-right-content .split-reveal-group');
      
      const titleRevealTl = gsap.timeline({
        scrollTrigger: {
          trigger: triggerRef ? triggerRef.current : sectionRef.current,
          start: 'top 40%',
          once: true,
        }
      });

      const applyReveal = (groups) => {
        groups.forEach((group, index) => {
          const content = group.querySelector('.split-reveal-content');
          const block = group.querySelector('.split-block-revealer');
          const direction = group.getAttribute('data-direction') || 'left';
          if (!content || !block) return;
          
          gsap.set(content, { opacity: 0 });
          
          const originStart = direction === 'left' ? 'right center' : 'left center';
          const originEnd = direction === 'left' ? 'left center' : 'right center';
          gsap.set(block, { scaleX: 0, transformOrigin: originStart });
          
          const duration = 0.5;
          const ease = "power3.inOut";
          const delay = index * 0.15; // Cascading waterfall effect
          
          titleRevealTl.to(block, { scaleX: 1, duration: duration, ease: ease }, delay);
          titleRevealTl.set(content, { opacity: 1 }, delay + duration);
          titleRevealTl.set(block, { transformOrigin: originEnd }, delay + duration);
          titleRevealTl.to(block, { scaleX: 0, duration: duration, ease: ease }, delay + duration);
        });
      };

      applyReveal(leftRevealGroups);
      applyReveal(rightRevealGroups);

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
            <div className="split-reveal-group" data-direction="left" data-step="1" style={{ position: 'relative', width: 'max-content' }}>
              <div className="split-block-revealer" style={{
                position: 'absolute', top: '-5%', bottom: '-5%', left: '-5%', right: '-5%',
                backgroundColor: '#2a2d22', zIndex: 10
              }}></div>
              <div className="split-reveal-content">
                {/* Background "EEDOO" – big black letters */}
                <div className="split-title-bg" style={{ 
                  position: 'relative',
                  fontSize: 'clamp(4rem, 7.7vw, 10rem)',
                  fontWeight: 900,
                  color: '#1f231f',
                  textTransform: 'uppercase',
                  letterSpacing: '-0.05em',
                  fontFamily: "'Inter', sans-serif",
                  lineHeight: 0.85,
                }}>
                  Eedoo
                </div>
              </div>
            </div>

            <div className="split-reveal-group" data-direction="left" data-step="1" style={{ 
              position: 'absolute',
              top: '40%',
              left: '45%',
              transform: 'translate(-50%, -50%) rotate(-15deg)',
              width: 'max-content',
              zIndex: 15
            }}>
              <div className="split-block-revealer" style={{
                position: 'absolute', top: '-5%', bottom: '-5%', left: '-10%', right: '-10%',
                backgroundColor: '#2a2d22', zIndex: 10
              }}></div>
              <div className="split-reveal-content">
                {/* Overlapping "tech-guy" */}
                <div className="split-title-fg" style={{ 
                  fontSize: 'clamp(2.5rem, 5vw, 6rem)',
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
          </div>
          </div>

          <div style={{ marginTop: '2rem', maxWidth: '280px', display: 'flex', flexDirection: 'column' }}>
            <div className="split-reveal-group" data-direction="left" data-step="2" style={{ position: 'relative', width: 'max-content', marginBottom: '4px' }}>
              <div className="split-block-revealer" style={{
                position: 'absolute', top: '-2px', bottom: '-2px', left: '-5px', right: '-5px',
                backgroundColor: '#2a2d22', zIndex: 10
              }}></div>
              <div className="split-reveal-content">
                <span style={{ 
                  fontSize: '1.125rem',
                  fontWeight: 500,
                  color: '#222',
                  lineHeight: 1.4,
                  fontFamily: "'Inter', sans-serif",
                }}>
                  Innovative projects, robust
                </span>
              </div>
            </div>
            <div className="split-reveal-group" data-direction="left" data-step="2" style={{ position: 'relative', width: 'max-content', marginBottom: '4px' }}>
              <div className="split-block-revealer" style={{
                position: 'absolute', top: '-2px', bottom: '-2px', left: '-5px', right: '-5px',
                backgroundColor: '#2a2d22', zIndex: 10
              }}></div>
              <div className="split-reveal-content">
                <span style={{ 
                  fontSize: '1.125rem',
                  fontWeight: 500,
                  color: '#222',
                  lineHeight: 1.4,
                  fontFamily: "'Inter', sans-serif",
                }}>
                  architectures, and deep-dives
                </span>
              </div>
            </div>
            <div className="split-reveal-group" data-direction="left" data-step="2" style={{ position: 'relative', width: 'max-content' }}>
              <div className="split-block-revealer" style={{
                position: 'absolute', top: '-2px', bottom: '-2px', left: '-5px', right: '-5px',
                backgroundColor: '#2a2d22', zIndex: 10
              }}></div>
              <div className="split-reveal-content">
                <span style={{ 
                  fontSize: '1.125rem',
                  fontWeight: 500,
                  color: '#222',
                  lineHeight: 1.4,
                  fontFamily: "'Inter', sans-serif",
                }}>
                  into modern tech stacks.
                </span>
              </div>
            </div>
          </div>

          <button className="split-button" style={{ alignSelf: 'flex-end', marginTop: '2.5rem' }}>
            <div className="svg-arrow left"></div>
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
            <div className="split-reveal-group" data-direction="right" data-step="1" style={{ position: 'relative', width: 'max-content' }}>
              <div className="split-block-revealer" style={{
                position: 'absolute', top: '-5%', bottom: '-5%', left: '-5%', right: '-5%',
                backgroundColor: '#2a2d22', zIndex: 10
              }}></div>
              <div className="split-reveal-content">
                <div className="split-title-sub" style={{ 
                  fontSize: 'clamp(2.5rem, 5vw, 6rem)',
                  fontWeight: 500,
                  color: '#1f231f',
                  textTransform: 'uppercase',
                  letterSpacing: '-0.02em',
                  fontFamily: "'Playfair Display', serif",
                  lineHeight: 0.85,
                }}>
                  Eyad
                </div>
              </div>
            </div>
            <div className="split-reveal-group" data-direction="right" data-step="1" style={{ position: 'relative', width: 'max-content' }}>
              <div className="split-block-revealer" style={{
                position: 'absolute', top: '-5%', bottom: '-5%', left: '-5%', right: '-5%',
                backgroundColor: '#2a2d22', zIndex: 10
              }}></div>
              <div className="split-reveal-content">
                <div className="split-title-main" style={{ 
                  fontSize: 'clamp(3.5rem, 6.5vw, 8.5rem)',
                  fontWeight: 900,
                  color: '#1f231f',
                  textTransform: 'uppercase',
                  letterSpacing: '-0.05em',
                  fontFamily: "'Inter', sans-serif",
                  lineHeight: 0.85,
                }}>
                  Moneim
                </div>
              </div>
            </div>
          </div>
          </div>

          <div style={{ marginTop: '2rem', maxWidth: '280px', display: 'flex', flexDirection: 'column' }}>
            <div className="split-reveal-group" data-direction="right" data-step="2" style={{ position: 'relative', width: 'max-content', marginBottom: '4px' }}>
              <div className="split-block-revealer" style={{
                position: 'absolute', top: '-2px', bottom: '-2px', left: '-5px', right: '-5px',
                backgroundColor: '#2a2d22', zIndex: 10
              }}></div>
              <div className="split-reveal-content">
                <span style={{ 
                  fontSize: '1.125rem',
                  fontWeight: 500,
                  color: '#222',
                  lineHeight: 1.4,
                  fontFamily: "'Inter', sans-serif",
                }}>
                  Creative campaigns, UI/UX
                </span>
              </div>
            </div>
            <div className="split-reveal-group" data-direction="right" data-step="2" style={{ position: 'relative', width: 'max-content', marginBottom: '4px' }}>
              <div className="split-block-revealer" style={{
                position: 'absolute', top: '-2px', bottom: '-2px', left: '-5px', right: '-5px',
                backgroundColor: '#2a2d22', zIndex: 10
              }}></div>
              <div className="split-reveal-content">
                <span style={{ 
                  fontSize: '1.125rem',
                  fontWeight: 500,
                  color: '#222',
                  lineHeight: 1.4,
                  fontFamily: "'Inter', sans-serif",
                }}>
                  designs, and engaging digital
                </span>
              </div>
            </div>
            <div className="split-reveal-group" data-direction="right" data-step="2" style={{ position: 'relative', width: 'max-content' }}>
              <div className="split-block-revealer" style={{
                position: 'absolute', top: '-2px', bottom: '-2px', left: '-5px', right: '-5px',
                backgroundColor: '#2a2d22', zIndex: 10
              }}></div>
              <div className="split-reveal-content">
                <span style={{ 
                  fontSize: '1.125rem',
                  fontWeight: 500,
                  color: '#222',
                  lineHeight: 1.4,
                  fontFamily: "'Inter', sans-serif",
                }}>
                  experiences.
                </span>
              </div>
            </div>
          </div>

          <button className="split-button" style={{ alignSelf: 'flex-start', marginTop: '2.5rem' }}>
            <div className="svg-arrow right"></div>
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
