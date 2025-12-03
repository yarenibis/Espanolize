import React from "react";
import "./legal-page.css";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";


const Terms: React.FC = () => {
  return (
     <>
     <Navbar/>
    <main className="legal-page">
      <h1>Kullanım Koşulları</h1>
      <p>
        Espanolize platformunu kullanarak aşağıdaki şartları kabul etmiş
        olursunuz.
      </p>

      <h2>Hizmet Tanımı</h2>
      <p>
        Espanolize; İspanyolca gramer, kelime temaları, alıştırmalar ve okuma
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
        Espanolize, kullanım koşullarını güncelleme hakkını saklı tutar.
      </p>

    </main>
    <Footer/>
    </>
  );
};

export default Terms;
