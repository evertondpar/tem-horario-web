import { CalendarCheck2, CalendarDays, LogOut, Menu, Search, UserRound, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { getClientProfile } from "../../api/client";
import { getInitials, cn } from "../../lib/utils";
import { storage } from "../../utils/storage";

export default function ClientLayout() {
  const [open, setOpen] = useState(false);
  const [session, setSession] = useState(storage.getSession());
  const navigate = useNavigate();
  const isClient = session?.role === "client";
  const links = [{ label: "Explorar", path: "/", icon: Search }, ...(isClient ? [{ label: "Meus horários", path: "/meus-agendamentos", icon: CalendarDays }, { label: "Perfil", path: "/perfil", icon: UserRound }] : [])];

  useEffect(() => {
    const refresh = () => setSession(storage.getSession());
    window.addEventListener("tem-horario-session-updated", refresh);
    if (storage.getSession()?.role === "client") void getClientProfile().then((client) => {
      const current = storage.getSession();
      if (current?.role === "client") storage.setSession({ ...current, user: { ...current.user, ...client } });
    });
    return () => window.removeEventListener("tem-horario-session-updated", refresh);
  }, []);

  function logout() { storage.clear(); navigate("/"); }

  return <div className="min-h-screen bg-[#F7F6F2] text-[#12201E]">
    <header className="sticky top-0 z-40 border-b border-[#E4E1D8] bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2.5"><span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#0F5C56] text-white"><CalendarCheck2 className="h-4 w-4" /></span><span className="th-display text-lg font-semibold lowercase">tem horário?</span></Link>
        <nav className="hidden items-center gap-1 md:flex">{links.map(({ label, path, icon: Icon }) => <NavLink key={path} to={path} end={path === "/"} className={({ isActive }) => cn("flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium", isActive ? "bg-[#0F5C56]/8 text-[#0F5C56]" : "text-[#5C6B68] hover:bg-[#12201E]/5")}><Icon className="h-4 w-4" />{label}</NavLink>)}</nav>
        <div className="hidden items-center gap-2 md:flex">{isClient ? <><Link to="/perfil" className="flex items-center gap-2 rounded-lg p-1.5 pr-3 hover:bg-[#12201E]/5">{session.user.photo ? <img src={session.user.photo} alt={session.user.name} className="h-8 w-8 rounded-full object-cover" /> : <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#0F5C56] text-xs font-medium text-white">{getInitials(session.user.name)}</span>}<span className="text-sm text-[#5C6B68]">Olá, {session.user.name.split(" ")[0]}</span></Link><button onClick={logout} className="rounded-lg p-2 text-[#5C6B68] hover:bg-[#12201E]/5" aria-label="Sair"><LogOut className="h-4 w-4" /></button></> : <><Link to="/entrar" className="px-3 py-2 text-sm font-medium text-[#0F5C56]">Entrar</Link><Link to="/cadastro" className="rounded-xl bg-[#0F5C56] px-4 py-2 text-sm font-medium text-white">Criar conta</Link></>}</div>
        <button className="rounded-lg p-2 md:hidden" onClick={() => setOpen((value) => !value)}>{open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}</button>
      </div>
      {open && <div className="border-t border-[#E4E1D8] bg-white p-4 md:hidden">{isClient && <Link to="/perfil" onClick={() => setOpen(false)} className="mb-2 flex items-center gap-3 rounded-lg bg-[#F7F6F2] p-3">{session.user.photo ? <img src={session.user.photo} alt={session.user.name} className="h-9 w-9 rounded-full object-cover" /> : <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#0F5C56] text-xs text-white">{getInitials(session.user.name)}</span>}<span className="text-sm font-medium">{session.user.name}</span></Link>}{links.map(({ label, path }) => <Link key={path} to={path} onClick={() => setOpen(false)} className="block rounded-lg px-3 py-2 text-sm font-medium text-[#5C6B68]">{label}</Link>)}{isClient ? <button onClick={logout} className="mt-2 w-full rounded-xl border border-[#E4E1D8] px-4 py-2 text-sm">Sair</button> : <div className="mt-2 grid grid-cols-2 gap-2"><Link to="/entrar" className="rounded-xl border border-[#E4E1D8] px-4 py-2 text-center text-sm">Entrar</Link><Link to="/cadastro" className="rounded-xl bg-[#0F5C56] px-4 py-2 text-center text-sm text-white">Criar conta</Link></div>}</div>}
    </header><main><Outlet /></main>
  </div>;
}
