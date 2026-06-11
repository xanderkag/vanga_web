import { Loader2, Check, Circle } from "lucide-react";
import { STAGES, type DemoResult } from "@/lib/demo-source";
import { cn } from "@/lib/utils";

type Status = "pending" | "active" | "done";

export function PipelineAnimation({
  activeStage,
  phase,
  result,
}: {
  activeStage: number;
  phase: "idle" | "running" | "done";
  result: DemoResult | null;
}) {
  function statusOf(i: number): Status {
    if (phase === "done") return "done";
    if (phase === "idle") return "pending";
    if (i < activeStage) return "done";
    if (i === activeStage) return "active";
    return "pending";
  }

  function detail(i: number, st: Status): string | null {
    if (st === "pending" || !result) return null;
    const t = result.timings[i]?.ms;
    const ms = t ? ` · ${t} мс` : "";
    switch (STAGES[i].key) {
      case "ocr":
        return `Движок: ${result.ocrEngine}${ms}`;
      case "classify":
        return `${result.type} · ${Math.round(result.confidence * 100)}%${ms}`;
      case "extract":
        return `${result.fields.length} полей${ms}`;
      case "validate": {
        const bad = result.validation.filter((v) => !v.ok).length;
        return bad === 0
          ? `${result.validation.length}/${result.validation.length} проверок ✓${ms}`
          : `${bad} флаг(а) требует внимания${ms}`;
      }
      default:
        return null;
    }
  }

  return (
    <ol className="space-y-2">
      {STAGES.map((s, i) => {
        const st = statusOf(i);
        const d = detail(i, st);
        const warn =
          s.key === "validate" &&
          st === "done" &&
          result &&
          result.validation.some((v) => !v.ok);
        return (
          <li
            key={s.key}
            className={cn(
              "flex items-start gap-3 rounded-xl border p-3 transition-colors",
              st === "active"
                ? "border-[var(--color-accent)] bg-[var(--color-accent)]/5"
                : "border-[var(--border)]",
              st === "pending" && "opacity-55",
            )}
          >
            <span className="mt-0.5">
              {st === "done" ? (
                <Check
                  className={cn(
                    "h-5 w-5",
                    warn
                      ? "text-amber-500"
                      : "text-emerald-600 dark:text-emerald-400",
                  )}
                />
              ) : st === "active" ? (
                <Loader2 className="h-5 w-5 animate-spin text-[var(--color-accent)]" />
              ) : (
                <Circle className="h-5 w-5 text-[var(--muted)]" />
              )}
            </span>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">{s.label}</span>
                <span className="font-mono text-[11px] text-[var(--muted)]">
                  {i + 1}/{STAGES.length}
                </span>
              </div>
              {d && (
                <div className="mt-0.5 font-mono text-xs text-[var(--muted)]">
                  {d}
                </div>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
