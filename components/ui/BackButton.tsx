"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

/**
 * Единая кнопка «назад». Раньше класс `rounded-full p-1 text-ink-soft
 * active:bg-surface` был продублирован в шести файлах.
 */
export function BackButton({
  fallbackHref,
  label = "Назад",
  className = "",
}: {
  fallbackHref?: string;
  label?: string;
  className?: string;
}) {
  const router = useRouter();

  return (
    <button
      type="button"
      onClick={() => (fallbackHref ? router.push(fallbackHref) : router.back())}
      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-ink-soft transition hover:bg-surface hover:text-ink active:bg-surface ${className}`}
      aria-label={label}
      title={label}
    >
      <ArrowLeft size={18} />
    </button>
  );
}
