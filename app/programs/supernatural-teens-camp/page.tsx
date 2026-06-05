import type { Metadata } from "next";
import { CampDetailsSection } from "@/components/camp/CampDetailsSection";
import { CampFaqSection } from "@/components/camp/CampFaqSection";
import { CampHeroSection } from "@/components/camp/CampHeroSection";
import { SiteHeader } from "@/components/SiteHeader";
import { CampRegistrationSection } from "@/components/camp/CampRegistrationSection";
import { CampSpeakersSection } from "@/components/camp/CampSpeakersSection";
import { CampTestimonialsSection } from "@/components/camp/CampTestimonialsSection";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "Supernatural Teens Recharge Camp",
  description:
    "Five days away from distractions, deep in the presence of God. Worship, prayer, the Word and fire — Supernatural Teens Recharge Camp, 28 Jul–1 Aug 2026. Free registration for teenagers aged 13–19.",
  openGraph: {
    title: "Supernatural Teens Recharge Camp | JLP Ministries",
    description:
      "Five days of immersive encounters, worship and transformation. Free camp for teens aged 13–19. 28 Jul–1 Aug 2026.",
    url: "https://jlpministries.com/programs/supernatural-teens-camp",
  },
};

export default function SupernaturalTeensCampPage() {
  return (
    <>
      <SiteHeader variant="camp" />
      <main className="flex flex-col bg-white">
        <CampHeroSection />
        <CampDetailsSection />
        <CampSpeakersSection />
        <CampFaqSection />
        <CampTestimonialsSection />
        <CampRegistrationSection />
      </main>
      <Footer />
    </>
  );
}
