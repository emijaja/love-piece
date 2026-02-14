import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Love Letter Generator",
  description: "あなたの大切な人へ感謝の気持ちを贈りましょう",
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
