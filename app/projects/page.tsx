"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { CarouselSection } from "@/components/CarouselSection";
import { PageHeader } from "@/components/ui/PageHeader";
import { PageShell } from "@/components/ui/PageShell";
import { ProjectCard } from "@/components/ProjectCard";
import { ProjectFiltersBar } from "@/components/ProjectFiltersBar";
import { useAppStore } from "@/lib/store";
import {
  EMPTY_PROJECT_FILTERS,
  filterProjects,
  hasActiveProjectFilters,
  topNewProjects,
  topPopularProjects,
  type ProjectFilters,
} from "@/lib/projectFilters";

export default function ProjectsPage() {
  const [filters, setFilters] = useState<ProjectFilters>(EMPTY_PROJECT_FILTERS);
  const projects = useAppStore((s) => s.projects);

  const filtered = useMemo(() => filterProjects(projects, filters), [projects, filters]);
  const isFiltered = hasActiveProjectFilters(filters);

  // Рейтинги «Новые» и «Популярные» не зависят от фильтров: это витрины
  // каталога, а не результаты поиска. Иначе пустая выдача по запросу
  // прятала бы и рекомендации.
  const newest = useMemo(() => topNewProjects(projects), [projects]);
  const popular = useMemo(() => topPopularProjects(projects), [projects]);

  return (
    <main>
      <PageShell>
        <PageHeader
          eyebrow="Вдохновение"
          title="Проекты"
          subtitle="Реализованные работы людей из строительной сферы."
          actions={
            <Link
              href="/orders/new"
            className="hidden items-center gap-2 rounded-full bg-accent px-4 py-2.5 text-xs font-extrabold text-night lg:flex"
          >
              <Plus size={15} /> Добавить проект
            </Link>
          }
        >
          <div className="mt-5">
            <ProjectFiltersBar
              filters={filters}
              onChange={setFilters}
              projects={projects}
              found={filtered.length}
            />
          </div>
        </PageHeader>

        <div className="space-y-9">
          <CarouselSection
            title={isFiltered ? "Найденные проекты" : "Все проекты"}
            subtitle={
              isFiltered
                ? "Подходят под текущие фильтры"
                : "Полный каталог — листайте или выберите тему"
            }
            allHref="/projects"
            allLabel={isFiltered ? "Сбросить" : "Все проекты"}
            emptyLabel="Под фильтры ничего не подошло — попробуйте изменить условия"
          >
            {filtered.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </CarouselSection>

          <CarouselSection
            title="Новые проекты"
            subtitle="Свежие работы — 10 последних"
            emptyLabel="Пока нет опубликованных проектов"
          >
            {newest.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </CarouselSection>

          <CarouselSection
            title="Популярные проекты"
            subtitle="Чаще всего открывают — 10 лучших"
            emptyLabel="Пока нет опубликованных проектов"
          >
            {popular.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </CarouselSection>
        </div>
      </PageShell>
    </main>
  );
}
