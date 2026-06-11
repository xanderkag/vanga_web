import {
  Suspense,
  lazy,
  useRef,
  useState,
  type ComponentType,
  type LazyExoticComponent,
} from "react";
import { useParams, Navigate, Link } from "react-router-dom";
import { MDXProvider } from "@mdx-js/react";
import { ArrowLeft, ArrowRight, Menu, X } from "lucide-react";
import { mdxComponents } from "@/components/docs/mdx-components";
import { DocsSidebar } from "@/components/layout/DocsSidebar";
import { Toc } from "@/components/docs/Toc";
import { adjacentDocs, findDoc, firstDocSlug } from "@/content/docs/registry";

const modules = import.meta.glob<{ default: ComponentType }>(
  "/src/content/docs/*.mdx",
);
const cache = new Map<string, LazyExoticComponent<ComponentType>>();

function getDoc(slug: string): LazyExoticComponent<ComponentType> | null {
  const key = `/src/content/docs/${slug}.mdx`;
  const loader = modules[key];
  if (!loader) return null;
  if (!cache.has(slug)) cache.set(slug, lazy(loader));
  return cache.get(slug)!;
}

export function Docs() {
  const params = useParams();
  const splat = (params["*"] ?? "").replace(/\/+$/, "");
  const [drawer, setDrawer] = useState(false);
  const articleRef = useRef<HTMLElement | null>(null);

  if (splat === "") return <Navigate to={`/docs/${firstDocSlug}`} replace />;

  const slug = splat;
  const page = findDoc(slug);
  const Doc = getDoc(slug);

  if (!page || !Doc) {
    return (
      <div className="mx-auto max-w-3xl px-5 py-24 text-center">
        <h1 className="text-2xl font-bold">Раздел не найден</h1>
        <p className="mt-3 text-[var(--muted)]">
          Страницы документации <code>/docs/{slug}</code> не существует.
        </p>
        <Link
          to={`/docs/${firstDocSlug}`}
          className="mt-6 inline-block text-[var(--color-accent)] hover:underline"
        >
          ← К началу документации
        </Link>
      </div>
    );
  }

  const { prev, next } = adjacentDocs(slug);

  return (
    <div className="mx-auto w-full max-w-7xl px-5">
      {/* мобильная панель с кнопкой меню */}
      <div className="flex items-center gap-3 border-b border-[var(--border)] py-3 lg:hidden">
        <button
          onClick={() => setDrawer(true)}
          className="inline-flex items-center gap-2 rounded-lg border border-[var(--border)] px-3 py-1.5 text-sm"
        >
          <Menu className="h-4 w-4" /> Разделы
        </button>
        <span className="truncate text-sm text-[var(--muted)]">
          {page.title}
        </span>
      </div>

      <div className="grid gap-10 py-10 lg:grid-cols-[220px_minmax(0,1fr)_200px]">
        {/* левая навигация (desktop) */}
        <aside className="hidden lg:block">
          <div className="sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto pr-2">
            <DocsSidebar />
          </div>
        </aside>

        {/* контент */}
        <article ref={articleRef} className="doc-prose min-w-0">
          <title>{`${page.title} — Doc Parser`}</title>
          <meta name="description" content={page.description} />
          <Suspense
            fallback={
              <div className="py-10 text-sm text-[var(--muted)]">Загрузка…</div>
            }
          >
            <MDXProvider components={mdxComponents}>
              <Doc />
            </MDXProvider>
          </Suspense>

          {/* prev / next */}
          <nav className="mt-14 flex items-stretch justify-between gap-4 border-t border-[var(--border)] pt-6">
            {prev ? (
              <Link
                to={`/docs/${prev.slug}`}
                className="group flex flex-1 flex-col rounded-xl border border-[var(--border)] p-4 no-underline transition-colors hover:border-[color-mix(in_oklab,var(--color-accent)_50%,transparent)]"
              >
                <span className="inline-flex items-center gap-1 text-xs text-[var(--muted)]">
                  <ArrowLeft className="h-3 w-3" /> Назад
                </span>
                <span className="mt-1 font-medium text-[var(--fg)]">
                  {prev.title}
                </span>
              </Link>
            ) : (
              <span className="flex-1" />
            )}
            {next ? (
              <Link
                to={`/docs/${next.slug}`}
                className="group flex flex-1 flex-col items-end rounded-xl border border-[var(--border)] p-4 text-right no-underline transition-colors hover:border-[color-mix(in_oklab,var(--color-accent)_50%,transparent)]"
              >
                <span className="inline-flex items-center gap-1 text-xs text-[var(--muted)]">
                  Дальше <ArrowRight className="h-3 w-3" />
                </span>
                <span className="mt-1 font-medium text-[var(--fg)]">
                  {next.title}
                </span>
              </Link>
            ) : (
              <span className="flex-1" />
            )}
          </nav>
        </article>

        {/* правое оглавление (desktop) */}
        <aside className="hidden lg:block">
          <div className="sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto">
            <Toc containerRef={articleRef} slug={slug} />
          </div>
        </aside>
      </div>

      {/* мобильный drawer навигации */}
      {drawer && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setDrawer(false)}
          />
          <div className="absolute left-0 top-0 h-full w-72 max-w-[80%] overflow-y-auto border-r border-[var(--border)] bg-[var(--bg)] p-5">
            <div className="mb-4 flex items-center justify-between">
              <span className="font-semibold">Документация</span>
              <button
                onClick={() => setDrawer(false)}
                aria-label="Закрыть"
                className="rounded-lg p-1.5 hover:bg-[var(--surface)]"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <DocsSidebar onNavigate={() => setDrawer(false)} />
          </div>
        </div>
      )}
    </div>
  );
}
