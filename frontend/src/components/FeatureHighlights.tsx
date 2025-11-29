// src/components/FeatureHighlights.tsx
import "./FeatureHighlights.css";
import {
  BookOutlined,
  ReadOutlined,
  FileTextOutlined,
  SoundOutlined,
  SmileOutlined,
} from "@ant-design/icons";

export default function FeatureHighlights() {
  const features = [
    {
      icon: <BookOutlined />,
      title: "Gramer Konuları",
      text: "İspanyolca gramerini adım adım, anlaşılır bir şekilde öğren.",
    },
    {
      icon: <ReadOutlined />,
      title: "Kelime Temaları",
      text: "Temalara ayrılmış kelime listeleri ile hızlı kelime gelişimi.",
    },
    {
      icon: <FileTextOutlined />,
      title: "Okuma Metinleri",
      text: "Gerçek hayattan alınmış okuma parçaları ile anlam geliştirme.",
    },
    
  ];

  return (
    <section className="features-section">
      <div className="features-container">
        <h2 className="features-title">Platform Özellikleri</h2>
        <p className="features-subtitle">
          İspanyolca öğrenimini daha hızlı, kolay ve eğlenceli hale getiren araçlar.
        </p>

        <div className="features-grid">
          {features.map((f, index) => (
            <div className="feature-card" key={index}>
              <div className="feature-icon">{f.icon}</div>
              <h3 className="feature-title">{f.title}</h3>
              <p className="feature-text">{f.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
