import { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Navbar from '../components/nav/Navbar';
import FullscreenMenu from '../components/nav/FullscreenMenu';
import RobotHero from '../components/Robot3D';
import Footer from '../components/footer/Footer';
import EedooAboutSection from '../components/sections/EedooAboutSection';
import wallpaperPattern from '../assets/wallpaper.svg';
import { motion, useMotionValue, useSpring } from 'framer-motion';

gsap.registerPlugin(ScrollTrigger);

const EedooPage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isFooterReached, setIsFooterReached] = useState(false);
  const heroRef = useRef(null);
  const footerRef = useRef(null);

  // Scroll expression state (unused now, but passed to RobotHero)
  const [scrollExpression, setScrollExpression] = useState(null);
  const [scrollHeadTarget, setScrollHeadTarget] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
      if (footerRef.current) {
        const rect = footerRef.current.getBoundingClientRect();
        setIsFooterReached(rect.top <= window.innerHeight * 0.75);
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll, { passive: true });
    handleScroll();

    let st = null;
    if (footerRef.current) {
      st = ScrollTrigger.create({
        trigger: footerRef.current,
        start: 'top 75%',
        end: 'bottom top',
        onToggle: (self) => setIsFooterReached(self.isActive),
      });
    }

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
      if (st) st.kill();
    };
  }, []);

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

  // Pattern Parallax Animation (matching Home Page)
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 150, mass: 0.5 };
  const parallaxX = useSpring(mouseX, springConfig);
  const parallaxY = useSpring(mouseY, springConfig);

  useEffect(() => {
    const handleMouseMove = (e) => {
      const nx = (e.clientX / window.innerWidth) * 2 - 1;
      const ny = (e.clientY / window.innerHeight) * 2 - 1;
      mouseX.set(nx * 20);
      mouseY.set(ny * 20);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <div style={{
      width: '100%',
      minHeight: '100vh',
      backgroundColor: '#0B0A10',
      position: 'relative',
    }}>
      <Navbar 
        isMenuOpen={isMenuOpen} 
        setIsMenuOpen={setIsMenuOpen} 
        isScrolled={isScrolled}
        hideCenterLogo={isFooterReached}
      />
      <FullscreenMenu isOpen={isMenuOpen} currentPage="Eedoo" />
      
      {/* 3D Robot Hero Section */}
      <div 
        ref={heroRef}
        style={{ 
          width: '100%', 
          height: '100vh', 
          position: 'sticky',
          top: 0,
          zIndex: 1,
          backgroundColor: '#0B0A10'
        }}
      >
        {/* Animated Background Pattern */}
        <motion.div 
          className="eedoo-pattern-bg"
          style={{ 
            backgroundImage: `url(${wallpaperPattern})`,
            x: parallaxX,
            y: parallaxY
          }}
          animate={{
            x: [0, 15, -10, 0],
            y: [0, -15, 10, 0],
            rotate: [0, 1.5, -1.5, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        ></motion.div>
        <RobotHero 
          scrollExpression={scrollExpression}
          scrollHeadTarget={scrollHeadTarget}
        />
      </div>
      <div style={{ position: 'relative', zIndex: 10, backgroundColor: '#030303', marginTop: '-5px', paddingTop: '5px' }}>
        <EedooAboutSection />
        <div ref={footerRef}>
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default EedooPage;
