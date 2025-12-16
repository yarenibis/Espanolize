

import Footer from "./Footer";
import HeroSection from "./HeroSection";
import Navbar from "./Navbar";
import QuickLinks from "./QuickLinks";
import HomeAboutSection from "./HomeAboutSection";
import FeatureHighlights from "./FeatureHighlights";
import VizyonMisyonSection from "./VizyonMisyonSection";
import { Helmet } from "react-helmet-async";



export default function HomePage() {
  return (
    <>
    <Helmet>
        <title>
          Españolize | İspanyolca Öğrenmenin En Kolay Yolu
        </title>

        <meta
          name="description"
          content="Españolize ile İspanyolca öğrenmeye hemen başlayın. Konu anlatımları, kelime temaları, okuma metinleri ve alıştırmalarla A1–B2 seviyelerinde etkili öğrenme."
        />

        <meta
          name="keywords"
          content="İspanyolca öğren, online İspanyolca, İspanyolca gramer, kelime öğrenme, İspanyolca A1, Españolize"
        />

        {/* Open Graph */}
        <meta property="og:title" content="Españolize | İspanyolca Öğrenmenin En Kolay Yolu" />
        <meta
          property="og:description"
          content="Modern, sade ve etkili yöntemlerle İspanyolca öğren. A1–B2 seviyelerine uygun içerikler."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.espanolize.com/" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Españolize | İspanyolca Öğren" />
        <meta
          name="twitter:description"
          content="İspanyolca öğrenmek artık çok daha kolay. Españolize ile hemen başla."
        />
      </Helmet>
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
