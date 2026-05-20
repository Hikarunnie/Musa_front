import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Nemesis — Craft Market",
  description: "Discover and sell unique handmade goods",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}