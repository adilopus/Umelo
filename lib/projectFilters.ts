import {
  projectsByNewest,
  type FeedProject,
  type ProjectTopic,
} from "./mockProjects";

/** Размер ranking-карусели: «Новые» и «Популярные». */
export const PROJECT_TOP_LIMIT = 10;

/** Период хранится как календарные даты `yyyy-mm-dd` — ровно то, что
 *  отдаёт <input type="date">. Конвертировать их в «дни назад» не нужно:
 *  обратный пересчёт через Math.round после полудня превращал «сегодня»
 *  во «вчера» и молча выбрасывал сегодняшние проекты. */
export interface ProjectFilters {
  /** Поиск по названию проекта или по автору. */
  query: string;
  /** Тема; null — все темы. */
  topic: ProjectTopic | null;
  /** Период «с» включительно, `yyyy-mm-dd`. */
  from: string | null;
  /** Период «по» включительно, `yyyy-mm-dd`. */
  to: string | null;
}

export const EMPTY_PROJECT_FILTERS: ProjectFilters = {
  query: "",
  topic: null,
  from: null,
  to: null,
};

export function hasActiveProjectFilters(f: ProjectFilters): boolean {
  return Boolean(f.query.trim()) || f.topic !== null || f.from !== null || f.to !== null;
}

/** Локальная календарная дата timestamp'а в формате `yyyy-mm-dd`. */
function localDate(ts: number): string {
  const d = new Date(ts);
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${m}-${day}`;
}

/**
 * Фильтрация каталога: поиск по названию/автору, тема и произвольный период.
 *
 * Период включает границы целиком: «с 3 дней назад» начинается с полуночи
 * этого дня, «по сегодня» заканчивается сегодняшним днём, а не 00:00.
 */
export function filterProjects(
  projects: FeedProject[],
  filters: ProjectFilters
): FeedProject[] {
  const query = filters.query.trim().toLowerCase();

  return projects.filter((p) => {
    if (query) {
      const haystack = `${p.title} ${p.author} ${p.authorRole} ${p.location}`.toLowerCase();
      if (!haystack.includes(query)) return false;
    }
    if (filters.topic && !p.topics.includes(filters.topic)) return false;
    if (filters.from || filters.to) {
      const day = localDate(p.createdAt);
      if (filters.from && day < filters.from) return false;
      if (filters.to && day > filters.to) return false;
    }
    return true;
  });
}

/** «Новые проекты» — топ по дате. */
export function topNewProjects(
  projects: FeedProject[],
  limit = PROJECT_TOP_LIMIT
): FeedProject[] {
  return projectsByNewest(projects).slice(0, limit);
}

/**
 * «Популярные проекты» — топ по просмотрам.
 *
 * Считаем именно просмотры, а не лайки: лайков у десяти лучших проектов
 * почти одинаковое количество, и по ним порядок был бы случайным.
 */
export function topPopularProjects(
  projects: FeedProject[],
  limit = PROJECT_TOP_LIMIT
): FeedProject[] {
  return [...projects]
    .sort((a, b) => b.views - a.views || b.createdAt - a.createdAt)
    .slice(0, limit);
}

/** Сколько проектов в каждой теме — для подсказок рядом с чипами. */
export function projectTopicCounts(projects: FeedProject[]): Record<string, number> {
  return projects.reduce<Record<string, number>>((acc, p) => {
    for (const topic of p.topics) acc[topic] = (acc[topic] ?? 0) + 1;
    return acc;
  }, {});
}
