import { memo, useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { CustomEase } from "gsap/CustomEase";
import { SplitText } from "gsap/SplitText";
import "./LoadingScreen.css";

gsap.registerPlugin(CustomEase, SplitText);

const LoadingScreen = memo(({ onLoadingComplete }) => {
  const rootRef = useRef(null);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;

    CustomEase.create("eyadIntroHop", ".8, 0, .3, 1");

    const splitInstances = [];
    const splitTextElements = (
      selector,
      type = "words,chars",
      addFirstChar = false,
    ) => {
      const elements = root.querySelectorAll(selector);

      elements.forEach((element) => {
        const splitText = new SplitText(element, {
          type,
          wordsClass: "intro-word",
          charsClass: "intro-char",
        });

        splitInstances.push(splitText);

        if (type.includes("chars")) {
          splitText.chars.forEach((char, index) => {
            const originalText = char.textContent;
            char.innerHTML = `<span>${originalText}</span>`;

            if (addFirstChar && index === 0) {
              char.classList.add("first-char");
            }
          });
        }
      });
    };

    splitTextElements(".intro-title h1", "words, chars", true);
    splitTextElements(".outro-title h1");
    splitTextElements(".tag p", "words");

    const isMobile = window.innerWidth <= 1000;
    const firstCharFinalX = isMobile ? "4.85rem" : "10.85rem";
    const firstCharPrepX = isMobile ? "5.75rem" : "12.75rem";
    const firstCharFinalY = isMobile ? "-1rem" : "-2.75rem";
    const outroFinalX = isMobile ? "-3rem" : "-8rem";
    const outroFinalSize = isMobile ? "6rem" : "14rem";

    const ctx = gsap.context(() => {
      gsap.set(".intro-reveal-shell", {
        clipPath: "polygon(0% 48%, 0% 48%, 0% 52%, 0% 52%)",
      });

      gsap.set(
        [
          ".split-overlay .intro-title .first-char span",
          ".split-overlay .outro-title .intro-char span",
        ],
        { y: "0%" },
      );

      gsap.set(".split-overlay .intro-title .first-char", {
        x: firstCharFinalX,
        y: firstCharFinalY,
        fontWeight: "900",
        scale: 0.75,
      });

      gsap.set(".split-overlay .outro-title .intro-char", {
        x: outroFinalX,
        fontSize: outroFinalSize,
        fontWeight: "500",
      });

      const tl = gsap.timeline({
        defaults: { ease: "eyadIntroHop" },
        onComplete: onLoadingComplete,
      });
      const tags = gsap.utils.toArray(".tag");

      tl.to(
        ".intro-reveal-shell",
        {
          clipPath: "polygon(0% 48%, 100% 48%, 100% 52%, 0% 52%)",
          duration: 1,
        },
        5,
      );

      tags.forEach((tag, index) => {
        tl.to(
          tag.querySelectorAll("p .intro-word"),
          {
            y: "0%",
            duration: 0.75,
          },
          0.5 + index * 0.1,
        );
      });

      tl.to(
        ".preloader .intro-title .intro-char span",
        {
          y: "0%",
          duration: 0.75,
          stagger: 0.05,
        },
        0.5,
      )
        .to(
          ".preloader .intro-title .intro-char:not(.first-char) span",
          {
            y: "100%",
            duration: 0.75,
            stagger: 0.05,
          },
          2,
        )
        .to(
          ".preloader .outro-title .intro-char span",
          {
            y: "0%",
            duration: 0.75,
            stagger: 0.075,
          },
          2.5,
        )
        .to(
          ".preloader .intro-title .first-char",
          {
            x: firstCharPrepX,
            duration: 1,
          },
          3.5,
        )
        .to(
          ".preloader .outro-title .intro-char",
          {
            x: outroFinalX,
            duration: 1,
          },
          3.5,
        )
        .to(
          ".preloader .intro-title .first-char",
          {
            x: firstCharFinalX,
            y: firstCharFinalY,
            fontWeight: "900",
            scale: 0.75,
            duration: 0.75,
          },
          4.5,
        )
        .to(
          ".preloader .outro-title .intro-char",
          {
            x: outroFinalX,
            fontSize: outroFinalSize,
            fontWeight: "500",
            duration: 0.75,
            onComplete: () => {
              gsap.set(".preloader", {
                clipPath: "polygon(0 0, 100% 0, 100% 50%, 0 50%)",
              });
              gsap.set(".split-overlay", {
                clipPath: "polygon(0 50%, 100% 50%, 100% 100%, 0 100%)",
              });
            },
          },
          4.5,
        );

      tags.forEach((tag, index) => {
        tl.to(
          tag.querySelectorAll("p .intro-word"),
          {
            y: "100%",
            duration: 0.75,
          },
          5.5 + index * 0.1,
        );
      });

      tl.to(
        [".preloader", ".split-overlay"],
        {
          y: (i) => (i === 0 ? "-50%" : "50%"),
          duration: 1,
        },
        6,
      )
        .to(
          ".intro-reveal-shell",
          {
            clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
            duration: 1,
          },
          6,
        )
        .to(
          root,
          {
            autoAlpha: 0,
            duration: 0.2,
            ease: "power1.out",
          },
          6.85,
        );
    }, document);

    return () => {
      ctx.revert();
      splitInstances.forEach((splitText) => splitText.revert());
    };
  }, [onLoadingComplete]);

  return (
    <div className="eyad-intro" ref={rootRef}>
      <div className="preloader">
        <div className="intro-title">
          <h1>EYAD MONEIM</h1>
        </div>
        <div className="outro-title">
          <h1>6</h1>
        </div>
      </div>

      <div className="split-overlay">
        <div className="intro-title">
          <h1>EYAD MONEIM</h1>
        </div>
        <div className="outro-title">
          <h1>6</h1>
        </div>
      </div>

      <div className="tags-overlay">
        <div className="tag tag-1">
          <p>Creative Frontend</p>
        </div>
        <div className="tag tag-2">
          <p>Motion Systems</p>
        </div>
        <div className="tag tag-3">
          <p>Digital Detail</p>
        </div>
      </div>
    </div>
  );
});

LoadingScreen.displayName = "LoadingScreen";

export default LoadingScreen;
