import { api } from "./api";
import type { SessionEstablishment, SessionUser } from "../utils/storage";

export type LoginResponse = {
  access_token: string;
  establishment: SessionEstablishment;
};

export type CollaboratorLoginResponse = LoginResponse & {
  collaborator: SessionUser;
};

export async function login({
  phone,
  password,
}: {
  phone: string;
  password: string;
}) {
  const { data } = await api.post<LoginResponse>("/auth/login", {
    phone,
    password,
  });

  return data;
}

export async function loginCollaborator({
  phone,
  password,
}: {
  phone: string;
  password: string;
}) {
  const { data } = await api.post<CollaboratorLoginResponse>(
    "/auth/login-collaborator",
    { phone, password },
  );

  return data;
}
