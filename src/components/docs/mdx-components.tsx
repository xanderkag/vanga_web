import { Callout } from "./Callout";
import { CodeTabs } from "./CodeTabs";
import { EndpointCard } from "./EndpointCard";
import { JsonViewer } from "./JsonViewer";
import { DocTypeTable } from "./DocTypeTable";

/**
 * Компоненты, доступные внутри любого MDX-файла без явного импорта
 * (через MDXProvider). Стандартные HTML-элементы стилизуются классом
 * `.doc-prose` в index.css, поэтому здесь — только кастомные блоки.
 */
export const mdxComponents = {
  Callout,
  CodeTabs,
  EndpointCard,
  JsonViewer,
  DocTypeTable,
};
