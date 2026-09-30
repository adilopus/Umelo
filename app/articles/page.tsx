"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { useAppStore } from "@/lib/store";
import { ArticleCard } from "@/components/ArticleCard";
import { ScrollRow } from "@/components/ScrollRow";
import { BottomNav } from "@/components/BottomNav";
import { ARTICLE_TOPICS } from "@/lib/articleTopics";
import {
  ProjectsCatalog,
  PROJECTS_TAB,
  PROJECTS_TAB_HREF,
} from "@/components/projects/ProjectsCatalog";
import { PageHeader } from "@/components/ui/PageHeader";
import { PageShell } from "@/components/ui/PageShell";

type JournalTab = "articles" | typeof PROJECTS_TAB;

const TABS: { id: JournalTab; label: string }[] = [
  { id: "articles", label: "Статьи" },
  { id: PROJECTS_TAB, label: "Проекты" },
];

export default function ArticlesPage() {
  const router = useRouter();
  const articles = useAppStore((s) => s.articles);
  const [activeTopic, setActiveTopic] = useState<string | null>(null);
  const [tab, setTab] = useState<JournalTab>("articles");

  // Поддержка прямых ссылок вида /articles?tab=projects — сюда ведут и
  // редирект со старой страницы /projects, и ссылки «Все проекты». Читаем
  // query уже на клиенте, чтобы не требовать Suspense-обёртку вокруг
  // useSearchParams при статическом рендере.
  useEffect(() => {
    if (new URLSearchParams(window.location.search).get("tab") === PROJECTS_TAB) {
      setTab(PROJECTS_TAB);
    }
  }, []);

  const items = useMemo(() => {
    const filtered = activeTopic ? articles.filter((a) => a.topic === activeTopic) : articles;
    return filtered
      .filter((a) => a.kind !== "promo")
      .sort((a, b) => {
        if (a.promoted !== b.promoted) return a.promoted ? -1 : 1;
        return b.createdAt - a.createdAt;
      });
  }, [articles, activeTopic]);

  const showProjects = tab === PROJECTS_TAB;

  function selectTab(next: JournalTab) {
    setTab(next);
    if (next === PROJECTS_TAB) setActiveTopic(null);
    // Адрес вкладки держим в строке: так подраздел можно дать ссылкой,
    // отметить закладкой и вернуться к нему кнопкой «назад». Меняем адрес
    // через router, а не через history.replaceState: Next.js хранит в
    // history.state служебные ключи, и затирание их ломает следующий
    // переход по приложению.
    router.replace(next === "articles" ? "/articles" : PROJECTS_TAB_HREF, { scroll: false });
  }

  return (
    <main className="flex-1">
      <PageShell padBottom="pb-12">
        <PageHeader
          back
          fallbackHref="/feed"
          eyebrow="Блог UMELO"
          title="Журнал"
          subtitle="Читай, вдохновляйся, будь в тренде."
          actions={
            showProjects ? (
              <Link
                href="/orders/new"
                className="hidden items-center gap-2 rounded-full bg-accent px-4 py-2.5 text-xs font-extrabold text-night lg:flex"
              >
                <Plus size={15} /> Добавить проект
              </Link>
            ) : undefined
          }
        >
          <div className="mt-5 flex items-center gap-2" role="tablist" aria-label="Разделы Журнала">
            {TABS.map((item) => (
              <button
                key={item.id}
                role="tab"
                type="button"
                aria-selected={tab === item.id}
                onClick={() => selectTab(item.id)}
                className={`inline-flex min-h-10 shrink-0 items-center rounded-full border px-4 py-1.5 text-xs font-bold ${
                  tab === item.id
                    ? "border-accent bg-accent-soft text-accent-ink"
                    : "border-line text-ink-soft"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </PageHeader>

        {showProjects ? (
          <ProjectsCatalog allHref={PROJECTS_TAB_HREF} />
        ) : (
          <>
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
          </>
        )}
      </PageShell>

      <BottomNav />
    </main>
  );
}
