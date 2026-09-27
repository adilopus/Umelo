import { AdminUser } from "./types";

// Демо-список: в реальном приложении приходил бы с бэкенда.
// Здесь нужен только для интерфейса админ-панели.
export const SEED_USERS: AdminUser[] = [
  { id: "u-1", name: "Анна К. (Заказчик)", role: "customer", status: "active" },
  { id: "u-2", name: "Игорь П. (Исполнитель)", role: "master", status: "active" },
  { id: "u-3", name: "Дмитрий Р. (Блогер)", role: "blogger", status: "active" },
  { id: "u-4", name: "Мария С. (Заказчик)", role: "customer", status: "active" },
  { id: "u-5", name: "Спам-аккаунт", role: "master", status: "banned" },
];
