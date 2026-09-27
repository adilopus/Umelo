/**
 * Сжимает изображение перед сохранением как base64: реальные фото с телефона
 * (3-8 МБ) без сжатия почти сразу переполняют квоту localStorage (~5-10 МБ на
 * домен суммарно). Уменьшаем до разумного максимума и конвертируем в JPEG.
 */
export function compressImage(
  file: File,
  maxDimension = 1280,
  quality = 0.72
): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(objectUrl);

      let { width, height } = img;
      if (width > maxDimension || height > maxDimension) {
        const ratio = Math.min(maxDimension / width, maxDimension / height);
        width = Math.round(width * ratio);
        height = Math.round(height * ratio);
      }

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject(new Error("Canvas 2D context недоступен"));
        return;
      }
      ctx.drawImage(img, 0, 0, width, height);
      resolve(canvas.toDataURL("image/jpeg", quality));
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error("Не удалось загрузить изображение"));
    };

    img.src = objectUrl;
  });
}

/**
 * Видео не сжимаем на клиенте (это отдельная, более тяжёлая задача — в реальном
 * приложении файл должен сразу уходить на сервер/объектное хранилище через
 * presigned URL). В демо-версии храним только метку с названием файла, чтобы
 * не переполнять localStorage бинарными данными видео.
 */
export function videoPlaceholder(fileName: string): string {
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='400' height='300'>
    <rect width='100%' height='100%' fill='#2B2D31'/>
    <text x='50%' y='46%' font-family='sans-serif' font-size='40' fill='#FF6B1A'
      text-anchor='middle' dominant-baseline='middle'>▶</text>
    <text x='50%' y='68%' font-family='sans-serif' font-size='13' fill='#ffffff'
      text-anchor='middle' dominant-baseline='middle'>${fileName.slice(0, 28)}</text>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}
