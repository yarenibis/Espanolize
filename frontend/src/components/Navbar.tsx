import { Link } from "react-router-dom";
import "./Navbar.css";

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="nav-container">
        <div className="logo">Espanolize</div>

        <ul className="nav-links">
          <li><Link to="/gramerkurallar">Gramer</Link></li>
          <li><Link to="/kelimetemalari">Kelimeler</Link></li>
          <li><Link to="/metinTema">Metinler</Link></li>
        </ul>

        <Link to="/login" className="login-btn">Giriş Yap</Link>
      </div>
    </nav>
  );
}
