"use client";

import { useEffect, type ReactNode } from "react";
import { X } from "lucide-react";

/**
 * Единая модалка. Заменяет 4 несовместимые реализации: разные затемнения
 * (bg-black/40 / /50 / /60 и одно без затемнения), разные радиусы, разные тени.
 */
export function Modal({
  open,
  onClose,
  title,
  children,
  footer,
  width = "md",
}: {
  open: boolean;
  onClose: () => void;
  title?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  width?: "sm" | "md" | "lg";
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  if (!open) return null;

  // Раньше здесь стояли ширины СТРАНИЦЫ (880/1280px) — модалка на 1280px
  // растягивалась во весь экран и теряла смысл.
  const widths = { sm: "sm:max-w-sm", md: "sm:max-w-md", lg: "sm:max-w-form" } as const;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-night/50 p-0 backdrop-blur-[2px] sm:items-center sm:p-4"
      onClick={onClose}
      role="presentation"
    >
      <div
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
        className={`flex max-h-[90vh] w-full flex-col rounded-t-3xl bg-paper shadow-pop sm:max-h-[85vh] sm:rounded-3xl ${widths[width]}`}
      >
        {title && (
          <div className="flex items-start justify-between gap-3 border-b border-line px-5 py-4">
            <h2 className="font-display text-lg font-extrabold leading-tight text-ink">{title}</h2>
            <button
              type="button"
              onClick={onClose}
              aria-label="Закрыть"
              className="-mr-1 -mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-ink-soft transition hover:bg-surface hover:text-ink"
            >
              <X size={18} />
            </button>
          </div>
        )}
        <div className="overflow-y-auto px-5 py-4">{children}</div>
        {footer && <div className="border-t border-line px-5 py-4">{footer}</div>}
      </div>
    </div>
  );
}
