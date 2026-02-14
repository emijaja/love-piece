import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "写真から文章を作成",
  description: "写真をアップロードして文章を自動生成するアプリ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className="antialiased">{children}</body>
    </html>
  );
}
