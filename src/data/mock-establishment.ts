import type { Establishment } from "../types/establishment";

// TODO: trocar por dados vindos da API (ex: GET /establishments/me)
export const MOCK_ESTABLISHMENT: Establishment = {
  id: 1,
  name: "Studio Nova Era",
  phone: "(11) 4002-8922",
  photo: null,
  address: "Rua das Palmeiras, 245 — Vila Mariana, São Paulo - SP",
  open_hour: "09:00",
  close_hour: "20:00",
};
