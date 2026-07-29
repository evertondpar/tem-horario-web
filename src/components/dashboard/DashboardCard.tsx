import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "../../lib/utils";

type DashboardCardProps = {
  icon: LucideIcon;
  label: string;
  children: ReactNode;
  /** Marca o card como o item de maior destaque da linha (ex: próximo atendimento). */
  accent?: boolean;
};

export function DashboardCard({ icon: Icon, label, children, accent = false }: DashboardCardProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl border border-[#E4E1D8] bg-white p-5",
        accent && "border-[#0F5C56]/25"
      )}
    >
      {accent && (
        <span
          className="absolute inset-y-0 left-0 w-[3px] bg-[#0F5C56]"
          aria-hidden="true"
        />
      )}
      <div className="flex items-center gap-2 text-[#5C6B68]">
        <Icon className="h-4 w-4" strokeWidth={1.75} />
        <span className="text-xs font-medium uppercase tracking-wide">{label}</span>
      </div>
      {children}
    </div>
  );
}
