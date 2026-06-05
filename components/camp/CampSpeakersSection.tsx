"use client";

import Image from "next/image";
import React from "react";
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
    imageSrc: "/images/speaker-william-emina.png",
  },
  {
    id: "lawrence-oyor",
    name: "Apostle Lawrence Oyor",
    organization: "GUEST SPEAKER",
    role: "Speaker",
    imageSrc: "/images/speaker-lawrence-oyor.png",
  },
  {
    id: "levi-afolayan",
    name: "Pastor Levi O. Afolayan",
    organization: "GUEST SPEAKER",
    role: "Speaker",
    imageSrc: "/images/speaker-levi-afolayan.png",
  },
  {
    id: "benjamin-ekesi",
    name: "Pastor Benjamin Ekesi",
    organization: "GUEST SPEAKER",
    role: "Speaker",
    imageSrc: "/images/speaker-benjamin-ekesi.png",
  },
  {
    id: "esther-samson",
    name: "Esther Samson",
    organization: "CAMP MINSTREL",
    role: "Minstrel",
    imageSrc: "/images/speaker-esther-samson.png",
  },
  {
    id: "godsgift-alika",
    name: "God'sgift Alika",
    organization: "CAMP MINSTREL",
    role: "Minstrel",
    imageSrc: "/images/speaker-godsgift-alika.png",
  },
  {
    id: "paul",
    name: "Paul",
    organization: "CAMP MINSTREL",
    role: "Minstrel",
    imageSrc: "/images/speaker-paul.png",
  },
];

export const CampSpeakersSection = () => {
  const { ref: sectionRevealRef, inView: sectionInView } = useCampReveal(0.08);

  const SpeakerCard = ({ speaker, index, sizes }: { speaker: CampSpeaker; index: number; sizes: string }) => (
    <article
      className={`camp-reveal ${sectionInView ? "is-visible" : ""}`}
      style={{ transitionDelay: `${0.08 + index * 0.06}s` }}
    >
      <div
        className="relative aspect-[3/4] overflow-hidden rounded-xl md:rounded-2xl"
        style={{ background: "radial-gradient(ellipse at 60% 30%, #f5f4f2 0%, #e8e6e2 50%, #d8d5d0 100%)" }}
      >
        <Image
          src={speaker.imageSrc}
          alt={speaker.name}
          fill
          sizes={sizes}
          unoptimized
          className="object-cover object-top transition-transform duration-500"
        />
      </div>
      <h3 className="mt-3 text-[0.95rem] font-bold leading-tight text-neutral-950 md:text-[clamp(0.95rem,1.5vw,1.3rem)]">
        {speaker.name}
      </h3>
      <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.18em] text-neutral-800 md:text-[11px]">
        {speaker.organization}
      </p>
      <p className="mt-0.5 text-[13px] text-neutral-500 md:text-[14px]">{speaker.role}</p>
    </article>
  );

  const CopyBlock = ({ className }: { className?: string }) => (
    <div
      className={`flex flex-col camp-reveal ${sectionInView ? "is-visible" : ""} ${className ?? ""}`}
    >
      <p className="text-[12px] font-bold uppercase tracking-[0.24em] text-neutral-400">
        Speakers
      </p>
      <h2 className="mt-3 text-balance text-[clamp(2.25rem,5.5vw,4.5rem)] font-bold leading-[1.02] tracking-[-0.03em] text-neutral-950">
        Camp ministers
      </h2>
      <p className="mt-4 max-w-md text-pretty text-[clamp(0.95rem,1.6vw,1.2rem)] leading-relaxed text-neutral-500">
        Anointed ministers and minstrels coming together to lead the next
        generation into worship, the Word, and supernatural encounter.
      </p>
      <a
        href="https://bit.ly/TSCAMP2026"
        target="_blank"
        rel="noopener noreferrer"
        className="mt-6 inline-flex items-center gap-2 text-[15px] font-semibold text-neutral-950 transition-[gap,opacity] duration-300 hover:gap-3 hover:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 md:mt-8 md:text-[16px]"
      >
        <span aria-hidden="true">→</span>
        Register for camp
      </a>
    </div>
  );

  return (
    <section
      ref={sectionRevealRef as React.RefObject<HTMLElement>}
      id="speakers"
      aria-label="Camp speakers"
      className={`bg-white ${CAMP_SECTION_PX} ${CAMP_SECTION_PY}`}
    >
      {/* ── Mobile: stacked copy then grid ── */}
      <div className="md:hidden">
        <CopyBlock className="mb-8" />
        <div className="grid grid-cols-2 gap-x-4 gap-y-8">
          {SPEAKERS.map((speaker, index) => (
            <SpeakerCard key={speaker.id} speaker={speaker} index={index} sizes="45vw" />
          ))}
        </div>
      </div>

      {/* ── Desktop: left copy + right grid, both in normal flow ── */}
      <div className="hidden md:flex md:items-start md:gap-14">
        {/* Left copy — sticky so it stays visible while you scroll the grid */}
        <div className="sticky top-[20vh] shrink-0 self-start md:w-[min(360px,34%)]">
          <CopyBlock />
        </div>

        {/* Right: natural-height grid — scrolls away on its own */}
        <div className="min-w-0 flex-1">
          <div className="grid grid-cols-2 gap-x-6 gap-y-10">
            {SPEAKERS.map((speaker, index) => (
              <SpeakerCard key={speaker.id} speaker={speaker} index={index} sizes="(min-width:1280px) 260px, 20vw" />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
