import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  FileText,
  ListChecks,
  KeyRound,
  Webhook,
  Settings,
  Upload,
  Lock,
  LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth, signOut } from "@/lib/auth";

const navItems = [
  { icon: LayoutDashboard, label: "Обзор", active: true },
  { icon: FileText, label: "Документы" },
  { icon: ListChecks, label: "Задания" },
  { icon: KeyRound, label: "API-ключи" },
  { icon: Webhook, label: "Вебхуки" },
  { icon: Settings, label: "Настройки" },
];

const stats = [
  { label: "Обработано", value: "0", hint: "за всё время" },
  { label: "В очереди", value: "0", hint: "сейчас" },
  { label: "Точность", value: "—", hint: "ещё нет данных" },
  { label: "Тариф", value: "Trial", hint: "14 дней" },
];

export function Dashboard() {
  const { user, isAuthed } = useAuth();
  const nav = useNavigate();

  useEffect(() => {
    if (!isAuthed) nav("/login", { replace: true });
  }, [isAuthed, nav]);

  if (!isAuthed) return null;

  return (
    <section className="mx-auto max-w-6xl px-5 py-8">
      <title>Личный кабинет — Doc Parser</title>

      {/* бета-баннер */}
      <div className="mb-6 flex flex-wrap items-center gap-2 rounded-xl border border-amber-500/30 bg-amber-500/5 px-4 py-2.5 text-sm text-amber-700 dark:text-amber-300">
        <Lock className="h-4 w-4 shrink-0" />
        Закрытая бета — кабинет в демо-режиме. Полноценный доступ к API и
        обработке открываем по заявке на{" "}
        <Link to="/pilot" className="font-medium underline">
          пилот
        </Link>
        .
      </div>

      <div className="grid gap-6 lg:grid-cols-[220px_minmax(0,1fr)]">
        {/* сайдбар */}
        <aside>
          <div className="mb-4 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-3">
            <div className="text-sm font-medium">
              {user?.name || user?.email}
            </div>
            {user?.company && (
              <div className="text-xs text-[var(--muted)]">{user.company}</div>
            )}
            <button
              onClick={() => {
                signOut();
                nav("/");
              }}
              className="mt-2 inline-flex items-center gap-1 text-xs text-[var(--muted)] hover:text-[var(--fg)]"
            >
              <LogOut className="h-3.5 w-3.5" /> Выйти
            </button>
          </div>
          <nav className="space-y-0.5 text-sm">
            {navItems.map((n) => (
              <button
                key={n.label}
                disabled={!n.active}
                className={`flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left transition-colors ${
                  n.active
                    ? "bg-[var(--surface)] font-medium text-[var(--fg)]"
                    : "text-[var(--muted)] hover:bg-[var(--surface)] disabled:opacity-50"
                }`}
              >
                <n.icon className="h-4 w-4" />
                {n.label}
                {!n.active && (
                  <span className="ml-auto text-[10px] uppercase">скоро</span>
                )}
              </button>
            ))}
          </nav>
        </aside>

        {/* контент */}
        <div>
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold tracking-tight">
              Привет, {user?.name?.split(" ")[0] || "коллега"}
            </h1>
            <Button disabled className="cursor-not-allowed">
              <Upload className="h-4 w-4" /> Загрузить документ
            </Button>
          </div>

          {/* статы */}
          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {stats.map((s) => (
              <div
                key={s.label}
                className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4"
              >
                <div className="text-2xl font-bold">{s.value}</div>
                <div className="mt-1 text-sm">{s.label}</div>
                <div className="text-xs text-[var(--muted)]">{s.hint}</div>
              </div>
            ))}
          </div>

          {/* последние задания — пустое состояние */}
          <div className="mt-6 rounded-xl border border-[var(--border)]">
            <div className="border-b border-[var(--border)] px-4 py-3 text-sm font-semibold">
              Последние задания
            </div>
            <div className="flex flex-col items-center justify-center px-4 py-14 text-center">
              <FileText className="h-8 w-8 text-[var(--muted)]" />
              <p className="mt-3 text-sm text-[var(--muted)]">
                Здесь появятся обработанные документы.
              </p>
              <Link to="/demo" className="mt-3">
                <Button variant="outline" size="sm">
                  Посмотреть демо
                </Button>
              </Link>
            </div>
          </div>

          {/* API-ключ — заглушка */}
          <div className="mt-6 rounded-xl border border-[var(--border)] p-4">
            <div className="text-sm font-semibold">API-ключ</div>
            <p className="mt-1 text-xs text-[var(--muted)]">
              Выпуск ключей откроется после активации пилота.
            </p>
            <div className="mt-3 flex items-center gap-2 rounded-lg border border-dashed border-[var(--border)] bg-[var(--surface)] px-3 py-2 font-mono text-xs text-[var(--muted)]">
              <KeyRound className="h-3.5 w-3.5" />
              dp_live_••••••••••••••••••••••••
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
