export type Establishment = {
  id: number;
  name: string;
  phone: string;
  photo?: string | null;
  // Ainda não existe na entidade Establishment — sugestão: coluna `address`
  // (string) no backend. Por enquanto, só é salvo aqui no mock.
  address: string;
  zip_code?: string;
  street?: string;
  address_number?: string;
  address_complement?: string;
  neighborhood?: string;
  city?: string;
  state?: string;
  cover_photo?: string | null;
  cover_position?: number;
  description?: string | null;
  cancellation_policy?: string | null;
  /** "HH:mm" */
  open_hour: string;
  /** "HH:mm" */
  close_hour: string;
  createdAt?: string;
  updatedAt?: string;
};
