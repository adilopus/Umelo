"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  BadgeCheck,
  BriefcaseBusiness,
  Check,
  Clock3,
  Eye,
  Heart,
  MapPin,
  MessageCircle,
  Send,
  ShieldCheck,
  Star,
  ThumbsUp,
  X,
} from "lucide-react";
import { useAppStore } from "@/lib/store";
import { ProposeWorkModal } from "@/components/ProposeWorkModal";
import { formatDate, pluralize } from "@/lib/format";
import type { PortfolioItem } from "@/lib/types";

function Stars({ value, size = 14 }: { value: number; size?: number }) {
  return (
    <span className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          size={size}
          fill={i <= Math.round(value) ? "currentColor" : "none"}
          className={i <= Math.round(value) ? "text-accent-ink" : "text-ink-faint"}
        />
      ))}
    </span>
  );
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-2xl bg-surface p-3.5">
      <p className="text-xs text-ink-faint">{label}</p>
      <p className="mt-1 font-display text-base font-extrabold text-ink">{value}</p>
    </div>
  );
}

function PortfolioModal({
  item,
  liked,
  onLike,
  onClose,
}: {
  item: PortfolioItem;
  liked: boolean;
  onLike: () => void;
  onClose: () => void;
}) {
  const [active, setActive] = useState(0);
  const images = item.images.length > 0 ? item.images : [item.coverUrl];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
      <div
        className="max-h-[90vh] w-full max-w-content overflow-auto rounded-3xl bg-paper shadow-pop"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative bg-ink">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={images[active]} alt="" className="max-h-[52vh] w-full object-cover" />
          <button
            onClick={onClose}
            className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-paper/90 text-ink"
            aria-label="Закрыть"
          >
            <X size={18} />
          </button>
          {images.length > 1 && (
            <div className="absolute inset-x-0 bottom-0 flex gap-2 overflow-x-auto p-3 no-scrollbar">
              {images.map((image, index) => (
                <button
                  key={image}
                  onClick={() => setActive(index)}
                  className={`h-14 w-20 shrink-0 overflow-hidden rounded-lg border-2 ${
                    active === index ? "border-accent" : "border-white/40"
                  }`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={image} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="p-5 sm:p-6">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <span className="rounded-full bg-accent-soft px-2.5 py-1 text-xs font-extrabold uppercase tracking-wide text-accent-ink">
                {item.category}
              </span>
              <h2 className="mt-3 font-display text-2xl font-extrabold text-ink">{item.title}</h2>
            </div>
            {item.price && (
              <span className="price-tag bg-accent px-3 py-1.5 font-display text-sm font-extrabold text-night">
                {item.price}
              </span>
            )}
          </div>
          <p className="mt-4 text-sm leading-6 text-ink-soft">{item.description}</p>
          <div className="mt-5 flex flex-wrap items-center gap-4 text-xs text-ink-soft">
            {item.durationDays && (
              <span className="flex items-center gap-1.5">
                <Clock3 size={13} /> {item.durationDays} {pluralize(item.durationDays, "день", "дня", "дней")}
              </span>
            )}
            <span className="flex items-center gap-1.5">
              <Eye size={13} /> {item.views} {pluralize(item.views, "просмотр", "просмотра", "просмотров")}
            </span>
            <span className="text-ink-faint">{formatDate(item.createdAt)}</span>
            <button
              onClick={onLike}
              className={`ml-auto flex items-center gap-1.5 rounded-full border px-3 py-1.5 font-bold transition ${
                liked ? "border-accent bg-accent-soft text-accent-ink" : "border-line text-ink-soft"
              }`}
            >
              <Heart size={14} fill={liked ? "currentColor" : "none"} /> {item.likes}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SpecialistDetailPage() {
  const { id } = useParams<{ id: string }>();
  const role = useAppStore((s) => s.role);
  const specialist = useAppStore((s) => s.specialists.find((s) => s.id === id));
  const portfolio = useAppStore((s) => s.portfolio);
  const reviews = useAppStore((s) => s.specialistReviews);
  const likedPortfolioIds = useAppStore((s) => s.likedPortfolioIds);
  const incrementSpecialistViews = useAppStore((s) => s.incrementSpecialistViews);
  const incrementPortfolioViews = useAppStore((s) => s.incrementPortfolioViews);
  const togglePortfolioLike = useAppStore((s) => s.togglePortfolioLike);
  const addSpecialistReview = useAppStore((s) => s.addSpecialistReview);
  const authName = useAppStore((s) => s.authName);
  const personalData = useAppStore((s) => s.personalData);

  const [openItem, setOpenItem] = useState<PortfolioItem | null>(null);
  const [proposing, setProposing] = useState(false);
  const [sentOffer, setSentOffer] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewText, setReviewText] = useState("");
  const [reviewSent, setReviewSent] = useState(false);

  useEffect(() => {
    if (specialist) incrementSpecialistViews(specialist.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [specialist?.id]);

  const myPortfolio = useMemo(
    () => portfolio.filter((p) => p.specialistId === id),
    [portfolio, id]
  );
  const myReviews = useMemo(
    () =>
      reviews
        .filter((r) => r.specialistId === id)
        .slice()
        .sort((a, b) => b.createdAt - a.createdAt),
    [reviews, id]
  );

  function openPortfolio(item: PortfolioItem) {
    setOpenItem(item);
    incrementPortfolioViews(item.id);
  }

  function submitReview() {
    if (!specialist || !reviewText.trim()) return;
    addSpecialistReview({
      id: `rev-${Date.now()}`,
      specialistId: specialist.id,
      authorName: authName || personalData.nickname || personalData.fullName || "Заказчик UMELO",
      rating: reviewRating,
      text: reviewText.trim(),
      createdAt: Date.now(),
    });
    setReviewText("");
    setReviewRating(5);
    setReviewSent(true);
  }

  if (!specialist) {
    return (
      <main className="mx-auto flex min-h-[60vh] w-full max-w-md flex-col items-center justify-center gap-3 px-4 text-center">
        <p className="font-display text-lg font-extrabold">Специалист не найден</p>
        <p className="text-sm text-ink-soft">Возможно, профиль был удалён или ссылка устарела.</p>
        <Link href="/specialists" className="rounded-xl bg-accent px-5 py-2.5 text-sm font-semibold text-night">
          Все специалисты
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-surface pb-24 lg:pb-16">
      <div className="mx-auto max-w-page px-4 pt-5 sm:px-6 lg:px-8 lg:pt-7">
        <Link
          href="/specialists"
          className="mb-5 inline-flex items-center gap-2 text-xs font-bold text-ink-soft transition hover:text-ink"
        >
          <ArrowLeft size={15} /> Все специалисты
        </Link>

        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_340px]">
          <section className="space-y-5">
            <div className="rounded-[24px] border border-line bg-paper p-5 sm:p-7">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
                <div className="h-24 w-24 shrink-0 overflow-hidden rounded-3xl bg-surface">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={specialist.avatarUrl} alt="" className="h-full w-full object-cover" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h1 className="font-display text-3xl font-extrabold leading-tight text-ink">
                      {specialist.name}
                    </h1>
                    {specialist.verified && <BadgeCheck size={22} className="shrink-0 text-accent-ink" />}
                  </div>
                  <p className="mt-1 text-sm text-ink-soft">{specialist.profession}</p>
                  <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-ink-soft">
                    <span className="flex items-center gap-1.5">
                      <Stars value={specialist.rating} />
                      <b className="text-ink">{specialist.rating.toFixed(1)}</b>
                      <span className="text-ink-faint">
                        {specialist.reviewsCount}{" "}
                        {pluralize(specialist.reviewsCount, "отзыв", "отзыва", "отзывов")}
                      </span>
                    </span>
                    <span className="flex items-center gap-1.5">
                      <MapPin size={13} /> {specialist.city} · {specialist.distanceKm} км
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Clock3 size={13} /> отвечает {specialist.responseTime}
                    </span>
                  </div>
                </div>
              </div>

              {specialist.verified && (
                <p className="mt-5 flex items-center gap-2 rounded-xl bg-ok-soft px-3.5 py-2.5 text-xs font-semibold text-ok">
                  <ShieldCheck size={15} /> Документы и страховка подтверждены
                </p>
              )}

              <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
                <Stat label="Опыт" value={`${specialist.experienceYears} лет`} />
                <Stat label="Работ" value={specialist.projectsCount} />
                <Stat label="Просмотров" value={specialist.views} />
                <Stat label="Рейтинг" value={specialist.rating.toFixed(1)} />
              </div>
            </div>

            <div className="rounded-[24px] border border-line bg-paper p-5 sm:p-7">
              <h2 className="font-display text-xl font-extrabold text-ink">О специалисте</h2>
              <p className="mt-3 text-sm leading-6 text-ink-soft">{specialist.bio}</p>

              <p className="mt-6 text-xs font-bold uppercase tracking-wide text-ink-faint">Направления</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {specialist.services.map((service) => (
                  <span key={service} className="rounded-full bg-surface px-3 py-1.5 text-xs font-bold text-ink-soft">
                    {service}
                  </span>
                ))}
              </div>

              <p className="mt-6 text-xs font-bold uppercase tracking-wide text-ink-faint">Инструменты и навыки</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {specialist.skills.map((skill) => (
                  <span key={skill} className="flex items-center gap-1.5 rounded-full border border-line px-3 py-1.5 text-xs font-semibold text-ink-soft">
                    <Check size={12} className="text-accent-ink" /> {skill}
                  </span>
                ))}
              </div>
            </div>

            <div className="rounded-[24px] border border-line bg-paper p-5 sm:p-7">
              <div className="flex items-end justify-between">
                <div>
                  <h2 className="font-display text-xl font-extrabold text-ink">Портфолио</h2>
                  <p className="mt-1 text-xs text-ink-soft">
                    {myPortfolio.length} {pluralize(myPortfolio.length, "работа", "работы", "работ")}
                  </p>
                </div>
              </div>
              {myPortfolio.length === 0 ? (
                <p className="mt-4 rounded-2xl border border-dashed border-line p-8 text-center text-sm text-ink-soft">
                  Специалист пока не добавил работы.
                </p>
              ) : (
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {myPortfolio.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => openPortfolio(item)}
                      className="group overflow-hidden rounded-2xl border border-line text-left transition hover:shadow-card-hover"
                    >
                      <div className="aspect-[4/3] overflow-hidden bg-surface">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={item.coverUrl}
                          alt=""
                          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                        />
                      </div>
                      <div className="p-3.5">
                        <p className="text-xs font-bold uppercase tracking-wide text-accent-ink">{item.category}</p>
                        <p className="mt-1 line-clamp-2 font-display text-sm font-extrabold text-ink">{item.title}</p>
                        <div className="mt-2 flex items-center justify-between text-xs text-ink-faint">
                          {item.price && <span className="font-bold text-ink">{item.price}</span>}
                          <span className="ml-auto flex items-center gap-1">
                            <Heart size={12} /> {item.likes}
                          </span>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="rounded-[24px] border border-line bg-paper p-5 sm:p-7">
              <div className="flex items-end justify-between">
                <div>
                  <h2 className="font-display text-xl font-extrabold text-ink">Отзывы</h2>
                  <p className="mt-1 text-xs text-ink-soft">
                    {specialist.reviewsCount}{" "}
                    {pluralize(specialist.reviewsCount, "отзыв", "отзыва", "отзывов")}
                  </p>
                </div>
              </div>

              <div className="mt-4 space-y-3">
                {myReviews.length === 0 && (
                  <p className="rounded-2xl bg-surface p-4 text-sm text-ink-soft">Отзывов пока нет.</p>
                )}
                {myReviews.map((review) => (
                  <div key={review.id} className="rounded-2xl border border-line p-4">
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-sm font-extrabold text-ink">{review.authorName}</p>
                      <Stars value={review.rating} size={12} />
                    </div>
                    <p className="mt-2 text-sm leading-6 text-ink-soft">{review.text}</p>
                    <p className="mt-2 text-xs text-ink-faint">{formatDate(review.createdAt)}</p>
                  </div>
                ))}
              </div>

              {role === "customer" ? (
                <div className="mt-5 rounded-2xl border border-line bg-surface p-4">
                  <p className="font-display text-sm font-extrabold text-ink">Оставить отзыв</p>
                  {reviewSent ? (
                    <p className="mt-2 flex items-center gap-2 text-sm text-ok">
                      <Check size={16} /> Спасибо! Отзыв опубликован.
                    </p>
                  ) : (
                    <>
                      <div className="mt-3 flex items-center gap-2">
                        {[1, 2, 3, 4, 5].map((i) => (
                          <button
                            key={i}
                            onClick={() => setReviewRating(i)}
                            aria-label={`Оценка ${i}`}
                            className="p-0.5"
                          >
                            <Star
                              size={22}
                              fill={i <= reviewRating ? "currentColor" : "none"}
                              className={i <= reviewRating ? "text-accent-ink" : "text-ink-faint"}
                            />
                          </button>
                        ))}
                      </div>
                      <textarea
                        value={reviewText}
                        onChange={(e) => setReviewText(e.target.value)}
                        rows={3}
                        placeholder="Как прошла работа, что понравилось?"
                        className="mt-3 w-full resize-none rounded-xl border border-line px-3 py-2 text-sm outline-none placeholder:text-ink-faint"
                      />
                      <button
                        onClick={submitReview}
                        disabled={!reviewText.trim()}
                        className="mt-3 flex items-center gap-2 rounded-xl bg-accent px-4 py-2.5 text-xs font-bold text-night disabled:opacity-50"
                      >
                        <ThumbsUp size={14} /> Опубликовать отзыв
                      </button>
                    </>
                  )}
                </div>
              ) : (
                <p className="mt-5 rounded-2xl bg-surface p-4 text-xs text-ink-soft">
                  Отзывы могут оставлять заказчики после работы со специалистом.
                </p>
              )}
            </div>
          </section>

          <aside className="lg:sticky lg:top-28 lg:self-start">
            <div className="rounded-[24px] border border-line bg-paper p-5 shadow-card">
              <p className="flex items-center gap-2 text-xs text-ink-soft">
                <BriefcaseBusiness size={14} className="text-accent-ink" /> {specialist.profession}
              </p>
              <div className="mt-4 grid grid-cols-2 gap-2">
                <div className="rounded-xl bg-surface p-3">
                  <p className="text-xs text-ink-faint">Опыт</p>
                  <p className="mt-1 text-sm font-extrabold text-ink">{specialist.experienceYears} лет</p>
                </div>
                <div className="rounded-xl bg-surface p-3">
                  <p className="text-xs text-ink-faint">Отзывы</p>
                  <p className="mt-1 text-sm font-extrabold text-ink">{specialist.reviewsCount}</p>
                </div>
              </div>

              {role === "customer" ? (
                <button
                  onClick={() => setProposing(true)}
                  disabled={sentOffer}
                  className="mt-4 flex h-11 w-full items-center justify-center gap-2 rounded-full bg-accent text-xs font-extrabold text-night transition hover:bg-accent-dark disabled:opacity-60"
                >
                  {sentOffer ? (
                    <>
                      <Check size={16} /> Предложение отправлено
                    </>
                  ) : (
                    <>
                      <Send size={15} /> Предложить работу
                    </>
                  )}
                </button>
              ) : (
                <button
                  disabled
                  className="mt-4 flex h-11 w-full items-center justify-center gap-2 rounded-full border border-line text-xs font-extrabold text-ink-faint"
                >
                  Предложить может заказчик
                </button>
              )}

              <Link
                href="/chats"
                className="mt-2 flex h-11 w-full items-center justify-center gap-2 rounded-full border border-line text-xs font-extrabold text-ink transition hover:border-accent hover:bg-accent-soft"
              >
                <MessageCircle size={15} /> Написать
              </Link>
              <p className="mt-3 text-center text-xs text-ink-faint">
                Работаете через UMELO — переписка и статус заказа в одном месте.
              </p>
            </div>

            <div className="mt-4 rounded-[24px] bg-night p-5 text-white">
              <p className="text-xs font-extrabold uppercase tracking-[0.15em] text-accent">Правило UMELO</p>
              <p className="mt-2 font-display text-base font-extrabold leading-tight">
                Предложение не создаёт новый заказ.
              </p>
              <p className="mt-1 text-xs leading-5 text-white/60">
                Вы предлагаете специалисту один из своих уже опубликованных заказов.
              </p>
            </div>
          </aside>
        </div>
      </div>

      {openItem && (
        <PortfolioModal
          item={openItem}
          liked={likedPortfolioIds.includes(openItem.id)}
          onLike={() => togglePortfolioLike(openItem.id)}
          onClose={() => setOpenItem(null)}
        />
      )}

      {proposing && (
        <ProposeWorkModal
          specialistName={specialist.name}
          onClose={() => setProposing(false)}
          onSent={() => setSentOffer(true)}
        />
      )}
    </main>
  );
}
