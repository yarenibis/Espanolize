import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "./Navbar.css";
import logo2 from"../assets/logo (2).png";

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
<Link to="/" className="logo-area" onClick={closeMobileMenu}>
  
  {/* PNG Logo */}
  <img 
    src={logo2}
    alt="Logo"
    className="logo-image"
  />



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
                to="/hakkimizda" 
                className={location.pathname === "/hakkimizda" ? "active" : ""}
              >
                Hakkımızda
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

            <li>
              <Link 
                to="/iletisim" 
                className={location.pathname === "/iletisim" ? "active" : ""}
              >
                İletişim
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