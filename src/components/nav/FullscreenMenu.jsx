import { motion, AnimatePresence } from "framer-motion";
import { EASE_DEFAULT } from "../../constants/animation";
import { MENU_IMAGES } from "../../constants/menuData";
import MenuImage from "./MenuImage";
import HoverSplitText from "./HoverSplitText";
import CurrentLinkSVG from "./CurrentLinkSVG";
import DeveloperBadge from "../badges/DeveloperBadge";

export default function FullscreenMenu({ isOpen, currentPage }) {
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
                        {link.label === currentPage && <CurrentLinkSVG delay={0.4 + i * 0.06} />}
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
