export type UserRole = "establishment" | "collaborator" | "client";

export type SessionUser = {
  id: number;
  name: string;
  phone: string;
  photo?: string | null;
};

export type SessionEstablishment = {
  id: number;
  name: string;
  phone: string;
  photo?: string | null;
  onboarding_completed?: boolean;
};

export type Session = {
  role: UserRole;
  user: SessionUser;
  establishment?: SessionEstablishment;
};

const SESSION_KEY = "tem-horario-session";
const PENDING_BOOKING_KEY = "tem-horario-pending-booking";

export type PendingBooking = {
  establishment_id: number;
  establishment_name: string;
  collaborator_id: number;
  service_id: number;
  appointment_date: string;
  start_time: string;
};

export const storage = {
  getToken: () => localStorage.getItem("token"),

  setToken: (token: string) => localStorage.setItem("token", token),

  removeToken: () => localStorage.removeItem("token"),

  getSession: (): Session | null => {
    const value = localStorage.getItem(SESSION_KEY);
    if (!value) return null;

    try {
      return JSON.parse(value) as Session;
    } catch {
      localStorage.removeItem(SESSION_KEY);
      return null;
    }
  },

  setSession: (session: Session) => {
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    window.dispatchEvent(new Event("tem-horario-session-updated"));
  },

  getPendingBooking: (): PendingBooking | null => {
    const value = sessionStorage.getItem(PENDING_BOOKING_KEY);
    if (!value) return null;
    try { return JSON.parse(value) as PendingBooking; }
    catch { sessionStorage.removeItem(PENDING_BOOKING_KEY); return null; }
  },

  setPendingBooking: (booking: PendingBooking) => sessionStorage.setItem(PENDING_BOOKING_KEY, JSON.stringify(booking)),

  clearPendingBooking: () => sessionStorage.removeItem(PENDING_BOOKING_KEY),

  clear: () => {
    localStorage.removeItem("token");
    localStorage.removeItem(SESSION_KEY);
  },
};
