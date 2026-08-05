import { CalendarDays, Users, Tag } from "lucide-react";
import { StatCard } from "../components/dashboard/StatCard";
import { NextAppointmentCard } from "../components/dashboard/NextAppointmentCard";
import { UpcomingAppointmentsList } from "../components/dashboard/UpcomingAppointmentsList";
import { DashboardSkeleton } from "../components/dashboard/DashboardSkeleton";
import { DashboardEmptyState } from "../components/dashboard/DashboardEmptyState";
import { DashboardErrorState } from "../components/dashboard/DashboardErrorState";
import { useDashboardData } from "../hooks/useDashboardData";
import {
  getNextAppointment,
  getTodayAppointments,
  getUpcomingAppointments,
} from "../lib/appointments";
import { AppointmentStatus } from "../types/appointment";

export default function Dashboard() {
  const { status, data, refetch } = useDashboardData();

  if (status === "loading") return <DashboardSkeleton />;
  if (status === "error" || !data) return <DashboardErrorState onRetry={refetch} />;

  const { appointments, totalCollaborators, totalServices } = data;
  const isEmpty = appointments.length === 0 && totalCollaborators === 0 && totalServices === 0;

  if (isEmpty) return <DashboardEmptyState />;

  const todayAppointments = getTodayAppointments(appointments);
  const nextAppointment = getNextAppointment(appointments);
  const upcomingAppointments = getUpcomingAppointments(appointments);

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
          value={totalCollaborators}
          hint="cadastrados"
        />
        <StatCard icon={Tag} label="Total de serviços" value={totalServices} hint="ativos" />
      </div>

      <UpcomingAppointmentsList appointments={upcomingAppointments} />
    </div>
  );
}
