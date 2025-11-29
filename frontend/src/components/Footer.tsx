import { Link } from "react-router-dom";
import "./Footer.css";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Main Footer Content */}
        <div className="footer-content">
          {/* Brand Section */}
          <div className="footer-section">
            <div className="footer-brand">
              <h3 className="brand-logo">Espanolize</h3>
              <p className="brand-description">
                Modern yöntemlerle İspanyolca öğrenme platformu. 
                Gramer, kelime ve okuma metinleriyle kapsamlı öğrenme deneyimi.
              </p>
              
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer-section">
            <h4 className="footer-title">Hızlı Erişim</h4>
            <div className="footer-links">
              <Link to="/gramerkurallar" className="footer-link">Gramer Kuralları</Link>
              <Link to="/kelimetemalari" className="footer-link">Kelime Öğren</Link>
              <Link to="/metinTema" className="footer-link">Okuma Metinleri</Link>
            </div>
          </div>

          {/* Resources */}
          <div className="footer-section">
            <h4 className="footer-title">Kaynaklar</h4>
            <div className="footer-links">
              <a href="#" className="footer-link">Blog</a>
              <a href="#" className="footer-link">Rehberler</a>
              <a href="#" className="footer-link">SSS</a>
              <a href="#" className="footer-link">Dokümantasyon</a>
            </div>
          </div>

          {/* Support */}
          <div className="footer-section">
            <h4 className="footer-title">Destek</h4>
            <div className="footer-links">
              <a href="#" className="footer-link">Yardım Merkezi</a>
              <a href="#" className="footer-link">İletişim</a>
              <a href="#" className="footer-link">Geri Bildirim</a>
              <a href="#" className="footer-link">Topluluk</a>
            </div>
          </div>
          
        </div>

        {/* Footer Bottom */}
        <div className="footer-bottom">
          <div className="footer-bottom-content">
            <div className="copyright">
              © {currentYear} Espanolize • Tüm Hakları Saklıdır
            </div>
            <div className="footer-legal">
              <a href="#" className="legal-link">Gizlilik Politikası</a>
              <a href="#" className="legal-link">Kullanım Koşulları</a>
              <a href="#" className="legal-link">Çerezler</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}