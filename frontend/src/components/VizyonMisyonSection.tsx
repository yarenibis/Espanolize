// src/components/VizyonMisyonSection.tsx
import "./VizyonMisyonSection.css";
import png from "../assets/png1.png";

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
              <h3 className="vm-card-title">🎯 Vizyonumuz</h3>
              <p className="vm-card-text">
                Her seviyeden kullanıcıya modern, etkili ve kişiselleştirilmiş 
                bir İspanyolca öğrenme deneyimi sunmak.  
                Öğrenmeyi eğlenceli, ulaşılabilir ve sürdürülebilir hale getirmek.
              </p>
            </div>

            <div className="vm-card">
              <h3 className="vm-card-title">🚀 Misyonumuz</h3>
              <p className="vm-card-text">
                Kelime, gramer ve okuma içeriklerini tek bir çatı altında sunarak 
                kullanıcıların kısa sürede gerçek bir gelişim sağlamasına yardımcı olmak.  
                Yapay zekâ destekli öğrenme araçlarıyla süreci hızlandırmak.
              </p>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
