import React from 'react';
import { Link } from 'react-router-dom';
import "./HeroSection.css";
import heroImg from "../../../assets/spain-hero-illustration (1).webp";

export default function HeroSection() {
  return (
    <section className="hero-section">
      <div className="hero-container">
        <div className="hero-content">

          {/* Text Content */}
          <div className="hero-text-content">

            <h1 className="hero-title">
              <span className="title-line">Españolize</span>
              <span className="title-gradient">
                İspanyolcayı Hayatının Bir Parçası Yap!
              </span>
            </h1>

            <p className="hero-description">
              İspanyolcayı kolay ve etkili bir şekilde öğrenmek isteyenler için 
              hazırlanmış modern bir platform. Tema bazlı kelime listeleri, 
              günlük hayattan okuma metinleri ve örneklerle sadeleştirilmiş 
              gramer anlatımları ile
              ispanyolcanızı adım adım geliştirin.
            </p>

          </div>

          {/* Visual Content */}
          <div className="hero-visual">
            <div className="visual-container">
              <img 
                src={heroImg} 
                alt="İspanyolca öğrenme platformu - Espanolize" 
                className="hero-image"
              />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
