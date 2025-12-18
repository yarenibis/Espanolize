import { Layout } from "antd";
import { Outlet } from "react-router-dom";
import HeaderBar from "./HeaderBar";

const { Content } = Layout;

export default function AdminLayout() {
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <HeaderBar />
      <Content style={{ padding: 24 }}>
        <Outlet />
      </Content>
    </Layout>
  );
}
