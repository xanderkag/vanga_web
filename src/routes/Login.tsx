import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input, Field } from "@/components/ui/input";
import { signIn } from "@/lib/auth";
import { AuthShell } from "@/routes/Register";

const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function Login() {
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);

  function submit(e: FormEvent) {
    e.preventDefault();
    const er: Record<string, string> = {};
    if (!emailRe.test(email)) er.email = "Некорректный email";
    if (!password) er.password = "Введите пароль";
    setErrors(er);
    if (Object.keys(er).length) return;
    setBusy(true);
    setTimeout(() => {
      signIn({ email });
      nav("/app");
    }, 500);
  }

  return (
    <AuthShell
      title="Вход в кабинет"
      alt={
        <>
          Нет аккаунта?{" "}
          <Link
            to="/register"
            className="text-[var(--color-accent)] hover:underline"
          >
            Создать
          </Link>
        </>
      }
    >
      <form onSubmit={submit} noValidate className="space-y-4">
        <Field label="Email" htmlFor="email" error={errors.email} required>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            invalid={!!errors.email}
            autoComplete="email"
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
            autoComplete="current-password"
          />
        </Field>
        <Button type="submit" size="lg" className="w-full" disabled={busy}>
          {busy ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" /> Входим…
            </>
          ) : (
            "Войти"
          )}
        </Button>
      </form>
    </AuthShell>
  );
}
