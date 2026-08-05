import { useCallback, useEffect, useState } from "react";
import { getDashboardInfos } from "@/api/establishment/getDashboardInfos";
import {
  mapDashboardResponse,
  type DashboardData,
} from "../lib/dashboard-mapper";

type DashboardStatus = "loading" | "error" | "success";

export function useDashboardData() {
  const [status, setStatus] = useState<DashboardStatus>("loading");
  const [data, setData] = useState<DashboardData | null>(null);

  const fetchData = useCallback(async () => {
    setStatus("loading");
    try {
      // Assumindo que getDashboardInfos() já devolve o JSON puro (é o que
      // aparece no seu console.log). Se o client axios devolver o
      // AxiosResponse inteiro, troque a linha abaixo por `response.data`.
      const response = await getDashboardInfos();
      setData(mapDashboardResponse(response));
      setStatus("success");
    } catch (err) {
      console.error("Erro ao carregar os dados do dashboard", err);
      setStatus("error");
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { status, data, refetch: fetchData };
}
