export type UserRole = "establishment" | "collaborator";

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
};

export type Session = {
  role: UserRole;
  user: SessionUser;
  establishment: SessionEstablishment;
};

const SESSION_KEY = "tem-horario-session";

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

  setSession: (session: Session) =>
    localStorage.setItem(SESSION_KEY, JSON.stringify(session)),

  clear: () => {
    localStorage.removeItem("token");
    localStorage.removeItem(SESSION_KEY);
  },
};
