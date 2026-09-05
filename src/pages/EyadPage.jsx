import React, { useState, useEffect } from 'react';
import { useEyadTransition } from '../components/transitions/EyadTransition';
import Navbar from '../components/nav/Navbar';
import FullscreenMenu from '../components/nav/FullscreenMenu';
import arrowRight from '../assets/arrow-right.svg';

const EyadPage = () => {
  const { navigateWithTransition } = useEyadTransition();
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
      position: 'relative'
    }}>
      <Navbar 
        isMenuOpen={isMenuOpen} 
        setIsMenuOpen={setIsMenuOpen} 
        isScrolled={isScrolled}
      />
      <FullscreenMenu isOpen={isMenuOpen} currentPage="Eyad Moneim" />
    </div>
  );
};

export default EyadPage;
