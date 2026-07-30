import { forwardRef, useEffect } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import blobsBg from '../../assets/wallpaper.svg';

const BackgroundBlobs = forwardRef(({ className = "bg-blobs", style = {}, imgStyle = {} }, ref) => {
  
  // Phase 4: Parallax (Background contour moves 2px)
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 150, mass: 0.5 };
  const parallaxX = useSpring(mouseX, springConfig);
  const parallaxY = useSpring(mouseY, springConfig);

  useEffect(() => {
    const handleMouseMove = (e) => {
      // Normalize mouse to -1 to 1
      const nx = (e.clientX / window.innerWidth) * 2 - 1;
      const ny = (e.clientY / window.innerHeight) * 2 - 1;
      // Background moves more noticeably
      mouseX.set(nx * 20);
      mouseY.set(ny * 20);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <motion.div 
      ref={ref}
      className={className}
      style={{
        ...style,
        x: parallaxX,
        y: parallaxY
      }}
      // Phase 6: Background Motion (Faster drift)
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
    >
      <img
        src={blobsBg}
        alt="Background Blobs"
        className={className === "bg-blobs" ? "bg-blobs-img" : ""}
        style={imgStyle}
      />
    </motion.div>
  );
});

BackgroundBlobs.displayName = 'BackgroundBlobs';

export default BackgroundBlobs;
