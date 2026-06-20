import { useEffect, useState } from "react";
import { apiClient } from "../lib/apiClient";
import { CarData } from "../types/car";

export const getCar = () => {
  const [data, setData] = useState<CarData[] | undefined>();
  const [isLoading, setLoading] = useState(true);
  const [isError, setError] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const res = await apiClient.get<any[]>("masters/vehicles");
        const transformed = res.map((v) => ({
          field_2002120021: ["", String(v.id), "", String(v.id)],
          field_2003520035: v.carName,
          field_1754972826: v.carNumber,
          field_2001820018: v.carBrand,
          field_1754977233: v.remarkName,
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