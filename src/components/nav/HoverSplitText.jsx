import { motion } from "framer-motion";

export default function HoverSplitText({ text }) {
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
}
