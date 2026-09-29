"use client";

import Link from "next/link";
import { Heart, PlayCircle, Star } from "lucide-react";
import { useAppStore } from "@/lib/store";
import { Article } from "@/lib/types";
import { topicLabel } from "@/lib/articleTopics";

const KIND_LABELS: Record<Article["kind"], string> = {
  article: "Статья",
  news: "Новость",
  promo: "Реклама",
  video: "Видео",
};

export function ArticleCard({
  article,
  fullWidth = false,
}: {
  article: Article;
  /** true — растягивается на всю ширину ячейки (для сетки), по умолчанию —
   * фиксированная ширина карточки для горизонтального скролла в ленте. */
  fullWidth?: boolean;
}) {
  const isFavorite = useAppStore((s) => s.favoriteArticleIds.includes(article.id));
  const toggleFavorite = useAppStore((s) => s.toggleFavorite);

  return (
    <Link
      href={`/articles/${article.id}`}
      className={`block overflow-hidden rounded-2xl border border-line bg-paper transition hover:shadow-card-hover ${
        fullWidth ? "w-full" : "w-64 shrink-0 snap-start"
      }`}
    >
      <div className="relative aspect-[5/3] w-full overflow-hidden bg-ink">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={article.coverUrl} alt="" className="h-full w-full object-cover" />
        <span className="absolute left-2 top-2 rounded-full bg-ink/80 px-2 py-0.5 text-xs font-semibold text-white">
          {KIND_LABELS[article.kind]}
        </span>
        {article.promoted && (
          <span className="absolute right-2 top-2 flex items-center gap-1 rounded-full bg-accent px-2 py-0.5 text-xs font-semibold text-night">
            <Star size={10} fill="white" /> Топ
          </span>
        )}
        {article.kind === "video" && (
          <div className="absolute inset-0 flex items-center justify-center">
            <PlayCircle size={36} className="text-white/90" />
          </div>
        )}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleFavorite(article.id);
          }}
          type="button"
          aria-pressed={isFavorite}
          aria-label={isFavorite ? "Убрать из избранного" : "В избранное"}
          className="absolute bottom-2 right-2 flex h-9 w-9 items-center justify-center rounded-full bg-ink/70 transition hover:bg-ink/90"
        >
          <Heart
            size={14}
            className={isFavorite ? "text-accent-ink" : "text-white"}
            fill={isFavorite ? "currentColor" : "none"}
          />
        </button>
      </div>
      <div className="space-y-1 p-3">
        <p className="text-xs font-medium uppercase tracking-wide text-ink-soft">
          {topicLabel(article.topic)}
        </p>
        <p className="line-clamp-2 font-display text-sm font-bold leading-tight text-ink">
          {article.title}
        </p>
        <p className="line-clamp-2 text-xs text-ink-soft">{article.excerpt}</p>
        <p className="pt-1 text-xs text-ink-faint">{article.authorName}</p>
      </div>
    </Link>
  );
}
