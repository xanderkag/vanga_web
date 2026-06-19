import {
  ArrowLeftRight,
  BadgeCheck,
  Banknote,
  Boxes,
  ClipboardList,
  Coins,
  FileCheck2,
  FileMinus2,
  FilePlus2,
  FileSignature,
  FileSpreadsheet,
  FileText,
  Globe,
  Handshake,
  ListChecks,
  Package,
  ReceiptText,
  Route,
  Scale,
  ScrollText,
  ShieldCheck,
  Ship,
  Stamp,
  Tag,
  Truck,
  Undo2,
  Warehouse,
  type LucideIcon,
} from "lucide-react";

/** Имя иконки из document-types.json → компонент lucide. */
const map: Record<string, LucideIcon> = {
  ArrowLeftRight,
  BadgeCheck,
  Banknote,
  Boxes,
  ClipboardList,
  Coins,
  FileCheck2,
  FileMinus2,
  FilePlus2,
  FileSignature,
  FileSpreadsheet,
  FileText,
  Globe,
  Handshake,
  ListChecks,
  Package,
  ReceiptText,
  Route,
  Scale,
  ScrollText,
  ShieldCheck,
  Ship,
  Stamp,
  Tag,
  Truck,
  Undo2,
  Warehouse,
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
