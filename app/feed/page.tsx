"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { MessageCircle, Search, Star, Quote } from "lucide-react";
import { useAppStore } from "@/lib/store";
import { ArticleCard } from "@/components/ArticleCard";
import { OrderCard } from "@/components/OrderCard";
import { CarouselSection } from "@/components/CarouselSection";
import { ProjectCard } from "@/components/ProjectCard";
import { BottomNav } from "@/components/BottomNav";
import { codesMatch } from "@/lib/orderCode";
import { offersForFeed, topArticlesForFeed, topOrdersForFeed, topProjectsForFeed, type ArticleFeedMode } from "@/lib/feedRanking";

const JOURNAL_TABS = [
  { id: "new", label: "Новые" },
  { id: "popular", label: "Популярные" },
];

type JournalTab = (typeof JOURNAL_TABS)[number]["id"];

/**
 * Заказы, поднятые платным продвижением, должны встать выше свежих.
 * Сейчас оплаты нет, поэтому список пуст — точка подключения готова.
 */
const PROMOTED_ORDER_IDS: string[] = [];

const specialists = [
  { name: "Алексей Петров", role: "Сантехника", rating: "4.9", reviews: 127, distance: "8 км", image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=120&q=80" },
  { name: "Иван Кузнецов", role: "Электрика", rating: "4.8", reviews: 96, distance: "12 км", image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80" },
  { name: "Мария Смирнова", role: "Дизайн интерьера", rating: "5.0", reviews: 66, distance: "15 км", image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80" },
];

function shuffle<T>(list: T[]) {
  const arr = [...list];
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function SafeImage({ src, alt = "", className = "", fallback = "/icons/logo-mark.png" }: { src: string; alt?: string; className?: string; fallback?: string }) {
  return <img src={src} alt={alt} className={className} onError={(e) => { const img = e.currentTarget; if (!img.dataset.fallback) { img.dataset.fallback = "1"; img.src = fallback; img.classList.add("object-contain", "p-4", "opacity-60"); } }} />;
}

function Avatar({ name, image, large = false }: { name: string; image?: string; large?: boolean }) {
  return (
    <div className={`relative flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#e8ece9] font-bold text-ink ${large ? "h-10 w-10 text-xs" : "h-9 w-9 text-xs"}`}>
      {image ? <SafeImage src={image} alt="" className="h-full w-full object-cover" /> : name.split(" ").map((part) => part[0]).join("").slice(0, 2)}
    </div>
  );
}

function CommunityCard() {
  return <Link href="/community" className="group block min-w-0 w-full overflow-hidden rounded-2xl bg-night p-5 text-white transition hover:-translate-y-0.5"><div className="flex items-start justify-between gap-4"><div><p className="text-xs font-extrabold uppercase tracking-[0.16em] text-accent">Обсуждение</p><h3 className="mt-2 font-display text-lg font-extrabold leading-tight">Как лучше утеплить фасад частного дома?</h3></div><Quote size={24} className="shrink-0 text-white/25" /></div><div className="mt-5 flex items-center gap-3"><Avatar name="Иван Кузнецов" image={specialists[1].image} /><div><p className="text-xs font-bold">Иван Кузнецов</p><p className="text-xs text-white/50">Электрик · 4.8 ⭐</p></div></div><div className="mt-5 flex items-center justify-between text-xs text-white/50"><span>18 ответов · 42 сохранения</span><span className="font-bold text-accent group-hover:text-white">Обсудить →</span></div></Link>;
}

export default function FeedPage() {
  const router = useRouter();
  const orders = useAppStore((s) => s.orders);
  const articles = useAppStore((s) => s.articles);
  const projects = useAppStore((s) => s.projects);
  const [searchValue, setSearchValue] = useState("");
  const [searchError, setSearchError] = useState<string | null>(null);
  const [shuffleSeed, setShuffleSeed] = useState(0);
  const [journalTab, setJournalTab] = useState<JournalTab>("new");
  const logoTaps = useRef(0);
  const logoTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const unlockAdmin = useAppStore((s) => s.unlockAdmin);
  const adminUnlocked = useAppStore((s) => s.adminUnlocked);
  const openOrders = useMemo(() => orders.filter((o) => o.status === "open"), [orders]);

  // shuffleSeed пересобирает выборку заказов по кнопке «Другие»: сортировка
  // по дате сама по себе даёт один и тот же набор, а перемешивание позволяет
  // посмотреть другие свежие задачи.
  const feedOrders = useMemo(() => {
    const top = topOrdersForFeed(orders, PROMOTED_ORDER_IDS);
    if (shuffleSeed === 0) return top;
    return shuffle(top);
  }, [orders, shuffleSeed]);

  const feedProjects = useMemo(() => topProjectsForFeed(projects), [projects]);
  const journalArticles = useMemo(
    () => topArticlesForFeed(articles, journalTab as ArticleFeedMode),
    [articles, journalTab]
  );
  const offerArticles = useMemo(() => offersForFeed(articles), [articles]);

  function handleSearch() {
    if (!searchValue.trim()) return;
    const found = orders.find((o) => codesMatch(o.code, searchValue));
    if (found) { setSearchError(null); router.push(`/orders/${found.id}`); } else setSearchError("Заказ с таким номером не найден");
  }
  function handleLogoTap() {
    logoTaps.current += 1;
    if (logoTimer.current) clearTimeout(logoTimer.current);
    logoTimer.current = setTimeout(() => { logoTaps.current = 0; }, 1500);
    if (logoTaps.current >= 5 && !adminUnlocked) { unlockAdmin(); logoTaps.current = 0; }
  }

  return (
    <div className="flex min-h-[calc(100vh-64px)] flex-1 flex-col ">
      <header className="sticky top-0 z-20 border-b border-line bg-paper/95 backdrop-blur lg:hidden">
        <div className="flex h-14 items-center justify-between px-4"><button onClick={handleLogoTap} className="flex items-center gap-2" aria-label="UMELO"><img src="/icons/logo-mark.png" alt="" className="h-7 w-7" /><span className="font-display text-lg font-extrabold text-ink">UMELO</span></button><div className="flex items-center gap-1"><Link href="/chats" aria-label="Сообщения" className="flex h-10 w-10 items-center justify-center rounded-full text-ink-soft transition hover:bg-surface hover:text-ink"><MessageCircle size={18} /></Link></div></div>
        <div className="px-4 pb-3"><div className={`flex items-center gap-2 rounded-full border bg-surface px-3 py-2 ${searchError ? "border-red-300" : "border-line"}`}><Search size={15} className="text-ink-faint" /><input value={searchValue} onChange={(e) => { setSearchValue(e.target.value); setSearchError(null); }} onKeyDown={(e) => e.key === "Enter" && handleSearch()} placeholder="Поиск по UMELO" className="min-h-8 min-w-0 flex-1 bg-transparent text-xs outline-none" /></div>{searchError && <p className="px-2 pt-1 text-xs text-danger">{searchError}</p>}</div>
      </header>

      <main className="mx-auto w-full max-w-shell flex-1 px-4 pb-28 pt-6 sm:px-6 lg:px-8 lg:pb-12">
        <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-accent-ink">UMELO · для тех, кто строит</p>
            <h1 className="mt-1 max-w-content font-display text-2xl font-extrabold tracking-tight text-ink sm:text-3xl sm:leading-[1.05]">Вдохновение и идеи</h1>
            <p className="mt-1 max-w-form text-sm text-ink-soft">Проекты, специалисты, материалы и реальные задачи — всё в одном месте.</p>
          </div>
        </div>

        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_300px]">
          <section className="min-w-0 space-y-9">
            <CarouselSection
              title="Нужны мастера"
              subtitle="Свежие задачи от людей рядом с вами"
              allHref="/orders"
              allLabel="Все заказы"
              onShuffle={() => setShuffleSeed((n) => n + 1)}
              emptyLabel="Пока нет открытых заказов"
            >
              {feedOrders.map((order) => (
                <OrderCard key={order.id} order={order} />
              ))}
            </CarouselSection>

            <CarouselSection
              title="Проекты"
              subtitle="Свежие проекты и идеи для вдохновения"
              allHref="/projects"
              allLabel="Все проекты"
              emptyLabel="Пока нет опубликованных проектов"
            >
              {feedProjects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </CarouselSection>

            <CarouselSection
              title="Журнал"
              subtitle="Статьи, кейсы и разборы"
              allHref="/articles"
              tabs={JOURNAL_TABS}
              activeTab={journalTab}
              onTabChange={(id) => setJournalTab(id as JournalTab)}
              emptyLabel="Пока нет статей"
            >
              {journalArticles.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </CarouselSection>

            {offerArticles.length > 0 && (
              <CarouselSection
                title="Товары и услуги"
                subtitle="Материалы и предложения магазинов"
                allHref="/shops"
                allLabel="Все предложения"
              >
                {offerArticles.map((article) => (
                  <ArticleCard key={article.id} article={article} />
                ))}
              </CarouselSection>
            )}
          </section>

          <aside className="hidden space-y-5 lg:block">
            <div className="rounded-2xl border border-line bg-paper p-4">
              <div className="mb-4 flex items-center justify-between">
                <p className="font-display text-sm font-extrabold">Популярные специалисты</p>
                <Link href="/specialists" className="-my-1.5 inline-flex min-h-6 items-center px-1 py-1.5 text-xs font-bold text-accent-ink">Все</Link>
              </div>
              <div className="space-y-3">
                {specialists.map((person) => (
                  <Link href="/specialists" key={person.name} className="flex items-center gap-3 rounded-xl p-1 transition hover:bg-surface">
                    <Avatar name={person.name} image={person.image} />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs font-extrabold text-ink">{person.name}</p>
                      <p className="truncate text-xs text-ink-soft">{person.role}</p>
                      <p className="mt-0.5 flex items-center gap-1 text-xs text-ink-faint">
                        <Star size={10} fill="currentColor" className="text-accent-ink" /> {person.rating} ({person.reviews}) · {person.distance}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            <CommunityCard />

            <div className="rounded-2xl border border-line bg-paper p-4">
              <p className="font-display text-sm font-extrabold">UMELO сегодня</p>
              <div className="mt-3 grid grid-cols-2 gap-2">
                <div className="rounded-xl bg-surface p-3">
                  <p className="text-lg font-extrabold text-ink">{openOrders.length}</p>
                  <p className="text-xs text-ink-soft">открытых заказов</p>
                </div>
                <div className="rounded-xl bg-surface p-3">
                  <p className="text-lg font-extrabold text-ink">1 840</p>
                  <p className="text-xs text-ink-soft">специалистов</p>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </main>
      <BottomNav />
    </div>
  );
}
