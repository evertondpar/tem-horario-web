import { LayoutDashboard } from "lucide-react";
import { PagePlaceholder } from "../components/ui/PagePlaceholder";

export default function Dashboard() {
  return (
    <PagePlaceholder
      icon={LayoutDashboard}
      title="Assim que você tiver agendamentos, o resumo do seu dia aparece aqui"
      description="Faturamento, próximos horários e ocupação da agenda — tudo em um só lugar."
    />
  );
}
