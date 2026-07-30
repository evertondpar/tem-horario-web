import { WEEKDAYS, type WeekdayKey } from "../types/schedule";
import { toDateStr } from "./date";

export const SLOTS_PER_DAY = 48;
export const SLOT_DURATION_MINUTES = 30;

/** índice 0 -> "00:00" · índice 16 -> "08:00" · índice 47 -> "23:30" */
export function slotIndexToTime(index: number): string {
  const totalMinutes = index * SLOT_DURATION_MINUTES;
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
}

/** "08:00 – 08:30" */
export function slotRangeLabel(index: number): string {
  const start = slotIndexToTime(index);
  const end = slotIndexToTime((index + 1) % SLOTS_PER_DAY);
  return `${start} – ${end === "00:00" ? "24:00" : end}`;
}

/** Datas (YYYY-MM-DD) de segunda a domingo da semana de referenceDate. */
export function getWeekDates(referenceDate: Date = new Date()): Record<WeekdayKey, string> {
  const weekDay = referenceDate.getDay(); // 0 = domingo … 6 = sábado
  const mondayOffset = weekDay === 0 ? -6 : 1 - weekDay;

  const monday = new Date(referenceDate);
  monday.setDate(referenceDate.getDate() + mondayOffset);

  const result = {} as Record<WeekdayKey, string>;
  WEEKDAYS.forEach((key, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    result[key] = toDateStr(d);
  });
  return result;
}

/** "27/07" a partir de "YYYY-MM-DD" */
export function formatShortDate(dateStr: string): string {
  const [year, month, day] = dateStr.split("-").map(Number);
  return new Date(year, (month ?? 1) - 1, day ?? 1).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
  });
}
