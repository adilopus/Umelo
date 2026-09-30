import type { ReactNode } from "react";

/**
 * Единственная ширина контента во всём приложении.
 *
 * Раньше у разделов coexствовали `max-w-content` (880), `max-w-page` (1280) и
 * локальные `max-w` — при переходе между разделами левая граница уезжала на
 * 200px, а логотип в шапке не совпадал ни с одним из них.
 *
 * Теперь ширина и боковые поля те же, что у `DesktopTopNav`
 * (`max-w-shell` + `px-6`), поэтому логотип, заголовок раздела и первый ряд
 * карточек стоят на одной вертикали при любой ширине окна.
 */
export const PAGE_GUTTER = "px-4 sm:px-6 lg:px-6";

export function PageShell({
  children,
  className = "",
  /** Отступ снизу: у каталогов с лентой он меньше, у форм — стандартный. */
  padBottom = "pb-16",
}: {
  children: ReactNode;
  className?: string;
  padBottom?: string;
}) {
  return (
    <div className={`mx-auto w-full max-w-shell ${PAGE_GUTTER} pt-6 lg:pt-8 ${padBottom} ${className}`}>
      {children}
    </div>
  );
}
