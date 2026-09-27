"use client";

import type { ReactNode } from "react";
import { BackButton } from "./BackButton";

type Width = "shell" | "page" | "content" | "form";

const WIDTHS: Record<Width, string> = {
  shell: "lg:max-w-shell",
  page: "lg:max-w-page",
  content: "lg:max-w-content",
  form: "lg:max-w-form",
};

/**
 * Единый заголовок страницы. Раньше в проекте сосуществовали три конкурирующих
 * паттерна (с нижней границей, sticky с блюром и без `lg:border-0`), а ширины
 * задавались произвольными max-w в каждой странице отдельно.
 *
 * На мобильном — компактная липкая строка, на десктопе — крупный заголовок
 * без рамки. Ширина берётся из шкалы max-w-*.
 */
export function PageHeader({
  title,
  subtitle,
  back,
  fallbackHref,
  actions,
  width = "content",
  children,
}: {
  title: ReactNode;
  subtitle?: ReactNode;
  /** Показать кнопку «назад» в мобильной строке */
  back?: boolean;
  fallbackHref?: string;
  actions?: ReactNode;
  width?: Width;
  children?: ReactNode;
}) {
  return (
    <div className="sticky top-0 z-20 -mx-4 mb-4 border-b border-line bg-paper/90 px-4 backdrop-blur-md lg:static lg:mx-0 lg:mb-5 lg:border-0 lg:bg-transparent lg:px-0 lg:backdrop-blur-none">
      <div className={`flex items-center gap-3 py-3 lg:py-0 ${WIDTHS[width]}`}>
        {back && (
          <span className="lg:hidden">
            <BackButton fallbackHref={fallbackHref} />
          </span>
        )}

        <div className="min-w-0 flex-1">
          <h1 className="truncate font-display text-lg font-extrabold leading-tight text-ink lg:text-3xl">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-0.5 truncate text-xs text-ink-soft lg:text-sm">{subtitle}</p>
          )}
        </div>

        {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
      </div>

      {children && <div className="pb-3 lg:pb-0">{children}</div>}
    </div>
  );
}
