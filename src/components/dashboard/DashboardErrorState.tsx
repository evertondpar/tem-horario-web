import { AlertTriangle } from "lucide-react";

type DashboardErrorStateProps = {
  onRetry: () => void;
};

export function DashboardErrorState({ onRetry }: DashboardErrorStateProps) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center rounded-2xl border border-dashed border-red-200 bg-red-50/40 px-6 py-16 text-center">
      <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-100 text-red-600">
        <AlertTriangle className="h-5 w-5" strokeWidth={1.75} />
      </span>
      <h2 className="mt-4 text-lg font-medium text-[#12201E]">Não foi possível carregar o painel</h2>
      <p className="mt-1.5 max-w-sm text-sm leading-relaxed text-[#5C6B68]">
        Verifique sua conexão e tente novamente.
      </p>
      <button
        type="button"
        onClick={onRetry}
        className="mt-6 rounded-xl bg-[#0F5C56] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#0B4842]"
      >
        Tentar novamente
      </button>
    </div>
  );
}
