import type { LucideIcon } from "lucide-react";
import { DashboardCard } from "./DashboardCard";

type StatCardProps = {
  icon: LucideIcon;
  label: string;
  value: string | number;
  hint?: string;
};

export function StatCard({ icon, label, value, hint }: StatCardProps) {
  return (
    <DashboardCard icon={icon} label={label}>
      <p className="mt-3 text-3xl font-semibold text-[#12201E]">{value}</p>
      {hint && <p className="mt-1 text-xs text-[#5C6B68]">{hint}</p>}
    </DashboardCard>
  );
}
