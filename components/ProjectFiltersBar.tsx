"use client";

import { Search, X } from "lucide-react";
import { PROJECT_TOPICS, type FeedProject, type ProjectTopic } from "@/lib/mockProjects";
import {
  hasActiveProjectFilters,
  projectTopicCounts,
  type ProjectFilters,
} from "@/lib/projectFilters";

export interface ProjectFiltersBarProps {
  filters: ProjectFilters;
  onChange: (next: ProjectFilters) => void;
  projects: FeedProject[];
  /** Сколько проектов подходит под текущие фильтры. */
  found: number;
}

/**
 * Панель фильтров каталога проектов: поиск по названию или автору,
 * выбор темы и произвольный период «с»/«по».
 *
 * Значения дат — готовые строки `yyyy-mm-dd` из <input type="date">,
 * дополнительной конвертации не требуется.
 */
export function ProjectFiltersBar({
  filters,
  onChange,
  projects,
  found,
}: ProjectFiltersBarProps) {
  const counts = projectTopicCounts(projects);
  const active = hasActiveProjectFilters(filters);

  return (
    <div className="mb-6 space-y-3">
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="flex min-w-0 flex-1 items-center gap-2 rounded-2xl border border-line bg-paper px-3 py-2 focus-within:border-accent">
          <Search size={16} className="shrink-0 text-ink-faint" />
          <input
            type="search"
            value={filters.query}
            onChange={(e) => onChange({ ...filters, query: e.target.value })}
            placeholder="Название проекта или автор"
            aria-label="Поиск по названию проекта или автору"
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

        <div className="flex shrink-0 items-center gap-2">
          <label className="flex min-w-0 flex-1 items-center gap-1.5 rounded-2xl border border-line bg-paper px-3 py-2 sm:flex-none">
            <span className="text-xs font-semibold text-ink-soft">с</span>
            <input
              type="date"
              value={filters.from ?? ""}
              max={filters.to ?? undefined}
              onChange={(e) => onChange({ ...filters, from: e.target.value || null })}
              aria-label="Период: с даты"
              className="min-h-9 min-w-0 bg-transparent text-xs outline-none"
            />
          </label>
          <label className="flex min-w-0 flex-1 items-center gap-1.5 rounded-2xl border border-line bg-paper px-3 py-2 sm:flex-none">
            <span className="text-xs font-semibold text-ink-soft">по</span>
            <input
              type="date"
              value={filters.to ?? ""}
              min={filters.from ?? undefined}
              onChange={(e) => onChange({ ...filters, to: e.target.value || null })}
              aria-label="Период: по дату"
              className="min-h-9 min-w-0 bg-transparent text-xs outline-none"
            />
          </label>
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto no-scrollbar">
        <button
          type="button"
          onClick={() => onChange({ ...filters, topic: null })}
          aria-pressed={filters.topic === null}
          className={`inline-flex min-h-10 shrink-0 items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-bold transition ${
            filters.topic === null
              ? "border-accent bg-accent-soft text-accent-ink"
              : "border-line bg-paper text-ink-soft hover:bg-surface hover:text-ink"
          }`}
        >
          Все темы
          <span className="text-ink-faint">{projects.length}</span>
        </button>
        {PROJECT_TOPICS.map((topic: ProjectTopic) => (
          <button
            key={topic}
            type="button"
            onClick={() => onChange({ ...filters, topic: filters.topic === topic ? null : topic })}
            aria-pressed={filters.topic === topic}
            className={`inline-flex min-h-10 shrink-0 items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-bold transition ${
              filters.topic === topic
                ? "border-accent bg-accent-soft text-accent-ink"
                : "border-line bg-paper text-ink-soft hover:bg-surface hover:text-ink"
            }`}
          >
            {topic}
            <span className="text-ink-faint">{counts[topic] ?? 0}</span>
          </button>
        ))}
      </div>

      <div className="flex min-h-6 flex-wrap items-center gap-3">
        <p className="text-xs text-ink-soft">
          {active ? (
            <>
              Найдено проектов: <span className="font-extrabold text-ink">{found}</span>
            </>
          ) : (
            <>Всего проектов: <span className="font-extrabold text-ink">{projects.length}</span></>
          )}
        </p>
        {active && (
          <button
            type="button"
            onClick={() => onChange({ query: "", topic: null, from: null, to: null })}
            className="-my-1 inline-flex min-h-8 items-center gap-1 py-1 text-xs font-extrabold text-accent-ink"
          >
            <X size={13} /> Сбросить фильтры
          </button>
        )}
      </div>
    </div>
  );
}
