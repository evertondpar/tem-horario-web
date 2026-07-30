import { Users } from "lucide-react";
import type { Collaborator } from "../../types/collaborator";
import { CollaboratorCard } from "./CollaboratorCard";

type CollaboratorsGridProps = {
  collaborators: Collaborator[];
  onEdit: (collaborator: Collaborator) => void;
  onDelete: (collaborator: Collaborator) => void;
};

export function CollaboratorsGrid({ collaborators, onEdit, onDelete }: CollaboratorsGridProps) {
  if (collaborators.length === 0) {
    return (
      <div className="flex flex-col items-center gap-2 rounded-2xl border border-dashed border-[#E4E1D8] px-6 py-16 text-center">
        <Users className="h-5 w-5 text-[#5C6B68]" strokeWidth={1.75} />
        <p className="text-sm text-[#5C6B68]">Nenhum colaborador cadastrado ainda.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {collaborators.map((collaborator) => (
        <CollaboratorCard
          key={collaborator.id}
          collaborator={collaborator}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
