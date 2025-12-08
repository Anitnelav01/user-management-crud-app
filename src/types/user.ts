export type Role = "admin" | "manager" | "user";

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: Role;
  managerId: string | null;
}

export const ROLE_HIERARCHY: Record<Role, number> = {
  admin: 3,
  manager: 2,
  user: 1,
};

export const ROLE_LABELS: Record<Role, string> = {
  admin: "Администратор",
  manager: "Менеджер",
  user: "Пользователь",
};

export const ROLE_COLORS: Record<Role, string> = {
  admin: "red",
  manager: "blue",
  user: "green",
};
