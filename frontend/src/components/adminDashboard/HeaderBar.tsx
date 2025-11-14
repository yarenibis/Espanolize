import { Layout, Space, Select, Button } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { useLocation } from "react-router-dom";

const { Header } = Layout;
const { Option } = Select;

export default function HeaderBar() {
  const location = useLocation();

  const titles: Record<string, string> = {
    "/admin": "Dashboard",
    "/admin/kategoriler": "Kategori Yönetimi",
    "/admin/konular": "Konu Yönetimi",
    "/admin/gramerkurallar": "Gramer Kuralları",
    "/admin/ornekler": "Örnek Yönetimi",
    "/admin/kelimeTema": "Kelime Tema Yönetimi",
    "/admin/kelimeler": "Kelime Yönetimi",
    "/admin/metinTema": "Metin Tema Yönetimi",
    "/admin/metinler": "Metin Yönetimi",
    "/admin/tema": "Tema Yönetimi",
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
        <Select defaultValue="tr" style={{ width: 120 }} size="small">
          <Option value="tr">Türkçe</Option>
          <Option value="en">English</Option>
        </Select>

        <Button type="text" icon={<UserOutlined />} size="small">
          Admin
        </Button>
      </Space>
    </Header>
  );
}
