export interface TopicDef {
  id: string;
  label: string;
  icon: string;
}

export const ARTICLE_TOPICS: TopicDef[] = [
  { id: "design", label: "Ремонт и дизайн", icon: "Palette" },
  { id: "tools", label: "Инструменты и техника", icon: "Wrench" },
  { id: "materials", label: "Стройматериалы", icon: "Layers" },
  { id: "legal", label: "Договоры и право", icon: "Scale" },
  { id: "cases", label: "Кейсы проектов", icon: "Images" },
  { id: "market", label: "Новости рынка", icon: "TrendingUp" },
  { id: "deals", label: "Акции поставщиков", icon: "Tag" },
  { id: "howto", label: "Как выбрать мастера", icon: "UserCheck" },
];

export function topicLabel(id: string): string {
  return ARTICLE_TOPICS.find((t) => t.id === id)?.label ?? id;
}
