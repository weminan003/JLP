"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { TestimonyVideoPlayer } from "@/components/TestimonyVideoPlayer";

/** ─── Types ─────────────────────────────────────────────────────────────── */
type FeaturedCard = {
  id: string;
  index: string;
  label: string;
  category: string;
  posterSrc: string;
  videoSrc: string;
  orientation?: "portrait" | "landscape";
};

type SlotTransform = {
  tx: number;
  ty: number;
  rz: number;
  scale: number;
};

/** ─── Data ──────────────────────────────────────────────────────────────── */
const CARDS: FeaturedCard[] = [
  {
    id: "encounter-camp",
    index: "01",
    label: "The Spirit of Prayer",
    category: "Prayer & Revival",
    posterSrc: "/testimonies/01-prayer-revival-poster.jpg",
    videoSrc: "/testimonies/01-prayer-revival.mp4",
  },
  {
    id: "from-darkness",
    index: "02",
    label: "Felt His Presence",
    category: "Personal Transformation",
    posterSrc: "/testimonies/02-testimony1-poster.jpg",
    videoSrc: "/testimonies/02-testimony1.mp4",
    orientation: "portrait",
  },
];

const TITLE_LINES = ["Transformed", "Lives"] as const;
const CARDS_PER_BATCH = 2;
const BATCH_COUNT = Math.ceil(CARDS.length / CARDS_PER_BATCH);

/** Landing positions — top-left + bottom-right over the title */
const SLOT_SETS: SlotTransform[][] = [
  [
    { tx: -24, ty: -12, rz: -2.5, scale: 0.38 },
    { tx: 24, ty: 14, rz: 3.0, scale: 0.37 },
  ],
];

/** Scroll timeline (progress units) — tuned for slower, smoother scroll */
const INTRO_UNITS = 1.05;
const ENTER_STAGGER = 0.48;
const ENTER_DUR = 0.58;
const HOLD_UNITS = 0.85;
const EXIT_STAGGER = 0.38;
const EXIT_DUR = 0.52;

const batchUnits = (): number => {
  const lastEnter = (CARDS_PER_BATCH - 1) * ENTER_STAGGER + ENTER_DUR;
  const lastExit = (CARDS_PER_BATCH - 1) * EXIT_STAGGER + EXIT_DUR;
  return lastEnter + HOLD_UNITS + lastExit;
};

const TOTAL_PROGRESS = INTRO_UNITS + BATCH_COUNT * batchUnits();
const UNIT_SVH = 118;
const TOTAL_SVH = TOTAL_PROGRESS * UNIT_SVH;

/** Entry pose — rise from bottom with 3D rotation */
const ENTRY_TX = 4;
const ENTRY_TY = 72;
const ENTRY_RX = 24;
const ENTRY_RY = -12;
const ENTRY_RZ = -10;
const ENTRY_SCALE = 0.26;
const ENTRY_BR = 26;
const LANDED_BR = 18;

const PARENT_PERSPECTIVE = "900px";

const clamp01 = (v: number): number => Math.max(0, Math.min(1, v));
const invlerp = (a: number, b: number, v: number): number => clamp01((v - a) / (b - a));
const lerp = (a: number, b: number, t: number): number => a + (b - a) * t;
const easeOut3 = (t: number): number => 1 - Math.pow(1 - t, 3);
const easeInOut3 = (t: number): number =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

const TITLE_PRIMARY_STYLE = {
  fontFamily: "var(--font-outfit), ui-sans-serif, system-ui, sans-serif",
  fontWeight: 900,
  lineHeight: 0.88,
  letterSpacing: "-0.07em",
  color: "#FFFFFF",
  display: "block",
  width: "100%",
  whiteSpace: "nowrap",
  textAlign: "center",
  fontSize: "clamp(3rem, 10.35vw, 24rem)",
} as const;

const TITLE_SECONDARY_STYLE = {
  ...TITLE_PRIMARY_STYLE,
  whiteSpace: "normal",
  marginTop: "-0.04em",
} as const;

const PlayIcon = ({ size = 22 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="white" aria-hidden="true">
    <path d="M8 5.14v13.72L19.5 12 8 5.14z" />
  </svg>
);

type FullscreenModalProps = {
  card: FeaturedCard;
  onClose: () => void;
};

const FullscreenModal = ({ card, onClose }: FullscreenModalProps) => {
  const handleBackdropClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  const handleContentClick = (event: React.MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
  };

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleEscape);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleEscape);
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/92 p-4 sm:p-8"
      role="dialog"
      aria-modal="true"
      aria-label={`${card.label} testimony`}
      onClick={handleBackdropClick}
    >
      <button
        type="button"
        onClick={onClose}
        className="absolute right-4 top-4 z-[210] flex h-11 w-11 items-center justify-center rounded-full border border-white/25 bg-black/60 text-white transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 sm:right-8 sm:top-8"
        aria-label="Close testimony"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M18 6L6 18M6 6l12 12" />
        </svg>
      </button>

      <div
        className={`flex w-full flex-col overflow-hidden rounded-2xl border border-white/15 bg-black shadow-2xl ${
          card.orientation === "portrait" ? "max-w-[min(100%,420px)]" : "max-w-5xl"
        }`}
        onClick={handleContentClick}
      >
        <div
          className={`testimony-plyr relative w-full bg-black ${
            card.orientation === "portrait" ? "aspect-[9/16]" : "aspect-video"
          }`}
        >
          <TestimonyVideoPlayer
            key={card.videoSrc}
            videoSrc={card.videoSrc}
            title={card.label}
            orientation={card.orientation}
          />
        </div>
        <div className="border-t border-white/10 px-6 py-5 sm:px-8 sm:py-6">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/55">
            {card.index} · {card.category}
          </p>
          <h3 className="mt-1.5 text-[clamp(22px,3.5vw,40px)] font-bold leading-tight tracking-tight text-white">
            {card.label}
          </h3>
        </div>
      </div>
    </div>
  );
};

/** ─── Section ───────────────────────────────────────────────────────────── */
export const FeaturedWorksSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const introWrapRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const visualRefs = useRef<(HTMLDivElement | null)[]>([]);
  const innerRefs = useRef<(HTMLDivElement | null)[]>([]);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const playRefs = useRef<(HTMLDivElement | null)[]>([]);
  const labelRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [activeCard, setActiveCard] = useState<FeaturedCard | null>(null);

  const handleOpen = useCallback((card: FeaturedCard) => {
    videoRefs.current.forEach((previewVideo) => {
      previewVideo?.pause();
    });
    setActiveCard(card);
  }, []);

  const handleClose = useCallback(() => {
    setActiveCard(null);
  }, []);

  const animateIntro = useCallback((progress: number) => {
    const wrap = introWrapRef.current;
    if (!wrap) return;

    const introT = clamp01(progress / INTRO_UNITS);
    const riseT = easeInOut3(clamp01(introT / 0.62));
    const blockY = progress <= INTRO_UNITS ? lerp(22, 0, riseT) : 0;

    wrap.style.opacity = "1";
    wrap.style.transform = `translate3d(0, ${blockY}vh, 0)`;
  }, []);

  const animateCards = useCallback((progress: number) => {
    const batchDur = batchUnits();

    CARDS.forEach((card, cardIndex) => {
      const el = cardRefs.current[cardIndex];
      const visual = visualRefs.current[cardIndex];
      const inner = innerRefs.current[cardIndex];
      const video = videoRefs.current[cardIndex];
      const playWrap = playRefs.current[cardIndex];
      const label = labelRefs.current[cardIndex];
      if (!el) return;

      const batch = Math.floor(cardIndex / CARDS_PER_BATCH);
      const slotIdx = cardIndex % CARDS_PER_BATCH;
      const slotSet = SLOT_SETS[batch % SLOT_SETS.length];
      const slot = slotSet[slotIdx];
      if (!slot) return;

      const batchStart = INTRO_UNITS + batch * batchDur;
      const enterStart = batchStart + slotIdx * ENTER_STAGGER;
      const enterEnd = enterStart + ENTER_DUR;
      const holdEnd =
        batchStart + (CARDS_PER_BATCH - 1) * ENTER_STAGGER + ENTER_DUR + HOLD_UNITS;
      const exitStart = holdEnd + slotIdx * EXIT_STAGGER;
      const exitEnd = exitStart + EXIT_DUR + slotIdx * 0.12;

      const enterT = easeOut3(invlerp(enterStart, enterEnd, progress));
      const exitT = easeInOut3(invlerp(exitStart, exitEnd, progress));

      if (progress < enterStart - 0.005 || progress > exitEnd + 0.02) {
        el.style.opacity = "0";
        el.style.pointerEvents = "none";
        el.dataset.clickable = "false";
        if (video) {
          video.pause();
        }
        return;
      }

      const exitLift = 48 + slotIdx * 14;
      const tx = lerp(ENTRY_TX, slot.tx, enterT);
      const ty = lerp(ENTRY_TY, slot.ty, enterT) - exitT * exitLift;
      const rx = lerp(ENTRY_RX, 5, enterT) + exitT * 22;
      const ry = lerp(ENTRY_RY, 0, enterT);
      const rz = lerp(ENTRY_RZ, slot.rz, enterT) + exitT * 8;
      const scale = lerp(ENTRY_SCALE, slot.scale, enterT) * lerp(1, 0.88, exitT);
      const br = lerp(ENTRY_BR, LANDED_BR, enterT);

      const fadeIn = easeOut3(invlerp(enterStart, enterStart + 0.08, progress));
      const fadeOut = 1 - easeOut3(invlerp(exitEnd - 0.08, exitEnd, progress));
      const opacity = fadeIn * fadeOut;

      const clickable = enterT > 0.88 && exitT < 0.12 && opacity > 0.5;

      el.style.transform = [
        `translateX(${tx}%)`,
        `translateY(${ty}%)`,
        `rotateX(${rx}deg)`,
        `rotateY(${ry}deg)`,
        `rotateZ(${rz}deg)`,
        `scale(${scale})`,
      ].join(" ");
      if (visual) {
        visual.style.borderRadius = `${br}px`;
      }
      el.style.borderRadius = "0px";
      el.style.opacity = String(opacity);
      el.style.pointerEvents = clickable ? "auto" : "none";
      el.style.cursor = clickable ? "pointer" : "default";
      el.dataset.clickable = clickable ? "true" : "false";

      if (inner) {
        const innerScale = card.orientation === "portrait" ? lerp(1.04, 1, enterT) : lerp(1.22, 1.06, enterT);
        const innerTY = card.orientation === "portrait" ? 0 : lerp(-5, 0, enterT);
        inner.style.transform = `scale(${innerScale}) translateY(${innerTY}%)`;
      }

      if (video) {
        const shouldPreview = clickable && opacity > 0.45;
        if (shouldPreview) {
          const src = CARDS[cardIndex]?.videoSrc;
          if (src && video.getAttribute("src") !== src) {
            video.src = src;
            video.addEventListener(
              "canplay",
              () => {
                if (el.dataset.clickable !== "true" || !video.paused) return;
                const playAttempt = video.play();
                if (playAttempt instanceof Promise) {
                  playAttempt.catch(() => {});
                }
              },
              { once: true },
            );
            video.load();
          } else if (shouldPreview && video.paused && video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) {
            const playAttempt = video.play();
            if (playAttempt instanceof Promise) {
              playAttempt.catch(() => {});
            }
          }
        } else {
          video.pause();
        }
      }

      if (playWrap) {
        const counterScale = Math.min(1 / Math.max(scale, 0.22), 2.4);
        const playOpacity = clickable ? 0.92 : easeOut3(invlerp(0.4, 0.88, enterT));
        playWrap.style.opacity = String(playOpacity * fadeOut);
        playWrap.style.transform = `scale(${counterScale})`;
        playWrap.style.transformOrigin = "center center";
      }

      if (label) {
        const lt = invlerp(0.55, 1.0, enterT);
        const labelExit = 1 - invlerp(0, 0.2, exitT);
        const counterScale = Math.min(1 / Math.max(scale, 0.22), 2.4);
        label.style.opacity = String(easeOut3(lt) * labelExit);
        label.style.transform = [
          `translateY(${lerp(14, 0, easeOut3(lt))}px)`,
          `scale(${counterScale})`,
        ].join(" ");
        label.style.transformOrigin = "bottom left";
      }
    });
  }, []);

  const handleScroll = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;

    const { top, height } = el.getBoundingClientRect();
    const scrolled = -top;
    const scrollable = Math.max(1, height - window.innerHeight);
    const progress = clamp01(scrolled / scrollable) * TOTAL_PROGRESS;

    animateIntro(progress);
    animateCards(progress);
  }, [animateIntro, animateCards]);

  useEffect(() => {
    const cleanups: (() => void)[] = [];

    CARDS.forEach((card, i) => {
      const el = cardRefs.current[i];
      if (!el) return;

      const handleClick = () => {
        if (el.dataset.clickable === "true") {
          handleOpen(card);
        }
      };

      el.addEventListener("click", handleClick);
      cleanups.push(() => el.removeEventListener("click", handleClick));
    });

    return () => {
      cleanups.forEach((fn) => fn());
    };
  }, [handleOpen]);

  useEffect(() => {
    requestAnimationFrame(() => {
      animateIntro(0);
      animateCards(0);
    });
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [animateIntro, animateCards, handleScroll]);

  return (
    <div id="testimonies" className="relative bg-[#0a0a0a]">
      <div
        ref={containerRef}
        style={{ height: `${TOTAL_SVH}svh` }}
        className="relative"
      >
        <div
          className="sticky top-0 h-screen overflow-hidden"
          style={{ perspective: PARENT_PERSPECTIVE, perspectiveOrigin: "50% 50%" }}
        >
          <div
            ref={introWrapRef}
            className="pointer-events-none absolute inset-0 z-[5] flex items-center justify-center px-[2vw]"
            style={{ willChange: "transform" }}
          >
            <h2
              className="flex w-full max-w-[96vw] select-none flex-col gap-0 uppercase"
              aria-label="Transformed Lives"
            >
              {TITLE_LINES.map((line, lineIdx) => (
                <span
                  key={line}
                  style={lineIdx === 0 ? TITLE_PRIMARY_STYLE : TITLE_SECONDARY_STYLE}
                >
                  {line}
                </span>
              ))}
            </h2>
          </div>

          {CARDS.map((card, i) => (
            <div
              key={card.id}
              ref={(el) => {
                cardRefs.current[i] = el;
              }}
              role="button"
              tabIndex={-1}
              aria-label={`${card.label}, ${card.category}`}
              className="absolute inset-0"
              style={{
                zIndex: 10 + i,
                willChange: "transform, opacity",
                transformOrigin: "center center",
                opacity: 0,
                transform: `translateY(${ENTRY_TY}%) scale(${ENTRY_SCALE})`,
              }}
            >
              <div
                ref={(el) => {
                  visualRefs.current[i] = el;
                }}
                className={
                  card.orientation === "portrait"
                    ? "absolute left-1/2 top-1/2 h-full w-[56.25vh] -translate-x-1/2 -translate-y-1/2 overflow-hidden border border-white/10"
                    : "absolute inset-0 overflow-hidden border border-white/10"
                }
                style={{
                  willChange: "border-radius",
                  borderRadius: `${ENTRY_BR}px`,
                }}
              >
                <div
                  ref={(el) => {
                    innerRefs.current[i] = el;
                  }}
                  className="absolute inset-0"
                  style={{
                    willChange: "transform",
                    transform: card.orientation === "portrait" ? "scale(1)" : "scale(1.22) translateY(-5%)",
                  }}
                >
                  <video
                    key={card.videoSrc}
                    ref={(el) => {
                      videoRefs.current[i] = el;
                    }}
                    className="absolute inset-0 h-full w-full object-cover object-center"
                    poster={card.posterSrc}
                    muted
                    loop
                    playsInline
                    preload="none"
                    aria-hidden="true"
                  />
                  <div
                    className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-black/10"
                    aria-hidden="true"
                  />
                </div>

                <div
                  ref={(el) => {
                    playRefs.current[i] = el;
                  }}
                  className="pointer-events-none absolute inset-0 z-[2] flex items-center justify-center"
                  aria-hidden="true"
                >
                  <div className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-white/40 bg-black/55 shadow-lg backdrop-blur-sm sm:h-16 sm:w-16">
                    <PlayIcon size={24} />
                  </div>
                </div>

                <div
                  ref={(el) => {
                    labelRefs.current[i] = el;
                  }}
                  className="pointer-events-none absolute bottom-3 left-3 z-10 max-w-[90%] sm:bottom-4 sm:left-4"
                  style={{ opacity: 0, willChange: "transform, opacity" }}
                >
                  <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-white/70 sm:text-[13px]">
                    {card.index} · {card.category}
                  </p>
                  <p className="mt-1 text-[18px] font-bold leading-snug text-white sm:text-[22px]">
                    {card.label}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {activeCard ? <FullscreenModal card={activeCard} onClose={handleClose} /> : null}
    </div>
  );
};
