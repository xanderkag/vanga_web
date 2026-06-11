import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { CheckCircle2, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { submitLead, type LeadInput } from "@/lib/submit-lead";
import { cn } from "@/lib/utils";

type Phase = "idle" | "submitting" | "success" | "error";
type Errors = Partial<Record<keyof LeadInput, string>>;

const docTypeOptions = [
  "Счета и счета-фактуры",
  "УПД",
  "Транспортные (ТТН / CMR)",
  "Акты",
  "Договоры",
  "Несколько типов",
  "Другое",
];

const volumeOptions = [
  "до 100 / мес",
  "100–1 000 / мес",
  "1 000–10 000 / мес",
  "более 10 000 / мес",
];

const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const empty: LeadInput = {
  name: "",
  company: "",
  email: "",
  docType: "",
  volume: "",
  comment: "",
  consent: false,
};

export function Pilot() {
  const [form, setForm] = useState<LeadInput>(empty);
  const [errors, setErrors] = useState<Errors>({});
  const [phase, setPhase] = useState<Phase>("idle");
  const [serverError, setServerError] = useState<string>("");

  function set<K extends keyof LeadInput>(key: K, value: LeadInput[K]) {
    setForm((f) => ({ ...f, [key]: value }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }));
  }

  function validate(): boolean {
    const e: Errors = {};
    if (!form.name.trim()) e.name = "Укажите имя";
    if (!form.email.trim()) e.email = "Укажите email";
    else if (!emailRe.test(form.email)) e.email = "Похоже на некорректный email";
    if (!form.docType) e.docType = "Выберите тип документов";
    if (!form.volume) e.volume = "Выберите объём";
    if (!form.consent) e.consent = "Нужно согласие на обработку данных";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function onSubmit(ev: FormEvent) {
    ev.preventDefault();
    if (!validate()) return;
    setPhase("submitting");
    setServerError("");
    const res = await submitLead(form);
    if (res.ok) {
      setPhase("success");
    } else {
      setPhase("error");
      setServerError(res.error ?? "Не удалось отправить");
    }
  }

  if (phase === "success") {
    return (
      <section className="mx-auto max-w-xl px-5 py-24 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500">
          <CheckCircle2 className="h-7 w-7" />
        </div>
        <h1 className="mt-6 text-2xl font-bold tracking-tight">
          Заявка отправлена
        </h1>
        <p className="mt-3 text-[var(--muted)]">
          Спасибо, {form.name.split(" ")[0] || "—"}! Мы свяжемся с вами по{" "}
          {form.email}, чтобы подключить тестовый контур на ваших документах.
        </p>
        <div className="mt-8 flex justify-center gap-3">
          <Link to="/">
            <Button variant="outline">На главную</Button>
          </Link>
          <Link to="/demo">
            <Button>Посмотреть демо</Button>
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-xl px-5 py-12 lg:py-16">
      <title>Заявка на пилот — Doc Parser</title>
      <meta
        name="description"
        content="Оставьте заявку на пилот Doc Parser — подключим тестовый контур и покажем результат на ваших документах."
      />

      <header>
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Заявка на пилот
        </h1>
        <p className="mt-3 text-[var(--muted)]">
          Расскажите про ваши документы и объём — подключим тестовый контур и
          покажем результат на реальной номенклатуре.
        </p>
      </header>

      <form onSubmit={onSubmit} noValidate className="mt-10 space-y-5">
        <Field label="Имя" error={errors.name} htmlFor="name" required>
          <input
            id="name"
            type="text"
            value={form.name}
            onChange={(e) => set("name", e.target.value)}
            className={inputCls(!!errors.name)}
            autoComplete="name"
          />
        </Field>

        <Field label="Компания" error={errors.company} htmlFor="company">
          <input
            id="company"
            type="text"
            value={form.company}
            onChange={(e) => set("company", e.target.value)}
            className={inputCls(false)}
            autoComplete="organization"
          />
        </Field>

        <Field label="Email" error={errors.email} htmlFor="email" required>
          <input
            id="email"
            type="email"
            value={form.email}
            onChange={(e) => set("email", e.target.value)}
            className={inputCls(!!errors.email)}
            autoComplete="email"
          />
        </Field>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field
            label="Тип документов"
            error={errors.docType}
            htmlFor="docType"
            required
          >
            <select
              id="docType"
              value={form.docType}
              onChange={(e) => set("docType", e.target.value)}
              className={inputCls(!!errors.docType)}
            >
              <option value="">— выберите —</option>
              {docTypeOptions.map((o) => (
                <option key={o} value={o}>
                  {o}
                </option>
              ))}
            </select>
          </Field>

          <Field
            label="Объём в месяц"
            error={errors.volume}
            htmlFor="volume"
            required
          >
            <select
              id="volume"
              value={form.volume}
              onChange={(e) => set("volume", e.target.value)}
              className={inputCls(!!errors.volume)}
            >
              <option value="">— выберите —</option>
              {volumeOptions.map((o) => (
                <option key={o} value={o}>
                  {o}
                </option>
              ))}
            </select>
          </Field>
        </div>

        <Field label="Комментарий" error={errors.comment} htmlFor="comment">
          <textarea
            id="comment"
            rows={4}
            value={form.comment}
            onChange={(e) => set("comment", e.target.value)}
            className={cn(inputCls(false), "resize-y")}
            placeholder="Особенности документов, форматы, интеграция с 1С/ERP…"
          />
        </Field>

        <div>
          <label className="flex items-start gap-3 text-sm">
            <input
              type="checkbox"
              checked={form.consent}
              onChange={(e) => set("consent", e.target.checked)}
              className="mt-0.5 h-4 w-4 accent-[var(--color-accent)]"
            />
            <span className="text-[var(--muted)]">
              Согласен на обработку персональных данных для связи по заявке.
            </span>
          </label>
          {errors.consent && (
            <p className="mt-1 text-xs text-red-500">{errors.consent}</p>
          )}
        </div>

        {phase === "error" && (
          <div className="flex items-center gap-2 rounded-lg border border-red-500/30 bg-red-500/5 px-3 py-2 text-sm text-red-600 dark:text-red-400">
            <AlertCircle className="h-4 w-4 shrink-0" />
            Не удалось отправить ({serverError}). Попробуйте ещё раз.
          </div>
        )}

        <Button
          type="submit"
          size="lg"
          disabled={phase === "submitting"}
          className="w-full"
        >
          {phase === "submitting" ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" /> Отправляем…
            </>
          ) : (
            "Отправить заявку"
          )}
        </Button>
      </form>
    </section>
  );
}

function inputCls(invalid: boolean) {
  return cn(
    "w-full rounded-lg border bg-[var(--bg)] px-3 py-2 text-sm transition-colors",
    "placeholder:text-[var(--muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]",
    invalid ? "border-red-500/60" : "border-[var(--border)]",
  );
}

function Field({
  label,
  htmlFor,
  error,
  required,
  children,
}: {
  label: string;
  htmlFor: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label
        htmlFor={htmlFor}
        className="mb-1.5 block text-sm font-medium"
      >
        {label}
        {required && <span className="ml-0.5 text-red-500">*</span>}
      </label>
      {children}
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}
