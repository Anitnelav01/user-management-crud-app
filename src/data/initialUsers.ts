import { User } from "@/types/user";

export const initialUsers: User[] = [
  {
    id: "1",
    name: "Иванов Иван",
    email: "test@test.ru",
    phone: "9991222323",
    role: "admin",
    managerId: null,
  },
  {
    id: "2",
    name: "Сидорова Мария",
    email: "test@test.ru",
    phone: "9990000023",
    role: "manager",
    managerId: "1",
  },
  {
    id: "3",
    name: "Петров Роман",
    email: "test@test.ru",
    phone: "9990000023",
    role: "manager",
    managerId: "1",
  },
  {
    id: "4",
    name: "Сидоров Петр",
    email: "test@test.ru",
    phone: "9990000023",
    role: "user",
    managerId: "3",
  },
  {
    id: "5",
    name: "Роман Романов",
    email: "test@test.ru",
    phone: "9990000023",
    role: "user",
    managerId: "3",
  },
  {
    id: "6",
    name: "Петрова Мария",
    email: "test@test.ru",
    phone: "9990000023",
    role: "user",
    managerId: "3",
  },
];
