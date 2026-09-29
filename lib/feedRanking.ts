import type { Article, Order } from "./types";
import { projectsByNewest, type FeedProject } from "./mockProjects";

/** Размер одной карусели в ленте. */
export const FEED_CAROUSEL_LIMIT = 10;

/**
 * Заказы для блока «Нужны мастера».
 *
 * Порядок: сначала оплаченное продвижение, затем самые новые. Продвижение
 * в прототипе выключено — список пуст, но место под него есть, чтобы не
 * переписывать выборку, когда появится оплата.
 */
export function topOrdersForFeed(
  orders: Order[],
  promotedIds: readonly string[] = [],
  limit = FEED_CAROUSEL_LIMIT
): Order[] {
  const promoted = new Set(promotedIds);
  const open = orders.filter((o) => o.status === "open");
  return [...open]
    .sort((a, b) => {
      const pa = promoted.has(a.id) ? 1 : 0;
      const pb = promoted.has(b.id) ? 1 : 0;
      if (pa !== pb) return pb - pa;
      return b.createdAt - a.createdAt;
    })
    .slice(0, limit);
}

export type ArticleFeedMode = "new" | "popular";

/** Статьи для блока «Журнал»: свежие или самые просматриваемые. */
export function topArticlesForFeed(
  articles: Article[],
  mode: ArticleFeedMode,
  limit = FEED_CAROUSEL_LIMIT
): Article[] {
  const list = articles.filter((a) => a.kind !== "promo");
  list.sort((a, b) => (mode === "new" ? b.createdAt - a.createdAt : b.views - a.views));
  return list.slice(0, limit);
}

/** Товары и услуги: материалы и предложения магазинов (kind === "promo"). */
export function offersForFeed(articles: Article[], limit = FEED_CAROUSEL_LIMIT): Article[] {
  return articles
    .filter((a) => a.kind === "promo")
    .sort((a, b) => Number(b.promoted) - Number(a.promoted) || b.createdAt - a.createdAt)
    .slice(0, limit);
}

/** Проекты: новые сверху. */
export function topProjectsForFeed(
  projects: FeedProject[],
  limit = FEED_CAROUSEL_LIMIT
): FeedProject[] {
  return projectsByNewest(projects).slice(0, limit);
}
