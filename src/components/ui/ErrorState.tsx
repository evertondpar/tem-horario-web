import { AlertTriangle } from "lucide-react";

type ErrorStateProps = {
  title: string;
  description?: string;
  onRetry: () => void;
  retryLabel?: string;
};

export function ErrorState({
  title,
  description,
  onRetry,
  retryLabel = "Tentar novamente",
}: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center gap-2 rounded-2xl border border-dashed border-red-200 bg-red-50/40 px-6 py-16 text-center">
      <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-100 text-red-600">
        <AlertTriangle className="h-5 w-5" strokeWidth={1.75} />
      </span>
      <h2 className="mt-2 text-sm font-medium text-[#12201E]">{title}</h2>
      {description && <p className="max-w-sm text-sm text-[#5C6B68]">{description}</p>}
      <button
        type="button"
        onClick={onRetry}
        className="mt-2 rounded-xl bg-[#0F5C56] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#0B4842]"
      >
        {retryLabel}
      </button>
    </div>
  );
}
