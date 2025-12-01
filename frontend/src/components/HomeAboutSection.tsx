import "./HomeAboutSection.css";
import heroImg from "../assets/Andalusian Dreams_ Discover the Grandeur of Plaza de España in Seville, Spain.jpg";

export default function HomeAboutSection() {
  return (
    <div className="about-container">
    <section
      className="about-wrapper"
      aria-labelledby="about-title"
      id="hakkimizda"
    >
      <div className="about-top">

        {/* Görsel */}
        <div className="about-image-box">
          <img
            src={heroImg}
            alt="Espanolize İspanyolca öğrenme platformu hakkında görsel"
            className="about-main-image"
            loading="lazy"
          />
        </div>

        {/* Metin */}
        <article className="about-text-box">
          <h2 className="about-title" id="about-title">
            Españolize ile İspanyolcayı doğal akışında öğren
          </h2>

          <p className="about-desc">
            <strong>Españolize</strong>, İspanyolcayı günlük hayatın içinden
            öğrenmeyi kolaylaştıran modern bir <strong>İspanyolca öğrenme platformudur</strong>.
            Amacımız karmaşık gramer anlatımlarını sadeleştirmek, dili gerçek
            kullanım örnekleriyle anlaşılır hâle getirmektir.
          </p>

          <p className="about-desc">
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
