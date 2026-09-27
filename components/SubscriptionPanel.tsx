"use client";

import { Ticket } from "lucide-react";
import { useAppStore } from "@/lib/store";
import { Role } from "@/lib/types";

const HINT_BY_ROLE: Partial<Record<Role, string>> = {
  master: "3 отклика в день бесплатно, дальше — 1 билет за отклик.",
  customer: "Приглашение мастера в работу — 1 билет.",
  blogger: "Продвижение статьи или видео в топ ленты — 3 билета.",
  seller: "Продвижение объявления в топ ленты — 3 билета.",
};

export function SubscriptionPanel() {
  const role = useAppStore((s) => s.role);
  const ticketsBalance = useAppStore((s) => s.ticketsBalance);
  const subscriptionActive = useAppStore((s) => s.subscriptionActive);
  const addTickets = useAppStore((s) => s.addTickets);
  const toggleSubscription = useAppStore((s) => s.toggleSubscription);

  return (
    <div className="space-y-3">
      <div className="rounded-2xl border border-line p-4">
        <p className="flex items-center gap-1.5 font-display text-sm font-bold">
          <Ticket size={16} className="text-accent-ink" /> Баланс билетов
        </p>
        <p className="mt-2 font-display text-2xl font-extrabold text-ink">
          {ticketsBalance} <span className="text-sm font-normal text-ink-soft">билетов</span>
        </p>
        <p className="mt-1 text-xs text-ink-faint">{HINT_BY_ROLE[role]}</p>
        <button
          onClick={() => addTickets(5)}
          className="mt-3 w-full rounded-lg border border-line py-2 text-xs font-semibold text-ink-soft active:bg-surface"
        >
          Пополнить на 5 (демо)
        </button>
      </div>

      <div className="rounded-2xl border border-line p-4">
        <p className="font-display text-sm font-bold">Подписка UMELO Про</p>
        <p className="mt-1 text-xs text-ink-soft">
          Безлимитные отклики/приглашения/продвижения без списания билетов за
          каждое действие.
        </p>
        <button
          onClick={toggleSubscription}
          className={`mt-3 w-full rounded-xl py-2.5 text-sm font-semibold ${
            subscriptionActive ? "bg-ok/10 text-ok" : "bg-accent text-night"
          }`}
        >
          {subscriptionActive ? "Подписка активна ✓" : "Оформить подписку (демо)"}
        </button>
      </div>
    </div>
  );
}
