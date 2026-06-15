import type { DemoCase, DocRender } from "@/lib/demo-source";

/**
 * Превью исходного документа — отрисовка реалистичного печатного бланка
 * (шапка, реквизиты сторон, таблица позиций, Итого/НДС, М.П. и подпись).
 * Выглядит как настоящий документ; данные приходят из case.doc.
 */
export function DocumentPreview({ demoCase }: { demoCase: DemoCase | null }) {
  if (!demoCase) {
    return (
      <div className="flex h-full min-h-[320px] items-center justify-center rounded-xl border border-dashed border-[var(--border)] text-sm text-[var(--muted)]">
        Выберите документ слева
      </div>
    );
  }

  const d = demoCase.doc;

  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-3">
      <div className="mb-2 flex items-center justify-between px-1">
        <span className="font-mono text-xs text-[var(--muted)]">
          source · {demoCase.docTypeSlug}
        </span>
        <span className="rounded border border-[var(--border)] px-1.5 py-0.5 text-[10px] uppercase text-[var(--muted)]">
          скан документа
        </span>
      </div>

      {/* лист «бумаги» */}
      <div className="mx-auto max-w-md rounded-md bg-white p-6 text-[11.5px] leading-relaxed text-zinc-800 shadow-sm ring-1 ring-black/5">
        {/* бланк-шапка */}
        <div className="border-b border-zinc-300 pb-2 text-[10px] uppercase tracking-wide text-zinc-500">
          {d.org}
        </div>

        <div className="mt-3 text-center">
          <div className="text-[13px] font-bold leading-tight text-zinc-900">
            {d.title}
          </div>
          <div className="mt-0.5 text-[10.5px] text-zinc-500">
            от {d.date}
          </div>
        </div>

        {/* стороны */}
        <div className="mt-4 space-y-1.5">
          {d.parties.map((p) => (
            <div key={p.role} className="flex gap-2">
              <span className="w-28 shrink-0 text-zinc-500">{p.role}:</span>
              <span className="min-w-0">
                <span className="font-medium text-zinc-900">{p.name}</span>
                {(p.inn || p.kpp) && (
                  <span className="text-zinc-600">
                    {p.inn && ` · ИНН ${p.inn}`}
                    {p.kpp && ` · КПП ${p.kpp}`}
                  </span>
                )}
                {p.address && (
                  <span className="block text-[10.5px] text-zinc-500">
                    {p.address}
                  </span>
                )}
              </span>
            </div>
          ))}
        </div>

        {d.kind === "accounting" ? (
          <AccountingBody d={d} />
        ) : (
          <TransportBody d={d} />
        )}

        {/* печать + подпись */}
        <div className="mt-6 flex items-end justify-between">
          <div className="flex items-center gap-2">
            <span className="flex h-12 w-12 items-center justify-center rounded-full border border-dashed border-sky-400/70 text-center text-[7px] uppercase leading-tight text-sky-500/80">
              М.П.
            </span>
          </div>
          {d.signer && (
            <div className="text-right">
              <div className="border-b border-zinc-400 pb-0.5 font-[cursive] text-[13px] italic text-zinc-700">
                {d.signer}
              </div>
              <div className="text-[9px] text-zinc-500">подпись</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function AccountingBody({ d }: { d: DocRender }) {
  if (!d.items) return null;
  return (
    <div className="mt-4">
      <table className="w-full border-collapse text-[10.5px]">
        <thead>
          <tr className="bg-zinc-100 text-left text-zinc-600">
            <th className="border border-zinc-300 px-1.5 py-1 font-medium">№</th>
            <th className="border border-zinc-300 px-1.5 py-1 font-medium">
              Наименование
            </th>
            <th className="border border-zinc-300 px-1.5 py-1 text-right font-medium">
              Кол-во
            </th>
            <th className="border border-zinc-300 px-1.5 py-1 text-right font-medium">
              Цена
            </th>
            <th className="border border-zinc-300 px-1.5 py-1 text-right font-medium">
              Сумма
            </th>
          </tr>
        </thead>
        <tbody>
          {d.items.map((it, i) => (
            <tr key={i} className="text-zinc-800">
              <td className="border border-zinc-300 px-1.5 py-1">{i + 1}</td>
              <td className="border border-zinc-300 px-1.5 py-1">{it.name}</td>
              <td className="border border-zinc-300 px-1.5 py-1 text-right">
                {it.qty ?? "—"}
              </td>
              <td className="border border-zinc-300 px-1.5 py-1 text-right">
                {it.price ?? "—"}
              </td>
              <td className="border border-zinc-300 px-1.5 py-1 text-right">
                {it.sum}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="mt-2 space-y-0.5 text-right text-[11px]">
        {d.total && (
          <div>
            <span className="text-zinc-500">Итого: </span>
            <span className="font-semibold text-zinc-900">{d.total} ₽</span>
          </div>
        )}
        {d.vat && (
          <div className="text-zinc-600">в т.ч. НДС 20%: {d.vat} ₽</div>
        )}
      </div>
    </div>
  );
}

function TransportBody({ d }: { d: DocRender }) {
  if (!d.rows) return null;
  return (
    <div className="mt-4 overflow-hidden rounded border border-zinc-300">
      <table className="w-full border-collapse text-[10.5px]">
        <tbody>
          {d.rows.map((r) => (
            <tr key={r.k}>
              <td className="w-2/5 border border-zinc-300 bg-zinc-50 px-1.5 py-1 text-zinc-500">
                {r.k}
              </td>
              <td className="border border-zinc-300 px-1.5 py-1 text-zinc-800">
                {r.v}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
