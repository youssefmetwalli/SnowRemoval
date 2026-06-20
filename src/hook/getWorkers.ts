import { useEffect, useState } from "react";
import { apiClient } from "../lib/apiClient";
import { WorkerData } from "../types/worker";

export const getWorker = () => {
  const [data, setData] = useState<WorkerData[] | undefined>();
  const [isLoading, setLoading] = useState(true);
  const [isError, setError] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const res = await apiClient.get<any[]>("masters/workers");
        const transformed = res.map((v) => ({
          field_1754635302: ["", String(v.id), "", String(v.id)],
          field_1754549790: v.workerName,
          field_1754550088: v.loginId ?? "",
        }));
        setData(transformed);
      } catch (err) {
        console.error(err);
        setError(true);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return { data, isLoading, isError };
};