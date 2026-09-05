import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { EASE_DEFAULT } from "../../constants/animation";
import ReactLogo3D from "../ReactLogo3D";
import HoverSplitText from "./HoverSplitText";
import CurrentLinkSVG from "./CurrentLinkSVG";
import DeveloperBadge from "../badges/DeveloperBadge";
import { useEedooTransition } from "../transitions/EedooTransition";
import { useEyadTransition } from "../transitions/EyadTransition";

export default function FullscreenMenu({ isOpen, currentPage }) {
  const { navigateWithTransition: navigateToEedoo } = useEedooTransition();
  const { navigateWithTransition: navigateToEyad } = useEyadTransition();

  useEffect(() => {
    if (isOpen) {
      if (window.lenis) {
        window.lenis.stop();
      }
      
      const prevHtmlOverflow = document.documentElement.style.overflow;
      const prevBodyOverflow = document.body.style.overflow;
      
      document.documentElement.style.overflow = "hidden";
      document.body.style.overflow = "hidden";

      const preventScroll = (e) => {
        e.preventDefault();
      };
      
      window.addEventListener("wheel", preventScroll, { passive: false });
      window.addEventListener("touchmove", preventScroll, { passive: false });

      return () => {
        if (window.lenis) {
          window.lenis.start();
        }
        document.documentElement.style.overflow = prevHtmlOverflow;
        document.body.style.overflow = prevBodyOverflow;
        
        window.removeEventListener("wheel", preventScroll);
        window.removeEventListener("touchmove", preventScroll);
      };
    }
  }, [isOpen]);

  const menuLinks = [
    { label: "Home", href: "/" }, 
    { label: "Eyad Moneim", href: "/eyad" },
    { label: "Eedoo", href: "/eedoo" },
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
          data-lenis-prevent
          initial={{ clipPath: "ellipse(120% 0% at 50% 20%)" }}
          animate={{ clipPath: "ellipse(120% 100% at 50% 20%)" }}
          exit={{ clipPath: "ellipse(120% 0% at 50% 20%)" }}
          transition={{ duration: 0.9, ease: EASE_DEFAULT }}
        >
          {/* Background blob pattern */}
          <div className="nav-menu-bg-blobs" />

          <div className="nav-menu-content">
            {/* LEFT: 3D React Logo */}
            <div className="nav-menu-images" style={{ flex: 1 }}>
              <ReactLogo3D />
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
                        onClick={(e) => {
                          if (link.href.startsWith('/')) {
                            e.preventDefault();
                            if (link.href === '/eedoo' || link.href === '/') {
                              navigateToEedoo(link.href);
                            } else if (link.href === '/eyad') {
                              navigateToEyad(link.href);
                            }
                          }
                        }}
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
                        {link.label === currentPage && (
                          <CurrentLinkSVG 
                            delay={0.4 + i * 0.06} 
                            strokeWidth={link.label === "Eyad Moneim" ? 3 : 6}
                          />
                        )}
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
                    <DeveloperBadge />
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
}
