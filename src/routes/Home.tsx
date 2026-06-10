import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export function Home() {
  return (
    <section className="mx-auto max-w-6xl px-5 py-24 text-center">
      <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
        PDF и сканы →{" "}
        <span className="text-[var(--color-accent)]">структурированный JSON</span>
      </h1>
      <p className="mx-auto mt-6 max-w-2xl text-lg text-[var(--muted)]">
        Универсальный сервис обработки транспортных, бухгалтерских и юридических
        документов. На выходе — валидированный JSON для 1С, ERP и CRM.
      </p>
      <div className="mt-10 flex justify-center gap-3">
        <Link to="/demo">
          <Button size="lg">Посмотреть демо</Button>
        </Link>
        <Link to="/docs">
          <Button size="lg" variant="outline">
            Документация
          </Button>
        </Link>
      </div>
      <p className="mt-16 text-sm text-[var(--muted)]">
        Этап 1: каркас. Лендинг наполняется на Этапе 2.
      </p>
    </section>
  );
}
