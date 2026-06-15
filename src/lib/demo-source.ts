import type { Json } from "@/components/docs/JsonViewer";
import type { CategoryKey } from "@/lib/doc-types";
import { demoCases } from "@/content/demo/cases";

/**
 * Источник данных демо за интерфейсом (ТЗ §6.3). На старте работает
 * StaticDemoSource (предзаписанные кейсы). Переход на живой API —
 * замена провайдера в getDemoSource(), UI не меняется.
 */

export type StageKey = "ocr" | "classify" | "extract" | "validate";

export const STAGES: { key: StageKey; label: string }[] = [
  { key: "ocr", label: "OCR-каскад" },
  { key: "classify", label: "Классификация" },
  { key: "extract", label: "Извлечение полей" },
  { key: "validate", label: "Доменная валидация" },
];

export interface StageTiming {
  stage: StageKey;
  ms: number;
}

export interface ValidationFlag {
  label: string;
  ok: boolean;
  detail?: string;
}

export interface DemoField {
  label: string;
  value: string;
}

/** Сторона документа (продавец/покупатель/перевозчик…). */
export interface DocParty {
  role: string;
  name: string;
  inn?: string;
  kpp?: string;
  address?: string;
}

/** Позиция табличной части документа. */
export interface DocItem {
  name: string;
  qty?: string;
  price?: string;
  sum: string;
}

/** Данные для отрисовки реалистичного превью документа. */
export interface DocRender {
  kind: "accounting" | "transport";
  org: string; // на чьём бланке / печати
  title: string;
  number: string;
  date: string;
  parties: DocParty[];
  items?: DocItem[];
  total?: string;
  vat?: string;
  /** Доп. поля для транспортных (маршрут, ТС, груз). */
  rows?: { k: string; v: string }[];
  signer?: string;
}

/** Карточка кейса для галереи + данные превью (отрисовывается как документ). */
export interface DemoCase {
  id: string;
  label: string;
  docTypeSlug: string;
  category: CategoryKey;
  icon: string;
  doc: DocRender;
}

/** Результат прогона — предзаписанный выход пайплайна. */
export interface DemoResult {
  id: string;
  type: string;
  confidence: number;
  ocrEngine: string;
  timings: StageTiming[];
  fields: DemoField[];
  validation: ValidationFlag[];
  json: Json;
}

/** Полный кейс: то, что показываем + то, что «выдаёт пайплайн». */
export interface DemoCaseFull extends DemoCase {
  result: Omit<DemoResult, "id">;
}

export interface DemoSource {
  listCases(): Promise<DemoCase[]>;
  runCase(id: string): Promise<DemoResult>;
}

function toCase(c: DemoCaseFull): DemoCase {
  const { result: _r, ...rest } = c;
  void _r;
  return rest;
}

/** Предзаписанные кейсы (без обращения к API). */
export class StaticDemoSource implements DemoSource {
  async listCases(): Promise<DemoCase[]> {
    return demoCases.map(toCase);
  }

  async runCase(id: string): Promise<DemoResult> {
    const c = demoCases.find((x) => x.id === id);
    if (!c) throw new Error(`Demo case not found: ${id}`);
    return { id: c.id, ...c.result };
  }
}

/** Заглушка живого источника — будет ходить в реальный API (ТЗ §6.2). */
export class LiveApiDemoSource implements DemoSource {
  constructor(private baseUrl: string) {}
  private notReady(): never {
    throw new Error(
      `LiveApiDemoSource (${this.baseUrl || "no base url"}) ещё не реализован`,
    );
  }
  async listCases(): Promise<DemoCase[]> {
    return this.notReady();
  }
  async runCase(_id: string): Promise<DemoResult> {
    void _id;
    return this.notReady();
  }
}

export function getDemoSource(): DemoSource {
  const mode = import.meta.env.VITE_DEMO_MODE ?? "static";
  if (mode === "live") {
    return new LiveApiDemoSource(import.meta.env.VITE_API_BASE_URL ?? "");
  }
  return new StaticDemoSource();
}
