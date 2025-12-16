import React from "react";
import "./legal-page.css";
import Footer from "./Footer";
import Navbar from "./Navbar";
import { Helmet } from "react-helmet-async";


const FAQ: React.FC = () => {
  return (
    <>
    <Helmet>
        <title>Sık Sorulan Sorular | Españolize </title>
        <meta
          name="description"
          content="Españolize hakkında sık sorulan sorular: platform nedir, içerikler ücretsiz mi, hangi seviyeler için uygundur ve nasıl iletişime geçilir."
        />
        <meta name="robots" content="index, follow" />
      </Helmet>
    <Navbar/>
    <main className="legal-page">
      <h1>Sık Sorulan Sorular</h1>

      <h2>Españolize nedir?</h2>
      <p>
        Españolize , modern tekniklerle İspanyolca öğrenmenizi sağlayan bir web
        platformudur.
      </p>

      <h2>İçerikler ücretsiz mi?</h2>
      <p>
        Birçok temel içerik ücretsizdir. Premium içerikler ise ücretli olarak
        sunulabilir.
      </p>

      <h2>Hangi seviyeler için uygundur?</h2>
      <p>A1 – B2 seviyeleri arasındaki öğrenciler için uygundur.</p>

      <h2>Nasıl kelime öğrenebilirim?</h2>
      <p>
        Kelime Temaları sayfasından kategorilere ayrılmış kelimeleri
        çalışabilirsiniz.
      </p>

      <h2>İletişime nasıl geçebilirim?</h2>
      <p>
        info@espanolize.com adresi üzerinden veya iletişim sayfasından bize ulaşabilirsiniz.
      </p>
    </main>
    <Footer/>
    </>
  );
};

export default FAQ;
