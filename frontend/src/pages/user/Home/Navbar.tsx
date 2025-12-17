import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "./Navbar.css";
import logo2 from "../../../assets/logo.png";

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };


  useEffect(() => {
  const handleResize = () => {
    if (window.innerWidth > 768) {
      setIsMobileMenuOpen(false);
    }
  };

  window.addEventListener("resize", handleResize);
  
  return () => window.removeEventListener("resize", handleResize);
}, []);

  return (
    <>
      <nav className="navbar">
        <div className="nav-container">

          {/* Logo */}
          <Link to="/" className="logo-area" onClick={closeMobileMenu}>
            <img src={logo2} alt="Logo-Españolize" className="logo-image" loading="lazy" />
          </Link>

          {/* Desktop Menü */}
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

          {/* Mobile Menü Butonu */}
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

      {/* Mobile Menü */}
      <div className={`mobile-menu ${isMobileMenuOpen ? "active" : ""}`}>
        <ul className="mobile-nav-links">
          <li>
            <Link
              to="/"
              onClick={closeMobileMenu}
              className={location.pathname === "/" ? "active" : ""}
            >
              Ana Sayfa
            </Link>
          </li>

          <li>
            <Link
              to="/konular"
              onClick={closeMobileMenu}
              className={location.pathname === "/konular" ? "active" : ""}
            >
              Gramer Konuları
            </Link>
          </li>

          <li>
            <Link
              to="/kelimetemalari"
              onClick={closeMobileMenu}
              className={location.pathname === "/kelimetemalari" ? "active" : ""}
            >
              Kelime Temaları
            </Link>
          </li>

          <li>
            <Link
              to="/metinTema"
              onClick={closeMobileMenu}
              className={location.pathname === "/metinTema" ? "active" : ""}
            >
              Okuma Metinleri
            </Link>
          </li>

          <li>
            <Link
              to="/iletisim"
              onClick={closeMobileMenu}
              className={location.pathname === "/iletisim" ? "active" : ""}
            >
              İletişim
            </Link>
          </li>
        </ul>
      </div>
    </>
  );
}
