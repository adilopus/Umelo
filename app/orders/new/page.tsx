"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ChevronLeft,
  PaintRoller,
  Hammer,
  Zap,
  Droplet,
  Thermometer,
  DoorOpen,
  Wrench,
  Building2,
  Home as HomeIcon,
  Trees,
  Store,
  Sparkles,
  Camera,
  Paperclip,
  X,
  Check,
  FileText,
} from "lucide-react";
import { useAppStore } from "@/lib/store";
import { Order, PremiseType, ConditionType, OrderMedia, OrderDocument } from "@/lib/types";
import { CATEGORIES, getSubcategories, getServices } from "@/lib/jobCategories";
import { compressImage, videoPlaceholder } from "@/lib/imageCompress";
import { generateOrderCode } from "@/lib/orderCode";

const ICONS: Record<string, any> = {
  PaintRoller,
  Hammer,
  Zap,
  Droplet,
  Thermometer,
  DoorOpen,
  Wrench,
  Building2,
  Home: HomeIcon,
  Trees,
  Store,
  Sparkles,
};

const STEP_LABELS = [
  "Категория",
  "Вид работ",
  "Услуга",
  "Объект",
  "Бюджет и сроки",
  "Описание",
  "Проверка",
];

const DEADLINE_PRESETS = [1, 3, 7, 14, 30, 60];

const PREMISE_OPTIONS: { id: PremiseType; label: string }[] = [
  { id: "new", label: "Новостройка" },
  { id: "secondary", label: "Вторичка" },
  { id: "commercial", label: "Коммерция" },
  { id: "country", label: "Загородный объект" },
];

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function NewOrderPage() {
  const router = useRouter();
  const addOrder = useAppStore((s) => s.addOrder);

  const [step, setStep] = useState(0);

  // Шаги 0-2: категория / подкатегория / услуга
  const [category, setCategory] = useState<string | null>(null);
  const [subcategory, setSubcategory] = useState<string | null>(null);
  const [serviceName, setServiceName] = useState<string | null>(null);

  // Шаг 3: объект
  const [areaSqm, setAreaSqm] = useState(50);
  const [areaOver1000, setAreaOver1000] = useState(false);
  const [address, setAddress] = useState("");
  const [premise, setPremise] = useState<PremiseType>("secondary");
  const [condition, setCondition] = useState<ConditionType>("rough");

  // Шаг 4: бюджет и сроки
  const [budgetMin, setBudgetMin] = useState(20000);
  const [budgetMax, setBudgetMax] = useState(50000);
  const [perSqmEnabled, setPerSqmEnabled] = useState(false);
  const [budgetPerSqmMin, setBudgetPerSqmMin] = useState(500);
  const [budgetPerSqmMax, setBudgetPerSqmMax] = useState(1500);
  const [deadlineDays, setDeadlineDays] = useState(7);

  // Шаг 5: описание, фото/видео, документы
  const [description, setDescription] = useState("");
  const [media, setMedia] = useState<OrderMedia[]>([]);
  const [documents, setDocuments] = useState<OrderDocument[]>([]);
  const [uploadWarning, setUploadWarning] = useState<string | null>(null);
  const [publishError, setPublishError] = useState<string | null>(null);

  const subcategories = category ? getSubcategories(category) : [];
  const services = category && subcategory ? getServices(category, subcategory) : [];

  const canNext =
    (step === 0 && category !== null) ||
    (step === 1 && subcategory !== null) ||
    (step === 2 && serviceName !== null) ||
    (step === 3 && address.trim().length > 0) ||
    (step === 4 && deadlineDays > 0) ||
    (step === 5 && description.trim().length > 0 && media.length > 0) ||
    step === 6;

  async function handleMediaFiles(files: FileList | null) {
    if (!files) return;
    setUploadWarning(null);
    const remaining = 5 - media.length;
    for (const file of Array.from(files).slice(0, remaining)) {
      try {
        const dataUrl = file.type.startsWith("video/")
          ? videoPlaceholder(file.name)
          : await compressImage(file);
        setMedia((prev) => [
          ...prev,
          { id: `${Date.now()}-${Math.random()}`, dataUrl, isCover: prev.length === 0 },
        ]);
      } catch {
        setUploadWarning(`Не удалось обработать файл «${file.name}» — попробуйте другой формат.`);
      }
    }
  }

  async function handleDocFiles(files: FileList | null) {
    if (!files) return;
    setUploadWarning(null);
    const remaining = 5 - documents.length;
    const MAX_DOC_MB = 8;
    for (const file of Array.from(files).slice(0, remaining)) {
      if (file.size > MAX_DOC_MB * 1024 * 1024) {
        setUploadWarning(`Файл «${file.name}» больше ${MAX_DOC_MB} МБ — сожмите или разделите его перед загрузкой.`);
        continue;
      }
      const dataUrl = await readFileAsDataUrl(file);
      setDocuments((prev) => [
        ...prev,
        {
          id: `${Date.now()}-${Math.random()}`,
          name: file.name,
          dataUrl,
          sizeKb: Math.round(file.size / 1024),
        },
      ]);
    }
  }

  function publish() {
    if (!category || !subcategory || !serviceName) return;
    const order: Order = {
      id: `order-${Date.now()}`,
      code: generateOrderCode(),
      category,
      subcategory,
      serviceName,
      areaSqm,
      areaOver1000,
      address: address.trim(),
      premise,
      condition,
      budgetMin,
      budgetMax,
      budgetPerSqmMin: perSqmEnabled ? budgetPerSqmMin : undefined,
      budgetPerSqmMax: perSqmEnabled ? budgetPerSqmMax : undefined,
      deadlineDays,
      description: description.trim(),
      media,
      documents,
      createdAt: Date.now(),
      authorRole: "customer",
      distanceKm: 0,
      views: 0,
      status: "open",
    };
    setPublishError(null);
    try {
      addOrder(order);
      router.push(`/orders/${order.id}`);
    } catch (err) {
      // Хранилище браузера переполнено даже после автоматической очистки —
      // просим сократить количество/размер вложений вместо падения приложения.
      setPublishError(
        "Не хватает места в хранилище браузера для всех вложений. Уменьшите количество фото/документов и попробуйте снова."
      );
    }
  }

  return (
    <div className="flex flex-1 flex-col lg:mx-auto lg:w-full lg:max-w-page lg:flex-row lg:gap-8 lg:px-6 lg:py-8">
      <header className="flex items-center gap-3 border-b border-line px-4 py-3 lg:hidden">
        <button
          onClick={() => (step === 0 ? router.push("/feed") : setStep(step - 1))}
          className="rounded-full p-1 text-ink-soft active:bg-surface"
          aria-label="Назад"
        >
          <ChevronLeft size={22} />
        </button>
        <div className="flex-1">
          <p className="font-display text-sm font-bold">{STEP_LABELS[step]}</p>
          <div className="mt-1.5 flex gap-1">
            {STEP_LABELS.map((_, i) => (
              <div
                key={i}
                className={`h-1 flex-1 rounded-full ${i <= step ? "bg-accent" : "bg-line"}`}
              />
            ))}
          </div>
        </div>
      </header>

      {/* Десктоп: боковая панель шагов вместо тонкой полоски прогресса —
          удобнее для мыши, видно все шаги сразу, можно вернуться на
          пройденный шаг кликом. */}
      <aside className="hidden shrink-0 lg:block lg:w-64">
        <button
          onClick={() => router.push("/feed")}
          className="mb-5 flex items-center gap-1.5 text-sm text-ink-soft transition hover:text-ink"
        >
          <ChevronLeft size={16} /> В ленту
        </button>
        <p className="mb-3 font-display text-lg font-bold text-ink">Новый заказ</p>
        <div className="flex flex-col gap-1">
          {STEP_LABELS.map((label, i) => {
            const status = i < step ? "done" : i === step ? "current" : "upcoming";
            const clickable = i <= step;
            return (
              <button
                key={label}
                onClick={() => clickable && setStep(i)}
                disabled={!clickable}
                className={`flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-sm transition ${
                  status === "current"
                    ? "bg-accent-soft font-semibold text-accent-ink"
                    : status === "done"
                      ? "text-ink hover:bg-surface"
                      : "cursor-default text-ink-faint"
                }`}
              >
                <span
                  className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                    status === "current"
                      ? "bg-accent text-night"
                      : status === "done"
                        ? "bg-ok text-white"
                        : "bg-line text-ink-soft"
                  }`}
                >
                  {status === "done" ? "✓" : i + 1}
                </span>
                {label}
              </button>
            );
          })}
        </div>
      </aside>

      <div className="flex flex-1 flex-col lg:rounded-2xl lg:border lg:border-line lg:bg-paper lg:shadow-card">
      <main className="flex-1 overflow-y-auto px-4 py-5 lg:px-8 lg:py-8">
        {/* Шаг 0: категория */}
        {step === 0 && (
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
            {CATEGORIES.map((cat) => {
              const Icon = ICONS[cat.icon];
              const active = category === cat.name;
              return (
                <button
                  key={cat.name}
                  onClick={() => {
                    setCategory(cat.name);
                    setSubcategory(null);
                    setServiceName(null);
                    setStep(1);
                  }}
                  className={`flex flex-col items-center gap-2 rounded-2xl border p-3.5 text-center transition ${
                    active ? "border-accent bg-accent-soft" : "border-line bg-paper active:bg-surface"
                  }`}
                >
                  <Icon size={24} strokeWidth={1.8} className={active ? "text-accent-ink" : "text-ink"} />
                  <span className="text-xs font-medium leading-tight">{cat.name}</span>
                </button>
              );
            })}
          </div>
        )}

        {/* Шаг 1: подкатегория */}
        {step === 1 && category && (
          <div className="flex flex-col gap-2">
            <p className="mb-1 text-xs text-ink-soft">{category}</p>
            {subcategories.map((sub) => (
              <button
                key={sub}
                onClick={() => {
                  setSubcategory(sub);
                  setServiceName(null);
                  setStep(2);
                }}
                className={`rounded-xl border px-4 py-3 text-left text-sm font-medium ${
                  subcategory === sub
                    ? "border-accent bg-accent-soft text-accent-ink"
                    : "border-line text-ink"
                }`}
              >
                {sub}
              </button>
            ))}
          </div>
        )}

        {/* Шаг 2: конкретная услуга */}
        {step === 2 && category && subcategory && (
          <div className="flex flex-col gap-2">
            <p className="mb-1 text-xs text-ink-soft">
              {category} · {subcategory}
            </p>
            {services.map((entry) => (
              <button
                key={entry.service_name}
                onClick={() => {
                  setServiceName(entry.service_name);
                  setStep(3);
                }}
                className={`rounded-xl border p-3 text-left ${
                  serviceName === entry.service_name
                    ? "border-accent bg-accent-soft"
                    : "border-line"
                }`}
              >
                <p className="text-sm font-semibold text-ink">{entry.service_name}</p>
                <p className="mt-1 text-xs text-ink-faint">
                  {entry.work_type} · {entry.object_type}
                </p>
              </button>
            ))}
          </div>
        )}

        {/* Шаг 3: объект */}
        {step === 3 && (
          <div className="space-y-6">
            <div>
              <label className="mb-2 block text-sm font-semibold">
                Адрес объекта <span className="text-accent-ink">*</span>
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Например: ул. Ленина, 15, кв. 42"
                className="w-full rounded-xl border border-line px-3 py-2.5 text-sm"
              />
              <p className="mt-1.5 text-xs text-ink-soft">
                Точный адрес видят только мастера, которым вы одобрили отклик — в
                общей ленте показывается лишь примерное расстояние.
              </p>
            </div>

            <div>
              <label className="mb-2 flex items-center justify-between text-sm font-semibold">
                <span>Площадь объекта</span>
                <span className="text-accent-ink">
                  {areaOver1000 ? "более 1000 м²" : `${areaSqm} м²`}
                </span>
              </label>
              <input
                type="range"
                min={5}
                max={1000}
                value={areaSqm}
                disabled={areaOver1000}
                onChange={(e) => setAreaSqm(Number(e.target.value))}
                className="w-full accent-accent disabled:opacity-40"
              />
              <label className="mt-3 flex items-center gap-2 rounded-xl border border-line px-3 py-2.5 text-sm">
                <input
                  type="checkbox"
                  checked={areaOver1000}
                  onChange={(e) => setAreaOver1000(e.target.checked)}
                  className="h-4 w-4 accent-accent"
                />
                Более 1000 м² — расчёт индивидуально
              </label>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold">Тип помещения</label>
              <div className="grid grid-cols-2 gap-2">
                {PREMISE_OPTIONS.map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => setPremise(opt.id)}
                    className={`rounded-xl border py-2.5 text-xs font-medium ${
                      premise === opt.id
                        ? "border-accent bg-accent-soft text-accent-ink"
                        : "border-line text-ink-soft"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold">Текущее состояние</label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: "rough", label: "Черновая" },
                  { id: "finished", label: "Чистовая" },
                ].map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => setCondition(opt.id as ConditionType)}
                    className={`rounded-xl border py-2.5 text-xs font-medium ${
                      condition === opt.id
                        ? "border-accent bg-accent-soft text-accent-ink"
                        : "border-line text-ink-soft"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Шаг 4: бюджет и сроки */}
        {step === 4 && (
          <div className="space-y-6">
            <div>
              <label className="mb-2 block text-sm font-semibold">
                Бюджет за работу:{" "}
                <span className="text-accent-ink">
                  {budgetMin.toLocaleString("ru-RU")} – {budgetMax.toLocaleString("ru-RU")} ₽
                </span>
              </label>
              <div className="space-y-3 rounded-xl border border-line p-3">
                <div>
                  <span className="text-xs text-ink-soft">От</span>
                  <input
                    type="range"
                    min={1000}
                    max={budgetMax}
                    step={1000}
                    value={budgetMin}
                    onChange={(e) => setBudgetMin(Number(e.target.value))}
                    className="w-full accent-accent"
                  />
                </div>
                <div>
                  <span className="text-xs text-ink-soft">До</span>
                  <input
                    type="range"
                    min={budgetMin}
                    max={1000000}
                    step={1000}
                    value={budgetMax}
                    onChange={(e) => setBudgetMax(Number(e.target.value))}
                    className="w-full accent-accent"
                  />
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-line p-3">
              <label className="flex items-center gap-2 text-sm font-semibold">
                <input
                  type="checkbox"
                  checked={perSqmEnabled}
                  onChange={(e) => setPerSqmEnabled(e.target.checked)}
                  className="h-4 w-4 accent-accent"
                />
                Указать вилку за м² отдельно
              </label>
              {perSqmEnabled && (
                <div className="mt-3 space-y-3">
                  <p className="text-xs text-ink-soft">
                    Вилка за м²:{" "}
                    <span className="font-semibold text-accent-ink">
                      {budgetPerSqmMin.toLocaleString("ru-RU")} – {budgetPerSqmMax.toLocaleString("ru-RU")} ₽/м²
                    </span>
                  </p>
                  <div>
                    <span className="text-xs text-ink-soft">От</span>
                    <input
                      type="range"
                      min={100}
                      max={budgetPerSqmMax}
                      step={100}
                      value={budgetPerSqmMin}
                      onChange={(e) => setBudgetPerSqmMin(Number(e.target.value))}
                      className="w-full accent-accent"
                    />
                  </div>
                  <div>
                    <span className="text-xs text-ink-soft">До</span>
                    <input
                      type="range"
                      min={budgetPerSqmMin}
                      max={10000}
                      step={100}
                      value={budgetPerSqmMax}
                      onChange={(e) => setBudgetPerSqmMax(Number(e.target.value))}
                      className="w-full accent-accent"
                    />
                  </div>
                </div>
              )}
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold">Срок выполнения, дней</label>
              <input
                type="number"
                min={1}
                value={deadlineDays}
                onChange={(e) => setDeadlineDays(Math.max(1, Number(e.target.value)))}
                className="w-full rounded-xl border border-line px-3 py-2.5 text-sm"
              />
              <div className="mt-2 flex flex-wrap gap-2">
                {DEADLINE_PRESETS.map((d) => (
                  <button
                    key={d}
                    onClick={() => setDeadlineDays(d)}
                    className={`rounded-full border px-3 py-1.5 text-xs font-medium ${
                      deadlineDays === d
                        ? "border-accent bg-accent-soft text-accent-ink"
                        : "border-line text-ink-soft"
                    }`}
                  >
                    {d} дн.
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Шаг 5: описание, фото/видео, документы */}
        {step === 5 && (
          <div className="space-y-5">
            <div>
              <label className="mb-2 block text-sm font-semibold">
                Описание задачи <span className="text-accent-ink">*</span>
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={5}
                placeholder="Опишите, что нужно сделать: объём работ, есть ли материалы, особые пожелания к срокам и качеству…"
                className="w-full resize-none rounded-xl border border-line px-3 py-2.5 text-sm"
              />
            </div>

            <div>
              <p className="mb-2 text-sm font-semibold">Фото или видео (до 5, видео до 30 сек)</p>
              <div className="grid grid-cols-3 gap-2">
                {media.map((m) => (
                  <div key={m.id} className="relative aspect-square overflow-hidden rounded-xl border border-line">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={m.dataUrl} alt="" className="h-full w-full object-cover" />
                    <button
                      onClick={() => setMedia((prev) => prev.filter((x) => x.id !== m.id))}
                      className="absolute right-1 top-1 rounded-full bg-ink/70 p-1 text-white"
                    >
                      <X size={12} />
                    </button>
                    {m.isCover && (
                      <span className="absolute bottom-1 left-1 rounded bg-accent px-1.5 py-0.5 text-xs font-bold text-night">
                        Главное
                      </span>
                    )}
                  </div>
                ))}
                {media.length < 5 && (
                  <label className="flex aspect-square cursor-pointer flex-col items-center justify-center gap-1 rounded-xl border border-dashed border-line text-ink-faint">
                    <Camera size={22} />
                    <span className="text-xs">Добавить</span>
                    <input
                      type="file"
                      accept="image/*,video/*"
                      multiple
                      className="hidden"
                      onChange={(e) => handleMediaFiles(e.target.files)}
                    />
                  </label>
                )}
              </div>
            </div>

            <div>
              <p className="mb-2 text-sm font-semibold">Документы (PDF, Word)</p>
              <div className="space-y-2">
                {documents.map((doc) => (
                  <div
                    key={doc.id}
                    className="flex items-center gap-2 rounded-xl border border-line px-3 py-2"
                  >
                    <FileText size={18} className="shrink-0 text-ink-soft" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs font-medium text-ink">{doc.name}</p>
                      <p className="text-xs text-ink-faint">{doc.sizeKb} КБ</p>
                    </div>
                    <button
                      onClick={() => setDocuments((prev) => prev.filter((d) => d.id !== doc.id))}
                      className="shrink-0 rounded-full p-1 text-ink-faint active:bg-surface"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
                {documents.length < 5 && (
                  <label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-line py-2.5 text-xs font-medium text-ink-faint">
                    <Paperclip size={16} />
                    Прикрепить смету, план или ТЗ (.pdf, .doc, .docx)
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                      multiple
                      className="hidden"
                      onChange={(e) => handleDocFiles(e.target.files)}
                    />
                  </label>
                )}
              </div>
            </div>

            {uploadWarning && (
              <p className="rounded-lg bg-danger-soft px-3 py-2 text-xs text-danger">
                {uploadWarning}
              </p>
            )}
          </div>
        )}

        {/* Шаг 6: проверка */}
        {step === 6 && category && subcategory && serviceName && (
          <div className="space-y-4">
            <div className="overflow-hidden rounded-2xl border border-line">
              {media[0] && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={media[0].dataUrl} alt="" className="aspect-[4/3] w-full object-cover" />
              )}
              <div className="space-y-1.5 p-3">
                <p className="text-xs text-ok">
                  {category} · {subcategory}
                </p>
                <p className="font-display text-base font-bold">{serviceName}</p>
                <p className="text-xs text-ink-faint">{address}</p>
                <p className="text-sm text-ink-soft">
                  {areaOver1000 ? "более 1000 м²" : `${areaSqm} м²`} ·{" "}
                  {PREMISE_OPTIONS.find((p) => p.id === premise)?.label} ·{" "}
                  {condition === "rough" ? "Черновая" : "Чистовая"}
                </p>
                <p className="text-sm font-semibold text-accent-ink">
                  {budgetMin.toLocaleString("ru-RU")} – {budgetMax.toLocaleString("ru-RU")} ₽
                  {perSqmEnabled &&
                    ` (${budgetPerSqmMin.toLocaleString("ru-RU")}–${budgetPerSqmMax.toLocaleString("ru-RU")} ₽/м²)`}
                </p>
                <p className="text-xs text-ink-soft">Срок: {deadlineDays} дн.</p>
                <p className="whitespace-pre-wrap text-xs text-ink-soft">{description}</p>
                <div className="flex items-center gap-3 pt-1 text-xs text-ink-faint">
                  <span>📷 {media.length} фото/видео</span>
                  {documents.length > 0 && <span>📎 {documents.length} файлов</span>}
                </div>
              </div>
            </div>
            <p className="text-xs text-ink-soft">
              После публикации заказ появится в общей ленте и мастера с подходящей
              специализацией получат уведомление.
            </p>
          </div>
        )}
      </main>

      <footer className="border-t border-line px-4 py-3 lg:px-8 lg:py-5">
        {publishError && (
          <p className="mb-2 rounded-lg bg-danger-soft px-3 py-2 text-xs text-danger">
            {publishError}
          </p>
        )}
        {step < 6 ? (
          <button
            disabled={!canNext}
            onClick={() => setStep(step + 1)}
            className="w-full rounded-xl bg-accent py-3 text-center font-semibold text-night transition disabled:opacity-40 lg:w-auto lg:px-10"
          >
            Далее
          </button>
        ) : (
          <button
            onClick={publish}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-accent py-3 text-center font-semibold text-night lg:w-auto lg:px-10"
          >
            <Check size={18} /> Опубликовать
          </button>
        )}
      </footer>
      </div>
    </div>
  );
}
