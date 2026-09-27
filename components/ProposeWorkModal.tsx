"use client";

import { useState } from "react";
import { Check, Send, X } from "lucide-react";
import { useAppStore } from "@/lib/store";

/**
 * Модальное окно «Предложить работу».
 *
 * Ключевое правило логики (Logic.MD): предложение НИКОГДА не создаёт новый
 * заказ. Поэтому здесь можно выбрать только уже опубликованный открытый
 * заказ заказчика — либо тот, что передан в `presetOrderId` (например, при
 * переходе со страницы заказа), либо любой из открытых.
 *
 * Компонент общий для каталога `/specialists` и детальной страницы
 * `/specialists/[id]`, чтобы не дублировать один и тот же сценарий.
 */
export function ProposeWorkModal({
  specialistName,
  presetOrderId,
  onClose,
  onSent,
}: {
  specialistName: string;
  presetOrderId?: string | null;
  onClose: () => void;
  onSent?: () => void;
}) {
  const orders = useAppStore((s) => s.orders);
  const sendOffer = useAppStore((s) => s.sendOffer);
  const [sent, setSent] = useState<string | null>(null);

  const presetOrder = presetOrderId
    ? orders.find((o) => o.id === presetOrderId && o.status === "open")
    : undefined;
  // Если пришли с конкретного заказа — предлагаем именно его, иначе список
  // всех открытых заказов. Так исключаем случайную отправку не того заказа.
  const openOrders = presetOrder ? [presetOrder] : orders.filter((o) => o.status === "open");

  function choose(orderId: string) {
    sendOffer(orderId, specialistName);
    setSent(orderId);
    onSent?.();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={onClose}>
      <div className="w-full max-w-lg rounded-3xl bg-paper p-5 shadow-pop" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-accent-ink">Предложение работы</p>
            <h2 className="mt-1 font-display text-xl font-extrabold">{specialistName}</h2>
          </div>
          <button onClick={onClose} className="rounded-full p-2 text-ink-soft hover:bg-surface" aria-label="Закрыть">
            <X size={20} />
          </button>
        </div>

        {sent ? (
          <div className="mt-5 rounded-2xl border border-accent/30 bg-accent-soft p-5 text-center">
            <span className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-accent text-night">
              <Check size={22} />
            </span>
            <p className="mt-3 font-display text-base font-extrabold text-ink">Предложение отправлено</p>
            <p className="mt-1 text-sm text-ink-soft">
              Мастер увидит его в разделе «Предложения» и сможет принять, отложить или отклонить.
            </p>
            <button onClick={onClose} className="mt-4 rounded-xl bg-accent px-5 py-2.5 text-sm font-bold text-night">
              Готово
            </button>
          </div>
        ) : (
          <>
            <p className="mt-2 text-sm text-ink-soft">
              Выберите уже опубликованный заказ. Новый заказ создан не будет — предложение привязано к существующему.
            </p>
            <div className="mt-5 max-h-[55vh] space-y-2 overflow-auto">
              {openOrders.length === 0 && (
                <p className="rounded-xl bg-surface p-4 text-sm text-ink-soft">
                  У вас нет открытых заказов. Сначала создайте заказ, затем предложите работу специалисту.
                </p>
              )}
              {openOrders.map((order) => (
                <button
                  key={order.id}
                  onClick={() => choose(order.id)}
                  className="w-full rounded-2xl border border-line p-4 text-left transition hover:border-accent hover:bg-accent-soft"
                >
                  <p className="font-display text-sm font-extrabold">{order.serviceName}</p>
                  <p className="mt-1 text-xs text-ink-soft">
                    № {order.code} · {order.address || "адрес не указан"}
                  </p>
                  <p className="mt-2 flex items-center gap-2 text-xs font-semibold text-accent-ink">
                    <Send size={13} /> Выбрать этот заказ
                  </p>
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
