import { useState } from "react";
import { motion } from "framer-motion";
import { EASE_DEFAULT } from "../../constants/animation";

export default function MenuImage({ src, alt, index, isOpen }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      className="menu-img-wrapper"
      initial={{ clipPath: "ellipse(120% 0% at 50% 20%)" }}
      animate={
        isOpen
          ? { clipPath: "ellipse(120% 100% at 50% 20%)" }
          : { clipPath: "ellipse(120% 0% at 50% 20%)" }
      }
      transition={{
        duration: 1,
        delay: isOpen ? 0.15 + index * 0.08 : 0,
        ease: EASE_DEFAULT,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <img
        src={src}
        alt={alt}
        className="menu-img-color"
        style={{
          opacity: isHovered ? 1 : 0,
          transition: "opacity 0.75s cubic-bezier(0.65, 0.05, 0, 1)",
        }}
      />
      <div className="menu-img-blend-stack">
        <div className="menu-img-blend-saturation" />
        <div className="menu-img-blend-darker" />
        <div className="menu-img-blend-tint" />
        <img src={src} alt={alt} className="menu-img-base" />
      </div>
    </motion.div>
  );
}
