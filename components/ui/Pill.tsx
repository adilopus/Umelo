"use client";

import type { ReactNode } from "react";

/**
 * Переключаемая «пилюля». В проекте одинаковые по смыслу переключатели
 * тематик, видов работ и фильтров повторялись в шести разных вариантах
 * (заливка/обводка, три радиуса, четыре кегля), включая два разных
 * состояния «active» в одном списке тем в ленте.
 */
export function Pill({
  active = false,
  onClick,
  children,
  variant = "solid",
  title,
}: {
  active?: boolean;
  onClick?: () => void;
  children: ReactNode;
  variant?: "solid" | "outline";
  title?: string;
}) {
  // min-h-10 вместо голого py: текст 12px давал высоту 30px — до нижней
  // границы комфортной зоны нажатия (40px) не хватало 10px.
  const base = "inline-flex min-h-10 items-center rounded-full px-3 py-1.5 text-xs font-semibold transition";

  const styles = {
    solid: active
      ? "bg-accent text-night"
      : "bg-surface text-ink-soft hover:bg-line/50 hover:text-ink",
    outline: active
      ? "border border-accent bg-accent-soft text-accent-ink"
      : "border border-line text-ink-soft hover:bg-surface hover:text-ink",
  }[variant];

  return (
    <button type="button" onClick={onClick} aria-pressed={active} title={title} className={`${base} ${styles}`}>
      {children}
    </button>
  );
}

/** Ряд пилюль с одинаковым отступом. */
export function PillGroup({ children }: { children: ReactNode }) {
  return <div className="flex flex-wrap gap-1.5">{children}</div>;
}
