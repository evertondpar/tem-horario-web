import { cn, getInitials } from "../../lib/utils";

type CollaboratorAvatarProps = {
  name: string;
  photo?: string | null;
  size?: "md" | "lg";
  className?: string;
};

export function CollaboratorAvatar({
  name,
  photo,
  size = "lg",
  className,
}: CollaboratorAvatarProps) {
  const dimension = size === "lg" ? "h-14 w-14 text-base" : "h-10 w-10 text-sm";

  if (photo) {
    return (
      <img
        src={photo}
        alt={name}
        className={cn("shrink-0 rounded-full border border-[#E4E1D8] object-cover", dimension, className)}
      />
    );
  }

  return (
    <span
      className={cn(
        "flex shrink-0 items-center justify-center rounded-full bg-[#0F5C56] font-medium text-white",
        dimension,
        className
      )}
      aria-hidden="true"
    >
      {getInitials(name)}
    </span>
  );
}
