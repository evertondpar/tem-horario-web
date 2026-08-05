import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { ServicesTable } from "../components/services/ServicesTable";
import { ServicesTableSkeleton } from "../components/services/ServicesTableSkeleton";
import { ServicesErrorState } from "../components/services/ServicesErrorState";
import {
  ServiceFormDialog,
  type ServiceFormData,
} from "../components/services/ServiceFormDialog";
import { DeleteServiceDialog } from "../components/services/DeleteServiceDialog";
import type { Service } from "../types/service";
import { getServicos } from "@/api/establishment/servicos/getServicos";
import { createServicos } from "@/api/establishment/servicos/createServicos";
import { updateServicos } from "@/api/establishment/servicos/updateServicos";
import { deleteServicos } from "@/api/establishment/servicos/deleteServico";

export default function Servicos() {
  // TODO: trocar pelos dados reais (React Query + GET/POST/PATCH/DELETE /services)
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setLoading] = useState(true);
  const [hasLoadedOnce, setHasLoadedOnce] = useState(false);
  const [loadError, setLoadError] = useState(false);

  const [isFormOpen, setFormOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [deletingService, setDeletingService] = useState<Service | null>(null);

  function openCreateDialog() {
    setEditingService(null);
    setFormOpen(true);
  }

  function openEditDialog(service: Service) {
    setEditingService(service);
    setFormOpen(true);
  }

  const handleGetServicos = async () => {
    setLoading(true);
    setLoadError(false);
    try {
      const response = await getServicos();
      setServices(response);
      console.log("res ", response);
    } catch (err) {
      console.error("Erro ao carregar os serviços", err);
      setLoadError(true);
    } finally {
      setLoading(false);
      setHasLoadedOnce(true);
    }
  };

  const handleCreateServicos = async (data: ServiceFormData) => {
    try {
      const response = await createServicos(data);
      console.log("res ", response);
      handleGetServicos();
    } catch (err) {
      console.error("Erro ao criar serviço", err);
    }
  };
  const handleUpdateteServicos = async (id: string, data: ServiceFormData) => {
    try {
      const response = await updateServicos(id, data);
      console.log("res ", response);
      handleGetServicos();
    } catch (err) {
      console.error("Erro ao atualizar serviço", err);
    }
  };

  async function handleSubmit(data: ServiceFormData) {
    // TODO: substituir por chamada real (POST /services ou PATCH /services/:id)
    if (editingService) {
      handleUpdateteServicos(String(editingService.id), data);
    } else {
      handleCreateServicos(data);
    }
  }

  async function handleConfirmDelete() {
    if (!deletingService) return;
    // TODO: substituir por chamada real (DELETE /services/:id)
    // setServices((prev) => prev.filter((s) => s.id !== deletingService.id));
    const response = await deleteServicos(String(deletingService.id));
    console.log("res ", response);
    handleGetServicos();
    setDeletingService(null);
  }

  useEffect(() => {
    handleGetServicos();
  }, []);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-[#5C6B68]">
          Gerencie os serviços oferecidos pelo seu estabelecimento.
        </p>
        <button
          type="button"
          onClick={openCreateDialog}
          className="flex items-center justify-center gap-2 rounded-xl bg-[#0F5C56] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#0B4842]"
        >
          <Plus className="h-4 w-4" strokeWidth={2} />
          Novo serviço
        </button>
      </div>

      {!hasLoadedOnce && isLoading ? (
        <ServicesTableSkeleton />
      ) : loadError ? (
        <ServicesErrorState onRetry={handleGetServicos} />
      ) : (
        <ServicesTable
          services={services}
          onEdit={openEditDialog}
          onDelete={setDeletingService}
        />
      )}

      <ServiceFormDialog
        open={isFormOpen}
        onOpenChange={setFormOpen}
        service={editingService}
        onSubmit={handleSubmit}
      />

      <DeleteServiceDialog
        service={deletingService}
        open={!!deletingService}
        onOpenChange={(open) => {
          if (!open) setDeletingService(null);
        }}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
