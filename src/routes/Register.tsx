import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FileJson, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input, Field } from "@/components/ui/input";
import { signIn } from "@/lib/auth";

const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function Register() {
  const nav = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);

  function submit(e: FormEvent) {
    e.preventDefault();
    const er: Record<string, string> = {};
    if (!name.trim()) er.name = "Укажите имя";
    if (!emailRe.test(email)) er.email = "Некорректный email";
    if (password.length < 6) er.password = "Минимум 6 символов";
    setErrors(er);
    if (Object.keys(er).length) return;
    setBusy(true);
    // заглушка: реального бэкенда нет — заводим демо-сессию
    setTimeout(() => {
      signIn({ email, name, company });
      nav("/app");
    }, 600);
  }

  return (
    <AuthShell
      title="Создать аккаунт"
      subtitle="14 дней бесплатно · карта не нужна"
      alt={
        <>
          Уже есть аккаунт?{" "}
          <Link to="/login" className="text-[var(--color-accent)] hover:underline">
            Войти
          </Link>
        </>
      }
    >
      <form onSubmit={submit} noValidate className="space-y-4">
        <Field label="Имя" htmlFor="name" error={errors.name} required>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            invalid={!!errors.name}
            autoComplete="name"
          />
        </Field>
        <Field label="Рабочий email" htmlFor="email" error={errors.email} required>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            invalid={!!errors.email}
            autoComplete="email"
          />
        </Field>
        <Field label="Компания" htmlFor="company">
          <Input
            id="company"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            autoComplete="organization"
          />
        </Field>
        <Field
          label="Пароль"
          htmlFor="password"
          error={errors.password}
          required
        >
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            invalid={!!errors.password}
            autoComplete="new-password"
          />
        </Field>
        <Button type="submit" size="lg" className="w-full" disabled={busy}>
          {busy ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" /> Создаём…
            </>
          ) : (
            "Создать аккаунт"
          )}
        </Button>
      </form>
      <p className="mt-4 text-center text-xs text-[var(--muted)]">
        Нажимая «Создать аккаунт», вы соглашаетесь с условиями и политикой
        обработки данных.
      </p>
    </AuthShell>
  );
}

export function AuthShell({
  title,
  subtitle,
  alt,
  children,
}: {
  title: string;
  subtitle?: string;
  alt?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="relative mx-auto flex min-h-[calc(100vh-4rem)] max-w-md flex-col justify-center px-5 py-12">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-64 bg-[radial-gradient(60%_60%_at_50%_0%,color-mix(in_oklab,var(--color-accent)_14%,transparent),transparent)]"
      />
      <div className="relative">
        <Link to="/" className="flex items-center justify-center gap-2">
          <FileJson className="h-6 w-6 text-[var(--color-accent)]" />
          <span className="text-lg font-semibold">Doc Parser</span>
        </Link>
        <div className="mt-6 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-xl shadow-black/5">
          <h1 className="text-center text-xl font-bold tracking-tight">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-1 text-center text-sm text-[var(--muted)]">
              {subtitle}
            </p>
          )}
          <div className="mt-6">{children}</div>
        </div>
        {alt && (
          <p className="mt-5 text-center text-sm text-[var(--muted)]">{alt}</p>
        )}
        <p className="mt-3 text-center text-[11px] text-[var(--muted)]">
          Закрытая бета · демо-режим
        </p>
      </div>
    </section>
  );
}
