"use client";

import Link from "next/link";
import { Archive, Check, MessageCircle, RotateCcw, Send, X } from "lucide-react";
import { useAppStore } from "@/lib/store";
import { formatOrderDate } from "@/lib/format";

export default function OffersPage() {
  const role = useAppStore((s) => s.role);
  const orders = useAppStore((s) => s.orders);
  const offers = useAppStore((s) => s.offers);
  const updateOfferStatus = useAppStore((s) => s.updateOfferStatus);
  const acceptOffer = useAppStore((s) => s.acceptOffer);

  if (role !== "master") {
    return (
      <main className="mx-auto w-full max-w-content px-4 py-10">
        <div className="rounded-2xl border border-line bg-paper p-6 text-center">
          <h1 className="font-display text-xl font-extrabold">Предложения</h1>
          <p className="mt-2 text-sm text-ink-soft">Этот раздел предназначен для специалиста. Переключите роль на «Я исполнитель» в профиле.</p>
          <Link href="/profile" className="mt-4 inline-block rounded-xl bg-accent px-5 py-2.5 text-sm font-bold text-night">Открыть профиль</Link>
        </div>
      </main>
    );
  }

  const active = offers.filter((o) => o.status === "pending" || o.status === "snoozed");
  const archived = offers.filter((o) => o.status === "accepted" || o.status === "declined" || o.status === "cancelled");

  return (
    <main className="min-h-[calc(100vh-64px)] bg-surface px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-content">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-accent-ink">Для специалиста</p>
            <h1 className="mt-1 font-display text-3xl font-extrabold text-ink">Предложения</h1>
            <p className="mt-1 text-sm text-ink-soft">Заказчики могут предложить вам уже опубликованный заказ.</p>
          </div>
          <Link href="/my-orders" className="hidden rounded-xl border border-line bg-paper px-4 py-2.5 text-sm font-semibold lg:block">Мои отклики</Link>
        </div>

        <section className="mt-6 space-y-3">
          {active.length === 0 && (
            <div className="rounded-2xl border border-line bg-paper p-8 text-center">
              <Send className="mx-auto text-ink-faint" size={30} />
              <p className="mt-3 font-display font-bold">Новых предложений пока нет</p>
              <p className="mt-1 text-sm text-ink-soft">Когда заказчик предложит вам работу, она появится здесь.</p>
            </div>
          )}

          {active.map((offer) => {
            const order = orders.find((o) => o.id === offer.orderId);
            if (!order) return null;
            return (
              <article key={offer.id} className="rounded-2xl border border-line bg-paper p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <span className="rounded-full bg-accent-soft px-2.5 py-1 text-xs font-bold text-accent-ink">
                      {offer.status === "snoozed" ? "Отложено" : "Новое предложение"}
                    </span>
                    <h2 className="mt-3 font-display text-lg font-extrabold">{order.serviceName}</h2>
                    <p className="mt-1 text-xs text-ink-soft">№ {order.code} · {order.address || "адрес не указан"} · {formatOrderDate(order.createdAt)}</p>
                  </div>
                  <span className="price-tag bg-accent px-3 py-1.5 font-display text-sm font-extrabold text-night">
                    {order.budgetMin.toLocaleString("ru-RU")} – {order.budgetMax.toLocaleString("ru-RU")} ₽
                  </span>
                </div>

                <div className="mt-4 rounded-xl bg-surface p-3 text-sm text-ink-soft">
                  Заказчик предлагает вам этот заказ. Можно открыть детали, начать разговор и только потом принять решение.
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  <Link href={`/orders/${order.id}`} className="rounded-xl border border-line px-4 py-2.5 text-xs font-bold text-ink">Открыть заказ</Link>
                  <Link href={`/chats/${order.id}?offerId=${offer.id}`} className="flex items-center gap-1.5 rounded-xl border border-line px-4 py-2.5 text-xs font-bold text-ink"><MessageCircle size={14} /> Написать</Link>
                  <button onClick={() => acceptOffer(offer.id)} className="flex items-center gap-1.5 rounded-xl bg-accent px-4 py-2.5 text-xs font-bold text-night"><Check size={14} /> Принять</button>
                  <button onClick={() => updateOfferStatus(offer.id, "snoozed")} className="flex items-center gap-1.5 rounded-xl border border-line px-4 py-2.5 text-xs font-bold text-ink-soft"><Archive size={14} /> Отложить</button>
                  <button onClick={() => updateOfferStatus(offer.id, "declined")} className="flex items-center gap-1.5 rounded-xl border border-danger/25 px-4 py-2.5 text-xs font-bold text-danger"><X size={14} /> Отклонить</button>
                </div>
              </article>
            );
          })}
        </section>

        {archived.length > 0 && (
          <section className="mt-8">
            <h2 className="font-display text-lg font-extrabold">История</h2>
            <div className="mt-3 space-y-2">
              {archived.map((offer) => {
                const order = orders.find((o) => o.id === offer.orderId);
                if (!order) return null;
                const label = offer.status === "accepted" ? "Принято" : offer.status === "declined" ? "Отклонено" : "Закрыто";
                return (
                  <div key={offer.id} className="flex items-center gap-3 rounded-2xl border border-line bg-paper p-4">
                    <div className="min-w-0 flex-1"><p className="truncate text-sm font-bold">{order.serviceName}</p><p className="text-xs text-ink-soft">№ {order.code}</p></div>
                    <span className="text-xs font-semibold text-ink-soft">{label}</span>
                    {offer.status === "declined" && <button onClick={() => updateOfferStatus(offer.id, "pending")} className="rounded-lg p-2 text-ink-soft" title="Вернуть в предложения"><RotateCcw size={15} /></button>}
                  </div>
                );
              })}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
