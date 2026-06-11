import {
  ArrowLeftRight,
  Banknote,
  Boxes,
  ClipboardList,
  FileCheck2,
  FileSignature,
  FileSpreadsheet,
  FileText,
  Globe,
  ListChecks,
  Package,
  ReceiptText,
  Route,
  ScrollText,
  Truck,
  type LucideIcon,
} from "lucide-react";

/** Имя иконки из document-types.json → компонент lucide. */
const map: Record<string, LucideIcon> = {
  ArrowLeftRight,
  Banknote,
  Boxes,
  ClipboardList,
  FileCheck2,
  FileSignature,
  FileSpreadsheet,
  FileText,
  Globe,
  ListChecks,
  Package,
  ReceiptText,
  Route,
  ScrollText,
  Truck,
};

export function DocTypeIcon({
  name,
  className,
}: {
  name: string;
  className?: string;
}) {
  const Icon = map[name] ?? FileText;
  return <Icon className={className} aria-hidden />;
}
