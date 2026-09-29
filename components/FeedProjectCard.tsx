"use client";

import Link from "next/link";
import { Heart, MapPin } from "lucide-react";
import type { FeedProject } from "@/lib/mockProjects";

function SafeImage({ src, alt, className }: { src: string; alt: string; className: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      className={className}
      onError={(e) => {
        e.currentTarget.src = "/icons/logo-mark.png";
      }}
    />
  );
}

/**
 * Карточка проекта для карусели ленты. Фиксированная ширина — элемент
 * полосы, а не плитка сетки, поэтому ширину задаёт контейнер ScrollRow.
 */
export function FeedProjectCard({ project }: { project: FeedProject }) {
  return (
    <Link
      href={project.id === "modern-kitchen" ? "/projects/modern-kitchen" : "/projects"}
      className="group block w-72 shrink-0 snap-start overflow-hidden rounded-2xl border border-line bg-paper transition hover:shadow-card-hover"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-surface">
        <SafeImage
          src={project.coverUrl}
          alt={project.title}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
        <span className="absolute left-3 top-3 rounded-full bg-paper/90 px-2.5 py-1 text-xs font-extrabold text-ink">
          {project.tag}
        </span>
        <span className="absolute bottom-3 left-3 rounded-full bg-ink/80 px-2.5 py-1 text-xs font-semibold text-white">
          {project.photos} фото
        </span>
      </div>
      <div className="p-4">
        <h3 className="line-clamp-2 font-display text-base font-extrabold leading-snug text-ink">
          {project.title}
        </h3>
        <p className="mt-1 truncate text-xs text-ink-soft">
          {project.author} · {project.authorRole}
        </p>
        <div className="mt-3 flex items-center justify-between gap-2 text-xs text-ink-soft">
          <span className="flex items-center gap-1">
            <MapPin size={13} /> {project.location}
          </span>
          <span className="flex items-center gap-1">
            <Heart size={13} /> {project.likes}
          </span>
        </div>
        <p className="mt-2 text-sm font-extrabold text-ink">
          €{project.budget.toLocaleString("ru-RU")}
        </p>
      </div>
    </Link>
  );
}
