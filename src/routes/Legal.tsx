import { useParams, Navigate, NavLink } from "react-router-dom";
import { legalDocs, findLegal } from "@/content/legal/legal-docs";
import { cn } from "@/lib/utils";

export function Legal() {
  const params = useParams();
  const slug = (params["*"] ?? "").replace(/\/+$/, "");

  if (slug === "") return <Navigate to="/legal/privacy" replace />;

  const doc = findLegal(slug);
  if (!doc) {
    return (
      <div className="mx-auto max-w-3xl px-5 py-24 text-center">
        <h1 className="text-2xl font-bold">Документ не найден</h1>
        <NavLink
          to="/legal/privacy"
          className="mt-4 inline-block text-[var(--color-accent)] hover:underline"
        >
          ← К правовым документам
        </NavLink>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-5xl px-5 py-12">
      <title>{`${doc.title} — Doc Parser`}</title>
      <meta name="robots" content="noindex" />

      <div className="grid gap-10 lg:grid-cols-[220px_minmax(0,1fr)]">
        {/* список документов */}
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">
            Документы
          </p>
          <nav className="space-y-0.5 text-sm">
            {legalDocs.map((d) => (
              <NavLink
                key={d.slug}
                to={`/legal/${d.slug}`}
                className={({ isActive }) =>
                  cn(
                    "block rounded-lg px-3 py-1.5 transition-colors hover:bg-[var(--surface)]",
                    isActive
                      ? "bg-[var(--surface)] font-medium text-[var(--color-accent)]"
                      : "text-[var(--muted)]",
                  )
                }
              >
                {d.short}
              </NavLink>
            ))}
          </nav>
        </aside>

        {/* документ */}
        <article className="min-w-0">
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            {doc.title}
          </h1>
          <p className="mt-2 text-xs text-[var(--muted)]">
            Редакция от {doc.updated}
          </p>
          {doc.intro && (
            <p className="mt-5 text-[15px] leading-relaxed text-[var(--fg)]">
              {doc.intro}
            </p>
          )}

          <div className="mt-8 space-y-7">
            {doc.sections.map((s, i) => (
              <section key={i}>
                {s.heading && (
                  <h2 className="text-base font-semibold">{s.heading}</h2>
                )}
                {s.paras?.map((p, j) => (
                  <p
                    key={j}
                    className="mt-2 text-[14.5px] leading-relaxed text-[var(--fg)]"
                  >
                    {p}
                  </p>
                ))}
                {s.list && (
                  <ul className="mt-2 list-disc space-y-1 pl-5 text-[14.5px] leading-relaxed text-[var(--fg)]">
                    {s.list.map((li, k) => (
                      <li key={k} className="marker:text-[var(--muted)]">
                        {li}
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            ))}
          </div>

          <p className="mt-10 border-t border-[var(--border)] pt-5 text-xs text-[var(--muted)]">
            Документ является шаблоном и может быть уточнён. По вопросам — {""}
            <a
              href="mailto:liapustin@gmail.com"
              className="text-[var(--color-accent)] hover:underline"
            >
              liapustin@gmail.com
            </a>
            .
          </p>
        </article>
      </div>
    </div>
  );
}
