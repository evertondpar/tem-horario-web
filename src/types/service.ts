export type Service = {
  id: number;
  // establishment_id é atribuído pelo backend a partir da sessão autenticada,
  // por isso não aparece no formulário de criação/edição.
  name: string;
  duration_minutes: number;
  price: number;
  createdAt?: string;
  updatedAt?: string;
};
