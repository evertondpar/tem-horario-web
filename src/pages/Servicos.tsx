import { useState } from "react";
import { Plus } from "lucide-react";
import { ServicesTable } from "../components/services/ServicesTable";
import { ServiceFormDialog, type ServiceFormData } from "../components/services/ServiceFormDialog";
import { DeleteServiceDialog } from "../components/services/DeleteServiceDialog";
import { MOCK_SERVICES } from "../data/mock-services";
import type { Service } from "../types/service";

export default function Servicos() {
  // TODO: trocar pelos dados reais (React Query + GET/POST/PATCH/DELETE /services)
  const [services, setServices] = useState<Service[]>(MOCK_SERVICES);

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

  async function handleSubmit(data: ServiceFormData) {
    // TODO: substituir por chamada real (POST /services ou PATCH /services/:id)
    if (editingService) {
      setServices((prev) =>
        prev.map((s) => (s.id === editingService.id ? { ...s, ...data } : s))
      );
    } else {
      const nextId = services.reduce((max, s) => Math.max(max, s.id), 0) + 1;
      setServices((prev) => [...prev, { id: nextId, ...data }]);
    }
  }

  async function handleConfirmDelete() {
    if (!deletingService) return;
    // TODO: substituir por chamada real (DELETE /services/:id)
    setServices((prev) => prev.filter((s) => s.id !== deletingService.id));
    setDeletingService(null);
  }

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

      <ServicesTable services={services} onEdit={openEditDialog} onDelete={setDeletingService} />

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
