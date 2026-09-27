"use client";

import Link from "next/link";
import { ArrowUpRight, MessageCircle, Plus, ThumbsUp } from "lucide-react";

const discussions = [
  ["Как лучше сделать гидроизоляцию душевой?", "Иван Кузнецов", "24", "8"],
  ["Подбор материала для фасада: что используете на практике?", "Дмитрий Орлов", "18", "6"],
  ["Как посчитать смету на ремонт квартиры 80 м²?", "Мария Смирнова", "31", "12"],
];

export default function CommunityPage() {
  return <main className="min-h-[calc(100vh-64px)] bg-surface px-4 pb-16 pt-8 sm:px-6 lg:px-8"><div className="mx-auto max-w-content"><div className="flex items-end justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-[0.14em] text-accent-ink">Общение</p><h1 className="mt-1 font-display text-3xl font-extrabold text-ink">Сообщество</h1><p className="mt-1 text-sm text-ink-soft">Вопросы, опыт и решения от людей из строительной сферы.</p></div><button className="hidden items-center gap-2 rounded-full bg-accent px-4 py-2.5 text-xs font-extrabold text-night sm:flex"><Plus size={15} /> Задать вопрос</button></div><div className="mt-6 space-y-3">{discussions.map(([title, author, likes, replies]) => <article key={title} className="rounded-2xl border border-line bg-paper p-5"><div className="flex items-start justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-wide text-accent-ink">Обсуждение</p><h2 className="mt-1 font-display text-base font-extrabold text-ink">{title}</h2><p className="mt-2 text-xs text-ink-soft">{author}</p></div><ArrowUpRight size={18} className="shrink-0 text-ink-faint" /></div><div className="mt-4 flex items-center gap-5 text-xs text-ink-faint"><span className="flex items-center gap-1"><ThumbsUp size={13} /> {likes}</span><span className="flex items-center gap-1"><MessageCircle size={13} /> {replies}</span><Link href="/chats" className="-my-1.5 inline-flex items-center py-1.5 ml-auto font-bold text-accent-ink">Обсудить</Link></div></article>)}</div></div></main>;
}
