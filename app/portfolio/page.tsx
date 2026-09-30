"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  BadgeCheck,
  Check,
  ChevronLeft,
  Eye,
  Heart,
  ImagePlus,
  Plus,
  Trash2,
  Wrench,
  X,
} from "lucide-react";

import { useAppStore } from "@/lib/store";
import { BottomNav } from "@/components/BottomNav";
import { compressImage } from "@/lib/imageCompress";
import { SPECIALIST_ME } from "@/lib/mockSpecialists";
import { CATEGORIES } from "@/lib/jobCategories";
import { formatDate, pluralize } from "@/lib/format";
import { Stars } from "@/components/ui/Stars";
import { Modal } from "@/components/ui/Modal";
import { Chip } from "@/components/ui/Chip";
import { Button, ButtonLink } from "@/components/ui/Button";
import { PageHeader } from "@/components/ui/PageHeader";
import { PageShell } from "@/components/ui/PageShell";
import type { PortfolioItem } from "@/lib/types";

const MAX_PHOTOS = 8;
const MAX_TEXT = 600;

interface Draft {
  title: string;
  category: string;
  description: string;
  price: string;
  durationDays: string;
  year: string;
  completed: boolean;
  images: string[];
}

const EMPTY_DRAFT: Draft = {
  title: "",
  category: "",
  description: "",
  price: "",
  durationDays: "",
  year: "",
  completed: true,
  images: [],
};

export default function PortfolioPage() {
  const role = useAppStore((s) => s.role);
  const portfolio = useAppStore((s) => s.portfolio);
  const reviews = useAppStore((s) => s.specialistReviews);
  const me = useAppStore((s) => s.specialists.find((x) => x.id === SPECIALIST_ME));
  const profile = useAppStore((s) => s.masterProfile);
  const addPortfolioItem = useAppStore((s) => s.addPortfolioItem);
  const deletePortfolioItem = useAppStore((s) => s.deletePortfolioItem);

  const [draft, setDraft] = useState<Draft>(EMPTY_DRAFT);
  const [showForm, setShowForm] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [slide, setSlide] = useState(0);

  const myWorks = useMemo(
    () =>
      portfolio
        .filter((p) => p.specialistId === SPECIALIST_ME)
        .sort((a, b) => b.createdAt - a.createdAt),
    [portfolio]
  );

  const myReviews = useMemo(
    () =>
      reviews
        .filter((r) => r.specialistId === SPECIALIST_ME)
        .sort((a, b) => b.createdAt - a.createdAt),
    [reviews]
  );

  const totals = useMemo(
    () => ({
      likes: myWorks.reduce((sum, w) => sum + (Number.isFinite(w.likes) ? w.likes : 0), 0),
      views: myWorks.reduce((sum, w) => sum + (Number.isFinite(w.views) ? w.views : 0), 0),
      photos: myWorks.reduce((sum, w) => sum + w.images.length, 0),
      completed: myWorks.filter((w) => w.completed).length,
    }),
    [myWorks]
  );

  const rating = me && me.reviewsCount > 0 ? me.rating : 0;
  const selected = myWorks.find((w) => w.id === selectedId);

  function set<K extends keyof Draft>(key: K, value: Draft[K]) {
    setDraft((prev) => ({ ...prev, [key]: value }));
  }

  async function handlePhotos(files: FileList | null) {
    if (!files || files.length === 0) return;
    setUploadError(null);
    const free = MAX_PHOTOS - draft.images.length;
    if (free <= 0) {
      setUploadError(`Максимум ${MAX_PHOTOS} фото в одной работе`);
      return;
    }
    try {
      const picked = Array.from(files).slice(0, free);
      const compressed = await Promise.all(
        picked.map((file) => compressImage(file, 1280, 0.72))
      );
      setDraft((prev) => ({ ...prev, images: [...prev.images, ...compressed] }));
      if (files.length > free) {
        setUploadError(`Добавлено ${free} фото — всего можно ${MAX_PHOTOS}`);
      }
    } catch {
      setUploadError("Не удалось обработать изображение");
    }
  }

  function publish() {
    if (!draft.title.trim() || draft.images.length === 0) return;
    const item: PortfolioItem = {
      id: `pf-me-${Date.now()}`,
      specialistId: SPECIALIST_ME,
      title: draft.title.trim(),
      category: draft.category || "Работа",
      description: draft.description.trim(),
      coverUrl: draft.images[0],
      images: draft.images,
      price: draft.price.trim() || undefined,
      durationDays: draft.durationDays ? Number(draft.durationDays) : undefined,
      completed: draft.completed,
      year: draft.year.trim() || undefined,
      likes: 0,
      views: 0,
      createdAt: Date.now(),
    };
    addPortfolioItem(item);
    setDraft(EMPTY_DRAFT);
    setShowForm(false);
    setUploadError(null);
  }

  const canPublish = Boolean(draft.title.trim() && draft.images.length > 0);

  if (role !== "master") {
    return (
      <main className="flex-1">
        <PageShell padBottom="pb-10">
          <p className="text-sm text-ink-soft">
            Портфолио заполняет исполнитель. Посмотреть работы мастеров можно в
            каталоге специалистов.
          </p>
          <Link
            href="/specialists"
            className="-my-1 mt-3 inline-block py-1 text-sm font-semibold text-accent-ink"
          >
            Открыть каталог специалистов
          </Link>
        </PageShell>
        <BottomNav />
      </main>
    );
  }

  return (
    <main className="flex-1">
      <PageShell padBottom="pb-12">
        <PageHeader
          title="Моё портфолио"
          subtitle={`${myWorks.length} ${pluralize(myWorks.length, "работа", "работы", "работ")} · ${myReviews.length} ${pluralize(myReviews.length, "отзыв", "отзыва", "отзывов")}`}
          actions={
            <>
              <Link
                href="/specialists/me"
                className="hidden rounded-xl bg-accent-soft px-3 py-2 text-xs font-bold text-accent-ink lg:block"
              >
                Как видят заказчики
              </Link>
              <button
                onClick={() => setShowForm((v) => !v)}
                className="flex items-center gap-1.5 rounded-xl bg-accent px-3.5 py-2 text-xs font-bold text-night"
              >
                <Plus size={14} /> Добавить работу
              </button>
            </>
          }
        />

        <section className="rounded-2xl border border-line bg-paper p-4">
          <div className="flex items-start gap-4">
            <div className="h-16 w-16 shrink-0 overflow-hidden rounded-2xl bg-surface">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={me?.avatarUrl} alt="" className="h-full w-full object-cover" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <p className="truncate font-display text-base font-extrabold text-ink">
                  {me?.name && me.name !== "Я" ? me.name : "Мой профиль"}
                </p>
                {profile.verified && <BadgeCheck size={16} className="text-accent-ink" />}
              </div>
              <p className="mt-0.5 truncate text-xs text-ink-soft">
                {profile.profession || "Профессия не указана — заполните в кабинете"}
              </p>
              <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-ink-soft">
                <span className="flex items-center gap-1">
                  <Stars value={rating} />
                  <b className="text-ink">{rating ? rating.toFixed(1) : "—"}</b>
                </span>
                <span>{profile.experienceYears} лет опыта</span>
                {profile.priceFrom && <span className="font-semibold text-ink">{profile.priceFrom}</span>}
              </div>
            </div>
            <Link
              href="/cabinet?tab=extra"
              className="shrink-0 self-start rounded-xl border border-line px-3 py-2 text-xs font-bold text-ink-soft"
            >
              Анкета
            </Link>
          </div>

          <div className="mt-4 grid grid-cols-4 gap-2 rounded-xl bg-surface p-3 text-center">
            <div>
              <p className="font-display text-sm font-extrabold text-ink">{totals.completed}</p>
              <p className="text-xs text-ink-faint">выполнено</p>
            </div>
            <div>
              <p className="font-display text-sm font-extrabold text-ink">{totals.photos}</p>
              <p className="text-xs text-ink-faint">фото</p>
            </div>
            <div>
              <p className="flex items-center justify-center gap-1 font-display text-sm font-extrabold text-ink">
                <Heart size={12} /> {totals.likes}
              </p>
              <p className="text-xs text-ink-faint">лайков</p>
            </div>
            <div>
              <p className="flex items-center justify-center gap-1 font-display text-sm font-extrabold text-ink">
                <Eye size={12} /> {totals.views}
              </p>
              <p className="text-xs text-ink-faint">просмотров</p>
            </div>
          </div>

          <div className="mt-3 flex flex-wrap gap-1.5">
            {profile.services.length === 0 && (
              <Link href="/cabinet?tab=extra" className="text-xs font-semibold text-accent-ink">
                Добавьте направления работ в анкете →
              </Link>
            )}
            {profile.services.map((s) => (
              <span
                key={s}
                className="rounded-full bg-surface px-2.5 py-1 text-xs font-bold text-ink-soft"
              >
                {s}
              </span>
            ))}
          </div>
        </section>

        {showForm && (
          <section className="space-y-3 rounded-2xl border border-accent/30 bg-paper p-4">
            <div className="flex items-center justify-between">
              <p className="font-display text-sm font-bold">Новая работа</p>
              <button
                onClick={() => {
                  setShowForm(false);
                  setDraft(EMPTY_DRAFT);
                  setUploadError(null);
                }}
                aria-label="Закрыть форму"
                className="rounded-lg p-1.5 text-ink-faint"
              >
                <X size={16} />
              </button>
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-ink-soft">Название *</label>
              <input
                value={draft.title}
                onChange={(e) => set("title", e.target.value)}
                placeholder="Например: Разводка сантехники под ключ"
                className="w-full rounded-lg border border-line px-3 py-2 text-sm outline-none placeholder:text-ink-faint"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1 block text-xs font-medium text-ink-soft">Категория</label>
                <select
                  value={draft.category}
                  onChange={(e) => set("category", e.target.value)}
                  className="w-full rounded-lg border border-line bg-paper px-3 py-2 text-sm outline-none"
                >
                  <option value="">— выбрать —</option>
                  {CATEGORIES.map((c) => (
                    <option key={c.name} value={c.name}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-ink-soft">Год</label>
                <input
                  value={draft.year}
                  onChange={(e) => set("year", e.target.value)}
                  placeholder="2026"
                  inputMode="numeric"
                  className="w-full rounded-lg border border-line px-3 py-2 text-sm outline-none placeholder:text-ink-faint"
                />
              </div>
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-ink-soft">
                Описание{" "}
                <span className="text-ink-faint">
                  {draft.description.length}/{MAX_TEXT}
                </span>
              </label>
              <textarea
                value={draft.description}
                onChange={(e) => set("description", e.target.value.slice(0, MAX_TEXT))}
                rows={4}
                placeholder="Что сделали, какие материалы и решения, сколько заняло"
                className="w-full resize-none rounded-lg border border-line px-3 py-2 text-sm outline-none placeholder:text-ink-faint"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-ink-soft">
                Фотографии *{" "}
                <span className="text-ink-faint">
                  {draft.images.length}/{MAX_PHOTOS}, первое — обложка
                </span>
              </label>
              <div className="flex flex-wrap gap-2">
                {draft.images.map((src, index) => (
                  <div key={index} className="relative">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={src}
                      alt=""
                      className="h-16 w-16 rounded-lg object-cover"
                    />
                    {index === 0 && (
                      <span className="absolute bottom-0 left-0 rounded-tl-lg bg-accent px-1 text-xs font-bold text-night">
                        обложка
                      </span>
                    )}
                    <button
                      onClick={() => set("images", draft.images.filter((_, i) => i !== index))}
                      className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-ink text-white"
                      aria-label="Убрать фото"
                    >
                      <X size={11} />
                    </button>
                  </div>
                ))}
                {draft.images.length < MAX_PHOTOS && (
                  <label className="flex h-16 w-16 cursor-pointer items-center justify-center rounded-lg border border-dashed border-line text-ink-faint">
                    <ImagePlus size={18} />
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={(e) => handlePhotos(e.target.files)}
                    />
                  </label>
                )}
              </div>
              {uploadError && <p className="mt-1 text-xs text-danger">{uploadError}</p>}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1 block text-xs font-medium text-ink-soft">Цена</label>
                <input
                  value={draft.price}
                  onChange={(e) => set("price", e.target.value)}
                  placeholder="от 95 000 ₽"
                  className="w-full rounded-lg border border-line px-3 py-2 text-sm outline-none placeholder:text-ink-faint"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-ink-soft">Срок, дней</label>
                <input
                  type="number"
                  min={1}
                  value={draft.durationDays}
                  onChange={(e) => set("durationDays", e.target.value)}
                  placeholder="6"
                  className="w-full rounded-lg border border-line px-3 py-2 text-sm outline-none placeholder:text-ink-faint"
                />
              </div>
            </div>

            <button
              onClick={() => set("completed", !draft.completed)}
              className={`flex w-full items-center gap-2 rounded-lg border px-3 py-2.5 text-left text-sm transition ${
                draft.completed ? "border-ok bg-ok-soft text-ok" : "border-line text-ink-soft"
              }`}
            >
              <Wrench size={16} />
              {draft.completed ? "Выполненный проект (сдан заказчику)" : "Работа в процессе"}
              {draft.completed && <Check size={15} className="ml-auto" />}
            </button>

            <button
              onClick={publish}
              disabled={!canPublish}
              className="w-full rounded-xl bg-accent py-3 text-sm font-bold text-night disabled:opacity-50"
            >
              Опубликовать работу
            </button>
          </section>
        )}

        <section>
          <h2 className="font-display text-sm font-extrabold text-ink">Мои работы</h2>
          {myWorks.length === 0 ? (
            <p className="mt-3 rounded-2xl border border-dashed border-line bg-paper p-6 text-center text-sm text-ink-soft">
              Добавьте первую работу — её увидят заказчики в каталоге специалистов.
            </p>
          ) : (
            <div className="mt-3 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {myWorks.map((work) => (
                <article
                  key={work.id}
                  className="flex flex-col overflow-hidden rounded-2xl border border-line bg-paper"
                >
                  <button
                    onClick={() => {
                      setSelectedId(work.id);
                      setSlide(0);
                    }}
                    className="relative block aspect-[4/3] w-full overflow-hidden bg-ink"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={work.coverUrl}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                    {work.completed && (
                      <span className="absolute left-0 top-3 rounded-r-full bg-ok px-2.5 py-1 text-xs font-bold text-white">
                        Выполнено{work.year ? ` · ${work.year}` : ""}
                      </span>
                    )}
                    {work.images.length > 1 && (
                      <span className="absolute bottom-3 right-3 rounded-full bg-night/70 px-2 py-0.5 text-xs font-medium text-white">
                        {work.images.length} фото
                      </span>
                    )}
                  </button>
                  <div className="flex flex-1 flex-col p-3">
                    <p className="truncate text-xs text-ok">{work.category}</p>
                    <p className="line-clamp-2 font-display text-sm font-bold leading-tight text-ink">
                      {work.title}
                    </p>
                    {work.description && (
                      <p className="mt-1 line-clamp-2 text-xs text-ink-faint">
                        {work.description}
                      </p>
                    )}
                    <div className="mt-auto flex items-center gap-3 pt-2 text-xs text-ink-faint">
                      {work.price && <span className="font-semibold text-ink-soft">{work.price}</span>}
                      {work.durationDays ? <span>{work.durationDays} дн.</span> : null}
                      <span className="ml-auto flex items-center gap-1">
                        <Heart size={11} /> {Number.isFinite(work.likes) ? work.likes : 0}
                      </span>
                      <span className="flex items-center gap-1">
                        <Eye size={11} /> {Number.isFinite(work.views) ? work.views : 0}
                      </span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        <section>
          <h2 className="font-display text-sm font-extrabold text-ink">Отзывы о мастере</h2>
          <p className="mt-0.5 text-xs text-ink-soft">
            Оставляют заказчики после сдачи работы — их видят в каталоге.
          </p>
          {myReviews.length === 0 ? (
            <p className="mt-3 rounded-2xl border border-dashed border-line bg-paper p-6 text-center text-sm text-ink-soft">
              Отзывов пока нет. Они появятся после первых выполненных заказов.
            </p>
          ) : (
            <div className="mt-3 space-y-2">
              {myReviews.map((review) => (
                <div key={review.id} className="rounded-2xl border border-line bg-paper p-3">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-bold text-ink">{review.authorName}</p>
                    <span className="shrink-0 text-xs text-ink-faint">
                      {formatDate(review.createdAt)}
                    </span>
                  </div>
                  <div className="mt-1">
                    <Stars value={review.rating} />
                  </div>
                  <p className="mt-1.5 text-xs leading-5 text-ink-soft">{review.text}</p>
                </div>
              ))}
            </div>
          )}
        </section>
      </PageShell>

      {selected && (
        <Modal open onClose={() => setSelectedId(null)} title={selected.title} width="lg">
          <div className="relative bg-ink">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={selected.images[slide] ?? selected.coverUrl}
              alt=""
              className="max-h-[46vh] w-full object-contain"
            />
            {selected.images.length > 1 && (
              <>
                <button
                  onClick={() =>
                    setSlide((s) => (s - 1 + selected.images.length) % selected.images.length)
                  }
                  aria-label="Предыдущее фото"
                  className="absolute left-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-night/60 text-white transition hover:bg-night/80"
                >
                  <ChevronLeft size={18} />
                </button>
                <button
                  onClick={() => setSlide((s) => (s + 1) % selected.images.length)}
                  aria-label="Следующее фото"
                  className="absolute right-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-night/60 text-white transition hover:bg-night/80"
                >
                  <ChevronLeft size={18} className="rotate-180" />
                </button>
                <span className="absolute bottom-2 right-3 rounded-full bg-night/70 px-2 py-0.5 text-xs text-white">
                  {slide + 1} / {selected.images.length}
                </span>
              </>
            )}
          </div>

          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <Chip size="sm">{selected.category}</Chip>
              {selected.completed && (
                <Chip size="sm" tone="ok">
                  Выполнено{selected.year ? ` · ${selected.year}` : ""}
                </Chip>
              )}
              {selected.price && (
                <span className="text-sm font-bold text-ink">{selected.price}</span>
              )}
              {selected.durationDays ? (
                <span className="text-xs text-ink-faint">{selected.durationDays} дн.</span>
              ) : null}
            </div>
            {selected.description && (
              <p className="text-sm leading-6 text-ink-soft">{selected.description}</p>
            )}
            <div className="flex items-center gap-3 text-xs text-ink-faint">
              <span>Добавлено {formatDate(selected.createdAt)}</span>
              <span className="ml-auto flex items-center gap-1">
                <Heart size={12} /> {Number.isFinite(selected.likes) ? selected.likes : 0}
              </span>
              <span className="flex items-center gap-1">
                <Eye size={12} /> {Number.isFinite(selected.views) ? selected.views : 0}
              </span>
            </div>
          </div>

          <div className="mt-4 flex gap-2 border-t border-line pt-3">
            <ButtonLink href="/specialists/me" variant="outline" size="sm" full>
              Открыть витрину
            </ButtonLink>
            <Button
              variant="subtle"
              size="sm"
              className="text-danger"
              onClick={() => {
                deletePortfolioItem(selected.id);
                setSelectedId(null);
              }}
            >
              <Trash2 size={14} /> Удалить
            </Button>
          </div>
        </Modal>
      )}

      <BottomNav />
    </main>
  );
}
