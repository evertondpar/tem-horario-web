import { Settings } from "lucide-react";
import { PagePlaceholder } from "../components/ui/PagePlaceholder";

export default function Configuracoes() {
  return (
    <PagePlaceholder
      icon={Settings}
      title="Configurações"
      description="Em breve você poderá ajustar os dados, horários de funcionamento e preferências da sua conta por aqui."
    />
  );
}
