"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { CAMP_SECTION_PX, CAMP_SECTION_PY } from "@/components/camp/campSectionSpacing";
import { useCampReveal } from "@/components/camp/useCampReveal";

type CampSpeaker = {
  id: string;
  name: string;
  organization: string;
  role: string;
  imageSrc: string;
};

const SPEAKERS: CampSpeaker[] = [
  {
    id: "william-emina",
    name: "Pastor William Emina",
    organization: "JLP MINISTRIES",
    role: "Host",
    imageSrc: "/images/programs-camp-prayer-worship.png",
  },
  {
    id: "lawrence-oyor",
    name: "Apostle Lawrence Oyor",
    organization: "GUEST SPEAKER",
    role: "Speaker",
    imageSrc: "/images/programs-annual-camp-gathering.png",
  },
  {
    id: "levi-afolayan",
    name: "Pastor Levi O. Afolayan",
    organization: "GUEST SPEAKER",
    role: "Speaker",
    imageSrc: "/images/supernatural-encounters.png",
  },
  {
    id: "benjamin-ekesi",
    name: "Pastor Benjamin Ekesi",
    organization: "GUEST SPEAKER",
    role: "Speaker",
    imageSrc: "/images/love-power-revival.png",
  },
  {
    id: "esther-samson",
    name: "Esther Samson",
    organization: "CAMP MINSTREL",
    role: "Minstrel",
    imageSrc: "/images/programs-supernatural-camp.png",
  },
  {
    id: "godsgift-alika",
    name: "God'sgift Alika",
    organization: "CAMP MINSTREL",
    role: "Minstrel",
    imageSrc: "/images/programs-monthly-recharge-worship.png",
  },
  {
    id: "paul",
    name: "Paul",
    organization: "CAMP MINSTREL",
    role: "Minstrel",
    imageSrc: "/images/response-section.png",
  },
];

const STICKY_TOP = "16vh";
const SCROLL_HOLD_PX = 48;

const clamp01 = (value: number): number => Math.max(0, Math.min(1, value));

export const CampSpeakersSection = () => {
  const { ref: sectionRevealRef, inView: sectionInView } = useCampReveal(0.08);
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const [scrollTrackPx, setScrollTrackPx] = useState(900);
  const [containerHeightPx, setContainerHeightPx] = useState(1800);

  const measureLayout = useCallback(() => {
    const track = trackRef.current;
    const viewport = viewportRef.current;
    if (!track || !viewport) return;

    const maxTranslate = Math.max(0, track.scrollHeight - viewport.clientHeight);
    const trackPx = maxTranslate + SCROLL_HOLD_PX;
    setScrollTrackPx(trackPx);
    setContainerHeightPx(trackPx + window.innerHeight);
  }, []);

  const handleScroll = useCallback(() => {
    const container = containerRef.current;
    const track = trackRef.current;
    const viewport = viewportRef.current;
    if (!container || !track || !viewport) return;

    const { top, height } = container.getBoundingClientRect();
    const vh = window.innerHeight;
    const scrolled = -top;
    const scrollable = height - vh;
    const progress = scrollable <= 0 ? 0 : clamp01(scrolled / scrollable);

    const maxTranslate = Math.max(0, track.scrollHeight - viewport.clientHeight);
    track.style.transform = `translate3d(0, ${(-progress * maxTranslate).toFixed(2)}px, 0)`;
  }, []);

  useEffect(() => {
    measureLayout();
    handleScroll();

    const track = trackRef.current;
    if (!track) return;

    const resizeObserver = new ResizeObserver(() => {
      measureLayout();
      handleScroll();
    });
    resizeObserver.observe(track);
    if (viewportRef.current) resizeObserver.observe(viewportRef.current);

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll, { passive: true });

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, [handleScroll, measureLayout]);

  return (
    <section
      id="speakers"
      aria-label="Camp speakers"
      className={`bg-white ${CAMP_SECTION_PX} ${CAMP_SECTION_PY}`}
    >
      <div
        ref={containerRef}
        style={{ height: containerHeightPx }}
        className="relative"
      >
        <div
          className="sticky flex h-[78vh] flex-col gap-8 overflow-hidden md:flex-row md:items-stretch md:gap-14"
          style={{ top: STICKY_TOP }}
        >
          <div
            ref={sectionRevealRef}
            className={`flex w-full shrink-0 flex-col justify-center md:w-[min(380px,36%)] camp-reveal ${sectionInView ? "is-visible" : ""}`}
          >
            <p className="text-[12px] font-bold uppercase tracking-[0.24em] text-neutral-400">
              Speakers
            </p>
            <h2 className="mt-3 text-balance text-[clamp(2.75rem,5.5vw,4.5rem)] font-bold leading-[1.02] tracking-[-0.03em] text-neutral-950">
              Camp ministers
            </h2>
            <p className="mt-5 max-w-md text-pretty text-[clamp(1.05rem,1.8vw,1.25rem)] leading-relaxed text-neutral-500">
              Anointed ministers and minstrels coming together to lead the next
              generation into worship, the Word, and supernatural encounter.
            </p>
            <a
              href="https://bit.ly/TSCAMP2026"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 inline-flex items-center gap-2 text-[16px] font-semibold text-neutral-950 transition-[gap,opacity] duration-300 hover:gap-3 hover:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400"
            >
              <span aria-hidden="true">→</span>
              Register for camp
            </a>
          </div>

          <div ref={viewportRef} className="relative min-h-0 flex-1 overflow-hidden">
            <div
              ref={trackRef}
              className="grid w-full grid-cols-2 gap-x-4 gap-y-8 will-change-transform sm:gap-x-5 sm:gap-y-10 md:gap-x-6 md:gap-y-12"
              style={{ transform: "translate3d(0, 0, 0)" }}
            >
              {SPEAKERS.map((speaker, index) => (
                <article
                  key={speaker.id}
                  className={`camp-card-hover camp-reveal shrink-0 ${sectionInView ? "is-visible" : ""}`}
                  style={{ transitionDelay: `${0.08 + index * 0.06}s` }}
                >
                  <div className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-neutral-200">
                    <Image
                      src={speaker.imageSrc}
                      alt={speaker.name}
                      fill
                      sizes="(min-width: 768px) 240px, 45vw"
                      className="object-cover object-center grayscale transition-[transform,filter] duration-500 hover:grayscale-0"
                    />
                  </div>
                  <h3 className="mt-4 text-[clamp(1.1rem,2vw,1.5rem)] font-bold leading-tight text-neutral-950">
                    {speaker.name}
                  </h3>
                  <p className="mt-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-neutral-800 sm:text-[11px]">
                    {speaker.organization}
                  </p>
                  <p className="mt-1 text-[14px] text-neutral-500 sm:text-[15px]">{speaker.role}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
