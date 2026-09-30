"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { useAppStore } from "@/lib/store";
import { BackButton } from "@/components/ui/BackButton";
import { ArticleCard } from "@/components/ArticleCard";
import { ScrollRow } from "@/components/ScrollRow";
import { BottomNav } from "@/components/BottomNav";
import { ARTICLE_TOPICS } from "@/lib/articleTopics";
import { PageHeader } from "@/components/ui/PageHeader";
import { PageShell } from "@/components/ui/PageShell";

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
    <main className="flex-1">
      <PageShell padBottom="pb-12">
        <PageHeader
          back
          fallbackHref="/feed"
          eyebrow="Блог UMELO"
          title="Статьи и новости"
          subtitle="Читай, вдохновляйся, будь в тренде."
        >
          <div className="mt-5 flex items-center gap-2">
            <button
              onClick={() => setActiveTopic(null)}
              className={`inline-flex min-h-10 shrink-0 items-center rounded-full border px-3 py-1.5 text-xs font-medium ${
                activeTopic === null
                  ? "border-accent bg-accent-soft text-accent-ink"
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
                  className={`inline-flex min-h-10 shrink-0 items-center rounded-full border px-3 py-1.5 text-xs font-medium ${
                    activeTopic === topic.id
                      ? "border-accent bg-accent-soft text-accent-ink"
                      : "border-line text-ink-soft"
                  }`}
                >
                  {topic.label}
                </button>
              ))}
            </ScrollRow>
          </div>
        </PageHeader>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4 lg:gap-4">
          {items.map((article) => (
            <ArticleCard key={article.id} article={article} fullWidth />
          ))}
        </div>

        {items.length === 0 && (
          <p className="mt-10 text-center text-sm text-ink-soft">
            По этой теме пока нет статей.
          </p>
        )}
      </PageShell>

      <BottomNav />
    </main>
  );
}
