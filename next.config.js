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
  async redirects() {
    return [
      {
        source: "/",
        destination: "/feed",
        permanent: false,
      },
    ];
  },
};

module.exports = nextConfig;
