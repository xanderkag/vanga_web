import { Check, TriangleAlert } from "lucide-react";
import { JsonViewer } from "@/components/docs/JsonViewer";
import type { DemoResult } from "@/lib/demo-source";
import { cn } from "@/lib/utils";

export function ResultPanel({ result }: { result: DemoResult }) {
  return (
    <div className="space-y-5">
      {/* бейджи валидации */}
      <div className="flex flex-wrap gap-2">
        {result.validation.map((v) => (
          <span
            key={v.label}
            title={v.detail}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs",
              v.ok
                ? "border-emerald-500/30 bg-emerald-500/5 text-emerald-700 dark:text-emerald-300"
                : "border-amber-500/40 bg-amber-500/10 text-amber-700 dark:text-amber-300",
            )}
          >
            {v.ok ? (
              <Check className="h-3.5 w-3.5" />
            ) : (
              <TriangleAlert className="h-3.5 w-3.5" />
            )}
            {v.label}
          </span>
        ))}
      </div>

      {/* человеческий вид полей */}
      <div className="overflow-hidden rounded-xl border border-[var(--border)]">
        <table className="w-full text-sm">
          <tbody>
            {result.fields.map((f) => (
              <tr
                key={f.label}
                className="border-b border-[var(--border)] last:border-0"
              >
                <td className="w-2/5 bg-[var(--surface)] px-3 py-2 align-top text-[var(--muted)]">
                  {f.label}
                </td>
                <td className="px-3 py-2 align-top font-medium">{f.value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* структурированный JSON */}
      <JsonViewer
        data={result.json}
        title={`result.json · ${result.type}`}
        filename={`${result.id}.json`}
      />
    </div>
  );
}
