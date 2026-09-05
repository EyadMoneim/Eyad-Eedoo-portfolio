import React, { useState, useEffect } from 'react';
import { useEedooTransition } from '../components/transitions/EedooTransition';
import Navbar from '../components/nav/Navbar';
import FullscreenMenu from '../components/nav/FullscreenMenu';

const EedooPage = () => {
  const { navigateWithTransition } = useEedooTransition();
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

  return (
    <div style={{
      width: '100%',
      minHeight: '100vh',
      backgroundColor: '#f4f4ec',
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
    </div>
  );
};

export default EedooPage;
