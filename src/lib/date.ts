export function toDateStr(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

/** Junta "YYYY-MM-DD" + "HH:mm[:ss]" em um único Date, em horário local. */
export function combineDateTime(dateStr: string, timeStr: string): Date {
  const [year, month, day] = dateStr.split("-").map(Number);
  const [hours, minutes, seconds] = timeStr.split(":").map(Number);
  return new Date(year, (month ?? 1) - 1, day ?? 1, hours ?? 0, minutes ?? 0, seconds ?? 0);
}

/** Normaliza "HH:mm:ss" ou "HH:mm" para exibição como "HH:mm". */
export function formatTime(timeStr: string): string {
  return timeStr.slice(0, 5);
}

/** "Hoje", "Amanhã" ou "dd/MM" a partir de uma data "YYYY-MM-DD". */
export function formatDateLabel(dateStr: string, referenceDate: Date = new Date()): string {
  const todayStr = toDateStr(referenceDate);

  const tomorrow = new Date(referenceDate);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = toDateStr(tomorrow);

  if (dateStr === todayStr) return "Hoje";
  if (dateStr === tomorrowStr) return "Amanhã";

  const [year, month, day] = dateStr.split("-").map(Number);
  return new Date(year, (month ?? 1) - 1, day ?? 1).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
  });
}
