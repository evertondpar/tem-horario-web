import type { Appointment } from "./appointment";
import type { Schedule } from "./schedule";
import type { Service } from "./service";

export type Client = { id: number; name: string; phone: string; photo?: string | null };

export type MarketplaceEstablishment = {
  id: number;
  name: string;
  phone: string;
  address: string;
  photo?: string | null;
  open_hour: string;
  close_hour: string;
  service_count: number;
  starting_price: number | null;
};

export type BookingCollaborator = {
  id: number;
  name: string;
  photo?: string | null;
  service_ids: number[];
  schedule: Schedule | null;
};

export type EstablishmentBookingDetails = {
  establishment: Omit<MarketplaceEstablishment, "service_count" | "starting_price">;
  services: Service[];
  collaborators: BookingCollaborator[];
};

export type ClientAppointment = Appointment;
