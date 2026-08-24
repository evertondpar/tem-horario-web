import { api } from "../api";
import type { Schedule, WeekSlots } from "../../types/schedule";

export async function getCollaboratorSchedule(collaboratorId: number) {
  const { data } = await api.get<Schedule[]>("/schedules");
  return data.find((schedule) => schedule.collaborator_id === collaboratorId) ?? null;
}

export async function updateCollaboratorSchedule(week: WeekSlots) {
  const { data } = await api.patch<Schedule>("/schedules", week);
  return data;
}
