"use client";

import { useEffect, useRef } from "react";

/** The original hero footage in this pre-footer showcase section */
const MINISTRY_VIDEO_SRC = "https://tmczhiaehonyxwhungsj.supabase.co/storage/v1/object/public/videos/hero/jlp-hero-main.mp4";
const MINISTRY_POSTER_SRC = "/hero/jlp-hero.png";

/** ─── Component ─────────────────────────────────────────────────────────── */
export const MinistryVideoSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  /** Intersection observer — play when in view, pause when out */
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
        if (entry.isIntersecting) {
          const promise = video.play();
          if (promise !== undefined) {
            promise.catch(() => {});
          }
        } else {
          video.pause();
        }
      },
      { threshold: 0.25 },
    );

    const section = sectionRef.current;
    if (section) observer.observe(section);

    return () => {
      if (section) observer.unobserve(section);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="ministry-video"
      className="relative w-full overflow-hidden bg-black"
      aria-label="Ministry footage"
      style={{ height: "55vh" }}
    >
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
    </section>
  );
};
