import { CalendarCheck2, CalendarX, Loader2, XCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { cancelClientAppointment, getClientAppointments } from "../../api/client";
import { AppointmentStatus, type Appointment } from "../../types/appointment";
import { AppointmentStatusBadge } from "../../components/appointments/AppointmentStatusBadge";
import { formatDateLabel, formatTime } from "../../lib/date";

export default function ClientAppointments() {
  const booked = !!useLocation().state?.booked;
  const [items, setItems] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [canceling, setCanceling] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => { getClientAppointments().then(setItems).catch(() => setError("Não foi possível carregar seus agendamentos.")).finally(() => setLoading(false)); }, []);
  async function cancel(id: number) { setCanceling(id); setError(null); try { const updated = await cancelClientAppointment(id, AppointmentStatus.CANCELED); setItems((current) => current.map((item) => item.id === id ? { ...item, ...updated } : item)); } catch { setError("Não foi possível cancelar este agendamento."); } finally { setCanceling(null); } }
  return <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6"><div><h1 className="th-display text-3xl font-medium">Meus horários</h1><p className="mt-2 text-sm text-[#5C6B68]">Acompanhe seus próximos atendimentos.</p></div>{booked && <div className="mt-6 flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800"><CalendarCheck2 className="h-5 w-5" />Agendamento realizado com sucesso.</div>}{error && <div className="mt-5 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>}
    {loading ? <div className="flex justify-center py-20"><Loader2 className="h-6 w-6 animate-spin text-[#0F5C56]" /></div> : items.length === 0 ? <div className="mt-8 flex flex-col items-center gap-2 rounded-2xl border border-dashed border-[#E4E1D8] py-20"><CalendarX className="h-6 w-6 text-[#5C6B68]" /><p className="text-sm text-[#5C6B68]">Você ainda não possui agendamentos.</p></div> : <div className="mt-8 grid gap-4">{items.map((item) => <article key={item.id} className="flex flex-col gap-4 rounded-2xl border border-[#E4E1D8] bg-white p-5 sm:flex-row sm:items-center sm:justify-between"><div><div className="flex flex-wrap items-center gap-2"><h2 className="font-semibold">{item.service?.name ?? `Serviço #${item.service_id}`}</h2><AppointmentStatusBadge status={item.status} /></div><p className="mt-2 text-sm text-[#5C6B68]">{formatDateLabel(item.appointment_date)} às {formatTime(item.start_time)} · {item.collaborator?.name ?? "Profissional"}</p></div>{![AppointmentStatus.CANCELED, AppointmentStatus.COMPLETED, AppointmentStatus.REFUSED].includes(item.status) && <button disabled={canceling === item.id} onClick={() => void cancel(item.id)} className="flex items-center justify-center gap-2 rounded-xl border border-red-200 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 disabled:opacity-60"><XCircle className="h-4 w-4" />{canceling === item.id ? "Cancelando…" : "Cancelar"}</button>}</article>)}</div>}
  </div>;
}
