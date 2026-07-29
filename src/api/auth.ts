import { api } from "./api";

export async function login({
  phone,
  password,
}: {
  phone: string;
  password: string;
}) {
  const { data } = await api.post("/auth/login", {
    phone,
    password,
  });

  return data;
}
