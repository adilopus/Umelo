import type { ReactNode } from "react";

/** Единое пустое состояние: раньше его копировали в каждой панели вручную. */
export function EmptyState({
  title,
  hint,
  icon,
  action,
  className = "",
}: {
  title: string;
  hint?: string;
  icon?: ReactNode;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`flex flex-col items-center gap-2 rounded-2xl border border-dashed border-line bg-surface/60 px-6 py-10 text-center ${className}`}
    >
      {icon && <div className="text-ink-faint">{icon}</div>}
      <p className="text-sm font-semibold text-ink">{title}</p>
      {hint && <p className="max-w-sm text-xs leading-relaxed text-ink-soft">{hint}</p>}
      {action}
    </div>
  );
}
