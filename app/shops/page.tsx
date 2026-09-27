"use client";

import { ArrowRight, Package, Search, ShoppingBag, Tag } from "lucide-react";

const products = [
  ["Плитка Italon", "от €24,90 / м²", "−15%"],
  ["Смеситель Grohe", "от €189", ""],
  ["Краска Tikkurila", "от €69 / 10 л", ""],
  ["Шуруповёрты", "от €149", "−10%"],
];

export default function ShopsPage() {
  return <main className="min-h-[calc(100vh-64px)] bg-surface px-4 pb-16 pt-8 sm:px-6 lg:px-8"><div className="mx-auto max-w-page"><p className="text-xs font-bold uppercase tracking-[0.14em] text-accent-ink">Экосистема</p><h1 className="mt-1 font-display text-3xl font-extrabold text-ink">Магазины и материалы</h1><p className="mt-1 text-sm text-ink-soft">Материалы и инструменты, привязанные к реальным проектам.</p><div className="mt-5 flex items-center gap-2 rounded-2xl border border-line bg-paper px-4 py-3"><Search size={17} className="text-ink-faint" /><input className="min-h-8 min-w-0 flex-1 bg-transparent text-sm outline-none" placeholder="Поиск материалов, магазинов и брендов" /></div><div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{products.map(([name, price, badge]) => <article key={name} className="rounded-2xl border border-line bg-paper p-4"><div className="flex h-32 items-center justify-center rounded-xl bg-surface"><Package size={38} className="text-ok" /></div>{badge && <span className="relative -mt-7 ml-2 block w-fit rounded-md bg-accent px-2 py-1 text-xs font-extrabold text-night">{badge}</span>}<h2 className="mt-4 font-display text-sm font-extrabold text-ink">{name}</h2><p className="mt-1 text-xs text-ink-soft">{price}</p><button className="mt-4 flex min-h-11 w-full items-center justify-center gap-1.5 rounded-xl border border-line py-2.5 text-xs font-bold text-ink-soft">Посмотреть <ArrowRight size={13} /></button></article>)}</div><div className="mt-6 rounded-2xl bg-night p-6 text-white"><div className="flex items-center gap-3"><ShoppingBag className="text-accent" /><div><h2 className="font-display font-extrabold">Ваши материалы — часть проекта</h2><p className="mt-1 text-xs text-white/60">Добавляйте материалы в проекты, чтобы другим было проще повторить результат.</p></div></div><button className="mt-5 flex items-center gap-2 rounded-xl bg-paper px-4 py-2.5 text-xs font-extrabold text-ink"><Tag size={14} /> Добавить материал</button></div></div></main>;
}
