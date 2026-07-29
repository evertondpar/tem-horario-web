import { Calendar } from "lucide-react";
import { PagePlaceholder } from "../components/ui/PagePlaceholder";

export default function Agenda() {
  return (
    <PagePlaceholder
      icon={Calendar}
      title="Sua agenda está livre"
      description="Os horários marcados pelos seus clientes aparecem aqui, organizados por dia."
    />
  );
}
