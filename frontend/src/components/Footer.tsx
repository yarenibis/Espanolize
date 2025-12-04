import { Link } from "react-router-dom";
import "./Footer.css";

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-container">

        {/* Üst bölüm */}
        <div className="footer-content">

          {/* Marka */}
          <section className="footer-section" aria-label="Espanolize Hakkında">
            <div className="footer-brand">
              <h3 className="brand-logo">Espanolize</h3>
              <p className="brand-description">
                Modern yöntemlerle İspanyolca öğrenme platformu.
                Gramer, kelime ve okuma içerikleriyle kapsamlı bir öğrenme deneyimi sunar.
              </p>
            </div>
          </section>

          {/* Hızlı Erişim */}
          <nav className="footer-section" aria-label="Hızlı Erişim">
            <h4 className="footer-title">Hızlı Erişim</h4>
            <ul className="footer-links">
              <li><Link to="/gramerkurallar" className="footer-link">Gramer Kuralları</Link></li>
              <li><Link to="/kelimetemalari" className="footer-link">Kelime Öğren</Link></li>
              <li><Link to="/metinTema" className="footer-link">Okuma Metinleri</Link></li>
           
            </ul>
          </nav>

          {/* Yasal Sayfalar */}
          <nav className="footer-section" aria-label="Yasal Bilgiler">
            <h4 className="footer-title">Yasal Bilgiler</h4>
            <ul className="footer-links">
              
              <li><Link to="/gizlilik-politikasi" className="footer-link">Gizlilik Politikası</Link></li>
              <li><Link to="/kullanim-kosullari" className="footer-link">Kullanım Koşulları</Link></li>
              <li><Link to="/cerez-politikasi" className="footer-link">Çerez Politikası</Link></li>
            </ul>
          </nav>

          {/* Hızlı Erişim */}
          <nav className="footer-section" aria-label="Destek">
            <h4 className="footer-title">Destek</h4>
            <ul className="footer-links">
              <li><Link to="/sss" className="footer-link">SSS</Link></li>
              <li><Link to="/iletisim" className="footer-link">İletişim</Link></li>
            </ul>
          </nav>

        </div>

        {/* Alt bölüm */}
        <div className="footer-bottom">
          <div className="footer-bottom-content">

            <div className="copyright">
              © {currentYear} Espanolize • Tüm Hakları Saklıdır
            </div>

            

          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
