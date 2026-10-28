"use client";

import { useEffect, useId, useState } from "react";
import { motion, type MotionValue } from "framer-motion";
import opentype from "opentype.js";

interface SignatureProps {
  /** Text to generate signature for */
  text?: string;
  /** Color of the signature path */
  color?: string;
  /** Font size of the signature */
  fontSize?: number;
  /** Outline weight used to make the signature strokes bolder */
  strokeWidth?: number;
  /** Extra spacing between glyphs in pixels */
  letterSpacing?: number;
  /** Animation duration in seconds */
  duration?: number;
  /** Delay between character starts in seconds */
  stagger?: number;
  /** Controlled draw progress from 0 to 1; useful for scroll scrubbing */
  progress?: number | MotionValue<number>;
  /** Delay before animation starts in seconds */
  delay?: number;
  /** Additional CSS classes */
  className?: string;
  /** Only animate when in view */
  inView?: boolean;
  /** Only animate once */
  once?: boolean;
  /** Custom font URL to load */
  fontUrl?: string;
}

export function Signature({
  text = "Signature",
  color = "currentColor",
  fontSize = 32,
  strokeWidth = 2,
  letterSpacing = 0,
  duration = 1.5,
  stagger = 0.2,
  progress,
  delay = 0,
  className,
  inView = false,
  once = true,
  fontUrl,
}: SignatureProps) {
  const [paths, setPaths] = useState<string[]>([]);
  const [width, setWidth] = useState<number>(300);
  const [resolvedProgress, setResolvedProgress] = useState(0);
  const height = fontSize * 3; // Give plenty of vertical space
  const horizontalPadding = fontSize * 0.1;
  const topMargin = fontSize * 1.5; // Shift down
  const baseline = topMargin;
  const maskId = `signature-reveal-${useId().replace(/:/g, "")}`;
  const isProgressControlled = progress !== undefined;

  const getCharacterProgress = (index: number) => {
    if (!isProgressControlled) return undefined;
    const totalDuration = duration + Math.max(0, paths.length - 1) * stagger;
    const elapsed = Math.max(0, Math.min(totalDuration, resolvedProgress * totalDuration));
    return Math.max(0, Math.min(1, (elapsed - delay - index * stagger) / duration));
  };

  useEffect(() => {
    if (typeof progress === "number") {
      setResolvedProgress(progress);
      return;
    }
    if (!progress) return;

    setResolvedProgress(progress.get());
    return progress.on("change", setResolvedProgress);
  }, [progress]);

  useEffect(() => {
    async function load() {
      try {
        let font;
        const fontPaths = fontUrl 
          ? [fontUrl] 
          : [
              "/LastoriaBoldRegular.otf",
              "./LastoriaBoldRegular.otf",
              "https://www.componentry.fun/LastoriaBoldRegular.otf",
            ];

        for (const path of fontPaths) {
          try {
            const response = await fetch(path);
            if (!response.ok) {
              throw new Error(`Font request failed with status ${response.status}`);
            }
            font = opentype.parse(await response.arrayBuffer());
            break;
          } catch {
            // Try next path
          }
        }

        if (!font) {
          throw new Error("Font could not be loaded from any path");
        }

        let x = horizontalPadding;
        const newPaths: string[] = [];

        for (const char of text) {
          const glyph = font.charToGlyph(char);
          const path = glyph.getPath(x, baseline, fontSize);
          newPaths.push(path.toPathData(3));

          const advanceWidth = glyph.advanceWidth ?? font.unitsPerEm;
          x += advanceWidth * (fontSize / font.unitsPerEm) + letterSpacing;
        }

        setPaths(newPaths);
        setWidth(x + horizontalPadding);
      } catch (error) {
        console.error("Signature component font load error:", error);
        setPaths([]);
        setWidth(text.length * fontSize * 0.6);
      }
    }

    load();
  }, [text, fontSize, letterSpacing, baseline, horizontalPadding, fontUrl]);

  const variants = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: { pathLength: 1, opacity: 1 },
  };

  return (
    <motion.svg
      key={paths.length}
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      fill="none"
      className={className ? `overflow-visible ${className}` : "overflow-visible"}
      initial={isProgressControlled ? false : "hidden"}
      whileInView={!isProgressControlled && inView ? "visible" : undefined}
      animate={isProgressControlled ? undefined : inView ? undefined : "visible"}
      viewport={{ once }}
    >
      <defs>
        <mask id={maskId} maskUnits="userSpaceOnUse">
          {paths.map((d, i) => (
            <motion.path
              key={i}
              d={d}
              stroke="white"
              strokeWidth={fontSize * 0.22}
              fill="none"
              initial={isProgressControlled ? false : undefined}
              animate={isProgressControlled ? {
                pathLength: getCharacterProgress(i),
                opacity: getCharacterProgress(i) > 0 ? 1 : 0,
              } : undefined}
              variants={variants}
              transition={{
                pathLength: isProgressControlled
                  ? { duration: 0 }
                  : { delay: delay + i * stagger, duration, ease: "easeInOut" },
                opacity: isProgressControlled
                  ? { duration: 0 }
                  : { delay: delay + i * stagger + 0.01, duration: 0.01 },
              }}
              vectorEffect="non-scaling-stroke"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          ))}
        </mask>
      </defs>

      {paths.map((d, i) => (
        <motion.path
          key={i}
          d={d}
          stroke={color}
            strokeWidth={strokeWidth}
          fill="none"
            initial={isProgressControlled ? false : undefined}
            animate={isProgressControlled ? {
              pathLength: getCharacterProgress(i),
              opacity: getCharacterProgress(i) > 0 ? 1 : 0,
            } : undefined}
          variants={variants}
          transition={{
              pathLength: isProgressControlled
                ? { duration: 0 }
                : { delay: delay + i * stagger, duration, ease: "easeInOut" },
              opacity: isProgressControlled
                ? { duration: 0 }
                : { delay: delay + i * stagger + 0.01, duration: 0.01 },
          }}
          vectorEffect="non-scaling-stroke"
          strokeLinecap="butt"
          strokeLinejoin="round"
        />
      ))}

      <g mask={`url(#${maskId})`}>
        {paths.map((d, i) => <path key={i} d={d} fill={color} />)}
      </g>
    </motion.svg>
  );
}
