import type { ChatMessage, Order, Response, Role, WorkOffer } from "./types";
import { myOrdersTabHref } from "./format";

/**
 * Уведомления выводятся из уже существующих данных стора, а не хранятся
 * отдельной сущностью: в прототипе нет бэкенда, а события, о которых
 * интересно знать, уже есть — отклики на заказы, предложения и сообщения.
 *
 * Иконка колокольчика раньше была пустой кнопкой с постоянно горящей
 * точкой, поэтому нажатие ничего не делало.
 */
export type NotificationKind = "response" | "offer" | "message";

export interface AppNotification {
  id: string;
  kind: NotificationKind;
  title: string;
  detail: string;
  href: string;
  at: number;
}

export interface NotificationInput {
  role: Role;
  orders: Order[];
  responses: Response[];
  offers: WorkOffer[];
  messages: ChatMessage[];
}

/** Заказ по id — заголовок уведомления должен быть понятен без контекста. */
function orderTitle(order: Order | undefined, fallback: string): string {
  return order?.serviceName || order?.category || fallback;
}

/**
 * Сторона, которая пишет «не мне». В чатах сообщения делятся на customer и
 * master, поэтому входящее — то, где автор не совпадает с нашей ролью.
 * Для блогера и продавца чаты не являются рабочим каналом.
 */
function incomingAuthor(role: Role): ChatMessage["author"] | null {
  if (role === "customer") return "master";
  if (role === "master") return "customer";
  return null;
}

export function buildNotifications(input: NotificationInput): AppNotification[] {
  const { role, orders, responses, offers, messages } = input;
  const out: AppNotification[] = [];

  const byId = new Map(orders.map((o) => [o.id, o]));
  const ordersHref = myOrdersTabHref(role);

  // Отклик исполнителя на мой заказ.
  for (const r of responses) {
    const order = byId.get(r.orderId);
    if (!order) continue;                     // отклик на чужой заказ — не моё событие
    if (order.status === "cancelled" || order.status === "closed") continue;
    out.push({
      id: `response-${r.id}`,
      kind: "response",
      title: "Новый отклик на ваш заказ",
      detail: `${orderTitle(order, "Заказ")} — ${r.message || "отклик без текста"}`,
      href: `/orders/${order.id}`,
      at: r.createdAt,
    });
  }

  // Предложение исполнителя по моему заказу.
  for (const o of offers) {
    const order = byId.get(o.orderId);
    if (!order) continue;
    if (o.status === "declined" || o.status === "cancelled") continue;
    out.push({
      id: `offer-${o.id}`,
      kind: "offer",
      title: "Предложение по вашему заказу",
      detail: `${o.specialistName} — ${orderTitle(order, "заказ")}`,
      href: `/orders/${order.id}`,
      at: o.createdAt,
    });
  }

  // Сообщение в чате от второй стороны.
  const theirs = incomingAuthor(role);
  if (theirs) {
    for (const m of messages) {
      if (m.author !== theirs) continue;
      const order = byId.get(m.orderId);
      out.push({
        id: `message-${m.id}`,
        kind: "message",
        title: "Новое сообщение",
        detail: `${orderTitle(order, "Диалог")} — ${m.text}`,
        href: `/chats/${m.orderId}`,
        at: m.createdAt,
      });
    }
  }

  return out.sort((a, b) => b.at - a.at);
}
