import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { 
  Layout,
  Menu,
  Button,
  Space,
  Select,
  Typography
} from "antd";
import {
  DashboardOutlined,
  BookOutlined,
  FileTextOutlined,
  EditOutlined,
  MessageOutlined,
  UserOutlined
} from "@ant-design/icons";
import type { MenuProps } from 'antd';

const { Header, Content, Sider } = Layout;
const { Option } = Select;

export default function AdminDashboard() {
  const [collapsed, setCollapsed] = useState<boolean>(false);
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems: MenuProps['items'] = [
    {
      key: '/admin',
      icon: <DashboardOutlined />,
      label: 'Dashboard',
      onClick: () => navigate('/admin'),
    },
    {
      key: '/admin/kategoriler',
      icon: <BookOutlined />,
      label: 'Kategoriler',
      onClick: () => navigate('/admin/kategoriler'),
    },
    {
      key: '/admin/konular',
      icon: <FileTextOutlined />,
      label: 'Konular',
      onClick: () => navigate('/admin/konular'),
    },
    {
      key: '/admin/gramerkurallar',
      icon: <EditOutlined />,
      label: 'Gramer Kuralları',
      onClick: () => navigate('/admin/gramerkurallar'),
    },
    {
      key: '/admin/ornekler',
      icon: <MessageOutlined />,
      label: 'Örnekler',
      onClick: () => navigate('/admin/ornekler'),
    },
    {
      key: '/admin/kelimeTema',
      icon: <MessageOutlined />,
      label: 'Kelime Temaları',
      onClick: () => navigate('/admin/kelimeTema'),
    },
    {
      key: '/admin/kelimeler',
      icon: <MessageOutlined />,
      label: 'Kelimeler',
      onClick: () => navigate('/admin/kelimeler'),
    },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {/* Sidebar */}
      <Sider 
        collapsible 
        collapsed={collapsed} 
        onCollapse={setCollapsed}
        theme="light"
        width={250}
      >
        <div style={{ 
          height: 64, 
          padding: 16,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 'bold',
          fontSize: '18px',
          color: '#1890ff',
          borderBottom: '1px solid #f0f0f0'
        }}>
          {collapsed ? 'A' : 'ADMIN'}
        </div>
        <Menu
          theme="light"
          selectedKeys={[location.pathname]}
          mode="inline"
          items={menuItems}
          style={{ borderRight: 0, marginTop: '8px' }}
        />
      </Sider>

      <Layout>
        {/* Header */}
        <Header style={{ 
          padding: '0 24px', 
          background: '#fff',
          boxShadow: '0 1px 4px rgba(0,21,41,.08)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ fontSize: '16px', fontWeight: 600, color: '#262626' }}>
            {location.pathname === '/admin' && 'Dashboard'}
            {location.pathname === '/admin/kategoriler' && 'Kategori Yönetimi'}
            {location.pathname === '/admin/konular' && 'Konu Yönetimi'}
            {location.pathname === '/admin/gramerkurallar' && 'Gramer Kuralları'}
            {location.pathname === '/admin/ornekler' && 'Örnek Yönetimi'}
            {location.pathname === '/admin/kelimeTema' && 'Kelime Tema Yönetimi'}
            {location.pathname === '/admin/kelimeler' && 'Kelime Yönetimi'}

          </div>
          <Space>
            <Select 
              defaultValue="tr" 
              style={{ width: 120 }}
              size="small"
            >
              <Option value="tr">Türkçe</Option>
              <Option value="en">English</Option>
            </Select>
            <Button type="text" icon={<UserOutlined />} size="small">
              Admin
            </Button>
          </Space>
        </Header>

        {/* Content - Düzeltilmiş Alan */}
        <Content style={{ 
          margin: '24px 16px', 
          padding: 0,
          background: 'transparent'
        }}>
          <div style={{ 
            background: '#fff',
            borderRadius: '8px',
            padding: '48px 32px',
            minHeight: '60vh',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            textAlign: 'center'
          }}>
            
          </div>
        </Content>
      </Layout>
    </Layout>
  );
}