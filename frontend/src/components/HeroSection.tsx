import React from 'react';
import { Link } from 'react-router-dom';
import "./HeroSection.css";
import heroImg from "../assets/Learning-cuate.svg"; // senin resmin gelecek

export default function HeroSection() {
  return (
    <section className="hero-section">
      <div className="hero-container">
        <div className="hero-content">
          {/* Left Content */}
          <div className="hero-text-content">
            <div className="hero-badge">
              <span>🎯 Modern Dil Öğrenme</span>
            </div>
            
            <h1 className="hero-title">
              <span className="title-gradient">İspanyolcayı</span>
              <span className="title-main">Modern Yöntemlerle Öğren</span>
            </h1>
            
            <p className="hero-description">
              Gramer kuralları, kelime dağarcığı ve gerçek yaşam metinleriyle 
              <strong> kapsamlı öğrenme deneyimi</strong>. Interaktif alıştırmalar 
              ve kişiselleştirilmiş içeriklerle dil becerilerinizi geliştirin.
            </p>

            {/* Stats */}
            <div className="hero-stats">
              <div className="stat-item">
                <div className="stat-number">500+</div>
                <div className="stat-label">Kelime</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">50+</div>
                <div className="stat-label">Gramer Kuralı</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">100+</div>
                <div className="stat-label">Metin</div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="hero-actions">
              <Link to="/gramerkurallar" className="btn btn-primary">
                <span className="btn-icon">🚀</span>
                Hemen Başla
              </Link>
              <Link to="/kelimetemalari" className="btn btn-secondary">
                <span className="btn-icon">🔍</span>
                İçeriği Keşfet
              </Link>
            </div>

            {/* Trust Indicators */}
            <div className="trust-indicators">
              <div className="trust-item">
                <div className="trust-icon">✅</div>
                <span>Ücretsiz Erişim</span>
              </div>
              <div className="trust-item">
                <div className="trust-icon">⭐</div>
                <span>4.9/5 Puan</span>
              </div>
              <div className="trust-item">
                <div className="trust-icon">👥</div>
                <span>10.000+ Öğrenci</span>
              </div>
            </div>
          </div>

          {/* Right Content */}
          <div className="hero-visual">
            <div className="image-container">
              <img 
                src={heroImg} 
                alt="İspanyolca öğrenen öğrenciler" 
                className="hero-image"
              />
              
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}