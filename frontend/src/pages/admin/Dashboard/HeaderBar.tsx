import { Layout, Space, Select, Button } from "antd";
import { UserOutlined, LogoutOutlined } from "@ant-design/icons";
import { useLocation, useNavigate } from "react-router-dom";
import { logout } from "../../../services/AuthService";

const { Header } = Layout;
const { Option } = Select;

export default function HeaderBar() {
  const location = useLocation();
  const navigate = useNavigate();

  const titles: Record<string, string> = {
    "/admin": "Dashboard",
    "/admin/konular": "Konu Yönetimi",
    "/admin/gramerkurallar": "Gramer Kuralları",
    "/admin/ornekler": "Örnek Yönetimi",
    "/admin/kelimeTema": "Kelime Tema Yönetimi",
    "/admin/kelimeler": "Kelime Yönetimi",
    "/admin/metinTema": "Metin Tema Yönetimi",
    "/admin/metinler": "Metin Yönetimi",
    "/admin/tema": "Tema Yönetimi",
  };

  const handleLogout = async () => {
    try {
      console.log("LOGOUT BAŞLADI");

      await logout(); // 🔥 BACKEND ÇAĞRISI
      navigate("/login", { replace: true });

    } catch (err) {
      console.error("Logout hatası:", err);
    }
  };

  return (
    <Header
      style={{
        padding: "0 24px",
        background: "#fff",
        boxShadow: "0 1px 4px rgba(0,21,41,.08)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <div style={{ fontSize: 16, fontWeight: 600, color: "#262626" }}>
        {titles[location.pathname] || "Yönetim Paneli"}
      </div>

      <Space>
        <Button type="text" icon={<UserOutlined />} size="small">
          Admin
        </Button>

        <Button
          type="text"
          icon={<LogoutOutlined />}
          size="small"
          onClick={handleLogout}
          style={{ color: "red" }}
        >
          Çıkış
        </Button>
      </Space>
    </Header>
  );
}
