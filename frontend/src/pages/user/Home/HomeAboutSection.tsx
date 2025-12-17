import "./HomeAboutSection.css";
import heroImg from "../../../assets/flamenco-yapan-kadın-ve-erkek.webp";

export default function HomeAboutSection() {
  return (
    <div className="home-about-container">
    <section
      className="home-about-wrapper"
      aria-labelledby="home-about-title"
      id="hakkimizda"
    >
      <div className="home-about-top">

        {/* Görsel */}
        <div className="home-about-image-box">
          <img
            src={heroImg}
            alt="Españolize İspanyolca öğrenme platformu hakkında görsel"
            className="home-about-main-image"
            loading="lazy"
          />
        </div>

        {/* Metin */}
        <article className="home-about-text-box">
          <h2 className="home-about-title" id="about-title">
            Españolize ile İspanyolcayı doğal akışında öğren
          </h2>

          <p className="home-about-desc">
            <strong>Españolize</strong>, İspanyolcayı günlük hayatın içinden
            öğrenmeyi kolaylaştıran modern bir <strong>İspanyolca öğrenme platformudur</strong>.
            Amacımız karmaşık gramer anlatımlarını sadeleştirmek, dili gerçek
            kullanım örnekleriyle anlaşılır hâle getirmektir.
          </p>

          <p className="home-about-desc">
            Tema bazlı <strong>kelime listeleri</strong>, günlük yaşamdan seçilmiş
            <strong> okuma metinleri</strong> ve örneklerle zenginleştirilmiş
            <strong> gramer açıklamaları</strong> ile İspanyolca, ezberden çıkıp
            anlamlandırabildiğin bir yapıya dönüşür.
          </p>

          
        </article>

      </div>
    </section>
    </div>
  );
}
