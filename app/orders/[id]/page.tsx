"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ChevronLeft,
  MapPin,
  Clock,
  Ruler,
  Layers,
  Send,
  Check,
  FileText,
  Copy,
  Ticket,
  Eye,
  CalendarDays,
} from "lucide-react";
import { useAppStore } from "@/lib/store";
import { formatOrderDate, pluralize } from "@/lib/format";

const PREMISE_LABELS: Record<string, string> = {
  new: "Новостройка",
  secondary: "Вторичка",
  commercial: "Коммерция",
  country: "Загородный объект",
};
const CONDITION_LABELS: Record<string, string> = {
  rough: "Черновая",
  finished: "Чистовая",
};

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const role = useAppStore((s) => s.role);
  const order = useAppStore((s) => s.orders.find((o) => o.id === id));
  const responses = useAppStore((s) => s.responses.filter((r) => r.orderId === id));
  const offers = useAppStore((s) => s.offers.filter((o) => o.orderId === id));
  const updateOfferStatus = useAppStore((s) => s.updateOfferStatus);
  const addResponse = useAppStore((s) => s.addResponse);
  const matchOrder = useAppStore((s) => s.matchOrder);
  const useFreeResponseOrTicket = useAppStore((s) => s.useFreeResponseOrTicket);
  const spendTicket = useAppStore((s) => s.spendTicket);
  const ticketsBalance = useAppStore((s) => s.ticketsBalance);
  const subscriptionActive = useAppStore((s) => s.subscriptionActive);
  const incrementViews = useAppStore((s) => s.incrementViews);

  // Засчитываем просмотр один раз при открытии страницы. В реальном
  // приложении это делал бы сервер с дедупликацией по пользователю/сессии —
  // здесь для демо достаточно простого инкремента на клиенте.
  useEffect(() => {
    if (id) incrementViews(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const [message, setMessage] = useState("");
  const [price, setPrice] = useState(order?.budgetMin ?? 0);
  const [sent, setSent] = useState(responses.length > 0);
  const [activeMedia, setActiveMedia] = useState(0);
  const [responseNotice, setResponseNotice] = useState<string | null>(null);
  const [inviteError, setInviteError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  if (!order) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-3 p-6 text-center">
        <p className="text-sm text-ink-soft">Заказ не найден или уже удалён.</p>
        <button type="button" onClick={() => router.push("/feed")} className="-my-1.5 inline-flex items-center py-1.5 text-sm font-semibold text-accent-ink">
          Вернуться в ленту
        </button>
      </div>
    );
  }

  function submitResponse() {
    if (!order) return;
    const result = useFreeResponseOrTicket();
    if (result === "blocked") {
      setResponseNotice(
        "Бесплатные отклики на сегодня закончились, а билетов на балансе нет. Пополните баланс или оформите подписку в профиле."
      );
      return;
    }
    addResponse({
      id: `resp-${Date.now()}`,
      orderId: order.id,
      message,
      price,
      createdAt: Date.now(),
    });
    setResponseNotice(
      result === "free" ? "Использован бесплатный отклик дня." : "Списан 1 билет с баланса."
    );
    setSent(true);
  }

  function hireResponder() {
    if (!order) return;
    const ok = spendTicket();
    if (!ok) {
      setInviteError("Недостаточно билетов, чтобы предложить работу. Пополните баланс в профиле.");
      return;
    }
    setInviteError(null);
    matchOrder(order.id);
    router.push(`/chats/${order.id}`);
  }

  function copyCode() {
    if (!order) return;
    navigator.clipboard?.writeText(order.code).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div className="flex flex-1 flex-col">
      <header className="sticky top-0 z-10 flex items-center gap-3 border-b border-line bg-paper/95 px-4 py-3 backdrop-blur lg:mx-auto lg:w-full lg:max-w-content">
        <button
          onClick={() => router.back()}
          className="rounded-full p-1 text-ink-soft active:bg-surface"
          aria-label="Назад"
        >
          <ChevronLeft size={22} />
        </button>
        <p className="truncate font-display text-sm font-bold">{order.serviceName}</p>
      </header>

      <main className="flex-1 overflow-y-auto pb-28 lg:mx-auto lg:w-full lg:max-w-content">
        {order.media.length > 0 && (
          <div className="relative aspect-[4/3] w-full bg-ink">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={order.media[activeMedia]?.dataUrl}
              alt=""
              className="h-full w-full object-cover"
            />
            {order.media.length > 1 && (
              <div className="absolute bottom-2 left-1/2 flex -translate-x-1/2 gap-1.5">
                {order.media.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveMedia(i)}
                    className={`h-1.5 rounded-full transition-all ${
                      i === activeMedia ? "w-5 bg-accent" : "w-1.5 bg-paper/60"
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        <div className="space-y-4 p-4">
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={copyCode}
              className="flex items-center gap-1.5 rounded-full border border-line px-2.5 py-1 text-xs font-medium text-ink-soft active:bg-surface"
            >
              <Copy size={12} /> № {order.code}
              {copied && <span className="text-ok">скопировано</span>}
            </button>
            <span className="flex items-center gap-1 text-xs text-ink-faint">
              <CalendarDays size={12} /> {formatOrderDate(order.createdAt)}
            </span>
            <span className="flex items-center gap-1 text-xs text-ink-faint">
              <Eye size={12} />{" "}
              {Number.isFinite(order.views) && order.views > 0
                ? order.views
                : "нет просмотров"}
            </span>
            <span className="flex items-center gap-1 text-xs text-ink-faint">
              <Send size={12} />
              {responses.length} {pluralize(responses.length, "отклик", "отклика", "откликов")}
            </span>
          </div>

          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-ok">
              {order.category} · {order.subcategory}
            </p>
            <p className="mt-2 price-tag inline-block bg-accent px-3 py-1.5 font-display text-lg font-extrabold text-night">
              {order.budgetMin.toLocaleString("ru-RU")} – {order.budgetMax.toLocaleString("ru-RU")} ₽
            </p>
            {order.budgetPerSqmMin !== undefined && order.budgetPerSqmMax !== undefined && (
              <p className="mt-1.5 text-xs text-ink-soft">
                {order.budgetPerSqmMin.toLocaleString("ru-RU")}–
                {order.budgetPerSqmMax.toLocaleString("ru-RU")} ₽/м²
              </p>
            )}
          </div>

          <div className="flex items-start gap-2 rounded-xl border border-line p-2.5 text-sm">
            <MapPin size={16} className="mt-0.5 shrink-0 text-ink-soft" />
            {role === "master" && order.status !== "matched" ? (
              <span className="text-ink-soft">
                Точный адрес откроется после того, как заказчик одобрит ваш отклик
                ({order.distanceKm?.toFixed(1) ?? "—"} км от вас)
              </span>
            ) : (
              <span>{order.address?.trim() ? order.address : "не указана"}</span>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="flex items-center gap-2 rounded-xl border border-line p-2.5">
              <Ruler size={16} className="text-ink-soft" />
              <span>{order.areaOver1000 ? "более 1000 м²" : `${order.areaSqm} м²`}</span>
            </div>
            <div className="flex items-center gap-2 rounded-xl border border-line p-2.5">
              <Layers size={16} className="text-ink-soft" />
              <span>
                {PREMISE_LABELS[order.premise]}, {CONDITION_LABELS[order.condition]}
              </span>
            </div>
            <div className="flex items-center gap-2 rounded-xl border border-line p-2.5">
              <MapPin size={16} className="text-ink-soft" />
              <span>{order.distanceKm?.toFixed(1) ?? "—"} км от вас</span>
            </div>
            <div className="flex items-center gap-2 rounded-xl border border-line p-2.5">
              <Clock size={16} className="text-ink-soft" />
              <span>{order.deadlineDays} дн.</span>
            </div>
          </div>

          {order.description && (
            <div className="rounded-xl border border-line p-3">
              <p className="mb-1 text-xs font-semibold text-ink-soft">Описание задачи</p>
              <p className="whitespace-pre-wrap text-sm text-ink">{order.description}</p>
            </div>
          )}

          {order.documents.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs font-semibold text-ink-soft">Прикреплённые документы</p>
              {order.documents.map((doc) => (
                <a
                  key={doc.id}
                  href={doc.dataUrl}
                  download={doc.name}
                  className="flex items-center gap-2 rounded-xl border border-line px-3 py-2"
                >
                  <FileText size={18} className="shrink-0 text-ink-soft" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-medium text-ink">{doc.name}</p>
                    <p className="text-xs text-ink-faint">{doc.sizeKb} КБ</p>
                  </div>
                </a>
              ))}
            </div>
          )}

          {order.status === "matched" && (
            <div className="rounded-xl bg-ok/10 p-3 text-sm font-medium text-ok">
              Отклик одобрен заказчиком — чат открыт.
            </div>
          )}

          {order.status === "cancelled" && (
            <div className="rounded-xl bg-danger-soft p-3 text-sm font-medium text-danger">
              Заказ отменён заказчиком и больше не виден в общей ленте.
            </div>
          )}

          {/* Мастер: форма отклика — с учётом бесплатного лимита/билетов */}
          {role === "master" && !sent && order.status === "open" && (
            <div className="space-y-3 rounded-2xl border border-line p-4">
              <p className="font-display text-sm font-bold">Откликнуться на заказ</p>
              <div>
                <label className="mb-1 block text-xs font-medium text-ink-soft">
                  Ваша цена, ₽
                </label>
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(Number(e.target.value))}
                  className="w-full rounded-lg border border-line px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-ink-soft">
                  Сопроводительное письмо (до 500 символов)
                </label>
                <textarea
                  value={message}
                  maxLength={500}
                  rows={3}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Опишите опыт в этом виде работ, сроки, что входит в цену…"
                  className="w-full resize-none rounded-lg border border-line px-3 py-2 text-sm"
                />
                <p className="mt-1 text-right text-xs text-ink-faint">
                  {message.length}/500
                </p>
              </div>
              {responseNotice && (
                <p className="rounded-lg bg-danger-soft px-3 py-2 text-xs text-danger">
                  {responseNotice}
                </p>
              )}
              <button
                onClick={submitResponse}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-accent py-2.5 font-semibold text-night"
              >
                <Send size={16} /> Отправить отклик
              </button>
              <p className="flex items-center justify-center gap-1 text-xs text-ink-faint">
                <Ticket size={12} />
                {subscriptionActive
                  ? "У вас активна подписка — отклики без ограничений"
                  : `Билетов на балансе: ${ticketsBalance}`}
              </p>
            </div>
          )}

          {role === "master" && sent && order.status === "open" && (
            <div className="space-y-2 rounded-2xl border border-line p-4 text-center">
              <p className="font-display text-sm font-bold text-ok">Отклик отправлен</p>
              <p className="text-xs text-ink-soft">
                {responseNotice ?? "Заказчик получил уведомление о вашем отклике."}
              </p>
            </div>
          )}

          {role === "customer" && order.status === "open" && (
            <Link
              href={`/specialists?orderId=${encodeURIComponent(order.id)}`}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-accent py-3 text-sm font-bold text-night"
            >
              Найти специалиста и предложить этот заказ
            </Link>
          )}

          {/* Заказчик: список полученных откликов */}
          {role === "customer" && offers.length > 0 && (
            <div className="space-y-2 rounded-2xl border border-line p-4">
              <p className="font-display text-sm font-bold">Предложения специалистам ({offers.length})</p>
              {offers.map((offer) => (
                <div key={offer.id} className="flex items-center gap-3 rounded-xl bg-surface p-3">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold">{offer.specialistName}</p>
                    <p className="text-xs text-ink-soft">
                      {offer.status === "pending" ? "Ожидает решения" : offer.status === "snoozed" ? "Отложено специалистом" : offer.status === "accepted" ? "Принято" : offer.status === "declined" ? "Отклонено" : "Закрыто"}
                    </p>
                  </div>
                  {(offer.status === "pending" || offer.status === "snoozed") && (
                    <button onClick={() => updateOfferStatus(offer.id, "cancelled")} className="rounded-lg px-2.5 py-1.5 text-xs font-semibold text-ink-soft hover:bg-paper">Отменить</button>
                  )}
                </div>
              ))}
            </div>
          )}

          {role === "customer" && order.status === "open" && (
            <div className="space-y-3">
              <p className="font-display text-sm font-bold">
                Отклики мастеров ({responses.length})
              </p>
              {responses.length === 0 && (
                <p className="text-xs text-ink-soft">
                  Пока никто не откликнулся. Мастера с подходящей специализацией видят
                  заказ в своей ленте.
                </p>
              )}
              {responses.map((r) => (
                <div key={r.id} className="space-y-2 rounded-xl border border-line p-3">
                  <p className="font-semibold text-accent-ink">{r.price.toLocaleString("ru-RU")} ₽</p>
                  {r.message && <p className="text-sm text-ink-soft">{r.message}</p>}
                  <button
                    onClick={hireResponder}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-accent py-2 text-sm font-semibold text-night"
                  >
                    <Check size={15} /> Предложить работу (1 билет)
                  </button>
                </div>
              ))}
              {inviteError && (
                <p className="rounded-lg bg-danger-soft px-3 py-2 text-xs text-danger">
                  {inviteError}
                </p>
              )}
              <p className="flex items-center justify-center gap-1 text-xs text-ink-faint">
                <Ticket size={12} />
                {subscriptionActive
                  ? "У вас активна подписка — приглашения без ограничений"
                  : `Билетов на балансе: ${ticketsBalance}`}
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
