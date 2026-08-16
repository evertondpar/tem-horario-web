import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Store,
  Phone,
  MapPin,
  Clock,
  Camera,
  Loader2,
  Check,
  AlertCircle,
} from "lucide-react";
import { cn, getInitials } from "../lib/utils";
import { getApiErrorMessage } from "../lib/api-error";
import { ErrorState } from "../components/ui/ErrorState";
import { MOCK_ESTABLISHMENT } from "../data/mock-establishment";
import { getProfile } from "@/api/establishment/profile/getProfile";
import { updateProfile } from "@/api/establishment/profile/updateProfile";

const MAX_PHOTO_SIZE_MB = 3;
const TIME_REGEX = /^([01]\d|2[0-3]):([0-5]\d)$/;

const establishmentSchema = z
  .object({
    name: z
      .string()
      .min(1, "Informe o nome do estabelecimento")
      .max(80, "Use no máximo 80 caracteres"),
    phone: z
      .string()
      .min(1, "Informe o telefone")
      .refine(
        (v) => v.replace(/\D/g, "").length >= 10,
        "Informe um telefone válido",
      ),
    address: z
      .string()
      .min(1, "Informe o endereço")
      .max(160, "Use no máximo 160 caracteres"),
    open_hour: z
      .string()
      .min(1, "Informe o horário de abertura")
      .regex(TIME_REGEX, "Horário inválido"),
    close_hour: z
      .string()
      .min(1, "Informe o horário de fechamento")
      .regex(TIME_REGEX, "Horário inválido"),
  })
  .refine((data) => data.close_hour > data.open_hour, {
    message: "O fechamento deve ser depois da abertura",
    path: ["close_hour"],
  });

export type EstablishmentFormData = z.infer<typeof establishmentSchema>;

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

export default function Configuracoes() {
  // TODO: trocar pelos dados reais (GET /establishments/me na carga da página,
  // PATCH /establishments/:id ao salvar)
  const [photo, setPhoto] = useState<string | null>(
    MOCK_ESTABLISHMENT.photo ?? null,
  );
  const [photoError, setPhotoError] = useState<string | null>(null);
  const [savedAt, setSavedAt] = useState<string | null>(null);
  const [isLoading, setLoading] = useState(true);
  const [hasLoadedOnce, setHasLoadedOnce] = useState(false);
  const [loadError, setLoadError] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, dirtyFields },
  } = useForm<EstablishmentFormData>({
    resolver: zodResolver(establishmentSchema),
  });

  function handlePhotoChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setPhotoError("Selecione um arquivo de imagem.");
      return;
    }
    if (file.size > MAX_PHOTO_SIZE_MB * 1024 * 1024) {
      setPhotoError(`A imagem deve ter até ${MAX_PHOTO_SIZE_MB}MB.`);
      return;
    }

    setPhotoError(null);
    const reader = new FileReader();
    reader.onload = () => setPhoto(reader.result as string);
    reader.readAsDataURL(file);
  }

  async function onSubmit(data: EstablishmentFormData) {
    setSubmitError(null);
    try {
      const payload = {
        name: data.name,
        phone: data.phone,
        address: data.address,
        ...(dirtyFields.open_hour && { open_hour: data.open_hour }),
        ...(dirtyFields.close_hour && { close_hour: data.close_hour }),
      };
      const response = await updateProfile(payload);
      console.log("res ", response);
      setSavedAt(
        new Date().toLocaleTimeString("pt-BR", {
          hour: "2-digit",
          minute: "2-digit",
        }),
      );
      handleGetProfile();
    } catch (err) {
      console.error("Erro ao atualizar serviço", JSON.stringify(err));
      setSubmitError(getApiErrorMessage(err));
      handleGetProfile();
      // Ex: "Existem agendamentos fora do novo horário de funcionamento."
    }
  }

  const handleGetProfile = async () => {
    setLoading(true);
    setLoadError(false);
    try {
      const response = await getProfile();
      reset({
        name: response.name,
        phone: response.phone,
        address: response.address,
        open_hour: response.open_hour,
        close_hour: response.close_hour,
      });
      setPhoto(response.photo ?? null);
      console.log("res ", response);
    } catch (err) {
      console.error("Erro ao carregar os serviços", err);
      setLoadError(true);
    } finally {
      setLoading(false);
      setHasLoadedOnce(true);
    }
  };

  useEffect(() => {
    handleGetProfile();
  }, []);

  return (
    <div className="max-w-2xl">
      <div className="rounded-2xl border border-[#E4E1D8] bg-white p-6">
        <h2 className="text-base font-medium text-[#12201E]">
          Dados da barbearia
        </h2>
        <p className="mt-1 text-sm text-[#5C6B68]">
          Essas informações aparecem para os seus clientes na hora de agendar.
        </p>

        {!hasLoadedOnce && isLoading ? (
          <div
            className="flex items-center justify-center gap-2 py-16"
            role="status"
          >
            <Loader2
              className="h-5 w-5 animate-spin text-[#0F5C56]"
              strokeWidth={2}
            />
            <span className="text-sm text-[#5C6B68]">
              Carregando dados do estabelecimento…
            </span>
          </div>
        ) : loadError ? (
          <div className="mt-6">
            <ErrorState
              title="Não foi possível carregar os dados do estabelecimento"
              description="Verifique sua conexão e tente novamente."
              onRetry={handleGetProfile}
            />
          </div>
        ) : (
          <form
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            className="mt-6 flex flex-col gap-5"
          >
            {/* Erro ao salvar (ex: BadRequestException do backend) */}
            {submitError && (
              <div
                role="alert"
                className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-3.5 py-3 text-sm text-red-700"
              >
                <AlertCircle
                  className="mt-0.5 h-4 w-4 shrink-0"
                  strokeWidth={2}
                />
                <span>{submitError}</span>
              </div>
            )}

            {/* Foto */}
            <div className="flex items-center gap-4">
              {photo ? (
                <img
                  src={photo}
                  alt="Foto do estabelecimento"
                  className="h-16 w-16 shrink-0 rounded-full border border-[#E4E1D8] object-cover"
                />
              ) : (
                <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-[#0F5C56] text-lg font-medium text-white">
                  {getInitials(MOCK_ESTABLISHMENT.name)}
                </span>
              )}
              <div className="flex flex-col gap-1">
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-1.5 rounded-lg border border-[#E4E1D8] px-3 py-1.5 text-xs font-medium text-[#12201E] hover:bg-[#12201E]/5"
                  >
                    <Camera className="h-3.5 w-3.5" strokeWidth={1.75} />
                    {photo ? "Trocar foto" : "Adicionar foto"}
                  </button>
                  {photo && (
                    <button
                      type="button"
                      onClick={() => setPhoto(null)}
                      className="rounded-lg px-3 py-1.5 text-xs font-medium text-[#5C6B68] hover:bg-red-50 hover:text-red-600"
                    >
                      Remover
                    </button>
                  )}
                </div>
                <span className="text-[0.7rem] text-[#5C6B68]">
                  JPG ou PNG, até {MAX_PHOTO_SIZE_MB}MB
                </span>
                {photoError && <FieldError message={photoError} />}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                className="hidden"
              />
            </div>

            {/* Nome */}
            <div>
              <label
                htmlFor="name"
                className="mb-1.5 block text-sm font-medium text-[#12201E]"
              >
                Nome
              </label>
              <div className="relative">
                <Store
                  className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#5C6B68]"
                  strokeWidth={1.75}
                />
                <input
                  id="name"
                  type="text"
                  placeholder="Studio Nova Era"
                  aria-invalid={!!errors.name}
                  className={cn(
                    "w-full rounded-xl border bg-white py-2.5 pl-10 pr-3.5 text-sm text-[#12201E] outline-none transition-colors placeholder:text-[#5C6B68]/50",
                    "focus:border-[#0F5C56] focus:ring-2 focus:ring-[#0F5C56]/15",
                    errors.name ? "border-red-300" : "border-[#E4E1D8]",
                  )}
                  {...register("name")}
                />
              </div>
              <FieldError message={errors.name?.message} />
            </div>

            {/* Telefone */}
            <div>
              <label
                htmlFor="phone"
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
                  placeholder="(11) 4002-8922"
                  aria-invalid={!!errors.phone}
                  className={cn(
                    "w-full rounded-xl border bg-white py-2.5 pl-10 pr-3.5 text-sm text-[#12201E] outline-none transition-colors placeholder:text-[#5C6B68]/50",
                    "focus:border-[#0F5C56] focus:ring-2 focus:ring-[#0F5C56]/15",
                    errors.phone ? "border-red-300" : "border-[#E4E1D8]",
                  )}
                  {...register("phone")}
                />
              </div>
              <FieldError message={errors.phone?.message} />
            </div>

            {/* Endereço */}
            <div>
              <label
                htmlFor="address"
                className="mb-1.5 block text-sm font-medium text-[#12201E]"
              >
                Endereço
              </label>
              <div className="relative">
                <MapPin
                  className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#5C6B68]"
                  strokeWidth={1.75}
                />
                <input
                  id="address"
                  type="text"
                  placeholder="Rua das Palmeiras, 245 — Vila Mariana, São Paulo - SP"
                  aria-invalid={!!errors.address}
                  className={cn(
                    "w-full rounded-xl border bg-white py-2.5 pl-10 pr-3.5 text-sm text-[#12201E] outline-none transition-colors placeholder:text-[#5C6B68]/50",
                    "focus:border-[#0F5C56] focus:ring-2 focus:ring-[#0F5C56]/15",
                    errors.address ? "border-red-300" : "border-[#E4E1D8]",
                  )}
                  {...register("address")}
                />
              </div>
              <FieldError message={errors.address?.message} />
            </div>

            {/* Horário de funcionamento */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="open_hour"
                  className="mb-1.5 block text-sm font-medium text-[#12201E]"
                >
                  Abertura
                </label>
                <div className="relative">
                  <Clock
                    className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#5C6B68]"
                    strokeWidth={1.75}
                  />
                  <input
                    id="open_hour"
                    type="time"
                    aria-invalid={!!errors.open_hour}
                    className={cn(
                      "w-full rounded-xl border bg-white py-2.5 pl-10 pr-3.5 text-sm text-[#12201E] outline-none transition-colors",
                      "focus:border-[#0F5C56] focus:ring-2 focus:ring-[#0F5C56]/15",
                      errors.open_hour ? "border-red-300" : "border-[#E4E1D8]",
                    )}
                    {...register("open_hour")}
                  />
                </div>
                <FieldError message={errors.open_hour?.message} />
              </div>

              <div>
                <label
                  htmlFor="close_hour"
                  className="mb-1.5 block text-sm font-medium text-[#12201E]"
                >
                  Fechamento
                </label>
                <div className="relative">
                  <Clock
                    className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#5C6B68]"
                    strokeWidth={1.75}
                  />
                  <input
                    id="close_hour"
                    type="time"
                    aria-invalid={!!errors.close_hour}
                    className={cn(
                      "w-full rounded-xl border bg-white py-2.5 pl-10 pr-3.5 text-sm text-[#12201E] outline-none transition-colors",
                      "focus:border-[#0F5C56] focus:ring-2 focus:ring-[#0F5C56]/15",
                      errors.close_hour ? "border-red-300" : "border-[#E4E1D8]",
                    )}
                    {...register("close_hour")}
                  />
                </div>
                <FieldError message={errors.close_hour?.message} />
              </div>
            </div>

            <div className="mt-2 flex items-center justify-end gap-3 border-t border-[#E4E1D8] pt-5">
              {savedAt && (
                <span className="flex items-center gap-1.5 text-xs text-[#5C6B68]">
                  <Check
                    className="h-3.5 w-3.5 text-[#0F5C56]"
                    strokeWidth={2}
                  />
                  Salvo às {savedAt}
                </span>
              )}
              <button
                type="submit"
                disabled={isSubmitting}
                className={cn(
                  "flex items-center gap-2 rounded-xl bg-[#0F5C56] px-5 py-2.5 text-sm font-medium text-white transition-colors",
                  "hover:bg-[#0B4842] disabled:cursor-not-allowed disabled:opacity-70",
                )}
              >
                {isSubmitting && (
                  <Loader2 className="h-4 w-4 animate-spin" strokeWidth={2} />
                )}
                Salvar
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
