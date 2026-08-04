export type Establishment = {
  id: number;
  name: string;
  phone: string;
  photo?: string | null;
  // Ainda não existe na entidade Establishment — sugestão: coluna `address`
  // (string) no backend. Por enquanto, só é salvo aqui no mock.
  address: string;
  /** "HH:mm" */
  open_hour: string;
  /** "HH:mm" */
  close_hour: string;
  createdAt?: string;
  updatedAt?: string;
};
