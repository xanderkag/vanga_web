import { Link, NavLink } from "react-router-dom";
import { FileJson } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { cn } from "@/lib/utils";

const nav = [
  { to: "/docs", label: "Документация" },
  { to: "/demo", label: "Демо" },
  { to: "/pilot", label: "Пилот" },
];

export function Header() {
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
        </div>
      </div>
    </header>
  );
}
