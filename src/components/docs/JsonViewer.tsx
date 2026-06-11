import { useState } from "react";
import { ChevronRight, Check, Copy, Download } from "lucide-react";
import { cn } from "@/lib/utils";

type Json = null | boolean | number | string | Json[] | { [k: string]: Json };

function Leaf({ value }: { value: Exclude<Json, Json[] | object> }) {
  if (value === null)
    return <span className="text-[var(--muted)]">null</span>;
  if (typeof value === "boolean")
    return <span className="text-violet-500">{String(value)}</span>;
  if (typeof value === "number")
    return <span className="text-amber-600 dark:text-amber-400">{value}</span>;
  return (
    <span className="text-emerald-600 dark:text-emerald-400">
      "{value}"
    </span>
  );
}

function Node({
  k,
  value,
  depth,
  last,
}: {
  k?: string;
  value: Json;
  depth: number;
  last: boolean;
}) {
  const isObj = value !== null && typeof value === "object";
  const isArr = Array.isArray(value);
  const [open, setOpen] = useState(depth < 2);

  const keyEl = k !== undefined && (
    <span className="text-sky-600 dark:text-sky-300">"{k}"</span>
  );

  if (!isObj) {
    return (
      <div className="whitespace-pre" style={{ paddingLeft: depth * 14 }}>
        {keyEl}
        {k !== undefined && <span className="text-[var(--muted)]">: </span>}
        <Leaf value={value as Exclude<Json, Json[] | object>} />
        {!last && <span className="text-[var(--muted)]">,</span>}
      </div>
    );
  }

  const entries = isArr
    ? (value as Json[]).map((v, i) => [String(i), v] as const)
    : Object.entries(value as Record<string, Json>);
  const open_b = isArr ? "[" : "{";
  const close_b = isArr ? "]" : "}";

  return (
    <div>
      <div
        className="flex cursor-pointer items-center whitespace-pre select-none"
        style={{ paddingLeft: depth * 14 }}
        onClick={() => setOpen((o) => !o)}
      >
        <ChevronRight
          className={cn(
            "mr-0.5 h-3 w-3 shrink-0 text-[var(--muted)] transition-transform",
            open && "rotate-90",
          )}
        />
        {keyEl}
        {k !== undefined && <span className="text-[var(--muted)]">: </span>}
        <span className="text-[var(--muted)]">{open_b}</span>
        {!open && (
          <span className="text-[var(--muted)]">
            {isArr ? ` ${entries.length} ` : " … "}
            {close_b}
            {!last && ","}
          </span>
        )}
      </div>
      {open && (
        <>
          {entries.map(([ek, ev], i) => (
            <Node
              key={ek}
              k={isArr ? undefined : ek}
              value={ev}
              depth={depth + 1}
              last={i === entries.length - 1}
            />
          ))}
          <div className="whitespace-pre" style={{ paddingLeft: depth * 14 }}>
            <span className="text-[var(--muted)]">{close_b}</span>
            {!last && <span className="text-[var(--muted)]">,</span>}
          </div>
        </>
      )}
    </div>
  );
}

export function JsonViewer({
  data,
  title,
  filename = "result.json",
  actions = true,
}: {
  data: Json;
  title?: string;
  filename?: string;
  actions?: boolean;
}) {
  const [copied, setCopied] = useState(false);
  const text = JSON.stringify(data, null, 2);

  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard недоступен */
    }
  }

  function download() {
    const blob = new Blob([text], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--surface)]">
      <div className="flex items-center justify-between border-b border-[var(--border)] px-3 py-2">
        <span className="font-mono text-xs text-[var(--muted)]">
          {title ?? filename}
        </span>
        {actions && (
          <div className="flex items-center gap-1">
            <button
              onClick={copy}
              className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs text-[var(--muted)] transition-colors hover:bg-[var(--bg)] hover:text-[var(--fg)]"
              aria-label="Скопировать JSON"
            >
              {copied ? (
                <Check className="h-3.5 w-3.5 text-emerald-500" />
              ) : (
                <Copy className="h-3.5 w-3.5" />
              )}
              {copied ? "Скопировано" : "Копировать"}
            </button>
            <button
              onClick={download}
              className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs text-[var(--muted)] transition-colors hover:bg-[var(--bg)] hover:text-[var(--fg)]"
              aria-label="Скачать JSON"
            >
              <Download className="h-3.5 w-3.5" /> .json
            </button>
          </div>
        )}
      </div>
      <div className="overflow-x-auto p-3 font-mono text-[12.5px] leading-relaxed">
        <Node value={data} depth={0} last />
      </div>
    </div>
  );
}

export type { Json };
