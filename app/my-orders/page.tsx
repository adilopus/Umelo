"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

import { CalendarDays, Eye, MapPin, Pencil, Plus, RotateCcw, Send, XCircle } from "lucide-react";
import { useAppStore } from "@/lib/store";
import { BottomNav } from "@/components/BottomNav";
import { MyOrdersToolbar } from "@/components/MyOrdersToolbar";
import { formatOrderDate, pluralize } from "@/lib/format";
import { STATUS_META } from "@/lib/status";
import { CUSTOMER_ME } from "@/lib/mockData";
import {
  EMPTY_ORDER_FILTERS,
  applyOrderFilters,
  sortOrders,
  type OrderFilters,
  type OrderSort,
} from "@/lib/orderSearch";
import { Chip } from "@/components/ui/Chip";
import { ButtonLink } from "@/components/ui/Button";
import { PageHeader } from "@/components/ui/PageHeader";
import { PageShell } from "@/components/ui/PageShell";

const ACTION_CLASS =
  "inline-flex min-h-11 items-center justify-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-bold transition";

export default function MyOrdersPage() {
  const role = useAppStore((s) => s.role);
  const orders = useAppStore((s) => s.orders);
  const responses = useAppStore((s) => s.responses);
  const cancelOrder = useAppStore((s) => s.cancelOrder);
  const restoreOrder = useAppStore((s) => s.restoreOrder);

  const [confirmingId, setConfirmingId] = useState<string | null>(null);
  const [filters, setFilters] = useState<OrderFilters>(EMPTY_ORDER_FILTERS);
  const [sort, setSort] = useState<OrderSort>("new");

  // Хуки обязаны вызываться до ранних return'ов ниже: смена роли (например,
  // переключатель в профиле) иначе изменила бы их количество между рендерами.
  // Заказчик видит только свои заказы. Чужие скрыты и недоступны для правки —
  // владелец определяется по authorId, а не по роли, иначе любой заказчик в
  // приложении получил бы кнопки на всех карточках подряд.
  const myOrders = useMemo(
    () => orders.filter((o) => o.authorId === CUSTOMER_ME),
    [orders]
  );
  const visible = useMemo(
    () => sortOrders(applyOrderFilters(myOrders, filters), sort),
    [myOrders, filters, sort]
  );

  if (role === "admin") {
    return (
      <main className="flex-1">
        <PageShell>
          <PageHeader title="Мои заказы" />
          <p className="text-sm text-ink-soft">
            Администратор управляет всеми заказами через панель администратора.
          </p>
          <Link href="/admin" className="mt-3 inline-block text-sm font-semibold text-accent-ink">
            Открыть панель администратора
          </Link>
        </PageShell>
        <BottomNav />
      </main>
    );
  }

  // Мастер откликается на чужие заказы — в этом разделе показываем его отклики.
  if (role === "master") {
    const respondedOrderIds = new Set(responses.map((r) => r.orderId));
    const myResponseOrders = orders.filter((o) => respondedOrderIds.has(o.id));

    return (
      <main className="flex-1">
        <PageShell padBottom="pb-12">
          <PageHeader
            title="Мои отклики"
            subtitle={`${myResponseOrders.length} ${pluralize(myResponseOrders.length, "отклик", "отклика", "откликов")}`}
            actions={
              <>
                <Link href="/orders" className="hidden rounded-xl bg-accent-soft px-3 py-2 text-xs font-bold text-accent-ink lg:block">
                  Все заказы
                </Link>
                <Link href="/offers" className="hidden rounded-xl bg-accent-soft px-3 py-2 text-xs font-bold text-accent-ink lg:block">Предложения</Link>
              </>
            }
          />
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
        </PageShell>
        <BottomNav />
      </main>
    );
  }

  return (
    <main className="flex-1">
      <PageShell padBottom="pb-12">
        <PageHeader title="Мои заказы" />
        {myOrders.length === 0 ? (
          <div className="mt-10 text-center">
            <p className="text-sm text-ink-soft">Вы ещё не публиковали заказы.</p>
            <ButtonLink href="/orders/new" size="sm" className="mt-3">
              Разместить заказ
            </ButtonLink>
          </div>
        ) : (
          <>
            <MyOrdersToolbar
              filters={filters}
              onChange={setFilters}
              sort={sort}
              onSortChange={setSort}
              orders={myOrders}
              found={visible.length}
            />

            <div className="grid gap-3 lg:grid-cols-2">
              {visible.length === 0 && (
                <p className="py-8 text-center text-sm text-ink-soft">
                  Ни один заказ не подходит под выбранные фильтры.
                </p>
              )}
              {visible.map((order) => {
                const responseCount = responses.filter((r) => r.orderId === order.id).length;
                const status = STATUS_META[order.status];
                // Отменять и править имеет смысл только то, что ещё можно
                // изменить: заказ в работе уже отдан мастеру, завершённый
                // закрыт навсегда.
                const canCancel = order.status === "open" || order.status === "matched";
                const canRestore = order.status === "cancelled";
                const canEdit = order.status !== "matched" && order.status !== "closed";
                const isConfirming = confirmingId === order.id;

                return (
                  <div
                    key={order.id}
                    data-order-card={order.code}
                    className="overflow-hidden rounded-2xl border border-line"
                  >
                    <Link href={`/orders/${order.id}`} className="flex gap-4 p-4">
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

                    {/* Действия вынесены в подвал карточки отдельной строкой.
                        Раньше отмена была «крестиком» у правого края — на
                        телефоне он наезжал на вёрстку и попадал в мелкую
                        тач-зону, поэтому здесь явная кнопка с подписью. */}
                    {(canEdit || canCancel || canRestore) && (
                      <div className="flex flex-wrap items-center gap-2 border-t border-line px-3 py-2.5">
                        {canEdit && (
                          <Link
                            href={`/orders/${order.id}/edit`}
                            className={`${ACTION_CLASS} border border-line text-ink-soft hover:bg-surface`}
                          >
                            <Pencil size={14} /> Изменить
                          </Link>
                        )}
                        {canCancel && !isConfirming && (
                          <button
                            onClick={() => setConfirmingId(order.id)}
                            aria-label={`Отменить заказ № ${order.code}`}
                            className={`${ACTION_CLASS} border border-danger/30 text-danger`}
                          >
                            <XCircle size={14} /> Отменить
                          </button>
                        )}
                        {canRestore && (
                          <button
                            onClick={() => restoreOrder(order.id)}
                            aria-label={`Восстановить заказ № ${order.code}`}
                            className={`${ACTION_CLASS} bg-accent text-night`}
                          >
                            <RotateCcw size={14} /> Восстановить
                          </button>
                        )}
                        {!canCancel && !canRestore && !canEdit && (
                          <span className="text-xs text-ink-faint">
                            Заказ закрыт — изменить его нельзя
                          </span>
                        )}
                      </div>
                    )}

                    {isConfirming && (
                      <div className="flex flex-wrap items-center gap-2 border-t border-line bg-surface px-3 py-2.5">
                        <span className="min-w-0 flex-1 text-xs text-ink-soft">
                          Отменить заказ № {order.code}? Он перестанет быть виден мастерам.
                          Действие можно отменить кнопкой «Восстановить».
                        </span>
                        <button
                          onClick={() => setConfirmingId(null)}
                          className="inline-flex min-h-11 items-center rounded-xl px-3 text-xs font-medium text-ink-soft active:bg-paper"
                        >
                          Нет
                        </button>
                        <button
                          onClick={() => {
                            cancelOrder(order.id);
                            setConfirmingId(null);
                          }}
                          aria-label={`Да, отменить заказ № ${order.code}`}
                          className={`${ACTION_CLASS} bg-danger text-white`}
                        >
                          Да, отменить
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </>
        )}
      </PageShell>

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
    </main>
  );
}
