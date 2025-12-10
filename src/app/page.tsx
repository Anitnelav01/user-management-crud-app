"use client";

import { Typography, Button, Space, Card } from "antd";
import { PlusOutlined, ReloadOutlined } from "@ant-design/icons";
import { useState } from "react";
import { UsersTable } from "@/components/UsersTable";
import { UserModal } from "@/components/UserModal";
import { userStore } from "@/store/useUsersStore";

const { Title } = Typography;

export default function Home() {
  const { resetToInitial, users } = userStore();
  const [createModalOpen, setCreateModalOpen] = useState(false);

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
            Управление пользователями
            <Typography.Text
              type="secondary"
              style={{ fontSize: 16, fontWeight: "normal", marginLeft: 12 }}
            >
              ({users.length} записей)
            </Typography.Text>
          </Title>
          <Space>
            <Button
              icon={<ReloadOutlined />}
              onClick={() => {
                resetToInitial();
              }}
            >
              Сбросить данные
            </Button>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setCreateModalOpen(true)}
            >
              Добавить пользователя
            </Button>
          </Space>
        </div>
        <UsersTable />
      </Card>
      <UserModal
        open={createModalOpen}
        user={null}
        onClose={() => setCreateModalOpen(false)}
      />
    </div>
  );
}
