import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

export function ThemeToggle() {
  const [dark, setDark] = useState<boolean>(
    () =>
      typeof document !== "undefined" &&
      document.documentElement.classList.contains("dark"),
  );

  useEffect(() => {
    const root = document.documentElement;
    if (dark) {
      root.classList.add("dark");
      localStorage.setItem("dp-theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("dp-theme", "light");
    }
  }, [dark]);

  return (
    <button
      type="button"
      aria-label={dark ? "Светлая тема" : "Тёмная тема"}
      onClick={() => setDark((v) => !v)}
      className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--border)] hover:bg-[var(--surface)] transition-colors"
    >
      {dark ? <Sun size={17} /> : <Moon size={17} />}
    </button>
  );
}
