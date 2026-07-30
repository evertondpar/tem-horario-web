// Mapeamento assumido a partir do payload de exemplo (que só trouxe 0 e 2):
// 0 = Indisponível · 1 = Ocupado (somente leitura, vem de um agendamento real) · 2 = Disponível
// Se a API usar outros números pra cada status, é só ajustar esses valores.
export const SLOT_STATUS = {
  AVAILABLE: 0,
  OCCUPIED: 1,
  UNAVAILABLE: 2,
} as const;

export type SlotStatusValue = (typeof SLOT_STATUS)[keyof typeof SLOT_STATUS];

export const WEEKDAYS = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
] as const;

export type WeekdayKey = (typeof WEEKDAYS)[number];

export const WEEKDAY_LABELS: Record<WeekdayKey, string> = {
  monday: "Segunda-feira",
  tuesday: "Terça-feira",
  wednesday: "Quarta-feira",
  thursday: "Quinta-feira",
  friday: "Sexta-feira",
  saturday: "Sábado",
  sunday: "Domingo",
};

export type DaySlots = {
  /** "YYYY-MM-DD" */
  day: string;
  /** 48 posições, uma a cada 30 minutos, cobrindo 00:00–24:00 */
  slots: SlotStatusValue[];
};

export type WeekSlots = Record<WeekdayKey, DaySlots>;

export type Schedule = WeekSlots & {
  id: number;
  collaborator_id: number;
  createdAt: string;
  updatedAt: string;
};
