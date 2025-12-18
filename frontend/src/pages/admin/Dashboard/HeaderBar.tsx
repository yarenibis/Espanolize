import { useState, useEffect } from "react";
import { Layout, Menu, Button, Drawer } from "antd";
import {
  MenuOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { useLocation, useNavigate } from "react-router-dom";
import { logout } from "../../../services/AuthService";
import { adminMenu } from "../../admin/Dashboard/AdminMenu";

const { Header } = Layout;

// Ant Design'ın responsive breakpoint'lerine uygun
const BREAKPOINTS = {
  xs: 480,
  sm: 576,
  md: 768,
  lg: 992,
  xl: 1200,
  xxl: 1600,
};

export default function HeaderBar() {
  const navigate = useNavigate();
  const location = useLocation();

  const [isMobile, setIsMobile] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  // 📱 Responsive kontrol - daha hassas
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setWindowWidth(width);
      
      // LG breakpoint'i (992px) ve altı için mobile menü
      // Ayrıca 1050-990 arasındaki sorunu çözmek için threshold ayarı
      setIsMobile(width < BREAKPOINTS.lg);
    };

    handleResize(); // İlk yüklemede kontrol
    window.addEventListener("resize", handleResize);
    
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Aktif menü item'ını bul (nested routes için)
  const findActiveKey = () => {
    const currentPath = location.pathname;
    
    // Ana sayfa kontrolü
    if (currentPath === "/admin") return ["/admin"];
    
    // En spesifik eşleşmeyi bul
    const matchedMenu = adminMenu
      .filter(menu => currentPath.startsWith(menu.key))
      .sort((a, b) => b.key.length - a.key.length)[0];
    
    return matchedMenu ? [matchedMenu.key] : [];
  };

  const handleLogout = async () => {
    await logout();
    navigate("/login", { replace: true });
  };

  const menuItems = adminMenu.map((m) => ({
    key: m.key,
    label: m.label,
    onClick: () => {
      navigate(m.key);
      setDrawerOpen(false);
    },
  }));

  return (
    <>
      <Header
        style={{
          display: "flex",
          alignItems: "center",
          background: "#fff",
          padding: "0 16px",
          boxShadow: "0 1px 4px rgba(0,21,41,.08)",
          position: "sticky",
          top: 0,
          zIndex: 1000,
          height: "64px",
          lineHeight: "64px",
        }}
      >
        {/* LOGO */}
        <div style={{ 
          fontWeight: 700, 
          color: "#1677ff",
          fontSize: "18px",
          whiteSpace: "nowrap"
        }}>
          ADMIN PANEL
        </div>

        {/* DESKTOP MENU - LG ve üstü */}
        {!isMobile && (
          <Menu
            mode="horizontal"
            selectedKeys={findActiveKey()}
            items={menuItems}
            style={{ 
              flex: 1, 
              marginLeft: 24,
              borderBottom: "none",
              minWidth: 0 // Flex shrink için
            }}
          />
        )}

        {/* MOBILE HAMBURGER - LG altı */}
        {isMobile && (
          <Button
            type="text"
            icon={<MenuOutlined />}
            onClick={() => setDrawerOpen(true)}
            style={{ marginLeft: "auto", marginRight: 8 }}
          />
        )}

        {/* LOGOUT BUTTON */}
        {!isMobile ? (
          <Button
            type="text"
            danger
            icon={<LogoutOutlined />}
            onClick={handleLogout}
            style={{ whiteSpace: "nowrap" }}
          >
            Çıkış
          </Button>
        ) : (
          // Mobile için sadece icon
          <Button
            type="text"
            danger
            icon={<LogoutOutlined />}
            onClick={handleLogout}
          />
        )}
      </Header>

      {/* MOBILE DRAWER */}
      <Drawer
        title={
          <div style={{ display: "flex", alignItems: "center" }}>
            <div style={{ 
              fontWeight: 700, 
              color: "#1677ff",
              marginRight: 8 
            }}>
              ADMIN
            </div>
            <span style={{ fontSize: "12px", color: "#666" }}>
              ({windowWidth}px)
            </span>
          </div>
        }
        placement="left"
        onClose={() => setDrawerOpen(false)}
        open={drawerOpen}
        bodyStyle={{ padding: 0 }}
        width={280}
      >
        <Menu
          mode="inline"
          selectedKeys={findActiveKey()}
          items={menuItems}
          style={{ borderRight: "none" }}
        />

        <div style={{ padding: 16, borderTop: "1px solid #f0f0f0" }}>
          <Button
            danger
            block
            icon={<LogoutOutlined />}
            onClick={handleLogout}
          >
            Çıkış Yap
          </Button>
        </div>
      </Drawer>
    </>
  );
}