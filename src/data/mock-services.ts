import type { Service } from "../types/service";

// TODO: trocar por dados vindos da API (GET /services)
export const MOCK_SERVICES: Service[] = [
  { id: 1, name: "Corte Masculino", duration_minutes: 30, price: 45 },
  { id: 2, name: "Coloração", duration_minutes: 90, price: 150 },
  { id: 3, name: "Manicure", duration_minutes: 45, price: 35 },
  { id: 4, name: "Barba", duration_minutes: 20, price: 30 },
  { id: 5, name: "Escova", duration_minutes: 60, price: 60 },
];
