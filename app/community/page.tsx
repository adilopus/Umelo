"use client";

import Link from "next/link";
import { ArrowUpRight, MessageCircle, Plus, ThumbsUp } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { PageShell } from "@/components/ui/PageShell";

const discussions = [
  ["Как правильно утеплить фасад перед штукатуркой?", "Анна Коваль", "24", "8"],
  ["Сколько закладывать на коммуникации при ремонте новостройки?", "Дмитрий Орлов", "18", "6"],
  ["Можно ли красить фрезерованный брус сразу после строгания?", "Игорь Белов", "31", "12"],
];

export default function CommunityPage() {
  return (
    <main>
      <PageShell>
        <PageHeader
          eyebrow="Общение"
          title="Сообщество"
          subtitle="Обсуждения, советы и находки от тех, кто строит и ремонтирует."
          actions={
            <button className="hidden items-center gap-2 rounded-full bg-accent px-4 py-2.5 text-xs font-extrabold text-night sm:flex">
              <Plus size={15} /> Начать обсуждение
            </button>
          }
        />

        <div className="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {discussions.map(([title, author, likes, replies]) => (
            <article key={title} className="rounded-2xl border border-line bg-paper p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wide text-accent-ink">Обсуждение</p>
                  <h2 className="mt-1 font-display text-base font-extrabold text-ink">{title}</h2>
                  <p className="mt-2 text-xs text-ink-soft">{author}</p>
                </div>
                <ArrowUpRight size={18} className="shrink-0 text-ink-faint" />
              </div>
              <div className="mt-4 flex items-center gap-5 text-xs text-ink-faint">
                <span className="flex items-center gap-1">
                  <ThumbsUp size={13} /> {likes}
                </span>
                <span className="flex items-center gap-1">
                  <MessageCircle size={13} /> {replies}
                </span>
                <Link href="/chats" className="-my-1.5 ml-auto inline-flex items-center py-1.5 font-bold text-accent-ink">
                  Обсудить в чате
                </Link>
              </div>
            </article>
          ))}
        </div>
      </PageShell>
    </main>
  );
}
