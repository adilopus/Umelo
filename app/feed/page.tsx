"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight, Bookmark, Heart, MapPin, MessageCircle, Search, Star, Users, Quote,
} from "lucide-react";
import { useAppStore } from "@/lib/store";
import { ArticleCard } from "@/components/ArticleCard";
import { OrderCard } from "@/components/OrderCard";
import { BottomNav } from "@/components/BottomNav";
import { ARTICLE_TOPICS } from "@/lib/articleTopics";
import { codesMatch } from "@/lib/orderCode";

const FEED_ORDERS_COUNT = 6;

const specialists = [
  { name: "Алексей Петров", role: "Сантехника", rating: "4.9", reviews: 127, distance: "8 км", image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=120&q=80" },
  { name: "Иван Кузнецов", role: "Электрика", rating: "4.8", reviews: 96, distance: "12 км", image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80" },
  { name: "Мария Смирнова", role: "Дизайн интерьера", rating: "5.0", reviews: 66, distance: "15 км", image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80" },
];

const projectImage = "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1400&q=85";

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
    <div className={`relative flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#e8ece9] font-bold text-ink ${large ? "h-10 w-10 text-xs" : "h-9 w-9 text-[10px]"}`}>
      {image ? <SafeImage src={image} alt="" className="h-full w-full object-cover" /> : name.split(" ").map((part) => part[0]).join("").slice(0, 2)}
    </div>
  );
}

function ContentPill({ children, tone = "default" }: { children: React.ReactNode; tone?: "default" | "orange" | "green" }) {
  return <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-[9px] font-extrabold uppercase tracking-[0.08em] ${tone === "orange" ? "bg-accent-soft text-accent" : tone === "green" ? "bg-sage-soft text-sage" : "bg-white/90 text-ink"}`}>{children}</span>;
}

function ProjectCard() {
  const [saved, setSaved] = useState(false);
  const [liked, setLiked] = useState(false);
  return (
    <article className="group overflow-hidden rounded-[24px] border border-line bg-white shadow-[0_12px_36px_rgba(43,45,49,0.07)] transition hover:shadow-[0_18px_44px_rgba(43,45,49,0.11)]">
      <div className="relative aspect-[16/7.25] overflow-hidden bg-[#dfe5e1]">
        <SafeImage src={projectImage} alt="Современный интерьер" className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.025]" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/5 to-transparent" />
        <div className="absolute left-4 top-4"><ContentPill>✦ Проект</ContentPill></div>
        <button onClick={() => setSaved((v) => !v)} className={`absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full backdrop-blur transition ${saved ? "bg-accent text-white" : "bg-white/92 text-ink-soft hover:bg-white"}`} aria-label="Сохранить"><Bookmark size={15} fill={saved ? "currentColor" : "none"} /></button>
        <div className="absolute bottom-4 left-5 right-5 text-white drop-shadow-[0_2px_8px_rgba(0,0,0,.5)]">
          <div className="flex items-center gap-2 text-[11px] font-semibold opacity-95"><Avatar name="Мария Смирнова" image={specialists[2].image} /><span>Мария Смирнова · Дизайнер интерьеров</span></div>
          <h2 className="mt-2 font-display text-[27px] font-extrabold leading-tight sm:text-[28px]">Кухня в современном стиле</h2>
        </div>
      </div>
      <div className="p-5 sm:p-6">
        <div className="flex flex-wrap gap-2">{["Интерьер", "Кухня", "Минимализм"].map((tag) => <span key={tag} className="rounded-full bg-surface px-2.5 py-1.5 text-[10px] font-bold text-ink-soft">{tag}</span>)}</div>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-ink-soft">Тёплое дерево, натуральный камень и скрытая техника. Проект кухни для современной квартиры — с подбором материалов и специалистов.</p>
        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-ink-soft"><span className="flex items-center gap-1"><MapPin size={13} /> Rotterdam, Nederland</span><span>18 фото</span><span className="font-bold text-ink">€46 000</span><span>3 специалиста</span></div>
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-4">
          <div className="flex items-center gap-4 text-xs text-ink-soft"><button onClick={() => setLiked((v) => !v)} className={`flex items-center gap-1 transition ${liked ? "text-accent" : "hover:text-ink"}`}><Heart size={14} fill={liked ? "currentColor" : "none"} /> {liked ? 129 : 128}</button><span className="flex items-center gap-1"><MessageCircle size={14} /> 24</span><button className="flex items-center gap-1 hover:text-ink"><Users size={14} /> Команда</button></div>
          <div className="flex items-center gap-4">
            <Link href="/projects" className="text-xs font-extrabold text-ink-soft hover:text-accent">Все проекты</Link>
            <Link href="/projects/modern-kitchen" className="flex items-center gap-1.5 text-xs font-extrabold text-accent hover:text-accent-dark">Смотреть проект <ArrowRight size={14} /></Link>
          </div>
        </div>
      </div>
    </article>
  );
}

function CommunityCard() {
  return <Link href="/community" className="group block min-w-0 w-full overflow-hidden rounded-2xl bg-[#111419] p-5 text-white transition hover:-translate-y-0.5"><div className="flex items-start justify-between gap-4"><div><p className="text-[9px] font-extrabold uppercase tracking-[0.16em] text-accent">Обсуждение</p><h3 className="mt-2 font-display text-lg font-extrabold leading-tight">Как лучше утеплить фасад частного дома?</h3></div><Quote size={24} className="shrink-0 text-white/25" /></div><div className="mt-5 flex items-center gap-3"><Avatar name="Иван Кузнецов" image={specialists[1].image} /><div><p className="text-xs font-bold">Иван Кузнецов</p><p className="text-[10px] text-white/50">Электрик · 4.8 ⭐</p></div></div><div className="mt-5 flex items-center justify-between text-[10px] text-white/50"><span>18 ответов · 42 сохранения</span><span className="font-bold text-accent group-hover:text-white">Обсудить →</span></div></Link>;
}

export default function FeedPage() {
  const router = useRouter();
  const orders = useAppStore((s) => s.orders);
  const articles = useAppStore((s) => s.articles);
  const [activeTopic, setActiveTopic] = useState<string | null>(null);
  const [searchValue, setSearchValue] = useState("");
  const [searchError, setSearchError] = useState<string | null>(null);
  const [shuffleSeed, setShuffleSeed] = useState(0);
  const [randomOrders, setRandomOrders] = useState(orders.slice(0, FEED_ORDERS_COUNT));
  const logoTaps = useRef(0);
  const logoTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const unlockAdmin = useAppStore((s) => s.unlockAdmin);
  const adminUnlocked = useAppStore((s) => s.adminUnlocked);
  const filteredArticles = useMemo(() => activeTopic ? articles.filter((a) => a.topic === activeTopic) : articles, [articles, activeTopic]);
  const newsArticles = filteredArticles.filter((a) => a.kind !== "promo");
  const promoArticles = filteredArticles.filter((a) => a.kind === "promo");
  const openOrders = useMemo(() => orders.filter((o) => o.status === "open"), [orders]);
  useEffect(() => { setRandomOrders(shuffle(openOrders).slice(0, FEED_ORDERS_COUNT)); }, [openOrders, shuffleSeed]);

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
    <div className="flex min-h-[calc(100vh-64px)] flex-1 flex-col bg-[#f7f8f7]">
      <header className="sticky top-0 z-20 border-b border-line bg-white/95 backdrop-blur lg:hidden">
        <div className="flex h-14 items-center justify-between px-4"><button onClick={handleLogoTap} className="flex items-center gap-2" aria-label="UMELO"><img src="/icons/logo-mark.png" alt="" className="h-7 w-7" /><span className="font-display text-lg font-extrabold text-ink">UMELO</span></button><div className="flex items-center gap-1"><Link href="/chats" className="flex h-9 w-9 items-center justify-center rounded-full text-ink-soft"><MessageCircle size={18} /></Link></div></div>
        <div className="px-4 pb-3"><div className={`flex items-center gap-2 rounded-full border bg-[#f7f8f7] px-3 py-2 ${searchError ? "border-red-300" : "border-line"}`}><Search size={15} className="text-ink-faint" /><input value={searchValue} onChange={(e) => { setSearchValue(e.target.value); setSearchError(null); }} onKeyDown={(e) => e.key === "Enter" && handleSearch()} placeholder="Поиск по UMELO" className="min-w-0 flex-1 bg-transparent text-xs outline-none" /></div>{searchError && <p className="px-2 pt-1 text-[11px] text-red-500">{searchError}</p>}</div>
      </header>

      <main className="mx-auto w-full max-w-[1480px] flex-1 px-4 pb-28 pt-6 sm:px-6 lg:px-8 lg:pb-12">
        <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-accent">UMELO · для тех, кто строит</p>
            <h1 className="mt-1 max-w-3xl font-display text-[26px] font-extrabold tracking-tight text-ink sm:text-[30px] sm:leading-[1.05]">Вдохновение и идеи</h1>
            <p className="mt-1 max-w-2xl text-sm text-ink-soft">Проекты, специалисты, материалы и реальные задачи — всё в одном месте.</p>
          </div>
        </div>

        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_300px]">
          <section className="min-w-0 space-y-7">
            <div>
              <div className="mb-3 flex items-end justify-between">
                <div>
                  <p className="font-display text-xl font-extrabold text-ink">Нужны мастера</p>
                  <p className="mt-0.5 text-xs text-ink-soft">Реальные задачи от людей рядом с вами</p>
                </div>
                <div className="flex items-center gap-3">
                  <button onClick={() => setShuffleSeed((n) => n + 1)} className="text-xs font-extrabold text-accent">Другие</button>
                  <Link href="/orders" className="text-xs font-extrabold text-accent">Все заказы</Link>
                </div>
              </div>
              {randomOrders.length > 0 ? (
                <div className="grid gap-3 sm:grid-cols-2">
                  {randomOrders.slice(0, 4).map((order) => (
                    <OrderCard key={order.id} order={order} fullWidth />
                  ))}
                </div>
              ) : (
                <div className="rounded-2xl border border-dashed border-line bg-white p-8 text-center text-sm text-ink-soft">Пока нет открытых заказов</div>
              )}
            </div>

            <ProjectCard />

            {newsArticles.length > 0 && (
              <section>
                <div className="mb-3 flex items-end justify-between">
                  <div>
                    <p className="font-display text-xl font-extrabold text-ink">Знания и идеи</p>
                    <p className="mt-0.5 text-xs text-ink-soft">Статьи, кейсы и полезные материалы</p>
                  </div>
                  <Link href="/articles" className="text-xs font-extrabold text-accent">Смотреть все</Link>
                </div>
                {/* Фильтр по темам стоит здесь, а не в шапке ленты: он относится
                    именно к этому блоку, и вверху страницы выглядел как
                    unexplained-переключатель без связи с содержимым. */}
                <div className="mb-3 flex gap-2 overflow-x-auto no-scrollbar">
                  <button onClick={() => setActiveTopic(null)} className={`shrink-0 rounded-full border px-3.5 py-1.5 text-xs font-bold ${activeTopic === null ? "border-accent bg-accent text-white" : "border-line bg-white text-ink-soft"}`}>Все темы</button>
                  {ARTICLE_TOPICS.map((topic) => (
                    <button key={topic.id} onClick={() => setActiveTopic(topic.id)} className={`shrink-0 rounded-full border px-3.5 py-1.5 text-xs font-semibold ${activeTopic === topic.id ? "border-accent bg-accent-soft text-accent" : "border-line bg-white text-ink-soft"}`}>{topic.label}</button>
                  ))}
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  {newsArticles.slice(0, 4).map((article) => (
                    <ArticleCard key={article.id} article={article} fullWidth />
                  ))}
                </div>
              </section>
            )}

            {promoArticles.length > 0 && (
              <section>
                <div className="mb-3 flex items-end justify-between">
                  <div>
                    <p className="font-display text-xl font-extrabold text-ink">Материалы и предложения</p>
                    <p className="mt-0.5 text-xs text-ink-soft">Полезное от магазинов и производителей</p>
                  </div>
                  <Link href="/shops" className="text-xs font-extrabold text-accent">Все предложения</Link>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  {promoArticles.slice(0, 2).map((article) => (
                    <ArticleCard key={article.id} article={article} fullWidth />
                  ))}
                </div>
              </section>
            )}
          </section>

          <aside className="hidden space-y-5 lg:block">
            <div className="rounded-2xl border border-line bg-white p-4">
              <div className="mb-4 flex items-center justify-between">
                <p className="font-display text-sm font-extrabold">Популярные специалисты</p>
                <Link href="/specialists" className="text-[11px] font-bold text-accent">Все</Link>
              </div>
              <div className="space-y-3">
                {specialists.map((person) => (
                  <Link href="/specialists" key={person.name} className="flex items-center gap-3 rounded-xl p-1 transition hover:bg-surface">
                    <Avatar name={person.name} image={person.image} />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs font-extrabold text-ink">{person.name}</p>
                      <p className="truncate text-[11px] text-ink-soft">{person.role}</p>
                      <p className="mt-0.5 flex items-center gap-1 text-[10px] text-ink-faint">
                        <Star size={10} fill="currentColor" className="text-accent" /> {person.rating} ({person.reviews}) · {person.distance}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            <CommunityCard />

            <div className="rounded-2xl border border-line bg-white p-4">
              <p className="font-display text-sm font-extrabold">UMELO сегодня</p>
              <div className="mt-3 grid grid-cols-2 gap-2">
                <div className="rounded-xl bg-surface p-3">
                  <p className="text-lg font-extrabold text-ink">{openOrders.length}</p>
                  <p className="text-[10px] text-ink-soft">открытых заказов</p>
                </div>
                <div className="rounded-xl bg-surface p-3">
                  <p className="text-lg font-extrabold text-ink">1 840</p>
                  <p className="text-[10px] text-ink-soft">специалистов</p>
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
