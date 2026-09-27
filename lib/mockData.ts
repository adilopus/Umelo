import { Order } from "./types";

function placeholder(bg: string, label: string): string {
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='400' height='300'>
    <rect width='100%' height='100%' fill='${bg}'/>
    <text x='50%' y='50%' font-family='sans-serif' font-size='22' fill='#ffffff'
      text-anchor='middle' dominant-baseline='middle'>${label}</text>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

export const SEED_ORDERS: Order[] = [
  {
    id: "seed-1",
    code: "XKPQ-48213",
    category: "Инженерный монтаж (Электрика)",
    subcategory: "Электрощит и автоматы",
    serviceName: "Сборка и подключение ВРУ (щитка) с УЗО, дифавтоматами, реле напряжения",
    areaSqm: 62,
    areaOver1000: false,
    address: "ул. Садовая, 14, кв. 27",
    premise: "secondary",
    condition: "rough",
    budgetMin: 25000,
    budgetMax: 40000,
    deadlineDays: 5,
    description:
      "Нужно собрать и повесить новый щиток на 24 модуля, старый пришёл в негодность. Автоматы и УЗО можно свои посоветовать — готовы закупить.",
    media: [{ id: "m1", dataUrl: placeholder("#00A86B", "Электрощиток"), isCover: true }],
    documents: [],
    createdAt: Date.now() - 1000 * 60 * 40,
    authorRole: "customer",
    distanceKm: 1.2,
    views: 34,
    status: "open",
  },
  {
    id: "seed-2",
    code: "TMNR-70642",
    category: "Отделочные работы (Интерьер)",
    subcategory: "Плиточные работы",
    serviceName: "Укладка керамической плитки, керамогранита и мозаики",
    areaSqm: 18,
    areaOver1000: false,
    address: "ЖК «Northside», корп. 2, кв. 84",
    premise: "new",
    condition: "rough",
    budgetMin: 35000,
    budgetMax: 60000,
    budgetPerSqmMin: 1800,
    budgetPerSqmMax: 2500,
    deadlineDays: 3,
    description:
      "Ванная комната в новостройке, стены и пол, плитка уже куплена (керамогранит 60х60). Нужна ровная раскладка без подрезки на видных местах.",
    media: [
      { id: "m2", dataUrl: placeholder("#468966", "Плитка, ванная"), isCover: true },
    ],
    documents: [],
    createdAt: Date.now() - 1000 * 60 * 120,
    authorRole: "customer",
    distanceKm: 3.4,
    views: 51,
    status: "open",
  },
  {
    id: "seed-3",
    code: "HVCB-19384",
    category: "Инженерный монтаж (Сантехника)",
    subcategory: "Установка приборов",
    serviceName: "Установка унитазов, биде, ванн, душевых кабин и смесителей",
    areaSqm: 8,
    areaOver1000: false,
    address: "пр. Ленина, 58, кв. 12",
    premise: "secondary",
    condition: "finished",
    budgetMin: 8000,
    budgetMax: 15000,
    deadlineDays: 14,
    description:
      "Течёт смеситель на кухне и подтекает сифон под мойкой. Нужно заменить смеситель (куплен) и проверить всю разводку под мойкой.",
    media: [{ id: "m3", dataUrl: placeholder("#5E6E67", "Течь под мойкой"), isCover: true }],
    documents: [],
    createdAt: Date.now() - 1000 * 60 * 200,
    authorRole: "customer",
    distanceKm: 0.8,
    views: 12,
    status: "open",
  },
  {
    id: "seed-4",
    code: "AJWY-53927",
    category: "Строительство частных домов",
    subcategory: "Кровельные работы",
    serviceName:
      "Монтаж стропильной системы и кровли (металлочерепица, профнастил, мягкая черепица)",
    areaSqm: 120,
    areaOver1000: false,
    address: "СНТ «Ромашка», уч. 45",
    premise: "country",
    condition: "rough",
    budgetMin: 150000,
    budgetMax: 220000,
    budgetPerSqmMin: 1200,
    budgetPerSqmMax: 1800,
    deadlineDays: 10,
    description:
      "Двухскатная крыша дома 10х12 м, нужна полная стропильная система и кровля из металлочерепицы. Проект есть, могу прислать по запросу в чате.",
    media: [{ id: "m4", dataUrl: placeholder("#22302B", "Кровля, скат"), isCover: true }],
    documents: [],
    createdAt: Date.now() - 1000 * 60 * 300,
    authorRole: "customer",
    distanceKm: 12.6,
    views: 8,
    status: "open",
  },
];
