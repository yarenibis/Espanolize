import { Layout } from "antd";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import HeaderBar from "./HeaderBar";
import { Helmet } from "react-helmet";


const { Content } = Layout;

export default function AdminLayout() {
  return (
    <>
    <Helmet>
        <meta name="robots" content="noindex, nofollow" />
        <meta name="googlebot" content="noindex, nofollow" />
        <title>Admin Paneli</title>
      </Helmet>
      {/* Layout HTML'i */}
    <Layout style={{ minHeight: "100vh" }}>
      <Sidebar />

      <Layout>
        <HeaderBar />

        <Content style={{ margin: "24px 16px" }}>
          <div
            style={{
              background: "#fff",
              padding: "24px",
              minHeight: "80vh",
              borderRadius: "8px",
            }}
          >
            <Outlet />
          </div>
        </Content>
      </Layout>
    </Layout>
    </>
  );
}
