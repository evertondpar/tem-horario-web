import { Clock, CheckCircle2, CheckCheck, XCircle, Ban } from "lucide-react";
import { AppointmentStatus } from "../../types/appointment";
import { cn } from "../../lib/utils";

const STATUS_CONFIG: Record<
  AppointmentStatus,
  { label: string; icon: typeof Clock; className: string }
> = {
  [AppointmentStatus.SCHEDULED]: {
    label: "Agendado",
    icon: Clock,
    className: "bg-[#5C6B68]/10 text-[#5C6B68]",
  },
  [AppointmentStatus.CONFIRMED]: {
    label: "Confirmado",
    icon: CheckCircle2,
    className: "bg-[#0F5C56]/10 text-[#0F5C56]",
  },
  [AppointmentStatus.COMPLETED]: {
    label: "Concluído",
    icon: CheckCheck,
    className: "bg-[#12201E]/8 text-[#12201E]",
  },
  [AppointmentStatus.CANCELED]: {
    label: "Cancelado",
    icon: XCircle,
    className: "bg-red-50 text-red-600",
  },
  [AppointmentStatus.REFUSED]: {
    label: "Recusado",
    icon: Ban,
    className: "bg-red-50 text-red-600",
  },
};

type AppointmentStatusBadgeProps = {
  status: AppointmentStatus;
  className?: string;
};

export function AppointmentStatusBadge({ status, className }: AppointmentStatusBadgeProps) {
  const { label, icon: Icon, className: colorClassName } = STATUS_CONFIG[status];

  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium",
        colorClassName,
        className
      )}
    >
      <Icon className="h-3 w-3" strokeWidth={2} />
      {label}
    </span>
  );
}
