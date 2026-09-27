import Link from "next/link";
import { MapPin, Image as ImageIcon, Clock, FileText, Check } from "lucide-react";
import { Order } from "@/lib/types";
import { formatBudget, formatDate, formatDeadline, formatNumber } from "@/lib/format";
import { Chip } from "@/components/ui/Chip";

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
      className={`group block overflow-hidden rounded-2xl border border-line bg-paper shadow-card transition hover:shadow-card-hover ${
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
        <span className="price-tag absolute left-0 top-3 bg-accent py-1 pl-3 font-display text-sm font-extrabold text-night">
          {formatBudget(order.budgetMin, order.budgetMax)}
        </span>
        {responded && (
          <span className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-ok py-1 pl-1.5 pr-2.5 text-xs font-bold text-white">
            <Check size={12} strokeWidth={3} /> Отклик отправлен
          </span>
        )}
        {showDate && (
          <span className="absolute bottom-3 right-3 rounded-full bg-night/70 px-2 py-0.5 text-xs font-medium text-white">
            {formatDate(order.createdAt)}
          </span>
        )}
      </div>

      {/* Три строки вместо четырёх: заголовок, подкатегория, одна мета-строка.
      Раньше подпись, расстояние, срок, счётчики и площадь занимали четыре
      ряда разного кегля (13/11/12/11px) и давали «шум» в ленте. */}
      <div className="space-y-2 p-4">
        <p className="line-clamp-2 font-display text-sm font-bold leading-snug text-ink">
          {order.serviceName}
        </p>

        <div className="flex items-center gap-2">
          <Chip size="sm">{order.subcategory}</Chip>
        </div>

        <div className="flex items-center gap-3 text-xs text-ink-soft">
          <span className="flex items-center gap-1">
            <MapPin size={13} /> {order.distanceKm?.toFixed(1) ?? "—"} км
          </span>
          <span className="flex items-center gap-1">
            <Clock size={13} /> {formatDeadline(order.deadlineDays)}
          </span>
        </div>

        <div className="flex items-center gap-3 border-t border-line pt-2 text-xs text-ink-faint">
          <span className="font-medium text-ink-soft">
            {order.areaOver1000 ? "более 1000 м²" : `${formatNumber(order.areaSqm)} м²`}
          </span>
          <span className="ml-auto flex items-center gap-2">
            <span className="flex items-center gap-1">
              <ImageIcon size={12} /> {order.media.length}
            </span>
            {order.documents.length > 0 && (
              <span className="flex items-center gap-1">
                <FileText size={12} /> {order.documents.length}
              </span>
            )}
          </span>
        </div>
      </div>
    </Link>
  );
}
