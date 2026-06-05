"use client";

import Image from "next/image";
import { useEffect, useState, type RefObject } from "react";

type NavItem = {
  label: string;
  href: string;
};

const HOME_NAV: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "About", href: "/#about" },
  { label: "Gatherings", href: "/#gatherings" },
  { label: "Mission", href: "/#mission" },
];

const CAMP_NAV: NavItem[] = [
  { label: "Experience", href: "#experience" },
  { label: "Speakers", href: "#speakers" },
  { label: "Details", href: "#event-details" },
  { label: "Register", href: "#register" },
];

type SiteHeaderProps = {
  variant: "home" | "camp";
  navJLPRef?: RefObject<HTMLSpanElement | null>;
  navTextOpacity?: number;
};

export const SiteHeader = ({
  variant,
  navJLPRef,
  navTextOpacity = 0,
}: SiteHeaderProps) => {
  const [isIsland, setIsIsland] = useState(false);
  const navItems = variant === "camp" ? CAMP_NAV : HOME_NAV;
  const ctaHref = variant === "camp" ? "https://bit.ly/TSCAMP2026" : "/programs/supernatural-teens-camp";
  const ctaTarget = variant === "camp" ? "_blank" : undefined;
  const ctaRel = variant === "camp" ? "noopener noreferrer" : undefined;
  const ctaLabel = variant === "camp" ? "Register" : "Camp";

  useEffect(() => {
    const sentinel = document.getElementById("hero-scroll-sentinel");
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIsland(!entry.isIntersecting);
      },
      { threshold: 0, rootMargin: "-8% 0px 0px 0px" },
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, []);

  if (isIsland) {
    return (
      <header className="pointer-events-none fixed inset-x-0 top-0 z-50 pt-5">
        <nav
          aria-label={variant === "camp" ? "Camp navigation" : "Primary"}
          className="pointer-events-auto mx-auto flex w-[min(920px,calc(100%-2rem))] items-center justify-between gap-3 rounded-full border border-neutral-200/80 bg-white/92 px-3 py-2 shadow-[0_8px_32px_rgba(0,0,0,0.08)] backdrop-blur-md sm:px-4"
        >
          <a
            href="/"
            aria-label="JLP home"
            className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400"
          >
            <Image src="/jlp-icon.png" alt="" width={36} height={36} className="h-9 w-9 object-cover" />
          </a>

          <ul className="hidden items-center gap-1 sm:flex">
            {navItems.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className="rounded-full px-3 py-1.5 text-[13px] font-medium text-neutral-600 transition-colors hover:bg-neutral-100 hover:text-neutral-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>

          <a
            href={ctaHref}
            target={ctaTarget}
            rel={ctaRel}
            className="rounded-full bg-neutral-950 px-4 py-2 text-[13px] font-semibold text-white transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400"
          >
            {ctaLabel}
          </a>
        </nav>
      </header>
    );
  }

  const isCampExpanded = variant === "camp";
  const linkClass = isCampExpanded
    ? "text-neutral-600 hover:text-neutral-950 focus-visible:ring-neutral-400"
    : "text-white/80 hover:text-white focus-visible:ring-white/40";
  const underlineClass = isCampExpanded ? "bg-neutral-400" : "bg-white/60";
  const brandClass = isCampExpanded
    ? "text-neutral-900 hover:text-neutral-950 focus-visible:ring-neutral-400"
    : "text-white/90 hover:text-white focus-visible:ring-white/40";
  const ctaExpandedClass = isCampExpanded
    ? "border-neutral-200 bg-neutral-950 text-white hover:bg-neutral-800 focus-visible:ring-neutral-400"
    : "border-white/25 bg-white/10 text-white backdrop-blur-sm hover:bg-white/20 focus-visible:ring-white/40";
  const menuClass = isCampExpanded
    ? "text-neutral-700 hover:text-neutral-950 focus-visible:ring-neutral-400"
    : "text-white/80 hover:text-white focus-visible:ring-white/40";

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div className="flex w-full items-center justify-between px-6 pt-7 sm:px-10 lg:px-14">
        <a
          href="/"
          aria-label="JLP home"
          className={`group inline-flex items-center gap-3 rounded-md text-sm font-semibold tracking-wide transition-colors focus-visible:outline-none focus-visible:ring-2 ${brandClass}`}
        >
          <Image
            src="/jlp-icon.png"
            alt="JLP icon"
            width={34}
            height={34}
            className="rounded-full"
          />
          {variant === "home" && navJLPRef ? (
            <span
              ref={navJLPRef}
              className="text-[15px] font-bold tracking-widest"
              style={{ opacity: navTextOpacity }}
              aria-hidden={navTextOpacity < 0.05}
            >
              JLP
            </span>
          ) : (
            <span
              className={`text-[15px] font-bold tracking-widest ${isCampExpanded ? "text-neutral-900" : "text-white"}`}
            >
              JLP
            </span>
          )}
        </a>

        <nav
          aria-label={variant === "camp" ? "Camp navigation" : "Primary"}
          className={`hidden items-center gap-8 text-[13px] tracking-wide md:flex lg:gap-10 ${linkClass}`}
        >
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className={`group relative rounded-md px-1 py-2 font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 ${linkClass}`}
            >
              {item.label}
              <span
                className={`absolute inset-x-1 -bottom-0.5 h-px origin-left scale-x-0 transition-transform duration-300 group-hover:scale-x-100 ${underlineClass}`}
              />
            </a>
          ))}
        </nav>

        <a
          href={ctaHref}
          target={ctaTarget}
          rel={ctaRel}
          className={`rounded-full border px-4 py-2 text-[13px] font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 md:hidden ${ctaExpandedClass}`}
        >
          {ctaLabel}
        </a>

        <button
          type="button"
          aria-label="Open menu"
          className={`group inline-flex items-center justify-center rounded-md p-2 transition-colors focus-visible:outline-none focus-visible:ring-2 ${menuClass}`}
        >
          <span className="sr-only">Menu</span>
          <span className="relative block h-3 w-7">
            <span className="absolute left-0 top-0 h-px w-full bg-current transition-transform duration-300 group-hover:translate-y-[1px]" />
            <span className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-current transition-transform duration-300 group-hover:scale-x-90" />
            <span className="absolute left-0 bottom-0 h-px w-full bg-current transition-transform duration-300 group-hover:-translate-y-[1px]" />
          </span>
        </button>
      </div>
    </header>
  );
};
