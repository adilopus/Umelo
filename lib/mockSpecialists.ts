import { PortfolioItem, Specialist, SpecialistReview } from "./types";

/**
 * id «специалиста», которому принадлежат работы, созданные текущим
 * пользователем (роль «Исполнитель») через личный кабинет. В каталоге такого
 * профиля нет — это личная витрина, как «Вы (блогер)» у контентных ролей.
 */
export const SPECIALIST_ME = "me";

const IMG = {
  kitchen: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=85",
  kitchenAlt: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1200&q=85",
  living: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=85",
  bathroom: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=85",
  bathroomAlt: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1200&q=85",
  tile: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=85",
  mixer: "https://images.unsplash.com/photo-1584622781867-7a5d2b5e4f6f?auto=format&fit=crop&w=1200&q=85",
  paint: "https://images.unsplash.com/photo-1562259949-e8e7682d7828?auto=format&fit=crop&w=1200&q=85",
  hydro: "https://images.unsplash.com/photo-1620626011761-996317b8d101?auto=format&fit=crop&w=1200&q=85",
  house: "https://images.unsplash.com/photo-1600607688969-a5bfcd646154?auto=format&fit=crop&w=1200&q=85",
};

const AVATAR = {
  alexey: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=200&q=80",
  ivan: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
  maria: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80",
  dmitry: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
  sergey: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
  olga: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=200&q=80",
  petr: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80",
  timur: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=200&q=80",
  me: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80",
};

const DAY = 1000 * 60 * 60 * 24;

export const SEED_SPECIALISTS: Specialist[] = [
  {
    id: "sp-1",
    name: "Алексей Петров",
    profession: "Сантехника · отопление",
    city: "Москва",
    distanceKm: 8,
    rating: 4.9,
    reviewsCount: 127,
    projectsCount: 48,
    experienceYears: 12,
    bio: "Меняю и развожу трубы, собираю узлы отопления, устанавливаю приборы и устраняю протечки. Работаю аккуратно, оставляю после себя чисто.",
    services: ["Сантехника", "Отопление", "Установка приборов", "Поиск протечек"],
    skills: ["Пресс-фитинги", "Пайка PPR", "Опрессовка", "Тёплый пол"],
    verified: true,
    responseTime: "в течение часа",
    avatarUrl: AVATAR.alexey,
    views: 1840,
    createdAt: Date.now() - DAY * 420,
  },
  {
    id: "sp-2",
    name: "Иван Кузнецов",
    profession: "Электрика · инженерные системы",
    city: "Москва",
    distanceKm: 12,
    rating: 4.8,
    reviewsCount: 96,
    projectsCount: 36,
    experienceYears: 9,
    bio: "Монтаж и замена электрики под ключ: щиты, автоматы, УЗО, розеточные сети. Делаю расчёт нагрузок и выдаю схему щита.",
    services: ["Электрика", "Сборка щитов", "Розеточные сети", "Освещение"],
    skills: ["ВРУ и УЗО", "Реле напряжения", "Штробление", "Умный дом"],
    verified: true,
    responseTime: "в течение 2 часов",
    avatarUrl: AVATAR.ivan,
    views: 1520,
    createdAt: Date.now() - DAY * 310,
  },
  {
    id: "sp-3",
    name: "Мария Смирнова",
    profession: "Дизайн интерьера",
    city: "Москва",
    distanceKm: 15,
    rating: 5.0,
    reviewsCount: 66,
    projectsCount: 29,
    experienceYears: 8,
    bio: "Проектирую интерьеры квартир и домов: планировка, свет, материалы, подбор мебели. Веду проект от идеи до реализации с командой мастеров.",
    services: ["Дизайн интерьера", "Планировка", "Визуализация", "Авторский надзор"],
    skills: ["3D-визуализация", "Свет", "Подбор материалов", "Смета"],
    verified: true,
    responseTime: "в течение дня",
    avatarUrl: AVATAR.maria,
    views: 2260,
    createdAt: Date.now() - DAY * 500,
  },
  {
    id: "sp-4",
    name: "Дмитрий Орлов",
    profession: "Отделочные работы",
    city: "Химки",
    distanceKm: 22,
    rating: 4.7,
    reviewsCount: 74,
    projectsCount: 41,
    experienceYears: 14,
    bio: "Отделка квартир и офисов: штукатурка, стяжка, малярка, плитка. Работаю по этапам, каждую неделю показываю прогресс.",
    services: ["Отделка под ключ", "Штукатурка", "Малярные работы", "Плитка"],
    skills: ["Маячковая штукатурка", "Стяжка", "Керамогранит", "Декоративные покрытия"],
    verified: false,
    responseTime: "в течение дня",
    avatarUrl: AVATAR.dmitry,
    views: 990,
    createdAt: Date.now() - DAY * 260,
  },
  {
    id: "sp-5",
    name: "Сергей Волков",
    profession: "Плиточные работы",
    city: "Москва",
    distanceKm: 6,
    rating: 4.9,
    reviewsCount: 88,
    projectsCount: 52,
    experienceYears: 11,
    bio: "Укладываю плитку и керамогранит любого формата, включая крупный 120×60 и мозаику. Ровные швы, аккуратные подрезки.",
    services: ["Плитка", "Мозаика", "Керамогранит", "Затирка и герметизация"],
    skills: ["Крупноформат", "Мозаика", "Система СВП", "Раскладка"],
    verified: true,
    responseTime: "в течение 3 часов",
    avatarUrl: AVATAR.sergey,
    views: 1310,
    createdAt: Date.now() - DAY * 380,
  },
  {
    id: "sp-6",
    name: "Ольга Белова",
    profession: "Малярные работы · декор",
    city: "Мытищи",
    distanceKm: 19,
    rating: 4.8,
    reviewsCount: 52,
    projectsCount: 33,
    experienceYears: 7,
    bio: "Малярка и декоративные покрытия: венецианка, микроцемент, фактурные краски. Помогу подобрать оттенок под интерьер.",
    services: ["Малярные работы", "Декоративная штукатурка", "Микроцемент", "Поклейка обоев"],
    skills: ["Венецианка", "Фактурные краски", "Колеровка", "Финиш под покраску"],
    verified: true,
    responseTime: "в течение 4 часов",
    avatarUrl: AVATAR.olga,
    views: 720,
    createdAt: Date.now() - DAY * 190,
  },
  {
    id: "sp-7",
    name: "Пётр Николаев",
    profession: "Кровля и фасады",
    city: "Московская область",
    distanceKm: 35,
    rating: 4.6,
    reviewsCount: 41,
    projectsCount: 27,
    experienceYears: 16,
    bio: "Стропильные системы, кровля из металлочерепицы и гибкой черепицы, вентилируемые фасады. Работаю на высоте с допуском и страховкой.",
    services: ["Кровля", "Стропильные системы", "Фасады", "Водостоки"],
    skills: ["Металлочерепица", "Гибкая черепица", "Утепление", "Монтаж на высоте"],
    verified: false,
    responseTime: "в течение дня",
    avatarUrl: AVATAR.petr,
    views: 540,
    createdAt: Date.now() - DAY * 610,
  },
  {
    id: "sp-8",
    name: "Тимур Ахметов",
    profession: "Ландшафт · благоустройство",
    city: "Москва",
    distanceKm: 17,
    rating: 4.9,
    reviewsCount: 37,
    projectsCount: 24,
    experienceYears: 10,
    bio: "Благоустройство участков: дренаж, дорожки, газон, освещение, малые архитектурные формы. Делаю проект участка и реализую его.",
    services: ["Ландшафт", "Дренаж", "Дорожки и площадки", "Газон и озеленение"],
    skills: ["Дренаж", "Тротуарная плитка", "Автополив", "Садовый свет"],
    verified: true,
    responseTime: "в течение 5 часов",
    avatarUrl: AVATAR.timur,
    views: 610,
    createdAt: Date.now() - DAY * 240,
  },
  // Собственная запись исполнителя. Раньше работы мастера попадали в портфолио,
  // но в каталоге специалистов их не было видно — профиль «выкладывается в пустоту».
  // Эта запись синхронизируется с `masterProfile` в сторе (см. updateMasterProfile).
  {
    id: SPECIALIST_ME,
    name: "Я",
    profession: "",
    city: "",
    distanceKm: 0,
    // Агрегаты согласованы с seed-данными ниже: 1 работа (pf-me-seed-1)
    // и 3 отзыва (5 + 5 + 4) => средний 4.7. Иначе карточка в каталоге
    // показывала «0 отзывов / 0 проектов» при непустом портфолио.
    rating: 4.7,
    reviewsCount: 3,
    projectsCount: 1,
    experienceYears: 0,
    bio: "",
    services: [],
    skills: [],
    verified: false,
    responseTime: "—",
    avatarUrl: AVATAR.me,
    views: 0,
    createdAt: Date.now(),
  },
];

function seedPortfolio(
  specialistId: string,
  items: Array<
    Pick<
      PortfolioItem,
      | "id"
      | "title"
      | "category"
      | "description"
      | "coverUrl"
      | "images"
      | "price"
      | "durationDays"
      | "likes"
      | "views"
    > &
      Partial<Pick<PortfolioItem, "completed" | "year">>
  >
): PortfolioItem[] {
  return items.map((item, index) => ({
    ...item,
    specialistId,
    createdAt: Date.now() - DAY * (30 + index * 21),
  }));
}

export const SEED_PORTFOLIO: PortfolioItem[] = [
  ...seedPortfolio("sp-1", [
    {
      id: "pf-1-1",
      title: "Разводка сантехники в квартире под ключ",
      category: "Сантехника",
      description:
        "Полная замена разводки в трёхкомнатной квартире: коллекторная схема, фильтры, счётчики. Скрытая прокладка в стенах с ревизионными люками.",
      coverUrl: IMG.bathroom,
      images: [IMG.bathroom, IMG.mixer, IMG.bathroomAlt],
      price: "от 95 000 ₽",
      durationDays: 6,
      likes: 64,
      views: 820,
    },
    {
      id: "pf-1-2",
      title: "Узел отопления в частном доме",
      category: "Отопление",
      description:
        "Сборка и обвязка узла отопления: котёл, гидрострелка, насосные группы и коллекторы. Балансировка радиаторов после запуска.",
      coverUrl: IMG.house,
      images: [IMG.house],
      price: "от 140 000 ₽",
      durationDays: 9,
      likes: 41,
      views: 470,
    },
    {
      id: "pf-1-3",
      title: "Устранение протечки и замена стояка",
      category: "Ремонт",
      description:
        "Аварийный выезд: нашли скрытую протечку под плиткой, заменили участок стояка и восстановили гидроизоляцию.",
      coverUrl: IMG.mixer,
      images: [IMG.mixer, IMG.bathroomAlt],
      price: "от 18 000 ₽",
      durationDays: 2,
      likes: 28,
      views: 310,
    },
  ]),
  ...seedPortfolio("sp-2", [
    {
      id: "pf-2-1",
      title: "Сборка электрощита и замена проводки",
      category: "Электрика",
      description:
        "Щит на 36 модулей с дифавтоматами и реле напряжения, полная замена алюминиевой проводки на медь, схема щита в электронном виде.",
      coverUrl: IMG.living,
      images: [IMG.living, IMG.kitchenAlt],
      price: "от 120 000 ₽",
      durationDays: 7,
      likes: 73,
      views: 910,
    },
    {
      id: "pf-2-2",
      title: "Освещение и розеточная сеть в студии",
      category: "Освещение",
      description:
        "Сценарное освещение по зонам, скрытые подрозетники, вывод под подсветку. Проверка всех линий под нагрузкой.",
      coverUrl: IMG.kitchen,
      images: [IMG.kitchen, IMG.living],
      price: "от 68 000 ₽",
      durationDays: 5,
      likes: 35,
      views: 400,
    },
  ]),
  ...seedPortfolio("sp-3", [
    {
      id: "pf-3-1",
      title: "Кухня-гостиная 28 м² в стиле минимализм",
      category: "Интерьер",
      description:
        "Совмещённая кухня-гостиная с тёплым деревом, натуральным камнем и скрытой техникой. Планировка, свет и подбор материалов.",
      coverUrl: IMG.kitchen,
      images: [IMG.kitchen, IMG.kitchenAlt, IMG.living],
      price: "от 320 000 ₽",
      durationDays: 60,
      likes: 128,
      views: 1640,
    },
    {
      id: "pf-3-2",
      title: "Светлая ванная с натуральным камнем",
      category: "Интерьер",
      description:
        "Компактная ванная с крупноформатным керамогранитом, нишей под ванну и скрытым освещением. Полный рабочий проект и надзор.",
      coverUrl: IMG.bathroom,
      images: [IMG.bathroom, IMG.bathroomAlt],
      price: "от 180 000 ₽",
      durationDays: 45,
      likes: 96,
      views: 1120,
    },
  ]),
  ...seedPortfolio("sp-4", [
    {
      id: "pf-4-1",
      title: "Отделка квартиры 74 м² по этапам",
      category: "Отделка",
      description:
        "Штукатурка, стяжка, разводка под чистовую, малярка и плитка. Еженедельный фотоотчёт и контрольные точки по этапам.",
      coverUrl: IMG.living,
      images: [IMG.living, IMG.kitchen],
      price: "от 420 000 ₽",
      durationDays: 55,
      likes: 52,
      views: 680,
    },
    {
      id: "pf-4-2",
      title: "Декоративная штукатурка в гостиной",
      category: "Малярка",
      description:
        "Подготовка основания и нанесение фактурного покрытия, подбор оттенка под мебель и текстиль заказчика.",
      coverUrl: IMG.paint,
      images: [IMG.paint, IMG.living],
      price: "от 55 000 ₽",
      durationDays: 6,
      likes: 31,
      views: 350,
    },
  ]),
  ...seedPortfolio("sp-5", [
    {
      id: "pf-5-1",
      title: "Крупноформат 120×60 в санузле",
      category: "Плитка",
      description:
        "Укладка керамогранита с системой СВП, минимум швов, аккуратные подрезки на видных местах. Пол и стены.",
      coverUrl: IMG.tile,
      images: [IMG.tile, IMG.bathroom],
      price: "от 2 400 ₽/м²",
      durationDays: 5,
      likes: 67,
      views: 760,
    },
    {
      id: "pf-5-2",
      title: "Мозаика и ниша в душевой",
      category: "Плитка",
      description:
        "Мозаичная ниша под душ, тщательная гидроизоляция подложки и подгонка рисунка мозаики.",
      coverUrl: IMG.bathroomAlt,
      images: [IMG.bathroomAlt, IMG.tile],
      price: "от 38 000 ₽",
      durationDays: 4,
      likes: 44,
      views: 520,
    },
  ]),
  ...seedPortfolio("sp-6", [
    {
      id: "pf-6-1",
      title: "Микроцемент на стенах кухни",
      category: "Декор",
      description:
        "Бесшовное покрытие микроцементом с защитным лаком, эффект бетона под тёплым светом. Подготовка и финиш за 5 дней.",
      coverUrl: IMG.paint,
      images: [IMG.paint, IMG.kitchenAlt],
      price: "от 72 000 ₽",
      durationDays: 5,
      likes: 39,
      views: 430,
    },
  ]),
  ...seedPortfolio("sp-7", [
    {
      id: "pf-7-1",
      title: "Кровля дома 10×12 из металлочерепицы",
      category: "Кровля",
      description:
        "Стропильная система, утепление, пароизоляция и монтаж металлочерепицы. Узлы водостока и снегозадержания.",
      coverUrl: IMG.house,
      images: [IMG.house],
      price: "от 210 000 ₽",
      durationDays: 14,
      likes: 33,
      views: 390,
    },
  ]),
  ...seedPortfolio("sp-8", [
    {
      id: "pf-8-1",
      title: "Благоустройство участка 6 соток",
      category: "Ландшафт",
      description:
        "Дренаж, тротуарная плитка на площадке и дорожках, рулонный газон и садовое освещение по периметру.",
      coverUrl: IMG.house,
      images: [IMG.house, IMG.kitchenAlt],
      price: "от 280 000 ₽",
      durationDays: 20,
      likes: 47,
      views: 560,
    },
  ]),
  // Одна готовая работа текущего исполнителя: страница портфолио не должна
  // выглядеть пустой строкой и показывает, как оформляются работы.
  ...seedPortfolio(SPECIALIST_ME, [
    {
      id: "pf-me-seed-1",
      title: "Санузел под ключ в новостройке",
      category: "Сантехника",
      description:
        "Разводка воды и канализации, монтаж сантехники, гидроизоляция и финишная отделка. Сроки согласованы поэтапно, каждый этап принимался отдельно.",
      coverUrl: IMG.bathroom,
      images: [IMG.bathroom, IMG.mixer, IMG.bathroomAlt],
      price: "от 120 000 ₽",
      durationDays: 8,
      completed: true,
      year: "2026",
      likes: 0,
      views: 0,
    },
  ]),
];

function reviews(specialistId: string, entries: Array<[string, number, string, number]>): SpecialistReview[] {
  return entries.map(([authorName, rating, text, daysAgo], index) => ({
    id: `rev-${specialistId}-${index + 1}`,
    specialistId,
    authorName,
    rating,
    text,
    createdAt: Date.now() - DAY * daysAgo,
  }));
}

export const SEED_SPECIALIST_REVIEWS: SpecialistReview[] = [
  ...reviews("sp-1", [
    ["Анна К.", 5, "Приехал в день обращения, быстро нашёл протечку. Всё аккуратно, убрал за собой.", 12],
    ["Михаил Т.", 5, "Собрал разводку под ключ, объяснил схему. Работой доволен.", 40],
    ["Ольга В.", 4, "Хороший мастер, немного задержался по времени, но результат отличный.", 70],
  ]),
  ...reviews("sp-2", [
    ["Дмитрий С.", 5, "Щит собрал идеально, всё подписано. Проверил каждую линию.", 20],
    ["Екатерина Л.", 5, "Помог с освещением, дал советы по подсветке. Рекомендую.", 55],
    ["Игорь Р.", 4, "Работой доволен, приехал чуть позже назначенного времени.", 90],
  ]),
  ...reviews("sp-3", [
    ["Сергей П.", 5, "Проект кухни превзошёл ожидания, всё продумано до мелочей.", 15],
    ["Марина Д.", 5, "Работать было легко, всегда на связи, вела надзор до конца.", 48],
  ]),
  ...reviews("sp-4", [
    ["Павел Н.", 5, "Отделка квартиры понравилась, держал сроки по этапам.", 25],
    ["Наталья Ф.", 4, "Качественно, но пришлось пару раз напомнить о мелочах.", 80],
  ]),
  ...reviews("sp-5", [
    ["Алексей Ж.", 5, "Плитка уложена идеально, швы ровные. Профессионал.", 18],
    ["Вера К.", 5, "Крупный формат без единой подрезки на виду. Спасибо!", 60],
  ]),
  ...reviews("sp-6", [
    ["Ксения М.", 5, "Микроцемент получился как на картинке, оттенок подобрали точно.", 30],
  ]),
  ...reviews("sp-7", [
    ["Роман Г.", 5, "Кровля сделана за две недели, всё герметично, дожди не страшны.", 44],
    ["Илья Б.", 4, "Работа хорошая, чуть затянули с финишем.", 100],
  ]),
  ...reviews("sp-8", [
    ["Светлана О.", 5, "Участок преобразился, дренаж работает, газон ровный.", 35],
  ]),
  // Отзывы о текущем исполнителе — их видит мастер в своём портфолио.
  ...reviews(SPECIALIST_ME, [
    ["Анна К.", 5, "Приехал в день обращения, быстро нашёл проблему. Всё аккуратно, убрал за собой.", 9],
    ["Михаил Т.", 5, "Собрал разводку под ключ, объяснил схему и показал, как обслуживать.", 26],
    ["Ольга В.", 4, "Хорошая работа, немного задержался по времени, но результат отличный.", 51],
  ]),
];
