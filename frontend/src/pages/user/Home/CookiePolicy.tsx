import React from "react";
import "./legal-page.css";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { Helmet } from "react-helmet-async";

const CookiePolicy: React.FC = () => {
  return (
    <>
    <Helmet>
        <title>Çerez Politikası | Españolize </title>
        <meta
          name="description"
          content="Españolize  çerez politikası: Zorunlu, analitik ve performans çerezlerinin kullanımı ve çerez yönetimi hakkında bilgiler."
        />
        <meta name="robots" content="index, follow" />
      </Helmet>
      <Navbar />

      <main className="legal-page">
        <h1>Çerez Politikası</h1>
        <p>
          Españolize  olarak kullanıcı deneyimini geliştirmek ve platform performansını
          optimize etmek için çerezler kullanıyoruz.
        </p>

        <h2>Çerez Nedir?</h2>
        <p>Çerezler tarayıcıya kaydedilen küçük metin dosyalarıdır.</p>

        <h2>Kullandığımız Çerez Türleri</h2>
        <ul>
          <li><strong>Zorunlu Çerezler:</strong> Sitenin çalışması için gereklidir.</li>
          <li><strong>Analitik Çerezler:</strong> Kullanıcı davranışlarını analiz eder.</li>
          <li><strong>Performans Çerezleri:</strong> Hız analizleri ve iyileştirme sağlar.</li>
        </ul>

        <h2>Çerez Yönetimi</h2>
        <p>Tarayıcı ayarlarınızdan çerezleri reddedebilir veya silebilirsiniz.</p>

        <h2>İletişim</h2>
        <p>
          Sorular için: <strong>info@espanolize.com</strong>
        </p>
      </main>

      <Footer />
    </>
  );
};

export default CookiePolicy;
