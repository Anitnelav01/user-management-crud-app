import { User } from "@/types/user";

export const initialUsers: User[] = [
  {
    id: "1",
    name: "Иванов Иван",
    email: "test@test.ru",
    phone: "+7 (999) 122-23-23",
    role: "admin",
    managerId: null,
  },
  {
    id: "2",
    name: "Сидорова Мария",
    email: "test@test.ru",
    phone: "+7 (999) 000-00-23",
    role: "manager",
    managerId: "1",
  },
  {
    id: "3",
    name: "Петров Роман",
    email: "test@test.ru",
    phone: "+7 (999) 000-00-23",
    role: "manager",
    managerId: "1",
  },
  {
    id: "4",
    name: "Сидоров Петр",
    email: "test@test.ru",
    phone: "+7 (999) 000-00-23",
    role: "user",
    managerId: "3",
  },
  {
    id: "5",
    name: "Роман Романов",
    email: "test@test.ru",
    phone: "+7 (999) 000-00-23",
    role: "user",
    managerId: "3",
  },
  {
    id: "6",
    name: "Петрова Мария",
    email: "test@test.ru",
    phone: "+7 (999) 000-00-23",
    role: "user",
    managerId: "3",
  },
];
