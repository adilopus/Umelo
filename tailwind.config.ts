import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        paper: "#FFFFFF",
        // Единственная мягкая подложка: серая и зеленоватая версии
        // раньше сосуществовали как #f7f8f7 и surface — визуальный шум.
        surface: "#F2F8F5",
        line: "#E7E6E3",

        // Текст. Все три уровня проходят WCAG AA на белом (4.5:1):
        // было 2.35:1 у faint — даты и подписи были почти нечитаемы.
        ink: {
          DEFAULT: "#2B2D31",
          soft: "#55585F",
          faint: "#6A6D74",
        },
        // Фирменный акцент — жёлтый + чёрный.
        // accent.ink — цвет ТЕКСТА на светлом фоне (надзаголовки, «смотреть все»).
        // Значение выбрано пользователем: #F3C500 (тёплый жёлтый, оттенок 47°).
        // ВНИМАНИЕ: на светлых фонах он даёт 1.5–1.6:1 — это НИЖЕ порога WCAG
        // AA (4.5:1). Светло-жёлтый как текст на белом нечитаем; читаемый
        // вариант того же жёлтого — только как заливка с тёмным текстом.
        accent: {
          DEFAULT: "#F5C400",
          dark: "#E0B400",
          ink: "#F3C500",
          soft: "#FFF4BF",
        },
        // Тёмные блоки и шапка. Раньше литерал #111419 жил в разметке.
        night: {
          DEFAULT: "#111419",
          soft: "#1B1F26",
          line: "#25292E",
        },
        // Статусы. ok и warn затемнены до 4.5:1 на белом — раньше зелёный
        // давал 4.35:1, а оранжевый 3.34:1, то есть был нечитаем как текст.
        ok: {
          DEFAULT: "#1C7C4D",
          soft: "#E7F5EC",
        },
        warn: {
          DEFAULT: "#A8631A",
          soft: "#FBF0E1",
        },
        danger: {
          DEFAULT: "#C93B3B",
          soft: "#FBECEC",
        },
      },
      fontFamily: {
        // Системный стек: не тянем Google Fonts (частично недоступен из РФ),
        // на Windows даёт Segoe UI вместо Arial — заметно аккуратнее.
        display: [
          "-apple-system",
          "BlinkMacSystemFont",
          '"Segoe UI"',
          "Roboto",
          '"Helvetica Neue"',
          "Arial",
          "sans-serif",
        ],
        body: [
          "-apple-system",
          "BlinkMacSystemFont",
          '"Segoe UI"',
          "Roboto",
          '"Helvetica Neue"',
          "Arial",
          "sans-serif",
        ],
      },
      // Монотонная шкала: раньше 2xl (28px) был больше 3xl (24px).
      borderRadius: {
        sm: "0.375rem",
        md: "0.5rem",
        lg: "0.75rem",
        xl: "1rem",
        "2xl": "1.25rem",
        "3xl": "1.75rem",
      },
      // Именованные тени вместо четырёх ad-hoc значений и нерабочего shadow-accent.
      boxShadow: {
        card: "0 1px 2px rgba(43, 45, 49, 0.04), 0 6px 16px rgba(43, 45, 49, 0.05)",
        "card-hover": "0 2px 4px rgba(43, 45, 49, 0.05), 0 14px 32px rgba(43, 45, 49, 0.10)",
        pop: "0 8px 20px rgba(43, 45, 49, 0.10), 0 32px 64px rgba(43, 45, 49, 0.16)",
        nav: "0 1px 0 rgba(43, 45, 49, 0.06), 0 6px 18px rgba(43, 45, 49, 0.05)",
        accent: "0 6px 18px rgba(245, 196, 0, 0.42)",
        "on-accent": "0 2px 8px rgba(43, 45, 49, 0.45)",
      },
      // Четыре осмысленные ширины вместо четырнадцати произвольных.
      maxWidth: {
        shell: "1480px",
        page: "1280px",
        content: "880px",
        form: "720px",
      },
    },
  },
  plugins: [],
};

export default config;
