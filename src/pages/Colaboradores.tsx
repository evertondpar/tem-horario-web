import { Users } from "lucide-react";
import { PagePlaceholder } from "../components/ui/PagePlaceholder";

export default function Colaboradores() {
  return (
    <PagePlaceholder
      icon={Users}
      title="Nenhum colaborador cadastrado"
      description="Cadastre sua equipe para distribuir os agendamentos entre elas."
      actionLabel="Novo colaborador"
    />
  );
}
