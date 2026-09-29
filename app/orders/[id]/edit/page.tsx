"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  Camera,
  ChevronLeft,
  FileText,
  Paperclip,
  Pencil,
  X,
} from "lucide-react";

import { useAppStore } from "@/lib/store";
import { CUSTOMER_ME } from "@/lib/mockData";
import { getServices, getSubcategories } from "@/lib/jobCategories";
import { compressImage, videoPlaceholder } from "@/lib/imageCompress";
import type { ConditionType, OrderDocument, OrderMedia, PremiseType } from "@/lib/types";
import { STATUS_META } from "@/lib/status";
import { Button } from "@/components/ui/Button";
import { Chip } from "@/components/ui/Chip";

const PREMISE_OPTIONS: { id: PremiseType; label: string }[] = [
  { id: "new", label: "Новостройка" },
  { id: "secondary", label: "Вторичка" },
  { id: "commercial", label: "Коммерция" },
  { id: "country", label: "Загородный объект" },
];

const INPUT =
  "w-full rounded-xl border border-line px-3 py-2.5 text-sm outline-none focus:border-accent";

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function Guard({ title, text, backHref }: { title: string; text: string; backHref: string }) {
  return (
    <div className="flex flex-1 flex-col">
      <header className="flex items-center gap-3 border-b border-line px-4 py-3">
        <Link
          href={backHref}
          aria-label="Назад"
          className="-m-2 rounded-full p-2 text-ink-soft active:bg-surface"
        >
          <ChevronLeft size={22} />
        </Link>
        <p className="font-display text-lg font-extrabold">Изменение заказа</p>
      </header>
      <main className="flex-1 px-4 pt-10 text-center sm:px-6">
        <p className="font-display text-base font-bold">{title}</p>
        <p className="mt-2 text-sm text-ink-soft">{text}</p>
        <ButtonLinkBack href={backHref} />
      </main>
    </div>
  );
}

function ButtonLinkBack({ href }: { href: string }) {
  return (
    <Link
      href={href}
      className="mt-4 inline-flex items-center justify-center rounded-full bg-accent px-6 py-2.5 text-sm font-bold text-night"
    >
      Вернуться к заказу
    </Link>
  );
}

export default function EditOrderPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const order = useAppStore((s) => s.orders.find((o) => o.id === params.id));
  const updateOrder = useAppStore((s) => s.updateOrder);

  const [category, setCategory] = useState(order?.category ?? "");
  const [subcategory, setSubcategory] = useState(order?.subcategory ?? "");
  const [serviceName, setServiceName] = useState(order?.serviceName ?? "");
  const [areaSqm, setAreaSqm] = useState(order?.areaSqm ?? 0);
  const [address, setAddress] = useState(order?.address ?? "");
  const [premise, setPremise] = useState<PremiseType>(order?.premise ?? "secondary");
  const [condition, setCondition] = useState<ConditionType>(order?.condition ?? "rough");
  const [budgetMin, setBudgetMin] = useState(order?.budgetMin ?? 0);
  const [budgetMax, setBudgetMax] = useState(order?.budgetMax ?? 0);
  const [deadlineDays, setDeadlineDays] = useState(order?.deadlineDays ?? 7);
  const [description, setDescription] = useState(order?.description ?? "");
  const [media, setMedia] = useState<OrderMedia[]>(order?.media ?? []);
  const [documents, setDocuments] = useState<OrderDocument[]>(order?.documents ?? []);
  const [error, setError] = useState<string | null>(null);

  if (!order) {
    return (
      <Guard
        title="Заказ не найден"
        text="Возможно, он был удалён. Откройте список заказов и выберите другой."
        backHref="/my-orders"
      />
    );
  }

  // Правка доступна только автору. Роли недостаточно: заказчик в приложении
  // один, а заказы в каталоге принадлежат разным людям.
  if (order.authorId !== CUSTOMER_ME) {
    return (
      <Guard
        title="Это не ваш заказ"
        text="Изменять заказ может только его автор — заказчик, который разместил объявление."
        backHref={`/orders/${order.id}`}
      />
    );
  }

  // Заказ в работе уже отдан мастеру: правка условий сбила бы оплаченную
  // договорённость, а завершённый закрыт навсегда.
  if (order.status === "matched" || order.status === "closed") {
    return (
      <Guard
        title={order.status === "matched" ? "Заказ уже в работе" : "Заказ завершён"}
        text={
          order.status === "matched"
            ? "Работа уже передана мастеру, поэтому условия изменить нельзя."
            : "Завершённый заказ менять нельзя — он остаётся в истории."
        }
        backHref={`/orders/${order.id}`}
      />
    );
  }

  const subcategories = getSubcategories(category);
  const services = category && subcategory ? getServices(category, subcategory) : [];

  async function handleMediaFiles(files: FileList | null) {
    if (!files) return;
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
        setError("Не удалось обработать файл — попробуйте другой формат.");
      }
    }
  }

  async function handleDocFiles(files: FileList | null) {
    if (!files) return;
    const remaining = 5 - documents.length;
    const MAX_DOC_MB = 8;
    for (const file of Array.from(files).slice(0, remaining)) {
      if (file.size > MAX_DOC_MB * 1024 * 1024) {
        setError(`Файл «${file.name}» больше ${MAX_DOC_MB} МБ — сожмите его перед загрузкой.`);
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

  function save() {
    if (!order) return;
    if (!address.trim()) {
      setError("Укажите адрес объекта.");
      return;
    }
    if (budgetMin > budgetMax) {
      setError("Минимальный бюджет не может быть больше максимального.");
      return;
    }
    if (media.length === 0) {
      setError("Добавьте хотя бы одно фото — без него мастера хуже откликаются.");
      return;
    }
    try {
      updateOrder(order.id, {
        category: category || order.category,
        subcategory: subcategory || order.subcategory,
        serviceName: serviceName.trim() || order.serviceName,
        areaSqm: Number.isFinite(areaSqm) && areaSqm > 0 ? areaSqm : order.areaSqm,
        areaOver1000: areaSqm > 1000,
        address: address.trim(),
        premise,
        condition,
        budgetMin,
        budgetMax,
        deadlineDays: deadlineDays > 0 ? deadlineDays : order.deadlineDays,
        description: description.trim(),
        media,
        documents,
      });
      router.push(`/orders/${order.id}`);
    } catch {
      setError(
        "Не хватает места в хранилище браузера для вложений. Уменьшите количество фото или документов."
      );
    }
  }

  return (
    <div className="flex flex-1 flex-col">
      <header className="flex items-center gap-3 border-b border-line px-4 py-3 lg:mx-auto lg:w-full lg:max-w-content lg:border-0 lg:px-0 lg:pb-4 lg:pt-8">
        <button
          onClick={() => router.push(`/orders/${order.id}`)}
          aria-label="Назад"
          className="-m-2 rounded-full p-2 text-ink-soft active:bg-surface"
        >
          <ChevronLeft size={22} />
        </button>
        <div className="min-w-0 flex-1">
          <p className="font-display text-lg font-extrabold">Изменение заказа</p>
          <p className="flex items-center gap-2 text-xs text-ink-soft">
            № {order.code}
            <Chip size="sm" tone={STATUS_META[order.status].tone}>
              {STATUS_META[order.status].label}
            </Chip>
          </p>
        </div>
      </header>

      <main className="flex-1 space-y-6 px-4 pt-6 pb-32 sm:px-6 lg:px-8 lg:mx-auto lg:w-full lg:max-w-content lg:pb-12">
        <p className="rounded-xl bg-accent-soft px-3 py-2.5 text-xs text-accent-ink">
          Меняется содержание заказа. Номер, дата размещения и авторство остаются прежними —
          по номеру мастера уже переписываются.
        </p>

        <div className="space-y-4">
          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold">Категория работ</span>
            <input
              value={category}
              onChange={(e) => {
                setCategory(e.target.value);
                setSubcategory("");
                setServiceName("");
              }}
              aria-label="Категория работ"
              className={INPUT}
            />
          </label>

          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold">Вид работ</span>
            {subcategories.length > 0 ? (
              <select
                value={subcategory}
                onChange={(e) => {
                  setSubcategory(e.target.value);
                  setServiceName("");
                }}
                aria-label="Вид работ"
                className={INPUT}
              >
                <option value="">— выберите —</option>
                {subcategories.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            ) : (
              <input
                value={subcategory}
                onChange={(e) => setSubcategory(e.target.value)}
                aria-label="Вид работ"
                className={INPUT}
              />
            )}
          </label>

          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold">Услуга</span>
            {services.length > 0 ? (
              <select
                value={serviceName}
                onChange={(e) => setServiceName(e.target.value)}
                aria-label="Услуга"
                className={INPUT}
              >
                <option value="">— выберите —</option>
                {services.map((s) => (
                  <option key={s.service_name} value={s.service_name}>
                    {s.service_name}
                  </option>
                ))}
              </select>
            ) : (
              <input
                value={serviceName}
                onChange={(e) => setServiceName(e.target.value)}
                aria-label="Услуга"
                className={INPUT}
              />
            )}
          </label>
        </div>

        <div className="space-y-4">
          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold">Адрес объекта</span>
            <input
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              aria-label="Адрес объекта"
              className={INPUT}
            />
          </label>

          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold">Площадь, м²</span>
            <input
              type="number"
              min={1}
              value={areaSqm}
              onChange={(e) => setAreaSqm(Number(e.target.value))}
              aria-label="Площадь в квадратных метрах"
              className={INPUT}
            />
          </label>

          <div>
            <span className="mb-2 block text-sm font-semibold">Тип помещения</span>
            <div className="grid grid-cols-2 gap-2">
              {PREMISE_OPTIONS.map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setPremise(opt.id)}
                  aria-pressed={premise === opt.id}
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
            <span className="mb-2 block text-sm font-semibold">Текущее состояние</span>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: "rough", label: "Черновая" },
                { id: "finished", label: "Чистовая" },
              ].map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setCondition(opt.id as ConditionType)}
                  aria-pressed={condition === opt.id}
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

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <label className="block">
              <span className="mb-1.5 block text-sm font-semibold">Бюджет от, ₽</span>
              <input
                type="number"
                min={0}
                step={1000}
                value={budgetMin}
                onChange={(e) => setBudgetMin(Number(e.target.value))}
                aria-label="Бюджет от"
                className={INPUT}
              />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-sm font-semibold">Бюджет до, ₽</span>
              <input
                type="number"
                min={0}
                step={1000}
                value={budgetMax}
                onChange={(e) => setBudgetMax(Number(e.target.value))}
                aria-label="Бюджет до"
                className={INPUT}
              />
            </label>
          </div>

          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold">Срок выполнения, дней</span>
            <input
              type="number"
              min={1}
              value={deadlineDays}
              onChange={(e) => setDeadlineDays(Number(e.target.value))}
              aria-label="Срок выполнения в днях"
              className={INPUT}
            />
          </label>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-semibold">Описание задачи</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={5}
            aria-label="Описание задачи"
            className="w-full resize-none rounded-xl border border-line px-3 py-2.5 text-sm outline-none focus:border-accent"
          />
        </div>

        <div>
          <p className="mb-2 text-sm font-semibold">Фото или видео (до 5)</p>
          <div className="grid grid-cols-3 gap-2">
            {media.map((m) => (
              <div
                key={m.id}
                className="relative aspect-square overflow-hidden rounded-xl border border-line"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={m.dataUrl} alt="" className="h-full w-full object-cover" />
                <button
                  type="button"
                  onClick={() => setMedia((prev) => prev.filter((x) => x.id !== m.id))}
                  aria-label="Удалить фото"
                  className="absolute right-1 top-1 rounded-full bg-ink/70 p-1 text-white"
                >
                  <X size={12} />
                </button>
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
                  type="button"
                  onClick={() => setDocuments((prev) => prev.filter((d) => d.id !== doc.id))}
                  aria-label={`Удалить документ ${doc.name}`}
                  className="shrink-0 rounded-full p-1 text-ink-faint active:bg-surface"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
            {documents.length < 5 && (
              <label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-line py-2.5 text-xs font-medium text-ink-faint">
                <Paperclip size={16} />
                Прикрепить смету, план или ТЗ
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  multiple
                  className="hidden"
                  onChange={(e) => handleDocFiles(e.target.files)}
                />
              </label>
            )}
          </div>
        </div>

        {error && (
          <p role="alert" className="rounded-xl bg-danger/10 px-3 py-2.5 text-xs text-danger">
            {error}
          </p>
        )}
      </main>

      <div className="fixed inset-x-0 bottom-0 z-20 border-t border-line bg-paper px-4 py-3 lg:static lg:border-0 lg:bg-transparent lg:px-0">
        <div className="mx-auto flex max-w-content gap-2">
          <Button
            variant="outline"
            full
            onClick={() => router.push(`/orders/${order.id}`)}
          >
            Отмена
          </Button>
          <Button full onClick={save}>
            <Pencil size={15} /> Сохранить изменения
          </Button>
        </div>
      </div>
    </div>
  );
}
