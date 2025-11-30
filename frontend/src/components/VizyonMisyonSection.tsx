// src/components/VizyonMisyonSection.tsx
import "./VizyonMisyonSection.css";
import png from "../assets/png4.png";

export default function VizyonMisyonSection() {
  return (
    <section className="vm-section">
      <div className="vm-container">

        {/* PNG koymak için dekoratif köşeler */}
        <img 
          src={png}
          alt="decor" 
          className="vm-img vm-left"
        />

        <img 
          src={png}
          alt="decor" 
          className="vm-img vm-right"
        />

        {/* Metin alanı */}
        <div className="vm-content">
          <h2 className="vm-title">Vizyon & Misyonumuz</h2>

          <div className="vm-cards">
            
            <div className="vm-card">
              <h3 className="vm-card-title"> Vizyonumuz</h3>
              <p className="vm-card-text">
                Global ölçekte, İspanyolca öğrenmek isteyen herkesin başvurduğu, yalın ve etkili içerikleriyle öne çıkan bir dijital öğrenme platformu olmak.
              </p>
            </div>

            <div className="vm-card">
              <h3 className="vm-card-title"> Misyonumuz</h3>
              <p className="vm-card-text">
                İspanyolcayı herkes için ulaşılabilir, anlaşılır ve günlük hayatla iç içe bir öğrenme deneyimi hâline getirmek.
              </p>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
