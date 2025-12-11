

import Footer from "./Footer";
import HeroSection from "./HeroSection";
import Navbar from "./Navbar";
import QuickLinks from "./QuickLinks";
import HomeAboutSection from "./HomeAboutSection";
import FeatureHighlights from "./FeatureHighlights";
import VizyonMisyonSection from "./VizyonMisyonSection";



export default function HomePage() {
  return (
    <>
      <Navbar />
      <HeroSection />
      <HomeAboutSection/>
      <FeatureHighlights />
      <QuickLinks />
      <VizyonMisyonSection/>
      <Footer />
    </>
  );
}
