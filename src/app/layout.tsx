import type { Metadata } from "next";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { ConfigProvider } from "antd";
import "./globals.css";
import ruRu from "antd/locale/ru_RU";

export const metadata: Metadata = {
  title: "CRUD Пользователи",
  description: "Управление пользователями",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru">
      <body>
        <AntdRegistry>
          <ConfigProvider
            locale={ruRu}
            theme={{
              token: {
                colorPrimary: "#00FF00",
                borderRadius: 6,
              },
            }}
          >
            {children}
          </ConfigProvider>
        </AntdRegistry>
      </body>
    </html>
  );
}
