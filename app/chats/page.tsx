"use client";

import Link from "next/link";
import { useAppStore } from "@/lib/store";
import { BottomNav } from "@/components/BottomNav";
import { MessageCircle } from "lucide-react";

export default function ChatsListPage() {
  const orders = useAppStore((s) => s.orders);
  const offers = useAppStore((s) => s.offers);
  const messages = useAppStore((s) => s.messages);

  const chatOrderIds = new Set([
    ...orders.filter((o) => o.status === "matched").map((o) => o.id),
    ...offers.filter((o) => o.status === "pending" || o.status === "snoozed" || o.status === "accepted").map((o) => o.orderId),
  ]);
  const chatOrders = orders.filter((o) => chatOrderIds.has(o.id));

  return (
    <div className="flex flex-1 flex-col">
      <header className="border-b border-line px-4 py-3 lg:mx-auto lg:w-full lg:max-w-content lg:border-0 lg:px-0 lg:pb-4 lg:pt-8">
        <p className="font-display text-lg font-extrabold">Чаты</p>
      </header>
      <main className="flex-1 px-4 py-4 pb-24 lg:mx-auto lg:w-full lg:max-w-content lg:pb-12">
        {chatOrders.length === 0 && (
          <div className="mt-16 flex flex-col items-center gap-2 text-center">
            <MessageCircle size={32} className="text-ink-faint" />
            <p className="text-sm text-ink-soft">Здесь появятся переговоры по заказам и предложениям.</p>
          </div>
        )}
        <div className="space-y-2">
          {chatOrders.map((order) => {
            const last = messages.filter((m) => m.orderId === order.id).slice(-1)[0];
            const offer = offers.find((o) => o.orderId === order.id && ["pending", "snoozed", "accepted"].includes(o.status));
            return (
              <Link key={order.id} href={`/chats/${order.id}${offer ? `?offerId=${offer.id}` : ""}`} className="flex items-center gap-3 rounded-2xl border border-line p-3">
                <div className="h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-ink">
                  {order.media[0] && <img src={order.media[0].dataUrl} alt="" className="h-full w-full object-cover" />}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-display text-sm font-bold">{order.serviceName}</p>
                  <p className="truncate text-xs text-ink-soft">{last ? last.text : offer ? "Предложение работы — можно обсудить детали" : "Начните переговоры о заказе"}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </main>
      <BottomNav />
    </div>
  );
}
