import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Dialog } from "@base-ui/react/dialog";
import { Tag, Clock, DollarSign, Loader2, AlertCircle, X } from "lucide-react";
import { cn } from "../../lib/utils";
import type { Service } from "../../types/service";

const serviceSchema = z.object({
  name: z
    .string()
    .min(1, "Informe o nome do serviço")
    .max(80, "Use no máximo 80 caracteres"),
  duration_minutes: z
    .string()
    .min(1, "Informe a duração em minutos")
    .refine((v) => Number.isInteger(Number(v)) && Number(v) > 0, {
      message: "A duração deve ser um número inteiro positivo",
    })
    .refine((v) => Number(v) <= 600, "A duração máxima é de 600 minutos")
    .transform((v) => Number(v)),
  price: z
    .string()
    .min(1, "Informe o preço do serviço")
    .refine((v) => Number(v) > 0, "Informe o preço do serviço")
    .refine((v) => Number(v) <= 999999.99, "Valor muito alto")
    .transform((v) => Number(v)),
});

type ServiceFormValues = z.input<typeof serviceSchema>;
export type ServiceFormData = z.output<typeof serviceSchema>;

type ServiceFormDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Presente = modo edição · null/undefined = modo criação */
  service?: Service | null;
  onSubmit: (data: ServiceFormData) => Promise<void> | void;
};

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p className="mt-1.5 flex items-center gap-1 text-xs text-red-600" role="alert">
      <AlertCircle className="h-3.5 w-3.5 shrink-0" strokeWidth={2} />
      {message}
    </p>
  );
}

// Componente interno com key baseada no serviço — garante um formulário
// limpo (defaultValues corretos) toda vez que a modal abre pra criar ou
// editar um registro diferente.
function ServiceFormInner({
  service,
  onOpenChange,
  onSubmit,
}: Omit<ServiceFormDialogProps, "open">) {
  const isEditing = !!service;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ServiceFormValues, unknown, ServiceFormData>({
    resolver: zodResolver(serviceSchema),
    defaultValues: {
      name: service?.name ?? "",
      duration_minutes: service?.duration_minutes?.toString() ?? "",
      price: service?.price?.toString() ?? "",
    },
  });

  const submit = async (data: ServiceFormData) => {
    await onSubmit(data);
    onOpenChange(false);
  };

  return (
    <>
      <div className="flex items-start justify-between gap-4 px-6 pt-6">
        <div>
          <Dialog.Title className="text-lg font-medium text-[#12201E]">
            {isEditing ? "Editar serviço" : "Novo serviço"}
          </Dialog.Title>
          <Dialog.Description className="mt-1 text-sm text-[#5C6B68]">
            {isEditing
              ? "Atualize as informações do serviço."
              : "Preencha os dados do serviço que seu estabelecimento vai oferecer."}
          </Dialog.Description>
        </div>
        <Dialog.Close
          aria-label="Fechar"
          className="shrink-0 rounded-lg p-1.5 text-[#5C6B68] hover:bg-[#12201E]/5 hover:text-[#12201E]"
        >
          <X className="h-4.5 w-4.5" strokeWidth={1.75} />
        </Dialog.Close>
      </div>

      <form onSubmit={handleSubmit(submit)} noValidate className="mt-5 flex flex-col gap-4 px-6">
        <div>
          <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-[#12201E]">
            Nome
          </label>
          <div className="relative">
            <Tag
              className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#5C6B68]"
              strokeWidth={1.75}
            />
            <input
              id="name"
              type="text"
              placeholder="Corte Masculino"
              aria-invalid={!!errors.name}
              className={cn(
                "w-full rounded-xl border bg-white py-2.5 pl-10 pr-3.5 text-sm text-[#12201E] outline-none transition-colors placeholder:text-[#5C6B68]/50",
                "focus:border-[#0F5C56] focus:ring-2 focus:ring-[#0F5C56]/15",
                errors.name ? "border-red-300" : "border-[#E4E1D8]"
              )}
              {...register("name")}
            />
          </div>
          <FieldError message={errors.name?.message} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="duration_minutes"
              className="mb-1.5 block text-sm font-medium text-[#12201E]"
            >
              Duração
            </label>
            <div className="relative">
              <Clock
                className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#5C6B68]"
                strokeWidth={1.75}
              />
              <input
                id="duration_minutes"
                type="number"
                inputMode="numeric"
                min={5}
                step={5}
                placeholder="30"
                aria-invalid={!!errors.duration_minutes}
                className={cn(
                  "w-full rounded-xl border bg-white py-2.5 pl-10 pr-12 text-sm text-[#12201E] outline-none transition-colors placeholder:text-[#5C6B68]/50",
                  "focus:border-[#0F5C56] focus:ring-2 focus:ring-[#0F5C56]/15",
                  errors.duration_minutes ? "border-red-300" : "border-[#E4E1D8]"
                )}
                {...register("duration_minutes")}
              />
              <span className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-[#5C6B68]">
                min
              </span>
            </div>
            <FieldError message={errors.duration_minutes?.message} />
          </div>

          <div>
            <label htmlFor="price" className="mb-1.5 block text-sm font-medium text-[#12201E]">
              Preço
            </label>
            <div className="relative">
              <DollarSign
                className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#5C6B68]"
                strokeWidth={1.75}
              />
              <input
                id="price"
                type="number"
                inputMode="decimal"
                min={0}
                step={0.01}
                placeholder="45,00"
                aria-invalid={!!errors.price}
                className={cn(
                  "w-full rounded-xl border bg-white py-2.5 pl-10 pr-3.5 text-sm text-[#12201E] outline-none transition-colors placeholder:text-[#5C6B68]/50",
                  "focus:border-[#0F5C56] focus:ring-2 focus:ring-[#0F5C56]/15",
                  errors.price ? "border-red-300" : "border-[#E4E1D8]"
                )}
                {...register("price")}
              />
            </div>
            <FieldError message={errors.price?.message} />
          </div>
        </div>

        <div className="mt-2 flex items-center justify-end gap-3 border-t border-[#E4E1D8] px-0 py-4">
          <Dialog.Close
            type="button"
            className="rounded-xl px-4 py-2 text-sm font-medium text-[#5C6B68] hover:bg-[#12201E]/5 hover:text-[#12201E]"
          >
            Cancelar
          </Dialog.Close>
          <button
            type="submit"
            disabled={isSubmitting}
            className={cn(
              "flex items-center gap-2 rounded-xl bg-[#0F5C56] px-4 py-2 text-sm font-medium text-white transition-colors",
              "hover:bg-[#0B4842] disabled:cursor-not-allowed disabled:opacity-70"
            )}
          >
            {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" strokeWidth={2} />}
            {isEditing ? "Salvar alterações" : "Criar serviço"}
          </button>
        </div>
      </form>
    </>
  );
}

export function ServiceFormDialog({
  open,
  onOpenChange,
  service,
  onSubmit,
}: ServiceFormDialogProps) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 z-40 bg-[#12201E]/40 transition-opacity duration-150 data-[starting-style]:opacity-0 data-[ending-style]:opacity-0" />
        <Dialog.Popup
          className={cn(
            "fixed left-1/2 top-1/2 z-50 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2",
            "rounded-2xl border border-[#E4E1D8] bg-white pb-2 shadow-xl outline-none",
            "transition-all duration-150 data-[starting-style]:scale-95 data-[starting-style]:opacity-0 data-[ending-style]:scale-95 data-[ending-style]:opacity-0"
          )}
        >
          {/* key força o formulário a remontar com os valores certos ao trocar de serviço */}
          <ServiceFormInner
            key={service?.id ?? "new"}
            service={service}
            onOpenChange={onOpenChange}
            onSubmit={onSubmit}
          />
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
