import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type Method = "GET" | "POST" | "PATCH" | "DELETE" | "PUT";

const methodCls: Record<Method, string> = {
  GET: "bg-sky-500/15 text-sky-600 dark:text-sky-400",
  POST: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
  PATCH: "bg-amber-500/15 text-amber-600 dark:text-amber-400",
  PUT: "bg-violet-500/15 text-violet-600 dark:text-violet-400",
  DELETE: "bg-red-500/15 text-red-600 dark:text-red-400",
};

export interface Param {
  name: string;
  type?: string;
  required?: boolean;
  desc: string;
}

export interface StatusCode {
  code: number | string;
  desc: string;
}

export function EndpointCard({
  method,
  path,
  title,
  auth = true,
  params,
  body,
  response,
  statuses,
  children,
}: {
  method: Method;
  path: string;
  title?: string;
  auth?: boolean;
  params?: Param[];
  body?: string;
  response?: string;
  statuses?: StatusCode[];
  children?: ReactNode;
}) {
  return (
    <div className="my-6 overflow-hidden rounded-xl border border-[var(--border)]">
      <div className="flex flex-wrap items-center gap-2 border-b border-[var(--border)] bg-[var(--surface)] px-4 py-3">
        <span
          className={cn(
            "rounded-md px-2 py-0.5 font-mono text-xs font-bold",
            methodCls[method],
          )}
        >
          {method}
        </span>
        <code className="font-mono text-sm text-[var(--fg)]">{path}</code>
        {auth && (
          <span className="ml-auto rounded border border-[var(--border)] px-1.5 py-0.5 text-[10px] uppercase tracking-wide text-[var(--muted)]">
            Bearer
          </span>
        )}
      </div>

      <div className="space-y-5 p-4">
        {title && <p className="text-sm text-[var(--muted)]">{title}</p>}
        {children}

        {params && params.length > 0 && (
          <Block label="Параметры">
            <table className="w-full text-sm">
              <tbody>
                {params.map((p) => (
                  <tr
                    key={p.name}
                    className="border-b border-[var(--border)] last:border-0"
                  >
                    <td className="py-2 pr-3 align-top font-mono text-[13px]">
                      {p.name}
                      {p.required && (
                        <span className="ml-1 text-red-500">*</span>
                      )}
                    </td>
                    <td className="py-2 pr-3 align-top font-mono text-xs text-[var(--muted)]">
                      {p.type ?? ""}
                    </td>
                    <td className="py-2 align-top text-[var(--muted)]">
                      {p.desc}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Block>
        )}

        {body && (
          <Block label="Тело запроса">
            <Snippet code={body} />
          </Block>
        )}
        {response && (
          <Block label="Пример ответа">
            <Snippet code={response} />
          </Block>
        )}

        {statuses && statuses.length > 0 && (
          <Block label="Коды статусов">
            <div className="flex flex-wrap gap-2">
              {statuses.map((s) => (
                <span
                  key={s.code}
                  className="inline-flex items-center gap-1.5 rounded-md border border-[var(--border)] bg-[var(--surface)] px-2 py-1 text-xs"
                >
                  <span className="font-mono font-semibold">{s.code}</span>
                  <span className="text-[var(--muted)]">{s.desc}</span>
                </span>
              ))}
            </div>
          </Block>
        )}
      </div>
    </div>
  );
}

function Block({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">
        {label}
      </p>
      {children}
    </div>
  );
}

function Snippet({ code }: { code: string }) {
  return (
    <pre className="overflow-x-auto rounded-lg border border-[var(--border)] bg-[var(--surface)] p-3 font-mono text-[12.5px] leading-relaxed">
      <code>{code}</code>
    </pre>
  );
}
