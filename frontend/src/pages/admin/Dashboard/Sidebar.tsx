import { Layout, Menu } from "antd";
import {
  DashboardOutlined,
  FileTextOutlined,
  EditOutlined,
  MessageOutlined,
  TagsOutlined,
  BookOutlined,
  FileTextTwoTone,
  GlobalOutlined,
} from "@ant-design/icons";
import { useNavigate, useLocation } from "react-router-dom";
import type { MenuProps } from "antd";

const { Sider } = Layout;

interface Props {
  collapsed: boolean;
  setCollapsed: (v: boolean) => void;
  isMobile: boolean;
}

export default function Sidebar({
  collapsed,
  setCollapsed,
  isMobile,
}: Props) {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems: MenuProps["items"] = [
    {
      key: "/admin",
      icon: <DashboardOutlined />,
      label: "Dashboard",
      onClick: () => {
        navigate("/admin");
        if (isMobile) setCollapsed(true);
      },
    },
    {
      key: "/admin/konular",
      icon: <FileTextOutlined />,
      label: "Konular",
      onClick: () => {
        navigate("/admin/konular");
        if (isMobile) setCollapsed(true);
      },
    },
    {
      key: "/admin/gramerkurallar",
      icon: <EditOutlined />,
      label: "Gramer Kuralları",
      onClick: () => {
        navigate("/admin/gramerkurallar");
        if (isMobile) setCollapsed(true);
      },
    },
    {
      key: "/admin/ornekler",
      icon: <MessageOutlined />,
      label: "Örnekler",
      onClick: () => {
        navigate("/admin/ornekler");
        if (isMobile) setCollapsed(true);
      },
    },
    { key: "/admin/kelimeTema", 
      icon: <TagsOutlined />, 
      label: "Kelime Temaları", 
      onClick: () => { 
        navigate("/admin/kelimeTema"); 
        if (isMobile) setCollapsed(true); 
      }, 
    }, 
    { key: "/admin/kelimeler", 
      icon: <BookOutlined />, 
      label: "Kelimeler", 
      onClick: () => { 
        navigate("/admin/kelimeler"); 
        if (isMobile) setCollapsed(true); 
      }, 
    }, 
    { key: "/admin/metinTema", 
      icon: <FileTextTwoTone />, 
      label: "Metin Temaları", 
      onClick: () => { 
        navigate("/admin/metinTema"); 
        if (isMobile) setCollapsed(true); 
      }, 
    }, 
    { key: "/admin/metinler", 
      icon: <GlobalOutlined />, 
      label: "Metinler", 
      onClick: () => { 
        navigate("/admin/metinler"); 
        if (isMobile) setCollapsed(true); 
      }, 
    }, 
    { key: "/admin/tema", 
      icon: <TagsOutlined />, 
      label: "Temalar", 
      onClick: () => { 
        navigate("/admin/tema"); 
        if (isMobile) setCollapsed(true); 
      }, 
    },
  ];

  return (
    <Sider
      theme="light"
      collapsible={!isMobile}
      collapsed={collapsed}
      onCollapse={setCollapsed}
      width={250}
      collapsedWidth={isMobile ? 0 : 80}
      trigger={null}
      style={{
        position: isMobile ? "fixed" : "relative",
        height: "100vh",
        left: 0,
        top: 0,
        zIndex: 1001,
      }}
    >
      <div
        style={{
          height: 64,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontWeight: 700,
          fontSize: 18,
          color: "#1677ff",
          borderBottom: "1px solid #f0f0f0",
        }}
      >
        {collapsed ? "A" : "ADMIN"}
      </div>

      <Menu
        mode="inline"
        selectedKeys={[location.pathname]}
        items={menuItems}
        style={{ borderRight: 0 }}
      />
    </Sider>
  );
}
