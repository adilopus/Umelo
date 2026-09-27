import type { ButtonHTMLAttributes, ReactNode } from "react";
import Link from "next/link";

export type ButtonVariant = "accent" | "dark" | "outline" | "subtle" | "ghost";
export type ButtonSize = "sm" | "md";

/**
 * Единая кнопка. Раньше по проекту было около десятка разных описаний
 * одного и того же.primary-действия.
 *
 * Контраст: на жёлтом акценте текст тёмный (белый давал 1.9:1 — нечитаемо).
 */
const VARIANTS: Record<ButtonVariant, string> = {
  accent: "bg-accent text-night hover:bg-accent-dark shadow-accent",
  dark: "bg-night text-white hover:bg-ink",
  outline: "border border-line bg-paper text-ink hover:bg-surface",
  subtle: "bg-surface text-ink hover:bg-line/60",
  ghost: "text-ink-soft hover:bg-surface hover:text-ink",
};

const SIZES: Record<ButtonSize, string> = {
  sm: "h-9 px-3.5 text-xs gap-1.5",
  md: "h-11 px-5 text-sm gap-2",
};

export function Button({
  children,
  variant = "accent",
  size = "md",
  full = false,
  className = "",
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  full?: boolean;
}) {
  return (
    <button
      {...rest}
      className={`inline-flex items-center justify-center rounded-full font-bold transition disabled:cursor-not-allowed disabled:opacity-50 ${VARIANTS[variant]} ${SIZES[size]} ${full ? "w-full" : ""} ${className}`}
    >
      {children}
    </button>
  );
}

/** Ссылка в облике кнопки — чтобы CTA не расходились с <Button>. */
export function ButtonLink({
  children,
  href,
  variant = "accent",
  size = "md",
  full = false,
  className = "",
}: {
  children: ReactNode;
  href: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  full?: boolean;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={`inline-flex items-center justify-center rounded-full font-bold transition ${VARIANTS[variant]} ${SIZES[size]} ${full ? "w-full" : ""} ${className}`}
    >
      {children}
    </Link>
  );
}
