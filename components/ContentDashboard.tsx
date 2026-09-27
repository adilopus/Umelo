"use client";

import { useState } from "react";
import {
  Newspaper,
  Trash2,
  ArrowUpCircle,
  Eye,
  PlayCircle,
  Megaphone,
  MousePointerClick,
} from "lucide-react";
import { useAppStore } from "@/lib/store";
import { ARTICLE_TOPICS, topicLabel } from "@/lib/articleTopics";
import { compressImage } from "@/lib/imageCompress";
import { CONTENT_ROLES, contentAuthorName, contentKind, type ContentRole } from "@/lib/contentRoles";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { Stat } from "@/components/ui/Stat";

/**
 * Один дашборд публикаций на блогера и продавца. Раньше это были два файла
 * (BloggerDashboard и SellerDashboard) с ~90% совпадающего кода: одинаковые
 * форма, кнопки продвижения, список материалов, обработка обложки, списание
 * билетов. Различались только имя роли, подписи и одно поле.
 */
export function ContentDashboard({ role }: { role: ContentRole }) {
  const cfg = CONTENT_ROLES[role];

  const ticketsBalance = useAppStore((s) => s.ticketsBalance);
  const subscriptionActive = useAppStore((s) => s.subscriptionActive);
  const addTickets = useAppStore((s) => s.addTickets);
  const articles = useAppStore((s) => s.articles);
  const addArticle = useAppStore((s) => s.addArticle);
  const deleteArticle = useAppStore((s) => s.deleteArticle);
  const setArticlePromoted = useAppStore((s) => s.setArticlePromoted);

  const [kind, setKind] = useState<"article" | "video">("article");
  const [title, setTitle] = useState("");
  const [topic, setTopic] = useState(ARTICLE_TOPICS[0].id);
  const [excerpt, setExcerpt] = useState("");
  const [linkUrl, setLinkUrl] = useState("");
  const [coverUrl, setCoverUrl] = useState<string | null>(null);
  const [promoteError, setPromoteError] = useState<string | null>(null);

  const authorName = contentAuthorName(role);
  const myItems = articles.filter((a) => a.authorName === authorName);
  const totalViews = myItems.reduce((s, a) => s + (Number.isFinite(a.views) ? a.views : 0), 0);
  const totalClicks = myItems.reduce((s, a) => s + (Number.isFinite(a.clicks) ? a.clicks : 0), 0);

  const fallbackCover = `data:image/svg+xml;utf8,${encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='400' height='240'><rect width='100%' height='100%' fill='${cfg.coverTint}'/></svg>`
  )}`;

  async function handleCover(files: FileList | null) {
    const file = files?.[0];
    if (!file) return;
    try {
      setCoverUrl(await compressImage(file, 800, 0.7));
    } catch {
      // игнорируем — обложка останется по умолчанию
    }
  }

  const canPublish = Boolean(title.trim() && excerpt.trim()) && (!cfg.linkRequired || Boolean(linkUrl.trim()));

  function publish() {
    if (!canPublish) return;
    addArticle({
      id: `${cfg.idPrefix}-${Date.now()}`,
      kind: kind === "video" ? "video" : contentKind(role),
      topic,
      title: title.trim(),
      excerpt: excerpt.trim(),
      content: excerpt.trim(),
      coverUrl: coverUrl ?? fallbackCover,
      authorName,
      promoted: false,
      createdAt: Date.now(),
      views: 0,
      clicks: 0,
      likes: 0,
      linkUrl: linkUrl.trim() || undefined,
    });
    setTitle("");
    setExcerpt("");
    setLinkUrl("");
    setCoverUrl(null);
  }

  function promote(articleId: string) {
    if (!subscriptionActive && ticketsBalance < cfg.promoteCost) {
      setPromoteError(
        `Нужно ${cfg.promoteCost} билета на балансе (сейчас ${ticketsBalance}), чтобы продвинуть материал в топ.`
      );
      return;
    }
    if (!subscriptionActive) addTickets(-cfg.promoteCost);
    setArticlePromoted(articleId, true);
    setPromoteError(null);
  }

  const FormIcon = role === "seller" ? Megaphone : Newspaper;

  return (
    <div className="space-y-5">
      <div className="space-y-4 rounded-2xl border border-line p-4">
        <p className="flex items-center gap-2 font-display text-sm font-extrabold text-ink">
          <FormIcon size={16} className="text-accent-ink" /> {cfg.formTitle}
        </p>

        {cfg.allowVideo && (
          <div className="grid grid-cols-2 gap-2">
            {(["article", "video"] as const).map((k) => (
              <button
                key={k}
                type="button"
                onClick={() => setKind(k)}
                aria-pressed={kind === k}
                className={`rounded-xl border py-2.5 text-sm font-semibold transition ${
                  kind === k
                    ? "border-accent bg-accent-soft text-accent-ink"
                    : "border-line text-ink-soft hover:bg-surface"
                }`}
              >
                {k === "article" ? "Статья" : "Видеоролик"}
              </button>
            ))}
          </div>
        )}

        <div>
          <label className="mb-1.5 block text-xs font-semibold text-ink-soft">Заголовок</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={
              role === "seller"
                ? "Например: −20% на сухие смеси до конца месяца"
                : "Например: Как выбрать плитку для кухни"
            }
            className="w-full rounded-xl border border-line bg-paper px-3 py-2.5 text-sm outline-none transition focus:border-accent"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-semibold text-ink-soft">Тематика</label>
          <select
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="w-full rounded-xl border border-line bg-paper px-3 py-2.5 text-sm outline-none transition focus:border-accent"
          >
            {ARTICLE_TOPICS.map((t) => (
              <option key={t.id} value={t.id}>
                {t.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-semibold text-ink-soft">
            {kind === "video" ? "Описание ролика" : role === "seller" ? "Условия акции" : "Краткое описание"}
          </label>
          <textarea
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            rows={3}
            placeholder={
              kind === "video"
                ? "О чём видео, что зритель узнает…"
                : role === "seller"
                  ? "Что входит в предложение, сроки действия, для кого актуально…"
                  : "О чём статья, для кого будет полезна…"
            }
            className="w-full resize-none rounded-xl border border-line bg-paper px-3 py-2.5 text-sm outline-none transition focus:border-accent"
          />
        </div>

        {(cfg.linkRequired || kind === "video") && (
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-ink-soft">{cfg.linkLabel}</label>
            <input
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              placeholder={cfg.linkPlaceholder}
              className="w-full rounded-xl border border-line bg-paper px-3 py-2.5 text-sm outline-none transition focus:border-accent"
            />
          </div>
        )}

        <div>
          <label className="mb-1.5 block text-xs font-semibold text-ink-soft">Обложка</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleCover(e.target.files)}
            className="w-full text-xs text-ink-soft file:mr-3 file:rounded-full file:border-0 file:bg-surface file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-ink"
          />
        </div>

        <Button onClick={publish} disabled={!canPublish} full>
          {cfg.publishLabel}
        </Button>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm font-extrabold text-ink">
            {cfg.listTitle} ({myItems.length})
          </p>
          <div className="flex items-center gap-2">
            <Stat value={totalViews} label="просмотров" />
            {cfg.trackClicks && <Stat value={totalClicks} label="переходов" />}
          </div>
        </div>

        {promoteError && (
          <p className="rounded-xl bg-danger-soft px-3 py-2.5 text-xs font-medium text-danger">
            {promoteError}
          </p>
        )}

        {myItems.length === 0 ? (
          <EmptyState title="Здесь пока пусто" hint={cfg.emptyHint} />
        ) : (
          myItems.map((a) => (
            <div key={a.id} className="flex items-center gap-3 rounded-xl border border-line p-2.5">
              <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-surface">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={a.coverUrl} alt="" className="h-full w-full object-cover" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-ink">{a.title}</p>
                <p className="mt-0.5 flex flex-wrap items-center gap-x-2 text-xs text-ink-faint">
                  {a.kind === "video" ? <PlayCircle size={12} /> : <Newspaper size={12} />}
                  {topicLabel(a.topic)}
                  <span className="flex items-center gap-1">
                    <Eye size={12} /> {Number.isFinite(a.views) ? a.views : 0}
                  </span>
                  {cfg.trackClicks && (
                    <span className="flex items-center gap-1">
                      <MousePointerClick size={12} /> {Number.isFinite(a.clicks) ? a.clicks : 0}
                    </span>
                  )}
                  {a.promoted && <span className="text-accent-ink">в топе</span>}
                </p>
              </div>
              {!a.promoted && (
                <button
                  type="button"
                  onClick={() => promote(a.id)}
                  className="flex shrink-0 items-center gap-1 rounded-full border border-accent px-3 py-1.5 text-xs font-bold text-accent-ink transition hover:bg-accent-soft"
                >
                  <ArrowUpCircle size={13} /> Топ за {cfg.promoteCost}
                </button>
              )}
              <button
                type="button"
                onClick={() => deleteArticle(a.id)}
                className="shrink-0 rounded-lg p-2 text-ink-faint transition hover:bg-danger-soft hover:text-danger"
                aria-label="Удалить"
              >
                <Trash2 size={15} />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
