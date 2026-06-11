import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { cn } from "@/lib/utils";

export interface CodeSample {
  label: string;
  language?: string;
  code: string;
}

/**
 * Переключатель код-сниппетов (curl / Node / Python …). Подсветка лёгкая
 * (моноширинный + единый цвет), чтобы не тащить shiki в рантайм — прозаичные
 * блоки в MDX подсвечиваются shiki на этапе сборки.
 */
export function CodeTabs({ samples }: { samples: CodeSample[] }) {
  const [active, setActive] = useState(0);
  const [copied, setCopied] = useState(false);
  const current = samples[active];

  async function copy() {
    try {
      await navigator.clipboard.writeText(current.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* noop */
    }
  }

  return (
    <div className="my-5 overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--surface)]">
      <div className="flex items-center justify-between border-b border-[var(--border)] pr-2">
        <div className="flex">
          {samples.map((s, i) => (
            <button
              key={s.label}
              onClick={() => setActive(i)}
              className={cn(
                "border-b-2 px-3.5 py-2 text-xs font-medium transition-colors",
                i === active
                  ? "border-[var(--color-accent)] text-[var(--fg)]"
                  : "border-transparent text-[var(--muted)] hover:text-[var(--fg)]",
              )}
            >
              {s.label}
            </button>
          ))}
        </div>
        <button
          onClick={copy}
          className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs text-[var(--muted)] transition-colors hover:bg-[var(--bg)] hover:text-[var(--fg)]"
          aria-label="Скопировать код"
        >
          {copied ? (
            <Check className="h-3.5 w-3.5 text-emerald-500" />
          ) : (
            <Copy className="h-3.5 w-3.5" />
          )}
        </button>
      </div>
      <pre className="overflow-x-auto bg-[var(--bg)] p-4 font-mono text-[12.5px] leading-relaxed">
        <code>{current.code}</code>
      </pre>
    </div>
  );
}
