import { Circle } from "lucide-react";
import type { CollaboratorStatus } from "../../types/collaborator";
import { cn } from "../../lib/utils";

const STATUS_CONFIG: Record<CollaboratorStatus, { label: string; className: string }> = {
  active: { label: "Ativo", className: "bg-[#0F5C56]/10 text-[#0F5C56]" },
  inactive: { label: "Inativo", className: "bg-[#5C6B68]/10 text-[#5C6B68]" },
};

type CollaboratorStatusBadgeProps = {
  status: CollaboratorStatus;
  className?: string;
};

export function CollaboratorStatusBadge({ status, className }: CollaboratorStatusBadgeProps) {
  const { label, className: colorClassName } = STATUS_CONFIG[status];

  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium",
        colorClassName,
        className
      )}
    >
      <Circle className="h-2 w-2 fill-current" strokeWidth={0} />
      {label}
    </span>
  );
}
