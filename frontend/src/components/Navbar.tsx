// src/components/Navbar.tsx
import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="bg-gray-900 text-white px-6 py-3 flex gap-4">
      <Link to="/admin/kategoriler" className="hover:text-yellow-400">Kategoriler</Link>
      <Link to="/admin/konular" className="hover:text-yellow-400">Konular</Link>
      <Link to="/admin/gramer" className="hover:text-yellow-400">Gramer Kuralları</Link>
      <Link to="/admin/ornekler" className="hover:text-yellow-400">Örnekler</Link>
    </nav>
  );
}
