"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ChevronLeft, Eye, MousePointerClick, ExternalLink, PlayCircle, Heart, Bookmark } from "lucide-react";
import { useAppStore } from "@/lib/store";
import { formatDate } from "@/lib/format";
import { topicLabel } from "@/lib/articleTopics";

const KIND_LABELS: Record<string, string> = {
  article: "Статья",
  news: "Новость",
  promo: "Реклама",
  video: "Видео",
};

export default function ArticleDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const article = useAppStore((s) => s.articles.find((a) => a.id === id));
  const incrementArticleViews = useAppStore((s) => s.incrementArticleViews);
  const incrementArticleClicks = useAppStore((s) => s.incrementArticleClicks);
  const isFavorite = useAppStore((s) => s.favoriteArticleIds.includes(id));
  const toggleFavorite = useAppStore((s) => s.toggleFavorite);
  const isLiked = useAppStore((s) => s.likedArticleIds.includes(id));
  const toggleLike = useAppStore((s) => s.toggleLike);

  // Засчитываем просмотр один раз при открытии — как и с заказами, в реальном
  // приложении это делал бы сервер с дедупликацией по пользователю/сессии.
  useEffect(() => {
    if (id) incrementArticleViews(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (!article) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-3 p-6 text-center">
        <p className="text-sm text-ink-soft">Материал не найден или уже удалён.</p>
        <button type="button" onClick={() => router.push("/feed")} className="-my-1.5 inline-flex items-center py-1.5 text-sm font-semibold text-accent-ink">
          Вернуться в ленту
        </button>
      </div>
    );
  }

  function handleLinkClick() {
    if (!article?.linkUrl) return;
    incrementArticleClicks(article.id);
    window.open(article.linkUrl, "_blank", "noopener,noreferrer");
  }

  const viewsCount = Number.isFinite(article.views) ? article.views : 0;
  const clicksCount = Number.isFinite(article.clicks) ? article.clicks : 0;

  return (
    <div className="flex flex-1 flex-col">
      <header className="sticky top-0 z-10 flex items-center gap-3 border-b border-line bg-paper/95 px-4 py-3 backdrop-blur lg:mx-auto lg:w-full lg:max-w-content">
        <button
          onClick={() => router.back()}
          className="rounded-full p-1 text-ink-soft active:bg-surface"
          aria-label="Назад"
        >
          <ChevronLeft size={22} />
        </button>
        <p className="truncate font-display text-sm font-bold">{article.title}</p>
      </header>

      <main className="flex-1 overflow-y-auto pb-12 lg:mx-auto lg:w-full lg:max-w-content">
        <div className="relative aspect-[16/9] w-full bg-ink">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={article.coverUrl} alt="" className="h-full w-full object-cover" />
          <span className="absolute left-3 top-3 rounded-full bg-ink/80 px-2.5 py-1 text-xs font-semibold text-white">
            {KIND_LABELS[article.kind]}
          </span>
          {article.kind === "video" && (
            <div className="absolute inset-0 flex items-center justify-center">
              <PlayCircle size={56} className="text-white/90" />
            </div>
          )}
        </div>

        <div className="space-y-4 px-4 pb-4 pt-6 sm:px-6 lg:px-8">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-ok">
              {topicLabel(article.topic)}
            </p>
            <h1 className="mt-1 font-display text-xl font-extrabold text-ink">
              {article.title}
            </h1>
            <p className="mt-1 text-xs text-ink-faint">
              {article.authorName} · {formatDate(article.createdAt)}
            </p>
          </div>

          <div className="flex items-center gap-4 rounded-xl border border-line p-2.5 text-xs text-ink-soft">
            <span className="flex items-center gap-1">
              <Eye size={13} /> {viewsCount > 0 ? viewsCount : "нет просмотров"}
            </span>
            {article.kind === "promo" && (
              <span className="flex items-center gap-1">
                <MousePointerClick size={13} /> {clicksCount} переходов
              </span>
            )}
            <button
              onClick={() => toggleLike(id)}
              className={`ml-auto flex items-center gap-1 rounded-full border px-2 py-1 transition ${
                isLiked ? "border-accent text-accent-ink" : "border-line text-ink-soft"
              }`}
            >
              <Heart size={13} fill={isLiked ? "currentColor" : "none"} />
              {Number.isFinite(article.likes) ? article.likes : 0}
            </button>
            <button
              onClick={() => toggleFavorite(id)}
              className={`flex items-center gap-1 rounded-full border px-2 py-1 transition ${
                isFavorite ? "border-accent text-accent-ink" : "border-line text-ink-soft"
              }`}
            >
              <Bookmark size={13} fill={isFavorite ? "currentColor" : "none"} />
            </button>
          </div>

          <p className="whitespace-pre-wrap text-sm text-ink">{article.content}</p>

          {article.kind === "promo" && article.linkUrl && (
            <button
              onClick={handleLinkClick}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-accent py-3 font-semibold text-night"
            >
              <ExternalLink size={16} /> Перейти по ссылке
            </button>
          )}

          {article.kind === "video" && article.linkUrl && (
            <button
              onClick={handleLinkClick}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-accent py-3 font-semibold text-night"
            >
              <PlayCircle size={16} /> Смотреть видео
            </button>
          )}
        </div>
      </main>
    </div>
  );
}
