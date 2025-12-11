"use client";

import { useState } from "react";
import { Table, Input } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { User } from "@/types/user";
import { userStore } from "@/store/useUsersStore";
import { getColumns } from "./columns";
import { UserModal } from "@/components/UserModal/UserModal";
import { DeleteConfirm } from "@/components/DeleteConfirm/DeleteConfirm";

export function UsersTable() {
  const { users, getManagerName } = userStore();

  const [pagination, setPagination] = useState({
    curent: 1,
    pageSixe: 5,
  });

  const [searchText, setSearchText] = useState("");

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deletingUser, setDeletingUser] = useState<User | null>(null);

  const filteredUsers = () => {
    if (!searchText.trim()) return users;

    const search = searchText.toLowerCase();
    return users.filter(
      (user) =>
        user.name.toLocaleLowerCase().includes(search) ||
        user.email.toLocaleLowerCase().includes(search) ||
        user.phone.toLocaleLowerCase().includes(search)
    );
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setEditModalOpen(true);
  };

  const handleDelete = (user: User): void => {
    console.log("clicl");
    setDeletingUser(user);
    setDeleteModalOpen(true);
  };

  const handleEditClose = () => {
    setEditModalOpen(false);
    setEditingUser(null);
  };

  const handleDeleteClose = () => {
    setDeleteModalOpen(false);
    setDeletingUser(null);
  };

  const columns = getColumns({
    getManagerName,
    onEdit: handleEdit,
    onDelete: handleDelete,
  });

  return (
    <>
      <div style={{ marginBottom: 16 }}>
        <Input
          placeholder="Поиск по имени, email или телефону..."
          prefix={<SearchOutlined />}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          allowClear
          style={{ maxWidth: 400 }}
        />
      </div>

      <Table
        dataSource={filteredUsers()}
        columns={columns}
        rowKey="id"
        pagination={{
          ...pagination,
          total: filteredUsers.length,
          showSizeChanger: true,
          pageSizeOptions: ["5", "10", "20", "50"],
          showTotal: (total, range) =>
            `${range[0]}-${range[1]} из ${total} записей`,
          onChange: (page, pageSize) => {
            setPagination({ curent: page, pageSixe: pageSize });
          },
        }}
        bordered
        size="middle"
        locale={{
          emptyText: searchText ? "Ничего не найдено" : "Нет данных",
        }}
      />
      <UserModal
        open={editModalOpen}
        user={editingUser}
        onClose={handleEditClose}
      />
      <DeleteConfirm
        open={deleteModalOpen}
        user={deletingUser}
        onClose={handleDeleteClose}
      />
    </>
  );
}
