"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  Article,
  ChatMessage,
  Order,
  Response,
  Role,
  AdminUser,
  PersonalData,
  WorkOffer,
  OfferStatus,
  Specialist,
  PortfolioItem,
  SpecialistReview,
  MasterProfile,
} from "./types";
import { SEED_ORDERS } from "./mockData";
import { SEED_ARTICLES } from "./mockArticles";
import { SEED_USERS } from "./mockUsers";
import {
  SEED_SPECIALISTS,
  SEED_PORTFOLIO,
  SEED_SPECIALIST_REVIEWS,
  SPECIALIST_ME,
} from "./mockSpecialists";

export type { Role };

export const FREE_RESPONSES_PER_DAY = 3;

interface AppState {
  role: Role;
  // Администратор — скрытая роль, не показывается в обычном переключателе,
  // пока пользователь не разблокирует её секретным жестом (см. профиль).
  adminUnlocked: boolean;

  // Мок-авторизация: в демо без бэкенда это просто локальный флаг + имя,
  // но интерфейс (форма входа/регистрации в Профиле) настоящий.
  isAuthenticated: boolean;
  authName: string;
  login: (name: string) => void;
  logout: () => void;

  personalData: PersonalData;
  updatePersonalData: (patch: Partial<PersonalData>) => void;

  orders: Order[];
  messages: ChatMessage[];
  responses: Response[];
  offers: WorkOffer[];
  articles: Article[];
  users: AdminUser[];

  // Каталог специалистов + их работы и отзывы. Портфолио текущего мастера
  // (SPECIALIST_ME) живёт в том же массиве portfolio — единый источник.
  specialists: Specialist[];
  portfolio: PortfolioItem[];
  specialistReviews: SpecialistReview[];
  likedPortfolioIds: string[];
  // Профессиональная анкета текущего мастера (роль «Исполнитель»).
  masterProfile: MasterProfile;
  updateMasterProfile: (patch: Partial<MasterProfile>) => void;
  addPortfolioItem: (item: PortfolioItem) => void;
  updatePortfolioItem: (itemId: string, patch: Partial<PortfolioItem>) => void;
  deletePortfolioItem: (itemId: string) => void;
  incrementPortfolioViews: (itemId: string) => void;
  togglePortfolioLike: (itemId: string) => void;
  addSpecialistReview: (review: SpecialistReview) => void;
  incrementSpecialistViews: (specialistId: string) => void;

  // Избранное — общее для всех ролей: сохранённые статьи/новости/реклама.
  favoriteArticleIds: string[];
  toggleFavorite: (articleId: string) => void;
  // Лайки — отдельно от избранного: влияют на рейтинг автора у блогера.
  likedArticleIds: string[];
  toggleLike: (articleId: string) => void;

  // Экономика билетов/подписки
  ticketsBalance: number;
  subscriptionActive: boolean;
  freeResponses: { date: string; count: number };

  setRole: (role: Role) => void;
  unlockAdmin: () => void;

  addOrder: (order: Order) => void;
  addResponse: (response: Response) => void;
  sendOffer: (orderId: string, specialistName: string) => void;
  updateOfferStatus: (offerId: string, status: OfferStatus) => void;
  acceptOffer: (offerId: string) => void;
  matchOrder: (orderId: string) => void;
  cancelOrder: (orderId: string) => void;
  deleteOrder: (orderId: string) => void;
  incrementViews: (orderId: string) => void;
  addMessage: (message: ChatMessage) => void;

  spendTicket: () => boolean;
  addTickets: (amount: number) => void;
  toggleSubscription: () => void;
  useFreeResponseOrTicket: () => "free" | "ticket" | "blocked";

  addArticle: (article: Article) => void;
  deleteArticle: (articleId: string) => void;
  setArticlePromoted: (articleId: string, promoted: boolean) => void;
  incrementArticleViews: (articleId: string) => void;
  incrementArticleClicks: (articleId: string) => void;

  banUser: (userId: string) => void;
  unbanUser: (userId: string) => void;
  deleteUser: (userId: string) => void;

  /** id уже показанных уведомлений — по ним считается счётчик у колокольчика. */
  readNotificationIds: string[];
  markNotificationsRead: (ids: string[]) => void;
}

/**
 * Фото/видео/документы заказов хранятся как base64 прямо в localStorage —
 * это удобно для демо без бэкенда, но легко упирается в квоту браузера
 * (обычно 5–10 МБ на домен). Этот адаптер вместо немедленного падения
 * приложения сначала пытается освободить место, срезая вложения у старых
 * заказов (оставляя недавние 3 нетронутыми), и только если это не помогло —
 * пробрасывает ошибку дальше, чтобы экран публикации показал понятное
 * сообщение вместо краша всего приложения.
 */
const rawLocalStorage = {
  getItem: (name: string) => localStorage.getItem(name),
  removeItem: (name: string) => localStorage.removeItem(name),
  setItem: (name: string, value: string) => {
    try {
      localStorage.setItem(name, value);
      return;
    } catch (err) {
      try {
        const parsed = JSON.parse(value);
        const orders = parsed?.state?.orders;
        if (Array.isArray(orders)) {
          parsed.state.orders = orders.map((o: Order, idx: number) =>
            idx < 3 ? o : { ...o, media: [], documents: [] }
          );
          localStorage.setItem(name, JSON.stringify(parsed));
          return;
        }
      } catch {
        // не удалось распарсить/сократить — пробрасываем исходную ошибку ниже
      }
      throw err;
    }
  },
};

function todayKey(): string {
  return new Date().toDateString();
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      role: "customer",
      adminUnlocked: false,

      isAuthenticated: false,
      authName: "",
      login: (name) => set({ isAuthenticated: true, authName: name }),
      logout: () => set({ isAuthenticated: false, authName: "" }),

      personalData: {
        nickname: "",
        fullName: "",
        email: "",
        phone: "",
        birthDate: "",
        city: "",
        vk: "",
        telegram: "",
        whatsapp: "",
        bio: "",
      },
      updatePersonalData: (patch) =>
        set((state) => {
          const personalData = { ...state.personalData, ...patch };
          return {
            personalData,
            // Никнейм из «Моих данных» — это же имя в каталоге специалистов
            // для роли «Исполнитель».
            specialists: personalData.nickname.trim()
              ? state.specialists.map((s) =>
                  s.id === SPECIALIST_ME ? { ...s, name: personalData.nickname.trim() } : s
                )
              : state.specialists,
          };
        }),

      orders: SEED_ORDERS,
      messages: [],
      responses: [],
      offers: [],
      articles: SEED_ARTICLES,
      users: SEED_USERS,

      specialists: SEED_SPECIALISTS,
      portfolio: SEED_PORTFOLIO,
      specialistReviews: SEED_SPECIALIST_REVIEWS,
      likedPortfolioIds: [],
      masterProfile: {
        profession: "",
        services: [],
        skills: [],
        experienceYears: 0,
        priceFrom: "",
        verified: false,
      },
      updateMasterProfile: (patch) =>
        set((state) => {
          const masterProfile = { ...state.masterProfile, ...patch };
          return {
            masterProfile,
            // Анкета и карточка в каталоге «Специалисты» — один и тот же
            // человек, поэтому правим обе записи: иначе мастер наполняет
            // портфолио, а в каталоге у него пустая витрина.
            specialists: state.specialists.map((s) =>
              s.id !== SPECIALIST_ME
                ? s
                : {
                    ...s,
                    name: state.personalData.nickname.trim() || s.name,
                    profession: masterProfile.profession || s.profession,
                    services: masterProfile.services.length ? masterProfile.services : s.services,
                    skills: masterProfile.skills.length ? masterProfile.skills : s.skills,
                    experienceYears: masterProfile.experienceYears || s.experienceYears,
                    verified: masterProfile.verified,
                  }
            ),
          };
        }),
      addPortfolioItem: (item) =>
        set((state) => ({
          portfolio: [item, ...state.portfolio],
          specialists: state.specialists.map((s) =>
            s.id === item.specialistId ? { ...s, projectsCount: s.projectsCount + 1 } : s
          ),
        })),
      updatePortfolioItem: (itemId, patch) =>
        set((state) => ({
          portfolio: state.portfolio.map((p) => (p.id === itemId ? { ...p, ...patch } : p)),
        })),
      deletePortfolioItem: (itemId) =>
        set((state) => {
          const removed = state.portfolio.find((p) => p.id === itemId);
          return {
            portfolio: state.portfolio.filter((p) => p.id !== itemId),
            specialists: removed
              ? state.specialists.map((s) =>
                  s.id === removed.specialistId
                    ? { ...s, projectsCount: Math.max(0, s.projectsCount - 1) }
                    : s
                )
              : state.specialists,
          };
        }),
      incrementPortfolioViews: (itemId) =>
        set((state) => ({
          portfolio: state.portfolio.map((p) =>
            p.id === itemId ? { ...p, views: (Number.isFinite(p.views) ? p.views : 0) + 1 } : p
          ),
        })),
      togglePortfolioLike: (itemId) =>
        set((state) => {
          const already = state.likedPortfolioIds.includes(itemId);
          return {
            likedPortfolioIds: already
              ? state.likedPortfolioIds.filter((id) => id !== itemId)
              : [...state.likedPortfolioIds, itemId],
            portfolio: state.portfolio.map((p) =>
              p.id === itemId
                ? { ...p, likes: (Number.isFinite(p.likes) ? p.likes : 0) + (already ? -1 : 1) }
                : p
            ),
          };
        }),
      // Отзыв добавляется мгновенно и пересчитывает агрегат рейтинга
      // средневзвешенно — профиль не расходится со списком отзывов.
      addSpecialistReview: (review) =>
        set((state) => ({
          specialistReviews: [review, ...state.specialistReviews],
          specialists: state.specialists.map((s) => {
            if (s.id !== review.specialistId) return s;
            const count = Number.isFinite(s.reviewsCount) ? s.reviewsCount : 0;
            const rating = Number.isFinite(s.rating) ? s.rating : 0;
            const nextCount = count + 1;
            return {
              ...s,
              reviewsCount: nextCount,
              rating: Math.round(((rating * count + review.rating) / nextCount) * 10) / 10,
            };
          }),
        })),
      incrementSpecialistViews: (specialistId) =>
        set((state) => ({
          specialists: state.specialists.map((s) =>
            s.id === specialistId
              ? { ...s, views: (Number.isFinite(s.views) ? s.views : 0) + 1 }
              : s
          ),
        })),

      favoriteArticleIds: [],
      toggleFavorite: (articleId) =>
        set((state) => ({
          favoriteArticleIds: state.favoriteArticleIds.includes(articleId)
            ? state.favoriteArticleIds.filter((id) => id !== articleId)
            : [...state.favoriteArticleIds, articleId],
        })),
      likedArticleIds: [],
      toggleLike: (articleId) =>
        set((state) => {
          const already = state.likedArticleIds.includes(articleId);
          return {
            likedArticleIds: already
              ? state.likedArticleIds.filter((id) => id !== articleId)
              : [...state.likedArticleIds, articleId],
            articles: state.articles.map((a) =>
              a.id === articleId
                ? {
                    ...a,
                    likes:
                      (Number.isFinite(a.likes) ? a.likes : 0) + (already ? -1 : 1),
                  }
                : a
            ),
          };
        }),

      ticketsBalance: 5,
      subscriptionActive: false,
      freeResponses: { date: "", count: 0 },
      readNotificationIds: [],

      setRole: (role) => set({ role }),
      unlockAdmin: () => set({ adminUnlocked: true }),
      // Храним только id: сами уведомления выводятся из заказов, откликов,
      // предложений и сообщений, поэтому синхронизировать их не нужно.
      markNotificationsRead: (ids) =>
        set((state) => ({
          readNotificationIds: [...new Set([...state.readNotificationIds, ...ids])].slice(-200),
        })),

      addOrder: (order) => set((state) => ({ orders: [order, ...state.orders] })),
      addResponse: (response) =>
        set((state) => ({ responses: [...state.responses, response] })),
      sendOffer: (orderId, specialistName) =>
        set((state) => {
          const existing = state.offers.find(
            (offer) => offer.orderId === orderId && offer.specialistName === specialistName &&
              (offer.status === "pending" || offer.status === "snoozed")
          );
          if (existing) return state;
          return {
            offers: [
              ...state.offers,
              {
                id: `offer-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
                orderId,
                specialistName,
                status: "pending",
                createdAt: Date.now(),
              },
            ],
          };
        }),
      updateOfferStatus: (offerId, status) =>
        set((state) => ({
          offers: state.offers.map((offer) =>
            offer.id === offerId ? { ...offer, status } : offer
          ),
        })),
      acceptOffer: (offerId) =>
        set((state) => {
          const accepted = state.offers.find((offer) => offer.id === offerId);
          if (!accepted) return state;
          return {
            offers: state.offers.map((offer) =>
              offer.id === offerId
                ? { ...offer, status: "accepted" }
                : offer.orderId === accepted.orderId && offer.status === "pending"
                  ? { ...offer, status: "cancelled" }
                  : offer
            ),
            orders: state.orders.map((order) =>
              order.id === accepted.orderId ? { ...order, status: "matched" } : order
            ),
          };
        }),
      matchOrder: (orderId) =>
        set((state) => ({
          orders: state.orders.map((o) =>
            o.id === orderId ? { ...o, status: "matched" } : o
          ),
        })),
      cancelOrder: (orderId) =>
        set((state) => ({
          orders: state.orders.map((o) =>
            o.id === orderId ? { ...o, status: "cancelled" } : o
          ),
        })),
      deleteOrder: (orderId) =>
        set((state) => ({ orders: state.orders.filter((o) => o.id !== orderId) })),
      incrementViews: (orderId) =>
        set((state) => ({
          orders: state.orders.map((o) =>
            o.id === orderId
              ? { ...o, views: (Number.isFinite(o.views) ? o.views : 0) + 1 }
              : o
          ),
        })),
      addMessage: (message) =>
        set((state) => ({ messages: [...state.messages, message] })),

      spendTicket: () => {
        const state = get();
        if (state.subscriptionActive) return true;
        if (state.ticketsBalance <= 0) return false;
        set({ ticketsBalance: state.ticketsBalance - 1 });
        return true;
      },
      addTickets: (amount) =>
        set((state) => ({ ticketsBalance: state.ticketsBalance + amount })),
      toggleSubscription: () =>
        set((state) => ({ subscriptionActive: !state.subscriptionActive })),

      // Возвращает, как был потрачен ресурс на отклик мастера:
      // "free" — использован бесплатный отклик дня, "ticket" — списан билет,
      // "blocked" — ни бесплатных откликов, ни билетов не осталось.
      useFreeResponseOrTicket: () => {
        const state = get();
        const today = todayKey();
        const usedToday = state.freeResponses.date === today ? state.freeResponses.count : 0;

        if (usedToday < FREE_RESPONSES_PER_DAY) {
          set({ freeResponses: { date: today, count: usedToday + 1 } });
          return "free";
        }
        if (state.subscriptionActive || state.ticketsBalance > 0) {
          if (!state.subscriptionActive) {
            set({ ticketsBalance: state.ticketsBalance - 1 });
          }
          return "ticket";
        }
        return "blocked";
      },

      addArticle: (article) =>
        set((state) => ({ articles: [article, ...state.articles] })),
      deleteArticle: (articleId) =>
        set((state) => ({ articles: state.articles.filter((a) => a.id !== articleId) })),
      setArticlePromoted: (articleId, promoted) =>
        set((state) => ({
          articles: state.articles.map((a) =>
            a.id === articleId ? { ...a, promoted } : a
          ),
        })),
      incrementArticleViews: (articleId) =>
        set((state) => ({
          articles: state.articles.map((a) =>
            a.id === articleId
              ? { ...a, views: (Number.isFinite(a.views) ? a.views : 0) + 1 }
              : a
          ),
        })),
      incrementArticleClicks: (articleId) =>
        set((state) => ({
          articles: state.articles.map((a) =>
            a.id === articleId
              ? { ...a, clicks: (Number.isFinite(a.clicks) ? a.clicks : 0) + 1 }
              : a
          ),
        })),

      banUser: (userId) =>
        set((state) => ({
          users: state.users.map((u) =>
            u.id === userId ? { ...u, status: "banned" } : u
          ),
        })),
      unbanUser: (userId) =>
        set((state) => ({
          users: state.users.map((u) =>
            u.id === userId ? { ...u, status: "active" } : u
          ),
        })),
      deleteUser: (userId) =>
        set((state) => ({ users: state.users.filter((u) => u.id !== userId) })),
    }),
    {
      name: "umelo-storage",
      version: 7,
      storage: {
        getItem: (name) => {
          const value = rawLocalStorage.getItem(name);
          return value ? JSON.parse(value) : null;
        },
        setItem: (name, value) => rawLocalStorage.setItem(name, JSON.stringify(value)),
        removeItem: (name) => rawLocalStorage.removeItem(name),
      },
      migrate: (persisted) => {
        const old = (persisted ?? {}) as Partial<AppState>;
        const next = {
          role: (old.role ?? "customer") as Role,
          readNotificationIds: old.readNotificationIds ?? [],
          adminUnlocked: old.adminUnlocked ?? false,
          isAuthenticated: old.isAuthenticated ?? false,
          authName: old.authName ?? "",
          personalData: {
            nickname: old.personalData?.nickname ?? "",
            fullName: old.personalData?.fullName ?? "",
            email: old.personalData?.email ?? "",
            phone: old.personalData?.phone ?? "",
            birthDate: old.personalData?.birthDate ?? "",
            city: old.personalData?.city ?? "",
            vk: old.personalData?.vk ?? "",
            telegram: old.personalData?.telegram ?? "",
            whatsapp: old.personalData?.whatsapp ?? "",
            bio: old.personalData?.bio ?? "",
          },
          orders: old.orders ?? SEED_ORDERS,
          messages: old.messages ?? [],
          responses: old.responses ?? [],
          offers: old.offers ?? [],
          articles: SEED_ARTICLES,
          users: old.users ?? SEED_USERS,
          specialists: SEED_SPECIALISTS,
          portfolio: SEED_PORTFOLIO,
          specialistReviews: SEED_SPECIALIST_REVIEWS,
          likedPortfolioIds: old.likedPortfolioIds ?? [],
          masterProfile: {
            profession: old.masterProfile?.profession ?? "",
            services: old.masterProfile?.services ?? [],
            skills: old.masterProfile?.skills ?? [],
            experienceYears: old.masterProfile?.experienceYears ?? 0,
            priceFrom: old.masterProfile?.priceFrom ?? "",
            verified: old.masterProfile?.verified ?? false,
          },
          favoriteArticleIds: old.favoriteArticleIds ?? [],
          likedArticleIds: old.likedArticleIds ?? [],
          ticketsBalance: old.ticketsBalance ?? 5,
          subscriptionActive: old.subscriptionActive ?? false,
          freeResponses: old.freeResponses ?? { date: "", count: 0 },
        };
        return next as unknown as AppState;
      },
    }
  )
);
