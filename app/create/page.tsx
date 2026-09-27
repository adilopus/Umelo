"use client";

import Link from "next/link";
import { ArrowRight, BriefcaseBusiness, FileText, ImagePlus, PackagePlus, Search, ShoppingBag } from "lucide-react";
import { useAppStore } from "@/lib/store";

const OPTIONS = {
  customer: [
    { title: "Новый заказ", text: "Создать задачу и опубликовать её для специалистов.", href: "/orders/new", icon: BriefcaseBusiness },
  ],
  master: [
    { title: "Найти заказ", text: "Каталог открытых заказов с поиском по тематике, бюджету, району и дате.", href: "/orders", icon: Search },
    { title: "Работа в портфолио", text: "Добавить выполненный проект: фото, описание, сроки и цена.", href: "/portfolio", icon: ImagePlus },
    { title: "Мои предложения", text: "Заказы, которые заказчики предложили вам.", href: "/offers", icon: BriefcaseBusiness },
  ],
  blogger: [
    { title: "Новый проект", text: "Опубликовать визуальный проект.", href: "/projects?create=project", icon: ImagePlus },
    { title: "Новая публикация", text: "Добавить материал в Журнал.", href: "/articles?create=article", icon: FileText },
  ],
  seller: [
    { title: "Новый товар", text: "Добавить позицию в магазин.", href: "/shops?create=product", icon: PackagePlus },
    { title: "Новый магазин", text: "Создать витрину продавца.", href: "/shops?create=shop", icon: ShoppingBag },
  ],
  admin: [
    { title: "Новый заказ", text: "Создать демонстрационный заказ.", href: "/orders/new", icon: BriefcaseBusiness },
  ],
} as const;

export default function CreatePage() {
  const role = useAppStore((s) => s.role);
  const options = OPTIONS[role];

  return (
    <main className="min-h-[calc(100vh-64px)] bg-[#f7f8f7] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <p className="text-xs font-bold uppercase tracking-[0.14em] text-accent">UMELO</p>
        <h1 className="mt-1 font-display text-3xl font-extrabold text-ink">Создать</h1>
        <p className="mt-2 text-sm text-ink-soft">Выберите действие в соответствии с вашей ролью.</p>

        <div className="mt-7 grid gap-3 sm:grid-cols-2">
          {options.map(({ title, text, href, icon: Icon }) => (
            <Link key={href} href={href} className="group rounded-2xl border border-line bg-white p-5 transition hover:-translate-y-0.5 hover:border-accent hover:shadow-md">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent-soft text-ink">
                <Icon size={21} />
              </div>
              <div className="mt-5 flex items-end justify-between gap-4">
                <div>
                  <h2 className="font-display text-base font-extrabold text-ink">{title}</h2>
                  <p className="mt-1 text-xs leading-5 text-ink-soft">{text}</p>
                </div>
                <ArrowRight size={18} className="shrink-0 text-ink-faint transition group-hover:text-accent" />
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-6 rounded-2xl bg-[#111419] p-5 text-white">
          <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-accent">Важно</p>
          <p className="mt-2 font-display text-base font-extrabold">«Предложить работу» не создаёт новый заказ.</p>
          <p className="mt-1 text-xs leading-5 text-white/60">Для существующего заказа специалист выбирается отдельно — через раздел «Специалисты» или страницу самого заказа.</p>
        </div>
      </div>
    </main>
  );
}
