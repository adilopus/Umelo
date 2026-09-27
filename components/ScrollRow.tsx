"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

/**
 * Горизонтально прокручиваемый ряд со стрелками по краям — только на десктопе
 * (`lg` и шире): на мобильном свайп пальцем и так естественен, а стрелки там
 * только занимали бы место. Стрелки скрываются/блокируются на границах
 * прокрутки, чтобы не тыкать в пустоту.
 */
export function ScrollRow({
  children,
  innerClassName = "",
  step = 240,
}: {
  children: React.ReactNode;
  /** classNames для самого прокручиваемого контейнера (gap, отступы и т.д.) */
  innerClassName?: string;
  /** на сколько пикселей прокручивать за один клик по стрелке */
  step?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(false);

  function updateArrows() {
    const el = ref.current;
    if (!el) return;
    setCanLeft(el.scrollLeft > 4);
    setCanRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  }

  useEffect(() => {
    updateArrows();
    const el = ref.current;
    if (!el) return;
    el.addEventListener("scroll", updateArrows, { passive: true });
    window.addEventListener("resize", updateArrows);
    return () => {
      el.removeEventListener("scroll", updateArrows);
      window.removeEventListener("resize", updateArrows);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [children]);

  function scrollBy(dir: 1 | -1) {
    ref.current?.scrollBy({ left: dir * step, behavior: "smooth" });
  }

  return (
    <div className="flex min-w-0 flex-1 items-center gap-1">
      <button
        onClick={() => scrollBy(-1)}
        disabled={!canLeft}
        aria-label="Прокрутить влево"
        tabIndex={canLeft ? 0 : -1}
        className={`hidden shrink-0 rounded-full border p-1.5 transition lg:flex ${
          canLeft
            ? "border-line text-ink-soft hover:bg-surface hover:text-ink"
            : "cursor-not-allowed border-line text-ink-faint opacity-30"
        }`}
      >
        <ChevronLeft size={16} />
      </button>

      <div
        ref={ref}
        className={`no-scrollbar flex overflow-x-auto scroll-smooth ${innerClassName}`}
      >
        {children}
      </div>

      <button
        onClick={() => scrollBy(1)}
        disabled={!canRight}
        aria-label="Прокрутить вправо"
        tabIndex={canRight ? 0 : -1}
        className={`hidden shrink-0 rounded-full border p-1.5 transition lg:flex ${
          canRight
            ? "border-line text-ink-soft hover:bg-surface hover:text-ink"
            : "cursor-not-allowed border-line text-ink-faint opacity-30"
        }`}
      >
        <ChevronRight size={16} />
      </button>
    </div>
  );
}
