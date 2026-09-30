"use client";

import { useMemo, useState } from "react";

import { CarouselSection } from "@/components/CarouselSection";
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

/**
 * Каталог проектов — подраздел «Проекты» внутри Журнала.
 *
 * Раньше это была отдельная страница `app/projects/page.tsx`, но по смыслу
 * проекты и статьи показывают одно и то же — работы и мысли людей из
 * строительной сферы. Теперь `/projects` только редиректит сюда, а каталог
 * живёт в компоненте, чтобы его можно было вставить в общий раздел.
 *
 * Шапку (`PageHeader`) компонент не рисует: она общая для Журнала и меняет
 * подпись в зависимости от активной вкладки.
 */
export const PROJECTS_TAB = "projects" as const;

/** Канонический адрес подраздела «Проекты» внутри Журнала. */
export const PROJECTS_TAB_HREF = `/articles?tab=${PROJECTS_TAB}`;

export function ProjectsCatalog({ allHref }: { allHref: string }) {
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
    <>
      <div className="mt-5">
        <ProjectFiltersBar
          filters={filters}
          onChange={setFilters}
          projects={projects}
          found={filtered.length}
        />
      </div>

      <div className="space-y-9">
        <CarouselSection
          title={isFiltered ? "Найденные проекты" : "Все проекты"}
          subtitle={
            isFiltered
              ? "Подходят под текущие фильтры"
              : "Полный каталог — листайте или выберите тему"
          }
          allHref={allHref}
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
    </>
  );
}
