"use client";

import Image from "next/image";
import { useCallback } from "react";

/** ─── Types ─────────────────────────────────────────────────────────────── */
type FooterLink = {
  label: string;
  href: string;
};

type SocialLink = {
  label: string;
  href: string;
  icon: React.ReactNode;
};

/** ─── Data ──────────────────────────────────────────────────────────────── */
const NAV_LINKS: FooterLink[] = [
  { label: "Home", href: "/" },
  { label: "About", href: "/#about" },
  { label: "Gatherings", href: "/#gatherings" },
  { label: "Mission", href: "/#mission" },
  { label: "Contact", href: "/#contact" },
];

const PROGRAM_LINKS: FooterLink[] = [
  { label: "Supernatural Teens Recharge", href: "/#gatherings" },
  {
    label: "Supernatural Teens Recharge Camp",
    href: "/programs/supernatural-teens-camp",
  },
  { label: "Testimonies", href: "/#testimonies" },
];

/** ─── Social icons (inline SVG — no extra dependency) ───────────────────── */
const InstagramIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none" />
  </svg>
);

const YoutubeIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.96-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" />
    <polygon fill="currentColor" stroke="none" points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" />
  </svg>
);

const FacebookIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

const SOCIAL_LINKS: SocialLink[] = [
  {
    label: "Instagram",
    href: "https://www.instagram.com/jlpglobalnetwork/",
    icon: <InstagramIcon />,
  },
  {
    label: "YouTube",
    href: "https://www.youtube.com/@jlpglobalnetwork",
    icon: <YoutubeIcon />,
  },
  {
    label: "Facebook",
    href: "https://www.facebook.com/jlpglobalnetwork",
    icon: <FacebookIcon />,
  },
];

const ScrollTopIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M12 19V5" />
    <path d="M5 12l7-7 7 7" />
  </svg>
);

/** ─── Component ─────────────────────────────────────────────────────────── */
export const Footer = () => {
  const currentYear = 2026;

  const handleScrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const handleScrollToTopKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLButtonElement>) => {
      if (event.key !== "Enter" && event.key !== " ") return;
      event.preventDefault();
      handleScrollToTop();
    },
    [handleScrollToTop],
  );

  return (
    <footer
      className="relative bg-black text-white"
      aria-label="Site footer"
    >
      <div className="mx-auto max-w-screen-xl px-5 pb-12 pt-14 sm:px-12 sm:pb-14 sm:pt-16 lg:px-16">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-24">
          {/* Brand + mission */}
          <div className="flex flex-col gap-6">
            <a
              href="/"
              aria-label="Jesus Love and Power Ministries home"
              className="group inline-flex w-fit items-center gap-4 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500/50"
            >
              <Image
                src="/jlp-icon.png"
                alt="JLP icon"
                width={44}
                height={44}
                className="rounded-full"
              />
              <span className="text-[clamp(1.5rem,4vw,2rem)] font-black uppercase tracking-[0.06em] text-red-500 transition-colors group-hover:text-red-400">
                JLP
              </span>
            </a>

            <p className="max-w-md font-mono text-[12px] leading-[1.85] text-white/50 sm:text-[13px]">
              Jesus Love and Power Ministries exists to gather and equip a
              generation of teens who know His love, walk in His power, and carry
              revival into their schools, homes, and nations.
            </p>
          </div>

          {/* Follow + links */}
          <div className="flex flex-col gap-8 lg:items-end">
            <div className="flex flex-col gap-5 lg:items-end">
              <span className="inline-flex w-fit bg-red-600 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.2em] text-white">
                Follow us
              </span>

              <div className="flex items-center gap-3">
                {SOCIAL_LINKS.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`JLP on ${social.label}`}
                    tabIndex={0}
                    className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-black transition-transform duration-200 hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500/60"
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-8 border-t border-white/10 pt-8 sm:max-w-md sm:gap-10 lg:ml-auto">
              <div>
                <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/30">
                  Pages
                </p>
                <ul className="flex flex-col gap-3" role="list">
                  {NAV_LINKS.map((link) => (
                    <li key={link.label}>
                      <a
                        href={link.href}
                        className="text-[13px] text-white/50 transition-colors hover:text-red-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500/40"
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/30">
                  Programs
                </p>
                <ul className="flex flex-col gap-3" role="list">
                  {PROGRAM_LINKS.map((link) => (
                    <li key={link.label}>
                      <a
                        href={link.href}
                        className="text-[13px] leading-snug text-white/50 transition-colors hover:text-red-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500/40"
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/[0.08]">
        <div className="mx-auto flex max-w-screen-xl flex-col gap-4 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-12 sm:py-6 lg:px-16">
          <p className="text-[11px] tracking-wide text-white/35">
            © {currentYear} Jesus Love and Power Ministries. All rights reserved.
          </p>

          <div className="flex flex-wrap items-center gap-4 sm:gap-6">
            <div className="flex items-center gap-3 text-[11px]">
              <a
                href="/#contact"
                className="text-red-500/90 transition-colors hover:text-red-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500/40"
              >
                Terms of Use
              </a>
              <span className="text-white/20" aria-hidden="true">
                |
              </span>
              <a
                href="/#contact"
                className="text-red-500/90 transition-colors hover:text-red-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500/40"
              >
                Privacy Policy
              </a>
            </div>

            <button
              type="button"
              onClick={handleScrollToTop}
              onKeyDown={handleScrollToTopKeyDown}
              aria-label="Scroll to top of page"
              tabIndex={0}
              className="flex h-9 w-9 items-center justify-center border border-white/15 bg-white/[0.04] text-white/70 transition-colors hover:border-red-500/40 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500/50"
            >
              <ScrollTopIcon />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
