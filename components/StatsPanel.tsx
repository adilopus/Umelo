"use client";

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { Eye, MessageCircle, ThumbsUp } from "lucide-react";
import { useAppStore } from "@/lib/store";
import { Order } from "@/lib/types";
import { buildAuthorRanking, authorRankLabel } from "@/lib/ranking";

const STATUS_LABELS: Record<Order["status"], string> = {
  open: "Ищем мастера",
  matched: "В работе",
  cancelled: "Отменён",
  closed: "Завершён",
};
const STATUS_COLORS: Record<Order["status"], string> = {
  open: "#FF6B1A",
  matched: "#1F8A55",
  cancelled: "#DC2626",
  closed: "#A6A9B0",
};

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-xl border border-line p-3 text-center">
      <p className="font-display text-xl font-extrabold text-ink">{value}</p>
      <p className="text-[11px] text-ink-soft">{label}</p>
    </div>
  );
}

/** Статистика для Заказчика: свои заказы по статусам + просмотры + чаты. */
function CustomerStats() {
  const orders = useAppStore((s) => s.orders);
  const byStatus = (["open", "matched", "cancelled", "closed"] as Order["status"][]).map(
    (status) => ({
      status,
      label: STATUS_LABELS[status],
      count: orders.filter((o) => o.status === status).length,
      color: STATUS_COLORS[status],
    })
  );
  const totalViews = orders.reduce((s, o) => s + (Number.isFinite(o.views) ? o.views : 0), 0);
  const chatsCount = orders.filter((o) => o.status === "matched").length;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-2">
        <StatCard label="Всего заказов" value={orders.length} />
        <StatCard label="Просмотров" value={totalViews} />
        <StatCard label="Активных чатов" value={chatsCount} />
      </div>
      <div>
        <p className="mb-2 text-xs font-semibold text-ink-soft">Заказы по статусам</p>
        <div className="h-48 rounded-xl border border-line p-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={byStatus}>
              <XAxis dataKey="label" tick={{ fontSize: 11 }} interval={0} />
              <YAxis allowDecimals={false} tick={{ fontSize: 11 }} width={24} />
              <Tooltip />
              <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                {byStatus.map((d) => (
                  <Cell key={d.status} fill={d.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="space-y-1.5">
        {byStatus.map((d) => (
          <div key={d.status} className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-2 text-ink-soft">
              <span
                className="h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: d.color }}
              />
              {d.label}
            </span>
            <span className="font-semibold text-ink">{d.count}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/** Статистика для Исполнителя: заказы, на которые откликнулся, по статусам. */
function MasterStats() {
  const orders = useAppStore((s) => s.orders);
  const responses = useAppStore((s) => s.responses);
  const respondedIds = new Set(responses.map((r) => r.orderId));
  const myOrders = orders.filter((o) => respondedIds.has(o.id));

  const byStatus = (["open", "matched", "cancelled", "closed"] as Order["status"][]).map(
    (status) => ({
      status,
      label: STATUS_LABELS[status],
      count: myOrders.filter((o) => o.status === status).length,
      color: STATUS_COLORS[status],
    })
  );
  const totalViews = myOrders.reduce((s, o) => s + (Number.isFinite(o.views) ? o.views : 0), 0);
  const chatsCount = myOrders.filter((o) => o.status === "matched").length;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-2">
        <StatCard label="Откликов подано" value={responses.length} />
        <StatCard label="Просмотров заказов" value={totalViews} />
        <StatCard label="Активных чатов" value={chatsCount} />
      </div>
      <div>
        <p className="mb-2 text-xs font-semibold text-ink-soft">Мои заказы по статусам</p>
        <div className="h-48 rounded-xl border border-line p-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={byStatus}>
              <XAxis dataKey="label" tick={{ fontSize: 11 }} interval={0} />
              <YAxis allowDecimals={false} tick={{ fontSize: 11 }} width={24} />
              <Tooltip />
              <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                {byStatus.map((d) => (
                  <Cell key={d.status} fill={d.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

const BLOGGER_NAME = "Вы (блогер)";

/** Статистика для Блогера: контент, просмотры, рейтинг среди авторов. */
function BloggerStats() {
  const articles = useAppStore((s) => s.articles);
  const myContent = articles.filter((a) => a.authorName === BLOGGER_NAME);
  const totalViews = myContent.reduce((s, a) => s + (Number.isFinite(a.views) ? a.views : 0), 0);
  const totalLikes = myContent.reduce((s, a) => s + (Number.isFinite(a.likes) ? a.likes : 0), 0);

  const ranking = buildAuthorRanking(articles);
  const myRank = ranking.find((r) => r.authorName === BLOGGER_NAME)?.rank;

  const byItem = myContent
    .slice()
    .sort((a, b) => b.views - a.views)
    .slice(0, 6)
    .map((a) => ({ name: a.title.slice(0, 14) + (a.title.length > 14 ? "…" : ""), views: a.views }));

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-2">
        <StatCard label="Материалов" value={myContent.length} />
        <StatCard label="Просмотров" value={totalViews} />
        <StatCard label="Лайков" value={totalLikes} />
      </div>
      <div className="rounded-xl border border-line p-3">
        <p className="flex items-center gap-1.5 text-xs font-semibold text-ink-soft">
          <ThumbsUp size={13} /> Рейтинг среди авторов
        </p>
        <p className="mt-1 font-display text-lg font-extrabold text-accent">
          {authorRankLabel(myRank)}
        </p>
        <p className="text-[11px] text-ink-faint">
          Считается по сумме лайков и просмотров всех ваших материалов.
        </p>
      </div>
      {byItem.length > 0 && (
        <div>
          <p className="mb-2 text-xs font-semibold text-ink-soft">Просмотры по материалам</p>
          <div className="h-48 rounded-xl border border-line p-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={byItem}>
                <XAxis dataKey="name" tick={{ fontSize: 10 }} interval={0} angle={-20} textAnchor="end" height={50} />
                <YAxis allowDecimals={false} tick={{ fontSize: 11 }} width={24} />
                <Tooltip />
                <Bar dataKey="views" fill="#FF6B1A" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}

const SELLER_NAME = "Вы (продавец)";

/** Статистика для Продавца: анонсы, просмотры, переходы по ссылкам. */
function SellerStats() {
  const articles = useAppStore((s) => s.articles);
  const myAds = articles.filter((a) => a.authorName === SELLER_NAME);
  const totalViews = myAds.reduce((s, a) => s + (Number.isFinite(a.views) ? a.views : 0), 0);
  const totalClicks = myAds.reduce((s, a) => s + (Number.isFinite(a.clicks) ? a.clicks : 0), 0);

  const byItem = myAds
    .slice()
    .sort((a, b) => b.views - a.views)
    .slice(0, 6)
    .map((a) => ({
      name: a.title.slice(0, 14) + (a.title.length > 14 ? "…" : ""),
      views: a.views,
      clicks: a.clicks,
    }));

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-2">
        <StatCard label="Анонсов" value={myAds.length} />
        <StatCard label="Просмотров" value={totalViews} />
        <StatCard label="Переходов" value={totalClicks} />
      </div>
      {byItem.length > 0 && (
        <div>
          <p className="mb-2 text-xs font-semibold text-ink-soft">Просмотры и переходы по анонсам</p>
          <div className="h-48 rounded-xl border border-line p-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={byItem}>
                <XAxis dataKey="name" tick={{ fontSize: 10 }} interval={0} angle={-20} textAnchor="end" height={50} />
                <YAxis allowDecimals={false} tick={{ fontSize: 11 }} width={24} />
                <Tooltip />
                <Bar dataKey="views" fill="#1F8A55" radius={[6, 6, 0, 0]} name="Просмотры" />
                <Bar dataKey="clicks" fill="#FF6B1A" radius={[6, 6, 0, 0]} name="Переходы" />
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
  if (role === "master") return <MasterStats />;
  if (role === "blogger") return <BloggerStats />;
  if (role === "seller") return <SellerStats />;
  return <CustomerStats />;
}
