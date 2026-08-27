import { api } from "./api";

export type Device = {
  id: number;
  user_id: number;
  user_role: "establishment" | "collaborator" | "client";
  token: string;
  platform: "web" | "android" | "ios";
  active: boolean;
  last_seen_at: string | null;
};

export async function registerDevice(token: string) {
  const { data } = await api.post<Device>("/devices", {
    token,
    platform: "web",
  });
  return data;
}
