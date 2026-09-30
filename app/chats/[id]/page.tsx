"use client";

import { useState, useRef, useEffect } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { Send, MapPin, Check } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { PageShell } from "@/components/ui/PageShell";
import { useAppStore } from "@/lib/store";

export default function ChatPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const searchParams = useSearchParams();
  const role = useAppStore((s) => s.role);
  const order = useAppStore((s) => s.orders.find((o) => o.id === id));
  const messages = useAppStore((s) => s.messages.filter((m) => m.orderId === id));
  const offers = useAppStore((s) => s.offers);
  const addMessage = useAppStore((s) => s.addMessage);
  const acceptOffer = useAppStore((s) => s.acceptOffer);

  const offerId = searchParams.get("offerId");
  const offer = offers.find((o) => o.id === offerId) ?? offers.find((o) => o.orderId === id && (o.status === "pending" || o.status === "snoozed"));
  const [text, setText] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages.length]);

  if (!order) {
    return <div className="flex flex-1 flex-col items-center justify-center gap-3 p-6 text-center"><p className="text-sm text-ink-soft">Чат не найден.</p><button type="button" onClick={() => router.push("/chats")} className="-my-1.5 inline-flex items-center py-1.5 text-sm font-semibold text-accent-ink">Вернуться к чатам</button></div>;
  }

  function send() {
    if (!order || !text.trim()) return;
    addMessage({ id: `msg-${Date.now()}`, orderId: order.id, author: role === "master" ? "master" : "customer", text: text.trim(), createdAt: Date.now() });
    setText("");
  }

  function shareLocation() {
    if (!order) return;
    addMessage({ id: `msg-${Date.now()}`, orderId: order.id, author: role === "master" ? "master" : "customer", text: "📍 Геолокация объекта отправлена", createdAt: Date.now() });
  }

  return (
    <main className="flex-1">
      <PageShell padBottom="pb-4">
        <PageHeader
          back
          fallbackHref={role === "master" && offer ? "/offers" : "/chats"}
          title={order.serviceName}
          subtitle={`№ ${order.code}`}
        />

        {offer && offer.status !== "accepted" && role === "master" && (
          <div className="mt-4 w-full rounded-2xl border border-accent/30 bg-accent-soft p-4">
            <p className="text-xs font-bold uppercase tracking-wider text-accent-ink">Предложение работы</p>
            <p className="mt-1 text-sm text-ink-soft">Можно обсудить детали в чате, а затем принять или отклонить заказ.</p>
            <button onClick={() => acceptOffer(offer.id)} className="mt-3 flex items-center gap-2 rounded-xl bg-accent px-4 py-2.5 text-xs font-bold text-night"><Check size={14} /> Принять заказ</button>
          </div>
        )}

        <div className="mt-5 space-y-2">
          {messages.length === 0 && <p className="mt-6 text-center text-xs text-ink-faint">Защищённый чат открыт. Можно обсудить детали, стоимость и сроки.</p>}
          {messages.map((m) => (
            <div key={m.id} className={`max-w-[75%] rounded-2xl px-3 py-2 text-sm ${m.author === role ? "ml-auto bg-accent text-night rounded-tr-sm" : "mr-auto bg-surface text-ink rounded-tl-sm"}`}>
              {m.text}
            </div>
          ))}
          <div ref={bottomRef} />
        </div>
      </PageShell>

      <footer className="border-t border-line bg-paper px-3 py-2.5">
        <div className="mx-auto flex w-full max-w-shell items-center gap-2 px-1 sm:px-3">
          <button onClick={shareLocation} className="shrink-0 rounded-full border border-line p-2.5 text-ink-soft" aria-label="Отправить геолокацию"><MapPin size={18} /></button>
          <input value={text} onChange={(e) => setText(e.target.value)} onKeyDown={(e) => e.key === "Enter" && send()} placeholder="Написать сообщение…" className="flex-1 rounded-full border border-line px-4 py-2.5 text-sm" />
          <button onClick={send} className="shrink-0 rounded-full bg-accent p-2.5 text-night" aria-label="Отправить"><Send size={18} /></button>
        </div>
      </footer>
    </main>
  );
}
