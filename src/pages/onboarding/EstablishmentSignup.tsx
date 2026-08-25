import { AlertCircle, ArrowLeft, CalendarCheck2, Loader2, Lock, Phone, Store } from "lucide-react";
import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../../api/auth";
import { registerEstablishment } from "../../api/onboarding";
import { storage } from "../../utils/storage";

export default function EstablishmentSignup() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", phone: "", password: "", confirmation: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(event: FormEvent) {
    event.preventDefault(); setError(null);
    if (!form.name.trim() || !form.phone.trim()) return setError("Preencha nome e telefone.");
    if (form.password.length < 6) return setError("A senha precisa ter pelo menos 6 caracteres.");
    if (form.password !== form.confirmation) return setError("As senhas não coincidem.");
    setLoading(true);
    try {
      await registerEstablishment({ name: form.name, phone: form.phone, password: form.password });
      const response = await login({ phone: form.phone, password: form.password });
      storage.setToken(response.access_token);
      storage.setSession({ role: "establishment", user: response.establishment, establishment: response.establishment });
      navigate("/onboarding");
    } catch { setError("Não foi possível criar a conta. O telefone pode já estar cadastrado."); }
    finally { setLoading(false); }
  }

  const field = "w-full rounded-xl border border-[#E4E1D8] bg-white py-2.5 pl-10 pr-3.5 text-sm outline-none focus:border-[#0F5C56] focus:ring-2 focus:ring-[#0F5C56]/15";
  return <div className="flex min-h-screen bg-[#F7F6F2]"><aside className="relative hidden w-[44%] overflow-hidden bg-[#0F5C56] p-12 text-white lg:flex lg:flex-col lg:justify-between"><div className="th-grid-texture absolute inset-0" /><span className="relative z-10 th-display text-2xl font-semibold lowercase">tem horário?</span><div className="relative z-10 max-w-md"><Store className="mb-6 h-10 w-10 text-[#F2A93B]" /><h1 className="th-display text-4xl leading-tight">Sua agenda organizada começa aqui.</h1><p className="mt-4 leading-relaxed text-white/60">Crie sua conta e configure seu estabelecimento para receber o primeiro agendamento.</p></div><p className="relative z-10 text-xs text-white/35">Comece em poucos minutos.</p></aside><main className="flex flex-1 items-center justify-center px-6 py-12"><div className="w-full max-w-sm"><Link to="/login" className="mb-8 inline-flex items-center gap-2 text-sm text-[#5C6B68]"><ArrowLeft className="h-4 w-4" />Voltar ao login</Link><div className="mb-8 flex items-center gap-2 lg:hidden"><span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#0F5C56] text-white"><CalendarCheck2 className="h-4 w-4" /></span><span className="th-display text-xl font-semibold">tem horário?</span></div><h2 className="th-display text-3xl font-medium text-[#12201E]">Cadastre seu estabelecimento</h2><p className="mt-2 text-sm text-[#5C6B68]">Depois, vamos configurar seu primeiro serviço e colaborador.</p><form onSubmit={submit} className="mt-7 flex flex-col gap-4">{error && <div className="flex gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700"><AlertCircle className="h-4 w-4 shrink-0" />{error}</div>}<label className="text-sm font-medium">Nome do estabelecimento<div className="relative mt-1.5"><Store className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#5C6B68]" /><input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={field} placeholder="Barbearia Central" /></div></label><label className="text-sm font-medium">Telefone<div className="relative mt-1.5"><Phone className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#5C6B68]" /><input required type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className={field} placeholder="(11) 99999-9999" /></div></label>{["password", "confirmation"].map((key) => <label key={key} className="text-sm font-medium">{key === "password" ? "Senha" : "Confirme a senha"}<div className="relative mt-1.5"><Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#5C6B68]" /><input required type="password" value={form[key as "password" | "confirmation"]} onChange={(e) => setForm({ ...form, [key]: e.target.value })} className={field} placeholder="Mínimo de 6 caracteres" /></div></label>)}<button disabled={loading} className="mt-2 flex items-center justify-center gap-2 rounded-xl bg-[#0F5C56] py-3 text-sm font-medium text-white disabled:opacity-60">{loading && <Loader2 className="h-4 w-4 animate-spin" />}Criar conta e continuar</button></form><p className="mt-7 text-center text-sm text-[#5C6B68]">Já tem uma conta? <Link to="/login" className="font-medium text-[#0F5C56] hover:underline">Entrar</Link></p></div></main></div>;
}
