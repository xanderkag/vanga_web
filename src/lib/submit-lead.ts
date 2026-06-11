/**
 * Отправка заявки на пилот. Приёмник инкапсулирован здесь (ТЗ §7): UI от него
 * не зависит. На старте — POST на VITE_LEAD_ENDPOINT (эндпоинт doc-service
 * /leads или внешний сборщик). Если endpoint не задан — fallback на mailto.
 */

export interface LeadInput {
  name: string;
  company: string;
  email: string;
  docType: string;
  volume: string;
  comment: string;
  consent: boolean;
}

export interface LeadResult {
  ok: boolean;
  channel: "api" | "mailto";
  error?: string;
}

const FALLBACK_EMAIL = "liapustin@gmail.com";

export async function submitLead(input: LeadInput): Promise<LeadResult> {
  const endpoint = import.meta.env.VITE_LEAD_ENDPOINT as string | undefined;

  if (endpoint) {
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...input, source: "portal/pilot" }),
      });
      if (!res.ok) {
        return { ok: false, channel: "api", error: `HTTP ${res.status}` };
      }
      return { ok: true, channel: "api" };
    } catch (e) {
      return {
        ok: false,
        channel: "api",
        error: e instanceof Error ? e.message : "network error",
      };
    }
  }

  // fallback: открыть почтовый клиент с заполненным письмом
  const subject = `Заявка на пилот Doc Parser — ${input.company || input.name}`;
  const body = [
    `Имя: ${input.name}`,
    `Компания: ${input.company}`,
    `Email: ${input.email}`,
    `Тип документов: ${input.docType}`,
    `Объём в месяц: ${input.volume}`,
    `Комментарий: ${input.comment}`,
  ].join("\n");
  const href = `mailto:${FALLBACK_EMAIL}?subject=${encodeURIComponent(
    subject,
  )}&body=${encodeURIComponent(body)}`;
  window.location.href = href;
  return { ok: true, channel: "mailto" };
}
