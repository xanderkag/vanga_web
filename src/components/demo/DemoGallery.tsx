import type { DemoCase } from "@/lib/demo-source";
import { categories, type CategoryKey } from "@/lib/doc-types";
import { DocTypeIcon } from "@/lib/doc-icons";
import { cn } from "@/lib/utils";

const catTint: Record<CategoryKey, string> = {
  transport: "text-sky-600 dark:text-sky-400",
  accounting: "text-emerald-600 dark:text-emerald-400",
  legal: "text-violet-600 dark:text-violet-400",
};

export function DemoGallery({
  cases,
  selectedId,
  onSelect,
  disabled,
}: {
  cases: DemoCase[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  disabled?: boolean;
}) {
  return (
    <div
      className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-1"
      role="listbox"
      aria-label="Демо-документы"
    >
      {cases.map((c) => {
        const active = c.id === selectedId;
        return (
          <button
            key={c.id}
            role="option"
            aria-selected={active}
            disabled={disabled}
            onClick={() => onSelect(c.id)}
            className={cn(
              "flex items-center gap-2.5 rounded-xl border p-3 text-left transition-colors disabled:opacity-50",
              active
                ? "border-[var(--color-accent)] bg-[var(--color-accent)]/5"
                : "border-[var(--border)] hover:bg-[var(--surface)]",
            )}
          >
            <span className={`shrink-0 ${catTint[c.category]}`}>
              <DocTypeIcon name={c.icon} className="h-5 w-5" />
            </span>
            <span className="min-w-0">
              <span className="block truncate text-sm font-medium">
                {c.label}
              </span>
              <span className="block truncate text-xs text-[var(--muted)]">
                {categories[c.category]}
              </span>
            </span>
          </button>
        );
      })}
    </div>
  );
}
