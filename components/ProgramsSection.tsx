"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type RefObject } from "react";

const clamp01 = (v: number): number => Math.max(0, Math.min(1, v));

const useProgramsInView = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting);
      },
      { threshold: 0.12, rootMargin: "0px 0px -6% 0px" },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return { sectionRef, inView };
};

/* ─────────────────────────────────────────────────────────────────
   Auto-calculate next 2nd Saturday in Nigerian time (WAT = UTC+1).
───────────────────────────────────────────────────────────────── */
const getNextSecondSaturday = (): string => {
  const WAT_OFFSET_MS = 1 * 60 * 60 * 1000;
  const watDate = new Date(Date.now() + WAT_OFFSET_MS);
  const todayYear  = watDate.getUTCFullYear();
  const todayMonth = watDate.getUTCMonth();
  const todayDay   = watDate.getUTCDate();

  const findSecondSat = (year: number, month: number): number => {
    const dow       = new Date(Date.UTC(year, month, 1)).getUTCDay();
    const firstSat  = 1 + ((6 - dow + 7) % 7);
    return firstSat + 7;
  };

  let year  = todayYear;
  let month = todayMonth;
  let day   = findSecondSat(year, month);

  if (todayDay > day) {
    month += 1;
    if (month > 11) { month = 0; year += 1; }
    day = findSecondSat(year, month);
  }

  const MONTHS = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];
  return `${day} ${MONTHS[month]} ${year}`;
};

type JlpProgram = {
  id: string;
  pill: string;
  nextDate: "dynamic" | string;
  title: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
  href: string;
  imageClassName?: string;
  centeredImage?: boolean;
};

const PROGRAMS: readonly JlpProgram[] = [
  {
    id: "recharge",
    pill: "Monthly recharge",
    nextDate: "dynamic",
    title: "Supernatural Teens Recharge",
    description:
      "Monthly worship, prayer, and the Word for teenagers who want to encounter Jesus, not just hear about Him.",
    imageSrc: "/images/programs-monthly-recharge-worship.png",
    imageAlt: "Teenagers worshipping and praying at Supernatural Teens Recharge",
    href: "#gatherings",
    imageClassName: "object-cover object-center",
    centeredImage: true,
  },
  {
    id: "camp",
    pill: "Five-day annual camp",
    nextDate: "28 Jul - 1 Aug 2026",
    title: "Supernatural Teens Recharge Camp",
    description:
      "Five days away from distractions, deep in the presence of God. Immersive encounters, fire, and transformation.",
    imageSrc: "/images/programs-camp-prayer-worship.png",
    imageAlt: "Large crowd of young people gathered at Supernatural Teens Recharge Camp",
    href: "/programs/supernatural-teens-camp",
    imageClassName: "object-cover object-center",
  },
] as const;

type ProgramCardProps = {
  program: JlpProgram;
  cardIndex: number;
  animate: boolean;
};

const useCardImageParallax = (
  cardRef: RefObject<HTMLAnchorElement | null>,
  layerRef: RefObject<HTMLDivElement | null>,
  animate: boolean,
  centeredImage: boolean,
) => {
  useEffect(() => {
    if (!animate) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    let rafId = 0;

    const update = () => {
      rafId = 0;
      const card = cardRef.current;
      const layer = layerRef.current;
      if (!card || !layer) return;

      if (centeredImage) {
        layer.style.transform = "translate3d(0, 0, 0) scale(1)";
        return;
      }

      const rect = card.getBoundingClientRect();
      const vh = window.innerHeight;
      const progress = clamp01((vh - rect.top) / (vh + rect.height));
      const y = (progress - 0.5) * 52;
      layer.style.transform = `translate3d(0, ${y.toFixed(2)}px, 0) scale(1.14)`;
    };

    const onScroll = () => {
      if (rafId) return;
      rafId = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (rafId) window.cancelAnimationFrame(rafId);
    };
  }, [animate, cardRef, layerRef, centeredImage]);
};

const CAMP_REGISTER_URL = "https://bit.ly/TSCAMP2026";

const ProgramCard = ({ program, cardIndex, animate }: ProgramCardProps) => {
  const [dateStr, setDateStr] = useState<string>("");
  const cardRef = useRef<HTMLDivElement>(null);
  const imageLayerRef = useRef<HTMLDivElement>(null);
  const cardSlot = cardIndex === 0 ? "1" : "2";
  const isCamp = program.id === "camp";

  useCardImageParallax(
    cardRef as unknown as RefObject<HTMLAnchorElement | null>,
    imageLayerRef,
    animate,
    program.centeredImage === true,
  );

  useEffect(() => {
    setDateStr(
      program.nextDate === "dynamic" ? getNextSecondSaturday() : program.nextDate,
    );
  }, [program.nextDate]);

  return (
    <div
      ref={cardRef}
      className="group relative flex h-full min-h-[360px] w-full overflow-hidden rounded-[24px] bg-neutral-200 shadow-[0_8px_40px_rgba(0,0,0,0.08)] sm:min-h-[440px] sm:rounded-[28px] md:min-h-[500px]"
    >
      <div
        ref={imageLayerRef}
        className={
          program.centeredImage
            ? "absolute inset-0 will-change-transform"
            : "absolute inset-[-14%] will-change-transform"
        }
        aria-hidden="true"
      >
        <Image
          src={program.imageSrc}
          alt={program.imageAlt}
          fill
          sizes="(min-width: 768px) 960px, 100vw"
          quality={95}
          className={
            program.imageClassName ??
            "object-cover object-center transition-transform duration-500 group-hover:scale-[1.04]"
          }
        />
      </div>

      <div className="absolute inset-0 bg-black/40" aria-hidden="true" />
      <div
        className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/15 to-black/10"
        aria-hidden="true"
      />

      {/* Make the whole card clickable for non-camp cards */}
      {!isCamp && (
        <a
          href={program.href}
          aria-label={`${program.title}. ${program.pill}. Next: ${dateStr || "TBC"}`}
          className="absolute inset-0 z-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-neutral-400"
          tabIndex={0}
        />
      )}

      <div className="relative z-10 mt-auto flex w-full flex-col gap-4 p-5 sm:gap-5 sm:p-8 md:p-9">
        <div>
          <h3
            className={`programs-animate-title programs-animate-title--${cardSlot} max-w-[14ch] text-[clamp(22px,3.8vw,40px)] font-bold leading-[1.06] tracking-[-0.02em] text-white drop-shadow-[0_2px_14px_rgba(0,0,0,0.9)]`}
          >
            {program.title}
          </h3>

          <p
            className={`programs-animate-desc programs-animate-desc--${cardSlot} mt-2 hidden max-w-[36ch] text-[13px] leading-[1.65] text-white/90 drop-shadow-[0_2px_10px_rgba(0,0,0,0.85)] sm:mt-3 sm:block sm:text-[15px]`}
          >
            {program.description}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span
            className={`programs-animate-pill programs-animate-pill--${cardSlot}a inline-flex rounded-full border border-white/25 bg-black/45 px-3.5 py-1.5 text-[12px] font-medium text-white backdrop-blur-md sm:text-[13px]`}
          >
            {program.pill}
          </span>
          {dateStr ? (
            <span
              className={`programs-animate-pill programs-animate-pill--${cardSlot}b inline-flex rounded-full border border-white/15 bg-black/45 px-3.5 py-1.5 text-[12px] font-medium text-white/90 backdrop-blur-md sm:text-[13px]`}
            >
              Next: {dateStr}
            </span>
          ) : null}
        </div>

        {isCamp && (
          <div className="flex flex-wrap items-center gap-3">
            <a
              href={program.href}
              className="inline-flex items-center gap-1.5 rounded-full border border-white/30 bg-white/10 px-5 py-2.5 text-[13px] font-semibold text-white backdrop-blur-md transition-[background-color,transform] duration-200 hover:bg-white/20 hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 sm:text-[14px]"
              aria-label="Learn more about Supernatural Teens Recharge Camp"
            >
              Learn more
            </a>
            <a
              href={CAMP_REGISTER_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full bg-white px-5 py-2.5 text-[13px] font-semibold text-neutral-950 transition-[background-color,transform] duration-200 hover:bg-neutral-100 hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 sm:text-[14px]"
              aria-label="Register for Supernatural Teens Recharge Camp"
            >
              Register
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path
                  d="M7 17L17 7M17 7H9M17 7V15"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export const ProgramsSection = () => {
  const { sectionRef, inView } = useProgramsInView();

  return (
    <section
      ref={sectionRef}
      id="gatherings"
      className={`bg-white px-5 py-16 sm:px-10 sm:py-24 md:px-16 md:py-28 ${inView ? "programs-in-view" : ""}`}
      aria-labelledby="programs-heading"
    >
      <div className="mx-auto w-full max-w-[1200px]">
        <header className="mb-8 flex flex-col gap-5 sm:mb-12 md:mb-14 md:flex-row md:items-start md:justify-between">
          <h2
            id="programs-heading"
            className="max-w-full text-[clamp(32px,7.5vw,56px)] font-bold leading-[1.05] tracking-[-0.03em] text-neutral-900 md:max-w-[16ch]"
          >
            <span className="programs-headline-line">
              <span className="programs-animate-headline-inner">Get ready to be</span>
            </span>
            <span className="programs-headline-line">
              <span className="programs-animate-headline-inner programs-animate-headline-inner--delay">
                transformed.
              </span>
            </span>
          </h2>

          <span className="programs-animate-badge inline-flex w-fit shrink-0 self-start rounded-full border border-neutral-200 bg-neutral-50 px-4 py-2 text-[13px] font-medium text-neutral-500 md:mt-2">
            Our Programs
          </span>
        </header>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-5">
          {PROGRAMS.map((program, index) => (
            <div
              key={program.id}
              className={`programs-animate-fade-up h-full ${
                index === 0 ? "programs-animate-fade-up--1" : "programs-animate-fade-up--2"
              }`}
            >
              <ProgramCard program={program} cardIndex={index} animate={inView} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
