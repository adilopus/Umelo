"use client";

import { useState } from "react";
import Link from "next/link";
import {
  User as UserIcon,
  Crown,
  LayoutGrid,
  LogOut,
  Mail,
  Lock,
} from "lucide-react";
import { useAppStore } from "@/lib/store";
import { BottomNav } from "@/components/BottomNav";
import { ROLE_OPTIONS } from "@/lib/roles";
import { PageHeader } from "@/components/ui/PageHeader";
import { PageShell } from "@/components/ui/PageShell";

const ROLE_CHOICES = ROLE_OPTIONS.filter((r) => r.id !== "admin");

export default function ProfilePage() {
  const role = useAppStore((s) => s.role);
  const setRole = useAppStore((s) => s.setRole);
  const adminUnlocked = useAppStore((s) => s.adminUnlocked);

  const isAuthenticated = useAppStore((s) => s.isAuthenticated);
  const authName = useAppStore((s) => s.authName);
  const login = useAppStore((s) => s.login);
  const logout = useAppStore((s) => s.logout);

  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleSubmit() {
    if (!email.trim() || !password.trim()) return;
    // Демо-режим без бэкенда: настоящей проверки пароля нет, просто
    // "входим" под введённым email — интерфейс формы настоящий,
    // сама авторизация — заглушка.
    login(email.trim());
  }

  return (
    <main className="flex-1">
      <PageShell padBottom="pb-12">
        <PageHeader title="Профиль" />
        {isAuthenticated ? (
          <div className="flex items-center gap-3 rounded-2xl border border-line p-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-surface">
              <UserIcon size={26} className="text-ink-soft" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate font-display text-base font-bold">{authName}</p>
              <p className="text-xs text-ink-soft">Вы вошли · демо-режим</p>
            </div>
            <button
              onClick={logout}
              className="flex shrink-0 items-center gap-1 rounded-lg border border-line px-2.5 py-1.5 text-xs font-medium text-ink-soft active:bg-surface"
            >
              <LogOut size={13} /> Выйти
            </button>
          </div>
        ) : (
          <div className="space-y-3 rounded-2xl border border-line p-4">
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setMode("login")}
                className={`rounded-lg py-2 text-sm font-semibold ${
                  mode === "login" ? "bg-accent-soft text-accent-ink" : "text-ink-soft"
                }`}
              >
                Войти
              </button>
              <button
                onClick={() => setMode("register")}
                className={`rounded-lg py-2 text-sm font-semibold ${
                  mode === "register" ? "bg-accent-soft text-accent-ink" : "text-ink-soft"
                }`}
              >
                Зарегистрироваться
              </button>
            </div>

            <div className="flex items-center gap-2 rounded-lg border border-line px-3 py-2">
              <Mail size={15} className="shrink-0 text-ink-faint" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email или телефон"
                className="min-h-8 w-full bg-transparent text-sm outline-none placeholder:text-ink-faint"
              />
            </div>
            <div className="flex items-center gap-2 rounded-lg border border-line px-3 py-2">
              <Lock size={15} className="shrink-0 text-ink-faint" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Пароль"
                className="min-h-8 w-full bg-transparent text-sm outline-none placeholder:text-ink-faint"
              />
            </div>

            <button
              onClick={handleSubmit}
              disabled={!email.trim() || !password.trim()}
              className="w-full rounded-xl bg-accent py-2.5 text-sm font-semibold text-night disabled:opacity-40"
            >
              {mode === "login" ? "Войти" : "Создать аккаунт"}
            </button>
            <p className="text-center text-xs text-ink-faint">
              Демо-режим: настоящей проверки пароля нет, вход выполняется по
              любому email — данные хранятся только в этом браузере.
            </p>
          </div>
        )}

        <div>
          <p className="mb-2 text-sm font-semibold">Ваша роль</p>
          <div className="flex flex-col gap-2">
            {ROLE_CHOICES.map((opt) => (
              <button
                key={opt.id}
                onClick={() => setRole(opt.id)}
                className={`rounded-xl border py-2.5 text-sm font-medium ${
                  role === opt.id
                    ? "border-accent bg-accent-soft text-accent-ink"
                    : "border-line text-ink-soft"
                }`}
              >
                {opt.label}
              </button>
            ))}
            {adminUnlocked && (
              <button
                onClick={() => setRole("admin")}
                className={`flex items-center justify-center gap-1.5 rounded-xl border py-2.5 text-sm font-medium ${
                  role === "admin"
                    ? "border-accent bg-accent-soft text-accent-ink"
                    : "border-line text-ink-soft"
                }`}
              >
                <Crown size={14} /> Администратор
              </button>
            )}
          </div>
        </div>

        {role === "admin" ? (
          <div className="space-y-2 rounded-2xl border border-line p-4">
            <p className="flex items-center gap-1.5 font-display text-sm font-bold">
              <Crown size={16} className="text-accent-ink" /> Администратор
            </p>
            <p className="text-xs text-ink-soft">
              Полный доступ к управлению заказами, статьями и пользователями.
            </p>
            <Link
              href="/admin"
              className="block w-full rounded-xl bg-accent py-2.5 text-center text-sm font-semibold text-night"
            >
              Открыть панель администратора
            </Link>
          </div>
        ) : (
          <div className="space-y-2 rounded-2xl border border-line p-4">
            <p className="flex items-center gap-1.5 font-display text-sm font-bold">
              <LayoutGrid size={16} className="text-accent-ink" /> Личный кабинет
            </p>
            <p className="text-xs text-ink-soft">
              Статистика, избранное и подписка — а для исполнителя, блогера и
              продавца ещё и своя рабочая вкладка (анкета/контент/анонсы).
            </p>
            <Link
              href="/cabinet"
              className="block w-full rounded-xl bg-accent py-2.5 text-center text-sm font-semibold text-night"
            >
              Открыть личный кабинет
            </Link>
          </div>
        )}

        <div className="rounded-2xl border border-line p-4 text-xs text-ink-soft">
          Верификация через Госуслуги/СБП пока не подключена в этой демо-версии — добавляется
          на следующем этапе разработки.
        </div>
      </PageShell>

      <BottomNav />
    </main>
  );
}
