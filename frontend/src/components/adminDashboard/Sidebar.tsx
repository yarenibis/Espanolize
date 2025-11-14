import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Layout, Menu } from "antd";
import {
  DashboardOutlined,
  BookOutlined,
  FileTextOutlined,
  EditOutlined,
  MessageOutlined
} from "@ant-design/icons";
import type { MenuProps } from "antd";

const { Sider } = Layout;

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems: MenuProps["items"] = [
    {
      key: "/admin",
      icon: <DashboardOutlined />,
      label: "Dashboard",
      onClick: () => navigate("/admin"),
    },
    {
      key: "/admin/kategoriler",
      icon: <BookOutlined />,
      label: "Kategoriler",
      onClick: () => navigate("/admin/kategoriler"),
    },
    {
      key: "/admin/konular",
      icon: <FileTextOutlined />,
      label: "Konular",
      onClick: () => navigate("/admin/konular"),
    },
    {
      key: "/admin/gramerkurallar",
      icon: <EditOutlined />,
      label: "Gramer Kuralları",
      onClick: () => navigate("/admin/gramerkurallar"),
    },
    {
      key: "/admin/ornekler",
      icon: <MessageOutlined />,
      label: "Örnekler",
      onClick: () => navigate("/admin/ornekler"),
    },
    {
      key: "/admin/kelimeTema",
      icon: <MessageOutlined />,
      label: "Kelime Temaları",
      onClick: () => navigate("/admin/kelimeTema"),
    },
    {
      key: "/admin/kelimeler",
      icon: <MessageOutlined />,
      label: "Kelimeler",
      onClick: () => navigate("/admin/kelimeler"),
    },
    {
      key: "/admin/metinTema",
      icon: <MessageOutlined />,
      label: "Metin Teması",
      onClick: () => navigate("/admin/metinTema"),
    },
    {
      key: "/admin/metinler",
      icon: <MessageOutlined />,
      label: "Metinler",
      onClick: () => navigate("/admin/metinler"),
    },
    {
      key: "/admin/tema",
      icon: <MessageOutlined />,
      label: "Temalar",
      onClick: () => navigate("/admin/tema"),
    },
  ];

  return (
    <Sider
      collapsible
      collapsed={collapsed}
      onCollapse={(value) => setCollapsed(value)}
      theme="light"
      width={250}
    >
      <div
        style={{
          height: 64,
          padding: 16,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontWeight: "bold",
          fontSize: 18,
          color: "#1890ff",
          borderBottom: "1px solid #f0f0f0",
        }}
      >
        {collapsed ? "A" : "ADMIN"}
      </div>

      <Menu
        theme="light"
        selectedKeys={[location.pathname]}
        mode="inline"
        items={menuItems}
        style={{ borderRight: 0, marginTop: 8 }}
      />
    </Sider>
  );
}
