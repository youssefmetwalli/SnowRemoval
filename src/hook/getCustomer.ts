import { useEffect, useState } from "react";
import { apiClient } from "../lib/apiClient";
import { CustomerData } from "../types/customer";

export const getCustomer = () => {
  const [data, setData] = useState<CustomerData[] | undefined>();
  const [isLoading, setLoading] = useState(true);
  const [isError, setError] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const res = await apiClient.get<any[]>("masters/customers");
        const transformed = res.map((v) => ({
          field_2001720017: ["", String(v.id), "", String(v.id)],
          field_2002520025: v.address ?? "",
          field_2003120031: v.phoneNumber ?? "",
          field_1754541737: v.companyName,
          field_1754547084: v.representativeName ?? "",
          field_1754547099: v.picName ?? "",
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