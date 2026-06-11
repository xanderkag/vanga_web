import { Info, TriangleAlert, CheckCircle2, OctagonAlert } from "lucide-react";
import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";

type Kind = "info" | "warning" | "success" | "danger";

const styles: Record<Kind, { icon: LucideIcon; cls: string }> = {
  info: {
    icon: Info,
    cls: "border-sky-500/30 bg-sky-500/5 text-sky-700 dark:text-sky-300",
  },
  warning: {
    icon: TriangleAlert,
    cls: "border-amber-500/30 bg-amber-500/5 text-amber-700 dark:text-amber-300",
  },
  success: {
    icon: CheckCircle2,
    cls: "border-emerald-500/30 bg-emerald-500/5 text-emerald-700 dark:text-emerald-300",
  },
  danger: {
    icon: OctagonAlert,
    cls: "border-red-500/30 bg-red-500/5 text-red-700 dark:text-red-300",
  },
};

export function Callout({
  type = "info",
  title,
  children,
}: {
  type?: Kind;
  title?: string;
  children: ReactNode;
}) {
  const { icon: Icon, cls } = styles[type];
  return (
    <div className={`my-5 flex gap-3 rounded-xl border p-4 ${cls}`}>
      <Icon className="mt-0.5 h-5 w-5 shrink-0" aria-hidden />
      <div className="min-w-0 text-sm text-[var(--fg)]">
        {title && <p className="mb-1 font-semibold">{title}</p>}
        <div className="[&_p]:my-1 [&_code]:text-[var(--fg)]">{children}</div>
      </div>
    </div>
  );
}
