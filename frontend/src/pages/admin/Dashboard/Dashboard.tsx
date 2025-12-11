import { Card, Statistic, Row, Col } from "antd";
import { BookOutlined, FolderOpenOutlined, FileTextOutlined, FontSizeOutlined } from "@ant-design/icons";

export default function AdminHome() {
  return (
    <div style={{ width: "100%" }}>
      <h2 style={{ fontSize: "22px", marginBottom: "24px" }}>Yönetim Paneli</h2>

      <Row gutter={[24, 24]}>
        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false}>
            <Statistic
              title="Konular"
              value={42}
              prefix={<FileTextOutlined />}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false}>
            <Statistic
              title="Metin Temaları"
              value={8}
              prefix={<FolderOpenOutlined />}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false}>
            <Statistic
              title="Kelimeler"
              value={1200}
              prefix={<FontSizeOutlined />}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false}>
            <Statistic
              title="Örnek Cümleler"
              value={350}
              prefix={<BookOutlined />}
            />
          </Card>
        </Col>
      </Row>

      <div style={{ marginTop: "40px" }}>
        <Card>
          <h3>Hoş geldiniz!</h3>
          <p>
            Soldaki menüyü kullanarak içerikleri yönetebilirsiniz.
            Konular, metin temaları, kelime temaları ve daha fazlasını kolayca ekleyebilir,
            düzenleyebilir ve silebilirsiniz.
          </p>
        </Card>
      </div>
    </div>
  );
}
