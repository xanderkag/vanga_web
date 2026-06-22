import { Link } from "react-router-dom";
import { Logo } from "./Logo";

export function Footer() {
  return (
    <footer className="border-t border-[var(--border)] mt-24">
      <div className="mx-auto max-w-6xl px-5 py-10 text-sm text-[var(--muted)]">
        <div className="flex flex-col gap-6 md:flex-row md:justify-between">
          <div>
            <div className="flex items-center gap-2 font-semibold text-[var(--fg)]">
              <Logo size={26} />
              Doc Parser
            </div>
            <p className="mt-2 max-w-xs">
              PDF и сканы → структурированный JSON для 1С / ERP / CRM.
            </p>
          </div>
          <div className="flex gap-12">
            <div className="flex flex-col gap-2">
              <span className="text-[var(--fg)] font-medium">Продукт</span>
              <Link to="/docs" className="hover:text-[var(--fg)]">Документация</Link>
              <Link to="/demo" className="hover:text-[var(--fg)]">Демо</Link>
              <Link to="/pilot" className="hover:text-[var(--fg)]">Пилот</Link>
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-[var(--fg)] font-medium">Документы</span>
              <Link to="/legal/privacy" className="hover:text-[var(--fg)]">Политика ПДн</Link>
              <Link to="/legal/terms" className="hover:text-[var(--fg)]">Соглашение</Link>
              <Link to="/legal/offer" className="hover:text-[var(--fg)]">Оферта</Link>
              <Link to="/legal/cookie" className="hover:text-[var(--fg)]">Cookie</Link>
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-[var(--fg)] font-medium">Контакт</span>
              <a href="mailto:liapustin@gmail.com" className="hover:text-[var(--fg)]">
                liapustin@gmail.com
              </a>
              <a href="https://t.me/xanderkage" className="hover:text-[var(--fg)]">
                Telegram
              </a>
            </div>
          </div>
        </div>
        <div className="mt-8 space-y-2 border-t border-[var(--border)] pt-6 text-xs">
          <p className="leading-relaxed">
            Исполнитель: Индивидуальный предприниматель Ляпустин Александр
            Юрьевич · ИНН 780223828359 · ОГРНИП 324784700397886 ·{" "}
            <a
              href="mailto:liapustin@gmail.com"
              className="hover:text-[var(--fg)]"
            >
              liapustin@gmail.com
            </a>
          </p>
          <p>© {new Date().getFullYear()} Doc Parser · Big Brother</p>
        </div>
      </div>
    </footer>
  );
}
