"use client";

import { useEffect, useRef } from "react";

const BACKGROUND_VIDEO_SRC = "https://tmczhiaehonyxwhungsj.supabase.co/storage/v1/object/public/videos/for-you-section-bg.mp4";
const BACKGROUND_POSTER_SRC = "/hero/hero-bg.png";

/** ─── Types ─────────────────────────────────────────────────────────────── */
type MarqueeRowConfig = {
  items: string[];
  /** Scroll direction of the row */
  direction: "left" | "right";
  /** Animation duration in seconds — longer = slower */
  duration: number;
};

/** ─── Tag data ───────────────────────────────────────────────────────────── */
const ROW_ONE: string[] = [
  "HUNGRY FOR GOD",
  "COLD BUT WANTING FIRE",
  "TIRED OF THE ORDINARY",
  "DRY IN YOUR PRAYER LIFE",
  "LONGING TO ENCOUNTER JESUS",
  "DONE WITH SURFACE FAITH",
  "STRUGGLING WITH OBEDIENCE",
  "CRAVING REAL REVIVAL",
];

const ROW_TWO: string[] = [
  "NEED YOUR PRAYER LIFE BACK",
  "FAR FROM GOD BUT REACHING",
  "TIRED OF EMPTY ROUTINE",
  "READY FOR A TURNAROUND",
  "DISOBEDIENT BUT WANTING MORE",
  "BELIEVING GOD CAN CHANGE YOU",
  "WANT MORE THAN MOTIONS",
  "NEEDING FRESH ENCOUNTER",
];

const MARQUEE_ROWS: MarqueeRowConfig[] = [
  { items: ROW_ONE, direction: "left",  duration: 62 },
  { items: ROW_TWO, direction: "right", duration: 72 },
];

/** ─── Sub-components ────────────────────────────────────────────────────── */

/** Single pill tag */
const TagPill = ({ label }: { label: string }) => (
  <div
    className="inline-flex shrink-0 items-center rounded-md border border-white/15 bg-white/[0.06] px-5 py-2.5"
    aria-hidden="true"
  >
    <span className="whitespace-nowrap text-[12px] font-bold uppercase tracking-[0.22em] text-white/65">
      {label}
    </span>
  </div>
);

/**
 * A single endlessly-scrolling row of pill tags.
 * Items are duplicated so the loop is seamless.
 */
const MarqueeRow = ({ items, direction, duration }: MarqueeRowConfig) => {
  /** Duplicate so the gap between end and start is invisible */
  const doubled = [...items, ...items];

  const keyframe = direction === "left" ? "jlpMarqueeLeft" : "jlpMarqueeRight";

  return (
    <div className="flex overflow-hidden" aria-hidden="true">
      <div
        className="flex gap-3"
        style={{ animation: `${keyframe} ${duration}s linear infinite` }}
      >
        {doubled.map((item, i) => (
          <TagPill key={`${item}-${i}`} label={item} />
        ))}
      </div>
    </div>
  );
};

/** ─── Section ───────────────────────────────────────────────────────────── */
export const ForYouSection = () => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (prefersReducedMotion) {
      video.pause();
      video.removeAttribute("src");
      return;
    }

    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        /* Autoplay blocked — poster still visible */
      });
    }
  }, []);

  return (
  <>
    {/* Keyframes embedded directly — avoids Tailwind v4 Lightning CSS renaming them */}
    <style>{`
      @keyframes jlpMarqueeLeft {
        from { transform: translateX(0); }
        to   { transform: translateX(-50%); }
      }
      @keyframes jlpMarqueeRight {
        from { transform: translateX(-50%); }
        to   { transform: translateX(0); }
      }
    `}</style>
  <section
    className="relative overflow-hidden py-20 md:py-28 lg:py-36"
    aria-label="JLP is for you if you are"
  >
    {/* ── Low-opacity video + light scrim for legibility ── */}
    <div className="absolute inset-0 bg-[#0a0a0a]" aria-hidden="true">
      <video
        ref={videoRef}
        className="absolute inset-0 h-full w-full object-cover object-center opacity-[0.45]"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        poster={BACKGROUND_POSTER_SRC}
        aria-hidden="true"
      >
        <source src={BACKGROUND_VIDEO_SRC} type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-[#0a0a0a]/40" />
    </div>

    {/* ── Content ── */}
    <div className="relative z-10">

      {/* Heading */}
      <div className="mb-10 px-6 text-center sm:mb-12">
        <h2
          className="text-[clamp(24px,5vw,52px)] font-black uppercase leading-[1.06] tracking-[-0.01em] text-white"
          tabIndex={0}
        >
          JLP IS FOR YOU<br />IF YOU ARE…
        </h2>

        {/* Red separator dot */}
        <div className="mt-5 flex justify-center" aria-hidden="true">
          <span className="h-2 w-2 rounded-full bg-red-500" />
        </div>
      </div>

      {/* Scrolling tag rows */}
      <div className="flex flex-col gap-3">
        {MARQUEE_ROWS.map((row, i) => (
          <MarqueeRow key={i} {...row} />
        ))}
      </div>

    </div>
  </section>
  </>
  );
};
