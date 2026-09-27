import type { ArticleKind } from "./types";

/**
 * Единое описание «контентных» ролей. Раньше BloggerDashboard, SellerDashboard
 * и StatsPanel хранили свои копии имён авторов и стоимости продвижения —
 * при смене имени рассинхронизировались все три места сразу.
 */
export type ContentRole = "blogger" | "seller";

export interface ContentRoleConfig {
  authorName: string;
  /** Префикс id публикации */
  idPrefix: string;
  /** Заголовок формы публикации */
  formTitle: string;
  /** Кнопка публикации */
  publishLabel: string;
  /** Заголовок списка своих материалов */
  listTitle: string;
  emptyHint: string;
  /** Стоимость продвижения в билетах */
  promoteCost: number;
  /** Цвет обложки-заглушки */
  coverTint: string;
  /** Показывать переключатель «статья / видео» */
  allowVideo: boolean;
  /** Обязательность ссылки */
  linkRequired: boolean;
  linkLabel: string;
  linkPlaceholder: string;
  /** Показывать клики в списке и метриках */
  trackClicks: boolean;
}

export const CONTENT_ROLES: Record<ContentRole, ContentRoleConfig> = {
  blogger: {
    authorName: "Вы (блогер)",
    idPrefix: "art",
    formTitle: "Новый материал",
    publishLabel: "Опубликовать",
    listTitle: "Мой контент",
    emptyHint: "Вы ещё не опубликовали ни статьи, ни видео.",
    promoteCost: 3,
    coverTint: "#FFF4BF",
    allowVideo: true,
    linkRequired: false,
    linkLabel: "Ссылка на видео (YouTube/VK Video)",
    linkPlaceholder: "https://youtube.com/watch?v=…",
    trackClicks: false,
  },
  seller: {
    authorName: "Вы (продавец)",
    idPrefix: "promo",
    formTitle: "Новое объявление",
    publishLabel: "Опубликовать объявление",
    listTitle: "Мои анонсы",
    emptyHint: "Вы ещё не опубликовали ни одного объявления.",
    promoteCost: 3,
    coverTint: "#E7F5EC",
    allowVideo: false,
    linkRequired: true,
    linkLabel: "Ссылка (куда ведёт объявление)",
    linkPlaceholder: "https://example.com/your-offer",
    trackClicks: true,
  },
};

export const DEFAULT_PROMOTE_COST = 3;

/** Имя автора для роли — единая точка правды. */
export function contentAuthorName(role: ContentRole): string {
  return CONTENT_ROLES[role].authorName;
}

/** Тип публикации, который создаёт роль. */
export function contentKind(role: ContentRole): ArticleKind {
  return role === "seller" ? "promo" : "article";
}
