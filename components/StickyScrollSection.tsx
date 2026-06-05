"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef } from "react";

type PanelTheme = "dark" | "light";

type JlpSlide = {
  id: string;
  title: string;
  description: string;
  imageSrc: string;
  imageClassName?: string;
  /** tailwind bg for the right text panel */
  panelBg: string;
  theme: PanelTheme;
};

const SLIDES: JlpSlide[] = [
  {
    id: "encounters",
    title: "Supernatural Encounters",
    description:
      "JLP is a ministry where teenagers don't just learn about Jesus, they meet Him. Through worship, prayer, and the Word, we create spaces where young people leave marked by His presence, not just moved by a moment.",
    imageSrc: "/images/supernatural-encounters.png",
    imageClassName: "object-cover object-[center_40%]",
    panelBg: "bg-white",
    theme: "light",
  },
  {
    id: "mandate",
    title: "Love. Power. Revival.",
    description:
      "Jesus Love and Power Ministries exists to raise a generation that knows His love and walks in His power. We believe every teenager can carry revival into their schools, homes, and communities across Nigeria and beyond.",
    imageSrc: "/images/love-power-revival.png",
    imageClassName: "object-cover object-center",
    panelBg: "bg-[#120a0a]",
    theme: "dark",
  },
];

/** Hold on slide 2 before the section unpins */
const SCROLL_HOLD_SVH = 85;
/** Black space below the card so the next section does not eat the gap while scrolling */
const SECTION_BUFFER_SVH = 24;

const PANEL_THEME: Record<
  PanelTheme,
  {
    title: string;
    body: string;
  }
> = {
  dark: {
    title: "text-white",
    body: "text-white/50",
  },
  light: {
    title: "text-zinc-900",
    body: "text-zinc-500",
  },
};

/** Vertical wipe for the left image stack (unchanged) */
const pairedWipeTY = (p: number, idx: number, n: number): number => {
  if (p <= 0 && idx === 0) return 0;
  if (p >= n - 1 && idx === n - 1) return 0;

  if (p < idx) {
    if (idx === 0) return 0;
    if (p > idx - 1) {
      const t = p - (idx - 1);
      return 100 * (1 - t);
    }
    return 100;
  }

  if (p > idx + 1) return -100;

  if (p > idx) {
    const t = p - idx;
    return -100 * t;
  }

  return 0;
};

/**
 * Outgoing text panel peels left with a slight 3D fold (reveals slide below).
 * Incoming panels stay fixed underneath.
 */
const panelPeelTransform = (
  p: number,
  idx: number,
  n: number,
): string => {
  if (idx >= n - 1) {
    return "translate3d(0, 0, 0) rotateY(0deg) scale(1)";
  }

  if (p <= idx) {
    return "translate3d(0, 0, 0) rotateY(0deg) scale(1)";
  }

  if (p >= idx + 1) {
    return "translate3d(-108%, 0, 0) rotateY(-16deg) scale(0.96)";
  }

  const t = p - idx;
  const tx = -t * 108;
  const rotY = -t * 16;
  const scale = 1 - t * 0.04;
  return `translate3d(${tx}%, 0, 0) rotateY(${rotY}deg) scale(${scale})`;
};

export const StickyScrollSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  const imageInnerRefs = useRef<(HTMLDivElement | null)[]>([]);
  const textPanelRefs  = useRef<(HTMLDivElement | null)[]>([]);

  const animate = useCallback((progress: number) => {
    const n = SLIDES.length;

    imageInnerRefs.current.forEach((el, i) => {
      if (!el) return;
      el.style.transform = `translateY(${pairedWipeTY(progress, i, n)}%)`;
    });

    textPanelRefs.current.forEach((el, i) => {
      if (!el) return;
      el.style.transform = panelPeelTransform(progress, i, n);
      el.style.opacity = String(
        i < n - 1 && progress > i + 0.92
          ? Math.max(0, 1 - (progress - i - 0.92) / 0.08)
          : 1,
      );
    });
  }, []);

  const handleScroll = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;

    const { top, height } = el.getBoundingClientRect();
    const vh = window.innerHeight;
    const scrolled = -top;
    const scrollable = height - vh;

    const lastProgress = SLIDES.length - 1;
    const holdScroll =
      ((SCROLL_HOLD_SVH + SECTION_BUFFER_SVH) / 100) * vh;
    const transitionScroll = Math.max(1, scrollable - holdScroll);

    if (scrolled <= 0) { animate(0); return; }
    if (scrolled >= scrollable) { animate(lastProgress); return; }
    if (scrolled >= transitionScroll) { animate(lastProgress); return; }

    animate((scrolled / transitionScroll) * lastProgress);
  }, [animate]);

  useEffect(() => {
    requestAnimationFrame(() => animate(0));
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [animate, handleScroll]);

  const scrollTrackSvh =
    SLIDES.length * 100 + SCROLL_HOLD_SVH + SECTION_BUFFER_SVH;

  return (
    <>
      <div
        id="about"
        ref={containerRef}
        style={{ height: `${scrollTrackSvh}svh` }}
        className="relative bg-[#0a0a0a] px-8 sm:px-12 md:px-24"
      >
        <div
          className="sticky flex flex-col overflow-hidden rounded-2xl border border-zinc-800/40 h-[72vh] md:flex-row md:h-[60vh]"
          style={{ top: "20vh" }}
        >
          {/* ─── Left: image wipe ─── */}
          <div className="relative h-[38%] w-full shrink-0 overflow-hidden bg-zinc-900 md:h-auto md:w-[48%]">
            {SLIDES.map((slide, i) => (
              <div
                key={slide.id}
                className="absolute inset-0 overflow-hidden"
                style={{ zIndex: SLIDES.length - i }}
              >
                <div
                  ref={(el) => { imageInnerRefs.current[i] = el; }}
                  className="absolute inset-0 h-[102%] -top-[1%]"
                  style={{
                    willChange: "transform",
                    transform: i === 0 ? "translateY(0%)" : "translateY(100%)",
                  }}
                >
                  <Image
                    src={slide.imageSrc}
                    alt={slide.title}
                    fill
                    sizes="(min-width: 768px) 960px, 100vw"
                    quality={95}
                    className={slide.imageClassName ?? "object-cover object-center"}
                    priority={i === 0}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* ─── Right: full panels peel aside to reveal the next ─── */}
          <div
            className="relative flex flex-1 flex-col overflow-hidden bg-[#120a0a] md:flex-none md:w-[52%]"
            style={{ perspective: "1400px", perspectiveOrigin: "0% 50%" }}
          >
            {SLIDES.map((slide, i) => {
              const theme = PANEL_THEME[slide.theme];
              return (
                <div
                  key={slide.id}
                  ref={(el) => { textPanelRefs.current[i] = el; }}
                  className={`absolute inset-0 ${slide.panelBg}`}
                  style={{
                    zIndex: SLIDES.length - i,
                    willChange: "transform, opacity",
                    transformOrigin: "left center",
                    backfaceVisibility: "hidden",
                    transform: i === 0
                      ? "translate3d(0, 0, 0) rotateY(0deg) scale(1)"
                      : "translate3d(0, 0, 0) rotateY(0deg) scale(1)",
                  }}
                >
                  <div className="flex h-full flex-col justify-center px-10 py-14 md:px-14 md:py-16">
                    <h2
                      className={`max-w-[520px] text-balance text-[clamp(36px,4.5vw,56px)] font-bold leading-[1.05] tracking-[-0.02em] ${theme.title}`}
                    >
                      {slide.title}
                    </h2>
                    <p
                      className={`mt-8 max-w-[480px] text-pretty text-[clamp(16px,1.6vw,20px)] leading-[1.65] md:mt-10 ${theme.body}`}
                    >
                      {slide.description}
                    </p>
                  </div>
                </div>
              );
            })}

          </div>
        </div>

        {/* Scroll buffer below the card — keeps black gap before the next section rises */}
        <div
          className="bg-[#0a0a0a]"
          style={{ height: `${SCROLL_HOLD_SVH + SECTION_BUFFER_SVH}svh` }}
          aria-hidden="true"
        />
      </div>

      {/* Fixed breathing room after this section unpins */}
      <div
        className="bg-[#0a0a0a] h-[14vh] sm:h-[16vh]"
        aria-hidden="true"
      />
    </>
  );
};
