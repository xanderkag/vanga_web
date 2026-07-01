import { Link } from "react-router-dom";
import { Check, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Plan {
  name: string;
  price: string;
  per?: string;
  desc: string;
  features: string[];
  cta: string;
  to: string;
  featured?: boolean;
}

const plans: Plan[] = [
  {
    name: "Старт",
    price: "0 ₽",
    per: "14 дней",
    desc: "Попробовать на своих документах.",
    features: [
      "До 100 документов",
      "6 базовых типов",
      "JSON + вебхуки",
      "Доступ к API-песочнице",
    ],
    cta: "Начать бесплатно",
    to: "/register",
  },
  {
    name: "Бизнес",
    price: "от 29 900 ₽",
    per: "/мес",
    desc: "Поток документов и интеграция с учётными системами.",
    features: [
      "От 5 000 документов / мес",
      "Все 30 типов + кастомные",
      "Доменная валидация",
      "Вебхуки с HMAC, приоритет",
      "Интеграция 1С / ERP",
    ],
    cta: "Начать",
    to: "/register",
    featured: true,
  },
  {
    name: "Энтерпрайз",
    price: "Индивидуально",
    desc: "On-prem, SLA и закрытый контур.",
    features: [
      "Безлимитный объём",
      "Self-hosted / on-prem",
      "SLA и выделенная поддержка",
      "Приватные модели",
      "Помощь с внедрением",
    ],
    cta: "Связаться",
    to: "/pilot",
  },
];

const faq = [
  {
    q: "Документы уходят в облако?",
    a: "В тарифе Энтерпрайз сервис разворачивается на вашем контуре (on-prem) — данные не покидают периметр. В облачных тарифах файлы обрабатываются и не хранятся дольше, чем нужно для выдачи результата.",
  },
  {
    q: "Какие форматы на входе?",
    a: "PDF, JPG, PNG — одно- и многостраничные. OCR-каскад сам выбирает движок: от текстового слоя PDF до vision-LLM для сложных сканов.",
  },
  {
    q: "Как считается объём?",
    a: "По числу обработанных документов в месяц. Многостраничный документ — одна единица. Неудавшиеся обработки не списываются.",
  },
  {
    q: "Есть ли интеграция с 1С?",
    a: "Да. Результат — типизированный JSON, плюс готовые коннекторы и вебхуки для загрузки в 1С, ERP и CRM. Подробности — в документации.",
  },
  {
    q: "Можно поменять тариф?",
    a: "Да, в любой момент — вверх или вниз. На пилоте поможем подобрать объём под вашу реальную номенклатуру.",
  },
];

export function Pricing() {
  return (
    <section className="mx-auto max-w-6xl px-5 py-16">
      <title>Тарифы — Doc Parser</title>
      <meta
        name="description"
        content="Тарифы Doc Parser: бесплатный старт, Бизнес и Энтерпрайз с on-prem. Обработка документов в структурированный JSON для 1С, ERP и CRM."
      />

      <div className="mx-auto max-w-2xl text-center">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Простые тарифы под ваш объём
        </h1>
        <p className="mt-4 text-[var(--muted)]">
          Начните бесплатно, масштабируйтесь по мере роста потока документов.
          On-prem — для закрытого контура.
        </p>
      </div>

      <div className="mt-14 grid gap-6 lg:grid-cols-3">
        {plans.map((p) => (
          <div
            key={p.name}
            className={cn(
              "relative flex flex-col rounded-2xl border p-6",
              p.featured
                ? "border-[var(--color-accent)] shadow-xl shadow-[color-mix(in_oklab,var(--color-accent)_18%,transparent)]"
                : "border-[var(--border)]",
            )}
          >
            {p.featured && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-[var(--color-accent)] px-3 py-1 text-xs font-medium text-[var(--color-accent-fg)]">
                Популярный
              </span>
            )}
            <h3 className="text-lg font-semibold">{p.name}</h3>
            <p className="mt-1 text-sm text-[var(--muted)]">{p.desc}</p>
            <div className="mt-5 flex items-baseline gap-1">
              <span className="text-3xl font-bold tracking-tight">
                {p.price}
              </span>
              {p.per && (
                <span className="text-sm text-[var(--muted)]">{p.per}</span>
              )}
            </div>
            <ul className="mt-6 space-y-2.5 text-sm">
              {p.features.map((f) => (
                <li key={f} className="flex gap-2">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-[var(--color-accent)]" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
            <div className="mt-7 pt-2">
              <Link to={p.to} className="block">
                <Button
                  className="w-full"
                  variant={p.featured ? "primary" : "outline"}
                >
                  {p.cta} <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        ))}
      </div>

      <p className="mt-6 text-center text-sm text-[var(--muted)]">
        Все тарифы включают доменную валидацию (ИНН/КПП, НДС, госномера) и доступ
        к документации.
      </p>

      {/* FAQ */}
      <div className="mx-auto mt-20 max-w-3xl">
        <h2 className="text-center text-2xl font-bold tracking-tight">
          Частые вопросы
        </h2>
        <div className="mt-8 divide-y divide-[var(--border)] rounded-2xl border border-[var(--border)]">
          {faq.map((item) => (
            <details key={item.q} className="group px-5">
              <summary className="flex cursor-pointer list-none items-center justify-between py-4 font-medium">
                {item.q}
                <span className="ml-4 text-[var(--muted)] transition-transform group-open:rotate-45">
                  +
                </span>
              </summary>
              <p className="pb-4 text-sm text-[var(--muted)]">{item.a}</p>
            </details>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="mx-auto mt-16 max-w-2xl rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-8 text-center">
        <h2 className="text-xl font-bold tracking-tight">
          Не уверены, какой тариф нужен?
        </h2>
        <p className="mt-2 text-sm text-[var(--muted)]">
          Запустим пилот на ваших документах и подберём объём.
        </p>
        <Link to="/pilot" className="mt-5 inline-block">
          <Button size="lg">Запросить пилот</Button>
        </Link>
      </div>
    </section>
  );
}
