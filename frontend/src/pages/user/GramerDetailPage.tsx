import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Card, Spin, Typography, Tag } from "antd";
import Navbar from "../../components/Navbar";
import api from "../../services/ApiService";
import { ArrowLeftOutlined } from "@ant-design/icons";

const { Title, Paragraph, Text } = Typography;

export default function GramerDetailPage() {
  const { id } = useParams();
  const [kural, setKural] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/kurallar/${id}`).then((res) => {
      setKural(res.data);
      setLoading(false);
    });
  }, [id]);

  if (loading) {
    return (
      <div className="grid place-items-center h-64">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <>
      <Navbar />

      <div className="max-w-4xl mx-auto py-12 px-4">
        <Link to="/gramerkurallar" className="text-blue-600 flex items-center gap-2 mb-6 hover:underline">
          <ArrowLeftOutlined /> Geri Dön
        </Link>

        <Card className="rounded-2xl shadow-lg p-8 mb-10">
          <Title level={2}>{kural.kuralBaslik}</Title>

          <Paragraph className="text-gray-600 bg-gray-50 p-4 rounded-lg border-l-4 border-blue-500">
            {kural.aciklama}
          </Paragraph>

          {kural.zorlukSeviyesi && (
            <Tag color="blue" className="mt-4 p-1 px-3 text-sm">{kural.zorlukSeviyesi}</Tag>
          )}
        </Card>

        <Title level={3} className="mb-4">💡 Örnekler</Title>

        <div className="space-y-4">
          {kural.ornekler?.map((o: any, i: number) => (
            <Card key={i} className="p-5 rounded-xl shadow-sm hover:shadow-md transition-all">
              <Text strong className="text-lg block mb-2">{o.ispanyolcaOrnek}</Text>
              <Text className="text-green-600 italic block mb-2">{o.ceviri}</Text>
              {o.aciklama && (
                <Text className="text-gray-500 text-sm">{o.aciklama}</Text>
              )}
            </Card>
          ))}
        </div>
      </div>
    </>
  );
}
