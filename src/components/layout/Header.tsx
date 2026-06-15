import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { FileJson, Menu, X, LayoutDashboard } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";
import { cn } from "@/lib/utils";

const nav = [
  { to: "/docs", label: "Документация" },
  { to: "/demo", label: "Демо" },
  { to: "/pricing", label: "Тарифы" },
];

export function Header() {
  const { isAuthed } = useAuth();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--border)] bg-[var(--bg)]/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
        <Link to="/" className="flex items-center gap-2 font-semibold">
          <FileJson size={20} className="text-[var(--color-accent)]" />
          <span>Doc Parser</span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {nav.map((n) => (
            <NavLink
              key={n.to}
              to={n.to}
              className={({ isActive }) =>
                cn(
                  "rounded-lg px-3 py-2 text-sm transition-colors hover:bg-[var(--surface)]",
                  isActive && "text-[var(--color-accent)] font-medium",
                )
              }
            >
              {n.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          {isAuthed ? (
            <Link to="/app" className="hidden md:block">
              <Button variant="outline" size="sm">
                <LayoutDashboard className="h-4 w-4" /> Кабинет
              </Button>
            </Link>
          ) : (
            <div className="hidden items-center gap-2 md:flex">
              <Link to="/login">
                <Button variant="ghost" size="sm">
                  Войти
                </Button>
              </Link>
              <Link to="/register">
                <Button size="sm">Начать</Button>
              </Link>
            </div>
          )}
          <button
            className="rounded-lg p-2 hover:bg-[var(--surface)] md:hidden"
            aria-label="Меню"
            onClick={() => setOpen((o) => !o)}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* мобильное меню */}
      {open && (
        <div className="border-t border-[var(--border)] bg-[var(--bg)] md:hidden">
          <nav className="mx-auto flex max-w-6xl flex-col gap-1 px-5 py-3">
            {nav.map((n) => (
              <NavLink
                key={n.to}
                to={n.to}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  cn(
                    "rounded-lg px-3 py-2 text-sm hover:bg-[var(--surface)]",
                    isActive && "font-medium text-[var(--color-accent)]",
                  )
                }
              >
                {n.label}
              </NavLink>
            ))}
            <div className="mt-2 flex gap-2">
              {isAuthed ? (
                <Link
                  to="/app"
                  onClick={() => setOpen(false)}
                  className="flex-1"
                >
                  <Button variant="outline" className="w-full">
                    Кабинет
                  </Button>
                </Link>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={() => setOpen(false)}
                    className="flex-1"
                  >
                    <Button variant="outline" className="w-full">
                      Войти
                    </Button>
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setOpen(false)}
                    className="flex-1"
                  >
                    <Button className="w-full">Начать</Button>
                  </Link>
                </>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
