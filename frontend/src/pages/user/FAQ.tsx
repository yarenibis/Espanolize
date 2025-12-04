import React from "react";
import "./legal-page.css";
import Footer from "../../components/Footer";
import Navbar from "../../components/Navbar";


const FAQ: React.FC = () => {
  return (
    <>
    <Navbar/>
    <main className="legal-page">
      <h1>Sık Sorulan Sorular</h1>

      <h2>Espanolize nedir?</h2>
      <p>
        Espanolize, modern tekniklerle İspanyolca öğrenmenizi sağlayan bir web
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
