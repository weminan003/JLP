"use client";

import { useEffect, useRef, useCallback, useState } from "react";

/** The original hero footage now lives in this pre-footer showcase section */
const MINISTRY_VIDEO_SRC = "/hero/jlp-hero-main.mp4";
const MINISTRY_POSTER_SRC = "/hero/jlp-hero.png";

/** ─── Play icon ─────────────────────────────────────────────────────────── */
const PlayIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="white" aria-hidden="true">
    <path d="M8 5.14v13.72L19.5 12 8 5.14z" />
  </svg>
);

const PauseIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="white" aria-hidden="true">
    <rect x="6" y="4" width="4" height="16" rx="1" />
    <rect x="14" y="4" width="4" height="16" rx="1" />
  </svg>
);

/** ─── Component ─────────────────────────────────────────────────────────── */
export const MinistryVideoSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);

  /** Intersection observer — play when section enters viewport, pause when it leaves */
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (prefersReducedMotion) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry) return;

        if (entry.isIntersecting && !hasInteracted) {
          /* Auto-preview: muted loop until user explicitly hits play */
          video.muted = true;
          video.loop = true;
          const promise = video.play();
          if (promise !== undefined) {
            promise
              .then(() => setIsPlaying(true))
              .catch(() => {});
          }
        } else if (!entry.isIntersecting) {
          video.pause();
          setIsPlaying(false);
        }
      },
      { threshold: 0.25 },
    );

    const section = sectionRef.current;
    if (section) observer.observe(section);

    return () => {
      if (section) observer.unobserve(section);
    };
  }, [hasInteracted]);

  const handleTogglePlay = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      /* First explicit play — unmute and disable loop so it plays fully */
      if (!hasInteracted) {
        video.muted = false;
        video.loop = false;
        setHasInteracted(true);
      }
      const promise = video.play();
      if (promise !== undefined) {
        promise
          .then(() => setIsPlaying(true))
          .catch(() => {});
      }
    } else {
      video.pause();
      setIsPlaying(false);
    }
  }, [hasInteracted]);

  const handleTogglePlayKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLButtonElement>) => {
      if (event.key !== "Enter" && event.key !== " ") return;
      event.preventDefault();
      handleTogglePlay();
    },
    [handleTogglePlay],
  );

  /** Keep isPlaying state in sync with native video events */
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    const onEnded = () => setIsPlaying(false);

    video.addEventListener("play", onPlay);
    video.addEventListener("pause", onPause);
    video.addEventListener("ended", onEnded);

    return () => {
      video.removeEventListener("play", onPlay);
      video.removeEventListener("pause", onPause);
      video.removeEventListener("ended", onEnded);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="ministry-video"
      className="relative w-full overflow-hidden bg-black"
      aria-label="Ministry footage"
    >
      {/* ── Video container with 16:9 aspect ─────────────────────────────── */}
      <div className="relative aspect-video w-full">
        <video
          ref={videoRef}
          className="absolute inset-0 h-full w-full object-cover object-[62%_38%]"
          src={MINISTRY_VIDEO_SRC}
          poster={MINISTRY_POSTER_SRC}
          muted
          loop
          playsInline
          preload="none"
          aria-label="JLP ministry footage"
        />

        {/* Subtle gradient overlay */}
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20"
          aria-hidden="true"
        />

        {/* ── Glassmorphism play/pause overlay ──────────────────────────── */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <button
            type="button"
            onClick={handleTogglePlay}
            onKeyDown={handleTogglePlayKeyDown}
            aria-label={isPlaying ? "Pause video" : "Play video"}
            tabIndex={0}
            className="group relative flex h-20 w-20 items-center justify-center rounded-full border border-white/25 transition-all duration-300 hover:scale-105 hover:border-white/45 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 sm:h-24 sm:w-24"
            style={{
              background: "rgba(255,255,255,0.1)",
              backdropFilter: "blur(20px) saturate(1.5)",
              WebkitBackdropFilter: "blur(20px) saturate(1.5)",
            }}
          >
            {/* Ping ring (only when paused) */}
            {!isPlaying ? (
              <span
                className="absolute inset-0 animate-ping rounded-full bg-white/15"
                aria-hidden="true"
              />
            ) : null}
            <span className="relative z-10">
              {isPlaying ? <PauseIcon /> : <PlayIcon />}
            </span>
          </button>
        </div>

        {/* ── Section label — bottom left ───────────────────────────────── */}
        <div className="absolute bottom-0 left-0 right-0 z-10 flex flex-col gap-1 px-6 py-8 sm:px-10 lg:px-14">
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-white/45">
            Jesus Love and Power Ministries
          </p>
          <h2 className="text-[clamp(1.4rem,4vw,3.2rem)] font-black leading-tight tracking-tight text-white">
            A generation on fire for Jesus.
          </h2>
          <p className="mt-1 max-w-lg text-[13px] leading-relaxed text-white/50 sm:text-[14px]">
            Real moments. Real encounters. A people being transformed by His love and power.
          </p>
        </div>
      </div>

      {/* Top divider accent */}
      <div
        className="absolute left-0 right-0 top-0 z-10 h-0.5 bg-gradient-to-r from-transparent via-white/10 to-transparent"
        aria-hidden="true"
      />
    </section>
  );
};
