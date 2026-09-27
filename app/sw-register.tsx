"use client";

import { useEffect } from "react";

export function ServiceWorkerRegister() {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {
        // Отсутствие поддержки service worker не должно ломать приложение —
        // оно продолжит работать как обычный веб-сайт.
      });
    }
  }, []);
  return null;
}
