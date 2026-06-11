import { useEffect, useMemo, useRef, useState } from "react";
import { RotateCcw, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DemoGallery } from "@/components/demo/DemoGallery";
import { DocumentPreview } from "@/components/demo/DocumentPreview";
import { PipelineAnimation } from "@/components/demo/PipelineAnimation";
import { ResultPanel } from "@/components/demo/ResultPanel";
import {
  getDemoSource,
  STAGES,
  type DemoCase,
  type DemoResult,
} from "@/lib/demo-source";

type Phase = "idle" | "running" | "done";

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));
const scale = (ms: number) => Math.min(900, Math.max(450, Math.round(ms / 2.2)));

export function Demo() {
  const source = useMemo(() => getDemoSource(), []);
  const [cases, setCases] = useState<DemoCase[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [phase, setPhase] = useState<Phase>("idle");
  const [activeStage, setActiveStage] = useState(0);
  const [result, setResult] = useState<DemoResult | null>(null);
  const runToken = useRef(0);

  const selectedCase = cases.find((c) => c.id === selectedId) ?? null;

  async function run(id: string) {
    const token = ++runToken.current;
    setSelectedId(id);
    setPhase("running");
    setActiveStage(0);
    setResult(null);

    let res: DemoResult;
    try {
      res = await source.runCase(id);
    } catch {
      if (token === runToken.current) setPhase("idle");
      return;
    }
    if (token !== runToken.current) return;
    setResult(res);

    for (let i = 0; i < STAGES.length; i++) {
      if (token !== runToken.current) return;
      setActiveStage(i);
      await delay(scale(res.timings[i]?.ms ?? 500));
    }
    if (token !== runToken.current) return;
    setActiveStage(STAGES.length);
    setPhase("done");
  }

  // загрузка кейсов + авто-запуск первого
  useEffect(() => {
    let alive = true;
    source.listCases().then((cs) => {
      if (!alive) return;
      setCases(cs);
      if (cs[0]) run(cs[0].id);
    });
    return () => {
      alive = false;
      runToken.current++;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [source]);

  return (
    <section className="mx-auto max-w-6xl px-5 py-12 lg:py-16">
      <title>Демо — Doc Parser</title>
      <meta
        name="description"
        content="Интерактивное демо Doc Parser: документ проходит OCR, классификацию, извлечение полей и валидацию до готового JSON."
      />
      <header className="max-w-2xl">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Интерактивное демо
        </h1>
        <p className="mt-3 text-[var(--muted)]">
          Выберите документ — и посмотрите, как он проходит пайплайн: OCR,
          классификация, извлечение полей и доменная валидация, до готового
          JSON.
        </p>
        <p className="mt-2 inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface)] px-3 py-1 text-xs text-[var(--muted)]">
          <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-accent)]" />
          Предзаписанные кейсы — без обращения к живому API
        </p>
      </header>

      <div className="mt-10 grid gap-6 lg:grid-cols-[240px_minmax(0,1fr)]">
        {/* галерея */}
        <aside className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">
            Документы
          </p>
          <DemoGallery
            cases={cases}
            selectedId={selectedId}
            onSelect={run}
            disabled={phase === "running"}
          />
        </aside>

        {/* превью + пайплайн + результат */}
        <div className="grid gap-6 xl:grid-cols-2">
          <div>
            <DocumentPreview demoCase={selectedCase} />
          </div>

          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-[var(--muted)]">
                Пайплайн
              </h2>
              {phase === "done" && selectedId && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => run(selectedId)}
                >
                  <RotateCcw className="h-3.5 w-3.5" /> Заново
                </Button>
              )}
              {phase === "idle" && selectedId && (
                <Button size="sm" onClick={() => run(selectedId)}>
                  <Play className="h-3.5 w-3.5" /> Запустить
                </Button>
              )}
            </div>

            <PipelineAnimation
              activeStage={activeStage}
              phase={phase}
              result={result}
            />

            {phase === "done" && result && <ResultPanel result={result} />}
          </div>
        </div>
      </div>
    </section>
  );
}
