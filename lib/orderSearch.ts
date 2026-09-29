import { Order } from "./types";

/**
 * Поиск и фильтрация заказов в каталоге «Заказы» (раздел для исполнителя).
 *
 * Вся логика вынесена в чистые функции без обращения к текущему времени на
 * этапе фильтрации по умолчанию: при пустых фильтрах результат детерминирован
 * и одинаков на сервере и клиенте (иначе hydration mismatch, как это уже было
 * с Math.random в ленте).
 */

export type OrderDatePeriod = "all" | "day" | "week" | "month";
export type OrderSort = "new" | "old" | "budget-desc" | "budget-asc" | "distance" | "deadline";
/** Фильтр по состоянию заказа; "all" — без ограничения. */
export type OrderStatusFilter = "all" | Order["status"];

export interface OrderFilters {
  query: string;
  /** Категория (тематика) из CATEGORIES; пустая строка — все. */
  category: string;
  /** Подкатегория (конкретный вид работ); пустая строка — все внутри тематики. */
  subcategory: string;
  budgetMin: string;
  budgetMax: string;
  /** Подстрока адреса/населённого пункта. */
  location: string;
  /** Максимальное расстояние в км; пустая строка — без ограничения. */
  maxDistanceKm: string;
  period: OrderDatePeriod;
  /** Произвольный период «с» в формате yyyy-mm-dd; пустая строка — без ограничения. */
  dateFrom: string;
  /** Произвольный период «по» в формате yyyy-mm-dd; пустая строка — без ограничения. */
  dateTo: string;
  status: OrderStatusFilter;
}

export const EMPTY_ORDER_FILTERS: OrderFilters = {
  query: "",
  category: "",
  subcategory: "",
  budgetMin: "",
  budgetMax: "",
  location: "",
  maxDistanceKm: "",
  period: "all",
  dateFrom: "",
  dateTo: "",
  status: "all",
};

export const DATE_PERIODS: { id: OrderDatePeriod; label: string }[] = [
  { id: "all", label: "За всё время" },
  { id: "day", label: "За сутки" },
  { id: "week", label: "За неделю" },
  { id: "month", label: "За месяц" },
];

export const ORDER_SORTS: { id: OrderSort; label: string }[] = [
  { id: "new", label: "Сначала новые" },
  { id: "old", label: "Сначала старые" },
  { id: "budget-desc", label: "Бюджет: выше" },
  { id: "budget-asc", label: "Бюджет: ниже" },
  { id: "distance", label: "Ближайшие" },
  { id: "deadline", label: "Срочные" },
];

/**
 * Варианты фильтра по состоянию. Подписи взяты из STATUS_META, чтобы
 * чип в панели и чип на карточке не расходились в формулировках.
 */
export const ORDER_STATUS_FILTERS: { id: OrderStatusFilter; label: string }[] = [
  { id: "all", label: "Все" },
  { id: "open", label: "Ищем мастера" },
  { id: "matched", label: "В работе" },
  { id: "cancelled", label: "Отменённые" },
  { id: "closed", label: "Завершённые" },
];

export const DISTANCE_OPTIONS: { value: string; label: string }[] = [
  { value: "", label: "Любое расстояние" },
  { value: "5", label: "до 5 км" },
  { value: "10", label: "до 10 км" },
  { value: "20", label: "до 20 км" },
  { value: "50", label: "до 50 км" },
];

const PERIOD_MS: Record<Exclude<OrderDatePeriod, "all">, number> = {
  day: 24 * 60 * 60 * 1000,
  week: 7 * 24 * 60 * 60 * 1000,
  month: 30 * 24 * 60 * 60 * 1000,
};

function parseNumber(value: string): number | undefined {
  if (!value.trim()) return undefined;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
}

/**
 * Локальная календарная дата timestamp'а в формате `yyyy-mm-dd`.
 *
 * Сравниваем именно строки, а не Date: `new Date("2026-09-29")` разбирается
 * как UTC и в московском времени даёт предыдущие сутки, из-за чего заказ
 * за сегодня выпадал бы из фильтра «по = сегодня».
 */
function localDate(ts: number): string {
  const d = new Date(ts);
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${m}-${day}`;
}

/**
 * Применяет фильтры поиска. Область заказов (например, только открытые)
 * задаёт вызывающая сторона — функция лишь сужает переданный список.
 */
export function applyOrderFilters(orders: Order[], filters: OrderFilters): Order[] {
  const query = filters.query.trim().toLowerCase();
  const location = filters.location.trim().toLowerCase();
  const budgetMin = parseNumber(filters.budgetMin);
  const budgetMax = parseNumber(filters.budgetMax);
  const maxDistance = parseNumber(filters.maxDistanceKm);
  // Дата считается только когда период реально выбран — при "all" текущее
  // время не читается, поэтому рендер детерминирован.
  const since =
    filters.period === "all" ? undefined : Date.now() - PERIOD_MS[filters.period];

  return orders.filter((order) => {
    if (filters.category && order.category !== filters.category) return false;
    if (filters.subcategory && order.subcategory !== filters.subcategory) return false;
    if (filters.status !== "all" && order.status !== filters.status) return false;

    if (query) {
      const haystack = [
        order.serviceName,
        order.code,
        order.category,
        order.subcategory,
        order.description,
        order.address,
      ]
        .join(" ")
        .toLowerCase();
      if (!haystack.includes(query)) return false;
    }

    if (location && !order.address.toLowerCase().includes(location)) return false;

    // Диапазоны бюджетов пересекаются (а не строгое вхождение) — иначе заказ
    // с вилкой 30–50к не находился бы при фильтре "до 40к", хотя подходит.
    if (budgetMin !== undefined && order.budgetMax < budgetMin) return false;
    if (budgetMax !== undefined && order.budgetMin > budgetMax) return false;

    if (maxDistance !== undefined) {
      if (order.distanceKm === undefined || order.distanceKm > maxDistance) return false;
    }

    if (since !== undefined && order.createdAt < since) return false;

    // Произвольный период. Проверяется только когда границы заданы, иначе
    // localDate не вызывается вовсе и рендер остаётся детерминированным.
    if (filters.dateFrom || filters.dateTo) {
      const day = localDate(order.createdAt);
      if (filters.dateFrom && day < filters.dateFrom) return false;
      if (filters.dateTo && day > filters.dateTo) return false;
    }

    return true;
  });
}

export function sortOrders(orders: Order[], sort: OrderSort): Order[] {
  const list = [...orders];
  switch (sort) {
    case "old":
      return list.sort((a, b) => a.createdAt - b.createdAt);
    case "budget-desc":
      return list.sort((a, b) => b.budgetMax - a.budgetMax);
    case "budget-asc":
      return list.sort((a, b) => a.budgetMin - b.budgetMin);
    case "distance":
      return list.sort(
        (a, b) => (a.distanceKm ?? Infinity) - (b.distanceKm ?? Infinity)
      );
    case "deadline":
      return list.sort((a, b) => a.deadlineDays - b.deadlineDays);
    default:
      return list.sort((a, b) => b.createdAt - a.createdAt);
  }
}

export function countActiveFilters(filters: OrderFilters): number {
  let count = 0;
  if (filters.query.trim()) count += 1;
  if (filters.category) count += 1;
  if (filters.subcategory) count += 1;
  if (filters.budgetMin.trim() || filters.budgetMax.trim()) count += 1;
  if (filters.location.trim()) count += 1;
  if (filters.maxDistanceKm) count += 1;
  if (filters.period !== "all") count += 1;
  if (filters.dateFrom || filters.dateTo) count += 1;
  if (filters.status !== "all") count += 1;
  return count;
}

/** Есть ли вообще хоть один фильтр — показывать или нет кнопку сброса. */
export function hasActiveOrderFilters(filters: OrderFilters): boolean {
  return countActiveFilters(filters) > 0;
}

/**
 * Подкатегории выбранной тематики, которые реально встречаются в заказах.
 * Если отдать все 36 подкатегорий из справочника, мастер будет выбирать вид
 * работ, по которому заказов нет, и упираться в пустой результат.
 */
export function availableSubcategories(orders: Order[], category: string): string[] {
  const seen: string[] = [];
  for (const order of orders) {
    if (category && order.category !== category) continue;
    if (order.subcategory && !seen.includes(order.subcategory)) {
      seen.push(order.subcategory);
    }
  }
  return seen;
}
