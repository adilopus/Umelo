import { Star } from "lucide-react";

/** Единый рейтинг звёздами. Заменяет локальные копии Stars в трёх файлах. */
export function Stars({
  value,
  size = 14,
  className = "",
}: {
  value: number;
  size?: number;
  className?: string;
}) {
  const rounded = Math.round(value * 2) / 2;

  return (
    <span
      className={`inline-flex items-center gap-0.5 ${className}`}
      aria-label={`Рейтинг ${value}`}
    >
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          size={size}
          strokeWidth={2}
          className={
            rounded >= i
              ? "fill-accent text-accent-ink"
              : rounded >= i - 0.5
                ? "fill-accent/50 text-accent-ink"
                : "text-ink-faint"
          }
        />
      ))}
    </span>
  );
}
