"use client";

import { Heart } from "lucide-react";
import { useAppStore } from "@/lib/store";
import { ArticleCard } from "@/components/ArticleCard";
import { PromoCard } from "@/components/PromoCard";

export function FavoritesPanel() {
  const articles = useAppStore((s) => s.articles);
  const favoriteIds = useAppStore((s) => s.favoriteArticleIds);

  const favorites = articles.filter((a) => favoriteIds.includes(a.id));

  if (favorites.length === 0) {
    return (
      <div className="flex flex-col items-center gap-2 py-12 text-center">
        <Heart size={28} className="text-ink-faint" />
        <p className="text-sm text-ink-soft">
          Пока нет сохранённых статей, новостей или предложений.
        </p>
        <p className="text-xs text-ink-faint">
          Нажмите на сердечко на карточке в Ленте, чтобы добавить в избранное.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {favorites.map((a) =>
        a.kind === "promo" ? (
          <PromoCard key={a.id} article={a} fullWidth />
        ) : (
          <ArticleCard key={a.id} article={a} fullWidth />
        )
      )}
    </div>
  );
}
