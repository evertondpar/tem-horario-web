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
  cover_photo?: string | null;
  cover_position?: number;
  description?: string | null;
  cancellation_policy?: string | null;
  zip_code?: string;
  street?: string;
  address_number?: string;
  address_complement?: string;
  neighborhood?: string;
  city?: string;
  state?: string;
  open_hour: string;
  close_hour: string;
  service_count: number;
  service_names?: string[];
  starting_price: number | null;
  rating?: number | null;
  review_count?: number;
  next_available?: string | null;
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
