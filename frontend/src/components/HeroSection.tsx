import React from 'react';
import { Link } from 'react-router-dom';
import "./HeroSection.css";
import heroImg from "../assets/Spain Azulejo Azuleios Espana Madrid Sticker.jpg";

export default function HeroSection() {
  return (
    <section className="hero-section">
      <div className="hero-container">
        <div className="hero-content">
          {/* Text Content */}
          <div className="hero-text-content">
      
            
            <h1 className="hero-title">
              <span className="title-line">Espanolize</span>
              <span className="title-gradient">İspanyolcayı Hayatının Bir Parçası Yap!</span>
            </h1>
            
            <p className="hero-description">
              Tema bazlı kelime listeleri,
okuma metinleri,
örneklerle desteklenmiş gramer anlatımları
ve daha fazlası bir arada.
            </p>

          </div>

          {/* Visual Content */}
          <div className="hero-visual">
            <div className="visual-container">
              <img 
                src={heroImg} 
                alt="İspanyolca öğrenme platformu" 
                className="hero-image"
              />
              
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}