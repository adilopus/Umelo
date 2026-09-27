"use client";

import Link from "next/link";
import { Heart } from "lucide-react";
import { useAppStore } from "@/lib/store";
import { Article } from "@/lib/types";

/**
 * Рекламные карточки визуально отличаются от статей: текст поверх фото на
 * градиенте (баннерный стиль), а не в отдельном белом блоке снизу — так
 * с первого взгляда понятно, что это реклама, а не редакционный контент.
 * Клик по карточке засчитывает просмотр (открывает детальную страницу);
 * клик по кнопке "Перейти по ссылке" на детальной странице засчитывает
 * отдельно клик — это два разных показателя для продавца.
 */
export function PromoCard({
  article,
  fullWidth = false,
}: {
  article: Article;
  fullWidth?: boolean;
}) {
  const isFavorite = useAppStore((s) => s.favoriteArticleIds.includes(article.id));
  const toggleFavorite = useAppStore((s) => s.toggleFavorite);

  return (
    <Link
      href={`/articles/${article.id}`}
      className={`relative block h-28 shrink-0 overflow-hidden rounded-2xl ${
        fullWidth ? "w-full" : "w-64"
      }`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={article.coverUrl} alt="" className="absolute inset-0 h-full w-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/20 to-transparent" />
      <span className="absolute left-3 top-3 rounded-full bg-paper/90 px-2 py-0.5 text-xs font-semibold text-ink">
        Реклама
      </span>
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          toggleFavorite(article.id);
        }}
        aria-label={isFavorite ? "Убрать из избранного" : "В избранное"}
        className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-ink/50 transition hover:bg-ink/80"
      >
        <Heart
          size={12}
          className={isFavorite ? "text-accent-ink" : "text-white"}
          fill={isFavorite ? "currentColor" : "none"}
        />
      </button>
      <div className="absolute inset-x-3 bottom-2.5">
        <p className="line-clamp-2 font-display text-sm font-bold leading-tight text-white">
          {article.title}
        </p>
        <p className="text-xs text-white/75">{article.authorName}</p>
      </div>
    </Link>
  );
}
