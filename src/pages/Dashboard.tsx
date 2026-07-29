import { CalendarDays, Users, Tag } from "lucide-react";
import { StatCard } from "../components/dashboard/StatCard";
import { NextAppointmentCard } from "../components/dashboard/NextAppointmentCard";
import { UpcomingAppointmentsList } from "../components/dashboard/UpcomingAppointmentsList";
import { getNextAppointment, getTodayAppointments, getUpcomingAppointments } from "../lib/appointments";
import {
  MOCK_APPOINTMENTS,
  MOCK_TOTAL_COLLABORATORS,
  MOCK_TOTAL_SERVICES,
} from "../data/mock-dashboard";
import { AppointmentStatus } from "../types/appointment";

export default function Dashboard() {
  // TODO: trocar os mocks por dados reais (ex: React Query buscando
  // GET /appointments, GET /collaborators/count, GET /services/count)
  const todayAppointments = getTodayAppointments(MOCK_APPOINTMENTS);
  const nextAppointment = getNextAppointment(MOCK_APPOINTMENTS);
  const upcomingAppointments = getUpcomingAppointments(MOCK_APPOINTMENTS);

  const confirmedToday = todayAppointments.filter(
    (a) => a.status === AppointmentStatus.CONFIRMED
  ).length;

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={CalendarDays}
          label="Agendamentos de hoje"
          value={todayAppointments.length}
          hint={confirmedToday > 0 ? `${confirmedToday} confirmados` : "Nenhum confirmado ainda"}
        />
        <NextAppointmentCard appointment={nextAppointment} />
        <StatCard
          icon={Users}
          label="Total de colaboradores"
          value={MOCK_TOTAL_COLLABORATORS}
          hint="cadastrados"
        />
        <StatCard
          icon={Tag}
          label="Total de serviços"
          value={MOCK_TOTAL_SERVICES}
          hint="ativos"
        />
      </div>

      <UpcomingAppointmentsList appointments={upcomingAppointments} />
    </div>
  );
}
