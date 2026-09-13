import React from 'react';
import { OrbitalSphereBackground } from '../../shaders/orbital-sphere/OrbitalSphereBackground';
import { motion } from 'framer-motion';

const EedooAboutSection = () => {
  return (
    <motion.section 
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      style={{
        width: '100%',
        minHeight: '100vh',
        backgroundColor: '#0B0A10',
        padding: '250px 5% 100px',
        position: 'relative',
        zIndex: 10,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
        <OrbitalSphereBackground
          speed={2.16}
          particleSize={0.019}
          particleOpacity={0.80}
          orbitOpacity={0.25}
          hue={-23}
          scale={0.82}
          haloOpacity={0.18}
        />
      </div>
      
      {/* 
        This is an empty container for the About Section. 
        You can start adding your content, titles, and layout here. 
      */}
      <div style={{ flex: 1, position: 'relative', zIndex: 1, pointerEvents: 'none' }}>
        {/* Your content goes here */}
      </div>
    </motion.section>
  );
};

export default EedooAboutSection;
