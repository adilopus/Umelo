import { Role } from "./types";

/** Подпись пункта нижней/верхней навигации фиксированная: раздел заказов не смешиваем с Личным кабинетом. */
export function myOrdersTabLabel(_role: Role): string {
  return "Заказы";
}

/**
 * Заказы — самостоятельный раздел продукта для любой роли.
 * Личный кабинет отвечает за профиль, настройки, статистику и рабочие вкладки.
 *
 * Для исполнителя первична работа с чужими заказами, поэтому его пункт «Заказы»
 * ведёт в каталог всех открытых заказов с поиском и фильтрами. Свои отклики он
 * открывает из шапки каталога. Для остальных ролей пункт ведёт к своим заказам.
 */
export function myOrdersTabHref(role: Role): string {
  return role === "master" ? "/orders" : "/my-orders";
}

/** Склонение по числу: pluralize(1,"отклик","отклика","откликов") -> "отклик" */
export function pluralize(n: number, one: string, few: string, many: string): string {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return one;
  if (mod10 >= 2 && mod10 <= 4 && !(mod100 >= 12 && mod100 <= 14)) return few;
  return many;
}

const MONTHS_GENITIVE = [
  "января",
  "февраля",
  "марта",
  "апреля",
  "мая",
  "июня",
  "июля",
  "августа",
  "сентября",
  "октября",
  "ноября",
  "декабря",
];

/**
 * Форматирует дату как "29 июля 2026" (заказы, статьи, видео, реклама — любой
 * контент с меткой времени создания). Год указываем всегда (а не только "если
 * не текущий") — это исключает сравнение с `new Date()` (текущим моментом)
 * при рендере: такое сравнение недетерминировано между сервером и клиентом и
 * может вызвать hydration mismatch, как уже было раньше с Math.random() в
 * перемешивании заказов.
 */
export function formatDate(timestamp: number): string {
  const d = new Date(timestamp);
  return `${d.getDate()} ${MONTHS_GENITIVE[d.getMonth()]} ${d.getFullYear()}`;
}

/** @deprecated используйте formatDate — оставлено для обратной совместимости */
export const formatOrderDate = formatDate;

/**
 * Бюджет заказа. Раньше один и тот же вывод существовал в трёх вариантах:
 * `OrderCard.formatBudget`, `orders.formatBudgetValue` и 13 инлайновых
 * `toLocaleString("ru-RU")` в вёрстке — с разными пробелами и разной
 * склейкой диапазона.
 */
export function formatBudget(min: number, max: number): string {
  if (min === max) return `${min.toLocaleString("ru-RU")} ₽`;
  return `${min.toLocaleString("ru-RU")}–${max.toLocaleString("ru-RU")} ₽`;
}

/** Число с неразрывным пробелом — для площадей, счётчиков, бюджета за м². */
export function formatNumber(n: number): string {
  return n.toLocaleString("ru-RU");
}

/** Срок в днях в компактном виде: «5 дн.» / «~3 мес.». */
export function formatDeadline(days: number): string {
  if (days <= 30) return `${days} дн.`;
  const months = Math.round(days / 30);
  return `~${months} мес.`;
}
