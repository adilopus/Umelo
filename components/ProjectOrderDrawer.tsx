"use client";

import { useState } from "react";
import { ArrowRight, Check, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/lib/store";
import { Order } from "@/lib/types";

type Props = {
  onClose: () => void;
  projectTitle: string;
  projectLocation: string;
  projectImage: string;
};

const likedOptions = [
  "Весь проект",
  "Кухня",
  "Интерьер",
  "Материалы",
  "Найти специалистов",
];

const needOptions = [
  "Дизайн",
  "Реализация",
  "Подбор материалов",
  "Поиск специалистов",
];

const budgetOptions = [
  { label: "До €20 000", min: 0, max: 20000 },
  { label: "€20 000–50 000", min: 20000, max: 50000 },
  { label: "€50 000+", min: 50000, max: 100000 },
];

export function ProjectOrderDrawer({ onClose, projectTitle, projectLocation, projectImage }: Props) {
  const router = useRouter();
  const addOrder = useAppStore((state) => state.addOrder);

  const [liked, setLiked] = useState("Весь проект");
  const [needs, setNeeds] = useState<string[]>(["Реализация", "Подбор материалов"]);
  const [city, setCity] = useState("Rotterdam");
  const [objectType, setObjectType] = useState("Квартира");
  const [area, setArea] = useState("85");
  const [budget, setBudget] = useState(budgetOptions[1].label);
  const [submitting, setSubmitting] = useState(false);

  const toggleNeed = (value: string) => {
    setNeeds((current) =>
      current.includes(value) ? current.filter((item) => item !== value) : [...current, value]
    );
  };

  const submit = () => {
    if (submitting) return;
    setSubmitting(true);

    const selectedBudget = budgetOptions.find((item) => item.label === budget) ?? budgetOptions[1];
    const orderId = `project-${Date.now()}`;
    const code = `UM-${Math.floor(10000 + Math.random() * 90000)}`;
    const numericArea = Number(area.replace(/[^0-9.]/g, "")) || 0;

    const order: Order = {
      id: orderId,
      code,
      category: "Реализация проекта",
      subcategory: liked,
      serviceName: `Реализация проекта «${projectTitle}»`,
      areaSqm: numericArea,
      areaOver1000: numericArea > 1000,
      premise: objectType === "Дом" ? "country" : objectType === "Коммерция" ? "commercial" : "secondary",
      condition: "rough",
      address: city.trim() || "Rotterdam",
      budgetMin: selectedBudget.min,
      budgetMax: selectedBudget.max,
      deadlineDays: 21,
      description:
        `Заказ создан из проекта «${projectTitle}». ` +
        `Понравилось: ${liked.toLowerCase()}. ` +
        `Нужно: ${needs.length ? needs.join(", ").toLowerCase() : "обсудить объём работ"}. ` +
        `Локация: ${city || "не указана"}. Ориентировочный бюджет: ${budget}.`,
      media: [{ id: `${orderId}-cover`, dataUrl: projectImage, isCover: true }],
      documents: [],
      createdAt: Date.now(),
      authorRole: "customer",
      distanceKm: undefined,
      views: 0,
      status: "open",
    };

    addOrder(order);
    router.push("/my-orders");
  };

  return (
    <div className="fixed inset-0 z-50">
      <button aria-label="Закрыть" onClick={onClose} className="absolute inset-0 bg-black/35 backdrop-blur-[2px]" />

      <aside className="absolute right-0 top-0 flex h-full w-full max-w-[590px] flex-col bg-paper shadow-pop">
        <header className="flex items-center justify-between border-b border-line px-5 py-4 sm:px-7">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-accent-ink">Новый заказ</p>
            <h2 className="mt-1 font-display text-xl font-extrabold text-ink">Хочу такой проект</h2>
          </div>
          <button onClick={onClose} className="flex h-9 w-9 items-center justify-center rounded-full bg-surface text-ink-soft hover:text-ink" aria-label="Закрыть">
            <X size={18} />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto px-5 py-5 sm:px-7 sm:py-6">
          <div className="rounded-2xl border border-line bg-surface p-4">
            <div className="flex items-center gap-3">
              <img src={projectImage} alt="" className="h-16 w-20 rounded-xl object-cover" />
              <div className="min-w-0">
                <p className="text-xs font-bold uppercase tracking-wide text-ink-faint">Из проекта</p>
                <p className="mt-1 truncate text-sm font-extrabold text-ink">{projectTitle}</p>
                <p className="mt-1 text-xs text-ink-soft">{projectLocation}</p>
              </div>
            </div>
          </div>

          <section className="mt-6">
            <p className="font-display text-base font-extrabold text-ink">Что вам понравилось?</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {likedOptions.map((option) => (
                <button
                  key={option}
                  onClick={() => setLiked(option)}
                  className={`rounded-full border px-3.5 py-2 text-xs font-bold transition ${
                    liked === option ? "border-accent bg-accent text-ink" : "border-line bg-paper text-ink-soft hover:border-accent"
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </section>

          <section className="mt-6">
            <p className="font-display text-base font-extrabold text-ink">Что требуется?</p>
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              {needOptions.map((option) => {
                const selected = needs.includes(option);
                return (
                  <button
                    key={option}
                    onClick={() => toggleNeed(option)}
                    className={`flex items-center gap-3 rounded-2xl border p-3.5 text-left text-xs font-bold transition ${
                      selected ? "border-accent bg-accent-soft text-ink" : "border-line text-ink-soft hover:border-accent"
                    }`}
                  >
                    <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${selected ? "bg-accent text-ink" : "bg-surface text-transparent"}`}>
                      <Check size={12} strokeWidth={3} />
                    </span>
                    {option}
                  </button>
                );
              })}
            </div>
          </section>

          <section className="mt-6">
            <p className="font-display text-base font-extrabold text-ink">Объект</p>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <label className="block sm:col-span-2">
                <span className="mb-1.5 block text-xs font-bold text-ink-soft">Город</span>
                <input value={city} onChange={(event) => setCity(event.target.value)} className="h-11 w-full rounded-xl border border-line bg-paper px-3 text-sm outline-none focus:border-accent" />
              </label>
              <label className="block">
                <span className="mb-1.5 block text-xs font-bold text-ink-soft">Тип объекта</span>
                <select value={objectType} onChange={(event) => setObjectType(event.target.value)} className="h-11 w-full rounded-xl border border-line bg-paper px-3 text-sm outline-none focus:border-accent">
                  <option>Квартира</option>
                  <option>Дом</option>
                  <option>Коммерция</option>
                </select>
              </label>
              <label className="block">
                <span className="mb-1.5 block text-xs font-bold text-ink-soft">Площадь, м²</span>
                <input inputMode="decimal" value={area} onChange={(event) => setArea(event.target.value)} className="h-11 w-full rounded-xl border border-line bg-paper px-3 text-sm outline-none focus:border-accent" />
              </label>
            </div>
          </section>

          <section className="mt-6">
            <p className="font-display text-base font-extrabold text-ink">Ориентировочный бюджет</p>
            <div className="mt-3 grid gap-2">
              {budgetOptions.map((option) => (
                <button
                  key={option.label}
                  onClick={() => setBudget(option.label)}
                  className={`flex items-center justify-between rounded-2xl border px-4 py-3 text-sm font-bold transition ${
                    budget === option.label ? "border-accent bg-accent-soft text-ink" : "border-line text-ink-soft hover:border-accent"
                  }`}
                >
                  {option.label}
                  {budget === option.label && <span className="h-2.5 w-2.5 rounded-full bg-accent" />}
                </button>
              ))}
            </div>
          </section>

          <div className="mt-6 rounded-2xl bg-night p-4 text-white">
            <p className="text-xs font-bold uppercase tracking-[0.12em] text-accent">Из проекта автоматически</p>
            <div className="mt-3 grid grid-cols-3 gap-2 text-center">
              <div className="rounded-xl bg-paper/5 p-2.5"><p className="text-lg font-extrabold">18</p><p className="text-xs text-white/60">фото</p></div>
              <div className="rounded-xl bg-paper/5 p-2.5"><p className="text-lg font-extrabold">3</p><p className="text-xs text-white/60">специалиста</p></div>
              <div className="rounded-xl bg-paper/5 p-2.5"><p className="text-lg font-extrabold">24</p><p className="text-xs text-white/60">материала</p></div>
            </div>
          </div>
        </div>

        <footer className="border-t border-line bg-paper px-5 py-4 sm:px-7">
          <button onClick={submit} disabled={submitting} className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-accent text-sm font-extrabold text-ink transition hover:bg-accent-dark disabled:opacity-60">
            {submitting ? "Создаём заказ…" : "Создать заказ"}
            {!submitting && <ArrowRight size={17} />}
          </button>
          <p className="mt-2 text-center text-xs text-ink-faint">После создания заказ появится в разделе «Мои заказы».</p>
        </footer>
      </aside>
    </div>
  );
}
