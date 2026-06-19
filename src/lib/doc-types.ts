import raw from "@/content/document-types.json";

export type CategoryKey = "transport" | "accounting" | "legal";
export type PhaseKey = "regex" | "llm";
export type Tier = "stable" | "beta" | "experimental";

export interface DocType {
  slug: string;
  name: string;
  category: CategoryKey;
  phase: PhaseKey;
  tier: Tier;
  icon: string;
  summary: string;
  /** Умеет извлекать массив строк-позиций (товары/услуги/грузы). */
  tables: boolean;
  hasSchema: boolean;
}

interface DocTypesFile {
  categories: Record<CategoryKey, string>;
  phases: Record<PhaseKey, string>;
  types: DocType[];
}

const data = raw as DocTypesFile;

export const categories = data.categories;
export const phases = data.phases;
export const docTypes: DocType[] = data.types;

export const tierLabel: Record<Tier, string> = {
  stable: "stable",
  beta: "beta",
  experimental: "experimental",
};
