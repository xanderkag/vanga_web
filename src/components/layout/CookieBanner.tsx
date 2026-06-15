import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const KEY = "dp-cookie-ok";

export function CookieBanner() {
  const [accepted, setAccepted] = useState(() => {
    try {
      return localStorage.getItem(KEY) === "1";
    } catch {
      return true;
    }
  });

  if (accepted) return null;

  function accept() {
    try {
      localStorage.setItem(KEY, "1");
    } catch {
      /* noop */
    }
    setAccepted(true);
  }

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 px-4 pb-4">
      <div className="mx-auto flex max-w-3xl flex-col gap-3 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 shadow-xl shadow-black/10 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-[var(--muted)]">
          Мы используем cookie для работы сайта и сохранения настроек.
          Продолжая, вы соглашаетесь с{" "}
          <Link
            to="/legal/cookie"
            className="text-[var(--color-accent)] hover:underline"
          >
            политикой cookie
          </Link>
          .
        </p>
        <Button size="sm" onClick={accept} className="shrink-0">
          Принять
        </Button>
      </div>
    </div>
  );
}
