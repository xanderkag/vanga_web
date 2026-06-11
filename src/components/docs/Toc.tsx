import { useEffect, useState, type RefObject } from "react";
import { cn } from "@/lib/utils";

interface TocItem {
  id: string;
  text: string;
  level: 2 | 3;
}

/**
 * Правая колонка — оглавление текущей страницы. Заголовки читаются из DOM
 * (rehype-slug проставил id). MutationObserver пересканирует, когда ленивый
 * MDX-контент домонтируется (после Suspense) или меняется страница.
 */
export function Toc({
  containerRef,
  slug,
}: {
  containerRef: RefObject<HTMLElement | null>;
  slug: string;
}) {
  const [items, setItems] = useState<TocItem[]>([]);
  const [active, setActive] = useState<string>("");

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    let io: IntersectionObserver | null = null;

    const scan = () => {
      const hs = Array.from(
        el.querySelectorAll<HTMLElement>("h2[id], h3[id]"),
      );
      setItems(
        hs.map((h) => ({
          id: h.id,
          text: h.textContent ?? "",
          level: h.tagName === "H2" ? 2 : 3,
        })),
      );
      io?.disconnect();
      io = new IntersectionObserver(
        (entries) => {
          const vis = entries
            .filter((e) => e.isIntersecting)
            .sort(
              (a, b) => a.boundingClientRect.top - b.boundingClientRect.top,
            );
          if (vis[0]) setActive((vis[0].target as HTMLElement).id);
        },
        { rootMargin: "0px 0px -70% 0px", threshold: 0 },
      );
      hs.forEach((h) => io!.observe(h));
    };

    scan();
    const mo = new MutationObserver(scan);
    mo.observe(el, { childList: true, subtree: true });

    return () => {
      mo.disconnect();
      io?.disconnect();
    };
  }, [containerRef, slug]);

  if (items.length === 0) return null;

  return (
    <nav className="text-sm">
      <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">
        На этой странице
      </p>
      <ul className="border-l border-[var(--border)]">
        {items.map((it) => (
          <li key={it.id}>
            <a
              href={`#${it.id}`}
              className={cn(
                "-ml-px block border-l-2 py-1 transition-colors",
                it.level === 3 ? "pl-6" : "pl-3",
                active === it.id
                  ? "border-[var(--color-accent)] text-[var(--color-accent)]"
                  : "border-transparent text-[var(--muted)] hover:text-[var(--fg)]",
              )}
            >
              {it.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
