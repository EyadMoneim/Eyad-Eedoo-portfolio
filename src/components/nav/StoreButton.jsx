import { motion } from "framer-motion";
import HoverSplitText from "./HoverSplitText";
import StoreIcon from "../icons/StoreIcon";
import { EASE_DEFAULT } from "../../constants/animation";

export default function StoreButton({ isMenuOpen }) {
  return (
    <motion.a
      href="#store"
      className="store-btn"
      initial="initial"
      whileHover="hovered"
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
      <span className="store-btn-text">
        <HoverSplitText text="Eedoo" />
      </span>
    </motion.a>
  );
}
