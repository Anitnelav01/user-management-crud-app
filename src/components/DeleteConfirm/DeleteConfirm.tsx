"use client";

import { useState, useMemo } from "react";
import { Modal, Select, Typography, Alert, message } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { User, ROLE_LABELS } from "@/types/user";
import { userStore } from "@/store/useUsersStore";

const { Text } = Typography;

interface DeleteConfirmProps {
  open: boolean;
  user: User | null;
  onClose: () => void;
}

export function DeleteConfirm({
  open,
  user,
  onClose,
}: DeleteConfirmProps): JSX.Element | null {
  const { users, deleteUser, getSubordinates, reassignSubordinates } =
    userStore();
  const [newManagerId, setNewManagerId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const subordinates = useMemo(() => {
    if (!user) return [];
    return getSubordinates(user.id);
  }, [user, getSubordinates]);

  const hasSubordinates = subordinates.length > 0;

  const possibleNewManagers = useMemo(() => {
    if (!user || !hasSubordinates) return [];
    return users.filter((u) => {
      if (u.id === user.id) return false;
      if (subordinates.some((sub) => sub.id === u.id)) return false;
      const roleHierarchy = {
        admin: 3,
        manager: 2,
        user: 1,
      };
      return subordinates.every(
        (sub) => roleHierarchy[u.role] > roleHierarchy[sub.role]
      );
    });
  }, [user, users, subordinates, hasSubordinates]);

  const managerOptions = [
    { value: "__none__", label: "Оставить без начальника" },
    ,
    ...possibleNewManagers.map((manager) => ({
      value: manager.id,
      label: `${manager.name} (${ROLE_LABELS[manager.role]})`,
    })),
  ];

  const handleDelete = async () => {
    if (!user) return;

    setLoading(true);

    await new Promise((resolve) => setTimeout(resolve, 500));

    try {
      if (hasSubordinates) {
        const managerId = newManagerId === " __nane__" ? null : newManagerId;
        reassignSubordinates(user.id, managerId);
      }

      deleteUser(user.id);
      message.success(`Пользователь "${user.name}" удален`);
      onClose();
    } catch (error) {
      message.error("Ошибка при удалении пользователя");
    } finally {
      setLoading(false);
      setNewManagerId(null);
    }

    const handleCancel = () => {
      setNewManagerId(null);
      onClose();
    };

    if (!user) return null;

    return (
      <Modal
        title={
          <span>
            <ExclamationCircleOutlined
              style={{ color: "red", marginRight: 8 }}
            />
            Удаление пользователя
          </span>
        }
        open={open}
        onOk={handleDelete}
        onCancel={handleCancel}
        okText="Удалить"
        cancelText="Отмена"
        okButtonProps={{ danger: true, loading }}
        width={500}
      >
        <div style={{ marginBottom: 16 }}>
          <Text>
            Вы уверены, что хотите удалить пользователя
            {user.name}
          </Text>
        </div>

        {user.managerId && (
          <Alert
            type="info"
            showIcon
            message="У пользователя есть начальник"
            description="Связь с начальником будет удалена автоматически."
            style={{ marginBottom: 16 }}
          />
        )}
        {hasSubordinates && (
          <>
            <Alert
              type="warning"
              showIcon
              message={`У пользователя ${subordinates.length} подчинённых`}
              description="Выберите нового начальника для подчинённых или оставьте их без начальника."
              style={{ marginBottom: 16 }}
            />

            <div style={{ marginBottom: 8 }}>
              <Text strong>Подчинённые:</Text>
              <ul style={{ margin: "8px 0", paddingLeft: 20 }}>
                {subordinates.map((sub) => (
                  <li key={sub.id}>
                    {sub.name} ({ROLE_LABELS[sub.role]})
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <Text strong>Новый начальник:</Text>
              <Select
                style={{ width: "100%", marginTop: 8 }}
                placeholder="Выберите нового начальника"
                options={managerOptions}
                value={newManagerId}
                onChange={setNewManagerId}
              />
            </div>
          </>
        )}
      </Modal>
    );
  };
}
