import { useEffect, useMemo, useState } from "react";
import { CalendarX, Loader2 } from "lucide-react";
import { changeAppointmentStatus, getCollaboratorAppointments } from "../../api/collaborator/appointments";
import { AppointmentStatus, APPOINTMENT_STATUS_LABELS, type Appointment } from "../../types/appointment";
import { AppointmentStatusBadge } from "../../components/appointments/AppointmentStatusBadge";
import { formatDateLabel, formatTime } from "../../lib/date";
import { storage } from "../../utils/storage";
import { APPOINTMENTS_UPDATED_EVENT } from "../../lib/notification-events";

export default function CollaboratorAppointments() {
  const session = storage.getSession();
  const collaboratorId = session?.user.id;
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [status, setStatus] = useState<AppointmentStatus | "all">("all");
  const [date, setDate] = useState("");
  const [loading, setLoading] = useState(true);
  const [changingId, setChangingId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!collaboratorId) return;
    let active = true;
    const refresh = () => void getCollaboratorAppointments(collaboratorId)
      .then((items) => { if (active) setAppointments(items); })
      .catch(() => { if (active) setError("Não foi possível carregar seus agendamentos."); })
      .finally(() => { if (active) setLoading(false); });
    const refreshWhenVisible = () => { if (document.visibilityState === "visible") refresh(); };

    refresh();
    window.addEventListener(APPOINTMENTS_UPDATED_EVENT, refresh);
    document.addEventListener("visibilitychange", refreshWhenVisible);
    return () => {
      active = false;
      window.removeEventListener(APPOINTMENTS_UPDATED_EVENT, refresh);
      document.removeEventListener("visibilitychange", refreshWhenVisible);
    };
  }, [collaboratorId]);

  const filtered = useMemo(() => appointments.filter((item) => (status === "all" || item.status === status) && (!date || item.appointment_date === date)), [appointments, status, date]);

  async function changeStatus(id: number, nextStatus: AppointmentStatus) {
    setChangingId(id); setError(null);
    try {
      const updated = await changeAppointmentStatus(id, nextStatus);
      setAppointments((current) => current.map((item) => item.id === id ? { ...item, ...updated } : item));
    } catch { setError("Não foi possível alterar o status deste agendamento."); }
    finally { setChangingId(null); }
  }

  function appointmentActions(item: Appointment) {
    if (item.status === AppointmentStatus.SCHEDULED) {
      return <>
        <button disabled={changingId === item.id} onClick={() => void changeStatus(item.id, AppointmentStatus.CONFIRMED)} className="flex-1 rounded-lg bg-[#0F5C56] px-3 py-2 text-xs font-medium text-white disabled:opacity-60 sm:flex-none sm:py-1.5">Confirmar</button>
        <button disabled={changingId === item.id} onClick={() => void changeStatus(item.id, AppointmentStatus.REFUSED)} className="flex-1 rounded-lg border border-[#E4E1D8] px-3 py-2 text-xs font-medium text-[#5C6B68] disabled:opacity-60 sm:flex-none sm:py-1.5">Recusar</button>
      </>;
    }
    if (item.status === AppointmentStatus.CONFIRMED) {
      return <button disabled={changingId === item.id} onClick={() => void changeStatus(item.id, AppointmentStatus.COMPLETED)} className="w-full rounded-lg bg-[#0F5C56] px-3 py-2 text-xs font-medium text-white disabled:opacity-60 sm:w-auto sm:py-1.5">Concluir</button>;
    }
    return null;
  }

  if (loading) return <div className="flex justify-center py-16"><Loader2 className="h-5 w-5 animate-spin text-[#0F5C56]" /></div>;
  return <div className="flex flex-col gap-5">
    <div className="grid gap-3 rounded-2xl border border-[#E4E1D8] bg-white p-5 sm:grid-cols-2">
      <label className="text-sm font-medium text-[#12201E]">Data<input type="date" value={date} onChange={(event) => setDate(event.target.value)} className="mt-1.5 block w-full rounded-xl border border-[#E4E1D8] px-3.5 py-2.5 font-normal outline-none focus:border-[#0F5C56]" /></label>
      <label className="text-sm font-medium text-[#12201E]">Status<select value={status} onChange={(event) => setStatus(event.target.value as AppointmentStatus | "all")} className="mt-1.5 block w-full rounded-xl border border-[#E4E1D8] bg-white px-3.5 py-2.5 font-normal outline-none focus:border-[#0F5C56]"><option value="all">Todos</option>{Object.values(AppointmentStatus).map((item) => <option key={item} value={item}>{APPOINTMENT_STATUS_LABELS[item]}</option>)}</select></label>
    </div>
    {error && <div role="alert" className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>}
    {filtered.length === 0 ? <div className="flex flex-col items-center gap-2 rounded-2xl border border-dashed border-[#E4E1D8] px-4 py-16 text-center"><CalendarX className="h-5 w-5 text-[#5C6B68]" /><p className="text-sm text-[#5C6B68]">Nenhum agendamento encontrado.</p></div> : <>
      <div className="grid gap-3 lg:hidden">
        {filtered.map((item) => <article key={item.id} className="min-w-0 rounded-2xl border border-[#E4E1D8] bg-white p-4">
          <div className="flex min-w-0 items-start justify-between gap-3"><div className="min-w-0"><p className="truncate font-medium text-[#12201E]">{item.client_name}</p><p className="text-xs text-[#5C6B68]">{item.client_phone}</p></div><AppointmentStatusBadge status={item.status} /></div>
          <dl className="mt-4 grid gap-3 border-t border-[#E4E1D8] pt-4 text-sm"><div><dt className="text-xs text-[#5C6B68]">Serviço</dt><dd className="mt-0.5 break-words text-[#12201E]">{item.service?.name ?? `Serviço #${item.service_id}`}</dd></div><div><dt className="text-xs text-[#5C6B68]">Data e hora</dt><dd className="mt-0.5 text-[#12201E]">{formatDateLabel(item.appointment_date)} às {formatTime(item.start_time)}</dd></div></dl>
          {(item.status === AppointmentStatus.SCHEDULED || item.status === AppointmentStatus.CONFIRMED) && <div className="mt-4 flex gap-2">{appointmentActions(item)}</div>}
        </article>)}
      </div>
      <div className="hidden overflow-hidden rounded-2xl border border-[#E4E1D8] bg-white lg:block"><table className="w-full text-sm"><thead><tr className="border-b border-[#E4E1D8] text-left text-xs uppercase tracking-wide text-[#5C6B68]"><th className="px-5 py-3">Cliente</th><th className="px-5 py-3">Serviço</th><th className="px-5 py-3">Data e hora</th><th className="px-5 py-3">Status</th><th className="px-5 py-3">Ações</th></tr></thead><tbody>{filtered.map((item) => <tr key={item.id} className="border-b border-[#E4E1D8] last:border-0"><td className="px-5 py-4"><p className="font-medium text-[#12201E]">{item.client_name}</p><p className="text-xs text-[#5C6B68]">{item.client_phone}</p></td><td className="px-5 py-4 text-[#5C6B68]">{item.service?.name ?? `Serviço #${item.service_id}`}</td><td className="px-5 py-4 text-[#5C6B68]">{formatDateLabel(item.appointment_date)} às {formatTime(item.start_time)}</td><td className="px-5 py-4"><AppointmentStatusBadge status={item.status} /></td><td className="px-5 py-4"><div className="flex gap-2">{appointmentActions(item)}</div></td></tr>)}</tbody></table></div>
    </>}
  </div>;
}
