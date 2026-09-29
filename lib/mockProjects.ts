/**
 * Проекты — общий источник для ленты и для /projects.
 *
 * Раньше каталог был захардкожен прямо в app/projects/page.tsx (4 записи без
 * дат), а лента рисовала одну большую статичную карточку. Карусели ленты
 * нуждаются в датах, чтобы выбирать «новые», и в количестве больше двух.
 */

export interface FeedProject {
  id: string;
  title: string;
  author: string;
  authorRole: string;
  location: string;
  /** Короткая метка раздела: Интерьер, Дом, Ремонт, Ландшафт. */
  tag: string;
  likes: number;
  views: number;
  /** Бюджет проекта в евро — показывается в карточке. */
  budget: number;
  photos: number;
  specialists: number;
  createdAt: number;
  coverUrl: string;
}

const HOUR = 1000 * 60 * 60;
const DAY = HOUR * 24;

export const SEED_PROJECTS: FeedProject[] = [
  {
    id: "modern-kitchen",
    title: "Кухня в современном стиле",
    author: "Мария Смирнова",
    authorRole: "Дизайнер интерьеров",
    location: "Rotterdam",
    tag: "Интерьер",
    likes: 128,
    views: 2140,
    budget: 46000,
    photos: 18,
    specialists: 3,
    createdAt: Date.now() - 3 * HOUR,
    coverUrl: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=85",
  },
  {
    id: "scandi-house",
    title: "Загородный дом в скандинавском стиле",
    author: "Алексей Петров",
    authorRole: "Архитектор",
    location: "Utrecht",
    tag: "Дом",
    likes: 96,
    views: 1730,
    budget: 128000,
    photos: 32,
    specialists: 6,
    createdAt: Date.now() - 9 * HOUR,
    coverUrl: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=85",
  },
  {
    id: "bathroom-renovation",
    title: "Ремонт ванной комнаты",
    author: "Анна К.",
    authorRole: "Заказчик",
    location: "Rotterdam",
    tag: "Ремонт",
    likes: 74,
    views: 1180,
    budget: 18500,
    photos: 11,
    specialists: 4,
    createdAt: Date.now() - 1 * DAY,
    coverUrl: "https://images.unsplash.com/photo-1620626011761-996317b8d101?auto=format&fit=crop&w=1200&q=85",
  },
  {
    id: "terrace-landscape",
    title: "Терраса и ландшафт участка",
    author: "Дмитрий Орлов",
    authorRole: "Ландшафтный дизайнер",
    location: "Delft",
    tag: "Ландшафт",
    likes: 61,
    views: 940,
    budget: 32000,
    photos: 22,
    specialists: 5,
    createdAt: Date.now() - 2 * DAY,
    coverUrl: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=85",
  },
  {
    id: "loft-living",
    title: "Лофт-гостиная с кирпичной стеной",
    author: "Ирина Волкова",
    authorRole: "Дизайнер интерьеров",
    location: "Amsterdam",
    tag: "Интерьер",
    likes: 143,
    views: 2610,
    budget: 54000,
    photos: 27,
    specialists: 4,
    createdAt: Date.now() - 3 * DAY,
    coverUrl: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=85",
  },
  {
    id: "studio-flat",
    title: "Студия 34 м²: всё на 6 кв. метрах",
    author: "Павел Никитин",
    authorRole: "Заказчик",
    location: "Rotterdam",
    tag: "Интерьер",
    likes: 88,
    views: 1520,
    budget: 22000,
    photos: 9,
    specialists: 2,
    createdAt: Date.now() - 4 * DAY,
    coverUrl: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=85",
  },
  {
    id: "garden-house",
    title: "Садовая беседка из клеёного бруса",
    author: "Сергей Кузьмин",
    authorRole: "Плотник",
    location: "Utrecht",
    tag: "Дом",
    likes: 52,
    views: 760,
    budget: 27000,
    photos: 14,
    specialists: 3,
    createdAt: Date.now() - 5 * DAY,
    coverUrl: "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=1200&q=85",
  },
  {
    id: "basement-finish",
    title: "Подвал в жилой кабинет",
    author: "Ольга Белова",
    authorRole: "Заказчик",
    location: "Delft",
    tag: "Ремонт",
    likes: 47,
    views: 690,
    budget: 19000,
    photos: 12,
    specialists: 4,
    createdAt: Date.now() - 6 * DAY,
    coverUrl: "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=1200&q=85",
  },
  {
    id: "bath-mat",
    title: "Ванная комната в тёплых тонах",
    author: "Егор Лапин",
    authorRole: "Мастер отделочных работ",
    location: "Rotterdam",
    tag: "Ремонт",
    likes: 39,
    views: 540,
    budget: 16500,
    photos: 8,
    specialists: 3,
    createdAt: Date.now() - 7 * DAY,
    coverUrl: "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?auto=format&fit=crop&w=1200&q=85",
  },
  {
    id: "courtyard",
    title: "Двор с террасой и зоной отдыха",
    author: "Наталья Жук",
    authorRole: "Ландшафтный дизайнер",
    location: "Amsterdam",
    tag: "Ландшафт",
    likes: 66,
    views: 1050,
    budget: 41000,
    photos: 20,
    specialists: 5,
    createdAt: Date.now() - 9 * DAY,
    coverUrl: "https://images.unsplash.com/photo-1558904541-efa843a96f01?auto=format&fit=crop&w=1200&q=85",
  },
];

/** Порядок для «свежих» — новые сверху. */
export function projectsByNewest(list: FeedProject[]): FeedProject[] {
  return [...list].sort((a, b) => b.createdAt - a.createdAt);
}
