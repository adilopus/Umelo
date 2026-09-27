"use client";

import { useState } from "react";
import Link from "next/link";

import { CalendarDays, Eye, MapPin, Plus, Send, X } from "lucide-react";
import { useAppStore } from "@/lib/store";
import { BottomNav } from "@/components/BottomNav";
import { formatOrderDate, pluralize } from "@/lib/format";

const STATUS_LABELS: Record<string, { text: string; className: string }> = {
  open: { text: "Ищем мастера", className: "bg-accent-soft text-accent" },
  matched: { text: "В работе", className: "bg-ok/10 text-ok" },
  cancelled: { text: "Отменён", className: "bg-red-50 text-red-500" },
  closed: { text: "Завершён", className: "bg-surface text-ink-soft" },
};

export default function MyOrdersPage() {
  const role = useAppStore((s) => s.role);
  const orders = useAppStore((s) => s.orders);
  const responses = useAppStore((s) => s.responses);
  const cancelOrder = useAppStore((s) => s.cancelOrder);

  const [confirmingId, setConfirmingId] = useState<string | null>(null);

  if (role === "admin") {
    return (
      <div className="flex flex-1 flex-col">
        <header className="border-b border-line px-4 py-3 lg:mx-auto lg:w-full lg:max-w-3xl lg:border-0 lg:px-0 lg:pb-4 lg:pt-8">
          <p className="font-display text-lg font-extrabold">Мои заказы</p>
        </header>
        <main className="flex-1 px-4 py-10 text-center lg:mx-auto lg:w-full lg:max-w-3xl">
          <p className="text-sm text-ink-soft">
            Администратор управляет всеми заказами через панель администратора.
          </p>
          <Link href="/admin" className="mt-3 inline-block text-sm font-semibold text-accent">
            Открыть панель администратора
          </Link>
        </main>
        <BottomNav />
      </div>
    );
  }

  // Мастер откликается на чужие заказы — в этом разделе показываем его отклики.
  if (role === "master") {
    const respondedOrderIds = new Set(responses.map((r) => r.orderId));
    const myResponseOrders = orders.filter((o) => respondedOrderIds.has(o.id));

    return (
      <div className="flex flex-1 flex-col">
        <header className="border-b border-line px-4 py-3 lg:mx-auto lg:w-full lg:max-w-3xl lg:border-0 lg:px-0 lg:pb-4 lg:pt-8">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="font-display text-lg font-extrabold">Мои отклики</p>
              <p className="text-xs text-ink-soft">
                {myResponseOrders.length}{" "}
                {pluralize(myResponseOrders.length, "отклик", "отклика", "откликов")}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Link href="/orders" className="rounded-xl bg-accent-soft px-3 py-2 text-xs font-bold text-accent">
                Все заказы
              </Link>
              <Link href="/offers" className="rounded-xl bg-accent-soft px-3 py-2 text-xs font-bold text-accent">Предложения</Link>
            </div>
          </div>
        </header>
        <main className="flex-1 space-y-3 px-4 py-4 pb-24 lg:mx-auto lg:w-full lg:max-w-3xl lg:pb-12">
          {myResponseOrders.length === 0 && (
            <div className="mt-10 text-center">
              <p className="text-sm text-ink-soft">
                Вы ещё не откликались на заказы.
              </p>
              <Link
                href="/orders"
                className="mt-3 inline-block rounded-xl bg-accent px-4 py-2 text-sm font-bold text-white"
              >
                Найти заказы
              </Link>
            </div>
          )}
          {myResponseOrders.map((order) => {
            const status = STATUS_LABELS[order.status];
            const myResponse = responses.find((r) => r.orderId === order.id);
            return (
              <Link
                key={order.id}
                href={`/orders/${order.id}`}
                className="flex gap-4 rounded-2xl border border-line p-4"
              >
                <div className="h-24 w-24 shrink-0 overflow-hidden rounded-2xl bg-ink">
                  {order.media[0] && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={order.media[0].dataUrl} alt="" className="h-full w-full object-cover" />
                  )}
                </div>
                <div className="min-w-0 flex-1 space-y-1">
                  <p className="truncate font-display text-sm font-bold">{order.serviceName}</p>
                  <p className="flex items-center gap-1 truncate text-xs text-ink-soft">
                    <MapPin size={12} className="shrink-0" />{" "}
                    {order.address?.trim() ? order.address : "адрес не указан"}
                  </p>
                  <p className="text-[11px] text-ink-faint">
                    № {order.code} · {formatOrderDate(order.createdAt)}
                  </p>
                  <div className="flex flex-wrap items-center gap-2 pt-0.5">
                    <span
                      className={`inline-block rounded-full px-2 py-0.5 text-[11px] font-medium ${status.className}`}
                    >
                      {status.text}
                    </span>
                    {myResponse && (
                      <span className="text-[11px] font-semibold text-ink">
                        Ваш ценник: {myResponse.price.toLocaleString("ru-RU")} ₽
                      </span>
                    )}
                  </div>
                  {myResponse?.message?.trim() && (
                    <p className="line-clamp-2 text-[11px] text-ink-faint">
                      «{myResponse.message.trim()}»
                    </p>
                  )}
                </div>
              </Link>
            );
          })}
        </main>
        <BottomNav />
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col">
      <header className="border-b border-line px-4 py-3 lg:mx-auto lg:w-full lg:max-w-3xl lg:border-0 lg:px-0 lg:pb-4 lg:pt-8">
        <p className="font-display text-lg font-extrabold">Мои заказы</p>
      </header>

      <main className="flex-1 space-y-3 px-4 py-4 pb-24 lg:mx-auto lg:w-full lg:max-w-3xl lg:pb-12">
        {orders.length === 0 && (
          <p className="mt-10 text-center text-sm text-ink-soft">
            Вы ещё не публиковали заказы.
          </p>
        )}
        {orders.map((order) => {
          const responseCount = responses.filter((r) => r.orderId === order.id).length;
          const status = STATUS_LABELS[order.status];
          const canCancel = order.status === "open" || order.status === "matched";

          return (
            <div key={order.id} className="rounded-2xl border border-line">
              <div className="flex gap-4 p-4">
                <Link href={`/orders/${order.id}`} className="flex min-w-0 flex-1 gap-4">
                  <div className="h-24 w-24 shrink-0 overflow-hidden rounded-2xl bg-ink">
                    {order.media[0] && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={order.media[0].dataUrl}
                        alt=""
                        className="h-full w-full object-cover"
                      />
                    )}
                  </div>
                  <div className="min-w-0 flex-1 space-y-1">
                    <div className="flex items-start justify-between gap-2">
                      <p className="font-display text-sm font-bold leading-tight">
                        {order.serviceName}
                      </p>
                      <span
                        className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-medium ${status.className}`}
                      >
                        {status.text}
                      </span>
                    </div>

                    <p className="flex items-center gap-1 truncate text-xs text-ink-soft">
                      <MapPin size={12} className="shrink-0" />{" "}
                      {order.address?.trim() ? order.address : "адрес не указан"}
                    </p>
                    <p className="flex items-center gap-1 text-[11px] text-ink-faint">
                      <CalendarDays size={11} className="shrink-0" />{" "}
                      {formatOrderDate(order.createdAt)} · № {order.code}
                    </p>

                    <span className="price-tag mt-1 inline-block bg-accent px-2.5 py-1 font-display text-xs font-bold text-white">
                      {order.budgetMin.toLocaleString("ru-RU")}–
                      {order.budgetMax.toLocaleString("ru-RU")} ₽
                    </span>

                    <div className="flex items-center gap-3 pt-0.5 text-[11px] text-ink-faint">
                      <span className="flex items-center gap-1">
                        <Eye size={12} />{" "}
                        {Number.isFinite(order.views) && order.views > 0 ? order.views : 0}
                      </span>
                      <span className="flex items-center gap-1">
                        <Send size={12} /> {responseCount}{" "}
                        {pluralize(responseCount, "отклик", "отклика", "откликов")}
                      </span>
                    </div>
                  </div>
                </Link>

                {canCancel && (
                  <button
                    onClick={() => setConfirmingId(order.id)}
                    className="h-fit shrink-0 rounded-full p-2 text-ink-faint active:bg-surface"
                    aria-label="Отменить заказ"
                  >
                    <X size={18} />
                  </button>
                )}
              </div>

              {confirmingId === order.id && (
                <div className="flex items-center gap-2 border-t border-line bg-surface px-3 py-2.5">
                  <span className="flex-1 text-xs text-ink-soft">
                    Точно отменить этот заказ? Действие нельзя отменить обратно.
                  </span>
                  <button
                    onClick={() => setConfirmingId(null)}
                    className="shrink-0 rounded-lg px-3 py-1.5 text-xs font-medium text-ink-soft active:bg-white"
                  >
                    Нет
                  </button>
                  <button
                    onClick={() => {
                      cancelOrder(order.id);
                      setConfirmingId(null);
                    }}
                    className="shrink-0 rounded-lg bg-accent px-3 py-1.5 text-xs font-semibold text-white"
                  >
                    Да, отменить
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </main>

      {/* Дублируем кнопку размещения заказа здесь же — на "Моих заказах"
          у заказчика логично сразу предложить создать ещё один, а не
          заставлять возвращаться в Ленту. Только мобильный, только для
          заказчика (эта ветка) — десктоп уже имеет кнопку в шапке. */}
      <div className="pointer-events-none fixed inset-x-0 bottom-20 z-20 mx-auto flex max-w-md justify-end px-4 lg:hidden">
        <Link
          href="/orders/new"
          aria-label="Разместить заказ"
          className="pointer-events-auto flex h-14 w-14 items-center justify-center rounded-full bg-accent text-white shadow-lg shadow-accent/30 active:scale-95"
        >
          <Plus size={26} strokeWidth={2.5} />
        </Link>
      </div>

      <BottomNav />
    </div>
  );
}
