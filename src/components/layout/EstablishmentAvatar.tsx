import { cn } from "../../lib/utils";

type EstablishmentAvatarProps = {
  name: string;
  subtitle?: string;
  imageUrl?: string;
  size?: "sm" | "md";
  className?: string;
};

function getInitials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function EstablishmentAvatar({
  name,
  subtitle,
  imageUrl,
  size = "md",
  className,
}: EstablishmentAvatarProps) {
  const dimension = size === "sm" ? "h-8 w-8 text-xs" : "h-10 w-10 text-sm";

  return (
    <div className={cn("flex min-w-0 items-center gap-2.5", className)}>
      {imageUrl ? (
        <img
          src={imageUrl}
          alt={name}
          className={cn("shrink-0 rounded-full object-cover", dimension)}
        />
      ) : (
        <span
          className={cn(
            "flex shrink-0 items-center justify-center rounded-full bg-[#0F5C56] font-medium text-white",
            dimension
          )}
          aria-hidden="true"
        >
          {getInitials(name)}
        </span>
      )}
      <span className="min-w-0 text-left">
        <span className="block truncate text-sm font-medium text-[#12201E]">{name}</span>
        {subtitle && (
          <span className="block truncate text-xs text-[#5C6B68]">{subtitle}</span>
        )}
      </span>
    </div>
  );
}
