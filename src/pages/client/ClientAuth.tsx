import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, CalendarCheck2, Loader2, Lock, Phone, User } from "lucide-react";
import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { z } from "zod";
import { loginClient, registerClient } from "../../api/client";
import { storage } from "../../utils/storage";
import { useState } from "react";

const schema = z.object({
  name: z.string().optional(),
  phone: z.string().min(10, "Informe um telefone válido"),
  password: z.string().min(6, "A senha precisa ter pelo menos 6 caracteres"),
});
type FormData = z.infer<typeof schema>;

export default function ClientAuth() {
  const isRegister = useLocation().pathname === "/cadastro";
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({ resolver: zodResolver(schema), defaultValues: { name: "", phone: "", password: "" } });

  async function submit(values: FormData) {
    setError(null);
    try {
      if (isRegister) {
        if (!values.name?.trim()) { setError("Informe seu nome."); return; }
        await registerClient({ name: values.name, phone: values.phone, password: values.password });
      }
      const response = await loginClient({ phone: values.phone, password: values.password });
      storage.setToken(response.access_token);
      storage.setSession({ role: "client", user: response.client });
      navigate("/");
    } catch { setError(isRegister ? "Não foi possível criar sua conta. Confira os dados." : "Telefone ou senha incorretos."); }
  }

  const inputClass = "w-full rounded-xl border border-[#E4E1D8] bg-white py-2.5 pl-10 pr-3.5 text-sm outline-none focus:border-[#0F5C56] focus:ring-2 focus:ring-[#0F5C56]/15";
  return <div className="flex min-h-screen bg-[#F7F6F2]">
    <aside className="relative hidden w-[44%] overflow-hidden bg-[#0F5C56] p-12 text-white lg:flex lg:flex-col lg:justify-between"><div className="th-grid-texture absolute inset-0" /><Link to="/" className="relative z-10 th-display text-2xl font-semibold lowercase">tem horário?</Link><div className="relative z-10 max-w-md"><CalendarCheck2 className="mb-6 h-9 w-9 text-[#F2A93B]" /><h1 className="th-display text-4xl leading-tight">Seu próximo horário está a poucos cliques.</h1><p className="mt-4 text-white/60">Encontre estabelecimentos, escolha o profissional e agende sem precisar ligar.</p></div><p className="relative z-10 text-xs text-white/35">Agenda simples, do seu jeito.</p></aside>
    <main className="flex flex-1 items-center justify-center px-6 py-12"><div className="w-full max-w-sm"><Link to="/" className="mb-10 flex items-center gap-2 lg:hidden"><span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#0F5C56] text-white"><CalendarCheck2 className="h-4 w-4" /></span><span className="th-display text-xl font-semibold">tem horário?</span></Link><h2 className="th-display text-3xl font-medium">{isRegister ? "Crie sua conta" : "Que bom ter você de volta"}</h2><p className="mt-2 text-sm text-[#5C6B68]">{isRegister ? "Cadastre-se para confirmar seus agendamentos." : "Entre para agendar e acompanhar seus horários."}</p>
      <form onSubmit={handleSubmit(submit)} className="mt-8 flex flex-col gap-4">{error && <div className="flex gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700"><AlertCircle className="h-4 w-4 shrink-0" />{error}</div>}{isRegister && <label className="text-sm font-medium">Nome<div className="relative mt-1.5"><User className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#5C6B68]" /><input {...register("name")} className={inputClass} placeholder="Seu nome" /></div></label>}<label className="text-sm font-medium">Telefone<div className="relative mt-1.5"><Phone className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#5C6B68]" /><input {...register("phone")} type="tel" className={inputClass} placeholder="(11) 99999-9999" /></div><span className="mt-1 block text-xs text-red-600">{errors.phone?.message}</span></label><label className="text-sm font-medium">Senha<div className="relative mt-1.5"><Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#5C6B68]" /><input {...register("password")} type="password" className={inputClass} placeholder="Mínimo de 6 caracteres" /></div><span className="mt-1 block text-xs text-red-600">{errors.password?.message}</span></label><button disabled={isSubmitting} className="mt-2 flex items-center justify-center gap-2 rounded-xl bg-[#0F5C56] py-3 text-sm font-medium text-white disabled:opacity-60">{isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}{isRegister ? "Criar conta" : "Entrar"}</button></form>
      <p className="mt-7 text-center text-sm text-[#5C6B68]">{isRegister ? "Já tem uma conta? " : "Ainda não tem uma conta? "}<Link className="font-medium text-[#0F5C56] hover:underline" to={isRegister ? "/entrar" : "/cadastro"}>{isRegister ? "Entrar" : "Cadastre-se"}</Link></p><p className="mt-3 text-center text-xs text-[#5C6B68]"><Link to="/login" className="hover:underline">Acesso do estabelecimento</Link></p>
    </div></main>
  </div>;
}
