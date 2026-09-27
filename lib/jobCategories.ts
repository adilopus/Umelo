import rawData from "./jobCategoryData.json";
import { JobCategoryEntry } from "./types";

// В исходном файле не хватало отдельной категории для клининга и вывоза
// мусора — сейчас "Демонтаж" покрывает только уборку строительного мусора
// в процессе работ, а финальную уборку и вывоз отходов после ремонта
// заказывают отдельно почти на всех похожих платформах. Добавляем как
// самостоятельный слой поверх исходного JSON, не трогая загруженный файл.
const EXTRA_ENTRIES: JobCategoryEntry[] = [
  {
    category: "Клининг и вывоз мусора",
    subcategory: "Уборка после ремонта",
    service_name: "Генеральная уборка после ремонта (мытьё окон, полов, поверхностей)",
    work_type: "Бытовые",
    object_type: "Квартиры/Дома/Коммерция",
  },
  {
    category: "Клининг и вывоз мусора",
    subcategory: "Вывоз мусора",
    service_name: "Вывоз строительного мусора и негабарита с погрузкой",
    work_type: "Бытовые",
    object_type: "Квартиры/Дома/Коммерция",
  },
];

export const JOB_ENTRIES = [...(rawData as JobCategoryEntry[]), ...EXTRA_ENTRIES];

export interface CategoryDef {
  name: string;
  icon: string;
}

// Порядок и иконки категорий — иконки лежат в наборе lucide-react
// и подключаются в UI через ICONS-словарь компонента.
// Ровно 12 категорий (6х2) — чётная сетка без "хвостика" в последнем ряду.
export const CATEGORIES: CategoryDef[] = [
  { name: "Отделочные работы (Интерьер)", icon: "PaintRoller" },
  { name: "Черновые работы", icon: "Hammer" },
  { name: "Инженерный монтаж (Электрика)", icon: "Zap" },
  { name: "Инженерный монтаж (Сантехника)", icon: "Droplet" },
  { name: "Инженерный монтаж (Отопление и вентиляция)", icon: "Thermometer" },
  { name: "Столярные работы", icon: "DoorOpen" },
  { name: "Бытовые услуги", icon: "Wrench" },
  { name: "Комплексный ремонт", icon: "Building2" },
  { name: "Строительство частных домов", icon: "Home" },
  { name: "Загородные объекты и ландшафт", icon: "Trees" },
  { name: "Коммерческая недвижимость", icon: "Store" },
  { name: "Клининг и вывоз мусора", icon: "Sparkles" },
];

export function getSubcategories(category: string): string[] {
  const result: string[] = [];
  const seen = new Set<string>();
  for (const entry of JOB_ENTRIES) {
    if (entry.category === category && !seen.has(entry.subcategory)) {
      seen.add(entry.subcategory);
      result.push(entry.subcategory);
    }
  }
  return result;
}

export function getServices(category: string, subcategory: string): JobCategoryEntry[] {
  return JOB_ENTRIES.filter(
    (e) => e.category === category && e.subcategory === subcategory
  );
}

export function findEntry(serviceName: string): JobCategoryEntry | undefined {
  return JOB_ENTRIES.find((e) => e.service_name === serviceName);
}
