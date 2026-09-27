// Алфавит без визуально похожих символов: без 0/O, 1/I/L, 5/S, 2/Z —
// чтобы номер было легко продиктовать по телефону или переписать с фото.
const LETTERS = "ABCDEFGHJKMNPQRTUVWXY";
const DIGITS = "23456789";

function pick(alphabet: string): string {
  return alphabet[Math.floor(Math.random() * alphabet.length)];
}

/** Генерирует номер вида XKPQ-48213 (4 буквы + разделитель + 5 цифр). */
export function generateOrderCode(): string {
  const letters = Array.from({ length: 4 }, () => pick(LETTERS)).join("");
  const digits = Array.from({ length: 5 }, () => pick(DIGITS)).join("");
  return `${letters}-${digits}`;
}

/** Нормализует ввод пользователя для поиска: убирает пробелы/регистр/разделители. */
export function normalizeOrderCode(input: string): string {
  return input.trim().toUpperCase().replace(/[\s-]+/g, "");
}

export function codesMatch(code: string, query: string): boolean {
  return normalizeOrderCode(code) === normalizeOrderCode(query);
}
