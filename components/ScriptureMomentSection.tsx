"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef } from "react";

const BACKGROUND_IMAGE_SRC = "/images/scripture-moment-generation.png";

/** Clamp value to [0..1] for safe animation math. */
const clamp01 = (v: number): number => Math.max(0, Math.min(1, v));

/** Smoothstep easing for softer editorial motion. */
const smoothstep = (t: number): number => {
  const x = clamp01(t);
  return x * x * (3 - 2 * x);
};

/**
 * Critically-damped-ish spring approximation (no deps).
 * Produces a physics-like ease with a small overshoot/settle.
 */
const springEase = (t: number): number => {
  const x = clamp01(t);
  // Tuned by eye: fast approach + subtle overshoot.
  const damping = 10;
  const frequency = 18;
  const e = Math.exp(-damping * x);
  return 1 - e * (Math.cos(frequency * x) + (damping / frequency) * Math.sin(frequency * x));
};

/**
 * ScriptureMomentSection
 * - Full-screen pinned section
 * - Reveals a scripture word-by-word as you scroll
 * - Designed as a “pause moment” between content-heavy sections
 */
export const ScriptureMomentSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const backgroundRef = useRef<HTMLDivElement>(null);
  const wordRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const arrowRefs = useRef<(HTMLDivElement | null)[]>([]);

  /**
   * Draft content — easy to swap later.
   * Note: we keep punctuation attached to words so the reveal feels “spoken.”
   */
  const verseRef = "Psalm 127:4";
  const verseText =
    "Making this generation effective arrows in the hands of the mighty warrior";

  const words = useMemo(() => verseText.split(" ").filter(Boolean), [verseText]);

  const arrows = useMemo(
    () =>
      [
        {
          id: "arrow-1",
          size: 220,
          start: { x: -70, y: 18, r: -18 },
          end: { x: 140, y: 54, r: 10 },
          delay: 0.02,
        },
        {
          id: "arrow-2",
          size: 260,
          start: { x: -88, y: 22, r: 18 },
          end: { x: 150, y: 46, r: 4 },
          delay: 0.09,
        },
        {
          id: "arrow-3",
          size: 240,
          start: { x: -96, y: 74, r: -10 },
          end: { x: 148, y: 58, r: 12 },
          delay: 0.16,
        },
        {
          id: "arrow-4",
          size: 300,
          start: { x: -92, y: 66, r: 8 },
          end: { x: 156, y: 60, r: -8 },
          delay: 0.24,
        },
        {
          id: "arrow-5",
          size: 200,
          start: { x: -78, y: 46, r: -22 },
          end: { x: 142, y: 42, r: 4 },
          delay: 0.32,
        },
      ] as const,
    [],
  );

  /**
   * Animation driver: maps scroll progress → per-word opacity/transform.
   * We avoid React state so the animation stays at 60fps.
   */
  const animate = useCallback(
    (progress: number) => {
      const n = words.length;
      if (n === 0) return;

      const p = clamp01(progress);
      // Make the reveal smoother + slower: reserve more “breath” at the end.
      const revealP = clamp01(p / 0.82);

      for (let i = 0; i < n; i += 1) {
        const el = wordRefs.current[i];
        if (!el) continue;

        /**
         * Each word gets a small time slice in the reveal.
         * The +2 padding gives the first words a little space to “arrive.”
         */
        const start = (i + 0.12) / (n + 0.9);
        const end = (i + 1.55) / (n + 0.9);
        const t = smoothstep((revealP - start) / Math.max(0.0001, end - start));

        // Subtle editorial lift-in as the word becomes readable.
        const y = (1 - t) * 12;
        const blur = (1 - t) * 3;
        const opacity = 0.12 + t * 0.88;

        el.style.opacity = String(opacity);
        el.style.transform = `translateY(${y}px)`;
        el.style.filter = `blur(${blur}px)`;
      }

      // Arrows: fly in from different sides as you scroll (fiery streak feel).
      // Window: most of the action happens early-mid so the text remains the focus.
      for (let i = 0; i < arrows.length; i += 1) {
        const el = arrowRefs.current[i];
        if (!el) continue;

        const arrow = arrows[i];
        // Continuous slide left → right (direction arrow points). No fade in/out.
        const tRaw = (p - arrow.delay) / 0.90;
        const t = smoothstep(tRaw);

        const x = arrow.start.x + (arrow.end.x - arrow.start.x) * t;
        const y = arrow.start.y + (arrow.end.y - arrow.start.y) * t;
        const r = arrow.start.r + (arrow.end.r - arrow.start.r) * t;
        const s = 0.92;
        const motionBlur = (1 - clamp01(tRaw)) * 1.5;

        el.style.transform = `translate3d(${x}vw, ${y}vh, 0) rotate(${r}deg) scale(${s})`;
        el.style.filter = `blur(${motionBlur}px)`;
        el.style.opacity = String(0.55 + clamp01(tRaw) * 0.35);
      }

      const bg = backgroundRef.current;
      if (bg) {
        const scale = 1.04 + p * 0.05;
        const y = p * -1.5;
        bg.style.transform = `scale(${scale}) translate3d(0, ${y}%, 0)`;
      }
    },
    [arrows, words.length],
  );

  /**
   * Scroll handler: turns the container’s scroll position into [0..1] progress.
   * 200svh gives ~100svh scroll travel while the inner section stays pinned.
   */
  const handleScroll = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;

    const { top, height } = el.getBoundingClientRect();
    const scrolled = -top;
    const scrollable = height - window.innerHeight;

    if (scrollable <= 0) {
      animate(1);
      return;
    }

    if (scrolled <= 0) {
      animate(0);
      return;
    }

    if (scrolled >= scrollable) {
      animate(1);
      return;
    }

    animate(scrolled / scrollable);
  }, [animate]);

  useEffect(() => {
    // Initialize once refs are mounted.
    requestAnimationFrame(() => animate(0));
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [animate, handleScroll]);

  return (
    <section
      id="mission"
      ref={containerRef}
      aria-label="Making this generation effective arrows in the hands of the mighty warrior"
      className="relative bg-[#0a0a0a]"
      style={{ height: "300svh" }}
    >
      {/* Pinned full-screen viewport */}
      <div className="sticky top-0 flex h-screen items-center justify-center overflow-hidden px-7 sm:px-12 lg:px-20">
        {/* Congregation photo + cinematic scrim for legibility */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
          <div
            ref={backgroundRef}
            className="absolute inset-0 will-change-transform"
            style={{ transform: "scale(1.04)" }}
          >
            <Image
              src={BACKGROUND_IMAGE_SRC}
              alt=""
              fill
              sizes="100vw"
              quality={95}
              unoptimized
              priority
              className="object-cover object-[center_38%] saturate-[1.08] contrast-[1.06]"
              aria-hidden="true"
            />
          </div>
          <div
            className="absolute inset-0 bg-gradient-to-r from-black/82 via-black/48 to-black/20"
            aria-hidden="true"
          />
          <div
            className="absolute inset-0 bg-[radial-gradient(ellipse_at_22%_48%,rgba(0,0,0,0.05)_0%,rgba(0,0,0,0.55)_74%)]"
            aria-hidden="true"
          />
          <div
            className="absolute inset-0 bg-gradient-to-t from-[#0a1218]/70 via-transparent to-black/15"
            aria-hidden="true"
          />
          <div
            className="absolute inset-0 opacity-[0.10] mix-blend-overlay"
            style={{
              backgroundImage:
                "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='220' height='220'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='220' height='220' filter='url(%23n)' opacity='.45'/%3E%3C/svg%3E\")",
            }}
            aria-hidden="true"
          />
        </div>

        {/* Fiery arrows (decorative, non-interactive) */}
        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
          {arrows.map((arrow, i) => (
            <div
              key={arrow.id}
              ref={(el) => {
                arrowRefs.current[i] = el;
              }}
              className="absolute left-0 top-0"
              style={{
                willChange: "transform, opacity, filter",
                opacity: 0.62,
                transform: "translate3d(-110vw, 30vh, 0) rotate(-10deg) scale(0.92)",
              }}
            >
              <svg
                width={arrow.size}
                height={Math.round(arrow.size * 0.42)}
                viewBox="0 0 520 160"
                fill="none"
                aria-hidden="true"
              >
                <defs>
                  <linearGradient id={`${arrow.id}-shaft`} x1="0" y1="0" x2="520" y2="0" gradientUnits="userSpaceOnUse">
                    <stop offset="0" stopColor="#ffb36b" stopOpacity="0.15" />
                    <stop offset="0.28" stopColor="#ffb36b" stopOpacity="0.75" />
                    <stop offset="0.55" stopColor="#ffd7a3" stopOpacity="1" />
                    <stop offset="0.82" stopColor="#fff1d7" stopOpacity="0.92" />
                    <stop offset="1" stopColor="#fff1d7" stopOpacity="0.25" />
                  </linearGradient>
                  <linearGradient id={`${arrow.id}-flame`} x1="0" y1="0" x2="520" y2="0" gradientUnits="userSpaceOnUse">
                    <stop offset="0" stopColor="#ff5a1f" stopOpacity="0.12" />
                    <stop offset="0.20" stopColor="#ff5a1f" stopOpacity="0.65" />
                    <stop offset="0.48" stopColor="#ffb36b" stopOpacity="0.72" />
                    <stop offset="0.72" stopColor="#ffe5c7" stopOpacity="0.45" />
                    <stop offset="1" stopColor="#ffe5c7" stopOpacity="0.18" />
                  </linearGradient>
                  <filter id={`${arrow.id}-glow`} x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur stdDeviation="5" result="blur" />
                    <feColorMatrix
                      in="blur"
                      type="matrix"
                      values="
                        1 0 0 0 0
                        0 0.55 0 0 0
                        0 0 0.18 0 0
                        0 0 0 1 0
                      "
                      result="warm"
                    />
                    <feMerge>
                      <feMergeNode in="warm" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>

                <g filter={`url(#${arrow.id}-glow)`}>
                  {/* flame trail (under) */}
                  <path
                    d="M40 92 C140 8, 260 148, 360 72 C410 34, 458 26, 504 24"
                    stroke={`url(#${arrow.id}-flame)`}
                    strokeWidth="22"
                    strokeLinecap="round"
                  />

                  {/* shaft core */}
                  <path
                    d="M110 80 L458 80"
                    stroke="rgba(255,241,215,0.95)"
                    strokeWidth="5"
                    strokeLinecap="round"
                  />

                  {/* shaft glow */}
                  <path
                    d="M90 80 L464 80"
                    stroke={`url(#${arrow.id}-shaft)`}
                    strokeWidth="14"
                    strokeLinecap="round"
                  />

                  {/* fletching */}
                  <path
                    d="M118 80 L86 62"
                    stroke="rgba(255,214,163,0.88)"
                    strokeWidth="7"
                    strokeLinecap="round"
                  />
                  <path
                    d="M118 80 L86 98"
                    stroke="rgba(255,214,163,0.88)"
                    strokeWidth="7"
                    strokeLinecap="round"
                  />

                  {/* arrow head */}
                  <path
                    d="M464 80 L432 60 L436 80 L432 100 Z"
                    fill="rgba(255,241,215,0.96)"
                  />
                  {/* head edge highlight */}
                  <path
                    d="M464 80 L432 60"
                    stroke="rgba(255,255,255,0.35)"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </g>
              </svg>
            </div>
          ))}
        </div>

        <div className="relative mx-auto w-full max-w-[1120px]">
          <div className="mx-auto max-w-[980px]">
            {/* Editorial typography: word-by-word reveal */}
            <p className="text-balance font-extrabold leading-[0.98] tracking-[-0.06em] text-[clamp(32px,5.2vw,88px)] drop-shadow-[0_2px_26px_rgba(0,0,0,0.70)]">
              {words.map((word, i) => (
                <span
                  key={`${word}-${i}`}
                  ref={(el) => {
                    wordRefs.current[i] = el;
                  }}
                  className={[
                    "inline-block align-baseline",
                    "text-transparent bg-clip-text",
                    "bg-[linear-gradient(180deg,rgba(255,255,255,0.98)_0%,rgba(255,255,255,0.88)_55%,rgba(255,241,215,0.86)_100%)]",
                  ].join(" ")}
                  style={{
                    willChange: "transform, opacity, filter",
                    opacity: 0.12,
                    transform: "translateY(14px)",
                    filter: "blur(4px)",
                  }}
                >
                  {word}
                  {i < words.length - 1 ? "\u00A0" : ""}
                </span>
              ))}
            </p>

            {/* Scripture reference — small, modern, right-aligned to text block */}
            <p className="mt-6 text-right text-[11px] font-medium uppercase tracking-[0.22em] text-white/60 sm:text-[12px]">
              {verseRef}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
