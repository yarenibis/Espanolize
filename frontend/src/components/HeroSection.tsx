import React from 'react';
import { Link } from 'react-router-dom';
import "./HeroSection.css";
import heroImg from "../assets/Learning-cuate.svg";

export default function HeroSection() {
  return (
    <section className="hero-section">
      <div className="hero-container">
        <div className="hero-content">
          {/* Text Content */}
          <div className="hero-text-content">
            <div className="hero-badge">
              <span className="badge-icon">🎯</span>
              <span>Modern Dil Öğrenme Platformu</span>
            </div>
            
            <h1 className="hero-title">
              <span className="title-line">İspanyolcayı</span>
              <span className="title-gradient">Akıcı Konuşmayı Öğrenin</span>
            </h1>
            
            <p className="hero-description">
              Kişiselleştirilmiş öğrenme yolu, interaktif alıştırmalar ve 
              <strong> gerçek yaşam senaryoları</strong> ile dil becerilerinizi 
              etkili bir şekilde geliştirin.
            </p>

            {/* Stats */}
            <div className="hero-stats">
              <div className="stat-item">
                <div className="stat-number">500+</div>
                <div className="stat-label">Öğrenci</div>
              </div>
              <div className="stat-divider"></div>
              <div className="stat-item">
                <div className="stat-number">50+</div>
                <div className="stat-label">Ders</div>
              </div>
              <div className="stat-divider"></div>
              <div className="stat-item">
                <div className="stat-number">%98</div>
                <div className="stat-label">Başarı Oranı</div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="hero-actions">
              <Link to="/gramerkurallar" className="btn btn-primary">
                <span className="btn-icon">▶</span>
                Ücretsiz Başla
              </Link>
              <Link to="/kelimetemalari" className="btn btn-secondary">
                <span className="btn-icon">📚</span>
                Demo İzle
              </Link>
            </div>

            {/* Trust Indicators */}
            <div className="trust-indicators">
              <div className="trust-item">
                <div className="trust-icon">🏆</div>
                <span>Ödüllü Metodoloji</span>
              </div>
              <div className="trust-item">
                <div className="trust-icon">👨‍🏫</div>
                <span>Uzman Eğitmenler</span>
              </div>
              <div className="trust-item">
                <div className="trust-icon">📱</div>
                <span>7/24 Erişim</span>
              </div>
            </div>
          </div>

          {/* Visual Content */}
          <div className="hero-visual">
            <div className="visual-container">
              <img 
                src={heroImg} 
                alt="İspanyolca öğrenme platformu" 
                className="hero-image"
              />
              {/* Floating Elements */}
              <div className="floating-element element-1">
                <div className="element-icon">💬</div>
                <span>Konuşma Pratiği</span>
              </div>
              <div className="floating-element element-2">
                <div className="element-icon">📊</div>
                <span>İlerleme Takibi</span>
              </div>
              <div className="floating-element element-3">
                <div className="element-icon">🎧</div>
                <span>Sesli Dersler</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}