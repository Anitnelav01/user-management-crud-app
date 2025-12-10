"use client";

import React, { useEffect } from "react";
import { Form, Input, Select, Button, Space } from "antd";
import { useForm, Controller, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { userSchema, UserFormData } from "@/schemas/userSchema";
import { User, ROLE_LABELS } from "@/types/user";
import { userStore } from "@/store/useUsersStore";

interface UserFormProps {
  user?: User | null;
  onSubmit: (data: UserFormData) => void;
  onCancel: () => void;
  loading?: boolean;
}

export function UserForm({ user, onSubmit, onCancel, loading }: UserFormProps) {
  const { getPossibleManagers, getSubordinates } = userStore();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      role: "user",
      managerId: null,
    },
  });

  const selectedRole = useWatch({
    control,
    name: "role",
    defaultValue: "user",
  });

  const possibleManagers = getPossibleManagers(selectedRole, user?.id);
  const subordinates = user ? getSubordinates(user.id) : [];

  const PhoneInput = ({ value, onChange, onBlur, ...props }: any) => {
    const inputRef = React.useRef<any>(null);

    const formatDisplay = (digits: string) => {
      if (!digits) return "";

      const d = digits.slice(0, 10);
      let formatted = "+7 (";

      if (d.length > 0) formatted += d.slice(0, 3);
      if (d.length > 3) formatted += `) ${d.slice(3, 6)}`;
      if (d.length > 6) formatted += `-${d.slice(6, 8)}`;
      if (d.length > 8) formatted += `-${d.slice(8, 10)}`;

      return formatted;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const allDigits = e.target.value.replace(/\D/g, "");

      let phoneDigits = allDigits;
      if (allDigits.startsWith("7") || allDigits.startsWith("8")) {
        phoneDigits = allDigits.substring(1);
      }

      const digits = phoneDigits.slice(0, 10);
      onChange(digits);
    };

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      setTimeout(() => {
        const len = e.target.value.length;
        e.target.setSelectionRange(len, len);
      }, 0);
    };

    return (
      <Input
        {...props}
        ref={inputRef}
        value={formatDisplay(value)}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={onBlur}
        placeholder="+7 (___) ___-__-__"
      />
    );
  };

  const extractPhoneDigits = (phone: string): string => {
    if (!phone) return "";

    const allDigits = phone.replace(/\D/g, "");

    if (
      allDigits.length === 11 &&
      (allDigits.startsWith("7") || allDigits.startsWith("8"))
    ) {
      return allDigits.slice(1);
    }

    return allDigits.slice(0, 10);
  };

  useEffect(() => {
    if (user) {
      reset({
        name: user.name,
        email: user.email,
        phone: extractPhoneDigits(user.phone),
        role: user.role,
        managerId: user.managerId,
      });
    } else {
      reset({
        name: "",
        email: "",
        phone: "",
        role: "user",
        managerId: null,
      });
    }
  }, [user, reset]);

  const roleOptiions = [
    { value: "admin", label: ROLE_LABELS.admin },
    { value: "manager", label: ROLE_LABELS.manager },
    { value: "user", label: ROLE_LABELS.user },
  ];

  const managerOptions = [
    { value: null, label: "Без начальника" },
    ...possibleManagers.map((manager) => ({
      value: manager.id,
      label: manager.name,
    })),
  ];

  return (
    <Form
      layout="vertical"
      onFinish={handleSubmit(onSubmit)}
      autoComplete="off"
    >
      <Form.Item
        label="Имя"
        validateStatus={errors.name ? "error" : ""}
        help={errors.name?.message}
        required
      >
        <Controller
          name="name"
          control={control}
          render={({ field }) => (
            <Input {...field} placeholder="Введите имя" maxLength={50} />
          )}
        />
      </Form.Item>
      <Form.Item
        label="Email"
        validateStatus={errors.email ? "error" : ""}
        help={errors.email?.message}
        required
      >
        <Controller
          name="email"
          control={control}
          render={({ field }) => (
            <Input {...field} placeholder="Введите email" />
          )}
        />
      </Form.Item>
      <Form.Item
        label="Телефон"
        validateStatus={errors.phone ? "error" : ""}
        help={errors.phone?.message}
        required
      >
        <Controller
          name="phone"
          control={control}
          render={({ field }) => (
            <PhoneInput
              value={field.value}
              onChange={field.onChange}
              onBlur={field.onBlur}
            />
          )}
        />
      </Form.Item>
      <Form.Item
        label="Роль"
        validateStatus={errors.role ? "error" : ""}
        help={errors.role?.message}
        required
      >
        <Controller
          name="role"
          control={control}
          render={({ field }) => (
            <Select
              {...field}
              options={roleOptiions}
              placeholder="Выберите роль"
            />
          )}
        />
      </Form.Item>
      <Form.Item
        label="Начальник"
        validateStatus={errors.managerId ? "error" : ""}
        help={errors.managerId?.message}
        extra={
          possibleManagers.length === 0 && selectedRole !== "admin"
            ? "Нет доступных начальников для выбранной роли"
            : undefined
        }
      >
        <Controller
          name="managerId"
          control={control}
          render={({ field }) => (
            <Select
              {...field}
              options={managerOptions}
              placeholder="Выберите начальника"
              allowClear
              disabled={
                possibleManagers.length === 0 && selectedRole === "admin"
              }
            />
          )}
        />
      </Form.Item>
      {selectedRole !== "user" && subordinates.length > 0 && (
        <Form.Item label="Подчинённые">
          <Select
            options={subordinates.map((s) => ({ value: s.id, label: s.name }))}
            placeholder="Список подчинённых"
            allowClear
          />
        </Form.Item>
      )}
      <Form.Item style={{ marginBottom: 0, marginTop: 24 }}>
        <Space style={{ width: "100%", justifyContent: "flex-end" }}>
          <Button onClick={onCancel}>Отмена</Button>
          <Button type="primary" htmlType="submit" loading={loading}>
            {user ? "Сохранить" : "Создать"}
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );
}
