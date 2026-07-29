import type { LucideIcon } from "lucide-react";

type PagePlaceholderProps = {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
};

export function PagePlaceholder({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
}: PagePlaceholderProps) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center rounded-2xl border border-dashed border-[#E4E1D8] px-6 py-16 text-center">
      <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#0F5C56]/8 text-[#0F5C56]">
        <Icon className="h-5 w-5" strokeWidth={1.75} />
      </span>
      <h2 className="mt-4 text-lg font-medium text-[#12201E]">{title}</h2>
      <p className="mt-1.5 max-w-sm text-sm leading-relaxed text-[#5C6B68]">{description}</p>
      {actionLabel && (
        <button
          type="button"
          onClick={onAction}
          className="mt-6 rounded-xl bg-[#0F5C56] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#0B4842]"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}
