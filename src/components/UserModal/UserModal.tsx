"use client";

import { useState } from "react";
import { Modal, message } from "antd";
import { UserForm } from "@/components/UserForm";
import { User } from "@/types/user";
import { UserFormData } from "@/schemas/userSchema";
import { userStore } from "@/store/useUsersStore";

interface UserModalProps {
  open: boolean;
  user?: User | null;
  onClose: () => void;
}

export function UserModal({ open, user, onClose }: UserModalProps) {
  const { addUser, updateUser, canChangeRole } = userStore();
  const [loading, setLoading] = useState(false);

  const title = !!user ? "Редактировать пользователя" : "Добавить пользователя";

  const handleSubmit = async (data: UserFormData) => {
    setLoading(true);

    await new Promise((resolve) => setTimeout(resolve, 500));

    try {
      if (!!user) {
        if (data.role !== user.role) {
          const { valid, error } = canChangeRole(user.id, data.role);
          if (!valid) {
            message.error(error);
            setLoading(false);
            return;
          }
        }
        updateUser(user.id, data);
        message.success(`Пользователь ${data.name} обновлен`);
      } else {
        addUser(data);
        message.success(`Пользователь ${data.name} добавлен`);
      }
      onClose();
    } catch (error) {
      message.error("Произошла ошибка при сохранении пользователя");
    } finally {
      setLoading(false);
    }
  };
  return (
    <Modal
      title={title}
      open={open}
      onCancel={onClose}
      footer={null}
      destroyOnHidden
      width={500}
    >
      <UserForm
        user={user || null}
        onSubmit={handleSubmit}
        onCancel={onClose}
        loading={loading}
      />
    </Modal>
  );
}
