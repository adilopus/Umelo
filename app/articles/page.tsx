"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { useAppStore } from "@/lib/store";
import { ArticleCard } from "@/components/ArticleCard";
import { ScrollRow } from "@/components/ScrollRow";
import { BottomNav } from "@/components/BottomNav";
import { ARTICLE_TOPICS } from "@/lib/articleTopics";

export default function ArticlesPage() {
  const router = useRouter();
  const articles = useAppStore((s) => s.articles);
  const [activeTopic, setActiveTopic] = useState<string | null>(null);

  const items = useMemo(() => {
    const filtered = activeTopic ? articles.filter((a) => a.topic === activeTopic) : articles;
    return filtered
      .filter((a) => a.kind !== "promo")
      .sort((a, b) => {
        if (a.promoted !== b.promoted) return a.promoted ? -1 : 1;
        return b.createdAt - a.createdAt;
      });
  }, [articles, activeTopic]);

  return (
    <div className="flex flex-1 flex-col">
      <header className="sticky top-0 z-10 flex items-center gap-3 border-b border-line bg-paper/95 px-4 py-3 backdrop-blur lg:mx-auto lg:w-full lg:max-w-6xl lg:px-6">
        <button
          onClick={() => router.back()}
          className="rounded-full p-1 text-ink-soft active:bg-surface lg:hidden"
          aria-label="Назад"
        >
          <ChevronLeft size={22} />
        </button>
        <p className="font-display text-sm font-bold lg:text-lg">Статьи и новости</p>
      </header>

      <main className="flex-1 pb-24 pt-4 lg:pb-12">
        <div className="mx-auto w-full max-w-6xl lg:px-6">
          <div className="flex items-center gap-2 px-3 lg:px-0">
            <button
              onClick={() => setActiveTopic(null)}
              className={`shrink-0 rounded-full border px-3 py-1.5 text-xs font-medium ${
                activeTopic === null
                  ? "border-accent bg-accent-soft text-accent"
                  : "border-line text-ink-soft"
              }`}
            >
              Все темы
            </button>
            <ScrollRow innerClassName="gap-2 pb-1">
              {ARTICLE_TOPICS.map((topic) => (
                <button
                  key={topic.id}
                  onClick={() => setActiveTopic(topic.id)}
                  className={`shrink-0 rounded-full border px-3 py-1.5 text-xs font-medium ${
                    activeTopic === topic.id
                      ? "border-accent bg-accent-soft text-accent"
                      : "border-line text-ink-soft"
                  }`}
                >
                  {topic.label}
                </button>
              ))}
            </ScrollRow>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-3 px-3 sm:grid-cols-2 lg:grid-cols-4 lg:gap-4 lg:px-0">
            {items.map((article) => (
              <ArticleCard key={article.id} article={article} fullWidth />
            ))}
          </div>

          {items.length === 0 && (
            <p className="mt-10 text-center text-sm text-ink-soft">
              По этой теме пока нет статей.
            </p>
          )}
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
