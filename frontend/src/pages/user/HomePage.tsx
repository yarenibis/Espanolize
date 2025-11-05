import { Link } from "react-router-dom";

// src/pages/HomePage.tsx
export default function HomePage() {
  return (
    <div className="p-6">
      <nav>
        <Link to="/gramerkurallar" className="hover:text-yellow-400">Gramer Kuralları</Link>
      </nav>

      <nav>
        <Link to="/kelimetemalari" className="hover:text-yellow-400">Kelimeler</Link>
      </nav>
      <h1 className="text-3xl font-bold mb-2">Espanolize Blog</h1>
      <p>Kullanıcı girişi olmadan içerikleri buradan görüntüleyebilirsiniz.</p>
    </div>
  );
}
