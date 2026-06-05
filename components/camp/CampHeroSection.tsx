"use client";

import Image from "next/image";

const REGISTER_URL = "https://bit.ly/TSCAMP2026";

const GALLERY_IMAGES = [
  {
    src: "/images/programs-camp-prayer-worship.png",
    alt: "Teen worshipping at Supernatural Teens Camp",
    className: "z-10 -rotate-6 md:-ml-8",
    enterClass: "camp-hero-enter--5",
  },
  {
    src: "/images/programs-annual-camp-gathering.png",
    alt: "Teens gathered at camp meeting",
    className: "z-20 rotate-3 md:-mx-4",
    enterClass: "camp-hero-enter--6",
  },
  {
    src: "/images/supernatural-teens-camp-2026-poster.png",
    alt: "Supernatural Teens Recharge Camp 2026 poster",
    className: "z-30 -rotate-2",
    enterClass: "camp-hero-enter--6",
  },
  {
    src: "/images/supernatural-encounters.png",
    alt: "Teen encountering Jesus at camp",
    className: "z-40 rotate-6 md:-mr-8",
    enterClass: "camp-hero-enter--7",
  },
] as const;

export const CampHeroSection = () => {
  return (
    <section
      id="experience"
      aria-label="Supernatural Teens Camp hero"
      className="relative flex min-h-[100dvh] flex-col bg-white pb-14 md:pb-28 lg:pb-36"
    >
      <div className="flex flex-1 flex-col items-center justify-end px-5 pb-8 pt-24 text-center sm:px-6 md:pb-14 md:pt-32">
        <div className="relative mx-auto w-full max-w-3xl">
          <h1 className="camp-hero-enter camp-hero-enter--1 text-balance text-[clamp(2.4rem,8vw,4.5rem)] font-bold leading-[1.05] tracking-[-0.03em] text-neutral-950">
            Supernatural Teens Recharge Camp 2026
          </h1>
          <p className="camp-hero-enter camp-hero-enter--2 mx-auto mt-4 max-w-xl text-pretty text-[clamp(1rem,2.5vw,1.125rem)] leading-relaxed text-neutral-500">
            Five days of encounter with God to ignite passion, awaken purpose, and
            transform your future.
          </p>
          <div className="camp-hero-enter camp-hero-enter--3 mt-5 flex flex-wrap items-center justify-center gap-2 sm:gap-3">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-neutral-200 bg-neutral-50 px-3.5 py-1.5 text-[13px] font-medium text-neutral-500">
              <span className="h-1.5 w-1.5 rounded-full bg-red-500" aria-hidden="true" />
              28 Jul – 1 Aug 2026
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-neutral-200 bg-neutral-50 px-3.5 py-1.5 text-[13px] font-medium text-neutral-500">
              Port Harcourt
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-neutral-200 bg-neutral-50 px-3.5 py-1.5 text-[13px] font-medium text-neutral-500">
              Free · Ages 13–19
            </span>
          </div>
          <a
            href={REGISTER_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="camp-hero-enter camp-hero-enter--4 mt-7 inline-flex rounded-full bg-neutral-950 px-7 py-3.5 text-[15px] font-semibold text-white transition-[transform,opacity,background-color] duration-300 hover:scale-[1.03] hover:bg-neutral-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 active:scale-[0.98]"
          >
            Register Free
          </a>
        </div>
      </div>

      <div className="relative mx-auto mt-8 flex w-full max-w-4xl shrink-0 items-end justify-center overflow-hidden px-3 sm:overflow-visible sm:px-4 md:mt-0">
        {GALLERY_IMAGES.map((image, index) => (
          <div
            key={image.src}
            className={`camp-hero-enter ${image.enterClass} relative h-[170px] w-[118px] shrink-0 overflow-hidden rounded-xl shadow-[0_12px_32px_rgba(0,0,0,0.12)] transition-transform duration-500 hover:z-50 hover:scale-[1.04] sm:h-[200px] sm:w-[140px] sm:rounded-2xl md:h-[230px] md:w-[165px] ${image.className}`}
            style={{ marginLeft: index === 0 ? 0 : "-1.75rem" }}
          >
            <Image
              src={image.src}
              alt={image.alt}
              fill
              sizes="(min-width: 768px) 165px, (min-width: 640px) 140px, 118px"
              className="object-cover object-center"
              priority
            />
          </div>
        ))}
      </div>

      <div id="hero-scroll-sentinel" className="absolute bottom-0 left-0 h-px w-full" aria-hidden="true" />
    </section>
  );
};
