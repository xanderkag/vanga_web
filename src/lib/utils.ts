/** Утилита склейки классов (минимальный аналог clsx/cn для shadcn-компонентов). */
export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}
