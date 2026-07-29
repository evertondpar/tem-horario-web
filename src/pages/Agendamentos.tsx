import { ClipboardList } from "lucide-react";
import { PagePlaceholder } from "../components/ui/PagePlaceholder";

export default function Agendamentos() {
  return (
    <PagePlaceholder
      icon={ClipboardList}
      title="Nenhum agendamento ainda"
      description="Assim que alguém marcar um horário, ele aparece aqui."
    />
  );
}
