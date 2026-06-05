"use client";

import { useState } from "react";
import { CAMP_SECTION_PX, CAMP_SECTION_PY } from "@/components/camp/campSectionSpacing";
import { useCampReveal } from "@/components/camp/useCampReveal";

type CampFaqItem = {
  id: string;
  question: string;
  answer: string;
};

const FAQ_ITEMS: CampFaqItem[] = [
  {
    id: "register",
    question: "How do I register for Supernatural Teens Recharge Camp?",
    answer:
      "Registration is free but compulsory. Use the Register Now button or visit bit.ly/TSCAMP2026 to secure your spot. You will receive confirmation with camp details and what to bring.",
  },
  {
    id: "cost",
    question: "Is there a cost to attend camp?",
    answer:
      "No. Attendance is completely free. Registration is still required so we can prepare adequately for every teenager coming.",
  },
  {
    id: "theme",
    question: "What is the camp theme for 2026?",
    answer:
      "The theme is Transformed By His Glory. Expect worship, the Word, prayer, and supernatural encounters with Jesus across five days.",
  },
  {
    id: "dates",
    question: "When is camp meeting?",
    answer:
      "Tuesday, 28 July through Saturday, 1 August 2026. Join 2000+ teens on fire for Jesus in Port Harcourt.",
  },
  {
    id: "location",
    question: "Where is the camp held?",
    answer:
      "Emarid College, Eneka/Igwuruta Road, Port Harcourt, Rivers State. Full directions are shared after you register.",
  },
  {
    id: "enquiries",
    question: "Who can I contact for enquiries?",
    answer:
      "For enquiries and donations, call 07077375842 or 07062051038.",
  },
];

export const CampFaqSection = () => {
  const { ref: revealRef, inView } = useCampReveal(0.1);
  const [openId, setOpenId] = useState<string | null>(FAQ_ITEMS[0]?.id ?? null);

  const handleToggle = (id: string) => {
    setOpenId((current) => (current === id ? null : id));
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>, id: string) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      handleToggle(id);
    }
  };

  return (
    <section
      id="details"
      aria-label="Camp frequently asked questions"
      className={`bg-black ${CAMP_SECTION_PX}`}
    >
      <div
        ref={revealRef}
        className={`mx-auto grid max-w-6xl gap-10 ${CAMP_SECTION_PY} sm:gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:gap-20`}
      >
        <div className={`camp-reveal ${inView ? "is-visible" : ""}`}>
          <p className="mb-3 text-[12px] font-medium text-neutral-500 sm:mb-4 sm:text-[13px]">Questions</p>
          <h2 className="text-balance text-[clamp(1.75rem,4.5vw,3.25rem)] font-bold leading-[1.08] tracking-[-0.02em] text-white">
            All the important details before camp{" "}
            <span className="text-neutral-500">Supernatural Teens Camp</span>
          </h2>
        </div>

        <ul className={`flex flex-col gap-2.5 camp-reveal sm:gap-3 ${inView ? "is-visible" : ""}`} style={{ transitionDelay: "0.12s" }}>
          {FAQ_ITEMS.map((item) => {
            const isOpen = openId === item.id;
            return (
              <li key={item.id}>
                <button
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={`faq-panel-${item.id}`}
                  id={`faq-trigger-${item.id}`}
                  onClick={() => handleToggle(item.id)}
                  onKeyDown={(event) => handleKeyDown(event, item.id)}
                  className="flex w-full items-center justify-between gap-3 rounded-xl bg-neutral-900/80 px-4 py-3.5 text-left transition-[background-color,transform] duration-300 hover:bg-neutral-900 hover:scale-[1.01] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30 active:scale-[0.99] sm:rounded-2xl sm:px-5 sm:py-4"
                >
                  <span className="text-[14px] font-medium leading-snug text-white sm:text-[15px] md:text-[16px]">
                    {item.question}
                  </span>
                  <span
                    aria-hidden="true"
                    className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xl text-white/70 sm:h-8 sm:w-8"
                  >
                    {isOpen ? "−" : "+"}
                  </span>
                </button>
                <div
                  id={`faq-panel-${item.id}`}
                  role="region"
                  aria-labelledby={`faq-trigger-${item.id}`}
                  hidden={!isOpen}
                  className="px-4 pb-1 pt-3 sm:px-5"
                >
                  <p className="text-[14px] leading-relaxed text-neutral-400 sm:text-[15px]">{item.answer}</p>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
};
