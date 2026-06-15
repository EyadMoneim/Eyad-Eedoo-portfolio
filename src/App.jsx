import React, { useState, useEffect, useRef, useCallback, useLayoutEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import LoadingScreen from "./LoadingScreen";
import blobsBg from "./assets/wallpaper.svg";
import eyadSmallSrc from "./assets/eyad-small.png";
import Logo from "./Logo";
import "./App.css";
import HeroSection from "./sections/HeroSection";
import ThreeDissolveHero from "./ThreeDissolveHero";
import ScrollVelocity from "./components/ScrollVelocity";

gsap.registerPlugin(ScrollTrigger);

// =========================================  
// Color Palette (matching Lando Norris site)
// =========================================
const COLORS = {
  darkGreen: "#282c20",
  white: "#f4f4ed",
  lime: "#d2ff00",
  limeOff: "#b2c73a",
  greenOffWhite1: "#dde1d2",
  greenOffWhite2: "#b4b8a5",
  black: "#111112",
};

// =========================================
// Cubic Bezier Easing (matching the site)
// =========================================
const EASE_DEFAULT = [0.65, 0.05, 0, 1];
const EASE_SMOOTH = [0.16, 1, 0.3, 1];

// =========================================
// Menu Images (Lando Norris menu images)
// =========================================
const MENU_IMAGES = [
  {
    src: "https://cdn.prod.website-files.com/67b5a02dc5d338960b17a7e9/67dae5835c0649927438ae19_ln4-menu-img-1.webp",
    alt: "Lando with helmet",
  },
  {
    src: "https://cdn.prod.website-files.com/67b5a02dc5d338960b17a7e9/67dae5829bee1b4a7b936935_ln4-menu-img-2.webp",
    alt: "Lando celebrating",
  },
  {
    src: "https://cdn.prod.website-files.com/67b5a02dc5d338960b17a7e9/67dae5827466101f6aca77eb_ln4-menu-img-3.webp",
    alt: "McLaren F1 car",
  },
  {
    src: "https://cdn.prod.website-files.com/67b5a02dc5d338960b17a7e9/67dae5824cc4245e1e6cf501_ln4-menu-img-5.webp",
    alt: "Lando in F1 car",
  },
];

// =========================================
// Helmet SVG Icon (from Lando site)
// =========================================
const HelmetIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 97 50.1"
    style={{ width: "5rem", height: "auto" }}
    fill="currentColor"
  >
    <path d="M68.4 33.8c.1-.7.3-1.4.4-2.3 1.1-6.1.4-11.8-2-17-2.9-6.2-9.3-12.9-18.3-13.1-9.1 0-15.6 6.4-18.7 12.6-2.6 5.1-3.4 10.8-2.4 17 .1.9.3 1.6.4 2.3 0 .5.1.9.3 1.4.1.6.3 1.2.4 1.7v.2c.1.5.3 1 .4 1.5.3 1 .5 1.5.8 1.9 0 .2.2.4.3.7l.3.9v.3c0 .3.1.5.2.8 0 1.4.7 2.2 1.5 3.3.9 1.1 1.6 1.3 2.9 1.5.9.1 1.4.2 3 .6l2 .4c2.3.8 4.6 1.3 7.9 1.3h.4c3.1 0 5.2-.4 7.5-1.1s1.9-.4 1.9-.4c1.6-.3 2.2-.4 3.1-.5 1.3-.2 2-.3 3-1.5.9-1 1.5-1.8 1.6-3.2.1-.3.2-.5.3-.8V42c0-.4.2-.7.3-.9.1-.3.2-.5.3-.7.3-.5.5-.9.8-1.9.1-.5.3-1 .4-1.5v-.2c.1-.5.3-1.1.4-1.7.2-.4.3-.9.3-1.4Z" />
  </svg>
);

// =========================================
// Store Icon SVG
// =========================================
const StoreIcon = () => (
  <svg
    width="17"
    height="18"
    viewBox="0 0 17 18"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={{ width: "1rem", height: "1rem" }}
  >
    <path
      d="m10.931 5.783-.759.812c-1.132 1.212-2.89 1.212-4.022 0l-.76-.812C4.313 4.637 2.568 5.29 2.275 6.928l-1.238 7.18c-.227 1.318.652 2.543 1.838 2.543h10.588c1.185 0 2.064-1.225 1.838-2.544l-1.239-7.179c-.28-1.638-2.037-2.29-3.116-1.145h-.014ZM10.839 3.048 9.84 1.849C8.894.717 7.43.717 6.484 1.85l-1 1.199"
      stroke="currentColor"
      strokeWidth="1.949"
      strokeMiterlimit="10"
    />
  </svg>
);

// =========================================
// Lando Norris Brand SVG
// =========================================
const LandoBrand = ({ color1 = "#c8cbbd", color2 = "#ebeee0" }) => (
  <svg
    width="138"
    height="63"
    viewBox="0 0 138 63"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={{ height: "3.75rem", width: "auto" }}
  >
    <path
      fill={color1}
      d="M122.638.174c8.968 0 14.659 6.985 14.659 15.737 0 8.795-5.691 15.736-14.659 15.736-8.967 0-14.658-6.985-14.658-15.736 0-8.752 5.691-15.737 14.658-15.737Zm4.182 30.265c4.613-1.293 7.329-8.88 4.958-17.158-2.328-8.106-8.752-13.193-13.322-11.9-4.57 1.294-7.286 8.968-4.914 17.246 2.328 8.105 8.708 13.106 13.278 11.813ZM88.191.821c13.495 0 18.496 7.027 18.496 14.874 0 9.614-6.381 15.305-17.116 15.305H78.577l-.56-1.207c1.724-1.854 1.724-1.854 1.724-3.492V5.52c0-1.639 0-1.639-1.724-3.536l.56-1.164h9.614Zm13.107 14.917c0-6.984-4.182-14.4-13.107-14.4-3.707 0-3.707 2.544-3.707 4.182V26.3c0 1.639.043 4.183 2.802 4.183 7.89 0 14.012-2.76 14.012-14.745ZM77.192.821l.604 1.207c-3.535 2.673-3.535 2.673-3.535 4.829V31h-1.983L55.636 7.547C53.74 4.917 53.74 4.7 53.74 9.444v15.52c0 2.156 0 2.156 3.363 4.829L56.498 31H50.29l-.603-1.207c3.535-2.673 3.535-2.673 3.535-4.829V6.857c0-2.156 0-2.156-3.535-4.829L50.29.821h6.338l15.305 21.384c1.81 2.5 1.81 2.5 1.81-1.983V6.857c0-2.156 0-2.156-3.362-4.829l.603-1.207h6.209ZM31.49.821h5.777l8.795 24.014c1.121 3.104 1.121 3.104 2.76 4.958L48.217 31h-7.07l-.604-1.207c1.293-1.81 1.293-1.81-.863-8.32-.776-2.329-1.552-3.493-3.104-3.493h-4.57l-2.586 2.414c-1.725 1.639-2.329 3.19-2.846 4.829-.69 2.242-.69 2.242 1.94 4.57L27.912 31h-5.519l-.603-1.207c3.276-2.414 3.276-2.414 4.44-5.519l6.467-17.158c.56-1.423.949-2.415-1.81-5.088L31.49.821Zm-1.725 18.582 2.027-1.94h4.656c1.552 0 1.336-1.337 1.078-2.07l-2.932-8.32c-.733-2.113-1.078-.95-1.423.043L29.12 18.152c-.776 2.07-.992 2.803.646 1.25ZM19.945 24.145l1.853.647L20.85 31H.716l-.56-1.164c1.767-1.94 1.767-1.94 1.767-3.708V5.693c0-1.768 0-1.768-1.767-3.708L.716.821h7.157l.56 1.164c-1.767 1.94-1.767 1.94-1.767 3.708v20.435c0 1.768 0 4.355 2.716 4.355 3.104 0 8.191-.431 10.563-6.338Z"
    />
    <path
      fill={color2}
      d="M125.417 62.186c-2.382 0-4.395-.357-6.039-1.072-1.619-.714-2.858-1.715-3.716-3.001-.834-1.31-1.25-2.811-1.25-4.502h6.503c0 .738.167 1.381.5 1.93.334.547.846.976 1.537 1.286.69.31 1.596.464 2.715.464.834 0 1.549-.095 2.144-.286.619-.19 1.096-.488 1.429-.893.334-.429.501-.977.501-1.644 0-.5-.096-.905-.286-1.215-.167-.31-.465-.571-.894-.786-.404-.214-.976-.405-1.715-.572a39.217 39.217 0 0 0-2.787-.5c-1.5-.238-2.823-.56-3.966-.965-1.143-.428-2.096-.952-2.859-1.572a5.935 5.935 0 0 1-1.715-2.215c-.381-.858-.571-1.858-.571-3.002 0-1.69.416-3.144 1.25-4.359.858-1.239 2.061-2.18 3.609-2.823 1.572-.667 3.442-1 5.61-1 2.073 0 3.871.333 5.396 1 1.524.643 2.703 1.549 3.537 2.716.834 1.167 1.263 2.525 1.286 4.073h-6.467c-.024-.738-.226-1.322-.608-1.75-.357-.453-.833-.775-1.429-.965a6.175 6.175 0 0 0-1.894-.286c-.738 0-1.381.095-1.929.286-.548.19-.977.476-1.286.857-.286.358-.429.834-.429 1.43 0 .595.155 1.072.464 1.429.334.333.929.62 1.787.857.857.239 2.084.477 3.68.715 1.072.167 2.12.393 3.145.679a9.72 9.72 0 0 1 2.858 1.286c.882.572 1.572 1.358 2.073 2.359.524 1 .786 2.298.786 3.894s-.417 3.014-1.251 4.252c-.81 1.215-2.025 2.168-3.644 2.859-1.62.69-3.645 1.036-6.075 1.036ZM105.813 61.83V35.78h6.396v26.05h-6.396ZM80.714 61.83V35.78h13.721c1.048 0 2.013.096 2.894.286.905.19 1.715.477 2.43.858.715.381 1.322.87 1.822 1.465a5.86 5.86 0 0 1 1.144 2.037c.286.762.429 1.631.429 2.608 0 1.596-.441 2.954-1.323 4.074-.857 1.095-2.024 1.834-3.501 2.215v.25c1.024.167 1.846.465 2.465.893.62.43 1.072.989 1.358 1.68.31.667.465 1.489.465 2.465v4.18c0 .477.011.978.035 1.502.048.5.191 1.012.429 1.536h-6.467c-.143-.31-.25-.726-.322-1.25a13.345 13.345 0 0 1-.107-1.787v-3.073c0-.667-.107-1.227-.322-1.68-.19-.452-.548-.81-1.072-1.071-.524-.262-1.274-.393-2.25-.393h-5.968v-5.039h6.289c1.358 0 2.31-.321 2.858-.964.572-.644.858-1.43.858-2.359 0-.595-.095-1.084-.286-1.465a2.17 2.17 0 0 0-.75-.965 3.202 3.202 0 0 0-1.18-.571 5.893 5.893 0 0 0-1.5-.179H87.11V61.83h-6.396ZM55.615 61.83V35.78h13.721c1.049 0 2.013.096 2.895.286.905.19 1.715.477 2.43.858.714.381 1.322.87 1.822 1.465.5.572.881 1.25 1.143 2.037.286.762.429 1.631.429 2.608 0 1.596-.44 2.954-1.322 4.074-.858 1.095-2.025 1.834-3.502 2.215v.25c1.024.167 1.846.465 2.466.893.619.43 1.072.989 1.357 1.68.31.667.465 1.489.465 2.465v4.18c0 .477.012.978.036 1.502.047.5.19 1.012.428 1.536h-6.467c-.143-.31-.25-.726-.322-1.25a13.328 13.328 0 0 1-.107-1.787v-3.073c0-.667-.107-1.227-.321-1.68-.191-.452-.548-.81-1.072-1.071-.524-.262-1.275-.393-2.252-.393h-5.967v-5.039h6.29c1.357 0 2.31-.321 2.858-.964.571-.644.857-1.43.857-2.359 0-.595-.095-1.084-.286-1.465a2.171 2.171 0 0 0-.75-.965 3.202 3.202 0 0 0-1.18-.571 5.893 5.893 0 0 0-1.5-.179h-5.753V61.83h-6.396ZM40.08 62.186c-2 0-3.811-.297-5.431-.893-1.596-.596-2.978-1.453-4.145-2.573-1.167-1.143-2.06-2.548-2.68-4.216-.62-1.667-.929-3.573-.929-5.717 0-2.144.31-4.038.93-5.681.618-1.668 1.512-3.062 2.679-4.181 1.167-1.144 2.549-2.013 4.145-2.609 1.62-.595 3.43-.893 5.431-.893 1.977 0 3.776.298 5.396.893 1.62.596 3.013 1.465 4.18 2.609 1.168 1.143 2.06 2.537 2.68 4.18.62 1.644.93 3.538.93 5.682 0 2.144-.31 4.05-.93 5.717-.62 1.668-1.512 3.073-2.68 4.216-1.167 1.12-2.56 1.977-4.18 2.573-1.62.596-3.419.893-5.396.893Zm0-5.467c1.334 0 2.501-.285 3.502-.857 1-.572 1.763-1.441 2.287-2.609.548-1.167.822-2.656.822-4.466 0-1.358-.155-2.525-.465-3.502-.31-1-.762-1.822-1.358-2.465a5.232 5.232 0 0 0-2.072-1.43c-.81-.333-1.715-.5-2.716-.5-1.334 0-2.501.286-3.502.858-.976.547-1.739 1.405-2.287 2.572-.547 1.168-.821 2.656-.821 4.467 0 1.358.154 2.549.464 3.573.334 1 .786 1.822 1.358 2.466a5.232 5.232 0 0 0 2.072 1.429c.81.31 1.716.464 2.716.464ZM1.02 61.83V35.78h7.79l9.576 16.973h.215l-.215-7.897v-9.075h6.146v26.048h-7.36L7.523 45.142h-.215l.25 7.218v9.47H1.021Z"
    />
  </svg>
);

// =========================================
// 1. Text Logo (Top Left)
// =========================================
const TextLogo = ({ isMenuOpen, isScrolled }) => {
  let eyadColor = "#2D3126";
  let moneimColor = "#2D3126";

  if (isMenuOpen) {
    eyadColor = "#f4f4ed";
    moneimColor = "#f4f4ed";
  } else if (isScrolled) {
    eyadColor = "gray";
    moneimColor = "#f4f4ed";
  }

  return (
    <a
      href="#home"
      style={{
        display: "flex",
        flexDirection: "column",
        pointerEvents: "auto",
        textDecoration: "none",
        lineHeight: 0.8,
        zIndex: 100,
      }}
    >
      <span style={{ 
        color: eyadColor,
        transition: "color 0.5s ease",
        fontSize: "2.6rem", 
        fontWeight: 500, 
        letterSpacing: "0.05em", 
        fontFamily: "'Playfair Display', serif" 
      }}>
        EYAD
      </span>
      <span style={{ 
        color: moneimColor,
        transition: "color 0.5s ease",
        fontSize: "2.3rem", 
        fontWeight: 900, 
        letterSpacing: "-0.04em", 
        fontFamily: "'Brier ', sans-serif",
        marginTop: "0.2rem"
      }}>
        MONEIM
      </span>
    </a>
  );
};

// =========================================
// 1.5 Header Logo (Center Monogram)
// =========================================
const HeaderLogo = ({ isMenuOpen, isScrolled }) => {
  const normalColor = isScrolled ? COLORS.lime : COLORS.darkGreen;
  const hoverColor = isScrolled ? "gray" : COLORS.lime;

  return (
    <a
      href="#home"
      className="header-logo-link relative group flex items-center justify-center"
      style={{
        width: "5rem",
        height: "3.75rem",
        opacity: isMenuOpen ? 0 : 1,
        pointerEvents: isMenuOpen ? "none" : "auto",
        transition: "opacity 0.5s ease",
      }}
    >
      {/* Primary Logo */}
      <Logo
        color={isMenuOpen ? COLORS.greenOffWhite1 : normalColor}
        className="absolute inset-0 w-full h-full transition-all duration-500 ease-out group-hover:opacity-0"
      />

      {/* Hover Logo */}
      <Logo
        color={hoverColor}
        className="absolute inset-0 w-full h-full transition-all duration-500 ease-out scale-75 opacity-0 group-hover:scale-100 group-hover:opacity-100"
      />
    </a>
  );
};

// =========================================
// 2. Store Button (Lime green, matching site)
// =========================================
const StoreButton = ({ isMenuOpen }) => (
  <motion.a
    href="#store"
    className="store-btn"
    animate={{
      opacity: isMenuOpen ? 0 : 1,
      y: isMenuOpen ? -10 : 0,
      scale: isMenuOpen ? 0.9 : 1,
    }}
    transition={{ duration: 0.75, ease: EASE_DEFAULT }}
    style={{
      pointerEvents: isMenuOpen ? "none" : "auto",
    }}
  >
    <StoreIcon />
    <span className="store-btn-text">Store</span>
  </motion.a>
);

// =========================================
// 3. Hamburger / Close Button (animated)
// =========================================
const HamburgerButton = ({ isOpen, toggle }) => {
  return (
    <button
      onClick={toggle}
      className={`nav-ham ${isOpen ? "is-open" : ""}`}
      title="Open / Close Menu"
      aria-label={isOpen ? "Close menu" : "Open menu"}
    >
      <div className="nav-ham-lines">
        <span className={`nav-ham-line nav-ham-line-1 ${isOpen ? "is-open" : ""}`} />
        <span className={`nav-ham-line nav-ham-line-2 ${isOpen ? "is-open" : ""}`} />
      </div>
    </button>
  );
};

// =========================================
// 4. Menu Image Component (with color blend overlay)
// =========================================
const MenuImage = ({ src, alt, index, isOpen }) => {
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
      {/* Color image (shows on hover) */}
      <img
        src={src}
        alt={alt}
        className="menu-img-color"
        style={{
          opacity: isHovered ? 1 : 0,
          transition: "opacity 0.75s cubic-bezier(0.65, 0.05, 0, 1)",
        }}
      />
      {/* Blended darkened image (default) */}
      <div className="menu-img-blend-stack">
        <div className="menu-img-blend-saturation" />
        <div className="menu-img-blend-darker" />
        <div className="menu-img-blend-tint" />
        <img src={src} alt={alt} className="menu-img-base" />
      </div>
    </motion.div>
  );
};

// =========================================
// 5. Strikethrough SVG for current link
// =========================================
const CurrentLinkSVG = () => (
  <svg
    width="100%"
    height="100%"
    viewBox="0 0 412 26"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="nav-link-current-svg"
  >
    <path
      d="M0 2h73.539c5.858 0 11.47 2.35 15.58 6.525l8.565 8.7a21.863 21.863 0 0 0 15.58 6.525h72.678c6.045 0 11.82-2.503 15.954-6.914l6.485-6.922A21.865 21.865 0 0 1 224.336 3h76.752a21.864 21.864 0 0 1 16.806 7.88l4.362 5.24A21.864 21.864 0 0 0 339.063 24H412"
      stroke="currentColor"
      strokeWidth="6"
    />
  </svg>
);

// =========================================
// Hover Split Text Effect
// =========================================
const HoverSplitText = ({ text }) => {
  const DURATION = 0.25;
  const STAGGER = 0.025;

  return (
    <motion.span
      initial="initial"
      whileHover="hovered"
      className="nav-link-text relative block overflow-hidden whitespace-nowrap"
    >
      <div>
        {text.split("").map((char, i) => (
          <motion.span
            variants={{
              initial: { y: 0 },
              hovered: { y: "-100%" },
            }}
            transition={{
              duration: DURATION,
              ease: "easeInOut",
              delay: STAGGER * i,
            }}
            className="inline-block"
            style={{ whiteSpace: "pre" }}
            key={i}
          >
            {char}
          </motion.span>
        ))}
      </div>
      <div className="absolute inset-0">
        {text.split("").map((char, i) => (
          <motion.span
            variants={{
              initial: { y: "100%" },
              hovered: { y: 0 },
            }}
            transition={{
              duration: DURATION,
              ease: "easeInOut",
              delay: STAGGER * i,
            }}
            className="inline-block"
            style={{ whiteSpace: "pre" }}
            key={i}
          >
            {char}
          </motion.span>
        ))}
      </div>
    </motion.span>
  );
};

// =========================================
// 6. Fullscreen Menu
// =========================================
const FullscreenMenu = ({ isOpen, currentPage }) => {
  const menuLinks = [
    { label: "Home", href: "#home" },
    { label: "Eyad Moneim", href: "#eyad-moneim" },
    { label: "Eedoo", href: "#eedoo" },
  ];

  const socialLinks = [
    { label: "GitHub", href: "https://github.com/EyadMoneim" },
    { label: "Linkedin", href: "https://www.linkedin.com/in/eyad-moneim-3041bb256/" },
    { label: "Instagram", href: "https://www.instagram.com/eyadmoneim/?next=" },
    { label: "Whatsapp", href: "http://wa.me/201009500977" },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="nav-menu-overlay"
          initial={{ clipPath: "ellipse(120% 0% at 50% 20%)" }}
          animate={{ clipPath: "ellipse(120% 100% at 50% 20%)" }}
          exit={{ clipPath: "ellipse(120% 0% at 50% 20%)" }}
          transition={{ duration: 0.9, ease: EASE_DEFAULT }}
        >
          {/* Background blob pattern */}
          <div className="nav-menu-bg-blobs" />

          <div className="nav-menu-content">
            {/* LEFT: Image Grid */}
            <div className="nav-menu-images">
              <div className="nav-menu-images-track">
                {/* Column 1 */}
                <div className="nav-menu-images-col">
                  <MenuImage
                    src={MENU_IMAGES[0].src}
                    alt={MENU_IMAGES[0].alt}
                    index={0}
                    isOpen={isOpen}
                  />
                  <MenuImage
                    src={MENU_IMAGES[2].src}
                    alt={MENU_IMAGES[2].alt}
                    index={2}
                    isOpen={isOpen}
                  />
                </div>
                {/* Column 2 */}
                <div className="nav-menu-images-col">
                  <MenuImage
                    src={MENU_IMAGES[1].src}
                    alt={MENU_IMAGES[1].alt}
                    index={1}
                    isOpen={isOpen}
                  />
                  <MenuImage
                    src={MENU_IMAGES[3].src}
                    alt={MENU_IMAGES[3].alt}
                    index={3}
                    isOpen={isOpen}
                  />
                </div>
              </div>
            </div>

            {/* RIGHT: Links + Social */}
            <div className="nav-menu-links-section">
              {/* Spacer for top padding */}
              <div style={{ height: "1.25rem" }} />

              {/* Navigation Links */}
              <div className="nav-menu-links-col">
                <div className="nav-menu-links-list">
                  {menuLinks.map((link, i) => (
                    <div key={link.label} className="nav-link-overflow-clip">
                      <motion.a
                        href={link.href}
                        className={`nav-menu-link ${
                          link.label === currentPage ? "is-current" : ""
                        }`}
                        initial={{ y: "110%", opacity: 0 }}
                        animate={{ y: "0%", opacity: 1 }}
                        exit={{ y: "110%", opacity: 0 }}
                        transition={{
                          duration: 0.8,
                          delay: 0.2 + i * 0.06,
                          ease: EASE_DEFAULT,
                        }}
                      >
                        <HoverSplitText text={link.label} />
                        {link.label === currentPage && <CurrentLinkSVG />}
                      </motion.a>
                    </div>
                  ))}
                </div>

                {/* Helmet Icon + Since text */}
                <motion.div
                  className="nav-helmet-section"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ duration: 0.8, delay: 0.5, ease: EASE_DEFAULT }}
                >
                  <div className="nav-helmet-icon">
                    <HelmetIcon />
                  </div>
                  <div className="nav-helmet-text">developer since 2024</div>
                </motion.div>
              </div>

              {/* Social Links */}
              <motion.div
                className="nav-social-section"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 15 }}
                transition={{ duration: 0.8, delay: 0.55, ease: EASE_DEFAULT }}
              >
                <a href="mailto:eyad.moneim@gmail.com" className="nav-social-link business">
                  business enquiries
                </a>
                <div className="nav-social-links-row">
                  {socialLinks.map((s) => (
                    <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" className="nav-social-link">
                      {s.label}
                    </a>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};



// =========================================
// 7. Main App Component
// =========================================
const App = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isInteractive, setIsInteractive] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);

  // Refs for GSAP ScrollTrigger
  const heroScrollSectionRef = useRef(null);
  const groupWallpaperRef = useRef(null);
  const eyadSmallRef = useRef(null);
  const threeDissolveRef = useRef(null);
  const bgBlobsRef = useRef(null);

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
            duration: 0.8,
            ease: 'none',
          },
          0
        );

        // 3. eyad-small.png crossfades in (30% → 70%)
        if (eyadSmallEl) {
          tl.to(
            eyadSmallEl,
            {
              opacity: 1,
              duration: 0.4,
              ease: 'power1.inOut',
            },
            0.3
          );
        }

        currentTl = tl;

        // 4. Disable ThreeDissolveHero interactivity during scroll
        currentInteractiveST = ScrollTrigger.create({
          trigger: heroScrollSectionRef.current,
          start: 'top top',
          end: 'bottom bottom',
          onUpdate: (self) => {
            setIsInteractive(self.progress < 0.05);
            setIsScrolled(self.progress > 0.05);
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
          <div className="scroll-reveal-bg">
            <motion.div
              className="bg-blobs"
              style={{ opacity: 0.1 }}
              animate={{
                x: [0, 30, -15, 0],
                y: [0, -30, 20, 0],
                scale: [1, 1.1, 0.95, 1],
                rotate: [0, 2, -2, 0],
              }}
              transition={{
                duration: 20,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <img
                src={blobsBg}
                alt="Background Blobs"
                className="bg-blobs-img"
              />
            </motion.div>
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

          {/* ======= NAVBAR ======= */}
          <nav className="nav-bar">
            <div className="nav-inner relative flex justify-between items-center w-full">
              {/* Left: Text Logo (Desktop) & Mobile Store Button */}
              <div className="flex-shrink-0 flex items-center">
                <div className="desktop-logo" style={{ width: "8rem" }}>
                  <TextLogo isMenuOpen={isMenuOpen} isScrolled={isScrolled} />
                </div>
                <div className="mobile-logo">
                  <StoreButton isMenuOpen={isMenuOpen} />
                </div>
              </div>

              {/* Center: Brand Monogram Logo (Desktop) */}
              <div className="desktop-logo absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex-col items-center">
                <HeaderLogo isMenuOpen={isMenuOpen} isScrolled={isScrolled} />
                <div style={{
                  position: "absolute",
                  top: "100%",
                  left: "50%",
                  transform: "translateX(-50%)",
                  opacity: (isScrolled && !isMenuOpen) ? 1 : 0,
                  transition: "opacity 0.5s ease",
                  pointerEvents: (isScrolled && !isMenuOpen) ? "auto" : "none",
                  paddingTop: "0.08rem",
                  whiteSpace: "nowrap"
                }}>
                  <span style={{ fontSize: "0.60rem", fontWeight: 800, letterSpacing: "0.3em", color: "#f4f4ed", textTransform: "uppercase" }}>
                    MESSAGE FROM EYAD
                  </span>
                </div>
              </div>

              {/* Center: Mobile Logo Cluster */}
              <div className="mobile-logo absolute left-1/2 flex-col items-center pointer-events-auto" style={{ top: "5.5rem", transform: "translateX(-50%)", width: "max-content", textAlign: "center" }}>
                <div style={{ 
                  transform: isScrolled ? "scale(0.6) translateY(2.2rem)" : "scale(0.85) translateY(0)", 
                  transformOrigin: "center top", 
                  marginBottom: "-0.5rem",
                  transition: "transform 0.5s ease" 
                }}>
                  <HeaderLogo isMenuOpen={isMenuOpen} isScrolled={isScrolled} />
                </div>
                <div style={{ opacity: isMenuOpen ? 0 : 1, pointerEvents: isMenuOpen ? "none" : "auto", transition: "opacity 0.5s ease", position: "relative" }}>
                  
                  {/* Default State (Not Scrolled) */}
                  <div style={{ opacity: isScrolled ? 0 : 1, transition: "opacity 0.5s ease", pointerEvents: isScrolled ? "none" : "auto" }}>
                    <div className="flex gap-1 items-baseline justify-center">
                      <span style={{ fontSize: "1.4rem", fontWeight: 500, fontFamily: "'Playfair Display', serif", color: "#2D3126" }}>EYAD</span>
                      <span style={{ fontSize: "1.3rem", fontWeight: 900, fontFamily: "'Brier ', sans-serif", color: "#2D3126" }}>MONEIM</span>
                    </div>
                    <span style={{ display: "block", fontSize: "0.55rem", fontWeight: 800, letterSpacing: "0.05em", marginTop: "0.15rem", color: "#2D3126" }}>DEVELOPER SINCE 2024</span>
                  </div>

                  {/* Scrolled State */}
                  <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", opacity: isScrolled ? 1 : 0, transition: "opacity 0.5s ease", pointerEvents: isScrolled ? "auto" : "none" }}>
                    <span style={{ fontSize: "0.65rem", fontWeight: 800, letterSpacing: "0.2em", color: "#f4f4ed", textTransform: "uppercase" }}>MESSAGE FROM EYAD</span>
                  </div>
                  
                </div>
              </div>

              {/* Right: Store + Hamburger (Desktop) & Mobile Hamburger */}
              <div className="flex items-center">
                <div className="desktop-logo nav-btns">
                  <StoreButton isMenuOpen={isMenuOpen} />
                  <HamburgerButton isOpen={isMenuOpen} toggle={() => setIsMenuOpen(!isMenuOpen)} />
                </div>
                <div className="mobile-logo">
                  <HamburgerButton isOpen={isMenuOpen} toggle={() => setIsMenuOpen(!isMenuOpen)} />
                </div>
              </div>
            </div>
          </nav>

          {/* ======= FULLSCREEN MENU ======= */}
          <FullscreenMenu isOpen={isMenuOpen} currentPage="Home" />

          {/* ======= GROUP-WALLPAPER: fixed layer that shrinks on scroll ======= */}
          {/* Uses CSS transition (not framer-motion filter) to avoid breaking position:fixed */}
          <div
            className="group-wallpaper"
            ref={groupWallpaperRef}
            style={{
              filter: isMenuOpen ? "blur(12px)" : "none",
              opacity: isMenuOpen ? 0.3 : 1,
              transition: "filter 1s cubic-bezier(0.16, 1, 0.3, 1), opacity 1s cubic-bezier(0.16, 1, 0.3, 1)",
            }}
          >
            {/* Animated wallpaper blobs */}
            <motion.div
              ref={bgBlobsRef}
              className="bg-blobs"
              animate={{
                x: [0, 30, -15, 0],
                y: [0, -30, 20, 0],
                scale: [1, 1.1, 0.95, 1],
                rotate: [0, 2, -2, 0],
              }}
              transition={{
                duration: 20,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <img
                src={blobsBg}
                alt="Background Blobs"
                className="bg-blobs-img"
              />
            </motion.div>
            <div className="bg-gradient-overlay" />

            {/* Hero inner content */}
            <div className="hero-inner" style={{ position: "relative", width: "100%", height: "100vh" }}>
              <div ref={threeDissolveRef} style={{ position: 'absolute', inset: 0, zIndex: 10, pointerEvents: 'none' }}>
                <ThreeDissolveHero isInteractive={isInteractive} />
              </div>
              <HeroSection />
            </div>

            {/* eyad-small.png crossfade overlay */}
            <img
              ref={eyadSmallRef}
              src={eyadSmallSrc}
              alt="Eyad portrait"
              className="eyad-small-overlay"
            />
          </div>

          {/* ======= SCROLL SPACER ======= */}
          {/* Provides scroll distance for the shrink animation */}
          <div className="hero-scroll-section" ref={heroScrollSectionRef} />
        </div>
      )}
    </>
  );
};

export default App;