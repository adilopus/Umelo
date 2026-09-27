"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { BadgeCheck, Clock3, MapPin, Search, Star, ArrowRight, Send, Check, Plus } from "lucide-react";
import { useAppStore } from "@/lib/store";
import { ProposeWorkModal } from "@/components/ProposeWorkModal";
import { SPECIALIST_ME } from "@/lib/mockSpecialists";
import { pluralize } from "@/lib/format";

const FILTERS = [
  "Все",
  "Сантехника",
  "Электрика",
  "Дизайн",
  "Отделка",
  "Плитка",
  "Малярные",
  "Кровля",
  "Ландшафт",
] as const;

type SortId = "rating" | "reviews" | "experience" | "distance";

const SORTS: { id: SortId; label: string }[] = [
  { id: "rating", label: "По рейтингу" },
  { id: "reviews", label: "По отзывам" },
  { id: "experience", label: "По опыту" },
  { id: "distance", label: "Ближе" },
];

export default function SpecialistsPage() {
  const role = useAppStore((s) => s.role);
  const specialists = useAppStore((s) => s.specialists);
  const orders = useAppStore((s) => s.orders);
  const offers = useAppStore((s) => s.offers);

  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("Все");
  const [sort, setSort] = useState<SortId>("rating");
  const [proposing, setProposing] = useState<string | null>(null);
  const [justSent, setJustSent] = useState<string | null>(null);
  // ?orderId=... читаем уже на клиенте: страница остаётся статически
  // рендерящейся (весь каталог виден сразу, без Suspense-fallback), а
  // привязка к конкретному заказу появляется после монтирования.
  const [presetOrderId, setPresetOrderId] = useState<string | null>(null);
  useEffect(() => {
    const value = new URLSearchParams(window.location.search).get("orderId");
    if (value) setPresetOrderId(value);
  }, []);

  const presetOrder = presetOrderId
    ? orders.find((o) => o.id === presetOrderId && o.status === "open")
    : undefined;

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = specialists.filter((s) => {
      const matchesQuery =
        !q ||
        s.name.toLowerCase().includes(q) ||
        s.profession.toLowerCase().includes(q) ||
        s.services.some((service) => service.toLowerCase().includes(q));
      const matchesFilter =
        filter === "Все" ||
        s.profession.toLowerCase().includes(filter.toLowerCase()) ||
        s.services.some((service) => service.toLowerCase().includes(filter.toLowerCase()));
      return matchesQuery && matchesFilter;
    });
    return list.sort((a, b) => {
      if (sort === "reviews") return b.reviewsCount - a.reviewsCount;
      if (sort === "experience") return b.experienceYears - a.experienceYears;
      if (sort === "distance") return a.distanceKm - b.distanceKm;
      return b.rating - a.rating;
    });
  }, [specialists, query, filter, sort]);

  function alreadyOffered(specialistName: string): boolean {
    if (!presetOrder) return justSent === specialistName;
    return offers.some(
      (o) =>
        o.orderId === presetOrder.id &&
        o.specialistName === specialistName &&
        (o.status === "pending" || o.status === "snoozed" || o.status === "accepted")
    );
  }

  return (
    <main className="min-h-[calc(100vh-64px)] bg-[#f7f8f7] px-4 pb-16 pt-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1100px]">
        <p className="text-xs font-bold uppercase tracking-[0.14em] text-accent">Люди UMELO</p>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="mt-1 font-display text-3xl font-extrabold text-ink">Специалисты</h1>
            <p className="mt-1 text-sm text-ink-soft">
              Выбирайте исполнителя по работам, опыту и отзывам.
            </p>
          </div>
          {role === "master" && (
            <Link
              href="/offers"
              className="hidden rounded-xl border border-line bg-white px-4 py-2.5 text-sm font-semibold text-ink lg:block"
            >
              Мои предложения
            </Link>
          )}
        </div>

        {presetOrder && (
          <div className="mt-5 rounded-2xl border border-accent/30 bg-accent-soft px-4 py-3 text-sm text-ink">
            <b>Выберите специалиста для заказа № {presetOrder.code}.</b> Предложение отправится на
            существующий заказ — новый заказ создаваться не будет.
          </div>
        )}

        <div className="mt-6 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex min-w-0 items-center gap-2 rounded-2xl border border-line bg-white px-4 py-3 lg:w-96">
            <Search size={17} className="shrink-0 text-ink-faint" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Поиск по имени, специализации, услуге"
              className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-ink-faint"
            />
          </div>
          <div className="flex items-center gap-2">
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortId)}
              className="rounded-xl border border-line bg-white px-3 py-2.5 text-xs font-semibold text-ink-soft outline-none"
              aria-label="Сортировка"
            >
              {SORTS.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-3 flex gap-2 overflow-x-auto pb-1 no-scrollbar">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`shrink-0 rounded-full border px-4 py-2 text-xs font-semibold transition ${
                filter === f
                  ? "border-accent bg-accent text-white"
                  : "border-line bg-white text-ink-soft hover:border-accent/50"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {visible.length === 0 ? (
          <div className="mt-10 rounded-2xl border border-dashed border-line bg-white p-10 text-center">
            <p className="font-display text-base font-extrabold text-ink">Никого не нашли</p>
            <p className="mt-1 text-sm text-ink-soft">Попробуйте изменить запрос или сбросить фильтр.</p>
          </div>
        ) : (
          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {visible.map((person) => {
              const offered = alreadyOffered(person.name);
              const isMe = person.id === SPECIALIST_ME;
              return (
                <article
                  key={person.id}
                  className={`flex flex-col rounded-2xl border bg-white p-5 transition hover:shadow-md ${
                    isMe ? "border-accent" : "border-line"
                  }`}
                >
                  <div className="flex gap-4">
                    <div className="h-16 w-16 shrink-0 overflow-hidden rounded-2xl bg-surface">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={person.avatarUrl} alt="" className="h-full w-full object-cover" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <h2 className="truncate font-display text-base font-extrabold text-ink">
                          {person.name}
                        </h2>
                        {isMe && (
                          <span className="shrink-0 rounded-full bg-accent px-2 py-0.5 text-[10px] font-bold text-white">
                            Это вы
                          </span>
                        )}
                        {person.verified && <BadgeCheck size={16} className="shrink-0 text-accent" />}
                      </div>
                      <p className="mt-0.5 truncate text-xs text-ink-soft">
                        {person.profession || "Профессия не указана"}
                      </p>
                      <p className="mt-2 flex items-center gap-1 text-xs">
                        <Star size={13} fill="currentColor" className="text-accent" />
                        <b>{person.rating ? person.rating.toFixed(1) : "—"}</b>
                        <span className="text-ink-faint">
                          ({person.reviewsCount}{" "}
                          {pluralize(person.reviewsCount, "отзыв", "отзыва", "отзывов")})
                        </span>
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {person.services.slice(0, 3).map((service) => (
                      <span key={service} className="rounded-full bg-surface px-2.5 py-1 text-[10px] font-bold text-ink-soft">
                        {service}
                      </span>
                    ))}
                  </div>

                  <div className="mt-4 grid grid-cols-3 gap-2 rounded-xl bg-[#f7f8f7] p-3 text-center">
                    <div>
                      <p className="font-display text-sm font-extrabold text-ink">{person.experienceYears} лет</p>
                      <p className="text-[10px] text-ink-faint">опыт</p>
                    </div>
                    <div>
                      <p className="font-display text-sm font-extrabold text-ink">{person.projectsCount}</p>
                      <p className="text-[10px] text-ink-faint">работ</p>
                    </div>
                    <div>
                      <p className="flex items-center justify-center gap-1 font-display text-sm font-extrabold text-ink">
                        <MapPin size={11} /> {person.distanceKm}
                      </p>
                      <p className="text-[10px] text-ink-faint">км</p>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center gap-2 text-[11px] text-ink-faint">
                    <Clock3 size={12} /> Отвечает {person.responseTime}
                  </div>

                  <div className="mt-4 flex gap-2 pt-1">
                    <Link
                      href={`/specialists/${person.id}`}
                      className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-line py-2.5 text-xs font-bold text-ink transition hover:border-accent"
                    >
                      Профиль <ArrowRight size={13} />
                    </Link>
                    {isMe ? (
                      <Link
                        href="/portfolio"
                        className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-accent py-2.5 text-xs font-bold text-white transition hover:bg-accent-dark"
                      >
                        <Plus size={13} /> Моё портфолио
                      </Link>
                    ) : role === "customer" ? (
                      <button
                        onClick={() => setProposing(person.name)}
                        disabled={offered}
                        className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-accent py-2.5 text-xs font-bold text-white transition hover:bg-accent-dark disabled:opacity-60"
                      >
                        {offered ? (
                          <>
                            <Check size={14} /> Предложено
                          </>
                        ) : (
                          <>
                            <Send size={13} /> Предложить
                          </>
                        )}
                      </button>
                    ) : (
                      <Link
                        href={`/chats`}
                        className="flex flex-1 items-center justify-center rounded-xl border border-line py-2.5 text-xs font-bold text-ink-soft transition hover:border-accent"
                      >
                        Написать
                      </Link>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>

      {proposing && (
        <ProposeWorkModal
          specialistName={proposing}
          presetOrderId={presetOrder?.id}
          onClose={() => setProposing(null)}
          onSent={() => setJustSent(proposing)}
        />
      )}
    </main>
  );
}
