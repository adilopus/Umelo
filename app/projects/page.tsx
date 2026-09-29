"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { CarouselSection } from "@/components/CarouselSection";
import { ProjectCard } from "@/components/ProjectCard";
import { ProjectFiltersBar } from "@/components/ProjectFiltersBar";
import { SEED_PROJECTS } from "@/lib/mockProjects";
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

  const filtered = useMemo(() => filterProjects(SEED_PROJECTS, filters), [filters]);
  const isFiltered = hasActiveProjectFilters(filters);

  // Рейтинги «Новые» и «Популярные» не зависят от фильтров: это витрины
  // каталога, а не результаты поиска. Иначе пустая выдача по запросу
  // прятала бы и рекомендации.
  const newest = useMemo(() => topNewProjects(SEED_PROJECTS), []);
  const popular = useMemo(() => topPopularProjects(SEED_PROJECTS), []);

  return (
    <main className="min-h-[calc(100vh-64px)] px-4 pb-16 pt-6 sm:px-6 lg:px-8 lg:pt-8">
      <div className="mx-auto max-w-page">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-accent-ink">Вдохновение</p>
            <h1 className="mt-1 font-display text-3xl font-extrabold text-ink">Проекты</h1>
            <p className="mt-1 text-sm text-ink-soft">
              Реализованные работы людей из строительной сферы.
            </p>
          </div>
          <Link
            href="/orders/new"
            className="hidden items-center gap-2 rounded-full bg-accent px-4 py-2.5 text-xs font-extrabold text-night lg:flex"
          >
            <Plus size={15} /> Добавить проект
          </Link>
        </div>

        <div className="mt-6">
          <ProjectFiltersBar
            filters={filters}
            onChange={setFilters}
            projects={SEED_PROJECTS}
            found={filtered.length}
          />

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
        </div>
      </div>
    </main>
  );
}
