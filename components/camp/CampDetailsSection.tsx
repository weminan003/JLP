"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { CAMP_SECTION_PX, CAMP_SECTION_PY } from "@/components/camp/campSectionSpacing";
import { useCampReveal } from "@/components/camp/useCampReveal";

const REGISTER_URL = "https://bit.ly/TSCAMP2026";

/** Counts up from 0 to `target` once `active` becomes true. */
const useCountUp = (target: number, active: boolean, duration = 900): number => {
  const [value, setValue] = useState(0);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (!active) return;
    const start = performance.now();
    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(eased * target));
      if (progress < 1) rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => { if (rafRef.current !== null) cancelAnimationFrame(rafRef.current); };
  }, [active, target, duration]);

  return value;
};

const CARD_BASE =
  "overflow-hidden rounded-2xl transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(0,0,0,0.45)]";

export const CampDetailsSection = () => {
  const { ref: sectionRef, inView } = useCampReveal(0.08);
  const days = useCountUp(5, inView, 800);
  const ageMin = useCountUp(13, inView, 700);
  const ageMax = useCountUp(19, inView, 950);

  return (
    <section
      id="event-details"
      aria-label="Camp event details"
      className={`bg-neutral-950 ${CAMP_SECTION_PX} ${CAMP_SECTION_PY}`}
    >
      <div
        ref={sectionRef}
        className="mx-auto max-w-5xl"
      >
        <p
          className="mb-8 text-[12px] font-bold uppercase tracking-[0.22em] text-neutral-500"
          style={{
            opacity: inView ? 1 : 0,
            transform: inView ? "none" : "translateY(12px)",
            transition: "opacity 0.6s ease, transform 0.6s ease",
          }}
        >
          The details
        </p>

        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4 lg:grid-rows-2">

          {/* WHEN — tall, spans 2 rows on desktop */}
          <div
            className={`${CARD_BASE} col-span-2 row-span-1 flex flex-col justify-between bg-neutral-900 p-6 lg:col-span-1 lg:row-span-2 lg:p-8`}
            style={{
              opacity: inView ? 1 : 0,
              transform: inView ? "none" : "translateY(28px)",
              transition: "opacity 0.55s cubic-bezier(0.22,1,0.36,1) 0.05s, transform 0.55s cubic-bezier(0.22,1,0.36,1) 0.05s",
            }}
          >
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-neutral-600">When</p>
              <p className="mt-4 text-[clamp(1.4rem,3vw,1.75rem)] font-bold leading-[1.1] text-white">
                28 Jul –<br />1 Aug<br />2026
              </p>
            </div>
            <div className="mt-8 border-t border-neutral-800 pt-5">
              <p className="text-[13px] text-neutral-400">Tuesday to Saturday</p>
              <p className="mt-2 tabular-nums text-[2rem] font-bold text-white">
                {days}
                <span className="ml-1 text-[0.9rem] font-normal text-neutral-500">days</span>
              </p>
            </div>
          </div>

          {/* THEME — wide white card */}
          <div
            className={`${CARD_BASE} relative col-span-2 bg-white p-6 lg:col-span-2 lg:p-8`}
            style={{
              opacity: inView ? 1 : 0,
              transform: inView ? "none" : "translateY(28px)",
              transition: "opacity 0.55s cubic-bezier(0.22,1,0.36,1) 0.14s, transform 0.55s cubic-bezier(0.22,1,0.36,1) 0.14s",
            }}
          >
            {/* shimmer line */}
            <span
              className="pointer-events-none absolute inset-0 rounded-2xl"
              aria-hidden="true"
              style={{
                background:
                  "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.55) 50%, transparent 60%)",
                backgroundSize: "200% 100%",
                animation: inView ? "detailShimmer 2.4s ease 0.6s 1 forwards" : "none",
              }}
            />
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-neutral-400">Theme</p>
            <p className="mt-3 text-[clamp(1.3rem,3.5vw,1.9rem)] font-bold leading-[1.1] tracking-[-0.02em] text-neutral-950">
              Transformed<br />By His Glory
            </p>
            <p className="mt-3 text-[13px] text-neutral-400">Camp 2026</p>
          </div>

          {/* WHO */}
          <div
            className={`${CARD_BASE} col-span-1 bg-neutral-800 p-6`}
            style={{
              opacity: inView ? 1 : 0,
              transform: inView ? "none" : "translateY(28px)",
              transition: "opacity 0.55s cubic-bezier(0.22,1,0.36,1) 0.22s, transform 0.55s cubic-bezier(0.22,1,0.36,1) 0.22s",
            }}
          >
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-neutral-500">Who</p>
            <p className="mt-3 text-[1.4rem] font-bold leading-snug text-white">
              Ages<br />
              <span className="tabular-nums">{ageMin}</span>
              <span className="text-neutral-500"> – </span>
              <span className="tabular-nums">{ageMax}</span>
            </p>
            <p className="mt-3 text-[12px] text-neutral-400">Free to attend</p>
          </div>

          {/* WHERE — photo card */}
          <div
            className={`${CARD_BASE} col-span-2 bg-neutral-900 lg:col-span-2`}
            style={{
              opacity: inView ? 1 : 0,
              transform: inView ? "none" : "translateY(28px)",
              transition: "opacity 0.55s cubic-bezier(0.22,1,0.36,1) 0.30s, transform 0.55s cubic-bezier(0.22,1,0.36,1) 0.30s",
            }}
          >
            <div className="group relative h-28 w-full overflow-hidden lg:h-36">
              <Image
                src="/images/programs-annual-camp-gathering.png"
                alt="Camp gathering"
                fill
                sizes="(min-width: 1024px) 40vw, 80vw"
                className="object-cover object-center opacity-60 transition-[transform,opacity] duration-700 group-hover:scale-105 group-hover:opacity-75"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-neutral-900" />
            </div>
            <div className="p-6">
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-neutral-500">Where</p>
              <p className="mt-2 text-[1.2rem] font-bold leading-snug text-white">Emarid College</p>
              <p className="mt-1 text-[13px] text-neutral-400">Eneka/Igwuruta Road, Port Harcourt</p>
            </div>
          </div>

          {/* REGISTER */}
          <div
            className={`${CARD_BASE} col-span-1 flex flex-col items-start justify-between bg-red-600 p-6`}
            style={{
              opacity: inView ? 1 : 0,
              transform: inView ? "none" : "translateY(28px)",
              transition: "opacity 0.55s cubic-bezier(0.22,1,0.36,1) 0.38s, transform 0.55s cubic-bezier(0.22,1,0.36,1) 0.38s",
            }}
          >
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-red-200">Registration</p>
            <div>
              <p className="mt-3 text-[1.3rem] font-bold leading-snug text-white">
                Free.<br />Register now.
              </p>
              <a
                href={REGISTER_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-white/20 px-4 py-2 text-[13px] font-semibold text-white backdrop-blur-sm transition-[background-color,transform] duration-300 hover:bg-white/35 hover:scale-[1.05] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 active:scale-[0.97]"
                aria-label="Register for Supernatural Teens Camp"
                style={{ animation: inView ? "detailPulse 2s ease 1.2s 3" : "none" }}
              >
                Register →
              </a>
            </div>
          </div>

        </div>

        {/* Enquiries */}
        <p
          className="mt-6 text-[13px] text-neutral-600"
          style={{
            opacity: inView ? 1 : 0,
            transition: "opacity 0.5s ease 0.6s",
          }}
        >
          Enquiries:{" "}
          <a href="tel:07077375842" className="text-neutral-400 transition-colors hover:text-white focus-visible:outline-none">
            07077375842
          </a>
          {" · "}
          <a href="tel:07062051038" className="text-neutral-400 transition-colors hover:text-white focus-visible:outline-none">
            07062051038
          </a>
        </p>
      </div>

      <style>{`
        @keyframes detailShimmer {
          from { background-position: 200% center; }
          to   { background-position: -200% center; }
        }
        @keyframes detailPulse {
          0%, 100% { transform: scale(1); }
          50%       { transform: scale(1.06); }
        }
        @media (prefers-reduced-motion: reduce) {
          [style*="detailShimmer"], [style*="detailPulse"] {
            animation: none !important;
          }
        }
      `}</style>
    </section>
  );
};
