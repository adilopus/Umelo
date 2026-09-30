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
  ShoppingBag,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { Role } from "@/lib/types";
import { useAppStore } from "@/lib/store";
import { roleOption } from "@/lib/roles";
import { BottomNav } from "@/components/BottomNav";
import { StatsPanel } from "@/components/StatsPanel";
import { FavoritesPanel } from "@/components/FavoritesPanel";
import { SubscriptionPanel } from "@/components/SubscriptionPanel";
import { MasterProfilePanel } from "@/components/MasterProfilePanel";
import { ContentDashboard } from "@/components/ContentDashboard";
import { PersonalDataPanel } from "@/components/PersonalDataPanel";
import { PageHeader } from "@/components/ui/PageHeader";
import { PageShell } from "@/components/ui/PageShell";

type TabId = "personal" | "stats" | "extra" | "favorites" | "subscription";

/** Иконка роли в бейдже: она должна совпадать со смыслом вкладки, не путать. */
const ROLE_ICON: Record<Role, LucideIcon> = {
  customer: ShoppingBag,
  master: UserCog,
  blogger: Newspaper,
  seller: Megaphone,
  admin: Crown,
};

const EXTRA_TAB: Partial<Record<string, { label: string; icon: LucideIcon }>> = {
  master: { label: "Мастер", icon: UserCog },
  blogger: { label: "Контент", icon: Newspaper },
  seller: { label: "Анонсы", icon: Megaphone },
};

/**
 * Роль, под которой человек работает. Раньше её можно было поменять только
 * в /profile, а в самом кабинете не было видно ничего — вкладки «Статистика»,
 * «Мастер» или «Контент» менялись, и по ним приходилось угадывать роль.
 * Бейдж назван явно и ведёт к переключателю.
 */
function RoleBadge({ role }: { role: Role }) {
  const option = roleOption(role);
  const Icon = ROLE_ICON[role] ?? UserCog;

  return (
    <div className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1.5">
      <span className="inline-flex items-center gap-1.5 rounded-full bg-accent-soft px-2.5 py-1 text-xs font-bold text-accent-ink">
        <Icon size={13} aria-hidden="true" />
        {option.short}
      </span>
      <span className="text-xs text-ink-faint">{option.hint}</span>
      <Link
        href="/profile"
        className="-my-1.5 inline-flex items-center py-1.5 text-xs font-semibold text-accent-ink hover:underline"
      >
        Сменить роль
      </Link>
    </div>
  );
}

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
    <main className="flex-1">
      <PageShell padBottom="pb-12">
        <PageHeader title="Личный кабинет">
          <div className="flex gap-1 overflow-x-auto border-b border-line no-scrollbar">
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
        </PageHeader>

        <RoleBadge role={role} />
        <div className="max-w-form">
        {isAdmin && (
          <div className="mb-4 max-w-form space-y-2 rounded-2xl border border-line p-4">
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
      </div>
      </PageShell>

      <BottomNav />
    </main>
  );
}
