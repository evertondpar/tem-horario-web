import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Lock,
  Eye,
  EyeOff,
  Loader2,
  CalendarCheck2,
  CheckCircle2,
  AlertCircle,
  Phone,
} from "lucide-react";
import clsx, { type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import "@fontsource-variable/geist";
import "./LoginPage.css";
import { login, loginCollaborator } from "@/api/auth";
import { storage } from "@/utils/storage";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ---------------------------------------------------------------------------
// Validation
// ---------------------------------------------------------------------------

const loginSchema = z.object({
  phone: z.string().min(1, "Informe seu telefone"),
  password: z
    .string()
    .min(1, "Informe sua senha")
    .min(6, "A senha precisa ter pelo menos 6 caracteres"),
});

type LoginFormData = z.infer<typeof loginSchema>;

// ---------------------------------------------------------------------------
// Signature element: a day of appointments with one open slot glowing —
// the literal, visual answer to "tem horário?"
// ---------------------------------------------------------------------------

const AGENDA_PREVIEW = [
  { time: "08:00", label: "Corte — Marina S.", open: false },
  { time: "09:30", label: "Coloração — Bia F.", open: false },
  { time: "11:00", label: "Manicure — Rafa T.", open: false },
  { time: "14:30", label: "Disponível", open: true },
  { time: "16:00", label: "Barba — Léo A.", open: false },
];

function SchedulePreview() {
  return (
    <div className="w-full max-w-xs rounded-2xl border border-white/15 bg-white/[0.06] p-4 backdrop-blur-sm">
      <div className="mb-3 flex items-center justify-between px-1">
        <span className="text-xs font-medium uppercase tracking-wider text-white/50">
          Hoje, quinta
        </span>
        <CalendarCheck2 className="h-4 w-4 text-white/40" strokeWidth={1.75} />
      </div>
      <ul className="flex flex-col gap-1.5">
        {AGENDA_PREVIEW.map((slot) => (
          <li
            key={slot.time}
            className={cn(
              "flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition-colors",
              slot.open
                ? "th-open-slot bg-[#F2A93B]/15 text-[#F2A93B] ring-1 ring-[#F2A93B]/40"
                : "text-white/45",
            )}
          >
            <span className="font-mono text-xs tabular-nums">{slot.time}</span>
            <span
              className={cn(
                "flex-1 truncate",
                slot.open && "font-medium text-white",
              )}
            >
              {slot.label}
            </span>
            {slot.open && (
              <CheckCircle2 className="h-4 w-4 shrink-0" strokeWidth={2} />
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Small form primitives
// ---------------------------------------------------------------------------

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p
      className="mt-1.5 flex items-center gap-1 text-xs text-red-600"
      role="alert"
    >
      <AlertCircle className="h-3.5 w-3.5 shrink-0" strokeWidth={2} />
      {message}
    </p>
  );
}

// ---------------------------------------------------------------------------
// Login page
// ---------------------------------------------------------------------------

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const isCollaborator = pathname === "/login/colaborador";
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { phone: "", password: "" },
  });

  const onSubmit = async (data: LoginFormData) => {
    setServerError(null);
    try {
      if (isCollaborator) {
        const response = await loginCollaborator(data);
        storage.setToken(response.access_token);
        storage.setSession({
          role: "collaborator",
          user: response.collaborator,
          establishment: response.establishment,
        });
        navigate("/colaborador");
      } else {
        const response = await login(data);
        storage.setToken(response.access_token);
        storage.setSession({
          role: "establishment",
          user: response.establishment,
          establishment: response.establishment,
        });
        navigate("/painel");
      }
    } catch (err) {
      console.log("erro ", err);
      setServerError("Telefone ou senha incorretos. ");
    }
  };

  return (
    <div className="flex min-h-screen w-full bg-[#F7F6F2]">
      {/* Brand panel — hidden on small screens, signature moment on large ones */}
      <aside className="relative hidden w-[44%] flex-col justify-between overflow-hidden bg-[#0F5C56] px-12 py-12 text-white lg:flex xl:px-16">
        <div
          className="th-grid-texture pointer-events-none absolute inset-0"
          aria-hidden="true"
        />

        <div className="relative z-10">
          <span className="th-display text-2xl font-semibold lowercase">
            tem horário?
          </span>
        </div>

        <div className="relative z-10 flex flex-col gap-8">
          <div className="max-w-sm">
            <h1 className="th-display text-4xl font-medium leading-[1.15] xl:text-[2.75rem]">
              Sempre existe um horário livre esperando por alguém.
            </h1>
            <p className="mt-4 text-[0.95rem] leading-relaxed text-white/60">
              {isCollaborator
                ? "Consulte seus próximos atendimentos e organize sua disponibilidade em poucos passos."
                : "É isso que seus clientes veem em segundos. Entre para organizar a agenda do seu negócio."}
            </p>
          </div>
          <SchedulePreview />
        </div>

        <p className="relative z-10 text-xs text-white/35">
          © {new Date().getFullYear()} tem horário? — agenda para
          estabelecimentos
        </p>
      </aside>

      {/* Form panel */}
      <main className="flex w-full flex-1 flex-col justify-center px-6 py-12 sm:px-10 lg:w-[56%] lg:px-16 xl:px-24">
        <div className="mx-auto w-full max-w-sm">
          {/* Compact brand mark for mobile / tablet */}
          <div className="mb-10 flex items-center gap-2 lg:hidden">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#0F5C56] text-white">
              <CalendarCheck2 className="h-4.5 w-4.5" strokeWidth={2} />
            </span>
            <span className="th-display text-xl font-semibold lowercase text-[#12201E]">
              tem horário?
            </span>
          </div>

          <h2 className="th-display text-[1.75rem] font-medium text-[#12201E]">
            Entrar
          </h2>
          <p className="mt-1.5 text-sm text-[#5C6B68]">
            {isCollaborator
              ? "Acesse seu painel de colaborador."
              : "Acesse o painel do seu estabelecimento."}
          </p>

          <form
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            className="mt-8 flex flex-col gap-5"
          >
            {serverError && (
              <div
                role="alert"
                className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-3.5 py-3 text-sm text-red-700"
              >
                <AlertCircle
                  className="mt-0.5 h-4 w-4 shrink-0"
                  strokeWidth={2}
                />
                <span>{serverError}</span>
              </div>
            )}

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="mb-1.5 block text-sm font-medium text-[#12201E]"
              >
                Telefone
              </label>
              <div className="relative">
                <Phone
                  className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#5C6B68]"
                  strokeWidth={1.75}
                />
                <input
                  id="phone"
                  type="tel"
                  autoComplete="tel"
                  placeholder="(35) 99999-9999"
                  aria-invalid={!!errors.phone}
                  aria-describedby={errors.phone ? "phone-error" : undefined}
                  className={cn(
                    "w-full rounded-xl border bg-white py-2.5 pl-10 pr-3.5 text-sm text-[#12201E] outline-none transition-colors placeholder:text-[#5C6B68]/50",
                    "focus:border-[#0F5C56] focus:ring-2 focus:ring-[#0F5C56]/15",
                    errors.phone ? "border-red-300" : "border-[#E4E1D8]",
                  )}
                  {...register("phone")}
                />
              </div>
              {errors.phone && <FieldError message={errors.phone.message} />}
              <span id="phone-error" className="sr-only">
                {errors.phone?.message}
              </span>
            </div>

            {/* Password */}
            <div>
              <div className="mb-1.5 flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-[#12201E]"
                >
                  Senha
                </label>
                <Link
                  to="/esqueci-senha"
                  className="text-xs font-medium text-[#0F5C56] hover:text-[#0B4842] hover:underline"
                >
                  Esqueceu a senha?
                </Link>
              </div>
              <div className="relative">
                <Lock
                  className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#5C6B68]"
                  strokeWidth={1.75}
                />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  aria-invalid={!!errors.password}
                  aria-describedby={
                    errors.password ? "password-error" : undefined
                  }
                  className={cn(
                    "w-full rounded-xl border bg-white py-2.5 pl-10 pr-11 text-sm text-[#12201E] outline-none transition-colors placeholder:text-[#5C6B68]/50",
                    "focus:border-[#0F5C56] focus:ring-2 focus:ring-[#0F5C56]/15",
                    errors.password ? "border-red-300" : "border-[#E4E1D8]",
                  )}
                  {...register("password")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#5C6B68] hover:text-[#12201E]"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" strokeWidth={1.75} />
                  ) : (
                    <Eye className="h-4 w-4" strokeWidth={1.75} />
                  )}
                </button>
              </div>
              {errors.password && (
                <FieldError message={errors.password.message} />
              )}
              <span id="password-error" className="sr-only">
                {errors.password?.message}
              </span>
            </div>

            {/* Remember me */}
            {/* <label className="flex select-none items-center gap-2 text-sm text-[#5C6B68]">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-[#E4E1D8] text-[#0F5C56] focus:ring-[#0F5C56]/30"
                {...register("remember")}
              />
              Manter conectado
            </label> */}

            <button
              type="submit"
              disabled={isSubmitting}
              className={cn(
                "mt-1 flex items-center justify-center gap-2 rounded-xl bg-[#0F5C56] py-2.75 text-sm font-medium text-white transition-colors",
                "hover:bg-[#0B4842] focus:outline-none focus:ring-2 focus:ring-[#0F5C56]/30 focus:ring-offset-2",
                "disabled:cursor-not-allowed disabled:opacity-70",
              )}
            >
              {isSubmitting && (
                <Loader2 className="h-4 w-4 animate-spin" strokeWidth={2} />
              )}
              {isSubmitting ? "Entrando..." : "Entrar"}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-[#5C6B68]">
            {isCollaborator
              ? "É responsável pelo estabelecimento? "
              : "Faz parte da equipe? "}
            <Link
              to={isCollaborator ? "/login" : "/login/colaborador"}
              className="font-medium text-[#0F5C56] hover:underline"
            >
              {isCollaborator
                ? "Entrar como estabelecimento"
                : "Entrar como colaborador"}
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
