"use client";

import Link from "next/link";
import { useState } from "react";
import { ProjectOrderDrawer } from "@/components/ProjectOrderDrawer";
import {
  ArrowLeft,
  ArrowRight,
  Bookmark,
  Check,
  ChevronLeft,
  ChevronRight,
  Heart,
  MapPin,
  MessageCircle,
  Send,
  Share2,
  Star,
} from "lucide-react";

const gallery = [
  "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1400&q=90",
  "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=900&q=90",
  "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=900&q=90",
  "https://images.unsplash.com/photo-1600607688969-a5bfcd646154?auto=format&fit=crop&w=900&q=90",
  "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=900&q=90",
];

const team = [
  { name: "Мария Смирнова", role: "Дизайнер интерьеров", rating: "5.0", image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80" },
  { name: "Алексей Петров", role: "Сантехника", rating: "4.9", image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=120&q=80" },
  { name: "Иван Кузнецов", role: "Электрика", rating: "4.8", image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80" },
];

const materials = [
  ["Плитка Italon", "от €24,90 / м²", "https://images.unsplash.com/photo-1615529162924-f8605388461d?auto=format&fit=crop&w=240&q=85"],
  ["Смеситель Grohe", "от €189", "https://images.unsplash.com/photo-1584622781867-7a5d2b5e4f6f?auto=format&fit=crop&w=240&q=85"],
  ["Краска Tikkurila", "от €69 / 10 л", "https://images.unsplash.com/photo-1562259949-e8e7680d7823?auto=format&fit=crop&w=240&q=85"],
];

export default function ProjectDetailPage() {
  const [active, setActive] = useState(0);
  const [saved, setSaved] = useState(false);
  const [liked, setLiked] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const [showOrderDrawer, setShowOrderDrawer] = useState(false);

  const next = () => setActive((v) => (v + 1) % gallery.length);
  const prev = () => setActive((v) => (v - 1 + gallery.length) % gallery.length);

  return (
    <main className="min-h-screen bg-[#f7f8f7] pb-24 lg:pb-16">
      <div className="mx-auto max-w-[1280px] px-4 pt-5 sm:px-6 lg:px-8 lg:pt-7">
        <Link href="/projects" className="mb-5 inline-flex items-center gap-2 text-xs font-bold text-ink-soft transition hover:text-ink">
          <ArrowLeft size={15} /> Все проекты
        </Link>

        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_360px]">
          <section>
            <div className="relative overflow-hidden rounded-[26px] bg-[#20231f] shadow-sm">
              <div className="aspect-[16/10] w-full sm:aspect-[16/9]">
                <img src={gallery[active]} alt="Кухня в современном стиле" className="h-full w-full object-cover" />
              </div>
              <button onClick={prev} className="absolute left-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-ink shadow-sm" aria-label="Предыдущее фото"><ChevronLeft size={18} /></button>
              <button onClick={next} className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-ink shadow-sm" aria-label="Следующее фото"><ChevronRight size={18} /></button>
              <div className="absolute left-4 top-4 rounded-full bg-white/92 px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-[0.08em] text-ink">Проект</div>
              <div className="absolute bottom-4 right-4 rounded-full bg-black/55 px-3 py-1.5 text-[10px] font-bold text-white">{active + 1} / {gallery.length}</div>
            </div>

            <div className="mt-3 grid grid-cols-5 gap-2">
              {gallery.map((image, index) => (
                <button key={image} onClick={() => setActive(index)} className={`aspect-[4/3] overflow-hidden rounded-xl border-2 bg-white ${active === index ? "border-accent" : "border-transparent"}`}>
                  <img src={image} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>

            <div className="mt-6 rounded-[24px] border border-line bg-white p-5 sm:p-7">
              <div className="flex flex-wrap gap-2">
                {['Интерьер', 'Кухня', 'Минимализм'].map((tag) => <span key={tag} className="rounded-full bg-[#f3f5f3] px-3 py-1.5 text-[10px] font-bold text-ink-soft">{tag}</span>)}
              </div>
              <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <h1 className="font-display text-3xl font-extrabold leading-[1.02] tracking-tight text-ink sm:text-4xl">Кухня в современном стиле</h1>
                  <p className="mt-2 flex items-center gap-1.5 text-xs text-ink-soft"><MapPin size={14} /> Rotterdam, Nederland · 2026</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => setLiked(!liked)} className={`flex h-10 items-center gap-2 rounded-full border px-3.5 text-xs font-bold ${liked ? "border-accent bg-[#fff4bf] text-ink" : "border-line text-ink-soft"}`}><Heart size={16} fill={liked ? "currentColor" : "none"} /> {liked ? 129 : 128}</button>
                  <button onClick={() => setSaved(!saved)} className={`flex h-10 items-center gap-2 rounded-full border px-3.5 text-xs font-bold ${saved ? "border-accent bg-[#fff4bf] text-ink" : "border-line text-ink-soft"}`}><Bookmark size={16} fill={saved ? "currentColor" : "none"} /> {saved ? "Сохранено" : "Сохранить"}</button>
                  <button className="hidden h-10 w-10 items-center justify-center rounded-full border border-line text-ink-soft sm:flex"><Share2 size={16} /></button>
                </div>
              </div>

              <p className="mt-6 max-w-[850px] text-sm leading-6 text-ink-soft">Тёплое дерево, натуральный камень и скрытая техника. Проект кухни для современной квартиры — с подбором материалов, планировкой, освещением и командой специалистов.</p>

              <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {[["Бюджет", "€46 000"], ["Площадь", "18 м²"], ["Срок", "8 недель"], ["Команда", "3 специалиста"]].map(([label, value]) => <div key={label} className="rounded-2xl bg-[#f7f8f7] p-3.5"><p className="text-[10px] text-ink-faint">{label}</p><p className="mt-1 text-sm font-extrabold text-ink">{value}</p></div>)}
              </div>
            </div>

            <section className="mt-5 rounded-[24px] border border-line bg-white p-5 sm:p-7">
              <div className="flex items-end justify-between"><div><h2 className="font-display text-xl font-extrabold text-ink">Команда проекта</h2><p className="mt-1 text-xs text-ink-soft">Специалисты, которые участвовали в реализации</p></div><Link href="/specialists" className="text-xs font-extrabold text-accent">Все специалисты</Link></div>
              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                {team.map((person) => <Link href="/specialists" key={person.name} className="group flex items-center gap-3 rounded-2xl border border-line p-3 transition hover:border-accent"><img src={person.image} alt="" className="h-12 w-12 rounded-full object-cover" /><div className="min-w-0"><p className="truncate text-xs font-extrabold text-ink group-hover:text-accent">{person.name}</p><p className="mt-0.5 truncate text-[11px] text-ink-soft">{person.role}</p><p className="mt-1 flex items-center gap-1 text-[10px] text-ink-faint"><Star size={10} fill="currentColor" className="text-accent" /> {person.rating}</p></div></Link>)}
              </div>
            </section>

            <section className="mt-5 rounded-[24px] border border-line bg-white p-5 sm:p-7">
              <div className="flex items-end justify-between"><div><h2 className="font-display text-xl font-extrabold text-ink">Материалы проекта</h2><p className="mt-1 text-xs text-ink-soft">То, что использовали в этой реализации</p></div><Link href="/shops" className="text-xs font-extrabold text-accent">Все материалы</Link></div>
              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                {materials.map(([name, price, image]) => <Link href="/shops" key={name} className="group overflow-hidden rounded-2xl border border-line"><div className="aspect-[4/3] overflow-hidden bg-[#f3f5f3]"><img src={image} alt="" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" /></div><div className="p-3"><p className="text-xs font-extrabold text-ink">{name}</p><p className="mt-1 text-[10px] text-ink-soft">{price}</p></div></Link>)}
              </div>
            </section>

            <section className="mt-5 rounded-[24px] border border-line bg-white p-5 sm:p-7">
              <div className="flex items-center justify-between"><div><h2 className="font-display text-xl font-extrabold text-ink">Обсуждение</h2><p className="mt-1 text-xs text-ink-soft">24 комментария</p></div><MessageCircle size={19} className="text-ink-faint" /></div>
              <div className="mt-5 flex gap-3"><div className="h-9 w-9 shrink-0 rounded-full bg-[#e6e9e6]" /><div className="min-w-0 flex-1"><div className="rounded-2xl bg-[#f7f8f7] p-3.5"><p className="text-xs font-extrabold text-ink">Анна К.</p><p className="mt-1 text-xs leading-5 text-ink-soft">Подскажите, какой камень использовали на фартуке?</p></div><p className="mt-1 px-2 text-[10px] text-ink-faint">12 мин назад · Ответить</p></div></div>
              {showAll && <div className="mt-4 flex gap-3"><div className="h-9 w-9 shrink-0 rounded-full bg-[#d9dcd8]" /><div className="rounded-2xl bg-[#f7f8f7] p-3.5"><p className="text-xs font-extrabold text-ink">Мария Смирнова</p><p className="mt-1 text-xs leading-5 text-ink-soft">Натуральный кварцит, подбирали под цвет дерева.</p></div></div>}
              <button onClick={() => setShowAll(!showAll)} className="mt-4 text-xs font-extrabold text-accent">{showAll ? "Скрыть" : "Показать ещё комментарии"}</button>
            </section>
          </section>

          <aside className="lg:sticky lg:top-28 lg:self-start">
            <div className="rounded-[24px] border border-line bg-white p-5 shadow-sm">
              <div className="flex items-center gap-3"><img src={team[0].image} alt="" className="h-12 w-12 rounded-full object-cover" /><div><p className="text-sm font-extrabold text-ink">Мария Смирнова</p><p className="mt-0.5 text-xs text-ink-soft">Дизайнер интерьеров</p><p className="mt-1 flex items-center gap-1 text-[10px] text-ink-faint"><Star size={10} fill="currentColor" className="text-accent" /> 5.0 · 66 отзывов</p></div></div>
              <div className="mt-5 grid grid-cols-2 gap-2"><div className="rounded-xl bg-[#f7f8f7] p-3"><p className="text-[10px] text-ink-faint">Проектов</p><p className="mt-1 text-sm font-extrabold">32</p></div><div className="rounded-xl bg-[#f7f8f7] p-3"><p className="text-[10px] text-ink-faint">На UMELO</p><p className="mt-1 text-sm font-extrabold">2 года</p></div></div>
              <Link href="/chats" className="mt-4 flex h-11 items-center justify-center gap-2 rounded-full bg-accent text-xs font-extrabold text-ink transition hover:bg-accent-dark"><MessageCircle size={16} /> Написать автору</Link>
              <button onClick={() => setShowOrderDrawer(true)} className="mt-2 flex h-11 w-full items-center justify-center gap-2 rounded-full border border-line text-xs font-extrabold text-ink transition hover:border-accent hover:bg-[#fffbe2]">Хочу такой проект <ArrowRight size={15} /></button>
            </div>

            <div className="mt-4 rounded-[24px] border border-line bg-white p-5"><p className="font-display text-sm font-extrabold text-ink">Что входит в проект</p><ul className="mt-4 space-y-3">{["Планировка и дизайн", "Подбор материалов", "Рабочие чертежи", "Организация команды"].map((item) => <li key={item} className="flex items-center gap-2.5 text-xs text-ink-soft"><span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#fff4bf] text-ink"><Check size={12} strokeWidth={2.8} /></span>{item}</li>)}</ul></div>

            <div className="mt-4 rounded-[24px] bg-[#111419] p-5 text-white"><p className="text-[9px] font-extrabold uppercase tracking-[0.15em] text-accent">Понравился проект?</p><p className="mt-2 font-display text-lg font-extrabold leading-tight">Найдите специалистов и материалы для своей версии.</p><button onClick={() => setShowOrderDrawer(true)} className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-accent px-4 py-3 text-xs font-extrabold text-ink">Создать заказ <Send size={14} /></button></div>
          </aside>
        </div>
      </div>

      {showOrderDrawer && (
        <ProjectOrderDrawer
          onClose={() => setShowOrderDrawer(false)}
          projectTitle="Кухня в современном стиле"
          projectLocation="Rotterdam, Nederland · 2026"
          projectImage={gallery[active]}
        />
      )}
    </main>
  );
}
