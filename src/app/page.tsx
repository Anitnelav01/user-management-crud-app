"use client";

import { Typography, Button, Space, Card } from "antd";
import { PlusOutlined, ReloadOutlined } from "@ant-design/icons";
import { UsersTable } from "@/components/UsersTable";
import { userStore } from "@/store/useUsersStore";

const { Title } = Typography;

export default function Home() {
  const { resetToInitial } = userStore();

  const handleCreate = () => {
    console.log(" Создать пользователя");
  };

  return (
    <div style={{ padding: 24 }}>
      <Card>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 16,
          }}
        >
          <Title level={2} style={{ margin: 0 }}>
            Пользователи
          </Title>
          <Space>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleCreate}
            >
              Создать пользователя
            </Button>
            <Button icon={<ReloadOutlined />} onClick={resetToInitial}>
              Сбросить данные
            </Button>
          </Space>
        </div>
        <UsersTable />
      </Card>
    </div>
  );
}
