import { Link } from "react-router-dom";
import { Sparkles } from "lucide-react";

export function DashboardEmptyState() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center rounded-2xl border border-dashed border-[#E4E1D8] px-6 py-16 text-center">
      <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#0F5C56]/8 text-[#0F5C56]">
        <Sparkles className="h-5 w-5" strokeWidth={1.75} />
      </span>
      <h2 className="mt-4 text-lg font-medium text-[#12201E]">Vamos preparar sua agenda</h2>
      <p className="mt-1.5 max-w-sm text-sm leading-relaxed text-[#5C6B68]">
        Cadastre seus serviços e colaboradores para começar a receber agendamentos.
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <Link
          to="/servicos"
          className="rounded-xl bg-[#0F5C56] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#0B4842]"
        >
          Cadastrar serviços
        </Link>
        <Link
          to="/colaboradores"
          className="rounded-xl border border-[#E4E1D8] px-4 py-2 text-sm font-medium text-[#12201E] transition-colors hover:bg-[#12201E]/5"
        >
          Cadastrar colaboradores
        </Link>
      </div>
    </div>
  );
}
