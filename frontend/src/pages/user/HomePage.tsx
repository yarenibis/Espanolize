import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Layout, 
  Card, 
  Row, 
  Col, 
  Input, 
  Button, 
  Typography, 
  Tag,
  Divider,
  List,
  Avatar,
  Space,
  Tabs,
  Progress,
  Badge,
  Spin,
  Alert,
  Empty
} from 'antd';
import { 
  SearchOutlined, 
  CalendarOutlined, 
  UserOutlined,
  BookOutlined,
  FireOutlined,
  ArrowRightOutlined,
  ReadOutlined,
  FileTextOutlined,
  TrophyOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons';
import api from '../../services/ApiService';

const { Header, Content, Footer } = Layout;
const { Title, Paragraph, Text } = Typography;
const { Search } = Input;
const { TabPane } = Tabs;

interface Kategori {
  id: number;
  ad: string;
}

interface Konu {
  id: number;
  baslik: string;
  zorluk: string;
  calismaSuresi: number;
  aciklama: string;
  kategoriId: number;
}

interface GramerKural {
  id: number;
  kuralBaslik: string;
  aciklama: string;
  konuId: number;
}

export default function Homepage() {
  const [kategoriler, setKategoriler] = useState<Kategori[]>([]);
  const [konular, setKonular] = useState<Konu[]>([]);
  const [gramerKurallari, setGramerKurallari] = useState<GramerKural[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('tum');
  const navigate = useNavigate();

  useEffect(() => {
    fetchHomepageData();
  }, []);

  const fetchHomepageData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Mock data - API bağlantısı olmadığı için örnek veriler kullanıyoruz
      const mockKategoriler: Kategori[] = [
        { id: 1, ad: 'kelimeler' },
        { id: 2, ad: 'gramer' },
        { id: 3, ad: 'metin' }
      ];

      const mockKonular: Konu[] = [
        {
          id: 1,
          baslik: "Temel Kelimeler",
          zorluk: "kolay",
          calismaSuresi: 15,
          aciklama: "Günlük hayatta en sık kullanılan İngilizce kelimeler",
          kategoriId: 1
        },
        {
          id: 2,
          baslik: "Present Simple Tense",
          zorluk: "orta",
          calismaSuresi: 25,
          aciklama: "Geniş zaman kullanımı ve örnek cümleler",
          kategoriId: 2
        },
        {
          id: 3,
          baslik: "Kısa Hikayeler",
          zorluk: "kolay",
          calismaSuresi: 20,
          aciklama: "Başlangıç seviyesi İngilizce kısa hikayeler",
          kategoriId: 3
        },
        {
          id: 4,
          baslik: "İleri Seviye Kelimeler",
          zorluk: "zor",
          calismaSuresi: 30,
          aciklama: "Akademik ve iş İngilizcesi için önemli kelimeler",
          kategoriId: 1
        }
      ];

      const mockGramerKurallari: GramerKural[] = [
        {
          id: 1,
          kuralBaslik: "To Be Fiili",
          aciklama: "İngilizce'de en temel fiil olan 'to be' kullanımı",
          konuId: 2
        },
        {
          id: 2,
          kuralBaslik: "Simple Present",
          aciklama: "Geniş zamanın kullanım alanları ve formülü",
          konuId: 2
        }
      ];

      // API'den gerçek veri çekmek için (comment out edilmiş):
      /*
      const [kategorilerRes, konularRes, gramerRes] = await Promise.all([
        api.get("/admin/kategoriler"),
        api.get("/admin/konular"),
        api.get("/admin/gramerkurallar")
      ]);

      setKategoriler(kategorilerRes.data);
      setKonular(konularRes.data);
      setGramerKurallari(gramerRes.data);
      */

      // Mock verileri kullan
      setKategoriler(mockKategoriler);
      setKonular(mockKonular);
      setGramerKurallari(mockGramerKurallari);
      
    } catch (error) {
      console.error('Veriler yüklenemedi:', error);
      setError('Veriler yüklenirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.');
    } finally {
      setLoading(false);
    }
  };

  // Kategoriye göre konuları filtrele
  const getKonularByKategori = (kategoriAd: string) => {
    const kategori = kategoriler.find(k => k.ad === kategoriAd);
    if (!kategori) return [];
    
    return konular.filter(konu => konu.kategoriId === kategori.id);
  };

  // Zorluk seviyesine göre renk
  const getZorlukColor = (zorluk: string) => {
    switch (zorluk.toLowerCase()) {
      case 'kolay': return 'green';
      case 'orta': return 'orange';
      case 'zor': return 'red';
      default: return 'blue';
    }
  };

  // Kategoriye göre icon
  const getKategoriIcon = (kategoriAd: string) => {
    switch (kategoriAd) {
      case 'kelimeler': return '📚';
      case 'gramer': return '✏️';
      case 'metin': return '📖';
      default: return '📝';
    }
  };

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    // Arama işlevselliği buraya eklenecek
  };

  const handleKonuClick = (konuId: number) => {
    navigate(`/konu/${konuId}`);
  };

  const handleGramerClick = (kuralId: number) => {
    navigate(`/gramer/${kuralId}`);
  };

  const handleKategoriClick = (kategoriAd: string) => {
    setActiveTab(kategoriAd.toLowerCase());
  };

  // Filtrelenmiş içerikler
  const tumIcerikler = [
    ...konular.map(konu => ({ ...konu, type: 'konu' })),
    ...gramerKurallari.map(kural => ({ ...kural, type: 'gramer' }))
  ];

  const kelimeKonulari = getKonularByKategori('kelimeler');
  const gramerKonulari = getKonularByKategori('gramer');
  const metinKonulari = getKonularByKategori('metin');

  // İstatistikler
  const stats = {
    toplamKonu: konular.length,
    toplamGramer: gramerKurallari.length,
    tamamlanan: Math.floor(konular.length * 0.3),
  };

  // Tabs items for new Ant Design syntax
  const tabItems = [
    {
      key: 'tum',
      label: (
        <span>
          <ReadOutlined />
          Tüm İçerikler
        </span>
      ),
      children: (
        <Row gutter={[24, 24]}>
          {tumIcerikler.slice(0, 6).map((item: any) => (
            <Col xs={24} md={12} lg={8} key={`${item.type}-${item.id}`}>
              <Card
                hoverable
                style={{ height: '100%' }}
                onClick={() => item.type === 'gramer' ? handleGramerClick(item.id) : handleKonuClick(item.id)}
                actions={[
                  <Space key="time">
                    <CalendarOutlined />
                    {item.calismaSuresi || 5} dk
                  </Space>,
                  <Space key="difficulty">
                    <TrophyOutlined />
                    <Tag color={getZorlukColor(item.zorluk || 'orta')}>
                      {item.zorluk || 'Gramer'}
                    </Tag>
                  </Space>
                ]}
              >
                <Card.Meta
                  avatar={<Avatar size="large" icon={<BookOutlined />} />}
                  title={item.baslik || item.kuralBaslik}
                  description={
                    <Paragraph ellipsis={{ rows: 2 }}>
                      {item.aciklama}
                    </Paragraph>
                  }
                />
              </Card>
            </Col>
          ))}
        </Row>
      )
    },
    {
      key: 'kelimeler',
      label: (
        <span>
          <BookOutlined />
          Kelimeler
        </span>
      ),
      children: (
        <Row gutter={[24, 24]}>
          {kelimeKonulari.length > 0 ? kelimeKonulari.map(konu => (
            <Col xs={24} md={12} lg={8} key={konu.id}>
              <Card
                hoverable
                style={{ height: '100%' }}
                onClick={() => handleKonuClick(konu.id)}
              >
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: 12 }}>
                  <span style={{ fontSize: 24, marginRight: 12 }}>📚</span>
                  <Badge count={konu.zorluk} style={{ backgroundColor: getZorlukColor(konu.zorluk) }} />
                </div>
                <Title level={5}>{konu.baslik}</Title>
                <Paragraph ellipsis={{ rows: 2 }}>
                  {konu.aciklama}
                </Paragraph>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 16 }}>
                  <Text type="secondary">{konu.calismaSuresi} dk</Text>
                  <Button type="link" size="small">
                    Çalışmaya Başla <ArrowRightOutlined />
                  </Button>
                </div>
              </Card>
            </Col>
          )) : (
            <Col span={24}>
              <Empty description="Henüz kelime konusu bulunmuyor" />
            </Col>
          )}
        </Row>
      )
    },
    {
      key: 'gramer',
      label: (
        <span>
          <FileTextOutlined />
          Gramer
        </span>
      ),
      children: (
        <Row gutter={[24, 24]}>
          {gramerKonulari.length > 0 ? gramerKonulari.map(konu => (
            <Col xs={24} md={12} lg={8} key={konu.id}>
              <Card
                hoverable
                style={{ height: '100%' }}
                onClick={() => handleKonuClick(konu.id)}
              >
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: 12 }}>
                  <span style={{ fontSize: 24, marginRight: 12 }}>✏️</span>
                  <Tag color="blue">Gramer</Tag>
                </div>
                <Title level={5}>{konu.baslik}</Title>
                <Paragraph ellipsis={{ rows: 3 }}>
                  {konu.aciklama}
                </Paragraph>
                <div style={{ marginTop: 16 }}>
                  <Progress percent={30} size="small" />
                </div>
              </Card>
            </Col>
          )) : (
            <Col span={24}>
              <Empty description="Henüz gramer konusu bulunmuyor" />
            </Col>
          )}
        </Row>
      )
    },
    {
      key: 'metin',
      label: (
        <span>
          <ReadOutlined />
          Okuma Metinleri
        </span>
      ),
      children: (
        <Row gutter={[24, 24]}>
          {metinKonulari.length > 0 ? metinKonulari.map(konu => (
            <Col xs={24} lg={12} key={konu.id}>
              <Card
                hoverable
                style={{ height: '100%' }}
                onClick={() => handleKonuClick(konu.id)}
              >
                <div style={{ display: 'flex', alignItems: 'start', gap: 16 }}>
                  <div style={{ 
                    width: 80, 
                    height: 80, 
                    background: 'linear-gradient(45deg, #667eea, #764ba2)',
                    borderRadius: 8,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: 24
                  }}>
                    📖
                  </div>
                  <div style={{ flex: 1 }}>
                    <Title level={5}>{konu.baslik}</Title>
                    <Paragraph ellipsis={{ rows: 2 }}>
                      {konu.aciklama}
                    </Paragraph>
                    <Space style={{ marginTop: 8 }}>
                      <Tag color={getZorlukColor(konu.zorluk)}>{konu.zorluk}</Tag>
                      <Text type="secondary">{konu.calismaSuresi} dk okuma</Text>
                    </Space>
                  </div>
                </div>
              </Card>
            </Col>
          )) : (
            <Col span={24}>
              <Empty description="Henüz okuma metni bulunmuyor" />
            </Col>
          )}
        </Row>
      )
    }
  ];

  if (loading) {
    return (
      <Layout style={{ minHeight: '100vh', background: '#f5f5f5' }}>
        <Header style={{ background: '#fff', padding: '0 50px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, height: 64 }}>
            <BookOutlined style={{ fontSize: 24, color: '#1890ff' }} />
            <Title level={3} style={{ margin: 0, color: '#1890ff' }}>EnglishMaster</Title>
          </div>
        </Header>
        <Content style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
          <Spin size="large" tip="İçerikler yükleniyor..." />
        </Content>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout style={{ minHeight: '100vh', background: '#f5f5f5' }}>
        <Header style={{ background: '#fff', padding: '0 50px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, height: 64 }}>
            <BookOutlined style={{ fontSize: 24, color: '#1890ff' }} />
            <Title level={3} style={{ margin: 0, color: '#1890ff' }}>EnglishMaster</Title>
          </div>
        </Header>
        <Content style={{ padding: '50px' }}>
          <Alert
            message="Hata"
            description={error}
            type="error"
            showIcon
            icon={<ExclamationCircleOutlined />}
          />
          <Button 
            type="primary" 
            style={{ marginTop: 16 }}
            onClick={fetchHomepageData}
          >
            Tekrar Dene
          </Button>
        </Content>
      </Layout>
    );
  }

  return (
    <Layout style={{ minHeight: '100vh', background: '#f5f5f5' }}>
      {/* Header */}
      <Header style={{ 
        background: '#fff', 
        padding: '0 50px', 
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        position: 'sticky',
        top: 0,
        zIndex: 1000
      }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          height: 64 
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <BookOutlined style={{ fontSize: 24, color: '#1890ff' }} />
            <Title level={3} style={{ margin: 0, color: '#1890ff' }}>
              EnglishMaster
            </Title>
          </div>
          
          <Search
            placeholder="Konu ara..."
            allowClear
            enterButton={<SearchOutlined />}
            size="large"
            style={{ width: 400 }}
            onSearch={handleSearch}
          />

          <Space>
            <Button type="text">Giriş Yap</Button>
            <Button type="primary">Kayıt Ol</Button>
          </Space>
        </div>
      </Header>

      <Content style={{ padding: '0 50px' }}>
        {/* Hero Section */}
        <div style={{ 
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          borderRadius: 12,
          padding: '60px 50px',
          margin: '40px 0',
          color: 'white',
          textAlign: 'center'
        }}>
          <Title level={1} style={{ color: 'white', marginBottom: 16 }}>
            İngilizce Öğrenme Yolculuğunuz
          </Title>
          <Paragraph style={{ 
            fontSize: 18, 
            color: 'rgba(255,255,255,0.9)',
            maxWidth: 600,
            margin: '0 auto 32px'
          }}>
            Kelime dağarcığı, gramer kuralları ve okuma metinleri ile İngilizce'yi 
            etkili bir şekilde öğrenin. Kişiselleştirilmiş içeriklerle dil becerilerinizi geliştirin.
          </Paragraph>
          
          {/* İstatistikler */}
          <Row gutter={32} style={{ marginTop: 40 }}>
            <Col span={8}>
              <div style={{ textAlign: 'center' }}>
                <Title level={2} style={{ color: 'white', margin: 0 }}>
                  {stats.toplamKonu}
                </Title>
                <Text style={{ color: 'rgba(255,255,255,0.8)' }}>Toplam Konu</Text>
              </div>
            </Col>
            <Col span={8}>
              <div style={{ textAlign: 'center' }}>
                <Title level={2} style={{ color: 'white', margin: 0 }}>
                  {stats.toplamGramer}
                </Title>
                <Text style={{ color: 'rgba(255,255,255,0.8)' }}>Gramer Kuralı</Text>
              </div>
            </Col>
            <Col span={8}>
              <div style={{ textAlign: 'center' }}>
                <Title level={2} style={{ color: 'white', margin: 0 }}>
                  {stats.tamamlanan}
                </Title>
                <Text style={{ color: 'rgba(255,255,255,0.8)' }}>Tamamlanan</Text>
              </div>
            </Col>
          </Row>
        </div>

        {/* Kategori Navigasyon */}
        <Card style={{ marginBottom: 32 }}>
          <Tabs 
            activeKey={activeTab} 
            onChange={setActiveTab}
            type="card"
            items={tabItems}
          />
        </Card>

        {/* Hızlı Erişim - Kategoriler */}
        <Row gutter={[24, 24]} style={{ marginBottom: 48 }}>
          <Col span={24}>
            <Title level={3} style={{ marginBottom: 24 }}>Kategoriler</Title>
          </Col>
          {kategoriler.map(kategori => (
            <Col xs={24} md={8} key={kategori.id}>
              <Card
                hoverable
                style={{ textAlign: 'center', padding: '24px 16px' }}
                onClick={() => handleKategoriClick(kategori.ad)}
              >
                <div style={{ fontSize: 48, marginBottom: 16 }}>
                  {getKategoriIcon(kategori.ad)}
                </div>
                <Title level={4} style={{ textTransform: 'capitalize' }}>
                  {kategori.ad}
                </Title>
                <Text type="secondary">
                  {getKonularByKategori(kategori.ad).length} konu
                </Text>
              </Card>
            </Col>
          ))}
        </Row>
      </Content>

      {/* Footer */}
      <Footer style={{ 
        textAlign: 'center', 
        background: '#fff',
        marginTop: 48,
        padding: '24px 50px'
      }}>
        <Divider />
        <Paragraph type="secondary">
          © 2024 EnglishMaster. Tüm hakları saklıdır.
        </Paragraph>
      </Footer>
    </Layout>
  );
}