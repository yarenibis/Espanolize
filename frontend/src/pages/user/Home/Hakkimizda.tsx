// src/pages/user/Hakkimizda.tsx
import React from "react";
import "./Hakkimizda.css";
import Navbar from "./Navbar";
import Footer from "./Footer";

const Hakkimizda: React.FC = () => {
  return (
    <>
      <Navbar />

      <main className="about-container">
        <section className="about-hero">
          <h1>Hakkımızda</h1>
          <p className="about-hero-text">
            Espanolize, İspanyolca öğrenmeyi herkes için erişilebilir, eğlenceli
            ve etkili hale getirmek amacıyla oluşturulmuş modern bir dil
            öğrenme platformudur. Amacımız; öğrencilerin, gezginlerin ve
            profesyonellerin İspanyolca’yı sistemli, kolay anlaşılır ve pratik
            bir şekilde öğrenmelerini sağlamaktır.
          </p>
        </section>

        <section className="about-grid">
          <div className="about-card">
            <h2>Ne Sunuyoruz?</h2>
            <p>
              Platformumuzda bulunan detaylı konu anlatımları, örnek cümleler,
              kelime temaları, metinler ve alıştırmalar; öğrenme sürecini
              destekleyen bütünsel bir eğitim yaklaşımı sunar. İçerikler,
              öğrencilerin seviyesine uygun, sade ve anlaşılır bir dille
              hazırlanır.
            </p>
            <ul className="about-list">
              <li>Temel ve ileri seviye konu anlatımları</li>
              <li>Gerçek hayattan alınmış örnek cümleler</li>
              <li>Temalarla gruplanmış kelime listeleri</li>
              <li>Okuma parçaları ve metin temaları</li>
              <li>Kalıcı öğrenmeyi destekleyen alıştırmalar</li>
            </ul>
          </div>

          <div className="about-card">
            <h2>Vizyonumuz</h2>
            <p>
              Teknolojiyi ve modern eğitim tekniklerini kullanarak, kullanıcıların
              İspanyolca öğrenirken daha az zamanda daha fazla ilerleme
              kaydetmelerini, dili doğal bir şekilde içselleştirmelerini ve
              günlük hayatta ve profesyonel yaşamda rahatça kullanabilecekleri
              bir seviyeye ulaşmalarını sağlamak.
            </p>

            <h2>Misyonumuz</h2>
            <p>
              Her seviyeden kullanıcıya açık, anlaşılır ve kaliteli içerik
              sunmak; öğrenmeyi kolaylaştıran güvenli bir platform sağlamak ve
              sürekli güncellenen kaynaklarla sürdürülebilir bir öğrenme
              deneyimi oluşturmak.
            </p>
          </div>
        </section>

        <section className="about-extra">
          <div className="about-card">
            <h2>Neden Espanolize?</h2>
            <p>
              Espanolize, İspanyolcayı gerçekten öğrenmek isteyen kullanıcılar
              için sade, odaklı ve güvenilir bir öğrenme ortamı sunar.
            </p>
            <ul className="about-list">
              <li>Kullanıcı dostu ve sade arayüz</li>
              <li>Özenle seçilmiş örnekler ve açıklamalar</li>
              <li>Sürekli güncellenen içerik yapısı</li>
              <li>Motivasyonu artıran adım adım ilerleme</li>
            </ul>
          </div>

          <div className="about-card about-contact-info">
            <h2>Bizimle İletişime Geçin</h2>
            <p>
              Geri bildirimleriniz, önerileriniz veya sorularınız için
              iletişim sayfamızı kullanabilirsiniz. Size yardımcı olmaktan
              memnuniyet duyarız.
            </p>
            <a href="/iletisim" className="about-contact-link">
              İletişim Sayfasına Git
            </a>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
};

export default Hakkimizda;
