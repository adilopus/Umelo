import { Suspense } from "react";

import { BottomNav } from "@/components/BottomNav";
import { JournalView } from "@/components/journal/JournalView";
import { PageHeader } from "@/components/ui/PageHeader";
import { PageShell } from "@/components/ui/PageShell";

// Страница остаётся статической: useSearchParams внутри JournalView читает
// адрес на клиенте, поэтому нужен <Suspense>. Пока он не готов, показываем
// ту же шапку раздела — иначе на главной странице раздела мигнёт пустота.
function JournalFallback() {
  return (
    <PageHeader
      back
      fallbackHref="/feed"
      eyebrow="Блог UMELO"
      title="Журнал"
      subtitle="Читай, вдохновляйся, будь в тренде."
    />
  );
}

export default function ArticlesPage() {
  return (
    <main className="flex-1">
      <PageShell padBottom="pb-12">
        <Suspense fallback={<JournalFallback />}>
          <JournalView />
        </Suspense>
      </PageShell>

      <BottomNav />
    </main>
  );
}
