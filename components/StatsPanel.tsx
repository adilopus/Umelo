"use client";

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { ThumbsUp } from "lucide-react";
import { useAppStore } from "@/lib/store";
import { Order } from "@/lib/types";
import { buildAuthorRanking, authorRankLabel } from "@/lib/ranking";
import { STATUS_META } from "@/lib/status";
import { CONTENT_ROLES, contentAuthorName, type ContentRole } from "@/lib/contentRoles";
import { Stat } from "@/components/ui/Stat";

const STATUS_ORDER: Order["status"][] = ["open", "matched", "cancelled", "closed"];

/** Цвета диаграммы берём из палитры — раньше здесь жил оранжевый #FF6B1A. */
const STATUS_COLORS: Record<Order["status"], string> = {
  open: "#F5C400",
  matched: "#1F8A55",
  cancelled: "#C93B3B",
  closed: "#A6A9B0",
};

function StatusChart({
  title,
  counts,
}: {
  title: string;
  counts: Record<Order["status"], number>;
}) {
  const data = STATUS_ORDER.map((status) => ({
    status,
    label: STATUS_META[status].label,    count: counts[status],
    color: STATUS_COLORS[status],
  }));

  return (
    <>
      <div>
        <p className="mb-2 text-xs font-semibold text-ink-soft">{title}</p>
        <div className="h-48 rounded-xl border border-line p-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <XAxis dataKey="label" tick={{ fontSize: 11 }} interval={0} />
              <YAxis allowDecimals={false} tick={{ fontSize: 11 }} width={24} />
              <Tooltip />
              <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                {data.map((d) => (
                  <Cell key={d.status} fill={d.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="space-y-1.5">
        {data.map((d) => (
          <div key={d.status} className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-2 text-ink-soft">
              <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: d.color }} />
              {d.label}
            </span>
            <span className="font-semibold text-ink">{d.count}</span>
          </div>
        ))}
      </div>
    </>
  );
}

function countByStatus(orders: Order[]) {
  return STATUS_ORDER.reduce(
    (acc, status) => {
      acc[status] = orders.filter((o) => o.status === status).length;
      return acc;
    },
    {} as Record<Order["status"], number>
  );
}

/** Статистика заказов. Заказчик и Исполнитель отличались только подписями
 * трёх плиток и заголовком графика — оба собраны из одного компонента. */
function OrderStats({ master }: { master: boolean }) {
  const orders = useAppStore((s) => s.orders);
  const responses = useAppStore((s) => s.responses);

  const mine = master
    ? orders.filter((o) => responses.some((r) => r.orderId === o.id))
    : orders;

  const totalViews = mine.reduce((s, o) => s + (Number.isFinite(o.views) ? o.views : 0), 0);
  const chatsCount = mine.filter((o) => o.status === "matched").length;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-2">
        {master ? (
          <>
            <Stat label="Откликов подано" value={responses.length} />
            <Stat label="Просмотров" value={totalViews} />
            <Stat label="Активных чатов" value={chatsCount} />
          </>
        ) : (
          <>
            <Stat label="Всего заказов" value={orders.length} />
            <Stat label="Просмотров" value={totalViews} />
            <Stat label="Активных чатов" value={chatsCount} />
          </>
        )}
      </div>
      <StatusChart
        title={master ? "Мои заказы по статусам" : "Заказы по статусам"}
        counts={countByStatus(mine)}
      />
    </div>
  );
}

const CHART_AXIS = { tick: { fontSize: 11 }, width: 24 } as const;
const CHART_TILTED = { tick: { fontSize: 10 }, interval: 0 as const, angle: -20, textAnchor: "end" as const, height: 50 };

/** Статистика публикаций. Блогер и продавец отличались только набором
 * метрик и подписью — раньше это были два почти одинаковых компонента. */
function ContentStats({ role }: { role: ContentRole }) {
  const cfg = CONTENT_ROLES[role];
  const articles = useAppStore((s) => s.articles);

  const mine = articles.filter((a) => a.authorName === contentAuthorName(role));
  const totalViews = mine.reduce((s, a) => s + (Number.isFinite(a.views) ? a.views : 0), 0);
  const secondary = mine.reduce(
    (s, a) => s + (Number.isFinite(cfg.trackClicks ? a.clicks : a.likes) ? (cfg.trackClicks ? a.clicks : a.likes) : 0),
    0
  );

  const ranking = buildAuthorRanking(articles);
  const myRank = ranking.find((r) => r.authorName === contentAuthorName(role))?.rank;

  const byItem = mine
    .slice()
    .sort((a, b) => b.views - a.views)
    .slice(0, 6)
    .map((a) => ({
      name: a.title.slice(0, 14) + (a.title.length > 14 ? "…" : ""),
      views: a.views,
      ...(cfg.trackClicks ? { clicks: a.clicks } : {}),
    }));

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-2">
        <Stat label={cfg.trackClicks ? "Анонсов" : "Публикаций"} value={mine.length} />
        <Stat label="Просмотров" value={totalViews} />
        <Stat label={cfg.trackClicks ? "Переходов" : "Лайков"} value={secondary} />
      </div>

      {!cfg.trackClicks && (
        <div className="rounded-xl border border-line p-3">
          <p className="flex items-center gap-1.5 text-xs font-semibold text-ink-soft">
            <ThumbsUp size={13} /> Место среди авторов
          </p>
          <p className="mt-1 font-display text-lg font-extrabold text-accent-ink">
            {authorRankLabel(myRank)}
          </p>
          <p className="mt-0.5 text-xs leading-relaxed text-ink-faint">
            Рейтинг строится по просмотрам и лайкам: больше внимания авторам
            с вовлечённой аудиторией.
          </p>
        </div>
      )}

      {byItem.length > 0 && (
        <div>
          <p className="mb-2 text-xs font-semibold text-ink-soft">
            {cfg.trackClicks ? "Просмотры и переходы по анонсам" : "Просмотры по публикациям"}
          </p>
          <div className="h-48 rounded-xl border border-line p-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={byItem}>
                <XAxis dataKey="name" {...CHART_TILTED} />
                <YAxis allowDecimals={false} {...CHART_AXIS} />
                <Tooltip />
                <Bar dataKey="views" fill="#F5C400" radius={[6, 6, 0, 0]} name="Просмотры" />
                {cfg.trackClicks && (
                  <Bar dataKey="clicks" fill="#1F8A55" radius={[6, 6, 0, 0]} name="Переходы" />
                )}
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}

export function StatsPanel() {
  const role = useAppStore((s) => s.role);
  if (role === "master") return <OrderStats master />;
  if (role === "blogger") return <ContentStats role="blogger" />;
  if (role === "seller") return <ContentStats role="seller" />;
  return <OrderStats master={false} />;
}
