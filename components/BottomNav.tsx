"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, ListChecks, MessageCircle, Plus, User } from "lucide-react";
import { useAppStore } from "@/lib/store";
import { myOrdersTabLabel, myOrdersTabHref } from "@/lib/format";

export function BottomNav() {
  const pathname = usePathname();
  const role = useAppStore((s) => s.role);

  const TABS = [
    { href: "/feed", label: "Лента", icon: Home },
    { href: myOrdersTabHref(role), label: myOrdersTabLabel(role), icon: ListChecks },
    { href: "/create", label: "Создать", icon: Plus, create: true },
    { href: "/chats", label: "Чаты", icon: MessageCircle },
    { href: "/profile", label: "Профиль", icon: User },
  ];

  return (
    <nav className="sticky bottom-0 z-20 border-t border-line bg-paper/95 backdrop-blur lg:hidden">
      <div className="grid grid-cols-5 items-end px-1">
        {TABS.map(({ href, label, icon: Icon, create }) => {
          const active = pathname === href || (!create && pathname.startsWith(`${href}/`));
          if (create) {
            return (
              <Link key={href} href={href} className="flex flex-col items-center gap-1 py-1.5 text-xs font-bold text-ink-soft">
                <span className="-mt-5 flex h-12 w-12 items-center justify-center rounded-full bg-accent text-ink shadow-pop ring-4 ring-paper">
                  <Icon size={22} strokeWidth={2.8} />
                </span>
                <span>{label}</span>
              </Link>
            );
          }
          return (
            <Link key={href} href={href} className="flex flex-col items-center gap-1 py-2.5 text-xs">
              <Icon size={21} strokeWidth={active ? 2.5 : 1.8} className={active ? "text-accent-ink" : "text-ink-faint"} />
              <span className={active ? "font-semibold text-ink" : "text-ink-faint"}>{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
