import { Link } from "react-router-dom";
import "./QuickLinks.css";

export default function QuickLinks() {
  const quickLinks = [
    {
      to: "/gramerkurallar",
      icon: "📚",
      title: "Gramer Kuralları",
      description: "İspanyolca dil bilgisi kurallarını interaktif şekilde öğrenin",
      color: "#667eea"
    },
    {
      to: "/kelimetemalari",
      icon: "🔤",
      title: "Kelime Öğren",
      description: "Tematik kelime listeleri ve öğrenme araçları",
      color: "#764ba2"
    },
    {
      to: "/metinTema",
      icon: "📖",
      title: "Okuma Metinleri",
      description: "Farklı seviyelerde okuma parçaları ve alıştırmalar",
      color: "#f093fb"
    }
  ];

  return (
    <section className="quick-links-section">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">Hızlı Erişim</h2>
          <p className="section-subtitle">İhtiyacınız olan içeriğe hızlıca ulaşın</p>
        </div>
        
        <div className="quick-grid">
          {quickLinks.map((link, index) => (
            <Link 
              key={link.to} 
              to={link.to} 
              className="quick-card"
              style={{ '--card-color': link.color } as React.CSSProperties}
              data-aos="fade-up"
              data-aos-delay={index * 100}
            >
              <div className="card-icon" style={{ backgroundColor: `${link.color}15` }}>
                <span className="icon">{link.icon}</span>
              </div>
              <h3 className="card-title">{link.title}</h3>
              <p className="card-description">{link.description}</p>
              <div className="card-arrow">
                <span>→</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}