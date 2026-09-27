import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        paper: "#FFFFFF",
        surface: "#F2F8F5",
        // Нейтральный графитовый — более контрастный и "не бледный" фон для текста
        ink: {
          DEFAULT: "#2B2D31",
          soft: "#6B6E76",
          faint: "#A6A9B0",
        },
        // Фирменный акцент по утверждённому макету — жёлтый + чёрный.
        accent: {
          DEFAULT: "#F5C400",
          dark: "#D6A900",
          soft: "#FFF4BF",
        },
        line: "#E7E6E3",
        ok: "#1F8A55",
        warn: "#C97A1E",
        // Зелёный «природный» акцент: подтверждения, статусы, эко-акценты.
        // Использовался в разметке (text-sage / bg-sage-soft), но не был
        // объявлен в конфиге — теперь задан явно, классы реально работают.
        sage: {
          DEFAULT: "#1F8A55",
          soft: "#E7F5EC",
        },
      },
      fontFamily: {
        display: ["var(--font-display)"],
        body: ["var(--font-body)"],
      },
      borderRadius: {
        xl: "1.25rem",
        "2xl": "1.75rem",
      },
    },
  },
  plugins: [],
};

export default config;
