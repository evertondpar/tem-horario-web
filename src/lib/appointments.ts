import { AppointmentStatus, type Appointment } from "../types/appointment";
import { combineDateTime, toDateStr } from "./date";

const ACTIVE_STATUSES: AppointmentStatus[] = [
  AppointmentStatus.SCHEDULED,
  AppointmentStatus.CONFIRMED,
];

const INACTIVE_STATUSES: AppointmentStatus[] = [
  AppointmentStatus.CANCELED,
  AppointmentStatus.REFUSED,
];

/** Agendamentos de hoje que ainda contam para a operação (exclui cancelados/recusados). */
export function getTodayAppointments(
  appointments: Appointment[],
  referenceDate: Date = new Date(),
): Appointment[] {
  const todayStr = toDateStr(referenceDate);
  return appointments.filter(
    (a) =>
      a.appointment_date === todayStr && !INACTIVE_STATUSES.includes(a.status),
  );
}

/** Agendamentos ativos (agendado/confirmado) a partir de agora, em ordem cronológica. */
export function getUpcomingAppointments(
  appointments: Appointment[],
  referenceDate: Date = new Date(),
  limit = 6,
): Appointment[] {
  return appointments
    .filter((a) => ACTIVE_STATUSES.includes(a.status))
    .map((a) => ({
      appointment: a,
      when: combineDateTime(a.appointment_date, a.start_time),
    }))
    .filter(({ when }) => when.getTime() >= referenceDate.getTime())
    .sort((a, b) => a.when.getTime() - b.when.getTime())
    .slice(0, limit)
    .map(({ appointment }) => appointment);
}

/** O próximo atendimento a acontecer, ou null se não houver nenhum. */
export function getNextAppointment(
  appointments: Appointment[],
  referenceDate: Date = new Date(),
): Appointment | null {
  const [next] = getUpcomingAppointments(appointments, referenceDate, 1);
  return next ?? null;
}

export type AppointmentFilters = {
  /** "YYYY-MM-DD" · vazio = todas as datas */
  date: string;
  /** "all" = todos os colaboradores */
  collaboratorId: number | "all";
  /** "all" = todos os status */
  status: AppointmentStatus | "all";
};

export const DEFAULT_APPOINTMENT_FILTERS: AppointmentFilters = {
  date: "",
  collaboratorId: "all",
  status: "all",
};

/** Aplica os filtros da tela de Agendamentos e ordena por data/hora crescente. */
export function filterAppointments(
  appointments: Appointment[],
  filters: AppointmentFilters,
): Appointment[] {
  if (!appointments) {
    return;
  }
  return appointments
    .filter((a) => {
      if (filters.date && a.appointment_date !== filters.date) return false;
      if (
        filters.collaboratorId !== "all" &&
        a.collaborator_id !== filters.collaboratorId
      ) {
        return false;
      }
      if (filters.status !== "all" && a.status !== filters.status) return false;
      return true;
    })
    .sort(
      (a, b) =>
        combineDateTime(a.appointment_date, a.start_time).getTime() -
        combineDateTime(b.appointment_date, b.start_time).getTime(),
    );
}
