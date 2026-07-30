import { AlertDialog } from "@base-ui/react/alert-dialog";
import { Trash2 } from "lucide-react";
import type { Collaborator } from "../../types/collaborator";

type DeleteCollaboratorDialogProps = {
  collaborator: Collaborator | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void | Promise<void>;
};

export function DeleteCollaboratorDialog({
  collaborator,
  open,
  onOpenChange,
  onConfirm,
}: DeleteCollaboratorDialogProps) {
  return (
    <AlertDialog.Root open={open} onOpenChange={onOpenChange}>
      <AlertDialog.Portal>
        <AlertDialog.Backdrop className="fixed inset-0 z-40 bg-[#12201E]/40 transition-opacity duration-150 data-[starting-style]:opacity-0 data-[ending-style]:opacity-0" />
        <AlertDialog.Popup className="fixed left-1/2 top-1/2 z-50 w-[calc(100%-2rem)] max-w-sm -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-[#E4E1D8] bg-white p-6 shadow-xl outline-none transition-all duration-150 data-[starting-style]:scale-95 data-[starting-style]:opacity-0 data-[ending-style]:scale-95 data-[ending-style]:opacity-0">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-red-600">
            <Trash2 className="h-4.5 w-4.5" strokeWidth={1.75} />
          </span>

          <AlertDialog.Title className="mt-4 text-lg font-medium text-[#12201E]">
            Excluir colaborador?
          </AlertDialog.Title>
          <AlertDialog.Description className="mt-1.5 text-sm text-[#5C6B68]">
            {collaborator
              ? `"${collaborator.name}" será removido e essa ação não pode ser desfeita.`
              : "Essa ação não pode ser desfeita."}
          </AlertDialog.Description>

          <div className="mt-6 flex justify-end gap-3">
            <AlertDialog.Close className="rounded-xl px-4 py-2 text-sm font-medium text-[#5C6B68] hover:bg-[#12201E]/5 hover:text-[#12201E]">
              Cancelar
            </AlertDialog.Close>
            <button
              type="button"
              onClick={async () => {
                await onConfirm();
                onOpenChange(false);
              }}
              className="rounded-xl bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700"
            >
              Excluir
            </button>
          </div>
        </AlertDialog.Popup>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  );
}
