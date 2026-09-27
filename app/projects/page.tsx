"use client";

import Link from "next/link";
import { ArrowRight, Bookmark, Heart, MapPin, Plus } from "lucide-react";

const projects = [
  { title: "Кухня в современном стиле", author: "Мария Смирнова", location: "Rotterdam", tag: "Интерьер", likes: 128 },
  { title: "Загородный дом в скандинавском стиле", author: "Алексей Петров", location: "Utrecht", tag: "Дом", likes: 96 },
  { title: "Ремонт ванной комнаты", author: "Анна К.", location: "Rotterdam", tag: "Ремонт", likes: 74 },
  { title: "Терраса и ландшафт участка", author: "Дмитрий Орлов", location: "Delft", tag: "Ландшафт", likes: 61 },
];

export default function ProjectsPage() {
  return (
    <main className="min-h-[calc(100vh-64px)] bg-surface px-4 pb-16 pt-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-page">
        <div className="flex items-end justify-between gap-4">
          <div><p className="text-xs font-bold uppercase tracking-[0.14em] text-accent-ink">Вдохновение</p><h1 className="mt-1 font-display text-3xl font-extrabold text-ink">Проекты</h1><p className="mt-1 text-sm text-ink-soft">Реализованные работы людей из строительной сферы.</p></div>
          <Link href="/orders/new" className="hidden items-center gap-2 rounded-full bg-accent px-4 py-2.5 text-xs font-extrabold text-night lg:flex"><Plus size={15} /> Добавить проект</Link>
        </div>
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project, index) => (
            <Link href={index === 0 ? "/projects/modern-kitchen" : "/projects"} key={project.title} className={`overflow-hidden rounded-3xl border border-line bg-paper ${index === 0 ? "lg:col-span-2" : ""}`}>
              <div className={`relative ${index === 0 ? "aspect-[16/8]" : "aspect-[4/3]"} overflow-hidden bg-[#dfe5e1]`}>
                <div className={`absolute inset-0 ${index % 2 === 0 ? "bg-[linear-gradient(135deg,#aebbb2,#edf1ed_55%,#8f9d95)]" : "bg-[linear-gradient(135deg,#c8c9c3,#eef0e9_55%,#a4aaa2)]"}`} />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(255,255,255,.8),transparent_25%)]" />
                <span className="absolute left-4 top-4 rounded-full bg-paper/90 px-3 py-1.5 text-xs font-bold text-ink">{project.tag}</span>
                <button className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-paper/90 text-ink-soft"><Bookmark size={15} /></button>
                <div className="absolute bottom-4 left-4 right-4 rounded-xl bg-night/70 px-3 py-2 backdrop-blur-[1px] text-white">
                  <p className="text-xs font-semibold text-white/80">{project.author}</p>
                  <h2 className="mt-0.5 font-display text-xl font-extrabold leading-tight">{project.title}</h2>
                </div>
              </div>
              <div className="flex items-center justify-between p-4"><span className="flex items-center gap-1.5 text-xs text-ink-soft"><MapPin size={13} /> {project.location}</span><span className="flex items-center gap-1 text-xs text-ink-soft"><Heart size={14} /> {project.likes}</span><span className="flex items-center gap-1 text-xs font-bold text-accent-ink">Открыть <ArrowRight size={13} /></span></div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
