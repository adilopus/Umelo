"use client";

import { useState } from "react";
import Link from "next/link";

import { CalendarDays, Eye, MapPin, Plus, Send, X } from "lucide-react";
import { useAppStore } from "@/lib/store";
import { BottomNav } from "@/components/BottomNav";
import { formatOrderDate, pluralize } from "@/lib/format";
import { STATUS_META } from "@/lib/status";
import { Chip } from "@/components/ui/Chip";
import { ButtonLink } from "@/components/ui/Button";

export default function MyOrdersPage() {
  const role = useAppStore((s) => s.role);
  const orders = useAppStore((s) => s.orders);
  const responses = useAppStore((s) => s.responses);
  const cancelOrder = useAppStore((s) => s.cancelOrder);

  const [confirmingId, setConfirmingId] = useState<string | null>(null);

  if (role === "admin") {
    return (
      <div className="flex flex-1 flex-col">
        <header className="border-b border-line px-4 py-3 lg:mx-auto lg:w-full lg:max-w-content lg:border-0 lg:px-0 lg:pb-4 lg:pt-8">
          <p className="font-display text-lg font-extrabold">Мои заказы</p>
        </header>
        <main className="flex-1 px-4 pb-10 pt-6 text-center sm:px-6 lg:px-8 lg:mx-auto lg:w-full lg:max-w-content">
          <p className="text-sm text-ink-soft">
            Администратор управляет всеми заказами через панель администратора.
          </p>
          <Link href="/admin" className="mt-3 inline-block text-sm font-semibold text-accent-ink">
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
        <header className="border-b border-line px-4 py-3 lg:mx-auto lg:w-full lg:max-w-content lg:border-0 lg:px-0 lg:pb-4 lg:pt-8">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="font-display text-lg font-extrabold">Мои отклики</p>
              <p className="text-xs text-ink-soft">
                {myResponseOrders.length}{" "}
                {pluralize(myResponseOrders.length, "отклик", "отклика", "откликов")}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Link href="/orders" className="rounded-xl bg-accent-soft px-3 py-2 text-xs font-bold text-accent-ink">
                Все заказы
              </Link>
              <Link href="/offers" className="rounded-xl bg-accent-soft px-3 py-2 text-xs font-bold text-accent-ink">Предложения</Link>
            </div>
          </div>
        </header>
        <main className="flex-1 space-y-3 px-4 pt-6 pb-24 sm:px-6 lg:px-8 lg:mx-auto lg:w-full lg:max-w-content lg:pb-12">
          {myResponseOrders.length === 0 && (
            <div className="mt-10 text-center">
              <p className="text-sm text-ink-soft">
                Вы ещё не откликались на заказы.
              </p>
              <ButtonLink href="/orders" size="sm" className="mt-3">
                Найти заказы
              </ButtonLink>
            </div>
          )}
          {myResponseOrders.map((order) => {
            const status = STATUS_META[order.status];
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
                  <p className="text-xs text-ink-faint">
                    № {order.code} · {formatOrderDate(order.createdAt)}
                  </p>
                  <div className="flex flex-wrap items-center gap-2 pt-0.5">
                    <Chip size="sm" tone={status.tone}>
                      {status.label}
                    </Chip>
                    {myResponse && (
                      <span className="text-xs font-semibold text-ink">
                        Ваш ценник: {myResponse.price.toLocaleString("ru-RU")} ₽
                      </span>
                    )}
                  </div>
                  {myResponse?.message?.trim() && (
                    <p className="line-clamp-2 text-xs text-ink-faint">
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
      <header className="border-b border-line px-4 py-3 lg:mx-auto lg:w-full lg:max-w-content lg:border-0 lg:px-0 lg:pb-4 lg:pt-8">
        <p className="font-display text-lg font-extrabold">Мои заказы</p>
      </header>

      <main className="flex-1 space-y-3 px-4 pt-6 pb-24 sm:px-6 lg:px-8 lg:mx-auto lg:w-full lg:max-w-content lg:pb-12">
        {orders.length === 0 && (
          <p className="mt-10 text-center text-sm text-ink-soft">
            Вы ещё не публиковали заказы.
          </p>
        )}
        {orders.map((order) => {
          const responseCount = responses.filter((r) => r.orderId === order.id).length;
          const status = STATUS_META[order.status];
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
                      <Chip size="sm" tone={status.tone} className="shrink-0">
                        {status.label}
                      </Chip>
                    </div>

                    <p className="flex items-center gap-1 truncate text-xs text-ink-soft">
                      <MapPin size={12} className="shrink-0" />{" "}
                      {order.address?.trim() ? order.address : "адрес не указан"}
                    </p>
                    <p className="flex items-center gap-1 text-xs text-ink-faint">
                      <CalendarDays size={11} className="shrink-0" />{" "}
                      {formatOrderDate(order.createdAt)} · № {order.code}
                    </p>

                    <span className="price-tag mt-1 inline-block bg-accent px-2.5 py-1 font-display text-xs font-bold text-night">
                      {order.budgetMin.toLocaleString("ru-RU")}–
                      {order.budgetMax.toLocaleString("ru-RU")} ₽
                    </span>

                    <div className="flex items-center gap-3 pt-0.5 text-xs text-ink-faint">
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
                    className="shrink-0 rounded-lg px-3 py-1.5 text-xs font-medium text-ink-soft active:bg-paper"
                  >
                    Нет
                  </button>
                  <button
                    onClick={() => {
                      cancelOrder(order.id);
                      setConfirmingId(null);
                    }}
                    className="inline-flex min-h-10 shrink-0 items-center rounded-lg bg-accent px-3 py-1.5 text-xs font-semibold text-night"
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
          className="pointer-events-auto flex h-14 w-14 items-center justify-center rounded-full bg-accent text-night shadow-pop shadow-accent/30 active:scale-95"
        >
          <Plus size={26} strokeWidth={2.5} />
        </Link>
      </div>

      <BottomNav />
    </div>
  );
}
