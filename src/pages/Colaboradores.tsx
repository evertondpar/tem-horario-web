import { useState } from "react";
import { Plus } from "lucide-react";
import { CollaboratorsGrid } from "../components/collaborators/CollaboratorsGrid";
import {
  CollaboratorFormDialog,
  type CollaboratorFormData,
} from "../components/collaborators/CollaboratorFormDialog";
import { DeleteCollaboratorDialog } from "../components/collaborators/DeleteCollaboratorDialog";
import { MOCK_COLLABORATORS } from "../data/mock-collaborators";
import type { Collaborator } from "../types/collaborator";

export default function Colaboradores() {
  // TODO: trocar pelos dados reais (React Query + GET/POST/PATCH/DELETE /collaborators)
  const [collaborators, setCollaborators] = useState<Collaborator[]>(MOCK_COLLABORATORS);

  const [isFormOpen, setFormOpen] = useState(false);
  const [editingCollaborator, setEditingCollaborator] = useState<Collaborator | null>(null);
  const [deletingCollaborator, setDeletingCollaborator] = useState<Collaborator | null>(null);

  function openCreateDialog() {
    setEditingCollaborator(null);
    setFormOpen(true);
  }

  function openEditDialog(collaborator: Collaborator) {
    setEditingCollaborator(collaborator);
    setFormOpen(true);
  }

  async function handleSubmit(data: CollaboratorFormData) {
    // TODO: substituir por chamada real (POST /collaborators ou PATCH /collaborators/:id).
    // O campo "password" só deve ser enviado quando preenchido (na edição, vazio = manter a atual),
    // e a foto precisa virar um upload multipart em vez do data URL usado aqui no mock.
    if (editingCollaborator) {
      setCollaborators((prev) =>
        prev.map((c) =>
          c.id === editingCollaborator.id
            ? { ...c, name: data.name, phone: data.phone, photo: data.photo }
            : c
        )
      );
    } else {
      const nextId = collaborators.reduce((max, c) => Math.max(max, c.id), 0) + 1;
      setCollaborators((prev) => [
        ...prev,
        {
          id: nextId,
          name: data.name,
          phone: data.phone,
          photo: data.photo,
          status: "active",
          services: [],
        },
      ]);
    }
  }

  async function handleConfirmDelete() {
    if (!deletingCollaborator) return;
    // TODO: substituir por chamada real (DELETE /collaborators/:id)
    setCollaborators((prev) => prev.filter((c) => c.id !== deletingCollaborator.id));
    setDeletingCollaborator(null);
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-[#5C6B68]">
          Gerencie os barbeiros e colaboradores do seu estabelecimento.
        </p>
        <button
          type="button"
          onClick={openCreateDialog}
          className="flex items-center justify-center gap-2 rounded-xl bg-[#0F5C56] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#0B4842]"
        >
          <Plus className="h-4 w-4" strokeWidth={2} />
          Novo colaborador
        </button>
      </div>

      <CollaboratorsGrid
        collaborators={collaborators}
        onEdit={openEditDialog}
        onDelete={setDeletingCollaborator}
      />

      <CollaboratorFormDialog
        open={isFormOpen}
        onOpenChange={setFormOpen}
        collaborator={editingCollaborator}
        onSubmit={handleSubmit}
      />

      <DeleteCollaboratorDialog
        collaborator={deletingCollaborator}
        open={!!deletingCollaborator}
        onOpenChange={(open) => {
          if (!open) setDeletingCollaborator(null);
        }}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
