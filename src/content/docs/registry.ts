export interface DocPage {
  slug: string;
  title: string;
  description: string;
}
export interface DocSection {
  title: string;
  pages: DocPage[];
}

export const docsNav: DocSection[] = [
  {
    title: "Начало",
    pages: [
      {
        slug: "intro",
        title: "Что это и как работает",
        description: "Архитектура сервиса: doc-service + inference-service, вход и выход.",
      },
      {
        slug: "quickstart",
        title: "Быстрый старт",
        description: "Happy-path интеграции: файл → job_id → вебхук → JSON.",
      },
    ],
  },
  {
    title: "Справочник",
    pages: [
      {
        slug: "document-types",
        title: "Типы документов",
        description: "Каталог 30 встроенных типов, фазы парсера и схемы вывода.",
      },
      {
        slug: "api",
        title: "API",
        description: "Эндпоинты doc-service: создание job, статус, результат.",
      },
      {
        slug: "webhooks",
        title: "Вебхуки",
        description: "Доставка результата, payload, проверка HMAC-подписи, ретраи.",
      },
      {
        slug: "errors",
        title: "Ошибки и валидация",
        description: "Коды ошибок и флаги доменной валидации (ИНН/КПП, VAT, госномер).",
      },
    ],
  },
  {
    title: "Прочее",
    pages: [
      {
        slug: "changelog",
        title: "История версий",
        description: "Что добавлено в каждой версии портала и API.",
      },
    ],
  },
];

export const docsFlat: DocPage[] = docsNav.flatMap((s) => s.pages);
export const firstDocSlug = docsFlat[0]!.slug;

export function findDoc(slug: string): DocPage | undefined {
  return docsFlat.find((p) => p.slug === slug);
}

export function adjacentDocs(slug: string): {
  prev?: DocPage;
  next?: DocPage;
} {
  const i = docsFlat.findIndex((p) => p.slug === slug);
  if (i === -1) return {};
  return {
    prev: i > 0 ? docsFlat[i - 1] : undefined,
    next: i < docsFlat.length - 1 ? docsFlat[i + 1] : undefined,
  };
}
