"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Plus } from "lucide-react";
import { useAppStore } from "@/lib/store";
import { ArticleCard } from "@/components/ArticleCard";
import { ScrollRow } from "@/components/ScrollRow";
import { ARTICLE_TOPICS } from "@/lib/articleTopics";
import {
  ProjectsCatalog,
  PROJECTS_TAB,
  PROJECTS_TAB_HREF,
} from "@/components/projects/ProjectsCatalog";
import { PageHeader } from "@/components/ui/PageHeader";

type JournalTab = "articles" | typeof PROJECTS_TAB;

const TABS: { id: JournalTab; label: string }[] = [
  { id: "articles", label: "Статьи" },
  { id: PROJECTS_TAB, label: "Проекты" },
];

/**
 * Раздел «Журнал»: статьи и проекты в одном разделе, переключение — вкладками.
 *
 * Вкладка берётся из адреса (?tab=projects) через useSearchParams, а не из
 * состояния с эффектом. Разница видна пользователю: с эффектом страница
 * сначала отрисовывает статьи и только потом меняет их на проекты, и любой
 * клик в это короткое окно пропадает — в том числе клик по фильтру, который
 * выглядит уже на месте. Здесь нужная вкладка верна с первого рендера.
 *
 * Обёртка <Suspense> на странице раздела обязательна: useSearchParams при
 * статической сборке без неё роняет сборку.
 */
export function JournalView() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const tab: JournalTab = searchParams.get("tab") === PROJECTS_TAB ? PROJECTS_TAB : "articles";

  function selectTab(next: JournalTab) {
    // Адрес меняем через router, а не через history.replaceState: Next.js
    // держит в history.state служебные ключи, и затирание их ломает
    // следующий переход по приложению.
    router.replace(next === "articles" ? "/articles" : PROJECTS_TAB_HREF, { scroll: false });
  }

  return (
    <>
      <PageHeader
        back
        fallbackHref="/feed"
        eyebrow="Блог UMELO"
        title="Журнал"
        subtitle="Читай, вдохновляйся, будь в тренде."
        actions={
          tab === PROJECTS_TAB ? (
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

      {tab === PROJECTS_TAB ? (
        <ProjectsCatalog allHref={PROJECTS_TAB_HREF} />
      ) : (
        <ArticlesList />
      )}
    </>
  );
}

/** Статьи с фильтром по темам. Состояние темы — локальное: при уходе на
    вкладку проектов список размонтируется и фильтр сбросится сам. */
function ArticlesList() {
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

  const chipClass = (active: boolean) =>
    `inline-flex min-h-10 shrink-0 items-center rounded-full border px-3 py-1.5 text-xs font-medium ${
      active ? "border-accent bg-accent-soft text-accent-ink" : "border-line text-ink-soft"
    }`;

  return (
    <>
      <div className="mt-5 flex items-center gap-2">
        <button onClick={() => setActiveTopic(null)} className={chipClass(activeTopic === null)}>
          Все темы
        </button>
        <ScrollRow innerClassName="gap-2 pb-1">
          {ARTICLE_TOPICS.map((topic) => (
            <button
              key={topic.id}
              onClick={() => setActiveTopic(topic.id)}
              className={chipClass(activeTopic === topic.id)}
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
        <p className="mt-10 text-center text-sm text-ink-soft">По этой теме пока нет статей.</p>
      )}
    </>
  );
}
