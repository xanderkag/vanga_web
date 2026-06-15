import { Link } from "react-router-dom";
import {
  ArrowRight,
  Upload,
  ScanText,
  Braces,
  ShieldCheck,
  Webhook,
  Server,
  FileJson,
  Truck,
  Calculator,
  Plug,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { docTypes, categories, type CategoryKey } from "@/lib/doc-types";
import { DocTypeIcon } from "@/lib/doc-icons";

/* ─────────────── мелкие примитивы ─────────────── */

function Container({ children }: { children: React.ReactNode }) {
  return <div className="mx-auto w-full max-w-6xl px-5">{children}</div>;
}

function SectionHeading({
  eyebrow,
  title,
  desc,
}: {
  eyebrow: string;
  title: string;
  desc?: string;
}) {
  return (
    <div className="mx-auto max-w-2xl text-center">
      <p className="text-xs font-semibold uppercase tracking-widest text-[var(--color-accent)]">
        {eyebrow}
      </p>
      <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
        {title}
      </h2>
      {desc && <p className="mt-4 text-[var(--muted)]">{desc}</p>}
    </div>
  );
}

const catTint: Record<CategoryKey, string> = {
  transport: "text-sky-600 dark:text-sky-400",
  accounting: "text-emerald-600 dark:text-emerald-400",
  legal: "text-violet-600 dark:text-violet-400",
};

/* ─────────────── секции ─────────────── */

function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 -top-40 h-96 bg-[radial-gradient(60%_60%_at_50%_0%,color-mix(in_oklab,var(--color-accent)_18%,transparent),transparent)]"
      />
      <Container>
        <div className="grid items-center gap-12 py-20 lg:grid-cols-2 lg:py-28">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface)] px-3 py-1 text-xs text-[var(--muted)]">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-accent)]" />
              Doc Parser · Big Brother
            </span>
            <h1 className="mt-5 text-4xl font-bold leading-[1.1] tracking-tight sm:text-6xl">
              PDF и сканы →{" "}
              <span className="text-[var(--color-accent)]">
                структурированный JSON
              </span>
            </h1>
            <p className="mt-6 max-w-xl text-lg text-[var(--muted)]">
              Универсальный сервис обработки транспортных, бухгалтерских и
              юридических документов. 15 встроенных типов, доменная валидация,
              вебхуки. На выходе — готовый JSON для 1С, ERP и CRM.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/register">
                <Button size="lg">
                  Начать бесплатно <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link to="/demo">
                <Button size="lg" variant="outline">
                  Посмотреть демо
                </Button>
              </Link>
            </div>
            <p className="mt-3 text-xs text-[var(--muted)]">
              14 дней бесплатно · карта не нужна · self-hosted по запросу
            </p>
          </div>

          <HeroSnippet />
        </div>
      </Container>
    </section>
  );
}

function HeroSnippet() {
  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-1.5 shadow-xl shadow-black/5">
      <div className="flex items-center gap-1.5 px-3 py-2">
        <span className="h-3 w-3 rounded-full bg-red-400/70" />
        <span className="h-3 w-3 rounded-full bg-amber-400/70" />
        <span className="h-3 w-3 rounded-full bg-emerald-400/70" />
        <span className="ml-2 font-mono text-xs text-[var(--muted)]">
          result.json · УПД
        </span>
      </div>
      <pre className="overflow-x-auto rounded-xl bg-[var(--bg)] p-4 font-mono text-[12.5px] leading-relaxed">
        <code>{`{
  "type": "UPD",
  "confidence": 0.98,
  "number": "УПД-114",
  "date": "2026-05-19",
  "seller": { "name": "ООО «Негабарит»", "inn": "7802338201" },
  "buyer":  { "name": "ООО «Антарес»",   "inn": "7706094528" },
  "total": 486000.00,
  "vat":   81000.00,
  "validation": { "inn": "ok", "kpp": "ok", "vat": "ok" }
}`}</code>
      </pre>
    </div>
  );
}

const steps = [
  {
    icon: Upload,
    title: "Загрузка",
    desc: "PDF, JPG или PNG приходит в POST /api/v1/jobs и встаёт в очередь.",
  },
  {
    icon: ScanText,
    title: "OCR-каскад",
    desc: "pdf-text → tesseract → vision-llm → yandex — пока не получим читаемый текст.",
  },
  {
    icon: Braces,
    title: "Классификация и извлечение",
    desc: "Определяем тип документа и вытаскиваем поля по схеме (regex или LLM).",
  },
  {
    icon: CheckCircle2,
    title: "Валидированный JSON",
    desc: "Проверка ИНН/КПП, VAT, госномеров → отдаём результат вебхуком.",
  },
];

function HowItWorks() {
  return (
    <section className="border-t border-[var(--border)] py-20">
      <Container>
        <SectionHeading
          eyebrow="Как работает"
          title="От файла до данных — за один проход"
          desc="Под капотом — каскад OCR-движков и двухфазный парсер. Снаружи — один запрос и предсказуемый JSON."
        />
        <ol className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((s, i) => (
            <li
              key={s.title}
              className="relative rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--color-accent)]/10 text-[var(--color-accent)]">
                <s.icon className="h-5 w-5" />
              </div>
              <div className="mt-4 font-mono text-xs text-[var(--muted)]">
                шаг {i + 1}
              </div>
              <h3 className="mt-1 font-semibold">{s.title}</h3>
              <p className="mt-2 text-sm text-[var(--muted)]">{s.desc}</p>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}

function SupportedDocs() {
  return (
    <section className="border-t border-[var(--border)] py-20">
      <Container>
        <SectionHeading
          eyebrow="Поддерживаемые документы"
          title="15 встроенных типов из коробки"
          desc="Шесть базовых типов — типизированные парсеры со схемой, остальные — настраиваемый LLM-extract."
        />
        <div className="mt-14 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {docTypes.map((t) => (
            <div
              key={t.slug}
              className="group flex gap-3 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 transition-colors hover:border-[color-mix(in_oklab,var(--color-accent)_50%,transparent)]"
            >
              <div className={`mt-0.5 shrink-0 ${catTint[t.category]}`}>
                <DocTypeIcon name={t.icon} className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="truncate font-medium">{t.name}</span>
                  {t.tier === "stable" && (
                    <span className="rounded bg-emerald-500/10 px-1.5 py-0.5 text-[10px] font-medium text-emerald-600 dark:text-emerald-400">
                      stable
                    </span>
                  )}
                </div>
                <p className="mt-1 line-clamp-2 text-sm text-[var(--muted)]">
                  {t.summary}
                </p>
                <p className="mt-1.5 text-xs text-[var(--muted)]">
                  {categories[t.category]}
                </p>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-8 text-center">
          <Link
            to="/docs/document-types"
            className="inline-flex items-center gap-1 text-sm font-medium text-[var(--color-accent)] hover:underline"
          >
            Каталог типов и схемы вывода <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </Container>
    </section>
  );
}

const audiences = [
  {
    icon: Truck,
    title: "Логистика",
    desc: "ТТН, CMR, заявки и путевые листы превращаются в структуру для TMS и учёта рейсов.",
  },
  {
    icon: Calculator,
    title: "Бухгалтерия",
    desc: "Счета, счета-фактуры, УПД и акты — с проверкой ИНН/КПП и сходимости НДС.",
  },
  {
    icon: Plug,
    title: "ERP / 1С-интеграторы",
    desc: "Типизированный JSON и вебхуки ложатся прямо в обмен с 1С, ERP и CRM.",
  },
];

function ForWhom() {
  return (
    <section className="border-t border-[var(--border)] py-20">
      <Container>
        <SectionHeading eyebrow="Для кого" title="Кому это экономит часы" />
        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {audiences.map((a) => (
            <div
              key={a.title}
              className="rounded-2xl border border-[var(--border)] p-6"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--color-accent)]/10 text-[var(--color-accent)]">
                <a.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 text-lg font-semibold">{a.title}</h3>
              <p className="mt-2 text-sm text-[var(--muted)]">{a.desc}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}

const features = [
  {
    icon: ShieldCheck,
    title: "Доменная валидация",
    desc: "Checksum ИНН/КПП, формат госномеров, консистентность НДС и сумм — флаги прямо в ответе.",
  },
  {
    icon: Webhook,
    title: "Вебхуки с HMAC",
    desc: "Результат прилетает POST'ом с подписью HMAC-SHA256, ретраями и идемпотентностью по job_id.",
  },
  {
    icon: Server,
    title: "Self-hosted / on-prem",
    desc: "Разворачивается на вашем контуре. Документы не покидают периметр компании.",
  },
  {
    icon: FileJson,
    title: "OpenAPI / Swagger",
    desc: "Контракт описан в OpenAPI — типизированные клиенты и предсказуемые поля.",
  },
];

function WhatSetsApart() {
  return (
    <section className="border-t border-[var(--border)] py-20">
      <Container>
        <SectionHeading
          eyebrow="Что отличает"
          title="Не просто OCR, а валидированные данные"
        />
        <div className="mt-14 grid gap-6 sm:grid-cols-2">
          {features.map((f) => (
            <div
              key={f.title}
              className="flex gap-4 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6"
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[var(--color-accent)]/10 text-[var(--color-accent)]">
                <f.icon className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold">{f.title}</h3>
                <p className="mt-1.5 text-sm text-[var(--muted)]">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}

function PilotCta() {
  return (
    <section className="border-t border-[var(--border)] py-20">
      <Container>
        <div className="relative overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--surface)] px-6 py-14 text-center">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(50%_80%_at_50%_0%,color-mix(in_oklab,var(--color-accent)_14%,transparent),transparent)]"
          />
          <h2 className="relative text-3xl font-bold tracking-tight sm:text-4xl">
            Запустить пилот на ваших документах
          </h2>
          <p className="relative mx-auto mt-4 max-w-xl text-[var(--muted)]">
            Пришлите тип документов и объём — подключим тестовый контур и покажем
            результат на вашей реальной номенклатуре.
          </p>
          <div className="relative mt-8 flex justify-center">
            <Link to="/pilot">
              <Button size="lg">
                Оставить заявку <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}

export function Home() {
  return (
    <>
      <title>Doc Parser — PDF и сканы → структурированный JSON</title>
      <meta
        name="description"
        content="Doc Parser (Big Brother) — обработка транспортных, бухгалтерских и юридических документов. 15 типов, доменная валидация, вебхуки. JSON для 1С, ERP и CRM."
      />
      <Hero />
      <HowItWorks />
      <SupportedDocs />
      <ForWhom />
      <WhatSetsApart />
      <PilotCta />
    </>
  );
}
