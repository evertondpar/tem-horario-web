import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { CollaboratorsGrid } from "../components/collaborators/CollaboratorsGrid";
import { CollaboratorsGridSkeleton } from "../components/collaborators/CollaboratorsGridSkeleton";
import { CollaboratorsErrorState } from "../components/collaborators/CollaboratorsErrorState";
import {
  CollaboratorFormDialog,
  type CollaboratorFormData,
} from "../components/collaborators/CollaboratorFormDialog";
import { DeleteCollaboratorDialog } from "../components/collaborators/DeleteCollaboratorDialog";
import type { Collaborator } from "../types/collaborator";
import {
  getCollaborators,
  type ListCollaboratorsResponse,
} from "@/api/establishment/collaborators/getCollaborators";
import { createCollaborators } from "@/api/establishment/collaborators/createCollaborators";
import { updateCollaborators } from "@/api/establishment/collaborators/updateCollaborators";
import { deleteCollaborators } from "@/api/establishment/collaborators/deleteCollaborators";

export default function Colaboradores() {
  // TODO: trocar pelos dados reais (React Query + GET/POST/PATCH/DELETE /collaborators)
  const [collaborators, setCollaborators] =
    useState<ListCollaboratorsResponse>();
  const [isLoading, setLoading] = useState(true);
  const [hasLoadedOnce, setHasLoadedOnce] = useState(false);
  const [loadError, setLoadError] = useState(false);

  const [isFormOpen, setFormOpen] = useState(false);
  const [editingCollaborator, setEditingCollaborator] =
    useState<Collaborator | null>(null);
  const [deletingCollaborator, setDeletingCollaborator] =
    useState<Collaborator | null>(null);
  const handleGetCollaborators = async () => {
    setLoading(true);
    setLoadError(false);
    try {
      const response = await getCollaborators();
      setCollaborators(response);
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
    handleGetCollaborators();
  }, []);

  const handleCreateCollaborators = async (data: CollaboratorFormData) => {
    try {
      const response = await createCollaborators(data);
      console.log("res ", response);
      handleGetCollaborators();
    } catch (err) {
      console.error("Erro ao criar colaborador", err);
    }
  };
  const handleUpdateCollaborators = async (
    id: string,
    data: CollaboratorFormData,
  ) => {
    try {
      const response = await updateCollaborators(id, data);
      console.log("res ", response);
      handleGetCollaborators();
    } catch (err) {
      console.error("Erro ao editar colaborador", err);
    }
  };
  function openCreateDialog() {
    setEditingCollaborator(null);
    setFormOpen(true);
  }

  function openEditDialog(collaborator: Collaborator) {
    setEditingCollaborator(collaborator);
    setFormOpen(true);
  }

  async function handleSubmit(data: CollaboratorFormData) {
    console.log("data ", data);
    // TODO: substituir por chamada real (POST /collaborators ou PATCH /collaborators/:id).
    // O campo "password" só deve ser enviado quando preenchido (na edição, vazio = manter a atual),
    // e a foto precisa virar um upload multipart em vez do data URL usado aqui no mock.
    if (editingCollaborator) {
      handleUpdateCollaborators(String(editingCollaborator.id), data);
    } else {
      handleCreateCollaborators(data);
    }
  }

  async function handleConfirmDelete() {
    if (!deletingCollaborator) return;
    const response = await deleteCollaborators(String(deletingCollaborator.id));
    console.log("res ", response);
    handleGetCollaborators();
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

      {!hasLoadedOnce && isLoading ? (
        <CollaboratorsGridSkeleton />
      ) : loadError ? (
        <CollaboratorsErrorState onRetry={handleGetCollaborators} />
      ) : (
        <CollaboratorsGrid
          collaborators={collaborators ?? []}
          onEdit={openEditDialog}
          onDelete={setDeletingCollaborator}
        />
      )}

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
