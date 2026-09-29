"use client";

import { Search, X } from "lucide-react";

import type { Order } from "@/lib/types";
import { CATEGORIES } from "@/lib/jobCategories";
import {
  EMPTY_ORDER_FILTERS,
  ORDER_SORTS,
  ORDER_STATUS_FILTERS,
  hasActiveOrderFilters,
  type OrderFilters,
  type OrderSort,
  type OrderStatusFilter,
} from "@/lib/orderSearch";
import { pluralize } from "@/lib/format";

export interface MyOrdersToolbarProps {
  filters: OrderFilters;
  onChange: (next: OrderFilters) => void;
  sort: OrderSort;
  onSortChange: (next: OrderSort) => void;
  /** Все свои заказы — из них считаем «Всего», независимо от фильтров. */
  orders: Order[];
  /** Сколько заказов подходит под текущие фильтры. */
  found: number;
}

const SELECT_CLASS =
  "min-h-10 w-full rounded-xl border border-line bg-surface px-3 py-2 text-sm outline-none focus:border-accent";

/**
 * Панель «Моих заказов»: поиск по номеру или совпадению слов, категория
 * работ, состояние заказа, произвольный период «с»/«по» и сортировка.
 *
 * Даты — готовые строки `yyyy-mm-dd` из `<input type="date">`, конвертация
 * не нужна. Категории показываются только те, что реально встречаются в
 * моих заказах: пустой выпадающий список из 12 тематик вводил бы в тупик.
 */
export function MyOrdersToolbar({
  filters,
  onChange,
  sort,
  onSortChange,
  orders,
  found,
}: MyOrdersToolbarProps) {
  const active = hasActiveOrderFilters(filters);

  // Темы, встречающиеся в моих заказах, вместе с количеством.
  const categories: { name: string; count: number }[] = [];
  for (const category of CATEGORIES) {
    const count = orders.filter((o) => o.category === category.name).length;
    if (count > 0) categories.push({ name: category.name, count });
  }
  // Заказы, созданные из карточки проекта, попадают в тематику
  // «Реализация проекта», которой нет в справочнике категорий.
  const extra = new Set(
    orders.filter((o) => !categories.some((c) => c.name === o.category)).map((o) => o.category)
  );
  for (const name of extra) {
    categories.push({ name, count: orders.filter((o) => o.category === name).length });
  }

  return (
    <div className="mb-4 space-y-3">
      <div className="flex items-center gap-2 rounded-2xl border border-line bg-paper px-3 py-2 focus-within:border-accent">
        <Search size={16} className="shrink-0 text-ink-faint" />
        <input
          type="search"
          value={filters.query}
          onChange={(e) => onChange({ ...filters, query: e.target.value })}
          placeholder="Номер заказа или слова из описания"
          aria-label="Поиск по номеру заказа или словам"
          className="min-h-9 min-w-0 flex-1 bg-transparent text-sm outline-none"
        />
        {filters.query && (
          <button
            type="button"
            onClick={() => onChange({ ...filters, query: "" })}
            aria-label="Очистить поиск"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-ink-soft hover:bg-surface"
          >
            <X size={15} />
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
        <label className="block">
          <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-ink-faint">
            Категория работ
          </span>
          <select
            value={filters.category}
            onChange={(e) => onChange({ ...filters, category: e.target.value })}
            aria-label="Категория работ"
            className={SELECT_CLASS}
          >
            <option value="">Все категории</option>
            {categories.map((c) => (
              <option key={c.name} value={c.name}>
                {c.name} ({c.count})
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-ink-faint">
            Состояние
          </span>
          <select
            value={filters.status}
            onChange={(e) => onChange({ ...filters, status: e.target.value as OrderStatusFilter })}
            aria-label="Состояние заказа"
            className={SELECT_CLASS}
          >
            {ORDER_STATUS_FILTERS.map((s) => (
              <option key={s.id} value={s.id}>
                {s.label}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-ink-faint">
            Сортировка
          </span>
          <select
            value={sort}
            onChange={(e) => onSortChange(e.target.value as OrderSort)}
            aria-label="Сортировка заказов"
            className={SELECT_CLASS}
          >
            {ORDER_SORTS.map((o) => (
              <option key={o.id} value={o.id}>
                {o.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="flex items-center gap-2">
        <label className="flex min-w-0 flex-1 items-center gap-1.5 rounded-2xl border border-line bg-paper px-3 py-2">
          <span className="shrink-0 text-xs font-semibold text-ink-soft">с</span>
          <input
            type="date"
            value={filters.dateFrom}
            max={filters.dateTo || undefined}
            onChange={(e) => onChange({ ...filters, dateFrom: e.target.value })}
            aria-label="Период: с даты"
            className="min-h-9 min-w-0 bg-transparent text-xs outline-none"
          />
        </label>
        <label className="flex min-w-0 flex-1 items-center gap-1.5 rounded-2xl border border-line bg-paper px-3 py-2">
          <span className="shrink-0 text-xs font-semibold text-ink-soft">по</span>
          <input
            type="date"
            value={filters.dateTo}
            min={filters.dateFrom || undefined}
            onChange={(e) => onChange({ ...filters, dateTo: e.target.value })}
            aria-label="Период: по дату"
            className="min-h-9 min-w-0 bg-transparent text-xs outline-none"
          />
        </label>
      </div>

      <div className="flex min-h-6 flex-wrap items-center gap-3">
        <p className="text-xs text-ink-soft">
          {active ? (
            <>
              Найдено заказов:{" "}
              <span className="font-extrabold text-ink">
                {found} из {orders.length}
              </span>
            </>
          ) : (
            <>
              Всего заказов:{" "}
              <span className="font-extrabold text-ink">{orders.length}</span>{" "}
              {pluralize(orders.length, "заказ", "заказа", "заказов")}
            </>
          )}
        </p>
        {active && (
          <button
            type="button"
            onClick={() => onChange(EMPTY_ORDER_FILTERS)}
            className="-my-1 inline-flex min-h-8 items-center gap-1 py-1 text-xs font-extrabold text-accent-ink"
          >
            <X size={13} /> Сбросить фильтры
          </button>
        )}
      </div>
    </div>
  );
}
