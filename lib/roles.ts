import type { Role } from "./types";

/**
 * Единый источник подписей ролей.
 *
 * Раньше список жил только в app/profile/page.tsx, поэтому в личном кабинете
 * не было видно, под какой ролью человек работает: переключатель есть, а
 * текущее значение — нет. Подписи берутся отсюда и в переключателе, и в
 * кабинете, и в шапке.
 */
export interface RoleOption {
  id: Role;
  label: string;
  /** Короткое имя роли без личного местоимения — для бейджа. */
  short: string;
  /** Что человек делает в этой роли — расшифровка аббревиатуры в UI. */
  hint: string;
}

export const ROLE_OPTIONS: RoleOption[] = [
  { id: "customer", label: "Я заказчик", short: "Заказчик", hint: "Создаю заказы и выбираю исполнителя" },
  { id: "master", label: "Я исполнитель", short: "Исполнитель", hint: "Откликаюсь на заказы и веду портфолио" },
  { id: "blogger", label: "Я блогер", short: "Блогер", hint: "Публикую статьи и веду канал" },
  { id: "seller", label: "Я продавец", short: "Продавец", hint: "Размещаю товары и анонсы" },
  { id: "admin", label: "Администратор", short: "Администратор", hint: "Управляю площадкой" },
];

const BY_ID = new Map(ROLE_OPTIONS.map((r) => [r.id, r]));

export function roleOption(role: Role): RoleOption {
  return BY_ID.get(role) ?? ROLE_OPTIONS[0];
}

/** «Заказчик» */
export function roleLabel(role: Role): string {
  return roleOption(role).short;
}

/** «Создаю заказы и выбираю исполнителя» */
export function roleHint(role: Role): string {
  return roleOption(role).hint;
}
