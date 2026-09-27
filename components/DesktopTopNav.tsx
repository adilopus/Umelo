"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Bell,
  ChevronDown,
  MapPin,
  MessageCircle,
  Plus,
  Search,
} from "lucide-react";
import { useAppStore } from "@/lib/store";
import { codesMatch } from "@/lib/orderCode";
import { myOrdersTabHref } from "@/lib/format";

export function DesktopTopNav() {
  const pathname = usePathname();
  const router = useRouter();
  const orders = useAppStore((s) => s.orders);
  const role = useAppStore((s) => s.role);
  const authName = useAppStore((s) => s.authName);

  const [searchValue, setSearchValue] = useState("");
  const [searchError, setSearchError] = useState(false);

  const baseNavLinks = [
    { href: "/feed", label: "Лента" },
    { href: "/projects", label: "Проекты" },
    // У исполнителя «Заказы» — каталог открытых заказов, у остальных — свои.
    { href: myOrdersTabHref(role), label: "Заказы" },
    { href: "/specialists", label: "Специалисты" },
    { href: "/shops", label: "Магазины" },
    { href: "/articles", label: "Журнал" },
    { href: "/community", label: "Сообщество" },
  ];
  const navLinks = role === "master"
    ? [...baseNavLinks.slice(0, 3), { href: "/offers", label: "Предложения" }, ...baseNavLinks.slice(3)]
    : baseNavLinks;

  function handleSearch() {
    if (!searchValue.trim()) return;
    const found = orders.find((o) => codesMatch(o.code, searchValue));
    if (found) {
      setSearchError(false);
      setSearchValue("");
      router.push(`/orders/${found.id}`);
    } else {
      setSearchError(true);
    }
  }

  return (
    <header className="sticky top-0 z-30 hidden border-b border-night-line bg-night text-white shadow-nav lg:block">
      <div className="mx-auto max-w-shell px-6">
        <div className="flex h-14 items-center gap-4">
          <Link href="/feed" className="flex shrink-0 items-center gap-2" aria-label="UMELO">
            <img src="/icons/logo-mark.png" alt="" className="h-8 w-8 object-contain" />
            <span className="font-display text-xl font-extrabold tracking-tight">UMELO</span>
          </Link>

          {/* Поиск живёт в первой строке. Раньше он стоял в одной строке с
              навигацией, и при 1024–1400px последние пункты меню (в том числе
              «Сообщество») физически уезжали под поле поиска: навигация не
              помещалась, а `overflow-hidden` молча их отрезал. */}
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" size={15} />
            <input
              value={searchValue}
              onChange={(e) => {
                setSearchValue(e.target.value);
                setSearchError(false);
              }}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              placeholder="Поиск по номеру заказа"
              className={`h-9 w-full rounded-full border bg-paper/10 pl-9 pr-3 text-xs text-white outline-none placeholder:text-white/35 focus:bg-paper/15 ${
                searchError ? "border-danger" : "border-paper/15"
              }`}
              aria-label="Поиск в UMELO"
            />
          </div>

          <div className="ml-auto flex shrink-0 items-center gap-2">
            <button className="relative flex h-9 w-9 items-center justify-center rounded-full text-white/70 hover:bg-paper/10 hover:text-white" aria-label="Уведомления">
              <Bell size={17} />
              <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-accent" />
            </button>
            <Link href="/chats" className="flex h-9 w-9 items-center justify-center rounded-full text-white/70 hover:bg-paper/10 hover:text-white" aria-label="Чаты">
              <MessageCircle size={17} />
            </Link>
            <Link href="/create" className="flex items-center gap-1.5 rounded-full bg-accent px-4 py-2 text-sm font-bold text-night transition hover:bg-accent-dark">
              <Plus size={15} strokeWidth={2.7} /> Создать
            </Link>
            <Link href="/profile" className="flex items-center gap-2 rounded-full py-1 pl-1.5 pr-1.5 transition hover:bg-paper/5">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-night-soft text-xs font-bold text-white">
                {(authName || "АП").slice(0, 2).toUpperCase()}
              </span>
              <span className="max-w-24 truncate text-xs text-white/80">{authName || "Профиль"}</span>
              <ChevronDown size={14} className="text-white/45" />
            </Link>
          </div>
        </div>

        <nav className="flex items-center gap-0.5 overflow-x-auto no-scrollbar">
          {navLinks.map((link) => {
            const active = pathname === link.href || pathname.startsWith(`${link.href}/`);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative shrink-0 whitespace-nowrap px-3 pb-2.5 pt-1 text-sm font-semibold transition ${
                  active ? "text-white" : "text-white/65 hover:bg-paper/5 hover:text-white"
                }`}
              >
                {link.label}
                {active && <span className="absolute inset-x-3 bottom-0 h-0.5 rounded-full bg-accent" />}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
