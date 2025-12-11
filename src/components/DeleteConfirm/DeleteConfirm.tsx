"use client";

import { useState, useMemo, JSX } from "react";
import { Modal, Select, Typography, Alert, message } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { User, ROLE_LABELS, ROLE_HIERARCHY } from "@/types/user";
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

      return subordinates.every(
        (sub) => ROLE_HIERARCHY[u.role] > ROLE_HIERARCHY[sub.role]
      );
    });
  }, [user, users, subordinates, hasSubordinates]);

  const managerOptions = possibleNewManagers.map((manager) => ({
    value: manager.id,
    label: `${manager.name} (${ROLE_LABELS[manager.role]})`,
  }));

  const canDelete = !hasSubordinates || possibleNewManagers.length > 0;

  const handleDelete = async () => {
    if (!user) return;

    setLoading(true);

    await new Promise((resolve) => setTimeout(resolve, 500));

    try {
      if (hasSubordinates && newManagerId) {
        reassignSubordinates(user.id, newManagerId);
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
  };

  const handleCancel = () => {
    setNewManagerId(null);
    onClose();
  };

  if (!user) return null;

  return (
    <Modal
      title={
        <span>
          <ExclamationCircleOutlined style={{ color: "red", marginRight: 8 }} />
          Удаление пользователя
        </span>
      }
      open={open}
      onOk={handleDelete}
      onCancel={handleCancel}
      okText="Удалить"
      cancelText="Отмена"
      okButtonProps={{
        danger: true,
        loading,
        disabled: !canDelete || (hasSubordinates && !newManagerId),
      }}
      width={500}
    >
      {!canDelete && (
        <Alert
          type="error"
          showIcon
          message="Невозможно удалить пользователя"
          description="У пользователя есть подчинённые, но нет доступных начальников для их переназначения. Сначала удалите или переназначьте подчинённых."
          style={{ marginBottom: 16 }}
        />
      )}

      {canDelete && (
        <>
          <div style={{ marginBottom: 16 }}>
            <Text>
              Вы уверены, что хотите удалить пользователя{" "}
              <Text strong>&quot;{user.name}&quot;</Text>?
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
                description="Подчинённые не могут остаться без начальника. Выберите нового начальника для них."
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
                <Text strong>
                  Новый начальник: <Text type="danger">*</Text>
                </Text>
                <Select
                  style={{ width: "100%", marginTop: 8 }}
                  placeholder="Обязательно выберите нового начальника"
                  options={managerOptions}
                  value={newManagerId}
                  onChange={setNewManagerId}
                  status={!newManagerId ? "error" : undefined}
                />
                {!newManagerId && (
                  <Text type="danger" style={{ fontSize: 12 }}>
                    Необходимо выбрать нового начальника
                  </Text>
                )}
              </div>
            </>
          )}
        </>
      )}
    </Modal>
  );
}
