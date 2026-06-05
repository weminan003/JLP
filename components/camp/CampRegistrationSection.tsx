"use client";

import { CAMP_SECTION_PX, CAMP_SECTION_PY } from "@/components/camp/campSectionSpacing";
import { useCampReveal } from "@/components/camp/useCampReveal";

const REGISTER_URL = "https://bit.ly/TSCAMP2026";

export const CampRegistrationSection = () => {
  const { ref: revealRef, inView } = useCampReveal(0.1);

  const handleRegister = () => {
    window.open(REGISTER_URL, "_blank", "noopener,noreferrer");
  };

  return (
    <section
      id="register"
      aria-label="Camp registration"
      className={`border-t border-neutral-200/80 bg-white ${CAMP_SECTION_PX} ${CAMP_SECTION_PY}`}
    >
      <div className="mx-auto max-w-4xl">
        <article
          ref={revealRef}
          className={`grid overflow-hidden rounded-3xl bg-white shadow-[0_12px_48px_rgba(0,0,0,0.1)] ring-1 ring-neutral-200/90 camp-reveal md:grid-cols-[1fr_auto] ${inView ? "is-visible" : ""}`}
        >
          <div className="relative flex flex-col justify-between gap-8 border-b border-neutral-100 px-6 py-8 md:border-b-0 md:border-r md:border-neutral-100 md:px-10 md:py-10">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-neutral-400">
                Registration
              </p>
              <h2 className="mt-3 text-balance text-[clamp(1.75rem,3.5vw,2.5rem)] font-bold leading-[1.08] tracking-[-0.02em] text-neutral-950">
                Save your spot
              </h2>
              <p className="mt-3 max-w-md text-[15px] leading-relaxed text-neutral-500">
                Free to attend.{" "}
                <span className="font-medium text-neutral-800">
                  Registration is required.
                </span>
              </p>
            </div>

            <div className="border-t border-neutral-100 pt-6">
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-neutral-400">
                General admission
              </p>
              <p className="mt-2 text-[15px] font-medium text-neutral-700">
                28 Jul – 1 Aug 2026
              </p>
              <p className="mt-0.5 text-[14px] text-neutral-500">Port Harcourt</p>
            </div>
          </div>

          <div className="flex flex-col justify-between gap-8 bg-gradient-to-br from-red-600 via-[#9b1c1c] to-black px-6 py-8 md:min-w-[240px] md:px-10 md:py-10">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/70">
                Cost
              </p>
              <p className="mt-2 text-[clamp(2.5rem,5vw,3.25rem)] font-bold leading-none text-white">
                Free
              </p>
            </div>
            <button
              type="button"
              onClick={handleRegister}
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-black/40 px-6 py-3.5 text-[15px] font-semibold text-white backdrop-blur-sm transition-[background-color,transform] duration-300 hover:scale-[1.02] hover:bg-black/55 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500/50 active:scale-[0.98]"
              aria-label="Register now for Supernatural Teens Camp"
            >
              Register Now
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path
                  d="M7 17L17 7M17 7H9M17 7V15"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        </article>
      </div>
    </section>
  );
};
