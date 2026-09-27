"use client";

import { useEffect, useState } from "react";
import {
  Camera,
  Mail,
  Phone,
  Calendar,
  MapPin,
  User as UserIcon,
  MessageCircle,
  Send,
  Check,
} from "lucide-react";
import { useAppStore } from "@/lib/store";
import { compressImage } from "@/lib/imageCompress";
import { PersonalData } from "@/lib/types";

function Field({
  icon: Icon,
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <div>
      <label className="mb-1 block text-xs font-medium text-ink-soft">{label}</label>
      <div className="flex items-center gap-2 rounded-lg border border-line px-3 py-2">
        <Icon size={15} className="shrink-0 text-ink-faint" />
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full min-w-0 bg-transparent text-sm outline-none placeholder:text-ink-faint"
        />
      </div>
    </div>
  );
}

export function PersonalDataPanel() {
  const stored = useAppStore((s) => s.personalData);
  const updatePersonalData = useAppStore((s) => s.updatePersonalData);

  // Локальный черновик — сохраняем в стор только по кнопке "Сохранить", а не
  // на каждое нажатие клавиши, чтобы не дёргать localStorage при вводе.
  const [draft, setDraft] = useState<PersonalData>(stored);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setDraft(stored);
  }, [stored]);

  function set<K extends keyof PersonalData>(key: K, value: PersonalData[K]) {
    setDraft((prev) => ({ ...prev, [key]: value }));
    setSaved(false);
  }

  async function handleAvatar(files: FileList | null) {
    const file = files?.[0];
    if (!file) return;
    try {
      const dataUrl = await compressImage(file, 400, 0.75);
      set("avatarUrl", dataUrl);
    } catch {
      // игнорируем — аватар просто останется прежним
    }
  }

  function handleSave() {
    updatePersonalData(draft);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-full bg-surface">
          {draft.avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={draft.avatarUrl} alt="" className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <UserIcon size={28} className="text-ink-faint" />
            </div>
          )}
          <label className="absolute inset-0 flex cursor-pointer items-center justify-center bg-ink/0 transition hover:bg-ink/40 [&:hover_svg]:opacity-100">
            <Camera size={18} className="text-white opacity-0 transition" />
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => handleAvatar(e.target.files)}
            />
          </label>
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-display text-sm font-bold text-ink">
            {draft.nickname || "Без никнейма"}
          </p>
          <p className="text-xs text-ink-soft">Нажмите на фото, чтобы изменить</p>
        </div>
      </div>

      <div className="space-y-3 rounded-2xl border border-line p-4">
        <p className="font-display text-sm font-bold">Основное</p>
        <Field
          icon={UserIcon}
          label="Никнейм"
          value={draft.nickname}
          onChange={(v) => set("nickname", v)}
          placeholder="Как вас видят другие пользователи"
        />
        <Field
          icon={UserIcon}
          label="Имя и фамилия"
          value={draft.fullName}
          onChange={(v) => set("fullName", v)}
          placeholder="Иван Иванов"
        />
        <Field
          icon={Calendar}
          label="Дата рождения"
          value={draft.birthDate}
          onChange={(v) => set("birthDate", v)}
          type="date"
        />
        <Field
          icon={MapPin}
          label="Город"
          value={draft.city}
          onChange={(v) => set("city", v)}
          placeholder="Например: Москва"
        />
        <div>
          <label className="mb-1 block text-xs font-medium text-ink-soft">О себе</label>
          <textarea
            value={draft.bio}
            onChange={(e) => set("bio", e.target.value)}
            rows={3}
            placeholder="Пара слов о себе — видно другим пользователям"
            className="w-full resize-none rounded-lg border border-line px-3 py-2 text-sm outline-none placeholder:text-ink-faint"
          />
        </div>
      </div>

      <div className="space-y-3 rounded-2xl border border-line p-4">
        <p className="font-display text-sm font-bold">Контакты</p>
        <Field
          icon={Mail}
          label="Почта"
          value={draft.email}
          onChange={(v) => set("email", v)}
          placeholder="you@example.com"
          type="email"
        />
        <Field
          icon={Phone}
          label="Телефон"
          value={draft.phone}
          onChange={(v) => set("phone", v)}
          placeholder="+7 900 000-00-00"
          type="tel"
        />
        <Field
          icon={Send}
          label="Telegram"
          value={draft.telegram}
          onChange={(v) => set("telegram", v)}
          placeholder="@username"
        />
        <Field
          icon={MessageCircle}
          label="ВКонтакте"
          value={draft.vk}
          onChange={(v) => set("vk", v)}
          placeholder="vk.com/username"
        />
        <Field
          icon={MessageCircle}
          label="WhatsApp"
          value={draft.whatsapp}
          onChange={(v) => set("whatsapp", v)}
          placeholder="+7 900 000-00-00"
        />
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
          "Сохранить"
        )}
      </button>
      <p className="text-center text-xs text-ink-faint">
        Данные хранятся только в этом браузере (демо-режим без бэкенда).
      </p>
    </div>
  );
}
