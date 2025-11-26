import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "./Navbar.css";

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <nav className="navbar">
        <div className="nav-container">
          {/* Logo Alanı */}
          <Link to="/" className="logo-area" onClick={closeMobileMenu}>
            <div className="logo-icon">ES</div>
            <div className="logo-text">
              <div className="logo-main">Espanolize</div>
              <div className="logo-sub">LEARN SPANISH</div>
            </div>
          </Link>

          {/* Desktop Navigasyon */}
          <ul className="nav-links">
            <li>
              <Link 
                to="/" 
                className={location.pathname === "/" ? "active" : ""}
              >
                Ana Sayfa
              </Link>
            </li>
            <li>
              <Link 
                to="/konular" 
                className={location.pathname === "/konular" ? "active" : ""}
              >
                Gramer Konuları
              </Link>
            </li>
            <li>
              <Link 
                to="/kelimetemalari" 
                className={location.pathname === "/kelimetemalari" ? "active" : ""}
              >
                Kelime Temaları
              </Link>
            </li>
            <li>
              <Link 
                to="/metinTema" 
                className={location.pathname === "/metinTema" ? "active" : ""}
              >
                Okuma Metinleri
              </Link>
            </li>
          </ul>

          {/* Desktop Butonlar */}
          <div className="nav-actions">
            <Link to="/login" className="login-btn">
              Giriş Yap
            </Link>
          </div>

          {/* Mobile Menu Butonu */}
          <button 
            className="mobile-menu-btn"
            onClick={toggleMobileMenu}
            aria-label="Menüyü aç/kapat"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div className={`mobile-menu ${isMobileMenuOpen ? "active" : ""}`}>
        <ul className="mobile-nav-links">
          <li>
            <Link 
              to="/" 
              className={location.pathname === "/" ? "active" : ""}
              onClick={closeMobileMenu}
            >
              Ana Sayfa
            </Link>
          </li>
          <li>
            <Link 
              to="/konular" 
              className={location.pathname === "/konular" ? "active" : ""}
              onClick={closeMobileMenu}
            >
              Gramer Konuları
            </Link>
          </li>
          <li>
            <Link 
              to="/kelimetemalari" 
              className={location.pathname === "/kelimetemalari" ? "active" : ""}
              onClick={closeMobileMenu}
            >
              Kelime Temaları
            </Link>
          </li>
          <li>
            <Link 
              to="/metinTema" 
              className={location.pathname === "/metinTema" ? "active" : ""}
              onClick={closeMobileMenu}
            >
              Okuma Metinleri
            </Link>
          </li>
        </ul>
        
        <div className="mobile-nav-actions">
          <Link 
            to="/login" 
            className="login-btn"
            onClick={closeMobileMenu}
          >
            Giriş Yap
          </Link>
        </div>
      </div>
    </>
  );
}