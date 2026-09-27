import type { ReactNode } from "react";

/** Единая плитка «число + подпись». Заменяет 7 разных разметок Stat/StatCard. */
export function Stat({
  value,
  label,
  tone = "default",
  className = "",
}: {
  value: ReactNode;
  label: string;
  tone?: "default" | "accent" | "onDark";
  className?: string;
}) {
  const tones = {
    default: "bg-surface text-ink",
    accent: "bg-accent-soft text-accent-ink",
    onDark: "bg-paper/5 text-white",
  } as const;

  return (
    <div className={`rounded-xl px-3 py-2.5 text-center ${tones[tone]} ${className}`}>
      <div className="font-display text-lg font-extrabold leading-tight">{value}</div>
      <div
        className={`mt-0.5 text-xs leading-tight ${
          tone === "onDark" ? "text-white/60" : "text-ink-soft"
        }`}
      >
        {label}
      </div>
    </div>
  );
}

/** Ряд плиток с одинаковыми колонками. */
const COLUMNS = { 2: "grid-cols-2", 3: "grid-cols-3", 4: "grid-cols-4" } as const;

export function StatGrid({
  children,
  columns = 3,
  className = "",
}: {
  children: ReactNode;
  columns?: keyof typeof COLUMNS;
  className?: string;
}) {
  return <div className={`grid gap-2 ${COLUMNS[columns]} ${className}`}>{children}</div>;
}
