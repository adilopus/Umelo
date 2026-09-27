import Link from "next/link";
import { MapPin, Image as ImageIcon, Clock, FileText, Check } from "lucide-react";
import { Order } from "@/lib/types";
import { formatDate } from "@/lib/format";

function formatBudget(min: number, max: number) {
  const fmt = (n: number) => (n >= 1000 ? `${Math.round(n / 1000)} 000` : `${n}`);
  return `${fmt(min)}–${fmt(max)} ₽`;
}

function formatDeadline(days: number) {
  if (days <= 3) return `${days} дн.`;
  if (days <= 30) return `${days} дн.`;
  const months = Math.round(days / 30);
  return `~${months} мес.`;
}

export function OrderCard({
  order,
  fullWidth = false,
  responded = false,
  showDate = false,
}: {
  order: Order;
  /** true — растягивается на всю ширину ячейки (для сетки), по умолчанию —
   * фиксированная ширина карточки для горизонтального скролла в ленте
   * (тот же масштаб, что у ArticleCard/PromoCard — общий визуальный ритм). */
  fullWidth?: boolean;
  /** Исполнитель уже откликнулся на заказ — показывает метку «Отклик отправлен». */
  responded?: boolean;
  /** Показывать дату публикации (нужно в каталоге заказов, лента обходится без неё). */
  showDate?: boolean;
}) {
  const cover = order.media.find((m) => m.isCover) ?? order.media[0];

  return (
    <Link
      href={`/orders/${order.id}`}
      className={`group block overflow-hidden rounded-2xl border border-line bg-white shadow-sm transition hover:shadow-md ${
        fullWidth ? "w-full" : "w-64 shrink-0"
      }`}
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-ink">
        {cover && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={cover.dataUrl}
            alt=""
            className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
          />
        )}
        <span className="price-tag absolute left-0 top-3 bg-accent py-1 pl-3 font-display text-sm font-extrabold text-white shadow">
          {formatBudget(order.budgetMin, order.budgetMax)}
        </span>
        {responded && (
          <span className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-ok py-1 pl-1.5 pr-2.5 text-[10px] font-bold text-white shadow">
            <Check size={12} strokeWidth={3} /> Отклик отправлен
          </span>
        )}
        {showDate && (
          <span className="absolute bottom-3 right-3 rounded-full bg-black/60 px-2 py-0.5 text-[10px] font-medium text-white">
            {formatDate(order.createdAt)}
          </span>
        )}
      </div>
      <div className="space-y-1.5 p-3">
        <p className="line-clamp-2 font-display text-[13px] font-bold leading-tight text-ink">
          {order.serviceName}
        </p>
        <p className="truncate text-[11px] text-sage">{order.subcategory}</p>
        <div className="flex items-center justify-between text-xs text-ink-soft">
          <span className="flex items-center gap-1">
            <MapPin size={13} /> {order.distanceKm?.toFixed(1) ?? "—"} км
          </span>
          <span className="flex items-center gap-1">
            <Clock size={13} /> {formatDeadline(order.deadlineDays)}
          </span>
        </div>
        <div className="flex items-center gap-2 text-[11px] text-ink-faint">
          <span className="flex items-center gap-1">
            <ImageIcon size={12} /> {order.media.length}
          </span>
          {order.documents.length > 0 && (
            <span className="flex items-center gap-1">
              <FileText size={12} /> {order.documents.length}
            </span>
          )}
          <span className="ml-auto font-medium">
            {order.areaOver1000 ? "более 1000 м²" : `${order.areaSqm} м²`}
          </span>
        </div>
      </div>
    </Link>
  );
}
