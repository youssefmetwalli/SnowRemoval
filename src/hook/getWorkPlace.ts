import { useEffect, useState } from "react";
import { apiClient } from "../lib/apiClient";
import { WorkPlaceData } from "../types/workPlace";

export const getWorkPlace = () => {
  const [data, setData] = useState<WorkPlaceData[] | undefined>();
  const [isLoading, setLoading] = useState(true);
  const [isError, setError] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const res = await apiClient.get<any[]>("masters/work-places");
        const transformed = res.map((v) => ({
          field_2002320023: ["", String(v.id), "", String(v.id)],
          field_2001920019: v.workPlaceName,
          field_1756792186: ["", String(v.customerId), "", String(v.customerId)],
          field_1754541737: v.customer?.companyName ?? null,
          field_2003120031: v.customer?.phoneNumber ?? null,
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