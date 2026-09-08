import { Link, useLocation } from "react-router-dom";
import TextLogo from "./TextLogo";
import HeaderLogo from "./HeaderLogo";
import StoreButton from "./StoreButton";
import HamburgerButton from "./HamburgerButton";

export default function Navbar({ isMenuOpen, setIsMenuOpen, isScrolled, isPhase3, isPhase4 }) {
  const location = useLocation();

  const handleMobileClick = (e) => {
    if (location.pathname === "/") {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };
  return (
    <nav className="nav-bar">
      <div className="nav-inner relative flex justify-between items-center w-full">
        {/* Left: Text Logo (Desktop) & Mobile Store Button */}
        <div className="flex-shrink-0 flex items-center">
          <div className="desktop-logo" style={{ width: "8rem" }}>
            <TextLogo isMenuOpen={isMenuOpen} isScrolled={isScrolled} isPhase4={isPhase4} />
          </div>
          <div className="mobile-logo">
            <StoreButton isMenuOpen={isMenuOpen} />
          </div>
        </div>

        {/* Center: Brand Monogram Logo (Desktop) */}
        <div className="desktop-logo absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex-col items-center" style={{ opacity: isPhase3 ? 0 : 1, transition: "opacity 0.5s ease", pointerEvents: isPhase3 ? "none" : "auto" }}>
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
        <div className={`mobile-logo absolute left-1/2 flex-col items-center pointer-events-auto ${isScrolled ? 'mobile-hide-scrolled' : ''}`} style={{ top: "5.5rem", transform: "translateX(-50%)", width: "max-content", textAlign: "center" }}>
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
              <Link to="/" onClick={handleMobileClick} style={{ textDecoration: "none", display: "block" }}>
                <div className="flex gap-1 items-baseline justify-center">
                  <span style={{ fontSize: "1.4rem", fontWeight: 500, fontFamily: "'Playfair Display', serif", color: location.pathname === "/eedoo" ? "#7f7f7f" : "#2D3126" }}>EYAD</span>
                  <span style={{ fontSize: "1.3rem", fontWeight: 900, fontFamily: "'Brier ', sans-serif", color: location.pathname === "/eedoo" ? "#f5f4ee" : "#2D3126" }}>MONEIM</span>
                </div>
                <span style={{ display: "block", fontSize: "0.55rem", fontWeight: 800, letterSpacing: "0.05em", marginTop: "0.15rem", color: location.pathname === "/eedoo" ? "#f4f4ed" : "#2D3126" }}>DEVELOPER SINCE 2024</span>
              </Link>
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
  );
}
