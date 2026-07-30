import { Clock, CheckCircle2, CheckCheck, XCircle, Ban } from "lucide-react";
import { AppointmentStatus, APPOINTMENT_STATUS_LABELS } from "../../types/appointment";
import { cn } from "../../lib/utils";

const STATUS_CONFIG: Record<AppointmentStatus, { icon: typeof Clock; className: string }> = {
  [AppointmentStatus.SCHEDULED]: {
    icon: Clock,
    className: "bg-[#5C6B68]/10 text-[#5C6B68]",
  },
  [AppointmentStatus.CONFIRMED]: {
    icon: CheckCircle2,
    className: "bg-[#0F5C56]/10 text-[#0F5C56]",
  },
  [AppointmentStatus.COMPLETED]: {
    icon: CheckCheck,
    className: "bg-[#12201E]/8 text-[#12201E]",
  },
  [AppointmentStatus.CANCELED]: {
    icon: XCircle,
    className: "bg-red-50 text-red-600",
  },
  [AppointmentStatus.REFUSED]: {
    icon: Ban,
    className: "bg-red-50 text-red-600",
  },
};

type AppointmentStatusBadgeProps = {
  status: AppointmentStatus;
  className?: string;
};

export function AppointmentStatusBadge({ status, className }: AppointmentStatusBadgeProps) {
  const { icon: Icon, className: colorClassName } = STATUS_CONFIG[status];

  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium",
        colorClassName,
        className
      )}
    >
      <Icon className="h-3 w-3" strokeWidth={2} />
      {APPOINTMENT_STATUS_LABELS[status]}
    </span>
  );
}
