import { api } from "./api";
import type { SessionEstablishment } from "../utils/storage";

export type OnboardingPayload = {
  address: string;
  zip_code: string;
  street: string;
  address_number: string;
  address_complement: string;
  neighborhood: string;
  city: string;
  state: string;
  cover_position: number;
  open_hour: string;
  close_hour: string;
  service_name: string;
  service_duration_minutes: number;
  service_price: number;
  collaborator_name: string;
  collaborator_phone: string;
  collaborator_password: string;
};

export async function registerEstablishment(payload: {
  name: string;
  phone: string;
  password: string;
}) {
  const { data } = await api.post<SessionEstablishment>("/establishments", {
    ...payload,
    open_hour: "08:00",
    close_hour: "18:00",
  });
  return data;
}

export async function getOnboardingStatus() {
  const { data } = await api.get<{
    completed: boolean;
    steps: Record<"profile" | "service" | "collaborator" | "schedule" | "assigned_service", boolean>;
  }>("/establishments/onboarding");
  return data;
}

export async function completeOnboarding(payload: OnboardingPayload) {
  const { data } = await api.post<{ completed: boolean }>(
    "/establishments/onboarding/complete",
    payload,
  );
  return data;
}
