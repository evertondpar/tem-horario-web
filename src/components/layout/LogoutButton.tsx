import { LogOut } from "lucide-react";
import { cn } from "../../lib/utils";

type LogoutButtonProps = {
  onLogout?: () => void;
  className?: string;
};

export function LogoutButton({ onLogout, className }: LogoutButtonProps) {
  const handleClick = () => {
    if (onLogout) {
      onLogout();
      return;
    }
    // Troque pela sua lógica real de logout, por exemplo:
    // await api.post("/auth/logout");
    console.log("logout");
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={cn(
        "flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm font-medium text-[#5C6B68] transition-colors",
        "hover:bg-red-50 hover:text-red-600",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0F5C56]/30",
        className
      )}
    >
      <LogOut className="h-4 w-4 shrink-0" strokeWidth={1.75} />
      Sair
    </button>
  );
}
