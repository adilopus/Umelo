"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { BadgeCheck, Check, Plus, Save, ShieldCheck, Star, Wrench, X } from "lucide-react";
import { useAppStore } from "@/lib/store";
import { SPECIALIST_ME } from "@/lib/mockSpecialists";
import { pluralize } from "@/lib/format";
import type { MasterProfile } from "@/lib/types";

function TagEditor({
  label,
  placeholder,
  values,
  onChange,
}: {
  label: string;
  placeholder: string;
  values: string[];
  onChange: (values: string[]) => void;
}) {
  const [draft, setDraft] = useState("");

  function add() {
    const value = draft.trim();
    if (!value || values.includes(value)) {
      setDraft("");
      return;
    }
    onChange([...values, value]);
    setDraft("");
  }

  return (
    <div>
      <label className="mb-1 block text-xs font-medium text-ink-soft">{label}</label>
      <div className="flex flex-wrap gap-1.5">
        {values.map((value) => (
          <span key={value} className="flex items-center gap-1 rounded-full bg-surface px-2.5 py-1 text-xs font-bold text-ink-soft">
            {value}
            <button onClick={() => onChange(values.filter((v) => v !== value))} aria-label={`Убрать ${value}`}>
              <X size={12} />
            </button>
          </span>
        ))}
      </div>
      <div className="mt-2 flex items-center gap-2">
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && add()}
          placeholder={placeholder}
          className="min-w-0 flex-1 rounded-lg border border-line px-3 py-2 text-sm outline-none placeholder:text-ink-faint"
        />
        <button onClick={add} className="rounded-lg border border-line p-2 text-ink-soft" aria-label="Добавить">
          <Plus size={16} />
        </button>
      </div>
    </div>
  );
}

export function MasterProfilePanel() {
  const stored = useAppStore((s) => s.masterProfile);
  const updateMasterProfile = useAppStore((s) => s.updateMasterProfile);
  const portfolio = useAppStore((s) => s.portfolio);

  const [draft, setDraft] = useState<MasterProfile>(stored);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setDraft(stored);
  }, [stored]);

  const myWorks = useMemo(
    () => portfolio.filter((p) => p.specialistId === SPECIALIST_ME),
    [portfolio]
  );

  function set<K extends keyof MasterProfile>(key: K, value: MasterProfile[K]) {
    setDraft((prev) => ({ ...prev, [key]: value }));
    setSaved(false);
  }

  function handleSave() {
    updateMasterProfile(draft);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3 rounded-2xl border border-line p-4">
        <span className="flex h-11 w-11 items-center justify-center rounded-full bg-accent-soft text-accent-ink">
          <Wrench size={20} />
        </span>
        <div>
          <p className="font-display text-sm font-extrabold">Профиль мастера</p>
          <p className="text-xs text-ink-soft">Так вас видят заказчики в каталоге специалистов.</p>
        </div>
      </div>

      <div className="space-y-3 rounded-2xl border border-line p-4">
        <p className="font-display text-sm font-bold">Специализация</p>
        <div>
          <label className="mb-1 block text-xs font-medium text-ink-soft">Профессия / направление</label>
          <input
            value={draft.profession}
            onChange={(e) => set("profession", e.target.value)}
            placeholder="Например: Сантехника · отопление"
            className="w-full rounded-lg border border-line px-3 py-2 text-sm outline-none placeholder:text-ink-faint"
          />
        </div>
        <TagEditor
          label="Направления работ"
          placeholder="Добавить направление и Enter"
          values={draft.services}
          onChange={(values) => set("services", values)}
        />
        <TagEditor
          label="Инструменты и навыки"
          placeholder="Например: Пайка PPR"
          values={draft.skills}
          onChange={(values) => set("skills", values)}
        />
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1 block text-xs font-medium text-ink-soft">Опыт, лет</label>
            <input
              type="number"
              min={0}
              value={draft.experienceYears}
              onChange={(e) => set("experienceYears", Number(e.target.value))}
              className="w-full rounded-lg border border-line px-3 py-2 text-sm outline-none"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-ink-soft">Цена от</label>
            <input
              value={draft.priceFrom}
              onChange={(e) => set("priceFrom", e.target.value)}
              placeholder="от 1 500 ₽/м²"
              className="w-full rounded-lg border border-line px-3 py-2 text-sm outline-none placeholder:text-ink-faint"
            />
          </div>
        </div>
        <button
          onClick={() => set("verified", !draft.verified)}
          className={`flex w-full items-center gap-2 rounded-lg border px-3 py-2.5 text-left text-sm transition ${
            draft.verified ? "border-ok bg-ok-soft text-ok" : "border-line text-ink-soft"
          }`}
        >
          <ShieldCheck size={16} />
          {draft.verified ? "Документы и страховка подтверждены" : "Подтвердить документы и страховку"}
          {draft.verified && <Check size={15} className="ml-auto" />}
        </button>
      </div>

      <button
        onClick={handleSave}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-accent py-2.5 text-sm font-semibold text-night"
      >
        {saved ? (
          <>
            <Check size={16} /> Сохранено
          </>
        ) : (
          <>
            <Save size={16} /> Сохранить профиль
          </>
        )}
      </button>

      <div className="space-y-3 rounded-2xl border border-line p-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="font-display text-sm font-bold">Портфолио</p>
            <p className="text-xs text-ink-soft">
              {myWorks.length} {pluralize(myWorks.length, "работа", "работы", "работ")}
            </p>
          </div>
          <Link
            href="/portfolio"
            className="flex items-center gap-1.5 rounded-xl bg-accent px-3.5 py-2 text-xs font-bold text-night"
          >
            <Plus size={14} /> Добавить
          </Link>
        </div>

        {myWorks.slice(0, 3).map((item) => (
          <div key={item.id} className="flex gap-3 rounded-xl border border-line p-3">
            <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-surface">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={item.coverUrl} alt="" className="h-full w-full object-cover" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-bold text-ink">{item.title}</p>
              <p className="text-xs text-ink-soft">{item.category}</p>
              <div className="mt-1 flex items-center gap-3 text-xs text-ink-faint">
                <span className="flex items-center gap-1">
                  <Star size={11} /> {item.likes}
                </span>
                {item.price && <span className="font-semibold text-ink-soft">{item.price}</span>}
              </div>
            </div>
          </div>
        ))}

        <Link
          href="/portfolio"
          className="flex items-center justify-center gap-1.5 rounded-xl border border-line py-2.5 text-xs font-bold text-ink-soft"
        >
          Открыть портфолио
        </Link>
      </div>

      <p className="flex items-center justify-center gap-1.5 text-center text-xs text-ink-faint">
        <BadgeCheck size={12} /> Профиль и работы видны в каталоге специалистов.
      </p>
    </div>
  );
}
