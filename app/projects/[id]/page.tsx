"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import { ProjectOrderDrawer } from "@/components/ProjectOrderDrawer";
import { useAppStore } from "@/lib/store";
import { projectGallery, type FeedProject } from "@/lib/mockProjects";
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

const projectScope = [
  "Планировка и дизайн",
  "Подбор материалов",
  "Рабочие чертежи",
  "Организация команды",
];

function plural(n: number, one: string, few: string, many: string): string {
  const m100 = n % 100;
  const m10 = n % 10;
  if (m100 > 4 && m100 < 20) return many;
  if (m10 === 1) return one;
  if (m10 > 1 && m10 < 5) return few;
  return many;
}

export default function ProjectDetailPage() {
  const params = useParams<{ id: string }>();
  const project = useAppStore((s) => s.projects.find((p) => p.id === String(params?.id ?? "")));

  if (!project) return <ProjectNotFound id={String(params?.id ?? "")} />;
  return <ProjectView key={project.id} project={project} />;
}

function ProjectNotFound({ id }: { id: string }) {
  return (
    <main className="min-h-[calc(100vh-64px)] px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-page rounded-[26px] border border-line bg-paper px-6 py-14 text-center">
        <p className="text-xs font-bold uppercase tracking-[0.14em] text-accent-ink">Проекты</p>
        <h1 className="mt-2 font-display text-2xl font-extrabold text-ink">
          Проект не найден
        </h1>
        <p className="mx-auto mt-2 max-w-md text-sm text-ink-soft">
          {id
            ? `Проекта с адресом «${id}» нет в каталоге — возможно, ссылка устарела.`
            : "Не удалось определить, какой проект открыть."}
        </p>
        <Link
          href="/projects"
          className="mt-6 inline-flex h-11 items-center gap-2 rounded-full bg-accent px-5 text-xs font-extrabold text-ink"
        >
          <ArrowLeft size={15} /> Ко всем проектам
        </Link>
      </div>
    </main>
  );
}

function ProjectView({ project }: { project: FeedProject }) {
  const [active, setActive] = useState(0);
  const [showAll, setShowAll] = useState(false);
  const [showOrderDrawer, setShowOrderDrawer] = useState(false);

  // Сохранение и лайк — часть сущности проекта, а не локальное состояние
  // страницы: тот же проект видно в ленте и в каталоге, и кнопки должны
  // показывать одно и то же в любом из этих мест.
  const saved = useAppStore((s) => s.savedProjectIds.includes(project.id));
  const toggleSaved = useAppStore((s) => s.toggleSavedProject);
  const liked = useAppStore((s) => s.likedProjectIds.includes(project.id));
  const toggleLiked = useAppStore((s) => s.toggleProjectLike);
  const projectCount = useAppStore(
    (s) => s.projects.filter((p) => p.author === project.author).length
  );

  const gallery = projectGallery(project);
  const next = () => setActive((v) => (v + 1) % gallery.length);
  const prev = () => setActive((v) => (v - 1 + gallery.length) % gallery.length);

  const year = new Date(project.createdAt).getFullYear();
  const place = `${project.location}, Nederland · ${year}`;
  const crew = team.slice(0, Math.max(1, Math.min(project.specialists, team.length)));

  const stats: [string, string][] = [
    ["Бюджет", `€${project.budget.toLocaleString("ru-RU")}`],
    ["Фото", String(project.photos)],
    ["Команда", `${project.specialists} ${plural(project.specialists, "специалист", "специалиста", "специалистов")}`],
    ["Просмотры", project.views.toLocaleString("ru-RU")],
  ];

  return (
    <main className="min-h-screen pb-24 lg:pb-16">
      <div className="mx-auto max-w-page px-4 pt-6 sm:px-6 lg:px-8 lg:pt-8">
        <Link href="/projects" className="mb-5 -my-1.5 inline-flex items-center gap-2 py-1.5 text-xs font-bold text-ink-soft transition hover:text-ink">
          <ArrowLeft size={15} /> Все проекты
        </Link>

        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_360px]">
          <section>
            <div className="relative overflow-hidden rounded-[26px] bg-[#20231f] shadow-card">
              <div className="aspect-[16/10] w-full sm:aspect-[16/9]">
                <img src={gallery[active]} alt={project.title} className="h-full w-full object-cover" />
              </div>
              <button onClick={prev} className="absolute left-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-paper/90 text-ink shadow-card" aria-label="Предыдущее фото"><ChevronLeft size={18} /></button>
              <button onClick={next} className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-paper/90 text-ink shadow-card" aria-label="Следующее фото"><ChevronRight size={18} /></button>
              <div className="absolute left-4 top-4 rounded-full bg-paper/90 px-3 py-1.5 text-xs font-extrabold uppercase tracking-[0.08em] text-ink">Проект</div>
              <div className="absolute bottom-4 right-4 rounded-full bg-black/55 px-3 py-1.5 text-xs font-bold text-white">{active + 1} / {gallery.length}</div>
            </div>

            {/* Сетка превью по числу кадров, а не фиксированная на 5 колонок:
                длина галереи зависит от того, совпала ли обложка проекта с
                пулом его темы (3 или 4 фото), и при жёсткой сетке в строке
                оставались пустые ячейки. */}
            <div
              className="mt-3 grid gap-2"
              style={{ gridTemplateColumns: `repeat(${gallery.length}, minmax(0, 1fr))` }}
            >
              {gallery.map((image, index) => (
                <button
                  key={image}
                  type="button"
                  onClick={() => setActive(index)}
                  aria-label={`Фото ${index + 1} из ${gallery.length}`}
                  aria-current={active === index}
                  className={`aspect-[4/3] overflow-hidden rounded-xl border-2 bg-paper ${active === index ? "border-accent" : "border-transparent"}`}
                >
                  <img src={image} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>

            <div className="mt-6 rounded-[24px] border border-line bg-paper p-5 sm:p-7">
              <div className="flex flex-wrap gap-2">
                {project.topics.map((topic) => (
                  <span key={topic} className="rounded-full bg-surface px-3 py-1.5 text-xs font-bold text-ink-soft">{topic}</span>
                ))}
              </div>
              <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <h1 className="font-display text-3xl font-extrabold leading-[1.02] tracking-tight text-ink sm:text-4xl">{project.title}</h1>
                  <p className="mt-2 flex items-center gap-1.5 text-xs text-ink-soft"><MapPin size={14} /> {place}</p>
                </div>
                <div className="flex gap-2">
                  <button type="button" onClick={() => toggleLiked(project.id)} aria-pressed={liked} aria-label={liked ? "Убрать лайк" : "Поставить лайк"} className={`flex h-10 items-center gap-2 rounded-full border px-3.5 text-xs font-bold ${liked ? "border-accent bg-accent-soft text-ink" : "border-line text-ink-soft"}`}><Heart size={16} fill={liked ? "currentColor" : "none"} /> {project.likes}</button>
                  <button type="button" onClick={() => toggleSaved(project.id)} aria-pressed={saved} className={`flex h-10 items-center gap-2 rounded-full border px-3.5 text-xs font-bold ${saved ? "border-accent bg-accent-soft text-ink" : "border-line text-ink-soft"}`}><Bookmark size={16} fill={saved ? "currentColor" : "none"} /> {saved ? "Сохранено" : "Сохранить"}</button>
                  <button type="button" aria-label="Поделиться проектом" className="hidden h-10 w-10 items-center justify-center rounded-full border border-line text-ink-soft transition hover:border-ink-faint hover:text-ink sm:flex"><Share2 size={16} /></button>
                </div>
              </div>

              <p className="mt-6 max-w-[850px] text-sm leading-6 text-ink-soft">
                {project.title} — работа в городе {project.location}. Автор проекта: {project.author}, {project.authorRole.toLowerCase()}.
                Темы: {project.topics.join(", ").toLowerCase()}. В проекте {project.photos} {plural(project.photos, "фотография", "фотографии", "фотографий")},
                бюджет €{project.budget.toLocaleString("ru-RU")}, команда из {project.specialists}{" "}
                {plural(project.specialists, "специалиста", "специалистов", "специалистов")}.
              </p>

              <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {stats.map(([label, value]) => (
                  <div key={label} className="rounded-2xl bg-surface p-3.5">
                    <p className="text-xs text-ink-faint">{label}</p>
                    <p className="mt-1 text-sm font-extrabold text-ink">{value}</p>
                  </div>
                ))}
              </div>
            </div>

            <section className="mt-5 rounded-[24px] border border-line bg-paper p-5 sm:p-7">
              <div className="flex items-end justify-between"><div><h2 className="font-display text-xl font-extrabold text-ink">Команда проекта</h2><p className="mt-1 text-xs text-ink-soft">Специалисты, которые участвовали в реализации</p></div><Link href="/specialists" className="-my-1.5 inline-flex items-center py-1.5 text-xs font-extrabold text-accent-ink">Все специалисты</Link></div>
              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                {crew.map((person) => <Link href="/specialists" key={person.name} className="group flex items-center gap-3 rounded-2xl border border-line p-3 transition hover:border-accent"><img src={person.image} alt="" className="h-12 w-12 rounded-full object-cover" /><div className="min-w-0"><p className="truncate text-xs font-extrabold text-ink group-hover:text-accent-ink">{person.name}</p><p className="mt-0.5 truncate text-xs text-ink-soft">{person.role}</p><p className="mt-1 flex items-center gap-1 text-xs text-ink-faint"><Star size={10} fill="currentColor" className="text-accent-ink" /> {person.rating}</p></div></Link>)}
              </div>
            </section>

            <section className="mt-5 rounded-[24px] border border-line bg-paper p-5 sm:p-7">
              <div className="flex items-end justify-between"><div><h2 className="font-display text-xl font-extrabold text-ink">Материалы проекта</h2><p className="mt-1 text-xs text-ink-soft">То, что использовали в этой реализации</p></div><Link href="/shops" className="-my-1.5 inline-flex items-center py-1.5 text-xs font-extrabold text-accent-ink">Все материалы</Link></div>
              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                {materials.map(([name, price, image]) => <Link href="/shops" key={name} className="group overflow-hidden rounded-2xl border border-line"><div className="aspect-[4/3] overflow-hidden bg-surface"><img src={image} alt="" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" /></div><div className="p-3"><p className="text-xs font-extrabold text-ink">{name}</p><p className="mt-1 text-xs text-ink-soft">{price}</p></div></Link>)}
              </div>
            </section>

            <section className="mt-5 rounded-[24px] border border-line bg-paper p-5 sm:p-7">
              <div className="flex items-center justify-between"><h2 className="font-display text-xl font-extrabold text-ink">Обсуждение</h2><MessageCircle size={19} className="text-ink-faint" /></div>
              <div className="mt-5 flex gap-3"><div className="h-9 w-9 shrink-0 rounded-full bg-[#e6e9e6]" /><div className="min-w-0 flex-1"><div className="rounded-2xl bg-surface p-3.5"><p className="text-xs font-extrabold text-ink">Анна К.</p><p className="mt-1 text-xs leading-5 text-ink-soft">Подскажите, какие материалы использовали в работе?</p></div><p className="mt-1 px-2 text-xs text-ink-faint">12 мин назад · Ответить</p></div></div>
              {showAll && <div className="mt-4 flex gap-3"><div className="h-9 w-9 shrink-0 rounded-full bg-[#d9dcd8]" /><div className="rounded-2xl bg-surface p-3.5"><p className="text-xs font-extrabold text-ink">{project.author}</p><p className="mt-1 text-xs leading-5 text-ink-soft">Расскажем подробнее о ходе работ и использованных материалах.</p></div></div>}
              <button type="button" onClick={() => setShowAll(!showAll)} className="-my-1.5 inline-flex items-center py-1.5 mt-4 text-xs font-extrabold text-accent-ink">{showAll ? "Скрыть" : "Показать ещё комментарии"}</button>
            </section>
          </section>

          <aside className="lg:sticky lg:top-28 lg:self-start">
            <div className="rounded-[24px] border border-line bg-paper p-5 shadow-card">
              <div className="flex items-center gap-3"><img src={crew[0].image} alt="" className="h-12 w-12 rounded-full object-cover" /><div><p className="text-sm font-extrabold text-ink">{project.author}</p><p className="mt-0.5 text-xs text-ink-soft">{project.authorRole}</p><p className="mt-1 flex items-center gap-1 text-xs text-ink-faint"><Star size={10} fill="currentColor" className="text-accent-ink" /> {crew[0].rating} · {project.likes * 2} отзывов</p></div></div>
              <div className="mt-5 grid grid-cols-2 gap-2"><div className="rounded-xl bg-surface p-3"><p className="text-xs text-ink-faint">Проектов</p><p className="mt-1 text-sm font-extrabold">{projectCount}</p></div><div className="rounded-xl bg-surface p-3"><p className="text-xs text-ink-faint">Темы</p><p className="mt-1 text-sm font-extrabold">{project.topics.length}</p></div></div>
              <Link href="/chats" className="mt-4 flex h-11 items-center justify-center gap-2 rounded-full bg-accent text-xs font-extrabold text-ink transition hover:bg-accent-dark"><MessageCircle size={16} /> Написать автору</Link>
              <button onClick={() => setShowOrderDrawer(true)} className="mt-2 flex h-11 w-full items-center justify-center gap-2 rounded-full border border-line text-xs font-extrabold text-ink transition hover:border-accent hover:bg-accent-soft">Хочу такой проект <ArrowRight size={15} /></button>
            </div>

            <div className="mt-4 rounded-[24px] border border-line bg-paper p-5"><p className="font-display text-sm font-extrabold text-ink">Что входит в проект</p><ul className="mt-4 space-y-3">{projectScope.map((item) => <li key={item} className="flex items-center gap-2.5 text-xs text-ink-soft"><span className="flex h-5 w-5 items-center justify-center rounded-full bg-accent-soft text-ink"><Check size={12} strokeWidth={2.8} /></span>{item}</li>)}</ul></div>

            <div className="mt-4 rounded-[24px] bg-night p-5 text-white"><p className="text-xs font-extrabold uppercase tracking-[0.15em] text-accent">Понравился проект?</p><p className="mt-2 font-display text-lg font-extrabold leading-tight">Найдите специалистов и материалы для своей версии.</p><button onClick={() => setShowOrderDrawer(true)} className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-accent px-4 py-3 text-xs font-extrabold text-ink">Создать заказ <Send size={14} /></button></div>
          </aside>
        </div>
      </div>

      {showOrderDrawer && (
        <ProjectOrderDrawer
          onClose={() => setShowOrderDrawer(false)}
          projectTitle={project.title}
          projectLocation={place}
          projectImage={gallery[active]}
        />
      )}
    </main>
  );
}
