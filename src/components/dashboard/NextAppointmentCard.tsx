import { CalendarClock } from "lucide-react";
import type { Appointment } from "../../types/appointment";
import { formatDateLabel, formatTime } from "../../lib/date";
import { DashboardCard } from "./DashboardCard";

type NextAppointmentCardProps = {
  appointment: Appointment | null;
};

export function NextAppointmentCard({ appointment }: NextAppointmentCardProps) {
  if (!appointment) {
    return (
      <DashboardCard icon={CalendarClock} label="Próximo atendimento">
        <p className="mt-4 text-sm text-[#5C6B68]">Nenhum atendimento agendado.</p>
      </DashboardCard>
    );
  }

  return (
    <DashboardCard icon={CalendarClock} label="Próximo atendimento" accent>
      <p className="mt-3 text-3xl font-semibold text-[#12201E]">
        {formatTime(appointment.start_time)}
      </p>
      <p className="mt-1 truncate text-sm font-medium text-[#12201E]">
        {appointment.client_name}
      </p>
      <p className="truncate text-xs text-[#5C6B68]">
        {appointment.service.name} · {formatDateLabel(appointment.appointment_date)}
      </p>
    </DashboardCard>
  );
}
