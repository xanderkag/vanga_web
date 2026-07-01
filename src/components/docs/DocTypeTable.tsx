import { docTypes, categories, phases, type CategoryKey } from "@/lib/doc-types";
import { DocTypeIcon } from "@/lib/doc-icons";

const catCls: Record<CategoryKey, string> = {
  transport: "text-sky-600 dark:text-sky-400",
  accounting: "text-emerald-600 dark:text-emerald-400",
  legal: "text-violet-600 dark:text-violet-400",
};

const tierCls: Record<string, string> = {
  stable: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  beta: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  experimental: "bg-zinc-500/10 text-zinc-500 dark:text-zinc-400",
};

export function DocTypeTable() {
  return (
    <div className="my-6 overflow-x-auto rounded-xl border border-[var(--border)]">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-[var(--border)] bg-[var(--surface)] text-left text-xs uppercase tracking-wide text-[var(--muted)]">
            <th className="px-4 py-3 font-semibold">Тип</th>
            <th className="px-4 py-3 font-semibold">Код</th>
            <th className="px-4 py-3 font-semibold">Категория</th>
            <th className="px-4 py-3 font-semibold">Фаза парсера</th>
            <th className="px-4 py-3 font-semibold">Зрелость</th>
            <th className="px-4 py-3 font-semibold">Позиции</th>
            <th className="px-4 py-3 font-semibold">Схема</th>
          </tr>
        </thead>
        <tbody>
          {docTypes.map((t) => (
            <tr
              key={t.slug}
              className="border-b border-[var(--border)] last:border-0"
            >
              <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                  <span className={`shrink-0 ${catCls[t.category]}`}>
                    <DocTypeIcon name={t.icon} className="h-4 w-4" />
                  </span>
                  <span className="font-medium">{t.name}</span>
                </div>
              </td>
              <td className="px-4 py-3 font-mono text-xs text-[var(--muted)]">
                {t.slug}
              </td>
              <td className="px-4 py-3 text-[var(--muted)]">
                {categories[t.category]}
              </td>
              <td className="px-4 py-3 text-xs text-[var(--muted)]">
                {phases[t.phase]}
              </td>
              <td className="px-4 py-3">
                <span
                  className={`rounded px-1.5 py-0.5 text-[11px] font-medium ${tierCls[t.tier]}`}
                >
                  {t.tier}
                </span>
              </td>
              <td className="px-4 py-3 text-[var(--muted)]">
                {t.tables ? (
                  <span className="text-emerald-600 dark:text-emerald-400">
                    ✓ таблицы
                  </span>
                ) : (
                  "—"
                )}
              </td>
              <td className="px-4 py-3 text-[var(--muted)]">
                {t.hasSchema ? (
                  <span className="text-emerald-600 dark:text-emerald-400">
                    JSON Schema
                  </span>
                ) : (
                  "—"
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
