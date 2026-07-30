import { Pencil, Trash2, Tag } from "lucide-react";
import type { Service } from "../../types/service";
import { formatCurrency, formatDuration } from "../../lib/format";

type ServicesTableProps = {
  services: Service[];
  onEdit: (service: Service) => void;
  onDelete: (service: Service) => void;
};

export function ServicesTable({ services, onEdit, onDelete }: ServicesTableProps) {
  if (services.length === 0) {
    return (
      <div className="flex flex-col items-center gap-2 rounded-2xl border border-dashed border-[#E4E1D8] px-6 py-16 text-center">
        <Tag className="h-5 w-5 text-[#5C6B68]" strokeWidth={1.75} />
        <p className="text-sm text-[#5C6B68]">Nenhum serviço cadastrado ainda.</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-[#E4E1D8] bg-white">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-[#E4E1D8] text-left text-xs font-medium uppercase tracking-wide text-[#5C6B68]">
            <th className="px-5 py-3 font-medium">Nome</th>
            <th className="px-5 py-3 font-medium">Duração</th>
            <th className="px-5 py-3 font-medium">Preço</th>
            <th className="px-5 py-3 text-right font-medium">Ações</th>
          </tr>
        </thead>
        <tbody>
          {services.map((service) => (
            <tr
              key={service.id}
              className="border-b border-[#E4E1D8] last:border-0 hover:bg-[#F7F6F2]/60"
            >
              <td className="px-5 py-3.5 font-medium text-[#12201E]">{service.name}</td>
              <td className="px-5 py-3.5 text-[#5C6B68]">
                {formatDuration(service.duration_minutes)}
              </td>
              <td className="px-5 py-3.5 tabular-nums text-[#5C6B68]">
                {formatCurrency(service.price)}
              </td>
              <td className="px-5 py-3.5">
                <div className="flex justify-end gap-1">
                  <button
                    type="button"
                    onClick={() => onEdit(service)}
                    aria-label={`Editar ${service.name}`}
                    className="rounded-lg p-1.5 text-[#5C6B68] hover:bg-[#0F5C56]/10 hover:text-[#0F5C56]"
                  >
                    <Pencil className="h-4 w-4" strokeWidth={1.75} />
                  </button>
                  <button
                    type="button"
                    onClick={() => onDelete(service)}
                    aria-label={`Excluir ${service.name}`}
                    className="rounded-lg p-1.5 text-[#5C6B68] hover:bg-red-50 hover:text-red-600"
                  >
                    <Trash2 className="h-4 w-4" strokeWidth={1.75} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
