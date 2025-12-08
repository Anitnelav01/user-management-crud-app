import { ColumnsType } from "antd/es/table";
import { Tag, Space, Button, Tooltip } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { User, Role, ROLE_COLORS } from "@/types/user";

interface ColumnsProps {
  getManagerName: (managerId: string | null) => string;
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
}

export const getColumns = ({
  getManagerName,
  onEdit,
  onDelete,
}: ColumnsProps): ColumnsType<User> => [
  {
    title: "ID",
    dataIndex: "id",
    key: "id",
    width: 100,
    ellipsis: true,
    sorter: (a, b) => a.id.localeCompare(b.id),
  },
  {
    title: "Имя",
    dataIndex: "name",
    key: "name",
    sorter: (a, b) => a.name.localeCompare(b.name),
    filterSearch: true,
  },
  {
    title: "Email",
    dataIndex: "email",
    key: "email",
    sorter: (a, b) => a.email.localeCompare(b.email),
  },
  {
    title: "Телефон",
    dataIndex: "phone",
    key: "phone",
  },
  {
    title: "Роль",
    dataIndex: "role",
    key: "role",
    width: 150,
    render: (role: Role) => (
      <Tag color={ROLE_COLORS[role]} key={role}>
        {role}
      </Tag>
    ),
    filters: [
      { text: "Администратор", value: "admin" },
      { text: "Менеджер", value: "manager" },
      { text: "Пользователь", value: "user" },
    ],
    onFilter: (value, record) => record.role === value,
    sorter: (a, b) => a.role.localeCompare(b.role),
  },
  {
    title: "Менеджер",
    dataIndex: "managerId",
    key: "managerId",
    render: (managerId: string | null) => getManagerName(managerId),
  },
  {
    title: "Действия",
    key: "actions",
    width: 120,
    render: (_, record) => (
      <Space>
        <Tooltip title="Редактировать">
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => onEdit(record)}
          />
        </Tooltip>
        <Tooltip title="Удалить">
          <Button
            type="text"
            danger
            icon={<DeleteOutlined />}
            onClick={() => onDelete(record)}
          />
        </Tooltip>
      </Space>
    ),
  },
];
