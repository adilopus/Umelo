import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ServiceWorkerRegister } from "./sw-register";
import { DesktopTopNav } from "@/components/DesktopTopNav";

export const metadata: Metadata = {
  title: "UMELO — Сделаем",
  description: "Платформа для людей, которые строят, ремонтируют и создают",
  manifest: "/manifest.json",
  appleWebApp: { capable: true, statusBarStyle: "default", title: "UMELO" },
};

export const viewport: Viewport = { themeColor: "#F5C400", width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="ru"><body className="font-body bg-paper text-ink antialiased"><ServiceWorkerRegister /><div className="relative mx-auto flex min-h-screen w-full max-w-md flex-col lg:max-w-none"><DesktopTopNav />{children}</div></body></html>;
}
