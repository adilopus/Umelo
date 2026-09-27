import { Order } from "@/lib/types";
import type { ChipTone } from "@/components/ui/Chip";

/**
 * Единый словарь статусов заказа. Раньше один и тот же статус описывался
 * в трёх местах разными строками и разными классами.
 */
export const STATUS_META: Record<Order["status"], { label: string; tone: ChipTone }> = {
  open: { label: "Ищем мастера", tone: "accent" },
  matched: { label: "В работе", tone: "ok" },
  cancelled: { label: "Отменён", tone: "danger" },
  closed: { label: "Завершён", tone: "neutral" },
};

export function statusLabel(status: Order["status"]) {
  return STATUS_META[status].label;
}
