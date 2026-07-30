import type { Collaborator } from "../types/collaborator";
import { MOCK_SERVICES } from "./mock-services";

// TODO: trocar por dados vindos da API (GET /collaborators, incluindo os
// serviços de cada um assim que o endpoint expuser a relação)
const [corte, coloracao, manicure, barba] = MOCK_SERVICES;

export const MOCK_COLLABORATORS: Collaborator[] = [
  {
    id: 1,
    name: "Marina Silva",
    phone: "(11) 91234-5678",
    photo: "https://api.dicebear.com/9.x/notionists/svg?seed=Marina-Silva",
    status: "active",
    services: [corte, coloracao],
  },
  {
    id: 2,
    name: "Rafael Torres",
    phone: "(11) 99876-5432",
    photo: "https://api.dicebear.com/9.x/notionists/svg?seed=Rafael-Torres",
    status: "active",
    services: [corte, barba],
  },
  {
    id: 3,
    name: "Bianca Ferreira",
    phone: "(11) 98765-4321",
    photo: null,
    status: "inactive",
    services: [manicure],
  },
];
