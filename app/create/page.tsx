"use client";

import Link from "next/link";
import { ArrowRight, BriefcaseBusiness, FileText, ImagePlus, PackagePlus, Search, ShoppingBag } from "lucide-react";
import { useAppStore } from "@/lib/store";
import { PageHeader } from "@/components/ui/PageHeader";
import { PageShell } from "@/components/ui/PageShell";

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
    { title: "Новый проект", text: "Опубликовать визуальный проект.", href: "/articles?tab=projects&create=project", icon: ImagePlus },
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
    <main>
      <PageShell padBottom="pb-10">
        <PageHeader
          eyebrow="UMELO"
          title="Создать"
          subtitle="Выберите действие в соответствии с вашей ролью."
        />

        <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {options.map(({ title, text, href, icon: Icon }) => (
            <Link key={href} href={href} className="group rounded-2xl border border-line bg-paper p-5 transition hover:-translate-y-0.5 hover:border-accent hover:shadow-card-hover">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent-soft text-ink">
                <Icon size={21} />
              </div>
              <div className="mt-5 flex items-end justify-between gap-4">
                <div>
                  <h2 className="font-display text-base font-extrabold text-ink">{title}</h2>
                  <p className="mt-1 text-xs leading-5 text-ink-soft">{text}</p>
                </div>
                <ArrowRight size={18} className="shrink-0 text-ink-faint transition group-hover:text-accent-ink" />
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-6 rounded-2xl bg-night p-5 text-white">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-accent">Важно</p>
          <p className="mt-2 font-display text-base font-extrabold">«Предложить работу» не создаёт новый заказ.</p>
          <p className="mt-1 text-xs leading-5 text-white/60">Для существующего заказа специалист выбирается отдельно — через раздел «Специалисты» или страницу самого заказа.</p>
        </div>
      </PageShell>
    </main>
  );
}
