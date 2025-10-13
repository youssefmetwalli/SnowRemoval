import { useEffect, useState } from "react";
import { ReportGetData } from "../types/reportForm";
import { apiClient } from "../lib/apiClient";

export const useReport = () => {
  const [data, setData] = useState<ReportGetData[]>();
  const [isLoading, setLoading] = useState(true);
  const [isError, setError] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        console.log("get送信");
        const res = await apiClient.get<ReportGetData[]>(
          "table_1754551086/records/"
        );
        setData(res);
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
