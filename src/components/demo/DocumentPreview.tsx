import type { DemoCase } from "@/lib/demo-source";

/**
 * Превью исходного документа — «бумага», собранная из previewLines.
 * Реальный PNG-скан можно подставить позже (<img src=source.png/>),
 * не трогая остальной UI.
 */
export function DocumentPreview({ demoCase }: { demoCase: DemoCase | null }) {
  if (!demoCase) {
    return (
      <div className="flex h-full min-h-[320px] items-center justify-center rounded-xl border border-dashed border-[var(--border)] text-sm text-[var(--muted)]">
        Выберите документ слева
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-3">
      <div className="mb-2 flex items-center justify-between px-1">
        <span className="font-mono text-xs text-[var(--muted)]">
          source · {demoCase.docTypeSlug}
        </span>
        <span className="rounded border border-[var(--border)] px-1.5 py-0.5 text-[10px] uppercase text-[var(--muted)]">
          превью
        </span>
      </div>
      {/* лист «бумаги» */}
      <div className="mx-auto max-w-md rounded-md bg-white p-6 text-[12.5px] leading-relaxed text-zinc-800 shadow-sm ring-1 ring-black/5 dark:bg-zinc-100">
        <div className="text-center">
          <div className="text-sm font-bold tracking-tight">
            {demoCase.previewTitle}
          </div>
          {demoCase.previewSubtitle && (
            <div className="mt-0.5 text-[11px] text-zinc-500">
              {demoCase.previewSubtitle}
            </div>
          )}
        </div>
        <div className="mt-4 space-y-1 font-mono text-[11.5px]">
          {demoCase.previewLines.map((line, i) =>
            line === "" ? (
              <div key={i} className="h-2" />
            ) : (
              <div key={i} className="whitespace-pre-wrap break-words">
                {line}
              </div>
            ),
          )}
        </div>
      </div>
    </div>
  );
}
