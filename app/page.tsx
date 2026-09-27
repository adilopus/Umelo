import { redirect } from "next/navigation";

export default function RootPage() {
  // Основной редирект живёт в next.config.js (redirects) — он отдаётся
  // сервером с корректным заголовком Location. Здесь оставлена заглушка
  // на случай статического экспорта, где redirects из конфига не применяются.
  redirect("/feed");
}
