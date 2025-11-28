

import Footer from "../../components/Footer";
import HeroSection from "../../components/HeroSection";
import Navbar from "../../components/Navbar";
import QuickLinks from "../../components/QuickLinks";
import HomeAboutSection from "../../components/HomeAboutSection";



export default function HomePage() {
  return (
    <>
      <Navbar />
      <HeroSection />
      <HomeAboutSection/>
      <QuickLinks />
      <Footer />
    </>
  );
}
