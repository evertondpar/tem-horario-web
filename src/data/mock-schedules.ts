import { SLOT_STATUS, WEEKDAYS, type Schedule, type SlotStatusValue } from "../types/schedule";
import { getWeekDates, SLOTS_PER_DAY } from "../lib/schedule";

// TODO: trocar por dados vindos da API (GET /schedules?collaborator_id=)

type BusinessHoursOptions = {
  /** índice do primeiro slot disponível (inclusive) */
  openIndex?: number;
  /** índice do último slot disponível (exclusive) */
  closeIndex?: number;
  /** intervalo de almoço, inclusive-exclusive */
  lunch?: [number, number];
  /** índices que já estão ocupados por um agendamento real */
  booked?: number[];
  closed?: boolean;
};

function buildDaySlots({
  openIndex = 16, // 08:00
  closeIndex = 38, // 19:00
  lunch = [24, 27], // 12:00–13:30
  booked = [],
  closed = false,
}: BusinessHoursOptions = {}): SlotStatusValue[] {
  const slots = Array<SlotStatusValue>(SLOTS_PER_DAY).fill(SLOT_STATUS.UNAVAILABLE);
  if (closed) return slots;

  for (let i = openIndex; i < closeIndex; i++) slots[i] = SLOT_STATUS.AVAILABLE;
  for (let i = lunch[0]; i < lunch[1]; i++) slots[i] = SLOT_STATUS.UNAVAILABLE;
  booked.forEach((i) => {
    slots[i] = SLOT_STATUS.OCCUPIED;
  });

  return slots;
}

function buildWeekSchedule(
  id: number,
  collaboratorId: number,
  bookedByWeekday: Partial<Record<(typeof WEEKDAYS)[number], number[]>>
): Schedule {
  const week = getWeekDates();
  const now = new Date().toISOString();

  const week_slots = Object.fromEntries(
    WEEKDAYS.map((key) => {
      const isWeekend = key === "saturday" || key === "sunday";
      const day = buildDaySlots({
        openIndex: isWeekend ? 16 : 16,
        closeIndex: key === "saturday" ? 32 : isWeekend ? 0 : 38, // sábado até 16h, domingo fechado
        lunch: key === "saturday" ? [22, 22] : [24, 27],
        booked: bookedByWeekday[key] ?? [],
        closed: key === "sunday",
      });
      return [key, { day: week[key], slots: day }];
    })
  );

  return {
    id,
    collaborator_id: collaboratorId,
    ...week_slots,
    createdAt: now,
    updatedAt: now,
  } as Schedule;
}

export const MOCK_SCHEDULES: Schedule[] = [
  buildWeekSchedule(1, 1, {
    monday: [20, 21, 30, 31],
    wednesday: [17, 18],
    friday: [32, 33, 34],
  }),
  buildWeekSchedule(2, 2, {
    tuesday: [16, 17],
    thursday: [28, 29, 30],
    saturday: [18, 19],
  }),
  buildWeekSchedule(3, 3, {
    monday: [22, 23],
    friday: [36, 37],
  }),
];
