import { useState, useEffect } from 'react';
import Navbar from '../components/nav/Navbar';
import FullscreenMenu from '../components/nav/FullscreenMenu';
import RobotHero from '../components/Robot3D';
import wallpaperPattern from '../assets/wallpaper.svg';
import { motion, useMotionValue, useSpring } from 'framer-motion';

const EedooPage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
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
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <Navbar 
        isMenuOpen={isMenuOpen} 
        setIsMenuOpen={setIsMenuOpen} 
        isScrolled={isScrolled}
      />
      <FullscreenMenu isOpen={isMenuOpen} currentPage="Eedoo" />
      
      {/* 3D Robot Hero Section */}
      <div style={{ 
        width: '100%', 
        height: '100vh', 
        position: 'relative', 
        zIndex: 1
      }}>
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
        <RobotHero />
      </div>
    </div>
  );
};

export default EedooPage;
