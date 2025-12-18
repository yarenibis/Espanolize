import React from "react";
import "./LegalPage.css";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { Helmet } from "react-helmet-async";


const Terms: React.FC = () => {
  return (
     <>
     <Helmet>
        <title>Kullanım Koşulları | Españolize</title>
        <meta
          name="description"
          content="Españolize kullanım koşulları: hizmet tanımı, kullanıcı yükümlülükleri, telif hakları ve sorumluluk reddi bilgileri."
        />
        <meta name="robots" content="index, follow" />
      </Helmet>
     <Navbar/>
    <main className="legal-page">
      <h1>Kullanım Koşulları</h1>
      <p>
        Españolize platformunu kullanarak aşağıdaki şartları kabul etmiş
        olursunuz.
      </p>

      <h2>Hizmet Tanımı</h2>
      <p>
        Españolize; İspanyolca gramer, kelime temaları, alıştırmalar ve okuma
        içerikleri sunan dijital bir öğrenme platformudur.
      </p>

      <h2>Kullanıcı Yükümlülükleri</h2>
      <ul>
        <li>Platformu kötüye kullanmamak</li>
        <li>Telif haklarına saygı göstermek</li>
        <li>Doğru bilgi sağlamak</li>
      </ul>

      <h2>Telif Hakları</h2>
      <p>
        Sitedeki tüm içerikler Espanolize’e aittir. İzinsiz kullanılamaz veya
        kopyalanamaz.
      </p>

      <h2>Hesap Güvenliği</h2>
      <p>Kullanıcı hesap bilgilerinin gizliliğinden kendisi sorumludur.</p>

      <h2>Sorumluluk Reddi</h2>
      <p>
        Sunulan eğitim içerikleri bilgi amaçlıdır. Kesin sonuç garantisi
        verilmez.
      </p>

      <h2>Değişiklikler</h2>
      <p>
        Españolize, kullanım koşullarını güncelleme hakkını saklı tutar.
      </p>

    </main>
    <Footer/>
    </>
  );
};

export default Terms;
