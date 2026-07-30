import { useState, useEffect, useRef, useLayoutEffect } from "react";
import reactLogoSrc from "./assets/react.svg";
import { AnimatePresence } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import eyadSmallSrc from "./assets/eyad-small.avif";
import laurelWreathSrc from "./assets/Laurel_Wreath.svg";
import HeroSection from "./sections/HeroSection";
import ThreeDissolveHero from "./ThreeDissolveHero";
import ScrollVelocity from "./components/ScrollVelocity";
import SplitSection from "./sections/SplitSection";
import LoadingScreen from "./LoadingScreen";
import "./App.css";
import Navbar from "./components/nav/Navbar";
import FullscreenMenu from "./components/nav/FullscreenMenu";
import QuoteSection from "./components/quote/QuoteSection";
import BackgroundBlobs from "./components/background/BackgroundBlobs";
import SignatureLayer from "./components/background/SignatureLayer";

gsap.registerPlugin(ScrollTrigger);













// =========================================
// 7. Main App Component
// =========================================
const App = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isInteractive, setIsInteractive] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isPhase3, setIsPhase3] = useState(false);
  const [isPhase4, setIsPhase4] = useState(false);
  const [isRobotActive, setIsRobotActive] = useState(false);


  // Refs for GSAP ScrollTrigger
  const heroScrollSectionRef = useRef(null);
  const groupWallpaperRef = useRef(null);
  const eyadSmallRef = useRef(null);
  const threeDissolveRef = useRef(null);
  const bgBlobsRef = useRef(null);
  const signatureRef = useRef(null);
  const signatureLayerRef = useRef(null);

  // Phase 3 Refs
  const messageWithEyadGroupRef = useRef(null);
  const developerSignaturePhase3Ref = useRef(null);
  const quoteRow1Ref = useRef(null);
  const quoteRow2Ref = useRef(null);
  const quoteRow3Ref = useRef(null);
  const quoteRow4Ref = useRef(null);

  // Phase 4 Refs
  const transitionSpacerRef = useRef(null);
  const splitSectionRef = useRef(null);
  const phase4BgRef = useRef(null);
  const quoteSectionRef = useRef(null);

  // Lock body scroll when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  // =========================================
  // GSAP ScrollTrigger — Hero Shrink Animation
  // =========================================
  useLayoutEffect(() => {
    if (isLoading) return;

    const ctx = gsap.context(() => {
      let currentTl = null;
      let currentInteractiveST = null;

      const setup = () => {
        const groupEl = groupWallpaperRef.current;
        const eyadSmallEl = eyadSmallRef.current;
        const threeDissolveEl = threeDissolveRef.current;
        const bgBlobsEl = bgBlobsRef.current;
        const nextProjectEl = document.querySelector('.next-project-card');
        const sigEl = signatureRef.current;
        const sigMainGroup = sigEl?.querySelector('.sig-main');
        const sigUnderlineGroup = sigEl?.querySelector('.sig-underline');
        const sigSixGroup = sigEl?.querySelector('.sig-six');
        const sigMainRect = sigEl?.querySelector('.sig-main-rect');
        const sigUnderlineRect = sigEl?.querySelector('.sig-underline-rect');
        const sigSixRect = sigEl?.querySelector('.sig-six-rect');

        if (!groupEl) return;

        // Kill any previously created timeline/scrolltrigger before rebuilding
        if (currentTl) {
          currentTl.scrollTrigger?.kill();
          currentTl.kill();
          currentTl = null;
        }
        if (currentInteractiveST) {
          currentInteractiveST.kill();
          currentInteractiveST = null;
        }

        // Reset elements back to their initial state before recalculating
        gsap.set(groupEl, { scale: 1, clipPath: 'inset(0px 0px 0px 0px round 0px)' });
        if (eyadSmallEl) gsap.set(eyadSmallEl, { opacity: 0 });
        if (threeDissolveEl) gsap.set(threeDissolveEl, { opacity: 1 });
        if (bgBlobsEl) gsap.set(bgBlobsEl, { opacity: 1 });
        if (nextProjectEl) gsap.set(nextProjectEl, { autoAlpha: 1, y: 0 });

        const SIG_PAD = 10;
        const initSigClip = (rectEl, groupEl) => {
          if (!rectEl || !groupEl) return null;
          let box;
          try { box = groupEl.getBBox(); } catch { return null; }
          if (!box || box.width === 0) return null;
          gsap.set(rectEl, {
            attr: {
              x: box.x - SIG_PAD,
              y: box.y - SIG_PAD,
              height: box.height + SIG_PAD * 2,
              width: 0,
            },
          });
          return box;
        };
        const sigMainBox = initSigClip(sigMainRect, sigMainGroup);
        const sigUnderlineBox = initSigClip(sigUnderlineRect, sigUnderlineGroup);
        const sigSixBox = initSigClip(sigSixRect, sigSixGroup);

        // Calculate scale and clipPath values
        const vw = window.innerWidth;
        const vh = window.innerHeight;
        let baseScale, cutX, cutY = 0, targetRadius;

        if (vw <= 991) {
          // Mobile: square, centralized — bumped up for a larger final size
          const S = Math.min(vw * 0.88, 380);

          // Override baseScale so the image covers the S x S square completely
          baseScale = Math.max(S / vw, S / vh);

          cutX = (vw - (S / baseScale)) / 2;
          cutY = (vh - (S / baseScale)) / 2;
          if (cutX < 0) cutX = 0;
          if (cutY < 0) cutY = 0;

          targetRadius = 24 / baseScale;

          // Position the scrolling text exactly 15px below the square
          const scrollBgSection = document.querySelector('.scroll-reveal-bg section');
          if (scrollBgSection) {
            gsap.set(scrollBgSection, {
              position: 'absolute',
              top: `${(vh / 2) + (S / 2) + 15}px`,
              left: 0,
              width: '100%'
            });
          }
        } else {
          // Desktop logic — bumped up final size
          const oldTargetSize = 900;
          const oldScaleX = oldTargetSize / vw;
          const oldScaleY = oldTargetSize / vh;
          baseScale = Math.min(oldScaleX, oldScaleY);

          const finalHeight = vh * baseScale;
          const targetWidth = finalHeight * 1.1;

          cutX = (vw - (targetWidth / baseScale)) / 2;
          if (cutX < 0) cutX = 0;
          targetRadius = 24 / baseScale;

          // Ensure desktop text stays as is (it's centered by flexbox)
          const scrollBgSection = document.querySelector('.scroll-reveal-bg section');
          if (scrollBgSection) {
            gsap.set(scrollBgSection, { clearProps: "position,top,left,width" });
          }
        }

        // Create the master timeline — no pin needed since group-wallpaper is position:fixed
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: heroScrollSectionRef.current,
            start: 'top top',
            end: 'bottom bottom',
            scrub: 1.2,
          },
        });

        // 1. Next Project card fades out quickly when shrinking starts
        if (nextProjectEl) {
          tl.to(
            nextProjectEl,
            {
              autoAlpha: 0,
              y: 30,
              duration: 0.2,
              ease: 'power1.inOut',
            },
            0
          );
        }

        // Fade out 3D canvas and blobs
        if (threeDissolveEl) {
          tl.to(threeDissolveEl, { opacity: 0, duration: 0.3, ease: 'power1.inOut' }, 0);
        }
        if (bgBlobsEl) {
          tl.to(bgBlobsEl, { opacity: 0, duration: 0.3, ease: 'power1.inOut' }, 0);
        }

        // 2. Group wallpaper shrinks and clips to form a square-ish shape
        // (targetRadius is calculated above)
        tl.to(
          groupEl,
          {
            scale: baseScale,
            clipPath: `inset(${cutY}px ${cutX}px ${cutY}px ${cutX}px round ${targetRadius}px)`,
            duration: 2.6, // Slower shrink
            ease: 'none',
          },
          0
        );

        // 3. eyad-small.png crossfades in (much slower fade)
        if (eyadSmallEl) {
          tl.to(
            eyadSmallEl,
            {
              opacity: 1,
              duration: 1.6,
              ease: 'power1.inOut',
            },
            0.6
          );
        }

        // 4. Signature build-up effect (Phase 2)
        // Stage 1 — E.Moneim name writes in
        if (sigMainRect && sigMainBox) {
          tl.to(
            sigMainRect,
            { attr: { width: sigMainBox.width + SIG_PAD * 2 }, duration: 0.85, ease: 'none' },
            1.9
          );
        }

        // Stage 2 — underline draws after name
        if (sigUnderlineRect && sigUnderlineBox) {
          tl.to(
            sigUnderlineRect,
            { attr: { width: sigUnderlineBox.width + SIG_PAD * 2 }, duration: 0.35, ease: 'none' },
            2.05
          );
        }

        // Stage 3 — number 6 writes in (same wipe technique, no scale/fade/pop)
        if (sigSixRect && sigSixBox) {
          tl.to(
            sigSixRect,
            { attr: { width: sigSixBox.width + SIG_PAD * 2 }, duration: 0.45, ease: 'none' },
            2.4
          );
        }

        // Fade in developer signature at the bottom
        if (developerSignaturePhase3Ref.current) {
          tl.to(developerSignaturePhase3Ref.current, { opacity: 1, duration: 0.5, ease: 'power1.inOut' }, 2.6);
        }

        // ----------------------------------------------------
        // PHASE 3: Move everything up, quote rows reveal
        // ----------------------------------------------------
        const phase3Start = 3.5;

        // Move the entire Phase 2 package UP out of view
        if (messageWithEyadGroupRef.current) {
          tl.to(messageWithEyadGroupRef.current, { y: "-120vh", duration: 1.5, ease: 'power2.inOut' }, phase3Start);
          const velocityGroup = document.getElementById('scroll-velocity-group');
          if (velocityGroup) {
            tl.to(velocityGroup, { y: "-120vh", duration: 1.5, ease: 'power2.inOut' }, phase3Start);
          }
        }

        // Move Developer Signature from bottom to top
        if (developerSignaturePhase3Ref.current) {
          tl.to(developerSignaturePhase3Ref.current, {
            y: () => -window.innerHeight * 0.65,
            scale: 1,
            duration: 1.5,
            ease: 'power2.inOut'
          }, phase3Start);
        }

        // Slide the Quote Section up from below the viewport
        if (quoteSectionRef.current) {
          gsap.set(quoteSectionRef.current, { y: '100vh' });
          tl.to(quoteSectionRef.current, {
            y: 0,
            duration: 1.5,
            ease: 'power2.inOut'
          }, phase3Start);
        }

        // Block-reveal animation for the 4 quote rows
        const quoteRevealTl = gsap.timeline({ paused: true });
        const rows = [quoteRow1Ref.current, quoteRow2Ref.current, quoteRow3Ref.current, quoteRow4Ref.current].filter(Boolean);
        rows.forEach((row, index) => {
          const content = row.querySelector('.quote-row-content');
          const block = row.querySelector('.block-revealer');
          if (!content || !block) return;
          gsap.set(content, { opacity: 0 });
          gsap.set(block, { scaleX: 0, transformOrigin: "left center" });
          const delay = index * 0.18;
          quoteRevealTl.to(block, { scaleX: 1, duration: 0.45, ease: "power4.inOut" }, delay);
          quoteRevealTl.set(content, { opacity: 1 }, delay + 0.45);
          quoteRevealTl.set(block, { transformOrigin: "right center" }, delay + 0.45);
          quoteRevealTl.to(block, { scaleX: 0, duration: 0.45, ease: "power4.inOut" }, delay + 0.45);
        });

        ScrollTrigger.create({
          trigger: heroScrollSectionRef.current,
          start: '70% top',
          end: 'bottom bottom',
          once: true,
          onEnter: () => quoteRevealTl.play(),
        });

        currentTl = tl;

        // 4. Disable ThreeDissolveHero interactivity during scroll
        currentInteractiveST = ScrollTrigger.create({
          trigger: heroScrollSectionRef.current,
          start: 'top top',
          end: 'bottom bottom',
          onUpdate: (self) => {
            setIsInteractive(self.progress < 0.05);
            setIsScrolled(self.progress > 0.05);
            setIsPhase3(self.progress > 0.65);
          },
        });

        ScrollTrigger.refresh();
      };

      // Initial setup — wait for layout to settle
      const rafId = requestAnimationFrame(() => {
        requestAnimationFrame(setup);
      });

      // Rebuild on resize / orientation change (covers mobile address-bar
      // resize, devtools device toggling, and rotation)
      let resizeTimeout;
      const handleResize = () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(setup, 200);
      };
      window.addEventListener('resize', handleResize);
      window.addEventListener('orientationchange', handleResize);

      return () => {
        cancelAnimationFrame(rafId);
        clearTimeout(resizeTimeout);
        window.removeEventListener('resize', handleResize);
        window.removeEventListener('orientationchange', handleResize);
      };
    });

    return () => ctx.revert();
  }, [isLoading]);

  // =========================================
  // PHASE 4: White background + slide quote up
  // =========================================
  useLayoutEffect(() => {
    if (isLoading) return;
    if (!splitSectionRef.current) return;

    const ctx = gsap.context(() => {
      const trigger = splitSectionRef.current;
      const bg = phase4BgRef.current;
      const quoteSection = quoteSectionRef.current;
      const devSig = developerSignaturePhase3Ref.current;

      if (transitionSpacerRef.current) {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: transitionSpacerRef.current,
            start: 'top bottom',
            end: 'bottom bottom',
            scrub: true,
          }
        });

        // QuoteSection and devSig SLIDE UP and blur
        if (quoteSection) {
          tl.fromTo(quoteSection, { y: '0%', filter: 'blur(0px)' }, { y: '-100vh', filter: 'blur(15px)', ease: 'none', duration: 1 }, 0);
        }
        if (devSig) {
          tl.fromTo(devSig, { y: '-65vh', opacity: 1, filter: 'blur(0px)' }, { y: '-165vh', opacity: 0, filter: 'blur(15px)', ease: 'none', immediateRender: false, duration: 1 }, 0);
        }
        // SplitSection FADES IN behind them (it has zIndex: 30, quoteSection is 35)
        if (splitSectionRef.current) {
          tl.fromTo(splitSectionRef.current, { opacity: 0, pointerEvents: 'none', filter: 'blur(15px)' }, { opacity: 1, pointerEvents: 'auto', filter: 'blur(0px)', ease: 'none', duration: 1 }, 0);
        }
      }

      // 3. Track Phase 4 for navbar color
      ScrollTrigger.create({
        trigger: transitionSpacerRef.current,
        start: 'top 50%',
        end: 'bottom top',
        onToggle: (self) => setIsPhase4(self.isActive),
      });

      ScrollTrigger.refresh();
    });

    return () => ctx.revert();
  }, [isLoading]);

  return (
    <>
      <AnimatePresence mode="wait">
        {isLoading && (
          <LoadingScreen onLoadingComplete={() => setIsLoading(false)} />
        )}
      </AnimatePresence>

      {!isLoading && (
        <div style={{ position: "relative", width: "100%", minHeight: "100vh" }}>
          {/* ======= Z-0: DARK GREEN BACKGROUND + MARQUEE ======= */}
          <div className="scroll-reveal-bg" id="scroll-reveal-bg">
            <BackgroundBlobs style={{ opacity: 0.1 }} />
            <div id="scroll-velocity-group" style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
              <ScrollVelocity
                texts={['To get something you never had']}
                velocity={80}
                className="scroll-text-green"
                numCopies={8}
                damping={50}
                stiffness={400}
                scrollerStyle={{ gap: '2rem' }}
                parallaxClassName="parallax green-parallax"
              />
              <ScrollVelocity
                texts={['You have to do something you never did']}
                velocity={-80}
                className="scroll-text-white"
                numCopies={8}
                damping={50}
                stiffness={400}
                scrollerStyle={{ gap: '2rem' }}
                parallaxClassName="parallax white-parallax"
              />
            </div>
          </div>

          {/* Phase 4 bg is now inside SplitSection directly to prevent empty spaces */}

          {/* ======= PHASE 3: DEVELOPER SIGNATURE ======= */}
          <div className="developer-signature-phase3" ref={developerSignaturePhase3Ref}>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '4.5rem', height: '4.5rem', marginBottom: '0.2rem', filter: 'brightness(0) invert(1)' }}>
              <img src={laurelWreathSrc} alt="Laurel Wreath" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'contain' }} />
              <img src={reactLogoSrc} alt="React Logo" style={{ position: 'absolute', width: '45%', height: '45%', objectFit: 'contain' }} />
            </div>
            <span>DEVELOPER SINCE 2024</span>
          </div>
          {/* ======= PHASE 3: 4 QUOTE ROWS ======= */}
          <QuoteSection 
            ref={quoteSectionRef}
            quoteRow1Ref={quoteRow1Ref}
            quoteRow2Ref={quoteRow2Ref}
            quoteRow3Ref={quoteRow3Ref}
            quoteRow4Ref={quoteRow4Ref}
          />

          {/* ======= NAVBAR ======= */}
          {/* ======= NAVBAR ======= */}
          <Navbar 
            isMenuOpen={isMenuOpen} 
            setIsMenuOpen={setIsMenuOpen} 
            isScrolled={isScrolled} 
            isPhase3={isPhase3} 
            isPhase4={isPhase4} 
          />

          {/* ======= FULLSCREEN MENU ======= */}
          <FullscreenMenu isOpen={isMenuOpen} currentPage="Home" />

          {/* ======= PHASE 2: MESSAGE WITH EYAD GROUP ======= */}
          <div className="message-with-eyad-group" ref={messageWithEyadGroupRef}>

          {/* ======= GROUP-WALLPAPER: fixed layer that shrinks on scroll ======= */}
          {/* Uses CSS transition (not framer-motion filter) to avoid breaking position:fixed */}
          <div
            className="group-wallpaper"
            ref={groupWallpaperRef}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 20,
              backgroundColor: '#fcfcfa',
              transformOrigin: 'center center',
              overflow: 'hidden',
              filter: isMenuOpen ? "blur(12px)" : "none",
              opacity: isMenuOpen ? 0.3 : 1,
              transition: "filter 1s cubic-bezier(0.16, 1, 0.3, 1), opacity 1s cubic-bezier(0.16, 1, 0.3, 1)",
            }}
          >
            {/* Wallpaper blobs (animated, centered) */}
            <BackgroundBlobs ref={bgBlobsRef} />
            <div className="bg-gradient-overlay" />

            {/* Hero inner content */}
            <div className="hero-inner" style={{ position: "relative", width: "100%", height: "100vh" }}>
              <div ref={threeDissolveRef} style={{ position: 'absolute', inset: 0, zIndex: 10, pointerEvents: 'none' }}>
                <ThreeDissolveHero isInteractive={isInteractive} isRobotActive={isRobotActive} />
              </div>
              <HeroSection setIsRobotActive={setIsRobotActive} />
            </div>

            {/* Message image wrapper: eyad-small (Phase 2) */}
            <div className="message-image-wrapper">
              <img
                ref={eyadSmallRef}
                src={eyadSmallSrc}
                alt="Eyad portrait"
                className="eyad-small-overlay"
              />
            </div>
          </div>

          {/* SIGNATURE LAYER — lives outside group-wallpaper so it escapes the portrait frame */}
          <SignatureLayer ref={signatureLayerRef} signatureRef={signatureRef} />

          </div>{/* END message-with-eyad-group */}

          {/* ======= SCROLL SPACER ======= */}
          {/* Provides scroll distance for the shrink animation */}
          <div className="hero-scroll-section" ref={heroScrollSectionRef} style={{ height: "400vh" }} />

          {/* ======= TRANSITION SPACER ======= */}
          <div ref={transitionSpacerRef} style={{ height: "150vh", width: "100%" }} />

          {/* ======= PHASE 4: SPLIT SECTION ======= */}
          <SplitSection sectionRef={splitSectionRef} triggerRef={transitionSpacerRef} />
        </div>
      )}
    </>
  );
};

export default App;