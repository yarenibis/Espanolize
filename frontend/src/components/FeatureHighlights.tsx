// src/components/FeatureHighlights.tsx
import "./FeatureHighlights.css";
import {
  BookOutlined,
  ReadOutlined,
  FileTextOutlined,
} from "@ant-design/icons";

export default function FeatureHighlights() {
  const features = [
    {
      icon: <BookOutlined aria-hidden="true" />,
      title: "İspanyolca Gramer Konuları",
      text: "İspanyolca gramer kurallarını adım adım, örneklerle ve sade anlatımla öğren.",
    },
    {
      icon: <ReadOutlined aria-hidden="true" />,
      title: "Tema Bazlı Kelime Listeleri",
      text: "Seyahat, günlük yaşam, iş ve daha birçok tema için hazırlanmış İspanyolca kelime listeleriyle kelime dağarcığını sistemli şekilde geliştir.",
    },
    {
      icon: <FileTextOutlined aria-hidden="true" />,
      title: "Gerçek Hayattan Okuma Metinleri",
      text: "Günlük hayattan seçilmiş İspanyolca okuma metinleriyle okuma, anlama ve kelime tekrarını aynı anda güçlendir.",
    },
  ];

  return (
    <section
      className="features-section"
      id="platform-ozellikleri"
      aria-labelledby="features-heading"
    >
      <div className="features-container">
        <h2 className="features-title" id="features-heading">
          Españolize Platform Özellikleri
        </h2>
        <p className="features-subtitle">
          Españolize, İspanyolca gramer, kelime ve okuma pratiğini{" "}
          <strong>tek bir platformda</strong> birleştirerek, online İspanyolca
          öğrenme sürecini daha hızlı, anlaşılır ve sürdürülebilir hale getirir.
        </p>

        <div className="features-grid">
          {features.map((f, index) => (
            <article className="feature-card" key={index}>
              <div className="feature-icon">{f.icon}</div>
              <h3 className="feature-title">{f.title}</h3>
              <p className="feature-text">{f.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
