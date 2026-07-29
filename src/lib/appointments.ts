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
  referenceDate: Date = new Date()
): Appointment[] {
  const todayStr = toDateStr(referenceDate);
  return appointments.filter(
    (a) => a.appointment_date === todayStr && !INACTIVE_STATUSES.includes(a.status)
  );
}

/** Agendamentos ativos (agendado/confirmado) a partir de agora, em ordem cronológica. */
export function getUpcomingAppointments(
  appointments: Appointment[],
  referenceDate: Date = new Date(),
  limit = 6
): Appointment[] {
  return appointments
    .filter((a) => ACTIVE_STATUSES.includes(a.status))
    .map((a) => ({ appointment: a, when: combineDateTime(a.appointment_date, a.start_time) }))
    .filter(({ when }) => when.getTime() >= referenceDate.getTime())
    .sort((a, b) => a.when.getTime() - b.when.getTime())
    .slice(0, limit)
    .map(({ appointment }) => appointment);
}

/** O próximo atendimento a acontecer, ou null se não houver nenhum. */
export function getNextAppointment(
  appointments: Appointment[],
  referenceDate: Date = new Date()
): Appointment | null {
  const [next] = getUpcomingAppointments(appointments, referenceDate, 1);
  return next ?? null;
}
