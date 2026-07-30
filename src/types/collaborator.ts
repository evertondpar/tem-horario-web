import type { Service } from "./service";

export type CollaboratorStatus = "active" | "inactive";

export type Collaborator = {
  id: number;
  // establishment_id é atribuído pelo backend a partir da sessão autenticada.
  name: string;
  phone: string;
  photo?: string | null;
  // Ainda não existe na entidade Collaborator — sugestão: coluna `is_active`
  // (boolean) no backend. Por enquanto, controlado só no front.
  status: CollaboratorStatus;
  // Vem da relação collaboratorServices (many-to-many via CollaboratorService),
  // que já existe na entidade mas ainda não é retornada pela API. Mockado
  // por enquanto — troque pelos dados reais quando o endpoint expuser isso.
  services: Service[];
  createdAt?: string;
  updatedAt?: string;
};
