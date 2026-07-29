import { Tag } from "lucide-react";
import { PagePlaceholder } from "../components/ui/PagePlaceholder";

export default function Servicos() {
  return (
    <PagePlaceholder
      icon={Tag}
      title="Nenhum serviço cadastrado"
      description="Adicione os serviços que seu estabelecimento oferece para começar a receber agendamentos."
      actionLabel="Novo serviço"
    />
  );
}
