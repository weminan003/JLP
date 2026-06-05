import type { Metadata } from "next";
import { AltrumHero } from "../components/AltrumHero";

export const metadata: Metadata = {
  title: "Jesus Love and Power Ministries",
  description:
    "Jesus Love and Power Ministries — a generation of teenagers on fire for Jesus. Join us for Supernatural Teens Recharge, monthly worship, prayer and encounter across Nigeria.",
  openGraph: {
    title: "Jesus Love and Power Ministries",
    description:
      "A generation on fire for Jesus. Monthly worship, prayer and encounter for teenagers across Nigeria.",
    url: "https://jlpministries.com",
  },
};
import { FeaturedWorksSection } from "../components/FeaturedWorksSection";
import { Footer } from "../components/Footer";
import { ForYouSection } from "../components/ForYouSection";
import { MinistryVideoSection } from "../components/MinistryVideoSection";
import { ProgramsSection } from "../components/ProgramsSection";
import { ScriptureMomentSection } from "../components/ScriptureMomentSection";
import { StickyScrollSection } from "../components/StickyScrollSection";

export default function Home() {
  return (
    <>
      <AltrumHero />
      {/*
       * Curtain effect: this wrapper starts 100vh before the hero section ends,
       * so it slides up OVER the pinned hero like a curtain being drawn.
       * z-10 ensures it paints on top of the hero's z-0 sticky layer.
       */}
      <div className="relative z-10 -mt-[100vh] shadow-[0_-32px_80px_rgba(0,0,0,0.7)]">
        <StickyScrollSection />
        <ForYouSection />
        <ProgramsSection />
        <ScriptureMomentSection />
        <FeaturedWorksSection />
        <MinistryVideoSection />
        <Footer />
      </div>
    </>
  );
}
