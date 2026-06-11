import { NavLink } from "react-router-dom";
import { docsNav } from "@/content/docs/registry";
import { cn } from "@/lib/utils";

export function DocsSidebar({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <nav className="space-y-6 text-sm">
      {docsNav.map((section) => (
        <div key={section.title}>
          <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">
            {section.title}
          </p>
          <ul className="space-y-0.5">
            {section.pages.map((p) => (
              <li key={p.slug}>
                <NavLink
                  to={`/docs/${p.slug}`}
                  onClick={onNavigate}
                  className={({ isActive }) =>
                    cn(
                      "block rounded-lg px-3 py-1.5 transition-colors hover:bg-[var(--surface)]",
                      isActive
                        ? "bg-[var(--surface)] font-medium text-[var(--color-accent)]"
                        : "text-[var(--muted)]",
                    )
                  }
                >
                  {p.title}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </nav>
  );
}
