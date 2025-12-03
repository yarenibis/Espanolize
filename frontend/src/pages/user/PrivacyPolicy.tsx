import React from "react";
import "./legal-page.css";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";


const PrivacyPolicy: React.FC = () => {
  return (
    <>
    <Navbar/>
    <main className="legal-page">
      <h1>Gizlilik Politikası</h1>
      <p>
        Espanolize olarak kişisel verilerinizi korumayı önemsiyoruz. Bu
        Gizlilik Politikası, platformumuzu kullanırken hangi bilgilerin
        toplandığını, nasıl kullanıldığını ve nasıl korunduğunu açıklamaktadır.
      </p>

      <h2>Toplanan Bilgiler</h2>
      <ul>
        <li>Ad, soyad, e-posta adresi gibi iletişim bilgileri</li>
        <li>Kullanım verileri (sayfa ziyaretleri, tıklamalar, ilerleme bilgileri)</li>
        <li>Çerez ve analiz verileri</li>
      </ul>

      <h2>Verilerin Kullanımı</h2>
      <p>Toplanan veriler şu amaçlarla kullanılabilir:</p>
      <ul>
        <li>Hizmet kalitesini artırmak</li>
        <li>Kişiselleştirilmiş içerikler sunmak</li>
        <li>Güvenlik ve kötüye kullanım tespiti</li>
      </ul>

      <h2>Çerezler</h2>
      <p>
        Platformumuz kullanıcı deneyimini geliştirmek için çerezler kullanır.
        Detaylı bilgi için Çerez Politikamızı inceleyebilirsiniz.
      </p>

      <h2>Veri Güvenliği</h2>
      <p>Kişisel verileriniz üçüncü taraflarla paylaşılmaz ve güvenle saklanır.</p>

      <h2>İletişim</h2>
      <p>
        Gizlilik soruları için:{" "}
        <strong>info@espanolize.com</strong>
      </p>
    </main>
    <Footer/>
    </>
  );
};

export default PrivacyPolicy;
