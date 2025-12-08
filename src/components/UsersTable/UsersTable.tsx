"use client";

import { Table, message } from "antd";
import { useState } from "react";
import { User } from "@/types/user";
import { userStore } from "@/store/useUsersStore";
import { getColumns } from "./columns";

export function UsersTable() {
  const { users, getManagerName, deleteUser } = userStore();

  const [pagination, setPagination] = useState({
    curent: 1,
    pageSixe: 5,
  });

  const handleEdit = (user: User) => {
    message.info(`Редактирование пользователя: ${user.name}`);
  };

  const handleDelete = (user: User) => {
    deleteUser(user.id);
    message.success(`Пользователь ${user.name} удален`);
  };

  const columns = getColumns({
    getManagerName,
    onEdit: handleEdit,
    onDelete: handleDelete,
  });

  return (
    <Table
      dataSource={users}
      columns={columns}
      rowKey="id"
      pagination={{
        ...pagination,
        total: users.length,
        showSizeChanger: true,
        pageSizeOptions: ["5", "10", "20"],
        showTotal: (total, range) =>
          `${range[0]}-${range[1]} из ${total} записей`,
        onChange: (page, pageSize) => {
          setPagination({ curent: page, pageSixe: pageSize });
        },
      }}
      bordered
      size="middle"
    />
  );
}
