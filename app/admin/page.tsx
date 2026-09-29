"use client";

import { useState } from "react";
import Link from "next/link";
import { Trash2, Ban, CheckCircle2, Star } from "lucide-react";
import { useAppStore } from "@/lib/store";
import { BackButton } from "@/components/ui/BackButton";

type Tab = "orders" | "articles" | "users";

export default function AdminPage() {
  const role = useAppStore((s) => s.role);
  const orders = useAppStore((s) => s.orders);
  const deleteOrder = useAppStore((s) => s.deleteOrder);
  const articles = useAppStore((s) => s.articles);
  const deleteArticle = useAppStore((s) => s.deleteArticle);
  const setArticlePromoted = useAppStore((s) => s.setArticlePromoted);
  const users = useAppStore((s) => s.users);
  const banUser = useAppStore((s) => s.banUser);
  const unbanUser = useAppStore((s) => s.unbanUser);
  const deleteUser = useAppStore((s) => s.deleteUser);

  const [tab, setTab] = useState<Tab>("orders");

  if (role !== "admin") {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-3 p-6 text-center">
        <p className="text-sm text-ink-soft">
          Панель администратора доступна только в роли «Администратор».
        </p>
        <Link href="/feed" className="-my-1.5 inline-flex items-center py-1.5 text-sm font-semibold text-accent-ink">
          Вернуться в ленту
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col">
      <header className="flex items-center gap-3 border-b border-line px-4 py-3 lg:mx-auto lg:w-full lg:max-w-content">
        <BackButton fallbackHref="/profile" />
        <p className="font-display text-sm font-bold">Панель администратора</p>
      </header>

      <div className="flex border-b border-line px-4 lg:mx-auto lg:w-full lg:max-w-content">
        {([
          ["orders", `Заказы (${orders.length})`],
          ["articles", `Статьи (${articles.length})`],
          ["users", `Пользователи (${users.length})`],
        ] as [Tab, string][]).map(([id, label]) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={`border-b-2 px-3 py-2.5 text-xs font-semibold ${
              tab === id ? "border-accent text-accent-ink" : "border-transparent text-ink-faint"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <main className="flex-1 space-y-2 overflow-y-auto px-4 pt-6 pb-10 sm:px-6 lg:px-8 lg:mx-auto lg:w-full lg:max-w-content">
        {tab === "orders" &&
          orders.map((o) => (
            <div key={o.id} className="flex items-center gap-3 rounded-xl border border-line p-3">
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-ink">{o.serviceName}</p>
                <p className="text-xs text-ink-faint">
                  № {o.code} · {o.status}
                </p>
              </div>
              <button
                onClick={() => deleteOrder(o.id)}
                className="shrink-0 rounded-lg p-2 text-danger active:bg-danger-soft"
                aria-label="Удалить заказ"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        {tab === "orders" && orders.length === 0 && (
          <p className="text-center text-sm text-ink-soft">Заказов нет.</p>
        )}

        {tab === "articles" &&
          articles.map((a) => (
            <div key={a.id} className="flex items-center gap-3 rounded-xl border border-line p-3">
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-ink">{a.title}</p>
                <p className="text-xs text-ink-faint">
                  {a.authorName} {a.promoted && "· в топе"}
                </p>
              </div>
              <button
                onClick={() => setArticlePromoted(a.id, !a.promoted)}
                className={`shrink-0 rounded-lg p-2 ${a.promoted ? "text-accent-ink" : "text-ink-faint"} active:bg-surface`}
                aria-label="Переключить топ"
              >
                <Star size={16} fill={a.promoted ? "currentColor" : "none"} />
              </button>
              <button
                onClick={() => deleteArticle(a.id)}
                className="shrink-0 rounded-lg p-2 text-danger active:bg-danger-soft"
                aria-label="Удалить статью"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        {tab === "articles" && articles.length === 0 && (
          <p className="text-center text-sm text-ink-soft">Статей нет.</p>
        )}

        {tab === "users" &&
          users.map((u) => (
            <div key={u.id} className="flex items-center gap-3 rounded-xl border border-line p-3">
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-ink">{u.name}</p>
                <p className="text-xs text-ink-faint">
                  {u.role} · {u.status === "active" ? "активен" : "заблокирован"}
                </p>
              </div>
              {u.status === "active" ? (
                <button
                  onClick={() => banUser(u.id)}
                  className="shrink-0 rounded-lg p-2 text-warn active:bg-surface"
                  aria-label="Заблокировать"
                >
                  <Ban size={16} />
                </button>
              ) : (
                <button
                  onClick={() => unbanUser(u.id)}
                  className="shrink-0 rounded-lg p-2 text-ok active:bg-surface"
                  aria-label="Разблокировать"
                >
                  <CheckCircle2 size={16} />
                </button>
              )}
              <button
                onClick={() => deleteUser(u.id)}
                className="shrink-0 rounded-lg p-2 text-danger active:bg-danger-soft"
                aria-label="Удалить пользователя"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        {tab === "users" && users.length === 0 && (
          <p className="text-center text-sm text-ink-soft">Пользователей нет.</p>
        )}
      </main>
    </div>
  );
}
