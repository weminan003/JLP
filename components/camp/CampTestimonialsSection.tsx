"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { CAMP_SECTION_PX, CAMP_SECTION_PY } from "@/components/camp/campSectionSpacing";
import { useCampReveal } from "@/components/camp/useCampReveal";

type CampTestimonial = {
  id: string;
  quote: string;
  name: string;
  role: string;
  imageSrc: string;
};

const TESTIMONIALS: CampTestimonial[] = [
  {
    id: "healing",
    quote:
      "I had leg pain for three days since the program. We prayed in the name of Jesus — and it left. I cannot explain it. I just know God moved.",
    name: "Testimony — Healing",
    role: "Supernatural Recharge",
    imageSrc: "/images/programs-camp-prayer-worship.png",
  },
  {
    id: "prayer-fire",
    quote:
      "Since Recharge I have been staying up until 3am just to pray. I did not plan it. God gave me the spirit of prayer and I cannot stop.",
    name: "Testimony — Prayer Fire",
    role: "Supernatural Recharge",
    imageSrc: "/images/programs-annual-camp-gathering.png",
  },
  {
    id: "jesus-encounter",
    quote:
      "I was lost. While I was praying, Jesus began speaking to me. Not a feeling — a voice. I have never been the same since that night.",
    name: "Testimony — Encounter",
    role: "Supernatural Recharge",
    imageSrc: "/images/supernatural-encounters.png",
  },
  {
    id: "first-day",
    quote:
      "It was my first day at camp. The Holy Spirit came and something broke off me in that session. I came in one person and left another.",
    name: "Testimony — First Day",
    role: "Supernatural Recharge",
    imageSrc: "/images/programs-supernatural-camp.png",
  },
];

const clamp01 = (value: number): number => Math.max(0, Math.min(1, value));

const TestimonyGlassCard = ({ item }: { item: CampTestimonial }) => (
  <article className="camp-card-hover relative h-[340px] w-[min(88vw,440px)] shrink-0 overflow-hidden rounded-2xl bg-neutral-900 sm:h-[370px] sm:rounded-3xl">
    <Image
      src={item.imageSrc}
      alt=""
      fill
      sizes="440px"
      className="object-cover object-center opacity-75 transition-transform duration-700 hover:scale-105"
    />
    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/10" />
    <div className="absolute inset-x-4 bottom-4 rounded-xl border border-white/10 bg-white/10 p-4 backdrop-blur-md sm:inset-x-6 sm:bottom-6 sm:rounded-2xl sm:p-5 md:inset-x-8 md:bottom-8 md:p-6">
      <p className="text-pretty text-[14px] leading-relaxed text-white sm:text-[15px] md:text-[17px]">
        &ldquo;{item.quote}&rdquo;
      </p>
      <div className="mt-4 flex items-center gap-2.5 sm:mt-5 sm:gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#6d28d9] text-sm font-bold text-white sm:h-10 sm:w-10">
          {item.name.charAt(0)}
        </span>
        <div>
          <p className="text-[13px] font-semibold text-white sm:text-[14px]">{item.name}</p>
          <p className="text-[12px] text-white/60 sm:text-[13px]">{item.role}</p>
        </div>
      </div>
    </div>
  </article>
);

export const CampTestimonialsSection = () => {
  const { ref: titleRevealRef, inView: titleInView } = useCampReveal(0.08);
  const sectionRef = useRef<HTMLElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const spacerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const [scrollTrackPx, setScrollTrackPx] = useState(800);

  /** How many px of scroll distance to give to the horizontal slide. */
  const measureLayout = useCallback(() => {
    const track = trackRef.current;
    const viewport = viewportRef.current;
    if (!track || !viewport) return;

    const overflowPx = Math.max(0, track.scrollWidth - viewport.clientWidth);
    setScrollTrackPx(overflowPx);
  }, []);

  const handleScroll = useCallback(() => {
    const section = sectionRef.current;
    const spacer = spacerRef.current;
    const track = trackRef.current;
    const viewport = viewportRef.current;
    if (!section || !spacer || !track || !viewport) return;

    const maxTranslate = Math.max(0, track.scrollWidth - viewport.clientWidth);
    if (maxTranslate === 0) return;

    /**
     * Progress is derived from the section itself:
     *   0  = section top just reached viewport top
     *   1  = section bottom just reached viewport bottom
     *
     * We slide the cards across the full overflowPx range as the
     * section scrolls through. This is simpler and more reliable than
     * tracking the spacer position.
     */
    const sectionRect = section.getBoundingClientRect();
    const vh = window.innerHeight;
    const sectionScrollable = sectionRect.height - vh;

    if (sectionScrollable <= 0) {
      track.style.transform = "translate3d(0, 0, 0)";
      return;
    }

    const scrolled = -sectionRect.top;
    const progress = clamp01(scrolled / sectionScrollable);
    track.style.transform = `translate3d(${(-progress * maxTranslate).toFixed(2)}px, 0, 0)`;
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
    window.addEventListener("resize", () => { measureLayout(); handleScroll(); }, { passive: true });

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("scroll", handleScroll);
    };
  }, [handleScroll, measureLayout]);

  /**
   * Section height = enough scroll distance to fully traverse the cards,
   * plus a full viewport height so the pinned block stays visible throughout.
   */
  const sectionHeightPx = scrollTrackPx + (typeof window !== "undefined" ? window.innerHeight : 900);

  return (
    <section
      ref={sectionRef}
      id="testimonies"
      aria-label="Camp testimonies"
      className={`relative bg-black ${CAMP_SECTION_PX}`}
      style={{ height: sectionHeightPx }}
    >
      {/* Sticky panel — vertically centered in the viewport while scrolling through */}
      <div
        ref={pinRef}
        className={`sticky top-0 flex h-screen flex-col justify-center ${CAMP_SECTION_PY}`}
      >
        <div
          ref={titleRevealRef}
          className={`mb-6 flex shrink-0 items-end justify-between camp-reveal md:mb-8 ${titleInView ? "is-visible" : ""}`}
        >
          <div>
            <p className="text-[12px] text-neutral-500 sm:text-[13px]">+ Testimonies</p>
            <h2 className="mt-2 text-[clamp(2rem,7vw,5rem)] font-bold leading-[0.95] tracking-[-0.04em] text-white">
              Changed Lives
            </h2>
          </div>
          <p className="hidden text-[13px] text-neutral-500 md:block">Camp 2026</p>
        </div>

        <div ref={viewportRef} className="w-full overflow-hidden">
          <div
            ref={trackRef}
            className="flex w-max gap-5 will-change-transform md:gap-6"
            style={{ transform: "translate3d(0, 0, 0)" }}
          >
            {TESTIMONIALS.map((item) => (
              <TestimonyGlassCard key={item.id} item={item} />
            ))}
          </div>
        </div>
      </div>

      {/* Invisible spacer so the section has enough natural height for the scroll distance above. */}
      <div ref={spacerRef} className="pointer-events-none" aria-hidden="true" />
    </section>
  );
};
