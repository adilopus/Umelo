"use client";

import Link from "next/link";
import { ScrollRow } from "@/components/ScrollRow";

export interface CarouselSectionTab {
  id: string;
  label: string;
}

export interface CarouselSectionProps {
  title: string;
  subtitle?: string;
  /** Ссылка «смотреть все» в шапке секции. */
  allHref?: string;
  allLabel?: string;
  /** Вкладки-категории. Без них карусель односоставная. */
  tabs?: CarouselSectionTab[];
  activeTab?: string;
  onTabChange?: (id: string) => void;
  /** Кнопка перемешивания — для заказов, где «новые» это случайная выборка. */
  onShuffle?: () => void;
  emptyLabel?: string;
  children: React.ReactNode;
}

/**
 * Секция ленты с горизонтальной каруселью.
 *
 * Раньше блоки ленты были статичными сетками в две колонки: четыре заказа
 * и четыре статьи занимали всю ширину, а до остального нужно было скроллить
 * вниз. Здесь карточки идут полосой фиксированной ширины, свайпаются
 * пальцем, а на десктопе листаются стрелками ScrollRow.
 */
export function CarouselSection({
  title,
  subtitle,
  allHref,
  allLabel = "Смотреть все",
  tabs,
  activeTab,
  onTabChange,
  onShuffle,
  emptyLabel = "Пока пусто",
  children,
}: CarouselSectionProps) {
  const isEmpty = !Array.isArray(children) || children.length === 0;

  return (
    <section>
      <div className="mb-3 flex items-end justify-between gap-3">
        <div className="min-w-0">
          <h2 className="font-display text-xl font-extrabold text-ink">{title}</h2>
          {subtitle && <p className="mt-0.5 text-xs text-ink-soft">{subtitle}</p>}
        </div>
        <div className="flex shrink-0 items-center gap-3">
          {onShuffle && (
            <button
              type="button"
              onClick={onShuffle}
              className="-my-1.5 inline-flex min-h-8 items-center py-1.5 text-xs font-extrabold text-accent-ink"
            >
              Другие
            </button>
          )}
          {allHref && (
            <Link
              href={allHref}
              className="-my-1.5 inline-flex min-h-8 items-center py-1.5 text-xs font-extrabold text-accent-ink"
            >
              {allLabel}
            </Link>
          )}
        </div>
      </div>

      {tabs && tabs.length > 0 && (
        <div className="mb-3 flex gap-2 overflow-x-auto no-scrollbar">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => onTabChange?.(tab.id)}
              aria-pressed={activeTab === tab.id}
              className={`inline-flex min-h-10 shrink-0 items-center rounded-full border px-3.5 py-1.5 text-xs font-bold transition ${
                activeTab === tab.id
                  ? "border-accent bg-accent-soft text-accent-ink"
                  : "border-line bg-paper text-ink-soft hover:bg-surface hover:text-ink"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      )}

      {isEmpty ? (
        <div className="rounded-2xl border border-dashed border-line bg-paper p-8 text-center text-sm text-ink-soft">
          {emptyLabel}
        </div>
      ) : (
        <ScrollRow innerClassName="gap-3 pb-2" step={320}>
          {children}
        </ScrollRow>
      )}
    </section>
  );
}
