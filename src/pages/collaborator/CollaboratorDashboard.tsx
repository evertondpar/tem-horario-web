import { useEffect, useState } from "react";
import { CalendarDays, Clock3, Scissors, UserRound } from "lucide-react";
import { Link } from "react-router-dom";
import { getCollaboratorAppointments } from "../../api/collaborator/appointments";
import { getAssignedServices } from "../../api/collaborator/services";
import { storage } from "../../utils/storage";
import type { Appointment } from "../../types/appointment";

export default function CollaboratorDashboard() {
  const session = storage.getSession();
  const collaboratorId = session?.user.id;
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [serviceCount, setServiceCount] = useState(0);

  useEffect(() => {
    if (!collaboratorId) return;
    Promise.allSettled([
      getCollaboratorAppointments(collaboratorId),
      getAssignedServices(),
    ]).then(([appointmentResult, serviceResult]) => {
      if (appointmentResult.status === "fulfilled") setAppointments(appointmentResult.value);
      if (serviceResult.status === "fulfilled") setServiceCount(serviceResult.value.length);
    });
  }, [collaboratorId]);

  const today = new Date().toISOString().slice(0, 10);
  const todayAppointments = appointments.filter((item) => item.appointment_date === today);
  const next = [...appointments]
    .filter((item) => `${item.appointment_date}T${item.start_time}` >= new Date().toISOString().slice(0, 19))
    .sort((a, b) => `${a.appointment_date}${a.start_time}`.localeCompare(`${b.appointment_date}${b.start_time}`))[0];

  const cards = [
    { label: "Atendimentos hoje", value: todayAppointments.length, icon: CalendarDays },
    { label: "Próximo horário", value: next?.start_time?.slice(0, 5) ?? "—", icon: Clock3 },
    { label: "Serviços atribuídos", value: serviceCount, icon: Scissors },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="text-sm text-[#5C6B68]">Olá, {session?.user.name?.split(" ")[0]}.</p>
        <h2 className="th-display mt-1 text-2xl font-medium text-[#12201E]">Sua rotina em um só lugar</h2>
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        {cards.map(({ label, value, icon: Icon }) => (
          <div key={label} className="rounded-2xl border border-[#E4E1D8] bg-white p-5">
            <Icon className="h-5 w-5 text-[#0F5C56]" strokeWidth={1.75} />
            <p className="mt-5 text-2xl font-semibold text-[#12201E]">{value}</p>
            <p className="mt-1 text-sm text-[#5C6B68]">{label}</p>
          </div>
        ))}
      </div>
      <div className="rounded-2xl border border-[#E4E1D8] bg-white p-5">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0F5C56]/10 text-[#0F5C56]"><UserRound className="h-5 w-5" /></span>
          <div><p className="font-medium text-[#12201E]">{session?.user.name}</p><p className="text-sm text-[#5C6B68]">{session?.establishment?.name}</p></div>
        </div>
        <div className="mt-5 flex flex-wrap gap-2">
          <Link to="/colaborador/agendamentos" className="rounded-xl bg-[#0F5C56] px-4 py-2 text-sm font-medium text-white">Ver agendamentos</Link>
          <Link to="/colaborador/agenda" className="rounded-xl border border-[#E4E1D8] px-4 py-2 text-sm font-medium text-[#12201E]">Configurar agenda</Link>
        </div>
      </div>
    </div>
  );
}
