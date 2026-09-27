export type PremiseType = "new" | "secondary" | "commercial" | "country";
export type ConditionType = "rough" | "finished";
export type Role = "customer" | "master" | "blogger" | "seller" | "admin";

export interface JobCategoryEntry {
  category: string;
  subcategory: string;
  service_name: string;
  work_type: string;
  object_type: string;
}

export interface OrderMedia {
  id: string;
  dataUrl: string;
  isCover?: boolean;
}

export interface OrderDocument {
  id: string;
  name: string;
  dataUrl: string;
  sizeKb: number;
}

export interface Order {
  id: string;
  // Публичный номер заказа для поиска/связи (например XKPQ-48213) —
  // отдельно от внутреннего id, который используется для роутинга.
  code: string;
  category: string;
  subcategory: string;
  serviceName: string;

  areaSqm: number;
  areaOver1000: boolean;
  premise: PremiseType;
  condition: ConditionType;
  // Адрес объекта — заказы у одного заказчика могут быть по разным адресам,
  // мастеру и в списке заказчика важно видеть, куда именно ехать.
  address: string;

  // Бюджет за весь объём работ
  budgetMin: number;
  budgetMax: number;
  // Бюджет за м² (заполняется опционально — не для всех видов работ применимо)
  budgetPerSqmMin?: number;
  budgetPerSqmMax?: number;

  deadlineDays: number;

  description: string;
  media: OrderMedia[];
  documents: OrderDocument[];

  createdAt: number;
  authorRole: "customer";
  distanceKm?: number;
  // Счётчик просмотров карточки заказа (растёт при каждом заходе на страницу
  // заказа) — в реальном приложении считался бы на сервере с дедупликацией
  // по пользователю/сессии, здесь это упрощённая клиентская демонстрация.
  views: number;
  status: "open" | "matched" | "cancelled" | "closed";
}

export type OfferStatus = "pending" | "accepted" | "declined" | "snoozed" | "cancelled";

export interface WorkOffer {
  id: string;
  orderId: string;
  specialistName: string;
  status: OfferStatus;
  createdAt: number;
}

export interface ChatMessage {
  id: string;
  orderId: string;
  author: "customer" | "master";
  text: string;
  createdAt: number;
}

export interface Response {
  id: string;
  orderId: string;
  message: string;
  price: number;
  createdAt: number;
}

export type ArticleKind = "article" | "news" | "promo" | "video";

export interface Article {
  id: string;
  kind: ArticleKind;
  topic: string;
  title: string;
  excerpt: string;
  content: string;
  coverUrl: string;
  authorName: string;
  promoted: boolean;
  createdAt: number;
  // Счётчик просмотров карточки/детальной страницы — растёт при каждом
  // открытии, как и у заказов. Для рекламы (kind === "promo") дополнительно
  // считаем клики по ссылке отдельно от просмотров.
  views: number;
  clicks: number;
  // Лайки — для рейтинга блогера (место среди авторов по сумме лайков+просмотров).
  likes: number;
  // Для видео блогера — ссылка на ролик (YouTube/VK Video). Для рекламы
  // продавца — ссылка, куда ведёт объявление (переход по клику).
  linkUrl?: string;
}

export interface AdminUser {
  id: string;
  name: string;
  role: Role;
  status: "active" | "banned";
}

/**
 * Специалист каталога «Специалисты» — публичная карточка исполнителя.
 *
 * Отдельная сущность от `AdminUser` (это список пользователей для админки) и от
 * откликов/предложений: здесь хранится именно витрина профиля — специализация,
 * рейтинг, опыт, портфолио. В реальном приложении карточка собиралась бы из
 * аккаунта мастера + агрегатов (средний рейтинг, число отзывов), здесь —
 * самодостаточный демонстрационный объект.
 */
export interface Specialist {
  id: string;
  name: string;
  profession: string;
  city: string;
  distanceKm: number;
  // Агрегат рейтинга: пересчитывается при добавлении нового отзыва (см. стор),
  // чтобы профиль сразу отражал свежую оценку, а не жил отдельно от отзывов.
  rating: number;
  reviewsCount: number;
  projectsCount: number;
  experienceYears: number;
  bio: string;
  // Направления работ (например, «Сантехника», «Отопление»).
  services: string[];
  // Инструменты/навыки — то, чем мастер владеет и что показывает в профиле.
  skills: string[];
  // Подтверждённые документы/страховка/СРО — влияет на доверие в каталоге.
  verified: boolean;
  responseTime: string;
  avatarUrl: string;
  views: number;
  createdAt: number;
}

/**
 * Работа в портфолио специалиста (аналог Project у блогера, но с привязкой к
 * мастеру). Пользователь с ролью «Исполнитель» добавляет такие работы из
 * личного кабинета — они показываются в его профиле и в каталоге.
 */
export interface PortfolioItem {
  id: string;
  // id специалиста-владельца. Для работ текущего пользователя — SPECIALIST_ME.
  specialistId: string;
  title: string;
  category: string;
  description: string;
  coverUrl: string;
  images: string[];
  // Свободный текст «от 1 500 ₽/м²» — в демо не парсим в число.
  price?: string;
  durationDays?: number;
  // Работа помечена как выполненный проект (сдан заказчику) — в портфолио
  // такие показываем с меткой «Выполнено» и отдельно отмечаем год.
  completed?: boolean;
  year?: string;
  likes: number;
  views: number;
  createdAt: number;
}

export interface SpecialistReview {
  id: string;
  specialistId: string;
  authorName: string;
  // Оценка 1..5.
  rating: number;
  text: string;
  createdAt: number;
}

/**
 * Анкета текущего мастера — профессиональные поля, отдельно от общих
 * `PersonalData` (никнейм/контакты). Заполняется во вкладке кабинета и
 * определяет, как мастер выглядит для заказчиков.
 */
export interface MasterProfile {
  profession: string;
  services: string[];
  skills: string[];
  experienceYears: number;
  priceFrom: string;
  verified: boolean;
}

/**
 * Личные данные пользователя — общий раздел "Мои данные" в кабинете, не
 * зависит от роли. Все поля необязательны: заполняются постепенно.
 */
export interface PersonalData {
  avatarUrl?: string;
  nickname: string;
  fullName: string;
  email: string;
  phone: string;
  birthDate: string;
  city: string;
  vk: string;
  telegram: string;
  whatsapp: string;
  bio: string;
}
