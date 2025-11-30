import "./HomeAboutSection.css";
import { ArrowRightOutlined } from "@ant-design/icons";
import heroImg from "../assets/Andalusian Dreams_ Discover the Grandeur of Plaza de España in Seville, Spain.jpg";

export default function HomeAboutSection() {
  return (
    <div className="about-wrapper">

      {/* ---- LEFT IMAGE + TEXT ---- */}
      <div className="about-top">
        <div className="about-image-box">
          <img
            src={heroImg}
            alt="About"
            className="about-main-image"
          />
        </div>

        <div className="about-text-box">
          <h2 className="about-title">We simplify Spanish with real-life learning</h2>
          <p className="about-desc">
            Günlük hayattan seçilmiş metinler, sade anlatım ve kolay anlaşılır yapısıyla Espanolize, İspanyolcayı doğal akışında öğrenmeni sağlar.
Karmaşıklıktan uzak, tamamen ihtiyaçlarına göre hazırlanmış içeriklerle hızlı ve kalıcı bir öğrenme deneyimi sunuyoruz. 
“Bir dili gerçekten anlamanın yolu, onu günlük yaşamın içinden öğrenmekten geçer.
Espanolize, herkes için erişilebilir ve etkili bir öğrenme yaklaşımı sunar.”
          </p>

          

          
        </div>
      </div>

      
    </div>
  );
}
