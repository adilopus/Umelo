"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { Bell, MessageCircle, Megaphone, Hand, Check } from "lucide-react";
import { useAppStore } from "@/lib/store";
import { buildNotifications, type NotificationKind } from "@/lib/notifications";

const KIND_ICON: Record<NotificationKind, typeof Bell> = {
  response: Hand,
  offer: Megaphone,
  message: MessageCircle,
};

const KIND_LABEL: Record<NotificationKind, string> = {
  response: "Отклик",
  offer: "Предложение",
  message: "Сообщение",
};

function relativeTime(at: number): string {
  const diff = Date.now() - at;
  if (diff < 60_000) return "только что";
  const min = Math.floor(diff / 60_000);
  if (min < 60) return `${min} мин назад`;
  const hours = Math.floor(min / 60);
  if (hours < 24) return `${hours} ч назад`;
  return `${Math.floor(hours / 24)} дн назад`;
}

export function NotificationsMenu() {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  const role = useAppStore((s) => s.role);
  const orders = useAppStore((s) => s.orders);
  const responses = useAppStore((s) => s.responses);
  const offers = useAppStore((s) => s.offers);
  const messages = useAppStore((s) => s.messages);
  const readIds = useAppStore((s) => s.readNotificationIds);
  const markRead = useAppStore((s) => s.markNotificationsRead);

  const items = useMemo(
    () => buildNotifications({ role, orders, responses, offers, messages }),
    [role, orders, responses, offers, messages]
  );

  const readSet = useMemo(() => new Set(readIds), [readIds]);
  const unread = items.filter((n) => !readSet.has(n.id)).length;

  // Закрытие по клику вне и по Escape — поведение, ожидаемое от всплывающего
  // меню; без него панель перекрывала бы контент до перезагрузки.
  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const toggle = () => {
    const next = !open;
    setOpen(next);
    // Открытие сразу считает показанные прочитанными, поэтому счётчик не
    // «залипает» после того, как человек ознакомился со списком.
    if (next && unread > 0) markRead(items.map((n) => n.id));
  };

  return (
    <div className="relative" ref={wrapRef}>
      <button
        onClick={toggle}
        aria-expanded={open}
        aria-haspopup="dialog"
        aria-label={unread > 0 ? `Уведомления: ${unread} непрочитанных` : "Уведомления"}
        className="relative flex h-9 w-9 items-center justify-center rounded-full text-white/70 hover:bg-paper/10 hover:text-white"
      >
        <Bell size={17} />
        {unread > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent px-1 text-[10px] font-bold leading-none text-night">
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </button>

      {open && (
        <div
          role="dialog"
          aria-label="Уведомления"
          className="absolute right-0 top-11 z-30 w-80 overflow-hidden rounded-2xl border border-line bg-paper shadow-card sm:w-96"
        >
          <div className="flex items-center justify-between border-b border-line px-4 py-3">
            <p className="text-sm font-bold">Уведомления</p>
            {items.length > 0 && (
              <span className="text-xs text-ink-faint">{items.length} за всё время</span>
            )}
          </div>

          {items.length === 0 ? (
            <div className="px-4 py-10 text-center">
              <span className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-accent-soft text-accent-ink">
                <Check size={20} />
              </span>
              <p className="text-sm font-semibold">Пока пусто</p>
              <p className="mx-auto mt-1 max-w-[24ch] text-xs text-ink-faint">
                Здесь появятся отклики на ваши заказы, предложения и новые сообщения.
              </p>
            </div>
          ) : (
            <ul className="max-h-[60vh] overflow-y-auto">
              {items.map((n) => {
                const Icon = KIND_ICON[n.kind];
                const isUnread = !readSet.has(n.id);
                return (
                  <li key={n.id} className="border-b border-line last:border-0">
                    <Link
                      href={n.href}
                      onClick={() => setOpen(false)}
                      className="flex gap-3 px-4 py-3 transition hover:bg-accent-soft/40"
                    >
                      <span
                        className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent-soft text-accent-ink"
                        aria-hidden="true"
                      >
                        <Icon size={15} />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="flex items-baseline gap-2">
                          <span className="truncate text-sm font-semibold">{n.title}</span>
                          <span className="ml-auto shrink-0 text-[11px] text-ink-faint">
                            {relativeTime(n.at)}
                          </span>
                        </span>
                        <span className="mt-0.5 block truncate text-xs text-ink-soft">
                          {n.detail}
                        </span>
                        <span className="mt-1 inline-block rounded bg-accent-soft px-1.5 py-0.5 text-[10px] font-semibold text-accent-ink">
                          {KIND_LABEL[n.kind]}
                        </span>
                        {isUnread && <span className="sr-only">Не прочитано</span>}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}

          <div className="border-t border-line px-4 py-2.5">
            <Link
              href={role === "master" ? "/orders" : "/my-orders"}
              onClick={() => setOpen(false)}
              className="-my-1.5 inline-flex items-center py-1.5 text-xs font-semibold text-accent-ink hover:underline"
            >
              Все заказы
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
