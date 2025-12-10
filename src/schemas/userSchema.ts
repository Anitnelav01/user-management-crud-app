import { z } from "zod";

const phoneRegex =
  /^(\+7|8)[\s-]?\(?\d{3}\)?[\s-]?\d{3}[\s-]?\d{2}[\s-]?\d{2}$/;

export const userSchema = z.object({
  name: z
    .string()
    .min(2, "Имя должно содержать миниум  символа")
    .max(50, "Имя должно содержать максимум 50 символов"),
  email: z
    .string()
    .min(1, "Email обязателен")
    .email({ message: "Введите корректный email" }),
  phone: z
    .string()
    .min(1)
    .regex(phoneRegex, "Введите корректный номер телефона"),
  role: z.enum(["admin", "manager", "user"], {
    message: "Роль должна быть выбрана",
  }),
  managerId: z.string().nullable().default(null),
});
export type UserFormData = z.infer<typeof userSchema>;
