import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import { Layout } from "antd";
import { MenuOutlined } from "@ant-design/icons";
import Sidebar from "./Sidebar";

const { Content } = Layout;

export default function AdminLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Ekran boyutu kontrolü
  useEffect(() => {
    const checkScreen = () => {
      const mobile = window.innerWidth < 992;
      setIsMobile(mobile);
      setCollapsed(mobile); // mobilde kapalı başlasın
    };

    checkScreen();
    window.addEventListener("resize", checkScreen);
    return () => window.removeEventListener("resize", checkScreen);
  }, []);

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sidebar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        isMobile={isMobile}
      />

      <Layout>
        {/* MOBILE HEADER (hamburger) */}
        {isMobile && (
          <div
            style={{
              height: 56,
              display: "flex",
              alignItems: "center",
              padding: "0 16px",
              background: "#fff",
              borderBottom: "1px solid #f0f0f0",
              position: "sticky",
              top: 0,
              zIndex: 1000,
            }}
          >
            <MenuOutlined
              style={{ fontSize: 22, cursor: "pointer" }}
              onClick={() => setCollapsed(false)}
            />
            <span style={{ marginLeft: 12, fontWeight: 600 }}>
              Admin Panel
            </span>
          </div>
        )}

        <Content style={{ padding: 24 }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}
