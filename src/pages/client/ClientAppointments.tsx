import { CalendarCheck2, CalendarPlus, CalendarX, Loader2, MapPin, RotateCcw, Star, XCircle } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { cancelClientAppointment, getClientAppointments, saveEstablishmentReview } from "../../api/client";
import { AppointmentStatus, type Appointment } from "../../types/appointment";
import { AppointmentStatusBadge } from "../../components/appointments/AppointmentStatusBadge";
import { formatDateLabel, formatTime } from "../../lib/date";
import { APPOINTMENTS_UPDATED_EVENT } from "../../lib/notification-events";

function calendarUrl(item: Appointment) {
  const date = item.appointment_date.replace(/-/g, "");
  const start = item.start_time.replace(/:/g, "").slice(0, 4) + "00";
  const end = (item.end_time ?? item.start_time).replace(/:/g, "").slice(0, 4) + "00";
  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(item.service?.name ?? "Agendamento")}&dates=${date}T${start}/${date}T${end}&details=${encodeURIComponent(`Atendimento com ${item.collaborator?.name ?? "profissional"}`)}&location=${encodeURIComponent(item.establishment?.address ?? "")}`;
}

export default function ClientAppointments() {
  const booked = !!useLocation().state?.booked;
  const [items, setItems] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [canceling, setCanceling] = useState<number | null>(null);
  const [reviewing, setReviewing] = useState<number | null>(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    let active = true;
    const refresh = () => void getClientAppointments().then((appointments) => { if (active) setItems(appointments); }).catch(() => { if (active) setError("Não foi possível carregar seus agendamentos."); }).finally(() => { if (active) setLoading(false); });
    const refreshWhenVisible = () => { if (document.visibilityState === "visible") refresh(); };
    refresh(); window.addEventListener(APPOINTMENTS_UPDATED_EVENT, refresh); document.addEventListener("visibilitychange", refreshWhenVisible);
    return () => { active = false; window.removeEventListener(APPOINTMENTS_UPDATED_EVENT, refresh); document.removeEventListener("visibilitychange", refreshWhenVisible); };
  }, []);
  const [upcoming, history] = useMemo(() => { const now = new Date(); return items.reduce<[Appointment[], Appointment[]]>((groups, item) => { const future = new Date(`${item.appointment_date}T${item.start_time}`) >= now && ![AppointmentStatus.CANCELED, AppointmentStatus.COMPLETED, AppointmentStatus.REFUSED].includes(item.status); groups[future ? 0 : 1].push(item); return groups; }, [[], []]); }, [items]);
  async function cancel(id: number) { setCanceling(id); setError(null); try { const updated = await cancelClientAppointment(id, AppointmentStatus.CANCELED); setItems((current) => current.map((item) => item.id === id ? { ...item, ...updated } : item)); } catch { setError("Não foi possível cancelar este agendamento."); } finally { setCanceling(null); } }
  async function review(item: Appointment) { const establishmentId = item.establishment_id ?? item.establishment?.id; if (!establishmentId) return setError("Estabelecimento não identificado."); try { await saveEstablishmentReview(establishmentId, { rating, comment }); setReviewing(null); setComment(""); setMessage("Avaliação enviada. Obrigado!"); } catch { setError("Não foi possível enviar a avaliação."); } }
  return <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6"><h1 className="th-display text-3xl font-medium">Meus horários</h1><p className="mt-2 text-sm text-[#5C6B68]">Acompanhe, cancele ou agende novamente.</p>{booked && <div className="mt-6 flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800"><CalendarCheck2 className="h-5 w-5" />Agendamento enviado e aguardando confirmação.</div>}{message && <div className="mt-5 rounded-xl bg-[#0F5C56]/8 p-3 text-sm text-[#0F5C56]">{message}</div>}{error && <div className="mt-5 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>}
    {loading ? <div className="flex justify-center py-20"><Loader2 className="h-6 w-6 animate-spin text-[#0F5C56]" /></div> : items.length === 0 ? <div className="mt-8 flex flex-col items-center gap-2 rounded-2xl border border-dashed border-[#E4E1D8] py-20"><CalendarX className="h-6 w-6 text-[#5C6B68]" /><p className="text-sm text-[#5C6B68]">Você ainda não possui agendamentos.</p><Link to="/" className="mt-3 rounded-xl bg-[#0F5C56] px-4 py-2 text-sm text-white">Encontrar estabelecimento</Link></div> : <><AppointmentSection title="Próximos" items={upcoming} canceling={canceling} onCancel={cancel} reviewing={reviewing} setReviewing={setReviewing} rating={rating} setRating={setRating} comment={comment} setComment={setComment} onReview={review} /><AppointmentSection title="Histórico" items={history} canceling={canceling} onCancel={cancel} reviewing={reviewing} setReviewing={setReviewing} rating={rating} setRating={setRating} comment={comment} setComment={setComment} onReview={review} /></>}
  </div>;
}

type SectionProps = { title: string; items: Appointment[]; canceling: number | null; onCancel: (id: number) => Promise<void>; reviewing: number | null; setReviewing: (id: number | null) => void; rating: number; setRating: (value: number) => void; comment: string; setComment: (value: string) => void; onReview: (item: Appointment) => Promise<void> };
function AppointmentSection({ title, items, canceling, onCancel, reviewing, setReviewing, rating, setRating, comment, setComment, onReview }: SectionProps) {
  if (!items.length) return null;
  return <section className="mt-9"><h2 className="text-lg font-semibold">{title}</h2><div className="mt-3 grid gap-4">{items.map((item) => <article key={item.id} className="rounded-2xl border border-[#E4E1D8] bg-white p-5"><div className="flex flex-col gap-4 sm:flex-row sm:justify-between"><div className="min-w-0"><div className="flex flex-wrap items-center gap-2"><h3 className="font-semibold">{item.service?.name}</h3><AppointmentStatusBadge status={item.status} /></div><p className="mt-2 text-sm text-[#5C6B68]">{item.establishment?.name ?? "Estabelecimento"} · {item.collaborator?.name}</p><p className="mt-1 text-sm text-[#5C6B68]">{formatDateLabel(item.appointment_date)} às {formatTime(item.start_time)}</p></div><div className="flex flex-wrap gap-2 sm:justify-end"><Link to={`/estabelecimentos/${item.establishment_id}/agendar`} className="flex items-center gap-1.5 rounded-xl border border-[#E4E1D8] px-3 py-2 text-xs"><RotateCcw className="h-3.5 w-3.5" />Agendar novamente</Link>{![AppointmentStatus.CANCELED, AppointmentStatus.COMPLETED, AppointmentStatus.REFUSED].includes(item.status) && <><a href={calendarUrl(item)} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 rounded-xl border border-[#E4E1D8] px-3 py-2 text-xs"><CalendarPlus className="h-3.5 w-3.5" />Calendário</a><button disabled={canceling === item.id} onClick={() => void onCancel(item.id)} className="flex items-center gap-1.5 rounded-xl border border-red-200 px-3 py-2 text-xs text-red-600"><XCircle className="h-3.5 w-3.5" />Cancelar</button></>}{item.status === AppointmentStatus.COMPLETED && <button onClick={() => setReviewing(reviewing === item.id ? null : item.id)} className="flex items-center gap-1.5 rounded-xl border border-[#E4E1D8] px-3 py-2 text-xs"><Star className="h-3.5 w-3.5" />Avaliar</button>}</div></div>{item.establishment?.address && <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(item.establishment.address)}`} target="_blank" rel="noreferrer" className="mt-4 flex items-center gap-2 border-t border-[#E4E1D8] pt-4 text-xs text-[#5C6B68]"><MapPin className="h-3.5 w-3.5" />{item.establishment.address}</a>}{reviewing === item.id && <div className="mt-4 grid gap-3 border-t border-[#E4E1D8] pt-4"><div className="flex gap-1">{[1,2,3,4,5].map((value) => <button key={value} onClick={() => setRating(value)}><Star className={`h-6 w-6 ${value <= rating ? "fill-[#F2A93B] text-[#F2A93B]" : "text-[#E4E1D8]"}`} /></button>)}</div><textarea value={comment} onChange={(e) => setComment(e.target.value)} maxLength={500} rows={3} className="rounded-xl border border-[#E4E1D8] p-3 text-sm" placeholder="Conte como foi sua experiência (opcional)" /><button onClick={() => void onReview(item)} className="w-fit rounded-xl bg-[#0F5C56] px-4 py-2 text-sm text-white">Enviar avaliação</button></div>}</article>)}</div></section>;
}
