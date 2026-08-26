import { ArrowLeft, Check, Loader2, Scissors, UserRound } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { createClientAppointment, getBookingDetails } from "../../api/client";
import type { EstablishmentBookingDetails } from "../../types/client";
import { SLOT_STATUS, WEEKDAYS, WEEKDAY_LABELS, type WeekdayKey } from "../../types/schedule";
import { formatCurrency, formatDuration } from "../../lib/format";
import { formatDateLabel } from "../../lib/date";
import { storage } from "../../utils/storage";
import { CollaboratorAvatar } from "../../components/collaborators/CollaboratorAvatar";

function slotTime(index: number) { return `${String(Math.floor(index / 2)).padStart(2, "0")}:${index % 2 ? "30" : "00"}`; }

export default function BookingPage() {
  const id = Number(useParams().id);
  const navigate = useNavigate();
  const [details, setDetails] = useState<EstablishmentBookingDetails | null>(null);
  const [serviceId, setServiceId] = useState<number | null>(null);
  const [collaboratorId, setCollaboratorId] = useState<number | null>(null);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => { getBookingDetails(id).then(setDetails).catch(() => setError("Não foi possível carregar este estabelecimento.")).finally(() => setLoading(false)); }, [id]);
  const service = details?.services.find((item) => item.id === serviceId);
  const collaborators = details?.collaborators.filter(
    (item) => !serviceId || item.service_ids.includes(serviceId),
  ) ?? [];
  const collaborator = collaborators.find((item) => item.id === collaboratorId);
  const days = collaborator?.schedule ? WEEKDAYS.map((key) => ({ key, ...collaborator.schedule![key] })).filter((day) => day.day) : [];
  const selectedDay = days.find((day) => day.day === date);
  const availableTimes = (() => {
    if (!selectedDay || !service) return [];
    const duration = service.duration_minutes / 30;
    return selectedDay.slots.flatMap((status, index) =>
      status === SLOT_STATUS.AVAILABLE &&
      index + duration <= 48 &&
      selectedDay.slots
        .slice(index, index + duration)
        .every((item) => item === SLOT_STATUS.AVAILABLE)
        ? [slotTime(index)]
        : [],
    );
  })();

  async function confirm() {
    if (!serviceId || !collaboratorId || !date || !time) return;
    if (storage.getSession()?.role !== "client") { navigate("/entrar", { state: { returnTo: location.pathname } }); return; }
    setSubmitting(true); setError(null);
    try { await createClientAppointment({ service_id: serviceId, collaborator_id: collaboratorId, appointment_date: date, start_time: time }); navigate("/meus-agendamentos", { state: { booked: true } }); }
    catch { setError("Esse horário não está mais disponível. Escolha outro horário."); }
    finally { setSubmitting(false); }
  }
  if (loading) return <div className="flex justify-center py-24"><Loader2 className="h-6 w-6 animate-spin text-[#0F5C56]" /></div>;
  if (!details) return <div className="mx-auto max-w-3xl px-4 py-16 text-sm text-red-700">{error}</div>;
  const card = "rounded-2xl border border-[#E4E1D8] bg-white p-5";
  return <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6"><Link to="/" className="inline-flex items-center gap-2 text-sm text-[#5C6B68] hover:text-[#12201E]"><ArrowLeft className="h-4 w-4" />Voltar</Link><div className="mt-6"><h1 className="th-display text-3xl font-medium">Agendar em {details.establishment.name}</h1><p className="mt-2 text-sm text-[#5C6B68]">{details.establishment.address}</p></div>
    <div className="mt-8 grid gap-5 lg:grid-cols-[1fr_300px]"><div className="flex flex-col gap-5"><section className={card}><h2 className="flex items-center gap-2 font-medium"><Scissors className="h-4 w-4 text-[#0F5C56]" />1. Escolha o serviço</h2><div className="mt-4 grid gap-2 sm:grid-cols-2">{details.services.map((item) => <button key={item.id} onClick={() => { setServiceId(item.id); setCollaboratorId(null); setDate(""); setTime(""); }} className={`rounded-xl border p-4 text-left ${serviceId === item.id ? "border-[#0F5C56] bg-[#0F5C56]/5" : "border-[#E4E1D8]"}`}><span className="font-medium">{item.name}</span><span className="mt-1 block text-xs text-[#5C6B68]">{formatDuration(item.duration_minutes)} · {formatCurrency(item.price)}</span></button>)}</div></section>
      {serviceId && <section className={card}><h2 className="flex items-center gap-2 font-medium"><UserRound className="h-4 w-4 text-[#0F5C56]" />2. Escolha o profissional</h2><div className="mt-4 grid gap-2 sm:grid-cols-2">{collaborators.map((item) => <button key={item.id} onClick={() => { setCollaboratorId(item.id); setDate(""); setTime(""); }} className={`flex items-center gap-3 rounded-xl border p-3 text-left ${collaboratorId === item.id ? "border-[#0F5C56] bg-[#0F5C56]/5" : "border-[#E4E1D8]"}`}><CollaboratorAvatar name={item.name} photo={item.photo} size="md" /><span className="font-medium">{item.name}</span></button>)}</div></section>}
      {collaborator && <section className={card}><h2 className="font-medium">3. Escolha o dia</h2><div className="mt-4 flex gap-2 overflow-x-auto pb-1">{days.map((day) => <button key={day.key} onClick={() => { setDate(day.day); setTime(""); }} className={`min-w-28 rounded-xl border p-3 text-center ${date === day.day ? "border-[#0F5C56] bg-[#0F5C56]/5" : "border-[#E4E1D8]"}`}><span className="block text-xs text-[#5C6B68]">{WEEKDAY_LABELS[day.key as WeekdayKey].split("-")[0]}</span><span className="mt-1 block text-sm font-medium">{formatDateLabel(day.day)}</span></button>)}</div>{date && <><h3 className="mt-5 text-sm font-medium">Horários disponíveis</h3><div className="mt-3 grid grid-cols-4 gap-2 sm:grid-cols-6">{availableTimes.map((item) => <button key={item} onClick={() => setTime(item)} className={`rounded-lg border px-2 py-2 text-sm ${time === item ? "border-[#0F5C56] bg-[#0F5C56] text-white" : "border-[#E4E1D8]"}`}>{item}</button>)}</div>{availableTimes.length === 0 && <p className="mt-3 text-sm text-[#5C6B68]">Nenhum horário disponível nesse dia.</p>}</>}</section>}</div>
      <aside className={`${card} h-fit lg:sticky lg:top-24`}><h2 className="font-medium">Resumo</h2><dl className="mt-4 space-y-3 text-sm"><div><dt className="text-xs text-[#5C6B68]">Serviço</dt><dd className="mt-0.5">{service?.name ?? "—"}</dd></div><div><dt className="text-xs text-[#5C6B68]">Profissional</dt><dd className="mt-0.5">{collaborator?.name ?? "—"}</dd></div><div><dt className="text-xs text-[#5C6B68]">Data e hora</dt><dd className="mt-0.5">{date && time ? `${formatDateLabel(date)} às ${time}` : "—"}</dd></div>{service && <div className="border-t border-[#E4E1D8] pt-3"><dt className="text-xs text-[#5C6B68]">Total</dt><dd className="mt-0.5 text-lg font-semibold">{formatCurrency(service.price)}</dd></div>}</dl>{error && <p className="mt-4 text-xs text-red-600">{error}</p>}<button onClick={() => void confirm()} disabled={!serviceId || !collaboratorId || !date || !time || submitting} className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-[#0F5C56] py-3 text-sm font-medium text-white disabled:opacity-50">{submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}Confirmar agendamento</button>{storage.getSession()?.role !== "client" && <p className="mt-2 text-center text-xs text-[#5C6B68]">Você entrará na sua conta antes de confirmar.</p>}</aside></div>
  </div>;
}
