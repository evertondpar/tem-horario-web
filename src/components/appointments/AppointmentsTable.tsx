import { CalendarX } from "lucide-react";
import type { Appointment } from "../../types/appointment";
import { formatDateLabel, formatTime } from "../../lib/date";
import { AppointmentStatusBadge } from "./AppointmentStatusBadge";

type AppointmentsTableProps = {
  appointments: Appointment[];
  onClearFilters?: () => void;
  hasActiveFilters?: boolean;
};

export function AppointmentsTable({
  appointments,
  onClearFilters,
  hasActiveFilters,
}: AppointmentsTableProps) {
  if (appointments.length === 0) {
    return (
      <div className="flex flex-col items-center gap-2 rounded-2xl border border-dashed border-[#E4E1D8] px-6 py-16 text-center">
        <CalendarX className="h-5 w-5 text-[#5C6B68]" strokeWidth={1.75} />
        <p className="text-sm text-[#5C6B68]">
          {hasActiveFilters
            ? "Nenhum agendamento encontrado com esses filtros."
            : "Nenhum agendamento cadastrado ainda."}
        </p>
        {hasActiveFilters && onClearFilters && (
          <button
            type="button"
            onClick={onClearFilters}
            className="mt-1 text-sm font-medium text-[#0F5C56] hover:underline"
          >
            Limpar filtros
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-[#E4E1D8] bg-white">
      <table className="w-full min-w-[860px] text-sm">
        <thead>
          <tr className="border-b border-[#E4E1D8] text-left text-xs font-medium uppercase tracking-wide text-[#5C6B68]">
            <th className="px-5 py-3 font-medium">Cliente</th>
            <th className="px-5 py-3 font-medium">Telefone</th>
            <th className="px-5 py-3 font-medium">Serviço</th>
            <th className="px-5 py-3 font-medium">Colaborador</th>
            <th className="px-5 py-3 font-medium">Data</th>
            <th className="px-5 py-3 font-medium">Hora</th>
            <th className="px-5 py-3 font-medium">Status</th>
          </tr>
        </thead>
        <tbody>
          {appointments.map((appointment) => (
            <tr
              key={appointment.id}
              className="border-b border-[#E4E1D8] last:border-0 hover:bg-[#F7F6F2]/60"
            >
              <td className="px-5 py-3.5 font-medium text-[#12201E]">
                {appointment.client_name}
              </td>
              <td className="px-5 py-3.5 text-[#5C6B68]">{appointment.client_phone}</td>
              <td className="px-5 py-3.5 text-[#5C6B68]">{appointment.service.name}</td>
              <td className="px-5 py-3.5 text-[#5C6B68]">{appointment.collaborator.name}</td>
              <td className="px-5 py-3.5 text-[#5C6B68]">
                {formatDateLabel(appointment.appointment_date)}
              </td>
              <td className="px-5 py-3.5 tabular-nums text-[#5C6B68]">
                {formatTime(appointment.start_time)}
              </td>
              <td className="px-5 py-3.5">
                <AppointmentStatusBadge status={appointment.status} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
