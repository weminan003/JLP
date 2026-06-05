import { AltrumHero } from "../components/AltrumHero";
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
