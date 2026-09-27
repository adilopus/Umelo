"use client";

import { useState } from "react";
import { Newspaper, Trash2, ArrowUpCircle, Eye, PlayCircle } from "lucide-react";
import { useAppStore } from "@/lib/store";
import { ARTICLE_TOPICS, topicLabel } from "@/lib/articleTopics";
import { compressImage } from "@/lib/imageCompress";
import { ArticleKind } from "@/lib/types";

export const BLOGGER_NAME = "Вы (блогер)";
const PROMOTE_COST = 3;

const FALLBACK_COVER = `data:image/svg+xml;utf8,${encodeURIComponent(
  `<svg xmlns='http://www.w3.org/2000/svg' width='400' height='240'><rect width='100%' height='100%' fill='%23FF6B1A'/></svg>`
)}`;

export function BloggerDashboard() {
  const ticketsBalance = useAppStore((s) => s.ticketsBalance);
  const subscriptionActive = useAppStore((s) => s.subscriptionActive);
  const addTickets = useAppStore((s) => s.addTickets);
  const articles = useAppStore((s) => s.articles);
  const addArticle = useAppStore((s) => s.addArticle);
  const deleteArticle = useAppStore((s) => s.deleteArticle);
  const setArticlePromoted = useAppStore((s) => s.setArticlePromoted);

  const [kind, setKind] = useState<Extract<ArticleKind, "article" | "video">>("article");
  const [title, setTitle] = useState("");
  const [topic, setTopic] = useState(ARTICLE_TOPICS[0].id);
  const [excerpt, setExcerpt] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [coverUrl, setCoverUrl] = useState<string | null>(null);
  const [promoteError, setPromoteError] = useState<string | null>(null);

  const myItems = articles.filter((a) => a.authorName === BLOGGER_NAME);
  const totalViews = myItems.reduce(
    (sum, a) => sum + (Number.isFinite(a.views) ? a.views : 0),
    0
  );

  async function handleCover(files: FileList | null) {
    const file = files?.[0];
    if (!file) return;
    try {
      setCoverUrl(await compressImage(file, 800, 0.7));
    } catch {
      // игнорируем — обложка останется по умолчанию
    }
  }

  function publish() {
    if (!title.trim() || !excerpt.trim()) return;
    addArticle({
      id: `art-${Date.now()}`,
      kind,
      topic,
      title: title.trim(),
      excerpt: excerpt.trim(),
      content: excerpt.trim(),
      coverUrl: coverUrl ?? FALLBACK_COVER,
      authorName: BLOGGER_NAME,
      promoted: false,
      createdAt: Date.now(),
      views: 0,
      clicks: 0,
      likes: 0,
      linkUrl: kind === "video" && videoUrl.trim() ? videoUrl.trim() : undefined,
    });
    setTitle("");
    setExcerpt("");
    setVideoUrl("");
    setCoverUrl(null);
  }

  function promote(articleId: string) {
    if (!subscriptionActive && ticketsBalance < PROMOTE_COST) {
      setPromoteError(
        `Нужно ${PROMOTE_COST} билета на балансе (сейчас ${ticketsBalance}), чтобы продвинуть материал в топ.`
      );
      return;
    }
    if (!subscriptionActive) addTickets(-PROMOTE_COST);
    setArticlePromoted(articleId, true);
    setPromoteError(null);
  }

  return (
    <div className="space-y-5">
      <div className="space-y-3 rounded-2xl border border-line p-4">
        <p className="flex items-center gap-1.5 font-display text-sm font-bold">
          <Newspaper size={16} className="text-accent" /> Новый материал
        </p>

        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => setKind("article")}
            className={`rounded-lg border py-2 text-xs font-semibold ${
              kind === "article"
                ? "border-accent bg-accent-soft text-accent"
                : "border-line text-ink-soft"
            }`}
          >
            Статья
          </button>
          <button
            onClick={() => setKind("video")}
            className={`rounded-lg border py-2 text-xs font-semibold ${
              kind === "video"
                ? "border-accent bg-accent-soft text-accent"
                : "border-line text-ink-soft"
            }`}
          >
            Видеоролик
          </button>
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-ink-soft">Заголовок</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Например: Как выбрать плитку для кухни"
            className="w-full rounded-lg border border-line px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-ink-soft">Тематика</label>
          <select
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="w-full rounded-lg border border-line px-3 py-2 text-sm"
          >
            {ARTICLE_TOPICS.map((t) => (
              <option key={t.id} value={t.id}>
                {t.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-ink-soft">
            {kind === "video" ? "Описание ролика" : "Краткое описание"}
          </label>
          <textarea
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            rows={3}
            placeholder={
              kind === "video"
                ? "О чём видео, что зритель узнает…"
                : "О чём статья, для кого будет полезна…"
            }
            className="w-full resize-none rounded-lg border border-line px-3 py-2 text-sm"
          />
        </div>
        {kind === "video" && (
          <div>
            <label className="mb-1 block text-xs font-medium text-ink-soft">
              Ссылка на видео (YouTube/VK Video)
            </label>
            <input
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              placeholder="https://youtube.com/watch?v=…"
              className="w-full rounded-lg border border-line px-3 py-2 text-sm"
            />
          </div>
        )}
        <div>
          <label className="mb-1 block text-xs font-medium text-ink-soft">Обложка</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleCover(e.target.files)}
            className="w-full text-xs"
          />
        </div>
        <button
          onClick={publish}
          disabled={!title.trim() || !excerpt.trim()}
          className="w-full rounded-xl bg-accent py-2.5 text-sm font-semibold text-white disabled:opacity-40"
        >
          Опубликовать
        </button>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold">Мой контент ({myItems.length})</p>
          <span className="flex items-center gap-1 text-xs text-ink-soft">
            <Eye size={13} /> {totalViews} всего просмотров
          </span>
        </div>
        {promoteError && (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-xs text-red-500">{promoteError}</p>
        )}
        {myItems.length === 0 && (
          <p className="text-xs text-ink-soft">Вы ещё не опубликовали ни статьи, ни видео.</p>
        )}
        {myItems.map((a) => (
          <div key={a.id} className="flex items-center gap-3 rounded-xl border border-line p-2.5">
            <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-ink">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={a.coverUrl} alt="" className="h-full w-full object-cover" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-ink">{a.title}</p>
              <p className="flex items-center gap-2 text-[11px] text-ink-faint">
                {a.kind === "video" ? (
                  <PlayCircle size={11} />
                ) : (
                  <Newspaper size={11} />
                )}
                {topicLabel(a.topic)} · <Eye size={11} /> {Number.isFinite(a.views) ? a.views : 0}
                {a.promoted && " · в топе"}
              </p>
            </div>
            {!a.promoted && (
              <button
                onClick={() => promote(a.id)}
                className="flex shrink-0 items-center gap-1 rounded-lg border border-accent px-2 py-1.5 text-[11px] font-semibold text-accent"
              >
                <ArrowUpCircle size={13} /> Топ за {PROMOTE_COST}
              </button>
            )}
            <button
              onClick={() => deleteArticle(a.id)}
              className="shrink-0 rounded-lg p-1.5 text-ink-faint active:bg-surface"
              aria-label="Удалить"
            >
              <Trash2 size={15} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
