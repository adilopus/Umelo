import { Article } from "./types";

export interface AuthorRankEntry {
  authorName: string;
  score: number;
  rank: number;
}

/**
 * Считает суммарный "счёт" каждого автора (лайки×3 + просмотры) по всем его
 * материалам и сортирует по убыванию — простая, но осмысленная модель
 * рейтинга для демо без реального бэкенда.
 */
export function buildAuthorRanking(articles: Article[]): AuthorRankEntry[] {
  const scoreByAuthor = new Map<string, number>();
  for (const a of articles) {
    const likes = Number.isFinite(a.likes) ? a.likes : 0;
    const views = Number.isFinite(a.views) ? a.views : 0;
    const prev = scoreByAuthor.get(a.authorName) ?? 0;
    scoreByAuthor.set(a.authorName, prev + likes * 3 + views);
  }
  const sorted = Array.from(scoreByAuthor.entries())
    .sort((a, b) => b[1] - a[1])
    .map(([authorName, score], i) => ({ authorName, score, rank: i + 1 }));
  return sorted;
}

/** Возвращает место автора в рейтинге и понятную бирку — "Топ-10" и т.д. */
export function authorRankLabel(rank: number | undefined): string {
  if (!rank) return "—";
  if (rank <= 10) return `Топ-10 (место ${rank})`;
  if (rank <= 50) return `Топ-50 (место ${rank})`;
  if (rank <= 100) return `Топ-100 (место ${rank})`;
  return `Место ${rank}`;
}
