
import { Footer } from "antd/es/layout/layout";
import HeroSection from "../../components/HeroSection";
import Navbar from "../../components/Navbar";
import QuickLinks from "../../components/QuickLinks";



export default function HomePage() {
  return (
    <>
      <Navbar />
      <HeroSection />
      <QuickLinks />
      <Footer />
    </>
  );
}
