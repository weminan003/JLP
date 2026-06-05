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
  title: "Supernatural Teens Recharge Camp | JLP",
  description:
    "Five days of worship, prayer, and encounter at Supernatural Teens Recharge Camp. Free registration for teenagers aged 13–19.",
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
