import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Dialog } from "@base-ui/react/dialog";
import { User, Phone, Camera, Loader2, AlertCircle, X, Lock } from "lucide-react";
import { cn } from "../../lib/utils";
import type { Collaborator } from "../../types/collaborator";
import { CollaboratorAvatar } from "./CollaboratorAvatar";

const MAX_PHOTO_SIZE_MB = 3;

function buildCollaboratorSchema(isEditing: boolean) {
  return z.object({
    name: z
      .string()
      .min(1, "Informe o nome do colaborador")
      .max(80, "Use no máximo 80 caracteres"),
    phone: z
      .string()
      .min(1, "Informe o telefone")
      .refine(
        (v) => v.replace(/\D/g, "").length >= 10,
        "Informe um telefone válido",
      ),
    password: z.string().refine(
      (value) => (isEditing && value.length === 0) || value.length >= 6,
      "A senha precisa ter pelo menos 6 caracteres",
    ),
  });
}

type CollaboratorFormValues = {
  name: string;
  phone: string;
  password: string;
};

export type CollaboratorFormData = CollaboratorFormValues & {
  photo: string | null;
};

type CollaboratorFormDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Presente = modo edição · null/undefined = modo criação */
  collaborator?: Collaborator | null;
  onSubmit: (data: CollaboratorFormData) => Promise<void> | void;
};

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

function CollaboratorFormInner({
  collaborator,
  onOpenChange,
  onSubmit,
}: Omit<CollaboratorFormDialogProps, "open">) {
  const isEditing = !!collaborator;
  const schema = buildCollaboratorSchema(isEditing);

  const [photo, setPhoto] = useState<string | null>(
    collaborator?.photo ?? null,
  );
  const [photoError, setPhotoError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CollaboratorFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: collaborator?.name ?? "",
      phone: collaborator?.phone ?? "",
      password: "",
    },
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

  const submit = async (data: CollaboratorFormValues) => {
    const payload = { ...data, photo };
    if (isEditing && !payload.password) delete (payload as Partial<CollaboratorFormData>).password;
    await onSubmit(payload);
    onOpenChange(false);
  };

  return (
    <>
      <div className="flex items-start justify-between gap-4 px-6 pt-6">
        <div>
          <Dialog.Title className="text-lg font-medium text-[#12201E]">
            {isEditing ? "Editar colaborador" : "Novo colaborador"}
          </Dialog.Title>
          <Dialog.Description className="mt-1 text-sm text-[#5C6B68]">
            {isEditing
              ? "Atualize as informações do colaborador."
              : "Cadastre um colaborador para atender pelo seu estabelecimento."}
          </Dialog.Description>
        </div>
        <Dialog.Close
          aria-label="Fechar"
          className="shrink-0 rounded-lg p-1.5 text-[#5C6B68] hover:bg-[#12201E]/5 hover:text-[#12201E]"
        >
          <X className="h-4.5 w-4.5" strokeWidth={1.75} />
        </Dialog.Close>
      </div>

      <form
        onSubmit={handleSubmit(submit)}
        noValidate
        className="mt-5 flex flex-col gap-4 px-6 pb-2"
      >
        {/* Foto (opcional) */}
        <div className="flex items-center gap-4">
          <CollaboratorAvatar
            name={collaborator?.name || "?"}
            photo={photo}
            size="lg"
          />
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
              Opcional · JPG ou PNG, até {MAX_PHOTO_SIZE_MB}MB
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
            <User
              className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#5C6B68]"
              strokeWidth={1.75}
            />
            <input
              id="name"
              type="text"
              placeholder="Marina Silva"
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
              placeholder="(11) 91234-5678"
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

        {/* Senha de acesso */}
        <div>
          <label
            htmlFor="collaborator-password"
            className="mb-1.5 block text-sm font-medium text-[#12201E]"
          >
            Senha {isEditing && <span className="font-normal text-[#5C6B68]">(opcional)</span>}
          </label>
          <div className="relative">
            <Lock
              className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#5C6B68]"
              strokeWidth={1.75}
            />
            <input
              id="collaborator-password"
              type="password"
              autoComplete="new-password"
              placeholder={isEditing ? "Deixe em branco para manter" : "Mínimo de 6 caracteres"}
              aria-invalid={!!errors.password}
              className={cn(
                "w-full rounded-xl border bg-white py-2.5 pl-10 pr-3.5 text-sm text-[#12201E] outline-none transition-colors placeholder:text-[#5C6B68]/50",
                "focus:border-[#0F5C56] focus:ring-2 focus:ring-[#0F5C56]/15",
                errors.password ? "border-red-300" : "border-[#E4E1D8]",
              )}
              {...register("password")}
            />
          </div>
          <FieldError message={errors.password?.message} />
        </div>

        <div className="mt-2 flex items-center justify-end gap-3 border-t border-[#E4E1D8] py-4">
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
              "hover:bg-[#0B4842] disabled:cursor-not-allowed disabled:opacity-70",
            )}
          >
            {isSubmitting && (
              <Loader2 className="h-4 w-4 animate-spin" strokeWidth={2} />
            )}
            {isEditing ? "Salvar alterações" : "Criar colaborador"}
          </button>
        </div>
      </form>
    </>
  );
}

export function CollaboratorFormDialog({
  open,
  onOpenChange,
  collaborator,
  onSubmit,
}: CollaboratorFormDialogProps) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 z-40 bg-[#12201E]/40 transition-opacity duration-150 data-[starting-style]:opacity-0 data-[ending-style]:opacity-0" />
        <Dialog.Popup
          className={cn(
            "fixed left-1/2 top-1/2 z-50 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2",
            "rounded-2xl border border-[#E4E1D8] bg-white pb-2 shadow-xl outline-none",
            "transition-all duration-150 data-[starting-style]:scale-95 data-[starting-style]:opacity-0 data-[ending-style]:scale-95 data-[ending-style]:opacity-0",
          )}
        >
          {/* key força o formulário a remontar com os valores certos ao trocar de colaborador */}
          <CollaboratorFormInner
            key={collaborator?.id ?? "new"}
            collaborator={collaborator}
            onOpenChange={onOpenChange}
            onSubmit={onSubmit}
          />
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
