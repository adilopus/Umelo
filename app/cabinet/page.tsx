"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  BarChart3,
  Heart,
  Ticket,
  UserCog,
  Newspaper,
  Megaphone,
  Contact,
  Crown,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useAppStore } from "@/lib/store";
import { BottomNav } from "@/components/BottomNav";
import { StatsPanel } from "@/components/StatsPanel";
import { FavoritesPanel } from "@/components/FavoritesPanel";
import { SubscriptionPanel } from "@/components/SubscriptionPanel";
import { MasterProfilePanel } from "@/components/MasterProfilePanel";
import { ContentDashboard } from "@/components/ContentDashboard";
import { PersonalDataPanel } from "@/components/PersonalDataPanel";

type TabId = "personal" | "stats" | "extra" | "favorites" | "subscription";

const EXTRA_TAB: Partial<Record<string, { label: string; icon: LucideIcon }>> = {
  master: { label: "Мастер", icon: UserCog },
  blogger: { label: "Контент", icon: Newspaper },
  seller: { label: "Анонсы", icon: Megaphone },
};

const VALID_TABS: TabId[] = ["personal", "stats", "extra", "favorites", "subscription"];

export default function CabinetPage() {
  const role = useAppStore((s) => s.role);
  const [tab, setTab] = useState<TabId>("personal");

  // Поддержка прямых ссылок вида /cabinet?tab=extra (например, «Создать →
  // работа в портфолио» у мастера). Читаем query уже на клиенте, чтобы не
  // требовать Suspense-обёртку вокруг useSearchParams при статическом рендере.
  useEffect(() => {
    const requested = new URLSearchParams(window.location.search).get("tab");
    if (requested && VALID_TABS.includes(requested as TabId)) {
      setTab(requested as TabId);
    }
  }, []);

  const isAdmin = role === "admin";
  const extra = EXTRA_TAB[role];

  // "Мои данные" — общая вкладка для всех ролей, включая администратора.
  // У администратора остальных вкладок кабинета нет — вместо статистики и
  // подписки у него отдельная панель управления по ссылке ниже.
  const tabs: { id: TabId; label: string; icon: LucideIcon }[] = [
    { id: "personal", label: "Мои данные", icon: Contact },
    ...(!isAdmin
      ? [
          { id: "stats" as const, label: "Статистика", icon: BarChart3 },
          ...(extra ? [{ id: "extra" as const, label: extra.label, icon: extra.icon }] : []),
          { id: "favorites" as const, label: "Избранное", icon: Heart },
          { id: "subscription" as const, label: "Подписка", icon: Ticket },
        ]
      : []),
  ];

  return (
    <div className="flex flex-1 flex-col">
      <header className="border-b border-line px-4 py-3 lg:mx-auto lg:w-full lg:max-w-content lg:border-0 lg:px-0 lg:pb-4 lg:pt-8">
        <p className="font-display text-lg font-extrabold">Личный кабинет</p>
      </header>

      <div className="flex gap-1 overflow-x-auto border-b border-line px-4 no-scrollbar lg:mx-auto lg:w-full lg:max-w-content lg:border-0 lg:px-0">
        {tabs.map((t) => {
          const Icon = t.icon;
          const active = tab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex shrink-0 items-center gap-1.5 border-b-2 px-3 py-2.5 text-xs font-semibold transition ${
                active ? "border-accent text-accent-ink" : "border-transparent text-ink-faint"
              }`}
            >
              <Icon size={14} /> {t.label}
            </button>
          );
        })}
      </div>

      <main className="flex-1 overflow-y-auto px-4 py-4 pb-24 lg:mx-auto lg:w-full lg:max-w-content lg:pb-12">
        {isAdmin && (
          <div className="mb-4 space-y-2 rounded-2xl border border-line p-4">
            <p className="flex items-center gap-1.5 font-display text-sm font-bold">
              <Crown size={16} className="text-accent-ink" /> Администратор
            </p>
            <p className="text-xs text-ink-soft">
              Полный доступ к управлению заказами, статьями и пользователями —
              в отдельной панели.
            </p>
            <Link
              href="/admin"
              className="block w-full rounded-xl bg-accent py-2.5 text-center text-sm font-semibold text-night"
            >
              Открыть панель администратора
            </Link>
          </div>
        )}

        {tab === "personal" && <PersonalDataPanel />}
        {tab === "stats" && <StatsPanel />}
        {tab === "extra" && role === "master" && <MasterProfilePanel />}
        {tab === "extra" && (role === "blogger" || role === "seller") && (
          <ContentDashboard role={role} />
        )}
        {tab === "favorites" && <FavoritesPanel />}
        {tab === "subscription" && <SubscriptionPanel />}
      </main>

      <BottomNav />
    </div>
  );
}
