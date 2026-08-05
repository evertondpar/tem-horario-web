import { Pencil, Trash2, Phone } from "lucide-react";
import type { Collaborator } from "../../types/collaborator";
import { CollaboratorAvatar } from "./CollaboratorAvatar";
import { CollaboratorStatusBadge } from "./CollaboratorStatusBadge";
import type { ListCollaboratorsResponseCollaborator } from "@/api/establishment/collaborators/getCollaborators";

type CollaboratorCardProps = {
  collaborator: ListCollaboratorsResponseCollaborator;
  onEdit: (collaborator: Collaborator) => void;
  onDelete: (collaborator: Collaborator) => void;
};

export function CollaboratorCard({
  collaborator,
  onEdit,
  onDelete,
}: CollaboratorCardProps) {
  const { name, phone, photo, services } = collaborator;

  return (
    <div className="flex flex-col rounded-2xl border border-[#E4E1D8] bg-white p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <CollaboratorAvatar name={name} photo={photo} />
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-[#12201E]">
              {name}
            </p>
            <p className="mt-0.5 flex items-center gap-1 text-xs text-[#5C6B68]">
              <Phone className="h-3 w-3 shrink-0" strokeWidth={1.75} />
              {phone}
            </p>
          </div>
        </div>

        <div className="flex shrink-0 gap-1">
          <button
            type="button"
            onClick={() => onEdit(collaborator)}
            aria-label={`Editar ${name}`}
            className="rounded-lg p-1.5 text-[#5C6B68] hover:bg-[#0F5C56]/10 hover:text-[#0F5C56]"
          >
            <Pencil className="h-4 w-4" strokeWidth={1.75} />
          </button>
          <button
            type="button"
            onClick={() => onDelete(collaborator)}
            aria-label={`Excluir ${name}`}
            className="rounded-lg p-1.5 text-[#5C6B68] hover:bg-red-50 hover:text-red-600"
          >
            <Trash2 className="h-4 w-4" strokeWidth={1.75} />
          </button>
        </div>
      </div>

      <div className="mt-4">
        <CollaboratorStatusBadge />
      </div>

      <div className="mt-4 border-t border-[#E4E1D8] pt-4">
        <p className="text-xs font-medium uppercase tracking-wide text-[#5C6B68]">
          Serviços oferecidos
        </p>
        {services.length === 0 ? (
          <p className="mt-2 text-xs text-[#5C6B68]">
            Nenhum serviço vinculado ainda.
          </p>
        ) : (
          <div className="mt-2 flex flex-wrap gap-1.5">
            {services.map((service) => (
              <span
                key={service.id}
                className="rounded-full bg-[#F7F6F2] px-2.5 py-1 text-xs text-[#12201E]"
              >
                {service.name}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
