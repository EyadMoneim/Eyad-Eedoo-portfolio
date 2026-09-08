import { Link, useLocation } from "react-router-dom";
import Logo from "../../Logo";
import { COLORS } from "../../constants/colors";

export default function HeaderLogo({ isMenuOpen, isScrolled }) {
  const location = useLocation();
  const isEedoo = location.pathname === "/eedoo";
  const normalColor = isEedoo ? "#c7b4fa" : (isScrolled ? COLORS.lime : COLORS.darkGreen);
  const hoverColor = isEedoo ? "#7f7f7f" : (isScrolled ? "gray" : COLORS.lime);

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
      className="header-logo-link relative group flex items-center justify-center cursor-pointer"
      style={{
        width: "5rem",
        height: "3.75rem",
        opacity: isMenuOpen ? 0 : 1,
        pointerEvents: isMenuOpen ? "none" : "auto",
        transition: "opacity 0.5s ease",
      }}
    >
      <Logo
        color={isMenuOpen ? COLORS.greenOffWhite1 : normalColor}
        className="absolute inset-0 w-full h-full transition-all duration-500 ease-out group-hover:opacity-0"
      />

      <Logo
        color={hoverColor}
        className="absolute inset-0 w-full h-full transition-all duration-500 ease-out scale-75 opacity-0 group-hover:scale-100 group-hover:opacity-100"
      />
    </Link>
  );
}
