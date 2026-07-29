import { CalendarClock } from "lucide-react";
import type { Appointment } from "../../types/appointment";
import { formatDateLabel, formatTime } from "../../lib/date";
import { AppointmentStatusBadge } from "./AppointmentStatusBadge";

type UpcomingAppointmentsListProps = {
  appointments: Appointment[];
};

export function UpcomingAppointmentsList({ appointments }: UpcomingAppointmentsListProps) {
  return (
    <div className="rounded-2xl border border-[#E4E1D8] bg-white">
      <div className="border-b border-[#E4E1D8] px-5 py-4">
        <h2 className="text-sm font-medium text-[#12201E]">Próximos agendamentos</h2>
      </div>

      {appointments.length === 0 ? (
        <div className="flex flex-col items-center gap-2 px-5 py-10 text-center">
          <CalendarClock className="h-5 w-5 text-[#5C6B68]" strokeWidth={1.75} />
          <p className="text-sm text-[#5C6B68]">Nenhum agendamento futuro por enquanto.</p>
        </div>
      ) : (
        <ul className="px-5">
          {appointments.map((appointment) => (
            <li
              key={appointment.id}
              className="flex flex-col gap-2 border-b border-[#E4E1D8] py-3.5 last:border-0 sm:flex-row sm:items-center sm:gap-4"
            >
              <div className="flex items-baseline gap-2 sm:w-24 sm:shrink-0">
                <span className="text-sm font-semibold tabular-nums text-[#12201E]">
                  {formatTime(appointment.start_time)}
                </span>
                <span className="text-xs text-[#5C6B68] sm:hidden">
                  {formatDateLabel(appointment.appointment_date)}
                </span>
              </div>

              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-[#12201E]">
                  {appointment.client_name}
                </p>
                <p className="truncate text-xs text-[#5C6B68]">
                  {appointment.service.name} · {appointment.collaborator.name}
                </p>
              </div>

              <span className="hidden text-xs text-[#5C6B68] sm:block sm:w-12">
                {formatDateLabel(appointment.appointment_date)}
              </span>

              <AppointmentStatusBadge status={appointment.status} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
