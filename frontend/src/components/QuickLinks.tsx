import { Link } from "react-router-dom";
import "./QuickLinks.css";

interface QuickLink {
  to: string;
  icon: string;
  title: string;
  description: string;
  gradient: string;
  stats?: string;
  badge?: string;
}

export default function QuickLinks() {
  const quickLinks: QuickLink[] = [
    {
      to: "/konular",
      icon: "📚",
      title: "Gramer Konuları",
      description: "İspanyolca dil bilgisi konularını seviyelerine göre keşfedin",
      gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      badge: "Yeni"
    },
    {
      to: "/kelimetemalari",
      icon: "🔤",
      title: "Kelime Temaları",
      description: "Tematik kelime listeleri ile kelime dağarcığınızı geliştirin",
      gradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
      badge: "Popüler"
    },
    {
      to: "/metinTema",
      icon: "📖",
      title: "Okuma Metinleri",
      description: "Farklı seviyelerde okuma parçaları ve anlama alıştırmaları",
      gradient: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
      badge: "Etkileşimli"
    }
  ];

  return (
    <section className="quick-links-section">
      <div className="container">
        <div className="section-header">
          <p className="section-subtitle">
            İspanyolca öğrenme yolculuğunuzda ihtiyacınız olan tüm kaynaklar bir tık uzağınızda
          </p>
        </div>
        
        <div className="quick-grid">
          {quickLinks.map((link, index) => (
            <Link 
              key={link.to} 
              to={link.to} 
              className="quick-card"
              style={{ '--card-gradient': link.gradient } as React.CSSProperties}
              data-aos="fade-up"
              data-aos-delay={index * 150}
            >
              {/* Card Badge */}
              {link.badge && (
                <div className="card-badge">
                  {link.badge}
                </div>
              )}
              
              {/* Card Icon */}
              <div className="card-icon-wrapper">
                <div className="card-icon">
                  <span className="icon">{link.icon}</span>
                </div>
                <div className="icon-glow"></div>
              </div>

              {/* Card Content */}
              <div className="card-content">
                <h3 className="card-title">{link.title}</h3>
                <p className="card-description">{link.description}</p>
                
                {/* Card Stats */}
                {link.stats && (
                  <div className="card-stats">
                    <span className="stats-text">{link.stats}</span>
                  </div>
                )}
              </div>

              {/* Card Footer */}
              <div className="card-footer">
                <div className="card-arrow">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path 
                      d="M5 12H19M19 12L12 5M19 12L12 19" 
                      stroke="currentColor" 
                      strokeWidth="2" 
                      strokeLinecap="round" 
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <span className="explore-text">Keşfet</span>
              </div>

              {/* Background Elements */}
              <div className="card-bg-elements">
                <div className="bg-circle-1"></div>
                <div className="bg-circle-2"></div>
              </div>
            </Link>
          ))}
        </div>

        {/* Section Footer */}
        <div className="section-footer">
          <p className="footer-text">
            Tüm içerikler alanında uzman eğitmenler tarafından hazırlanmıştır
          </p>
        </div>
      </div>
    </section>
  );
}