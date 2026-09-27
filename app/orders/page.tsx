"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ChevronDown, MapPin, Search, SlidersHorizontal, X } from "lucide-react";

import { useAppStore } from "@/lib/store";
import { BottomNav } from "@/components/BottomNav";
import { OrderCard } from "@/components/OrderCard";
import { CATEGORIES } from "@/lib/jobCategories";
import { pluralize } from "@/lib/format";
import {
  applyOrderFilters,
  availableSubcategories,
  countActiveFilters,
  DISTANCE_OPTIONS,
  DATE_PERIODS,
  EMPTY_ORDER_FILTERS,
  ORDER_SORTS,
  sortOrders,
  type OrderDatePeriod,
  type OrderFilters,
  type OrderSort,
} from "@/lib/orderSearch";

function formatBudgetValue(value: number): string {
  return value.toLocaleString("ru-RU");
}

/**
 * Каталог открытых заказов — рабочий раздел исполнителя.
 * Фильтры свёрнуты в раскрывающуюся панель: на телефоне 12 тематик, два
 * бюджетных поля, локация, расстояние и дата занимали пол-экрана и вытесняли
 * сами заказы. Раскрытые фильтры показываются отдельными «пилюлями», каждый
 * снимается по одному клику.
 */
export default function OrdersCatalogPage() {
  const role = useAppStore((s) => s.role);
  const orders = useAppStore((s) => s.orders);
  const responses = useAppStore((s) => s.responses);

  const [filters, setFilters] = useState<OrderFilters>(EMPTY_ORDER_FILTERS);
  const [sort, setSort] = useState<OrderSort>("new");
  const [expanded, setExpanded] = useState(false);

  const respondedIds = useMemo(
    () => new Set(responses.map((r) => r.orderId)),
    [responses]
  );

  const openOrders = useMemo(
    () => orders.filter((o) => o.status === "open"),
    [orders]
  );

  // Виды работ показываем только те, что реально есть в открытых заказах
  // выбранной тематики, иначе фильтр уводит в пустую выдачу.
  const subcategories = useMemo(
    () => availableSubcategories(openOrders, filters.category),
    [openOrders, filters.category]
  );

  const result = useMemo(
    () => sortOrders(applyOrderFilters(openOrders, filters), sort),
    [openOrders, filters, sort]
  );

  const activeCount = countActiveFilters(filters);

  function setFilter<K extends keyof OrderFilters>(key: K, value: OrderFilters[K]) {
    setFilters((prev) => {
      const next = { ...prev, [key]: value };
      // Смена тематики сбрасывает вид работ: он принадлежит предыдущей.
      if (key === "category") next.subcategory = "";
      return next;
    });
  }

  const activePills: { key: keyof OrderFilters | "budget"; label: string }[] = [];
  if (filters.query.trim()) activePills.push({ key: "query", label: `«${filters.query.trim()}»` });
  if (filters.category) activePills.push({ key: "category", label: filters.category });
  if (filters.subcategory) activePills.push({ key: "subcategory", label: filters.subcategory });
  if (filters.budgetMin.trim() || filters.budgetMax.trim()) {
    const from = filters.budgetMin.trim() ? `от ${formatBudgetValue(Number(filters.budgetMin))}` : "";
    const to = filters.budgetMax.trim() ? `до ${formatBudgetValue(Number(filters.budgetMax))}` : "";
    activePills.push({ key: "budget", label: `${from} ${to} ₽`.trim() });
  }
  if (filters.location.trim()) activePills.push({ key: "location", label: filters.location.trim() });
  if (filters.maxDistanceKm) {
    activePills.push({
      key: "maxDistanceKm",
      label: `до ${filters.maxDistanceKm} км`,
    });
  }
  if (filters.period !== "all") {
    const period = DATE_PERIODS.find((p) => p.id === filters.period);
    if (period) activePills.push({ key: "period", label: period.label });
  }

  function clearPill(key: (typeof activePills)[number]["key"]) {
    setFilters((prev) => {
      if (key === "budget") return { ...prev, budgetMin: "", budgetMax: "" };
      if (key === "period") return { ...prev, period: "all" };
      if (key === "category") return { ...prev, category: "", subcategory: "" };
      if (key === "maxDistanceKm") return { ...prev, maxDistanceKm: "" };
      return { ...prev, [key]: "" };
    });
  }

  return (
    <div className="flex flex-1 flex-col">
      <header className="border-b border-line px-4 py-3 lg:mx-auto lg:w-full lg:max-w-5xl lg:border-0 lg:px-0 lg:pb-4 lg:pt-8">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="font-display text-lg font-extrabold">Заказы</p>
            <p className="text-xs text-ink-soft">
              {openOrders.length} открытых{" "}
              {pluralize(openOrders.length, "заказ", "заказа", "заказов")}
            </p>
          </div>
          {role === "master" && (
            <Link
              href="/my-orders"
              className="shrink-0 rounded-xl bg-accent-soft px-3 py-2 text-xs font-bold text-accent"
            >
              Мои отклики
            </Link>
          )}
        </div>
      </header>

      <main className="flex-1 px-4 py-4 pb-24 lg:mx-auto lg:w-full lg:max-w-5xl lg:pb-12">
        <div className="rounded-2xl border border-line bg-white shadow-sm">
          <div className="flex gap-2 p-2.5">
            <label className="relative min-w-0 flex-1">
              <Search
                size={16}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-faint"
              />
              <input
                value={filters.query}
                onChange={(e) => setFilter("query", e.target.value)}
                placeholder="Услуга, адрес, № заказа"
                className="w-full rounded-xl border border-line bg-surface py-2.5 pl-9 pr-3 text-sm outline-none focus:border-accent"
              />
            </label>
            <button
              type="button"
              onClick={() => setExpanded((v) => !v)}
              aria-expanded={expanded}
              className={`flex shrink-0 items-center gap-1.5 rounded-xl border px-3 text-sm font-semibold transition ${
                expanded || activeCount > 0
                  ? "border-accent bg-accent-soft text-accent"
                  : "border-line text-ink"
              }`}
            >
              <SlidersHorizontal size={16} />
              <span className="hidden sm:inline">Фильтры</span>
              {activeCount > 0 && (
                <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-accent px-1 text-[10px] font-bold text-white">
                  {activeCount}
                </span>
              )}
              <ChevronDown
                size={15}
                className={`transition-transform ${expanded ? "rotate-180" : ""}`}
              />
            </button>
          </div>

          {activePills.length > 0 && (
            <div className="flex flex-wrap gap-1.5 border-t border-line px-2.5 py-2">
              {activePills.map((pill) => (
                <button
                  key={pill.key}
                  onClick={() => clearPill(pill.key)}
                  className="flex max-w-full items-center gap-1 rounded-full bg-surface px-2.5 py-1 text-[11px] font-semibold text-ink-soft"
                >
                  <span className="truncate">{pill.label}</span>
                  <X size={12} className="shrink-0" />
                </button>
              ))}
              <button
                onClick={() => setFilters(EMPTY_ORDER_FILTERS)}
                className="rounded-full px-2 py-1 text-[11px] font-bold text-accent"
              >
                Сбросить всё
              </button>
            </div>
          )}

          {expanded && (
            <div className="space-y-4 border-t border-line p-3">
              <div>
                <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-ink-faint">
                  Тематика работ
                </p>
                <div className="flex flex-wrap gap-1.5">
                  <button
                    type="button"
                    onClick={() => setFilter("category", "")}
                    className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                      filters.category === ""
                        ? "bg-accent text-white"
                        : "bg-surface text-ink-soft hover:text-ink"
                    }`}
                  >
                    Все
                  </button>
                  {CATEGORIES.map((c) => (
                    <button
                      key={c.name}
                      type="button"
                      onClick={() =>
                        setFilter("category", filters.category === c.name ? "" : c.name)
                      }
                      className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                        filters.category === c.name
                          ? "bg-accent text-white"
                          : "bg-surface text-ink-soft hover:text-ink"
                      }`}
                    >
                      {c.name}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="mb-1.5 flex items-center justify-between">
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-ink-faint">
                    Вид работ
                  </p>
                  {!filters.category && (
                    <p className="text-[11px] text-ink-faint">сначала выберите тематику</p>
                  )}
                </div>
                {filters.category ? (
                  subcategories.length > 0 ? (
                    <div className="flex flex-wrap gap-1.5">
                      <button
                        type="button"
                        onClick={() => setFilter("subcategory", "")}
                        className={`rounded-lg border px-2.5 py-1.5 text-xs font-semibold transition ${
                          filters.subcategory === ""
                            ? "border-accent text-accent"
                            : "border-line text-ink-soft"
                        }`}
                      >
                        Все виды
                      </button>
                      {subcategories.map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() =>
                            setFilter("subcategory", filters.subcategory === s ? "" : s)
                          }
                          className={`rounded-lg border px-2.5 py-1.5 text-xs font-semibold transition ${
                            filters.subcategory === s
                              ? "border-accent text-accent"
                              : "border-line text-ink-soft"
                          }`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-ink-soft">
                      В этой тематике сейчас нет открытых заказов.
                    </p>
                  )
                ) : (
                  <p className="text-xs text-ink-soft">
                    Подкатегории — конкретные виды работ внутри тематики (например,
                    «Черновая отделка» или «Стяжка пола»).
                  </p>
                )}
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-ink-faint">
                    Бюджет, ₽
                  </p>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      inputMode="numeric"
                      min={0}
                      value={filters.budgetMin}
                      onChange={(e) => setFilter("budgetMin", e.target.value)}
                      placeholder="от"
                      className="w-full rounded-xl border border-line bg-surface px-3 py-2 text-sm outline-none focus:border-accent"
                    />
                    <span className="text-ink-faint">—</span>
                    <input
                      type="number"
                      inputMode="numeric"
                      min={0}
                      value={filters.budgetMax}
                      onChange={(e) => setFilter("budgetMax", e.target.value)}
                      placeholder="до"
                      className="w-full rounded-xl border border-line bg-surface px-3 py-2 text-sm outline-none focus:border-accent"
                    />
                  </div>
                </div>

                <div>
                  <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-ink-faint">
                    Локация
                  </p>
                  <div className="flex gap-2">
                    <label className="relative min-w-0 flex-1">
                      <MapPin
                        size={15}
                        className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-faint"
                      />
                      <input
                        value={filters.location}
                        onChange={(e) => setFilter("location", e.target.value)}
                        placeholder="Город, район, улица"
                        className="w-full rounded-xl border border-line bg-surface py-2 pl-9 pr-3 text-sm outline-none focus:border-accent"
                      />
                    </label>
                    <select
                      value={filters.maxDistanceKm}
                      onChange={(e) => setFilter("maxDistanceKm", e.target.value)}
                      aria-label="Расстояние"
                      className="shrink-0 rounded-xl border border-line bg-surface px-2 py-2 text-xs font-semibold outline-none focus:border-accent"
                    >
                      {DISTANCE_OPTIONS.map((o) => (
                        <option key={o.value} value={o.value}>
                          {o.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-ink-faint">
                    Дата публикации
                  </p>
                  <select
                    value={filters.period}
                    onChange={(e) => setFilter("period", e.target.value as OrderDatePeriod)}
                    className="w-full rounded-xl border border-line bg-surface px-3 py-2 text-sm outline-none focus:border-accent"
                  >
                    {DATE_PERIODS.map((o) => (
                      <option key={o.id} value={o.id}>
                        {o.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-ink-faint">
                    Сортировка
                  </p>
                  <select
                    value={sort}
                    onChange={(e) => setSort(e.target.value as OrderSort)}
                    className="w-full rounded-xl border border-line bg-surface px-3 py-2 text-sm outline-none focus:border-accent"
                  >
                    {ORDER_SORTS.map((o) => (
                      <option key={o.id} value={o.id}>
                        {o.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>

        <p className="mt-4 text-xs text-ink-soft">
          Найдено {result.length}{" "}
          {pluralize(result.length, "заказ", "заказа", "заказов")}
        </p>

        {result.length === 0 ? (
          <div className="mt-10 text-center">
            <p className="text-sm text-ink-soft">По вашим фильтрам заказов не нашлось.</p>
            {activeCount > 0 && (
              <button
                onClick={() => setFilters(EMPTY_ORDER_FILTERS)}
                className="mt-3 text-sm font-semibold text-accent"
              >
                Сбросить фильтры
              </button>
            )}
          </div>
        ) : (
          <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {result.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                fullWidth
                showDate
                responded={respondedIds.has(order.id)}
              />
            ))}
          </div>
        )}
      </main>

      <BottomNav />
    </div>
  );
}
