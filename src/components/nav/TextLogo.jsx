import { Link, useLocation } from "react-router-dom";

export default function TextLogo({ isMenuOpen, isScrolled, isPhase4 }) {
  const location = useLocation();
  const isEedooPage = location.pathname === "/eedoo";
  
  let eyadColor = isEedooPage ? "#f4f4ed" : "#2D3126";
  let moneimColor = isEedooPage ? "#f4f4ed" : "#2D3126";

  if (isMenuOpen) {
    eyadColor = "#f4f4ed";
    moneimColor = "#f4f4ed";
  } else if (isPhase4) {
    eyadColor = isEedooPage ? "#f4f4ed" : "#2D3126";
  } else if (isScrolled) {
    eyadColor = "gray";
    moneimColor = "#f4f4ed";
  }

  const handleClick = (e) => {
    if (location.pathname === "/") {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <Link
      to="/"
      onClick={handleClick}
      style={{
        display: "flex",
        flexDirection: "column",
        pointerEvents: "auto",
        textDecoration: "none",
        lineHeight: 0.8,
        zIndex: 100,
        cursor: "pointer",
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
    </Link>
  );
}
