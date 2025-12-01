// src/components/VizyonMisyonSection.tsx
import "./VizyonMisyonSection.css";
import png from "../assets/png4.png";

export default function VizyonMisyonSection() {
  return (
    <section 
      className="vm-section"
      aria-labelledby="vizyon-misyon-baslik"
    >
      <div className="vm-container">

        {/* Dekoratif PNG – SEO için gizlendi */}
        <img
          src={png}
          alt=""
          aria-hidden="true"
          className="vm-img vm-left"
        />

        <img
          src={png}
          alt=""
          aria-hidden="true"
          className="vm-img vm-right"
        />

        <div className="vm-content">
          {/* Ana Section Başlığı – SEO H2 */}
          <h2 id="vizyon-misyon-baslik" className="vm-title">
            Vizyon & Misyonumuz
          </h2>

          {/* Kartlar */}
          <div className="vm-cards">

            {/* Vizyon Kartı */}
            <article className="vm-card">
              <h3 className="vm-card-title">Vizyonumuz</h3>
              <p className="vm-card-text">
                Global ölçekte, İspanyolca öğrenmek isteyen herkesin tercih ettiği,
                sade, modern ve etkili içerikleriyle öne çıkan bir dijital öğrenme
                platformu olmak.
              </p>
            </article>

            {/* Misyon Kartı */}
            <article className="vm-card">
              <h3 className="vm-card-title">Misyonumuz</h3>
              <p className="vm-card-text">
                İspanyolcayı herkes için ulaşılabilir, anlaşılır ve günlük yaşamın
                doğal akışıyla uyumlu bir öğrenme deneyimine dönüştürmek; öğrenmeyi
                kolaylaştıran içerikler sunmak.
              </p>
            </article>

          </div>
        </div>

      </div>
    </section>
  );
}
