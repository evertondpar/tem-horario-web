import { AppointmentStatus, type Appointment, type Collaborator, type Service } from "../types/appointment";
import { toDateStr } from "../lib/date";

// TODO: trocar por dados vindos da API (ex: GET /appointments, GET /collaborators, GET /services)

const now = new Date();
const todayStr = toDateStr(now);
const tomorrow = new Date(now);
tomorrow.setDate(tomorrow.getDate() + 1);
const tomorrowStr = toDateStr(tomorrow);

/** Gera um horário "HH:mm" a partir de agora + um deslocamento em horas. */
function timeFromNow(hoursOffset: number): string {
  const d = new Date(now.getTime() + hoursOffset * 60 * 60 * 1000);
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}

const COLLABORATORS: Collaborator[] = [
  { id: 1, name: "Marina Silva" },
  { id: 2, name: "Rafael Torres" },
  { id: 3, name: "Bianca Ferreira" },
];

const SERVICES: Service[] = [
  { id: 1, name: "Corte Masculino" },
  { id: 2, name: "Coloração" },
  { id: 3, name: "Manicure" },
  { id: 4, name: "Barba" },
];

export const MOCK_APPOINTMENTS: Appointment[] = [
  {
    id: 1,
    collaborator_id: 1,
    collaborator: COLLABORATORS[0],
    client_name: "Ana Paula Rocha",
    client_phone: "(11) 91234-5678",
    service_id: 1,
    service: SERVICES[0],
    status: AppointmentStatus.COMPLETED,
    appointment_date: todayStr,
    start_time: timeFromNow(-3),
    createdAt: now.toISOString(),
    updatedAt: now.toISOString(),
  },
  {
    id: 2,
    collaborator_id: 2,
    collaborator: COLLABORATORS[1],
    client_name: "Diego Martins",
    client_phone: "(11) 99876-5432",
    service_id: 4,
    service: SERVICES[3],
    status: AppointmentStatus.CANCELED,
    appointment_date: todayStr,
    start_time: timeFromNow(-1),
    createdAt: now.toISOString(),
    updatedAt: now.toISOString(),
  },
  {
    id: 3,
    collaborator_id: 3,
    collaborator: COLLABORATORS[2],
    client_name: "Beatriz Lima",
    client_phone: "(11) 98765-4321",
    service_id: 2,
    service: SERVICES[1],
    status: AppointmentStatus.CONFIRMED,
    appointment_date: todayStr,
    start_time: timeFromNow(1),
    createdAt: now.toISOString(),
    updatedAt: now.toISOString(),
  },
  {
    id: 4,
    collaborator_id: 1,
    collaborator: COLLABORATORS[0],
    client_name: "Carlos Eduardo",
    client_phone: "(11) 97654-3210",
    service_id: 3,
    service: SERVICES[2],
    status: AppointmentStatus.SCHEDULED,
    appointment_date: todayStr,
    start_time: timeFromNow(3),
    createdAt: now.toISOString(),
    updatedAt: now.toISOString(),
  },
  {
    id: 5,
    collaborator_id: 2,
    collaborator: COLLABORATORS[1],
    client_name: "Fernanda Alves",
    client_phone: "(11) 96543-2109",
    service_id: 1,
    service: SERVICES[0],
    status: AppointmentStatus.SCHEDULED,
    appointment_date: todayStr,
    start_time: timeFromNow(6),
    createdAt: now.toISOString(),
    updatedAt: now.toISOString(),
  },
  {
    id: 6,
    collaborator_id: 3,
    collaborator: COLLABORATORS[2],
    client_name: "Juliana Prado",
    client_phone: "(11) 95432-1098",
    service_id: 2,
    service: SERVICES[1],
    status: AppointmentStatus.CONFIRMED,
    appointment_date: tomorrowStr,
    start_time: "09:00",
    createdAt: now.toISOString(),
    updatedAt: now.toISOString(),
  },
  {
    id: 7,
    collaborator_id: 2,
    collaborator: COLLABORATORS[1],
    client_name: "Marcos Vinícius",
    client_phone: "(11) 94321-0987",
    service_id: 4,
    service: SERVICES[3],
    status: AppointmentStatus.SCHEDULED,
    appointment_date: tomorrowStr,
    start_time: "14:00",
    createdAt: now.toISOString(),
    updatedAt: now.toISOString(),
  },
];

export const MOCK_TOTAL_COLLABORATORS = 6;
export const MOCK_TOTAL_SERVICES = 9;
