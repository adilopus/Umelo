/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Редирект с "/" на "/feed" задаётся здесь, а не через redirect() в
  // app/page.tsx: страница "/" статически пререндерится, и redirect()
  // превращается в 307 без заголовка Location — браузер показывает ошибку,
  // а CDN ещё и кэширует такой ответ.
  // Тот же приём для "/projects": проекты стали подразделом Журнала
  // (/articles?tab=projects), поэтому старый адрес отдаём редиректом, а не
  // отдельной страницей. Так ссылка отдаётся сразу, до отрисовки страницы.
  async redirects() {
    return [
      {
        source: "/",
        destination: "/feed",
        permanent: false,
      },
      {
        source: "/projects",
        destination: "/articles?tab=projects",
        permanent: false,
      },
    ];
  },
};

module.exports = nextConfig;
