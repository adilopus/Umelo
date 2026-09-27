import type { ReactNode } from "react";

/** Единый чип/бейдж. Заменяет 13 разных вариантов разметки по всему проекту. */
export type ChipTone = "neutral" | "accent" | "ok" | "warn" | "danger" | "dark" | "outline";

const TONES: Record<ChipTone, string> = {
  neutral: "bg-surface text-ink-soft",
  accent: "bg-accent-soft text-accent-ink",
  ok: "bg-ok-soft text-ok",
  warn: "bg-warn-soft text-warn",
  danger: "bg-danger-soft text-danger",
  dark: "bg-night text-white",
  outline: "border border-line bg-paper text-ink-soft",
};

const SIZES = {
  sm: "px-2 py-0.5 text-xs",
  md: "px-2.5 py-1 text-xs",
} as const;

export function Chip({
  children,
  tone = "neutral",
  size = "md",
  icon,
  className = "",
}: {
  children: ReactNode;
  tone?: ChipTone;
  size?: keyof typeof SIZES;
  icon?: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1 whitespace-nowrap rounded-full font-semibold ${TONES[tone]} ${SIZES[size]} ${className}`}
    >
      {icon}
      {children}
    </span>
  );
}
