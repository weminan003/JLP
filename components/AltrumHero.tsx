"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { SiteHeader } from "@/components/SiteHeader";

/** Ease in-out quadratic */
const easeInOut = (t: number): number =>
  t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;

type FlipParams = {
  scale: number;
  tx: number;
  ty: number;
};

type AltrumHeroProps = {
  backgroundAlt?: string;
};

/** Background loop video — pre-trimmed, no logo slate */
const HERO_VIDEO_SRC = "/videos/jlp-ministry-video-no-captions.mp4";
const HERO_POSTER_SRC = "/hero/jlp-hero.png";
/** Background preview starts here on first load, then loops naturally from 0:00 */
const HERO_VIDEO_START_OFFSET = 24;

export const AltrumHero = ({ backgroundAlt = "Hero background" }: AltrumHeroProps) => {
  const sectionRef = useRef<HTMLElement>(null);
  const heroH1Ref = useRef<HTMLHeadingElement>(null);
  const navJLPRef = useRef<HTMLSpanElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const modalVideoRef = useRef<HTMLVideoElement>(null);

  const [progress, setProgress] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  /** Measured at mount — overwritten once fonts + layout settle */
  const [flip, setFlip] = useState<FlipParams>({ scale: 0.07, tx: 46, ty: -80 });

  /**
   * Measure real FLIP params: scale + translation from the big h1 to the nav span.
   * Must run at scrollY=0 so both elements are at their natural positions.
   */
  const measureFlip = useCallback(() => {
    if (!heroH1Ref.current || !navJLPRef.current) return;
    if (window.scrollY !== 0) return;
    const heroRect = heroH1Ref.current.getBoundingClientRect();
    const navRect = navJLPRef.current.getBoundingClientRect();
    if (heroRect.height === 0 || navRect.height === 0) return;
    setFlip({
      scale: navRect.height / heroRect.height,
      tx: navRect.left - heroRect.left,
      ty: navRect.top - heroRect.top,
    });
  }, []);

  useEffect(() => {
    const timer = setTimeout(measureFlip, 200);
    document.fonts.ready.then(measureFlip);
    window.addEventListener("resize", measureFlip);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", measureFlip);
    };
  }, [measureFlip]);

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

    /** Seek to 0:24 on first play then let the browser loop natively */
    const handleCanPlay = () => {
      if (video.currentTime < HERO_VIDEO_START_OFFSET) {
        video.currentTime = HERO_VIDEO_START_OFFSET;
      }
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          /* Autoplay blocked — poster still visible */
        });
      }
    };

    video.addEventListener("canplay", handleCanPlay, { once: true });

    return () => {
      video.removeEventListener("canplay", handleCanPlay);
    };
  }, []);

  /** Handle modal open/close — pause bg video while modal is open */
  const handleOpenModal = useCallback(() => {
    videoRef.current?.pause();
    setModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setModalOpen(false);
    modalVideoRef.current?.pause();
    /* Resume background video from wherever it left off */
    if (videoRef.current) {
      const resumePromise = videoRef.current.play();
      if (resumePromise !== undefined) {
        resumePromise.catch(() => {});
      }
    }
  }, []);

  /** Close modal on Escape */
  useEffect(() => {
    if (!modalOpen) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        handleCloseModal();
      }
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [modalOpen, handleCloseModal]);

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;
      const scrolledIn = -sectionRef.current.getBoundingClientRect().top;
      const animRange = window.innerHeight * 2;
      setProgress(Math.min(Math.max(scrolledIn / animRange, 0), 1));
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const ep = easeInOut(progress);

  /** FLIP: h1 translates + scales into the nav text position */
  const heroScale = 1 + (flip.scale - 1) * ep;
  const heroTx = flip.tx * ep;
  const heroTy = flip.ty * ep;
  /**
   * h1 fades out from 55%–75%.
   * Nav text fades in from 70%–95%.
   * Keeps them separated so they never both appear solid at the same time.
   */
  const heroH1Opacity = ep > 0.55 ? Math.max(0, 1 - (ep - 0.55) / 0.2) : 1;
  const navTextOpacity = Math.min(1, Math.max(0, (ep - 0.7) / 0.25));

  /** Subtitle fades out quickly in the first third */
  const subtitleOpacity = Math.max(0, 1 - ep * 3.5);
  /** Bottom tagline fades mid-way */
  const bottomOpacity = Math.max(0, 1 - ep * 2.2);

  /**
   * Curtain: clip the hero from the bottom with linear progress.
   * The bottom edge rises at constant speed, folding the hero up like a curtain.
   */
  const clipBottom = progress * 100;

  return (
    <>
      {/* ── 300vh scroll spacer — provides 200vh of pinned animation travel ── */}
      <section
        ref={sectionRef}
        aria-label="Hero"
        className="relative bg-[#0a0a0a]"
        style={{ height: "300vh" }}
      >
        {/*
         * z-[2] sits above the sections wrapper (z-[1] in page.tsx).
         * clip-path clips from the bottom as you scroll — the hero "folds up"
         * revealing the sections beneath it like a curtain being raised.
         */}
        <div
          className="sticky top-0 z-[2] h-screen overflow-hidden bg-black text-white"
          style={{ clipPath: `inset(0 0 ${clipBottom}% 0)` }}
        >
          <video
            key={HERO_VIDEO_SRC}
            ref={videoRef}
            className="absolute inset-0 h-full w-full object-cover object-[62%_38%]"
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            poster={HERO_POSTER_SRC}
            aria-label={backgroundAlt}
          >
            <source src={HERO_VIDEO_SRC} type="video/mp4" />
          </video>
          {/* Hero content */}
          <div className="relative z-10 flex h-full w-full flex-col justify-end px-6 pb-10 pt-28 sm:px-10 sm:pb-16 lg:px-14">

            {/* JLP dominant — tagline small and minimal below */}
            <div className="flex max-w-[min(540px,82vw)] flex-col gap-4">
              <div className="flex flex-col gap-3">
                <h1
                  ref={heroH1Ref}
                  className="text-[112px] font-black leading-[0.86] tracking-[-0.05em] sm:text-[148px] md:text-[188px] lg:text-[220px]"
                  style={{
                    transform: `translate(${heroTx}px, ${heroTy}px) scale(${heroScale})`,
                    transformOrigin: "0 0",
                    opacity: heroH1Opacity,
                    willChange: "transform, opacity",
                  }}
                >
                  JLP
                </h1>
                <span
                  className="text-[15px] font-medium tracking-[0.18em] text-white/50 uppercase sm:text-[17px]"
                  style={{ opacity: subtitleOpacity }}
                >
                  Jesus Love and Power Ministries
                </span>
              </div>

              <p
                className="text-[13px] font-normal tracking-[0.06em] text-white/40 sm:text-[14px]"
                style={{ opacity: bottomOpacity }}
              >
                A generation on fire for Jesus.
              </p>
            </div>

            {/* Mobile only: icon-only glass circle — centred in hero */}
            <button
              type="button"
              onClick={handleOpenModal}
              aria-label="Watch our ministry story"
              tabIndex={0}
              className="pointer-events-auto absolute left-1/2 top-1/2 z-20 -translate-x-1/2 -translate-y-1/2 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 sm:hidden"
              style={{
                opacity: bottomOpacity > 0.05 ? 1 : 0,
                transition: "opacity 0.4s ease",
              }}
            >
              <span className="relative flex h-16 w-16 items-center justify-center">
                <span
                  className="absolute inset-0 animate-ping rounded-full bg-white/15"
                  aria-hidden="true"
                />
                <span
                  className="relative flex h-16 w-16 items-center justify-center rounded-full border border-white/25 text-white shadow-2xl transition-all duration-300 hover:border-white/40 hover:bg-white/20"
                  style={{
                    background: "rgba(255,255,255,0.10)",
                    backdropFilter: "blur(20px) saturate(1.5)",
                    WebkitBackdropFilter: "blur(20px) saturate(1.5)",
                  }}
                >
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="white" aria-hidden="true">
                    <path d="M8 5.14v13.72L19.5 12 8 5.14z" />
                  </svg>
                </span>
              </span>
            </button>
          </div>

          {/* Desktop only: full pill — bottom-right of hero */}
          <button
            type="button"
            onClick={handleOpenModal}
            aria-label="Watch our ministry story"
            tabIndex={0}
            className="pointer-events-auto absolute bottom-12 right-10 z-20 hidden cursor-pointer items-center gap-3 rounded-full border border-white/20 px-5 py-3.5 text-white shadow-2xl transition-all duration-300 hover:border-white/35 hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 sm:flex lg:bottom-14 lg:right-14"
            style={{
              background: "rgba(255,255,255,0.08)",
              backdropFilter: "blur(20px) saturate(1.5)",
              WebkitBackdropFilter: "blur(20px) saturate(1.5)",
              opacity: bottomOpacity > 0.05 ? 1 : 0,
              transition: "opacity 0.4s ease",
            }}
          >
            <span className="relative flex h-9 w-9 shrink-0 items-center justify-center">
              <span
                className="absolute inset-0 animate-ping rounded-full bg-white/20"
                aria-hidden="true"
              />
              <span className="relative flex h-9 w-9 items-center justify-center rounded-full border border-white/30 bg-white/15">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="white" aria-hidden="true">
                  <path d="M8 5.14v13.72L19.5 12 8 5.14z" />
                </svg>
              </span>
            </span>
            <span className="flex flex-col items-start leading-tight">
              <span className="text-[13px] font-semibold tracking-wide text-white">
                Watch Video
              </span>
              <span className="text-[10px] font-normal tracking-[0.12em] text-white/55 uppercase">
                Our heart &amp; vision
              </span>
            </span>
          </button>

          <div
            id="hero-scroll-sentinel"
            className="pointer-events-none absolute bottom-0 left-0 h-px w-full"
            aria-hidden="true"
          />
        </div>
      </section>

      <SiteHeader
        variant="home"
        navJLPRef={navJLPRef}
        navTextOpacity={navTextOpacity}
      />

      {/* ── Ministry Video Modal ─────────────────────────────────────────────── */}
      {modalOpen ? (
        <div
          className="fixed inset-0 z-[500] flex items-center justify-center bg-black/90 p-4 sm:p-8"
          role="dialog"
          aria-modal="true"
          aria-label="Ministry story video"
          onClick={(e) => {
            if (e.target === e.currentTarget) handleCloseModal();
          }}
        >
          <button
            type="button"
            onClick={handleCloseModal}
            aria-label="Close video"
            tabIndex={0}
            className="absolute right-4 top-4 z-[510] flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-white/20 bg-black/70 text-white backdrop-blur-sm transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 sm:right-6 sm:top-6"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>

          <div
            className="relative w-full max-w-5xl overflow-hidden rounded-2xl border border-white/10 bg-black shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative aspect-video w-full bg-black">
              <video
                ref={modalVideoRef}
                className="h-full w-full object-contain"
                src={HERO_VIDEO_SRC}
                controls
                autoPlay
                playsInline
                aria-label="JLP ministry story"
              />
            </div>
            <div className="border-t border-white/10 px-6 py-5 sm:px-8">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/50">
                Jesus Love and Power Ministries
              </p>
              <h3 className="mt-1 text-[clamp(18px,3vw,32px)] font-bold leading-tight tracking-tight text-white">
                Our Heart &amp; Vision
              </h3>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
};
