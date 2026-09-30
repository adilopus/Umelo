import type { ReactNode } from "react";
import { BackButton } from "./BackButton";

/**
 * Единый заголовок раздела: надзаголовок, заголовок, пояснение и действия.
 *
 * Раньше в проекте сосуществовали три конкурирующих паттерна (липкая строка с
 * блюром, шапка с нижней границей и просто блок `<h1>`), а ширина задавалась
 * произвольным `max-w` в каждой странице. Заголовки от этого прыгали по высоте и
 * по горизонтали при переходе между разделами.
 *
 * Теперь шапка сама держит контейнер `PageShell`, а высота строки одна и та же
 * на всех разделах: на ПК — крупный заголовок с пояснением, на мобильном —
 * компактная липкая строка с кнопкой «назад».
 */
export function PageHeader({
  title,
  eyebrow,
  subtitle,
  back,
  fallbackHref,
  actions,
  children,
}: {
  title: ReactNode;
  /** Надзаголовок капсом — единая «рубрика» раздела над заголовком. */
  eyebrow?: ReactNode;
  subtitle?: ReactNode;
  /** Показать кнопку «назад» в мобильной строке */
  back?: boolean;
  fallbackHref?: string;
  actions?: ReactNode;
  /** Дополнительное содержимое под заголовком: фильтры, табы, поиск. */
  children?: ReactNode;
}) {
  return (
    <div className="sticky top-0 z-20 -mx-4 mb-5 border-b border-line bg-paper/90 px-4 backdrop-blur-md sm:-mx-6 sm:px-6 lg:static lg:mx-0 lg:mb-7 lg:border-0 lg:bg-transparent lg:px-0 lg:backdrop-blur-none">
      <div className="flex flex-wrap items-end justify-between gap-x-4 gap-y-3 pt-3 lg:pt-0">
        <div className="flex min-w-0 items-center gap-3 lg:items-end">
          {back && (
            <span className="lg:hidden">
              <BackButton fallbackHref={fallbackHref} />
            </span>
          )}

          <div className="min-w-0">
            {eyebrow && (
              <p className="mb-1 hidden text-xs font-bold uppercase tracking-[0.14em] text-accent-ink lg:block">
                {eyebrow}
              </p>
            )}
            <h1 className="font-display text-xl font-extrabold leading-tight text-ink lg:text-3xl">
              {title}
            </h1>
            {subtitle && <p className="mt-1 text-sm text-ink-soft">{subtitle}</p>}
          </div>
        </div>

        {actions && <div className="flex shrink-0 items-center gap-2 pb-0.5 lg:pb-1">{actions}</div>}
      </div>

      {children && <div className="pb-3 lg:pb-0">{children}</div>}
    </div>
  );
}
