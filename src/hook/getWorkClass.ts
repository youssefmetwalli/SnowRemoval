import { useEffect, useState } from "react";
import { apiClient } from "../lib/apiClient";
import { WorkClassData } from "../types/workClass";

export const getWorkClass = () => {
  const [data, setData] = useState<WorkClassData[] | undefined>();
  const [isLoading, setLoading] = useState(true);
  const [isError, setError] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const res = await apiClient.get<any[]>("masters/work-types");
        const transformed = res.map((v) => ({
          field_2000820008: ["", String(v.id), "", String(v.id)],
          field_2001620016: v.workTypeName,
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